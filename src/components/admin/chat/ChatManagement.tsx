'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp, limit as firestoreLimit, getDocs, doc, getDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ChatStatusCards from './ChatStatusCards';
import ChatRoomList from './ChatRoomList';
import ChatDetailModal from './ChatDetailModal';
import SuspiciousActivityAlert from './SuspiciousActivityAlert';

interface ChatRoom {
  id: string;
  matchingId: string;
  parentId: string;
  parentName: string;
  teacherId: string;
  teacherName: string;
  startDate: string;
  lastMessageDate: string;
  messageCount: number;
  status: 'active' | 'ended' | 'suspended';
  suspiciousActivity: boolean;
  directTradeDetected: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  lastMessage?: {
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
  };
}

export default function ChatManagement() {
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [isChatDetailModalOpen, setIsChatDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase에서 실시간으로 채팅방 데이터 가져오기
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, orderBy('lastMessageTime', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const chatRoomsData: ChatRoom[] = [];
        
        for (const doc of snapshot.docs) {
          const data = doc.data();
          
          // Timestamp를 문자열로 변환
          const createdAt = data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toISOString() 
            : data.createdAt;
          
          const lastMessageTime = data.lastMessageTime instanceof Timestamp 
            ? data.lastMessageTime.toDate().toISOString() 
            : data.lastMessageTime || createdAt;

          // 채팅방의 메시지 개수 가져오기
          let messageCount = 0;
          try {
            const messagesRef = collection(db, 'chats', doc.id, 'messages');
            const messagesSnapshot = await getDocs(messagesRef);
            messageCount = messagesSnapshot.size;
          } catch (error) {
            console.error('메시지 개수 가져오기 오류:', error);
          }

          // 마지막 메시지 가져오기
          let lastMessage: ChatRoom['lastMessage'] | undefined;
          try {
            const messagesRef = collection(db, 'chats', doc.id, 'messages');
            const lastMessageQuery = query(messagesRef, orderBy('timestamp', 'desc'), firestoreLimit(1));
            const lastMessageSnapshot = await getDocs(lastMessageQuery);
            
            if (!lastMessageSnapshot.empty) {
              const lastMessageDoc = lastMessageSnapshot.docs[0];
              const lastMessageData = lastMessageDoc.data();
              
              const lastMessageTimestamp = lastMessageData.timestamp instanceof Timestamp
                ? lastMessageData.timestamp.toDate().toISOString()
                : lastMessageData.timestamp;
              
              lastMessage = {
                senderId: lastMessageData.senderId || '',
                senderName: lastMessageData.senderName || '알 수 없음',
                content: lastMessageData.message || '',
                timestamp: lastMessageTimestamp,
              };
            }
          } catch (error) {
            console.error('마지막 메시지 가져오기 오류:', error);
          }

          // 의심스러운 활동 감지 (전화번호, 계좌번호 패턴 등)
          const suspiciousPatterns = [
            /\d{3}-?\d{3,4}-?\d{4}/, // 전화번호
            /010|011|016|017|018|019/, // 전화번호 키워드
            /계좌|입금|송금|이체/, // 금융 키워드
            /직거래|외부|카톡|카카오톡|라인|텔레그램/i, // 직거래 키워드
          ];
          
          const lastMessageContent = lastMessage?.content || '';
          const suspiciousActivity = suspiciousPatterns.some(pattern => 
            pattern.test(lastMessageContent)
          );
          
          const directTradeDetected = /직거래|외부|카톡|전화|번호|계좌/i.test(lastMessageContent);
          
          // 위험도 계산
          let riskLevel: 'low' | 'medium' | 'high' = 'low';
          if (directTradeDetected) {
            riskLevel = 'high';
          } else if (suspiciousActivity) {
            riskLevel = 'medium';
          }
          
          chatRoomsData.push({
            id: doc.id,
            matchingId: data.matchingId || 'N/A',
            parentId: data.parentId || '',
            parentName: data.parentName || '알 수 없음',
            teacherId: data.therapistId || data.teacherId || '',
            teacherName: data.therapistName || data.teacherName || '알 수 없음',
            startDate: createdAt,
            lastMessageDate: lastMessageTime,
            messageCount,
            status: data.status === 'suspended' ? 'suspended' : 
                    data.status === 'ended' ? 'ended' : 'active',
            suspiciousActivity,
            directTradeDetected,
            riskLevel,
            lastMessage,
          });
        }
        
        setChatRooms(chatRoomsData);
        setLoading(false);
      },
      (error) => {
        console.error('채팅방 데이터 가져오기 오류:', error);
        setLoading(false);
      }
    );

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  const handleChatRoomSelect = (chatRoom: ChatRoom) => {
    setSelectedChatRoom(chatRoom);
    setIsChatDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsChatDetailModalOpen(false);
    setSelectedChatRoom(null);
  };

  const handleChatAction = async (chatRoomId: string, action: 'suspend' | 'resume' | 'end' | 'complete', reason?: string) => {
    console.log('Chat action:', { chatRoomId, action, reason });
    
    if (action === 'complete') {
      console.log('🔥🔥🔥 매칭완료 시작!!! chatRoomId:', chatRoomId);
      try {
        // 1. 채팅방 데이터 가져오기
        const chatRef = doc(db, 'chats', chatRoomId);
        const chatSnap = await getDoc(chatRef);
        
        if (!chatSnap.exists()) {
          alert('❌ 채팅방을 찾을 수 없습니다.');
          return;
        }
        
        const chatData = chatSnap.data();
        const parentId = chatData.parentId;
        const therapistId = chatData.therapistId;
        
        console.log('👤 학부모 ID:', parentId, '치료사 ID:', therapistId);
        
        // 2. 채팅방 상태 업데이트
        await updateDoc(chatRef, {
          matchingCompleted: true,
          completedAt: new Date(),
          status: 'completed'
        });
        console.log('✅ 채팅방 completed로 변경 완료');
        
        // 3. 학부모 게시글 completed로 변경
        const postsRef = collection(db, 'posts');
        const postsSnap = await getDocs(query(postsRef, where('authorId', '==', parentId)));
        
        for (const postDoc of postsSnap.docs) {
          const postData = postDoc.data();
          if (postData.status === 'meeting') {
            await updateDoc(doc(db, 'posts', postDoc.id), {
              status: 'completed',
              completedAt: new Date()
            });
            console.log(`✅ 게시글 ${postDoc.id} → completed`);
          }
        }
        
        // 4. matchings 컬렉션 업데이트 (관리자 페이지 연동)
        const matchingsRef = collection(db, 'matchings');
        const matchingsSnap = await getDocs(
          query(matchingsRef, where('parentId', '==', parentId))
        );
        
        let matchingFound = false;
        for (const matchDoc of matchingsSnap.docs) {
          const matchData = matchDoc.data();
          if (matchData.therapistId === therapistId && matchData.status !== 'completed') {
            await updateDoc(doc(db, 'matchings', matchDoc.id), {
              status: 'completed',
              updatedAt: new Date()
            });
            matchingFound = true;
            console.log(`✅ matchings ${matchDoc.id} → completed`);
          }
        }
        
        // matchings가 없으면 새로 생성
        if (!matchingFound) {
          const { addDoc, serverTimestamp } = await import('firebase/firestore');
          await addDoc(matchingsRef, {
            parentId: parentId,
            therapistId: therapistId,
            status: 'completed',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          console.log('✅ matchings 새로 생성 → completed');
        }
        
        // 5. successful-matches 기록
        const { setDoc } = await import('firebase/firestore');
        const key = `${parentId}_${therapistId}`;
        await setDoc(doc(db, 'successful-matches', key), {
          postId: chatRoomId,
          parentId: parentId,
          therapistId: therapistId,
          matchedAt: new Date(),
          status: 'completed'
        }, { merge: true });
        console.log('✅ successful-matches 기록 완료');
        
        alert('✅ 매칭이 완료되었습니다!');
      } catch (error) {
        console.error('❌ 매칭완료 처리 실패:', error);
        alert('❌ 매칭완료 처리에 실패했습니다: ' + error);
      }
    }
    
    handleCloseModal();
  };

  const filteredChatRooms = chatRooms.filter(room => {
    if (statusFilter !== 'all' && room.status !== statusFilter) return false;
    if (riskFilter !== 'all' && room.riskLevel !== riskFilter) return false;
    return true;
  });

  const suspiciousRooms = chatRooms.filter(room => room.suspiciousActivity);
  const directTradeRooms = chatRooms.filter(room => room.directTradeDetected);

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">채팅방 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">

            <div>
              <h1 className="text-2xl font-bold text-gray-900">채팅 관리</h1>
              <p className="text-gray-600 mt-1">실시간 채팅 모니터링과 의심스러운 활동을 관리하세요</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{chatRooms.filter(r => r.status === 'active').length}</div>
              <div className="text-sm text-gray-500">활성 채팅방</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">{suspiciousRooms.length}</div>
              <div className="text-sm text-gray-500">의심 활동</div>
            </div>
          </div>
        </div>
      </div>

      {/* 의심스러운 활동 알림 */}
      {(suspiciousRooms.length > 0 || directTradeRooms.length > 0) && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
          <SuspiciousActivityAlert
            suspiciousCount={suspiciousRooms.length}
            directTradeCount={directTradeRooms.length}
            onViewDetails={() => setRiskFilter('high')}
          />
        </div>
      )}

      {/* 상태 카드 */}
      <ChatStatusCards chatRooms={chatRooms} />

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">채팅방 목록</h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
            >
              <option value="all">전체 상태</option>
              <option value="active">진행 중</option>
              <option value="ended">종료</option>
              <option value="suspended">정지</option>
            </select>

            {/* 위험도 필터 */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
            >
              <option value="all">전체 위험도</option>
              <option value="high">고위험</option>
              <option value="medium">중위험</option>
              <option value="low">저위험</option>
            </select>

            <button className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg">
              의심 활동 보고서
            </button>
          </div>
        </div>

        {/* 실시간 모니터링 상태 */}
        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse mr-3"></div>
            <span className="text-sm font-semibold text-green-800">
              실시간 모니터링 활성화 - {chatRooms.filter(r => r.status === 'active').length}개 채팅방 감시 중
            </span>
          </div>
        </div>
      </div>

      {/* 채팅방 목록 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">채팅방 현황</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white rounded-lg border border-orange-200 shadow-sm">
                <span className="text-sm font-semibold text-gray-700">총 </span>
                <span className="text-lg font-bold text-orange-600">{filteredChatRooms.length}</span>
                <span className="text-sm font-semibold text-gray-700">개</span>
              </div>
            </div>
          </div>
        </div>
        <ChatRoomList
          chatRooms={filteredChatRooms}
          onChatRoomSelect={handleChatRoomSelect}
        />
      </div>

      {/* 채팅 상세 모달 */}
      {selectedChatRoom && (
        <ChatDetailModal
          isOpen={isChatDetailModalOpen}
          onClose={handleCloseModal}
          chatRoom={selectedChatRoom}
          onChatAction={handleChatAction}
        />
      )}
    </div>
  );
}
