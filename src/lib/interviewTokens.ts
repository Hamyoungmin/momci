// 인터뷰권 관리 시스템
// 학부모의 인터뷰권 차감/복구를 관리합니다

import { doc, getDoc, updateDoc, increment, runTransaction, Timestamp, FieldValue } from 'firebase/firestore';
import { db } from './firebase';

// 인터뷰권 관련 타입
export interface InterviewTokenInfo {
  userId: string;
  tokens: number;
  usedTokens: number;
  lastUpdated: Timestamp | Date | FieldValue | null;
}

// 인터뷰권 사용 내역 타입
export interface TokenUsageRecord {
  id: string;
  userId: string;
  chatRoomId: string;
  therapistId: string;
  therapistName: string;
  action: 'used' | 'refunded';
  amount: number;
  reason: string;
  createdAt: Timestamp | Date | FieldValue | null;
}

/**
 * 사용자의 인터뷰권 정보 조회
 */
export async function getUserInterviewTokens(userId: string): Promise<number> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.interviewTokens || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('❌ 인터뷰권 정보 조회 실패:', error);
    return 0;
  }
}

/**
 * 인터뷰권 차감 (치료사가 첫 응답할 때)
 */
export async function deductInterviewToken(
  userId: string,
  chatRoomId: string,
  therapistId: string,
  therapistName: string
): Promise<boolean> {
  try {
    console.log('💳 인터뷰권 차감 시도:', {
      userId,
      chatRoomId,
      therapistId,
      therapistName
    });

    const result = await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('사용자 정보를 찾을 수 없습니다');
      }
      
      const userData = userDoc.data();
      const currentTokens = userData.interviewTokens || 0;
      
      if (currentTokens <= 0) {
        console.log('❌ 인터뷰권 부족:', currentTokens);
        return false;
      }
      
      // 인터뷰권 1개 차감
      transaction.update(userRef, {
        interviewTokens: currentTokens - 1,
        lastTokenUsed: new Date()
      });
      
      // 사용 내역 기록 (선택사항 - 필요시 구현)
      // const usageRef = doc(collection(db, 'tokenUsage'));
      // transaction.set(usageRef, {
      //   userId,
      //   chatRoomId,
      //   therapistId,
      //   therapistName,
      //   action: 'used',
      //   amount: 1,
      //   reason: '치료사 첫 응답',
      //   createdAt: serverTimestamp()
      // });
      
      console.log('✅ 인터뷰권 차감 완료:', currentTokens - 1);
      return true;
    });
    
    return result;
  } catch (error) {
    console.error('❌ 인터뷰권 차감 실패:', error);
    return false;
  }
}

/**
 * 인터뷰권 복구 (치료사가 응답하지 않아 채팅이 취소될 때)
 */
export async function refundInterviewToken(
  userId: string,
  chatRoomId: string,
  reason: string = '치료사 미응답'
): Promise<boolean> {
  try {
    console.log('🔄 인터뷰권 복구 시도:', {
      userId,
      chatRoomId,
      reason
    });

    const result = await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('사용자 정보를 찾을 수 없습니다');
      }
      
      const userData = userDoc.data();
      const currentTokens = userData.interviewTokens || 0;
      
      // 인터뷰권 1개 복구
      transaction.update(userRef, {
        interviewTokens: currentTokens + 1,
        lastTokenRefunded: new Date()
      });
      
      // 복구 내역 기록 (선택사항)
      // const usageRef = doc(collection(db, 'tokenUsage'));
      // transaction.set(usageRef, {
      //   userId,
      //   chatRoomId,
      //   action: 'refunded',
      //   amount: 1,
      //   reason,
      //   createdAt: serverTimestamp()
      // });
      
      console.log('✅ 인터뷰권 복구 완료:', currentTokens + 1);
      return true;
    });
    
    return result;
  } catch (error) {
    console.error('❌ 인터뷰권 복구 실패:', error);
    return false;
  }
}

/**
 * 인터뷰권 추가 (관리자용 또는 구매용)
 */
export async function addInterviewTokens(
  userId: string,
  amount: number,
  reason: string = '인터뷰권 구매'
): Promise<boolean> {
  try {
    console.log('💰 인터뷰권 추가:', { userId, amount, reason });

    await updateDoc(doc(db, 'users', userId), {
      interviewTokens: increment(amount),
      lastTokenAdded: new Date()
    });

    console.log('✅ 인터뷰권 추가 완료');
    return true;
  } catch (error) {
    console.error('❌ 인터뷰권 추가 실패:', error);
    return false;
  }
}

