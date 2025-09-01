'use client';

import { useState, useEffect } from 'react';
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
    const fetchChatRooms = async () => {
      try {
        setLoading(true);
        // TODO: Firebase에서 실제 채팅방 데이터 조회
        // const chatRoomsData = await getChatRooms();
        setChatRooms([]);
      } catch (error) {
        console.error('채팅방 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  const handleChatRoomSelect = (chatRoom: ChatRoom) => {
    setSelectedChatRoom(chatRoom);
    setIsChatDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsChatDetailModalOpen(false);
    setSelectedChatRoom(null);
  };

  const handleChatAction = (chatRoomId: string, action: 'suspend' | 'resume' | 'end', reason?: string) => {
    // 실제 구현 시 API 호출
    console.log('Chat action:', { chatRoomId, action, reason });
    handleCloseModal();
  };

  const filteredChatRooms = chatRooms.filter(room => {
    if (statusFilter !== 'all' && room.status !== statusFilter) return false;
    if (riskFilter !== 'all' && room.riskLevel !== riskFilter) return false;
    return true;
  });

  const suspiciousRooms = chatRooms.filter(room => room.suspiciousActivity);
  const directTradeRooms = chatRooms.filter(room => room.directTradeDetected);

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
