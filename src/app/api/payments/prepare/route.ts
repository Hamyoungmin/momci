import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { userId, amount, name, planType, userType } = body || {};

    if (!userId || !amount || !name || !planType || !userType) {
      return new Response('Invalid payload', { status: 400 });
    }

    // 서버에서 고유 주문번호 생성
    const merchantUid = `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // Firestore orders 생성 (pending)
    const orderRef = adminDb.collection('orders').doc(merchantUid);
    await orderRef.set({
      merchantUid,
      userId,
      amount,
      name,
      planType,
      userType,
      status: 'pending',
      createdAt: new Date(),
    });

    return Response.json({ merchantUid, amount, name });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : typeof e === 'string' ? e : 'unknown';
    return new Response(`Prepare error: ${message}`, { status: 500 });
  }
}