/**
 * 첫 응답 여부 확인
 */
export async function checkFirstResponse(
  chatRoomId: string
): Promise<boolean> {
  try {
    // 채팅방 정보에서 firstResponseReceived 확인
    const chatRoomDoc = await getDoc(doc(db, 'chats', chatRoomId));
    
    if (chatRoomDoc.exists()) {
      const chatData = chatRoomDoc.data();
      return chatData.firstResponseReceived || false;
    }
    
    return false;
  } catch (error) {
    console.error('❌ 첫 응답 여부 확인 실패:', error);
    return false;
  }
}

/**
 * 첫 응답 처리 (치료사가 첫 메시지를 보낼 때 호출)
 */
export async function handleFirstResponse(
  chatRoomId: string,
  therapistId: string,
  parentId: string
): Promise<{ success: boolean; tokenDeducted: boolean }> {
  try {
    console.log('🎯 첫 응답 처리 시작:', {
      chatRoomId,
      therapistId,
      parentId
    });

    // 이미 첫 응답이 있었는지 확인
    const alreadyResponded = await checkFirstResponse(chatRoomId);
    
    if (alreadyResponded) {
      console.log('ℹ️ 이미 첫 응답 처리됨');
      return { success: true, tokenDeducted: false };
    }

    const result = await runTransaction(db, async (transaction) => {
      const chatRoomRef = doc(db, 'chats', chatRoomId);
      const chatRoomDoc = await transaction.get(chatRoomRef);
      
      if (!chatRoomDoc.exists()) {
        throw new Error('채팅방을 찾을 수 없습니다');
      }
      
      const chatData = chatRoomDoc.data();
      
      // 이미 처리되었으면 스킵
      if (chatData.firstResponseReceived) {
        return { success: true, tokenDeducted: false };
      }
      
      // 채팅방 상태 업데이트
      transaction.update(chatRoomRef, {
        firstResponseReceived: true,
        interviewTokenUsed: true,
        firstResponseAt: new Date()
      });
      
      return { success: true, tokenDeducted: true };
    });

    // 트랜잭션이 성공하고 토큰 차감이 필요한 경우
    if (result.tokenDeducted) {
      // 별도로 인터뷰권 차감 (치료사 정보 가져오기)
      const therapistDoc = await getDoc(doc(db, 'users', therapistId));
      const therapistName = therapistDoc.exists() ? therapistDoc.data().name || '치료사' : '치료사';
      
      const tokenDeducted = await deductInterviewToken(
        parentId,
        chatRoomId,
        therapistId,
        therapistName
      );
      
      return { success: true, tokenDeducted };
    }
    
    return result;
  } catch (error) {
    console.error('❌ 첫 응답 처리 실패:', error);
    return { success: false, tokenDeducted: false };
  }
}

/**
 * 채팅 취소 시 인터뷰권 복구 처리
 */
export async function handleChatCancellation(
  chatRoomId: string,
  parentId: string,
  reason: string = '채팅 취소'
): Promise<boolean> {
  try {
    console.log('🔄 채팅 취소 처리:', {
      chatRoomId,
      parentId,
      reason
    });

    const chatRoomDoc = await getDoc(doc(db, 'chats', chatRoomId));
    
    if (!chatRoomDoc.exists()) {
      console.log('❌ 채팅방을 찾을 수 없음');
      return false;
    }
    
    const chatData = chatRoomDoc.data();
    
    // 첫 응답이 없었고, 인터뷰권이 사용되지 않았으면 복구할 필요 없음
    if (!chatData.firstResponseReceived && !chatData.interviewTokenUsed) {
      console.log('ℹ️ 인터뷰권 복구 불필요 (첫 응답 없음)');
      return true;
    }
    
    // 첫 응답이 있었으면 복구하지 않음 (정상적인 차감)
    if (chatData.firstResponseReceived) {
      console.log('ℹ️ 인터뷰권 복구 불가 (이미 첫 응답 완료)');
      return false;
    }
    
    // 복구 처리
    const refunded = await refundInterviewToken(parentId, chatRoomId, reason);
    
    if (refunded) {
      // 채팅방 상태 업데이트
      await updateDoc(doc(db, 'chats', chatRoomId), {
        status: 'closed',
        interviewTokenRefunded: true,
        cancelledAt: new Date()
      });
    }
    
    return refunded;
  } catch (error) {
    console.error('❌ 채팅 취소 처리 실패:', error);
    return false;
  }
}
