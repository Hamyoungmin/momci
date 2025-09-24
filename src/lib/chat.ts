import { collection, addDoc, setDoc, doc, getDoc, updateDoc, serverTimestamp, query, where, orderBy, onSnapshot, Unsubscribe, Timestamp, FieldValue } from 'firebase/firestore';
import { db } from './firebase';
import { handleFirstResponse, deductInterviewToken } from './interviewTokens';
import { notifyFirstResponse, notifyNewMessage } from './notifications';

// 채팅 메시지 타입
export interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  senderType: 'parent' | 'therapist';
  message: string;
  timestamp: Timestamp | Date | FieldValue | null;
  isRead: boolean;
}

// 채팅방 정보 타입
export interface ChatRoomInfo {
  id: string;
  parentId: string;
  therapistId: string;
  parentName: string;
  therapistName: string;
  lastMessage: string;
  lastMessageTime: Timestamp | Date | FieldValue | null;
  createdAt: Timestamp | Date | FieldValue | null;
  status: 'active' | 'closed';
  interviewTokenUsed: boolean;
  firstResponseReceived: boolean;
  participants: string[];
}

// 채팅방 생성 또는 기존 채팅방 찾기
export async function createOrGetChatRoom(
  parentId: string,
  therapistId: string,
  parentName: string,
  therapistName: string
): Promise<string> {
  try {
    // 인덱스 없이 확정적으로 찾기 위해 결정적(docId) 키 사용
    // 두 사용자 ID를 정렬하여 항상 같은 chatId를 생성
    const chatId = [parentId, therapistId].sort().join('_');

    const chatDocRef = doc(db, 'chats', chatId);

    // 새 채팅방 생성
    const chatRoomData: Omit<ChatRoomInfo, 'id'> = {
      parentId,
      therapistId,
      parentName,
      therapistName,
      lastMessage: '',
      lastMessageTime: serverTimestamp(),
      createdAt: serverTimestamp(),
      status: 'active',
      interviewTokenUsed: false, // 인터뷰권 사용 여부
      firstResponseReceived: false, // 첫 응답 받았는지 여부
      participants: [parentId, therapistId]
    };

    console.log('🔥 새 채팅방 생성 중...', chatRoomData);
    try {
      // 최초 생성 시도 (필수 필드 모두 포함)
      await setDoc(chatDocRef, chatRoomData, { merge: false });
      console.log('✅ 채팅방 생성 완료:', chatDocRef.id);
      return chatDocRef.id;
    } catch (e) {
      // 이미 존재하거나 업데이트 제약으로 실패한 경우: 업데이트 허용 필드만 병합
      console.warn('ℹ️ 채팅방 생성 실패 → 업데이트로 재시도:', e);
      await setDoc(
        chatDocRef,
        {
          // participants/createdAt은 업데이트 규칙상 변경 금지 → 제외
          lastMessage: '',
          lastMessageTime: serverTimestamp(),
          status: 'active'
        },
        { merge: true }
      );
      console.log('✅ 기존 채팅방 업데이트/연결 완료:', chatDocRef.id);
      return chatDocRef.id;
    }
    
  } catch (error) {
    console.error('❌ 채팅방 생성/조회 실패:', error);
    throw new Error('채팅방을 생성할 수 없습니다.');
  }
}

// 사용자 정보 가져오기
export async function getUserInfo(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return {
        name: userDoc.data().name || '익명',
        userType: userDoc.data().userType || 'parent'
      };
    }
    throw new Error('사용자 정보를 찾을 수 없습니다.');
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    throw error;
  }
}

