'use client';

interface SubscriptionPayment {
  id: string;
  userId: string;
  userName: string;
  userType: 'parent' | 'teacher';
  planType: 'monthly' | 'yearly';
  amount: number;
  paymentMethod: 'virtual_account' | 'card';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  orderDate: string;
  paidDate?: string;
  virtualAccount?: {
    bank: string;
    accountNumber: string;
    accountHolder: string;
    expireDate: string;
  };
  activePeriod?: {
    startDate: string;
    endDate: string;
  };
}

interface SubscriptionTableProps {
  payments: SubscriptionPayment[];
  onPaymentSelect: (payment: SubscriptionPayment) => void;
  onConfirmPayment: (paymentId: string) => void;
}

export default function SubscriptionTable({ payments, onPaymentSelect, onConfirmPayment }: SubscriptionTableProps) {
  const getStatusBadge = (status: SubscriptionPayment['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">결제 대기</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">결제 완료</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">결제 실패</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">취소</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getUserTypeBadge = (userType: SubscriptionPayment['userType']) => {
    switch (userType) {
      case 'parent':
        return <span className="px-2 py-1 text-xs font-medium bg-pink-100 text-pink-800 rounded-full">학부모</span>;
      case 'teacher':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">치료사</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getPlanTypeBadge = (planType: SubscriptionPayment['planType']) => {
    switch (planType) {
      case 'monthly':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">월간</span>;
      case 'yearly':
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">연간</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const isExpiringSoon = (expireDate: string) => {
    const expire = new Date(expireDate);
    const now = new Date();
    const timeDiff = expire.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff <= 24 && hoursDiff > 0; // 24시간 이내
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">이용권 결제 목록</h2>
          <span className="text-sm text-gray-600">총 {payments.length}건</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                사용자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                유형
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                플랜
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                결제 방법
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                결제일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                활성 기간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className={`hover:bg-gray-50 transition-colors ${
                  payment.status === 'pending' && payment.virtualAccount && 
                  isExpiringSoon(payment.virtualAccount.expireDate) ? 'bg-yellow-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {payment.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{payment.userName}</div>
                    <div className="text-gray-500 text-xs">{payment.userId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getUserTypeBadge(payment.userType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPlanTypeBadge(payment.planType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.paymentMethod === 'virtual_account' ? '가상계좌' : '카드'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(payment.status)}
                  {payment.status === 'pending' && payment.virtualAccount && 
                   isExpiringSoon(payment.virtualAccount.expireDate) && (
                    <div className="text-xs text-red-600 mt-1">
                      ⚠️ 입금 마감 임박
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(payment.orderDate).toLocaleDateString('ko-KR')}
                  <br />
                  <span className="text-xs">
                    {new Date(payment.orderDate).toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.paidDate ? (
                    <>
                      {new Date(payment.paidDate).toLocaleDateString('ko-KR')}
                      <br />
                      <span className="text-xs">
                        {new Date(payment.paidDate).toLocaleTimeString('ko-KR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.activePeriod ? (
                    <>
                      {new Date(payment.activePeriod.startDate).toLocaleDateString('ko-KR')}
                      <br />
                      <span className="text-xs">
                        ~ {new Date(payment.activePeriod.endDate).toLocaleDateString('ko-KR')}
                      </span>
                    </>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-y-1">
                  <button
                    onClick={() => onPaymentSelect(payment)}
                    className="block w-full px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    상세보기
                  </button>
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => onConfirmPayment(payment.id)}
                      className="block w-full px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      입금확인
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 데이터가 없는 경우 */}
      {payments.length === 0 && (
        <div className="p-12 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <p className="text-gray-500">결제 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
