'use client';

import { useState } from 'react';

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

interface LessonPaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: LessonPayment;
  onConfirmPaymentAndShare: (paymentId: string) => void;
}

export default function LessonPaymentDetailModal({ 
  isOpen, 
  onClose, 
  payment, 
  onConfirmPaymentAndShare 
}: LessonPaymentDetailModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmMemo, setConfirmMemo] = useState('');

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const isExpired = payment.virtualAccount && 
    new Date(payment.virtualAccount.expireDate) < new Date();

  const handleConfirmPaymentAndShare = () => {
    setIsConfirming(true);
    // 실제 구현 시 API 호출
    setTimeout(() => {
      onConfirmPaymentAndShare(payment.id);
      setIsConfirming(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('복사되었습니다.');
  };

  const teacherReceiveAmount = payment.amount - payment.commission;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 배경 오버레이 */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* 모달 */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* 헤더 */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">첫 수업료 결제 상세</h3>
              <p className="text-sm text-gray-600">결제 ID: {payment.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 매칭 정보 */}
          <div className="mt-6 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">매칭 정보</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">매칭 ID:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{payment.matchingId}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">학부모:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">
                    {payment.parentName} ({payment.parentId})
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">치료사:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">
                    {payment.teacherName} ({payment.teacherId})
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">아이 나이:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{payment.childAge}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm text-gray-600">치료 종목:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {payment.treatmentType.map((type, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 결제 정보 */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">결제 정보</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">결제 금액:</span>
                  <span className="text-lg font-bold text-blue-600">{formatCurrency(payment.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">플랫폼 수수료:</span>
                  <span className="text-sm font-medium text-red-600">
                    -{formatCurrency(payment.commission)} ({((payment.commission / payment.amount) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                  <span className="text-sm font-medium text-gray-900">치료사 수령액:</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(teacherReceiveAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">주문일:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(payment.orderDate).toLocaleString('ko-KR')}
                  </span>
                </div>
                {payment.paidDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">결제일:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(payment.paidDate).toLocaleString('ko-KR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 가상계좌 정보 */}
            {payment.virtualAccount && (
              <div className={`rounded-lg p-4 ${isExpired ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                <h4 className="text-sm font-medium text-gray-900 mb-3">가상계좌 정보</h4>
                <div className="space-y-2">
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

            {/* 연락처 공개 상태 */}
            <div className={`rounded-lg p-4 ${payment.contactShared ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <h4 className="text-sm font-medium text-gray-900 mb-3">연락처 공개 상태</h4>
              {payment.contactShared ? (
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">
                    연락처 공개 완료 - 학부모와 치료사가 직접 소통할 수 있습니다.
                  </span>
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-yellow-800">
                    연락처 미공개 - 결제 확인 후 자동으로 공개됩니다.
                  </span>
                </div>
              )}
            </div>

            {/* 입금 확인 및 매칭 완료 */}
            {payment.status === 'pending' && !isExpired && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-3">🎯 입금 확인 및 매칭 완료</h4>
                <p className="text-sm text-blue-700 mb-4">
                  고객으로부터 입금이 확인되었다면 아래 버튼을 클릭하세요. 
                  <br/>
                  <strong>다음 작업이 자동으로 실행됩니다:</strong>
                </p>
                <ul className="text-sm text-blue-700 mb-4 ml-4 space-y-1">
                  <li>• 결제 상태를 '완료'로 변경</li>
                  <li>• 학부모와 치료사에게 서로의 연락처 공개</li>
                  <li>• 해당 요청 게시글 상태를 '매칭 완료'로 변경</li>
                  <li>• 양측에게 매칭 완료 알림톡 발송</li>
                </ul>
                
                <div className="space-y-3">
                  <textarea
                    value={confirmMemo}
                    onChange={(e) => setConfirmMemo(e.target.value)}
                    placeholder="처리 메모 (선택사항)"
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleConfirmPaymentAndShare}
                    disabled={isConfirming}
                    className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isConfirming ? '처리 중...' : '🎉 입금 확인 및 매칭 완료'}
                  </button>
                </div>
              </div>
            )}

            {/* 정산 정보 */}
            {payment.status === 'settlement_completed' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-purple-900 mb-3">정산 완료</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-700">정산일:</span>
                    <span className="text-sm font-medium text-purple-900">
                      {payment.settlementDate && new Date(payment.settlementDate).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-700">치료사 정산액:</span>
                    <span className="text-sm font-bold text-purple-900">{formatCurrency(teacherReceiveAmount)}</span>
                  </div>
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