// 메시지 전송
export async function sendMessage(
  chatRoomId: string,
  senderId: string,
  senderName: string,
  senderType: 'parent' | 'therapist',
  message: string
): Promise<void> {
  try {
    console.log('📤 메시지 전송 중:', { chatRoomId, senderId, senderType, message });

    // 1. 메시지 데이터 생성
    const messageData: Omit<ChatMessage, 'id'> = {
      senderId,
      senderName,
      senderType,
      message: message.trim(),
      timestamp: serverTimestamp(),
      isRead: false
    };

    // 2. messages 서브컬렉션에 메시지 추가
    await addDoc(collection(db, 'chats', chatRoomId, 'messages'), messageData);

    // 3-A. 치료사의 첫 응답인 경우 (이미 학부모 쪽에서 차감되었을 수 있으므로 중복 방지)
    if (senderType === 'therapist') {
      console.log('👨‍⚕️ 치료사 메시지 감지 - 첫 응답 확인 중...');
      
      // 채팅방 정보 가져오기
      const chatRoomDoc = await getDoc(doc(db, 'chats', chatRoomId));
      if (chatRoomDoc.exists()) {
        const chatData = chatRoomDoc.data() as ChatRoomInfo;
        // 이미 학부모 첫 메시지로 인터뷰권이 사용되었으면 스킵
        if (!chatData.interviewTokenUsed) {
          // 첫 응답 처리 (인터뷰권 차감 포함)
          const result = await handleFirstResponse(
            chatRoomId,
            senderId,
            chatData.parentId
          );
          
          if (result.tokenDeducted) {
            console.log('💳 인터뷰권 차감 완료 - 치료사 첫 응답');
            
            // 🔔 첫 응답 알림 발송 (학부모에게)
            try {
              await notifyFirstResponse(
                chatData.parentName,
                senderName,
                chatRoomId,
                message.trim()
              );
            } catch (notifyError) {
              console.error('❌ 첫 응답 알림 발송 실패:', notifyError);
            }
          } else if (!result.success) {
            console.error('❌ 첫 응답 처리 실패');
          }
        }
      }
    } else if (senderType === 'parent') {
      // 3-B. 학부모의 첫 메시지인 경우: 무료 인터뷰(구독) 우선 소진, 없으면 토큰 차감
      const chatRoomDoc = await getDoc(doc(db, 'chats', chatRoomId));
      if (chatRoomDoc.exists()) {
        const chatData = chatRoomDoc.data() as ChatRoomInfo;
        // 인터뷰권이 아직 사용되지 않았다면 학부모 쪽에서 차감
        if (!chatData.interviewTokenUsed) {
          try {
            // 구독 활성 여부 + 남은 무료 인터뷰 확인
            const subRef = doc(db, 'user-subscription-status', chatData.parentId);
            const subDoc = await getDoc(subRef);
            let hasActiveSubscription = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let remainingFreeInterviews = 0 as any;
            if (subDoc.exists()) {
              const data = subDoc.data() as { hasActiveSubscription?: boolean; expiryDate?: Timestamp | { toDate?: () => Date } | null };
              const nowTs = Date.now();
              const expiryMs = data?.expiryDate && typeof data.expiryDate.toDate === 'function' ? data.expiryDate.toDate().getTime() : 0;
              hasActiveSubscription = !!data?.hasActiveSubscription && expiryMs > nowTs;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              remainingFreeInterviews = (subDoc.data() as any)?.remainingInterviews ?? 0;
            }

            if (hasActiveSubscription && remainingFreeInterviews > 0) {
              // 무료 인터뷰 1회 소진 (UI 카운터 동기화)
              try {
                await updateDoc(subRef, {
                  remainingInterviews: remainingFreeInterviews - 1,
                  lastUpdated: serverTimestamp(),
                } as unknown as Partial<{ remainingInterviews: number }>);
              } catch (e) {
                console.warn('remainingInterviews 감소 실패:', e);
              }

              await updateDoc(doc(db, 'chats', chatRoomId), {
                interviewTokenUsed: true,
                firstResponseReceived: false,
                firstMessageByParentAt: serverTimestamp(),
                interviewAccessBy: 'subscription'
              });
              console.log('🟦 구독 활성+무료 인터뷰 소진: 토큰 차감 없이 채팅 시작');
            } else {
              const deducted = await deductInterviewToken(
                chatData.parentId,
                chatRoomId,
                chatData.therapistId,
                chatData.therapistName
              );
              if (deducted) {
                await updateDoc(doc(db, 'chats', chatRoomId), {
                  interviewTokenUsed: true,
                  firstResponseReceived: false,
                  firstMessageByParentAt: serverTimestamp(),
                  interviewAccessBy: 'token'
                });
                console.log('💳 인터뷰권 차감 완료 - 학부모 첫 메시지');
              } else {
                console.warn('⚠️ 인터뷰권 차감 실패 또는 잔액 부족');
              }
            }
          } catch (tokenError) {
            console.error('❌ 인터뷰권 차감 중 오류:', tokenError);
          }
        }

        // 🔔 새 메시지 알림 발송 (치료사에게)
        try {
          await notifyNewMessage(
            chatData.therapistName,
            senderName,
            'parent',
            chatRoomId,
            message.trim()
          );
        } catch (notifyError) {
          console.error('❌ 메시지 알림 발송 실패:', notifyError);
        }
      }
    }

    // 4. 채팅방의 lastMessage 업데이트
    await updateDoc(doc(db, 'chats', chatRoomId), {
      lastMessage: message.trim(),
      lastMessageTime: serverTimestamp()
    });

    console.log('✅ 메시지 전송 완료');
  } catch (error) {
    console.error('❌ 메시지 전송 실패:', error);
    throw new Error('메시지 전송에 실패했습니다.');
  }
}

