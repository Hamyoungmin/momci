'use client';

import { useState } from 'react';

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

interface RefundDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  refund: RefundRequest;
  onRefundAction: (refundId: string, action: 'approve' | 'reject', note: string, amount?: number) => void;
}

export default function RefundDetailModal({ isOpen, onClose, refund, onRefundAction }: RefundDetailModalProps) {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [refundAmount, setRefundAmount] = useState(refund.refundAmount);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const handleSubmit = () => {
    if (!action || !adminNote.trim()) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      onRefundAction(refund.id, action, adminNote, action === 'approve' ? refundAmount : 0);
      setIsProcessing(false);
    }, 1000);
  };

  const calculateRefundPercentage = () => {
    if (refund.originalAmount === 0) return 0;
    return ((refundAmount / refund.originalAmount) * 100).toFixed(1);
  };

  const getRefundPolicy = () => {
    if (refund.refundType === 'subscription') {
      return {
        title: '이용권 환불 정책',
        rules: [
          '가입 후 7일 이내: 100% 환불',
          '가입 후 14일 이내: 50% 환불',
          '가입 후 30일 이후: 환불 불가',
          '실제 이용한 기간에 따라 차등 적용'
        ]
      };
    } else {
      return {
        title: '첫 수업료 환불 정책',
        rules: [
          '수업 시작 전: 100% 환불',
          '수업 시작 후 24시간 이내: 50% 환불',
          '수업 진행 후: 환불 불가',
          '치료사/학부모 귀책 사유에 따라 차등 적용'
        ]
      };
    }
  };

  const policy = getRefundPolicy();

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
              <h3 className="text-lg font-medium text-gray-900">환불 요청 상세</h3>
              <p className="text-sm text-gray-600">환불 ID: {refund.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {/* 기본 정보 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">기본 정보</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">사용자:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">
                    {refund.userName} ({refund.userType === 'parent' ? '학부모' : '치료사'})
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">회원 ID:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">{refund.userId}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">환불 유형:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">
                    {refund.refundType === 'subscription' ? '이용권' : '첫 수업료'}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">원 결제 ID:</span>
                  <span className="text-sm font-mono text-gray-900 ml-2">{refund.originalPaymentId}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">요청일:</span>
                  <span className="text-sm text-gray-900 ml-2">
                    {new Date(refund.requestDate).toLocaleString('ko-KR')}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">현재 상태:</span>
                  <span className="text-sm font-medium text-gray-900 ml-2">
                    {refund.status === 'pending' ? '처리 대기' : 
                     refund.status === 'approved' ? '승인' :
                     refund.status === 'rejected' ? '반려' : '완료'}
                  </span>
                </div>
              </div>
            </div>

            {/* 금액 정보 */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">금액 정보</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">원 결제 금액:</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(refund.originalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">요청 환불액:</span>
                  <span className="text-lg font-bold text-red-600">{formatCurrency(refund.refundAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>환불 비율:</span>
                  <span>{((refund.refundAmount / refund.originalAmount) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* 환불 사유 */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">환불 사유</h4>
              <p className="text-sm text-gray-700">{refund.reason}</p>
            </div>

            {/* 계좌 정보 */}
            {refund.bankInfo && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">환불 계좌 정보</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">은행:</span>
                    <span className="text-sm font-medium text-gray-900">{refund.bankInfo.bank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">계좌번호:</span>
                    <span className="text-sm font-mono text-gray-900">{refund.bankInfo.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">예금주:</span>
                    <span className="text-sm font-medium text-gray-900">{refund.bankInfo.accountHolder}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 환불 정책 */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-purple-900 mb-3">{policy.title}</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                {policy.rules.map((rule, index) => (
                  <li key={index}>• {rule}</li>
                ))}
              </ul>
            </div>

            {/* 관리자 처리 */}
            {refund.status === 'pending' && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4">관리자 처리</h4>
                
                {/* 처리 유형 선택 */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">처리 결정</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="action"
                          value="approve"
                          checked={action === 'approve'}
                          onChange={(e) => setAction(e.target.value as 'approve')}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">승인</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="action"
                          value="reject"
                          checked={action === 'reject'}
                          onChange={(e) => setAction(e.target.value as 'reject')}
                          className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">반려</span>
                      </label>
                    </div>
                  </div>

                  {/* 승인시 환불액 조정 */}
                  {action === 'approve' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">실제 환불액</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="number"
                          value={refundAmount}
                          onChange={(e) => setRefundAmount(Number(e.target.value))}
                          max={refund.originalAmount}
                          min={0}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">원 ({calculateRefundPercentage()}%)</span>
                      </div>
                    </div>
                  )}

                  {/* 관리자 메모 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      관리자 메모 (필수)
                    </label>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={3}
                      placeholder="환불 처리 사유를 상세히 작성해주세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!action || !adminNote.trim() || isProcessing}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? '처리 중...' : '환불 처리 완료'}
                  </button>
                </div>
              </div>
            )}

            {/* 처리 완료된 경우 */}
            {refund.status !== 'pending' && (
              <div className={`rounded-lg p-4 ${
                refund.status === 'approved' || refund.status === 'completed' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h4 className="text-sm font-medium text-gray-900 mb-3">처리 결과</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">처리 결과:</span>
                    <span className={`text-sm font-medium ${
                      refund.status === 'approved' || refund.status === 'completed' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {refund.status === 'approved' ? '승인' :
                       refund.status === 'rejected' ? '반려' : '완료'}
                    </span>
                  </div>
                  {refund.processedDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">처리일:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(refund.processedDate).toLocaleString('ko-KR')}
                      </span>
                    </div>
                  )}
                  {refund.adminNote && (
                    <div className="mt-3">
                      <span className="text-sm text-gray-600">관리자 메모:</span>
                      <p className="text-sm text-gray-900 mt-1 p-2 bg-white rounded border">
                        {refund.adminNote}
                      </p>
                    </div>
                  )}
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
