'use client';

interface Report {
  status: 'pending' | 'investigating' | 'completed' | 'dismissed';
  type: 'direct_trade' | 'inappropriate_behavior' | 'false_profile' | 'service_complaint' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  resolution?: {
    penalty?: 'warning' | 'temporary_ban' | 'permanent_ban';
    reward?: 'subscription_1month';
  };
}

interface ReportStatusCardsProps {
  reports: Report[];
}

export default function ReportStatusCards({ reports }: ReportStatusCardsProps) {
  // 오늘 신고 건수
  const todayReports = reports.filter(r => {
    const today = new Date().toDateString();
    const reportDate = new Date(r.createdAt).toDateString();
    return today === reportDate;
  });

  // 직거래 신고 통계
  const directTradeReports = reports.filter(r => r.type === 'direct_trade');
  const directTradeProcessed = directTradeReports.filter(r => r.status === 'completed').length;

  // 포상금 지급 건수
  const rewardGiven = reports.filter(r => 
    r.resolution?.reward === 'subscription_1month'
  ).length;

  // 처벌 조치 건수
  const penaltiesGiven = reports.filter(r => r.resolution?.penalty).length;

  const statusCards = [
    {
      title: '접수 대기',
      count: reports.filter(r => r.status === 'pending').length,
      icon: '',
      color: 'bg-yellow-500',
      description: '신규 신고'
    },
    {
      title: '조사 중',
      count: reports.filter(r => r.status === 'investigating').length,
      icon: '',
      color: 'bg-blue-500',
      description: '처리 진행'
    },
    {
      title: '처리 완료',
      count: reports.filter(r => r.status === 'completed').length,
      icon: '',
      color: 'bg-green-500',
      description: '해결됨'
    },
    {
      title: '긴급 신고',
      count: reports.filter(r => r.priority === 'urgent' || 
        (r.type === 'direct_trade' && r.status === 'pending')).length,
      icon: '',
      color: 'bg-red-500',
      description: '즉시 처리 필요'
    },
    {
      title: '직거래 신고',
      count: directTradeReports.length,
      icon: '',
      color: 'bg-orange-500',
      description: `처리율 ${directTradeReports.length > 0 ? Math.round((directTradeProcessed / directTradeReports.length) * 100) : 0}%`
    },
    {
      title: '오늘 신고',
      count: todayReports.length,
      icon: '',
      color: 'bg-purple-500',
      description: '당일 접수'
    },
    {
      title: '포상금 지급',
      count: rewardGiven,
      icon: '',
      color: 'bg-pink-500',
      description: '이용권 지급'
    },
    {
      title: '처벌 조치',
      count: penaltiesGiven,
      icon: '',
      color: 'bg-gray-600',
      description: '경고/정지'
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
                {card.count}
                {card.title === '직거래 신고' || card.title === '처리 완료' || 
                 card.title === '접수 대기' || card.title === '조사 중' ? '건' : 
                 card.title === '포상금 지급' || card.title === '처벌 조치' ? '건' : 
                 card.title === '오늘 신고' || card.title === '긴급 신고' ? '건' : ''}
              </p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
