'use client';

interface RefundRequest {
  id: string;
  userId: string;
  userName: string;
  userType: 'parent' | 'teacher';
  refundType: 'subscription' | 'lesson';
  originalPaymentId: string;
  originalAmount: number;
  refundAmount: number;
  reason: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminNote?: string;
  processedDate?: string;
  refundMethod: 'bank_transfer' | 'virtual_account';
  bankInfo?: {
    bank: string;
    accountNumber: string;
    accountHolder: string;
  };
}

interface RefundTableProps {
  refunds: RefundRequest[];
  onRefundSelect: (refund: RefundRequest) => void;
}

export default function RefundTable({ refunds, onRefundSelect }: RefundTableProps) {
  const getStatusBadge = (status: RefundRequest['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">처리 대기</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">승인</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">반려</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">완료</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getTypeBadge = (type: RefundRequest['refundType']) => {
    switch (type) {
      case 'subscription':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">이용권</span>;
      case 'lesson':
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">첫 수업료</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getUserTypeBadge = (userType: RefundRequest['userType']) => {
    switch (userType) {
      case 'parent':
        return <span className="px-2 py-1 text-xs font-medium bg-pink-100 text-pink-800 rounded-full">학부모</span>;
      case 'teacher':
        return <span className="px-2 py-1 text-xs font-medium bg-cyan-100 text-cyan-800 rounded-full">치료사</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const isUrgent = (requestDate: string) => {
    const request = new Date(requestDate);
    const now = new Date();
    const daysDiff = (now.getTime() - request.getTime()) / (1000 * 3600 * 24);
    return daysDiff >= 3; // 3일 이상 지난 요청
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">환불 요청 목록</h2>
          <span className="text-sm text-gray-600">총 {refunds.length}건</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                환불 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                사용자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                유형
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                원 결제 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                원 금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                환불 요청액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                요청일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                처리일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                사유
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {refunds.map((refund) => (
              <tr
                key={refund.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  refund.status === 'pending' && isUrgent(refund.requestDate) ? 'bg-yellow-50' : ''
                }`}
                onClick={() => onRefundSelect(refund)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {refund.id}
                  {refund.status === 'pending' && isUrgent(refund.requestDate) && (
                    <div className="text-xs text-red-600">⚠️ 긴급</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="font-medium">{refund.userName}</div>
                    <div className="text-xs text-gray-500">{refund.userId}</div>
                    <div>{getUserTypeBadge(refund.userType)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTypeBadge(refund.refundType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                  {refund.originalPaymentId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {formatCurrency(refund.originalAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="font-bold text-red-600">{formatCurrency(refund.refundAmount)}</div>
                    {refund.refundAmount > 0 && (
                      <div className="text-xs text-gray-500">
                        ({((refund.refundAmount / refund.originalAmount) * 100).toFixed(1)}%)
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(refund.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(refund.requestDate).toLocaleDateString('ko-KR')}
                  <br />
                  <span className="text-xs">
                    {new Date(refund.requestDate).toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {refund.processedDate ? (
                    <>
                      {new Date(refund.processedDate).toLocaleDateString('ko-KR')}
                      <br />
                      <span className="text-xs">
                        {new Date(refund.processedDate).toLocaleTimeString('ko-KR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="max-w-xs truncate" title={refund.reason}>
                    {refund.reason}
                  </div>
                  {refund.adminNote && (
                    <div className="text-xs text-blue-600 mt-1" title={refund.adminNote}>
                      관리자: {refund.adminNote.substring(0, 20)}...
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 데이터가 없는 경우 */}
      {refunds.length === 0 && (
        <div className="p-12 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
          </svg>
          <p className="text-gray-500">환불 요청 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
