'use client';

interface Inquiry {
  status: 'pending' | 'assigned' | 'answered' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'service' | 'payment' | 'technical' | 'account' | 'other';
  createdAt: string;
  responseTime?: number;
}

interface InquiryStatusCardsProps {
  inquiries: Inquiry[];
}

export default function InquiryStatusCards({ inquiries }: InquiryStatusCardsProps) {
  // 오늘 접수된 문의
  const todayInquiries = inquiries.filter(i => {
    const today = new Date().toDateString();
    const inquiryDate = new Date(i.createdAt).toDateString();
    return today === inquiryDate;
  });

  // 평균 응답 시간 계산 (답변 완료된 문의만)
  const answeredInquiries = inquiries.filter(i => i.responseTime);
  const avgResponseTime = answeredInquiries.length > 0 
    ? Math.round(answeredInquiries.reduce((sum, i) => sum + (i.responseTime || 0), 0) / answeredInquiries.length)
    : 0;

  const statusCards = [
    {
      title: '접수 대기',
      count: inquiries.filter(i => i.status === 'pending').length,
      icon: '📨',
      color: 'bg-yellow-500',
      description: '새로운 문의'
    },
    {
      title: '처리 중',
      count: inquiries.filter(i => i.status === 'assigned').length,
      icon: '🔄',
      color: 'bg-blue-500',
      description: '담당자 배정'
    },
    {
      title: '답변 완료',
      count: inquiries.filter(i => i.status === 'answered').length,
      icon: '✅',
      color: 'bg-green-500',
      description: '답변 전송'
    },
    {
      title: '종료',
      count: inquiries.filter(i => i.status === 'closed').length,
      icon: '🔒',
      color: 'bg-gray-500',
      description: '완료된 문의'
    },
    {
      title: '긴급 문의',
      count: inquiries.filter(i => i.priority === 'urgent').length,
      icon: '🚨',
      color: 'bg-red-500',
      description: '즉시 처리 필요'
    },
    {
      title: '오늘 접수',
      count: todayInquiries.length,
      icon: '📊',
      color: 'bg-purple-500',
      description: '당일 문의'
    },
    {
      title: '결제 문의',
      count: inquiries.filter(i => i.category === 'payment').length,
      icon: '💳',
      color: 'bg-indigo-500',
      description: '결제 관련'
    },
    {
      title: '평균 응답시간',
      count: `${avgResponseTime}h`,
      icon: '⏱️',
      color: 'bg-orange-500',
      description: '답변까지 소요시간'
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
                {typeof card.count === 'string' ? card.count : 
                 card.title === '평균 응답시간' ? card.count : `${card.count}건`}
              </p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
            <div
              className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xl`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
