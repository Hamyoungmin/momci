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

    // 1) 서버에 저장된 주문 조회
    const orderRef = adminDb.collection('orders').doc(merchant_uid);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) {
      return new Response('Order not found', { status: 404 });
    }
    const order = orderSnap.data() as { amount: number; userId: string; status: string; planType: '1month'|'3month'; userType: 'parent'|'therapist' };

    // 이미 처리된 주문이면 idempotent 처리
    if (order.status === 'paid') {
      return Response.json({ ok: true, status: 'paid' });
    }

    // 2) PortOne 서버로 결제정보 조회/검증
    const pay = await getPaymentByImpUid(imp_uid);
    if (pay.merchant_uid !== merchant_uid) {
      return new Response('Merchant mismatch', { status: 400 });
    }
    if (pay.amount !== order.amount) {
      return new Response('Amount mismatch', { status: 400 });
    }
    if (pay.status !== 'paid') {
      // 결제 미완료/실패 처리 반영
      await orderRef.update({ status: pay.status, updatedAt: new Date() });
      return new Response(`Payment not paid: ${pay.status}`, { status: 400 });
    }

    // 3) 주문 paid로 갱신 및 인터뷰권 지급 + 구독 정보 갱신
    await orderRef.update({ status: 'paid', paidAt: new Date(), updatedAt: new Date() });

    // 인터뷰권 지급 규칙
    // - 부모 전용: 1개월 첫 결제(해당 달) +2, 같은 달 추가 결제 +1
    // - 3개월 첫 결제 +6, 3개월 추가 결제는 추가지급 없음
    if (order.userType === 'parent') {
      const userRef = adminDb.collection('users').doc(order.userId);

      // 해당 달의 첫 결제 여부 판단
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

      const isFirstThisMonth = paidThisMonth.empty; // 이번 paid 이전에 없으면 첫 결제

      let grant = 0;
      if (order.planType === '1month') {
        grant = isFirstThisMonth ? 2 : 1;
      } else if (order.planType === '3month') {
        grant = isFirstThisMonth ? 6 : 0; // 90일권 추가지급 없음
      }

      if (grant > 0) {
        await adminDb.runTransaction(async (tx) => {
          const u = await tx.get(userRef);
          if (!u.exists) return;
          const current = (u.data()?.interviewTokens || 0) as number;
          tx.update(userRef, { interviewTokens: current + grant, lastTokenAdded: new Date() });
        });
      }

      // 이용권 상태 문서 업데이트
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
          customerUid: order.userId, // 최초 결제 시 customer_uid=uid 사용
          lastPaidAt: new Date(),
          nextBillingAt: new Date(Date.now() + planDays * 24 * 60 * 60 * 1000),
          expiryDate: expiry,
          lastUpdated: new Date(),
        },
        { merge: true }
      );
    }

    return Response.json({ ok: true, status: 'paid' });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : typeof e === 'string' ? e : 'unknown';
    return new Response(`Verify error: ${message}`, { status: 500 });
  }
}


