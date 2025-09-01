'use client';

import { useState } from 'react';
import PaymentStatusCards from './PaymentStatusCards';
import LessonPaymentTable from './LessonPaymentTable';
import LessonPaymentDetailModal from './LessonPaymentDetailModal';

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
  commission: number; // 수수료
}

export default function LessonPaymentManagement() {
  const [selectedPayment, setSelectedPayment] = useState<LessonPayment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // 실제 데이터 (Firebase에서 가져올 예정)
  const [payments] = useState<LessonPayment[]>([]);

  const handlePaymentSelect = (payment: LessonPayment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPayment(null);
  };

  const handleConfirmPaymentAndShare = (paymentId: string) => {
    // 실제 구현 시 API 호출
    // 1. 결제 확인
    // 2. 연락처 공개
    // 3. 게시글 상태 변경
    console.log('Payment confirmed and contacts shared:', paymentId);
    handleCloseModal();
  };

  const filteredPayments = payments.filter(payment => {
    if (statusFilter === 'all') return true;
    return payment.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <PaymentStatusCards payments={payments} type="lesson" />

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">첫 수업료 결제 현황</h2>
          <div className="flex items-center space-x-4">
            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 상태</option>
              <option value="pending">결제 대기</option>
              <option value="completed">결제 완료</option>
              <option value="settlement_pending">정산 대기</option>
              <option value="settlement_completed">정산 완료</option>
              <option value="failed">결제 실패</option>
            </select>

            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              정산 내역 다운로드
            </button>
          </div>
        </div>

        {/* 중요한 알림 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {payments.filter(p => p.status === 'pending').length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-yellow-800">
                  {payments.filter(p => p.status === 'pending').length}건의 입금 확인 필요
                </span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                입금 확인 후 연락처가 자동으로 공개됩니다.
              </p>
            </div>
          )}

          {payments.filter(p => p.status === 'completed' && !p.contactShared).length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-blue-800">
                  연락처 공개 대기 건이 있습니다.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 결제 테이블 */}
      <LessonPaymentTable
        payments={filteredPayments}
        onPaymentSelect={handlePaymentSelect}
        onConfirmPaymentAndShare={handleConfirmPaymentAndShare}
      />

      {/* 상세 정보 모달 */}
      {selectedPayment && (
        <LessonPaymentDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          payment={selectedPayment}
          onConfirmPaymentAndShare={handleConfirmPaymentAndShare}
        />
      )}
    </div>
  );
}
