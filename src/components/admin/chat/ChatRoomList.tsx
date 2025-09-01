'use client';

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

interface ChatRoomListProps {
  chatRooms: ChatRoom[];
  onChatRoomSelect: (chatRoom: ChatRoom) => void;
}

export default function ChatRoomList({ chatRooms, onChatRoomSelect }: ChatRoomListProps) {
  const getStatusBadge = (status: ChatRoom['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">진행 중</span>;
      case 'ended':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">종료</span>;
      case 'suspended':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">정지</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getRiskLevelBadge = (riskLevel: ChatRoom['riskLevel']) => {
    switch (riskLevel) {
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">고위험</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">중위험</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">✅ 저위험</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getTimeDifference = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
  };

  const maskSensitiveContent = (content: string) => {
    // 계좌번호, 전화번호 등 민감 정보 마스킹
    return content
      .replace(/\d{3}-\d{4}-\d{4}/g, '010-****-****')
      .replace(/\d{6}-\d{2}-\d{6}/g, '******-**-******')
      .replace(/\d{3}-\d{2}-\d{6}/g, '***-**-******');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">채팅방 목록</h2>
          <span className="text-sm text-gray-600">총 {chatRooms.length}개</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                채팅방 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                참여자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                위험도
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                메시지 수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                시작일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                최근 메시지
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                마지막 활동
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chatRooms.map((room) => (
              <tr
                key={room.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  room.directTradeDetected ? 'bg-red-50' : 
                  room.suspiciousActivity ? 'bg-yellow-50' : ''
                }`}
                onClick={() => onChatRoomSelect(room)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {room.id}
                  <div className="text-xs text-gray-500">매칭: {room.matchingId}</div>
                  {room.directTradeDetected && (
                    <div className="text-xs text-red-600 font-medium">직거래 감지</div>
                  )}
                  {room.suspiciousActivity && !room.directTradeDetected && (
                    <div className="text-xs text-yellow-600 font-medium">의심 활동</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-1">👨‍👩‍👧‍👦</span>
                      <span className="font-medium">{room.parentName}</span>
                    </div>
                    <div className="text-xs text-gray-500">{room.parentId}</div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-1">치료사</span>
                      <span className="font-medium">{room.teacherName}</span>
                    </div>
                    <div className="text-xs text-gray-500">{room.teacherId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(room.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRiskLevelBadge(room.riskLevel)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {room.messageCount}개
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(room.startDate).toLocaleDateString('ko-KR')}
                  <br />
                  <span className="text-xs">
                    {new Date(room.startDate).toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {room.lastMessage ? (
                    <div className="max-w-xs">
                      <div className="text-xs text-gray-400 mb-1">
                        {room.lastMessage.senderName}:
                      </div>
                      <div 
                        className={`text-sm truncate ${
                          room.directTradeDetected ? 'text-red-600 font-medium' : 'text-gray-700'
                        }`}
                        title={room.lastMessage.content}
                      >
                        {maskSensitiveContent(room.lastMessage.content)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">메시지 없음</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getTimeDifference(room.lastMessageDate)}
                  <br />
                  <span className="text-xs">
                    {new Date(room.lastMessageDate).toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 데이터가 없는 경우 */}
      {chatRooms.length === 0 && (
        <div className="p-12 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500">채팅방 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
