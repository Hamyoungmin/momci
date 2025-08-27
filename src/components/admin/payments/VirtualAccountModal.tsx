'use client';

import { useState } from 'react';

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

interface VirtualAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: SubscriptionPayment;
  onConfirmPayment: (paymentId: string) => void;
}

export default function VirtualAccountModal({ isOpen, onClose, payment, onConfirmPayment }: VirtualAccountModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmReason, setConfirmReason] = useState('');

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const isExpired = payment.virtualAccount && 
    new Date(payment.virtualAccount.expireDate) < new Date();

  const handleConfirm = () => {
    setIsConfirming(true);
    // 실제 구현 시 API 호출
    setTimeout(() => {
      onConfirmPayment(payment.id);
      setIsConfirming(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // 실제로는 토스트 알림 표시
    alert('복사되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 배경 오버레이 */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* 모달 */}
        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* 헤더 */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">이용권 결제 상세</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 결제 정보 */}
          <div className="mt-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">결제 정보</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">주문 ID:</span>
                  <span className="text-sm font-medium text-gray-900">{payment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">사용자:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.userName} ({payment.userType === 'parent' ? '학부모' : '치료사'})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">플랜:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.planType === 'monthly' ? '월간' : '연간'} 이용권
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">결제 금액:</span>
                  <span className="text-sm font-bold text-blue-600">{formatCurrency(payment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">주문일:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(payment.orderDate).toLocaleString('ko-KR')}
                  </span>
                </div>
              </div>
            </div>

            {/* 가상계좌 정보 */}
            {payment.virtualAccount && (
              <div className={`rounded-lg p-4 ${isExpired ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
                <h4 className="text-sm font-medium text-gray-900 mb-3">가상계좌 정보</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">은행:</span>
                    <span className="text-sm font-medium text-gray-900">{payment.virtualAccount.bank}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">계좌번호:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono text-gray-900">{payment.virtualAccount.accountNumber}</span>
                      <button
                        onClick={() => copyToClipboard(payment.virtualAccount!.accountNumber)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        복사
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">예금주:</span>
                    <span className="text-sm font-medium text-gray-900">{payment.virtualAccount.accountHolder}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">입금 마감:</span>
                    <span className={`text-sm font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                      {new Date(payment.virtualAccount.expireDate).toLocaleString('ko-KR')}
                    </span>
                  </div>
                </div>

                {isExpired && (
                  <div className="mt-3 p-3 bg-red-100 rounded-md">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-red-700">가상계좌 입금 기한이 만료되었습니다.</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 결제 완료 정보 */}
            {payment.status === 'completed' && payment.activePeriod && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-900 mb-3">이용권 활성화 정보</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">결제일:</span>
                    <span className="text-sm font-medium text-green-900">
                      {payment.paidDate && new Date(payment.paidDate).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">이용 기간:</span>
                    <span className="text-sm font-medium text-green-900">
                      {new Date(payment.activePeriod.startDate).toLocaleDateString('ko-KR')} ~ 
                      {new Date(payment.activePeriod.endDate).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 수동 입금 확인 */}
            {payment.status === 'pending' && !isExpired && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-900 mb-3">입금 확인</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  고객으로부터 입금이 확인되었다면 아래 버튼을 클릭하여 이용권을 활성화하세요.
                </p>
                <div className="space-y-3">
                  <textarea
                    value={confirmReason}
                    onChange={(e) => setConfirmReason(e.target.value)}
                    placeholder="입금 확인 메모 (선택사항)"
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isConfirming ? '처리 중...' : '입금 확인 및 이용권 활성화'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