// 실시간 메시지 리스너 설정
export function subscribeToMessages(
  chatRoomId: string,
  callback: (messages: ChatMessage[]) => void
): Unsubscribe {
  console.log('🔥 실시간 메시지 리스너 설정:', chatRoomId);

  const messagesQuery = query(
    collection(db, 'chats', chatRoomId, 'messages'),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages: ChatMessage[] = [];
    
    snapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as ChatMessage);
    });

    console.log('📥 실시간 메시지 업데이트:', messages.length, '개');
    callback(messages);
  }, (error) => {
    console.error('❌ 실시간 메시지 리스너 오류:', error);
  });
}

// 채팅방 정보 조회
export async function getChatRoomInfo(chatRoomId: string): Promise<ChatRoomInfo | null> {
  try {
    const chatRoomDoc = await getDoc(doc(db, 'chats', chatRoomId));
    
    if (chatRoomDoc.exists()) {
      return {
        id: chatRoomDoc.id,
        ...chatRoomDoc.data()
      } as ChatRoomInfo;
    }
    
    return null;
  } catch (error) {
    console.error('❌ 채팅방 정보 조회 실패:', error);
    return null;
  }
}

// 채팅방 상태 업데이트
export async function updateChatRoomStatus(
  chatRoomId: string,
  updates: Partial<Pick<ChatRoomInfo, 'status' | 'interviewTokenUsed' | 'firstResponseReceived'>>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'chats', chatRoomId), updates);
    console.log('✅ 채팅방 상태 업데이트 완료:', updates);
  } catch (error) {
    console.error('❌ 채팅방 상태 업데이트 실패:', error);
    throw error;
  }
}

// 사용자의 채팅방 목록 조회
export function subscribeToUserChatRooms(
  userId: string,
  callback: (chatRooms: ChatRoomInfo[]) => void
): Unsubscribe {
  console.log('🔥 사용자 채팅방 목록 리스너 설정:', userId);

  const chatsQuery = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  );

  return onSnapshot(chatsQuery, (snapshot) => {
    const chatRooms: ChatRoomInfo[] = [];
    
    snapshot.forEach((doc) => {
      chatRooms.push({
        id: doc.id,
        ...doc.data()
      } as ChatRoomInfo);
    });

    console.log('📥 채팅방 목록 업데이트:', chatRooms.length, '개');
    callback(chatRooms);
  }, (error) => {
    console.error('❌ 채팅방 목록 리스너 오류:', error);
  });
}

// 채팅 시작 (학부모 → 치료사)
export async function startChatWithTherapist(
  currentUserId: string,
  currentUserName: string,
  therapistId: string,
  therapistName: string
): Promise<string> {
  try {
    console.log('💬 채팅 시작:', {
      currentUserId,
      currentUserName,
      therapistId,
      therapistName
    });

    // 채팅방 생성 또는 기존 채팅방 찾기
    const chatRoomId = await createOrGetChatRoom(
      currentUserId, // 학부모 ID
      therapistId,    // 치료사 ID
      currentUserName, // 학부모 이름
      therapistName   // 치료사 이름
    );

    console.log('✅ 채팅 시작 완료:', chatRoomId);
    return chatRoomId;
  } catch (error) {
    console.error('❌ 채팅 시작 실패:', error);
    throw error;
  }
}
