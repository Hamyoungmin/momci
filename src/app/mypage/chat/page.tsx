'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Timestamp;
  status: string;
  otherParticipantName?: string;
  otherParticipantType?: string;
  postTitle?: string;
}

export default function ChatPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/auth/login');
    }
  }, [currentUser, loading, router]);

  // 진행중인 채팅 가져오기
  useEffect(() => {
    if (!currentUser) return;

    console.log('💬 채팅 목록 가져오기 시작 - 사용자:', currentUser.uid);
    setChatsLoading(true);

    // chats 컬렉션에서 내가 참여한 채팅방 찾기
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
      const chatRooms: ChatRoom[] = [];
      
      for (const chatDoc of snapshot.docs) {
        const chatData = chatDoc.data();
        const otherParticipantId = chatData.participants.find((id: string) => id !== currentUser.uid);
        
        // 상대방 정보 가져오기
        let otherParticipantName = '알 수 없음';
        let otherParticipantType = 'unknown';
        
        if (otherParticipantId) {
          try {
            const userDocRef = doc(db, 'users', otherParticipantId);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              otherParticipantName = userData.name || '이름 없음';
              otherParticipantType = userData.userType || 'unknown';
            }
          } catch (error) {
            console.error('상대방 정보 조회 오류:', error);
          }
        }

        chatRooms.push({
          id: chatDoc.id,
          participants: chatData.participants || [],
          lastMessage: chatData.lastMessage || '메시지가 없습니다',
          lastMessageTime: chatData.lastMessageTime || Timestamp.fromDate(new Date()),
          status: chatData.status || 'active',
          otherParticipantName,
          otherParticipantType,
          postTitle: chatData.postTitle || ''
        });
      }

      // 클라이언트에서 정렬 (lastMessageTime 기준)
      chatRooms.sort((a, b) => {
        const timeA = a.lastMessageTime.toDate();
        const timeB = b.lastMessageTime.toDate();
        return timeB.getTime() - timeA.getTime();
      });

      console.log('✅ 채팅 목록 조회 완료:', chatRooms.length, '개');
      setChats(chatRooms);
      setChatsLoading(false);
    }, (error) => {
      console.error('❌ 채팅 목록 조회 오류:', error);
      setChats([]);
      setChatsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 채팅방 입장
  const handleEnterChat = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  // 시간 포맷팅
  const formatTime = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate();
      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return date.toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
      } else if (diffDays === 1) {
        return '어제';
      } else if (diffDays < 7) {
        return `${diffDays}일 전`;
      } else {
        return date.toLocaleDateString('ko-KR', {
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (error) {
      console.error('시간 포맷팅 오류:', error);
      return '';
    }
  };

  if (loading || chatsLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">진행중인 채팅</h1>
          </div>
          <div className="text-sm text-gray-500">
            총 {chats.length}개의 채팅
          </div>
        </div>

        {/* 채팅 목록 */}
        {chats.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl text-gray-300 mb-4">💬</div>
            <div className="text-lg font-medium text-gray-500 mb-2">진행중인 채팅이 없습니다</div>
            <div className="text-sm text-gray-400 mb-6">치료사님께 1:1 문의를 하면 채팅을 시작할 수 있어요!</div>
            <button 
              onClick={() => router.push('/browse')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              선생님 둘러보기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => handleEnterChat(chat.id)}
                className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* 프로필 이미지 */}
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">
                      {chat.otherParticipantName?.charAt(0) || '?'}
                    </span>
                  </div>
                  
                  {/* 채팅 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {chat.otherParticipantName}
                        </h3>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          chat.otherParticipantType === 'therapist' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {chat.otherParticipantType === 'therapist' ? '치료사' : '학부모'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    </div>
                    
                    {/* 마지막 메시지 */}
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                    
                    {/* 게시글 제목 (있는 경우) */}
                    {chat.postTitle && (
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        관련 게시글: {chat.postTitle}
                      </div>
                    )}
                  </div>

                  {/* 화살표 아이콘 */}
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
