'use client';

interface ChatRoom {
  id: string;
  status: 'active' | 'ended' | 'suspended';
  suspiciousActivity: boolean;
  directTradeDetected: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  messageCount: number;
}

interface ChatStatusCardsProps {
  chatRooms: ChatRoom[];
}

export default function ChatStatusCards({ chatRooms }: ChatStatusCardsProps) {
  const totalMessages = chatRooms.reduce((sum, room) => sum + room.messageCount, 0);
  const averageMessages = chatRooms.length > 0 ? Math.round(totalMessages / chatRooms.length) : 0;

  const statusCards = [
    {
      title: '활성 채팅방',
      count: chatRooms.filter(r => r.status === 'active').length,
      icon: 'A',
      color: 'bg-green-500',
      description: '현재 진행 중'
    },
    {
      title: '종료된 채팅방',
      count: chatRooms.filter(r => r.status === 'ended').length,
      icon: 'E',
      color: 'bg-gray-500',
      description: '정상 종료'
    },
    {
      title: '정지된 채팅방',
      count: chatRooms.filter(r => r.status === 'suspended').length,
      icon: 'S',
      color: 'bg-red-500',
      description: '관리자 정지'
    },
    {
      title: '의심스러운 활동',
      count: chatRooms.filter(r => r.suspiciousActivity).length,
      icon: '!',
      color: 'bg-yellow-500',
      description: '모니터링 필요'
    },
    {
      title: '직거래 감지',
      count: chatRooms.filter(r => r.directTradeDetected).length,
      icon: 'D',
      color: 'bg-red-600',
      description: '즉시 조치 필요'
    },
    {
      title: '고위험 채팅방',
      count: chatRooms.filter(r => r.riskLevel === 'high').length,
      icon: 'H',
      color: 'bg-orange-500',
      description: '긴급 검토'
    },
    {
      title: '총 메시지 수',
      count: totalMessages.toLocaleString(),
      icon: 'T',
      color: 'bg-blue-500',
      description: '누적 메시지'
    },
    {
      title: '평균 메시지 수',
      count: averageMessages,
      icon: 'V',
      color: 'bg-purple-500',
      description: '채팅방당 평균'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statusCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {typeof card.count === 'number' && card.count > 999 ? card.count.toLocaleString() : card.count}
              </p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
