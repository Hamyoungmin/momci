import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, query, where, getDocs, orderBy, onSnapshot, Unsubscribe, Timestamp, FieldValue } from 'firebase/firestore';
import { db } from './firebase';
import { handleFirstResponse } from './interviewTokens';
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
    // 기존 채팅방이 있는지 확인
    const chatsQuery = query(
      collection(db, 'chats'),
      where('parentId', '==', parentId),
      where('therapistId', '==', therapistId)
    );
    
    const existingChats = await getDocs(chatsQuery);
    
    if (!existingChats.empty) {
      // 기존 채팅방이 있으면 해당 ID 반환
      const existingChat = existingChats.docs[0];
      console.log('✅ 기존 채팅방 찾음:', existingChat.id);
      return existingChat.id;
    }

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
    const chatRoomRef = await addDoc(collection(db, 'chats'), chatRoomData);
    
    console.log('✅ 채팅방 생성 완료:', chatRoomRef.id);
    return chatRoomRef.id;
    
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

    // 3. 치료사의 첫 응답인 경우 인터뷰권 차감 처리 및 알림 발송
    if (senderType === 'therapist') {
      console.log('👨‍⚕️ 치료사 메시지 감지 - 첫 응답 확인 중...');
      
      // 채팅방 정보 가져오기
      const chatRoomDoc = await getDoc(doc(db, 'chats', chatRoomId));
      if (chatRoomDoc.exists()) {
        const chatData = chatRoomDoc.data() as ChatRoomInfo;
        
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
    } else if (senderType === 'parent') {
      // 4. 학부모 메시지인 경우 치료사에게 알림
      const chatRoomDoc = await getDoc(doc(db, 'chats', chatRoomId));
      if (chatRoomDoc.exists()) {
        const chatData = chatRoomDoc.data() as ChatRoomInfo;
        
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
