import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { chatRoomId, parentId, therapistId } = await req.json();
    if (!chatRoomId || !parentId || !therapistId) {
      return new Response('Invalid payload', { status: 400 });
    }

    const chatRef = adminDb.collection('chats').doc(chatRoomId);
    const parentRef = adminDb.collection('users').doc(parentId);

    const result = await adminDb.runTransaction(async (tx) => {
      const chatSnap = await tx.get(chatRef);
      if (!chatSnap.exists) throw new Error('Chat not found');
      const chat = chatSnap.data() as { 
        interviewTokenUsed?: boolean; 
        parentId?: string; 
        therapistId?: string; 
        status?: string;
        interviewTokenRefunded?: boolean;
      };

      console.log('🔍 채팅방 상태 확인:', {
        chatRoomId,
        status: chat.status,
        interviewTokenUsed: chat.interviewTokenUsed,
        interviewTokenRefunded: chat.interviewTokenRefunded
      });

      if (chat.parentId !== parentId || chat.therapistId !== therapistId) {
        throw new Error('Chat participants mismatch');
      }

      // 중복 차감 방지 로직 제거 - 항상 차감
      console.log('💳 중복 차감 방지 없음 - 무조건 인터뷰권 차감');

      const userSnap = await tx.get(parentRef);
      if (!userSnap.exists) throw new Error('User not found');
      const tokens = (userSnap.data()?.interviewTokens || 0) as number;
      if (tokens <= 0) {
        return { ok: false, reason: 'NO_TOKENS' } as const;
      }

      console.log('💳 인터뷰권 차감 실행:', { 현재토큰: tokens, 차감후: tokens - 1 });

      tx.update(parentRef, {
        interviewTokens: tokens - 1,
        lastTokenUsed: new Date(),
      });

      tx.update(chatRef, {
        status: 'active',
        interviewTokenUsed: true,
        firstResponseReceived: false,
        firstMessageByParentAt: new Date(),
        interviewAccessBy: 'token',
        interviewTokenRefunded: false,
      });

      return { ok: true, alreadyUsed: false } as const;
    });

    if (!result.ok && result.reason === 'NO_TOKENS') {
      return Response.json({ ok: false, error: 'NO_TOKENS' }, { status: 409 });
    }

    return Response.json({ ok: true, alreadyUsed: result.alreadyUsed });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return new Response(`Deduct error: ${msg}`, { status: 500 });
  }
}


