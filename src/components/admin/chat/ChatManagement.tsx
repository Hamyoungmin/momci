'use client';

import { useState } from 'react';
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

  // 임시 데이터
  const [chatRooms] = useState<ChatRoom[]>([
    {
      id: 'CR001',
      matchingId: 'M001',
      parentId: 'P001',
      parentName: '김○○',
      teacherId: 'T001',
      teacherName: '이○○',
      startDate: '2024-01-20 10:30',
      lastMessageDate: '2024-01-20 15:30',
      messageCount: 47,
      status: 'active',
      suspiciousActivity: false,
      directTradeDetected: false,
      riskLevel: 'low',
      lastMessage: {
        senderId: 'P001',
        senderName: '김○○',
        content: '네, 감사합니다. 그럼 내일 오후 2시에 뵙겠습니다.',
        timestamp: '2024-01-20 15:30'
      }
    },
    {
      id: 'CR002',
      matchingId: 'M002',
      parentId: 'P002',
      parentName: '박○○',
      teacherId: 'T002',
      teacherName: '정○○',
      startDate: '2024-01-19 14:20',
      lastMessageDate: '2024-01-20 09:15',
      messageCount: 23,
      status: 'active',
      suspiciousActivity: true,
      directTradeDetected: true,
      riskLevel: 'high',
      lastMessage: {
        senderId: 'T002',
        senderName: '정○○',
        content: '직접 거래하시면 수수료도 없고 더 저렴해요. 제 계좌는 ***',
        timestamp: '2024-01-20 09:15'
      }
    },
    {
      id: 'CR003',
      matchingId: 'M003',
      parentId: 'P003',
      parentName: '최○○',
      teacherId: 'T003',
      teacherName: '김○○',
      startDate: '2024-01-18 11:00',
      lastMessageDate: '2024-01-19 18:30',
      messageCount: 156,
      status: 'ended',
      suspiciousActivity: false,
      directTradeDetected: false,
      riskLevel: 'low',
      lastMessage: {
        senderId: 'P003',
        senderName: '최○○',
        content: '수업 잘 부탁드립니다. 연락처 공유해주셔서 감사해요!',
        timestamp: '2024-01-19 18:30'
      }
    },
    {
      id: 'CR004',
      matchingId: 'M004',
      parentId: 'P004',
      parentName: '윤○○',
      teacherId: 'T004',
      teacherName: '장○○',
      startDate: '2024-01-17 16:45',
      lastMessageDate: '2024-01-18 12:20',
      messageCount: 8,
      status: 'suspended',
      suspiciousActivity: true,
      directTradeDetected: true,
      riskLevel: 'high',
      lastMessage: {
        senderId: 'T004',
        senderName: '장○○',
        content: '플랫폼 말고 직접 만나서 얘기해요. 제 번호는 010-****',
        timestamp: '2024-01-18 12:20'
      }
    }
  ]);

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
    <div className="space-y-6">
      {/* 의심스러운 활동 알림 */}
      {(suspiciousRooms.length > 0 || directTradeRooms.length > 0) && (
        <SuspiciousActivityAlert
          suspiciousCount={suspiciousRooms.length}
          directTradeCount={directTradeRooms.length}
          onViewDetails={() => setRiskFilter('high')}
        />
      )}

      {/* 상태 카드 */}
      <ChatStatusCards chatRooms={chatRooms} />

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">채팅방 목록</h2>
          <div className="flex items-center space-x-4">
            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 위험도</option>
              <option value="high">고위험</option>
              <option value="medium">중위험</option>
              <option value="low">저위험</option>
            </select>

            <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700">
              의심 활동 보고서
            </button>
          </div>
        </div>

        {/* 실시간 모니터링 상태 */}
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-medium text-green-800">
              실시간 모니터링 활성화 - {chatRooms.filter(r => r.status === 'active').length}개 채팅방 감시 중
            </span>
          </div>
        </div>
      </div>

      {/* 채팅방 목록 */}
      <ChatRoomList
        chatRooms={filteredChatRooms}
        onChatRoomSelect={handleChatRoomSelect}
      />

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
