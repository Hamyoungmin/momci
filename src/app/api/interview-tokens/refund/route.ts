import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { chatRoomId, parentId, reason } = await req.json();
    if (!chatRoomId || !parentId) {
      return new Response('Invalid payload', { status: 400 });
    }

    const chatRef = adminDb.collection('chats').doc(chatRoomId);
    const parentRef = adminDb.collection('users').doc(parentId);

    const result = await adminDb.runTransaction(async (tx) => {
      const chatSnap = await tx.get(chatRef);
      if (!chatSnap.exists) throw new Error('Chat not found');
      const chat = chatSnap.data() as { firstResponseReceived?: boolean; interviewTokenUsed?: boolean };

      // 첫 응답이 있으면 환불 불가
      if (chat.firstResponseReceived) {
        return { ok: false, reason: 'RESPONDED' } as const;
      }

      // 토큰을 사용하지 않았으면 복구 불필요
      if (!chat.interviewTokenUsed) {
        tx.update(chatRef, { status: 'closed', interviewTokenRefunded: false, cancelledAt: new Date() });
        return { ok: true, refunded: false } as const;
      }

      const userSnap = await tx.get(parentRef);
      if (!userSnap.exists) throw new Error('User not found');
      const tokens = (userSnap.data()?.interviewTokens || 0) as number;

      tx.update(parentRef, {
        interviewTokens: tokens + 1,
        lastTokenRefunded: new Date(),
      });

      tx.update(chatRef, {
        status: 'closed',
        interviewTokenRefunded: true,
        cancelledAt: new Date(),
        refundReason: reason || '치료사 미응답',
      });

      return { ok: true, refunded: true } as const;
    });

    if (!result.ok && result.reason === 'RESPONDED') {
      return Response.json({ ok: false, error: 'RESPONDED' }, { status: 409 });
    }

    return Response.json({ ok: true, refunded: result.refunded === true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return new Response(`Refund error: ${msg}`, { status: 500 });
  }
}


