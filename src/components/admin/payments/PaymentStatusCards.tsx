'use client';

interface Payment {
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'settlement_pending' | 'settlement_completed';
  amount: number;
  userType?: 'parent' | 'teacher';
}

interface PaymentStatusCardsProps {
  payments: Payment[];
  type: 'subscription' | 'lesson';
}

export default function PaymentStatusCards({ payments, type }: PaymentStatusCardsProps) {
  const totalAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const todayAmount = payments
    .filter(p => p.status === 'completed')
    // 실제로는 오늘 날짜로 필터링
    .reduce((sum, p) => sum + p.amount, 0) * 0; // 실제 계산 로직 적용 예정

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const statusCards = [
    {
      title: '결제 대기',
      count: payments.filter(p => p.status === 'pending').length,
      icon: 'W',
      color: 'bg-yellow-500',
      description: '입금 확인 필요'
    },
    {
      title: '결제 완료',
      count: payments.filter(p => p.status === 'completed').length,
      icon: 'C',
      color: 'bg-green-500',
      description: '정상 결제'
    },
    {
      title: '결제 실패',
      count: payments.filter(p => p.status === 'failed').length,
      icon: 'F',
      color: 'bg-red-500',
      description: '미입금/만료'
    },
    {
      title: '총 매출',
      count: formatCurrency(totalAmount),
      icon: 'T',
      color: 'bg-purple-500',
      description: '누적 매출액'
    },
    {
      title: '오늘 매출',
      count: formatCurrency(todayAmount),
      icon: 'D',
      color: 'bg-blue-500',
      description: '당일 매출액'
    }
  ];

  // 이용권별 추가 정보
  if (type === 'subscription') {
    const parentCount = payments.filter(p => p.userType === 'parent' && p.status === 'completed').length;
    const teacherCount = payments.filter(p => p.userType === 'teacher' && p.status === 'completed').length;
    
    statusCards.push({
      title: '학부모 이용권',
      count: parentCount,
      icon: 'P',
      color: 'bg-pink-500',
      description: '활성 이용권'
    });
  }

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
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {typeof card.count === 'number' ? `${card.count}건` : card.count}
              </p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
