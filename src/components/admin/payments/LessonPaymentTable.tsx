'use client';

interface LessonPayment {
  id: string;
  matchingId: string;
  parentId: string;
  parentName: string;
  teacherId: string;
  teacherName: string;
  childAge: string;
  treatmentType: string[];
  amount: number;
  paymentMethod: 'virtual_account' | 'card';
  status: 'pending' | 'completed' | 'settlement_pending' | 'settlement_completed' | 'failed';
  orderDate: string;
  paidDate?: string;
  settlementDate?: string;
  virtualAccount?: {
    bank: string;
    accountNumber: string;
    accountHolder: string;
    expireDate: string;
  };
  contactShared: boolean;
  commission: number;
}

interface LessonPaymentTableProps {
  payments: LessonPayment[];
  onPaymentSelect: (payment: LessonPayment) => void;
  onConfirmPaymentAndShare: (paymentId: string) => void;
}

export default function LessonPaymentTable({ payments, onPaymentSelect, onConfirmPaymentAndShare }: LessonPaymentTableProps) {
  const getStatusBadge = (status: LessonPayment['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">결제 대기</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">결제 완료</span>;
      case 'settlement_pending':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">정산 대기</span>;
      case 'settlement_completed':
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">정산 완료</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">결제 실패</span>;
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
    return hoursDiff <= 24 && hoursDiff > 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">첫 수업료 결제 목록</h2>
          <span className="text-sm text-gray-600">총 {payments.length}건</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                결제 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                매칭 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                치료 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                결제 금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수수료
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                연락처 공개
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                결제일
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
                  <div className="text-xs text-gray-500">매칭: {payment.matchingId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="font-medium">👨‍👩‍👧‍👦 {payment.parentName}</div>
                    <div className="text-xs text-gray-500">{payment.parentId}</div>
                    <div className="font-medium">치료사 {payment.teacherName}</div>
                    <div className="text-xs text-gray-500">{payment.teacherId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-2">
                    <div className="font-medium">{payment.childAge}</div>
                    <div className="flex flex-wrap gap-1">
                      {payment.treatmentType.slice(0, 2).map((type, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded"
                        >
                          {type}
                        </span>
                      ))}
                      {payment.treatmentType.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{payment.treatmentType.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="font-medium text-red-600">{formatCurrency(payment.commission)}</div>
                    <div className="text-xs text-gray-500">
                      ({((payment.commission / payment.amount) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(payment.status)}
                  {payment.status === 'pending' && payment.virtualAccount && 
                   isExpiringSoon(payment.virtualAccount.expireDate) && (
                    <div className="text-xs text-red-600 mt-1">
                      입금 마감 임박
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {payment.contactShared ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      ✅ 공개 완료
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      ❌ 미공개
                    </span>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm space-y-1">
                  <button
                    onClick={() => onPaymentSelect(payment)}
                    className="block w-full px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    상세보기
                  </button>
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => onConfirmPaymentAndShare(payment.id)}
                      className="block w-full px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      title="입금 확인 및 매칭 완료"
                    >
                      입금확인 & 완료
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <p className="text-gray-500">첫 수업료 결제 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
