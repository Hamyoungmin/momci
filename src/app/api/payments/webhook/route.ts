import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { getPaymentByImpUid } from '@/lib/portone';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { imp_uid, merchant_uid } = await req.json();
    if (!imp_uid || !merchant_uid) {
      return new Response('Invalid payload', { status: 400 });
    }

    const orderRef = adminDb.collection('orders').doc(merchant_uid);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) {
      return new Response('Order not found', { status: 404 });
    }
    const order = orderSnap.data() as { amount: number; userId: string; status: string; planType: '1month'|'3month'; userType: 'parent'|'therapist' };

    // PortOne 재검증
    const pay = await getPaymentByImpUid(imp_uid);
    if (pay.merchant_uid !== merchant_uid) {
      return new Response('Merchant mismatch', { status: 400 });
    }

    // 상태 동기화
    if (pay.status === 'paid') {
      if (order.status !== 'paid') {
        await orderRef.update({ status: 'paid', paidAt: new Date(), updatedAt: new Date() });
        // 토큰 지급 규칙(verify와 동일), 중복 지급 방지 위해 이전 상태가 paid가 아니었을 때만 실행
        if (order.userType === 'parent') {
          const userRef = adminDb.collection('users').doc(order.userId);
          const now = new Date();
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          const paidThisMonth = await adminDb
            .collection('orders')
            .where('userId', '==', order.userId)
            .where('status', '==', 'paid')
            .where('paidAt', '>=', monthStart)
            .where('paidAt', '<', nextMonthStart)
            .limit(1)
            .get();
          const isFirstThisMonth = paidThisMonth.empty;

          let grant = 0;
          if (order.planType === '1month') grant = isFirstThisMonth ? 2 : 1;
          if (order.planType === '3month') grant = isFirstThisMonth ? 6 : 0;

          if (grant > 0) {
            await adminDb.runTransaction(async (tx) => {
              const u = await tx.get(userRef);
              if (!u.exists) return;
              const current = (u.data()?.interviewTokens || 0) as number;
              tx.update(userRef, { interviewTokens: current + grant, lastTokenAdded: new Date() });
            });
          }

          const subRef = adminDb.collection('user-subscription-status').doc(order.userId);
          const planDays = order.planType === '3month' ? 90 : 30;
          const expiry = new Date(Date.now() + planDays * 24 * 60 * 60 * 1000);
          await subRef.set(
            {
              userId: order.userId,
              hasActiveSubscription: true,
              subscriptionType: 'parent',
              planName: order.planType === '3month' ? '3개월 이용권' : '1개월 이용권',
              planType: order.planType,
              planDays,
              customerUid: order.userId,
              lastPaidAt: new Date(),
              nextBillingAt: new Date(Date.now() + planDays * 24 * 60 * 60 * 1000),
              expiryDate: expiry,
              lastUpdated: new Date(),
            },
            { merge: true }
          );
        }
      }
    } else {
      await orderRef.update({ status: pay.status, updatedAt: new Date() });
    }

    return Response.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : typeof e === 'string' ? e : 'unknown';
    return new Response(`Webhook error: ${message}`, { status: 500 });
  }
}


