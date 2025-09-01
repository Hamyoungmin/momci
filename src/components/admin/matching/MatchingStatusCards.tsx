'use client';

interface Matching {
  id: string;
  status: 'interview' | 'lesson_confirmed' | 'payment_pending' | 'payment_completed' | 'cancelled';
}

interface MatchingStatusCardsProps {
  matchings: Matching[];
}

export default function MatchingStatusCards({ matchings }: MatchingStatusCardsProps) {
  const statusCards = [
    {
      title: '인터뷰 중',
      count: matchings.filter(m => m.status === 'interview').length,
      icon: 'I',
      color: 'bg-blue-500',
      description: '채팅으로 인터뷰 진행 중'
    },
    {
      title: '수업 확정',
      count: matchings.filter(m => m.status === 'lesson_confirmed').length,
      icon: 'C',
      color: 'bg-green-500',
      description: '수업 확정, 결제 대기'
    },
    {
      title: '결제 대기',
      count: matchings.filter(m => m.status === 'payment_pending').length,
      icon: 'P',
      color: 'bg-yellow-500',
      description: '첫 수업료 결제 진행 중'
    },
    {
      title: '매칭 완료',
      count: matchings.filter(m => m.status === 'payment_completed').length,
      icon: 'S',
      color: 'bg-purple-500',
      description: '매칭 성공, 연락처 공개'
    },
    {
      title: '취소',
      count: matchings.filter(m => m.status === 'cancelled').length,
      icon: 'X',
      color: 'bg-red-500',
      description: '매칭 취소'
    },
    {
      title: '전체',
      count: matchings.length,
      icon: 'T',
      color: 'bg-gray-500',
      description: '총 매칭 건수'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statusCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{card.count}건</p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
