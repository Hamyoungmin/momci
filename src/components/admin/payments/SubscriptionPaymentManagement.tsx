'use client';

import { useState } from 'react';
import PaymentStatusCards from './PaymentStatusCards';
import SubscriptionTable from './SubscriptionTable';
import VirtualAccountModal from './VirtualAccountModal';

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

export default function SubscriptionPaymentManagement() {
  const [selectedPayment, setSelectedPayment] = useState<SubscriptionPayment | null>(null);
  const [isVirtualAccountModalOpen, setIsVirtualAccountModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');

  // 임시 데이터
  const [payments] = useState<SubscriptionPayment[]>([
    {
      id: 'SUB001',
      userId: 'P001',
      userName: '김○○',
      userType: 'parent',
      planType: 'monthly',
      amount: 9900,
      paymentMethod: 'virtual_account',
      status: 'pending',
      orderDate: '2024-01-20 14:30',
      virtualAccount: {
        bank: 'KB국민은행',
        accountNumber: '123456-78-901234',
        accountHolder: '(주)더모든키즈',
        expireDate: '2024-01-22 23:59'
      }
    },
    {
      id: 'SUB002',
      userId: 'T001',
      userName: '이○○',
      userType: 'teacher',
      planType: 'monthly',
      amount: 19900,
      paymentMethod: 'virtual_account',
      status: 'completed',
      orderDate: '2024-01-19 10:15',
      paidDate: '2024-01-19 15:30',
      activePeriod: {
        startDate: '2024-01-19',
        endDate: '2024-02-19'
      }
    },
    {
      id: 'SUB003',
      userId: 'P002',
      userName: '박○○',
      userType: 'parent',
      planType: 'monthly',
      amount: 9900,
      paymentMethod: 'virtual_account',
      status: 'failed',
      orderDate: '2024-01-18 16:45'
    },
    {
      id: 'SUB004',
      userId: 'T002',
      userName: '정○○',
      userType: 'teacher',
      planType: 'yearly',
      amount: 199000,
      paymentMethod: 'virtual_account',
      status: 'completed',
      orderDate: '2024-01-17 11:20',
      paidDate: '2024-01-17 14:50',
      activePeriod: {
        startDate: '2024-01-17',
        endDate: '2025-01-17'
      }
    }
  ]);

  const handlePaymentSelect = (payment: SubscriptionPayment) => {
    setSelectedPayment(payment);
    setIsVirtualAccountModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsVirtualAccountModalOpen(false);
    setSelectedPayment(null);
  };

  const handleConfirmPayment = (paymentId: string) => {
    // 실제 구현 시 API 호출하여 결제 확인 처리
    console.log('Payment confirmed:', paymentId);
    handleCloseModal();
  };

  const filteredPayments = payments.filter(payment => {
    if (statusFilter !== 'all' && payment.status !== statusFilter) return false;
    if (userTypeFilter !== 'all' && payment.userType !== userTypeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <PaymentStatusCards payments={payments} type="subscription" />

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">이용권 결제 현황</h2>
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
              <option value="failed">결제 실패</option>
              <option value="cancelled">취소</option>
            </select>

            {/* 사용자 타입 필터 */}
            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 유형</option>
              <option value="parent">학부모</option>
              <option value="teacher">치료사</option>
            </select>

            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              엑셀 다운로드
            </button>
          </div>
        </div>

        {/* 긴급 처리 필요 알림 */}
        {payments.filter(p => p.status === 'pending').length > 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">
                {payments.filter(p => p.status === 'pending').length}건의 입금 확인이 필요합니다.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 결제 테이블 */}
      <SubscriptionTable
        payments={filteredPayments}
        onPaymentSelect={handlePaymentSelect}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* 가상계좌 정보 모달 */}
      {selectedPayment && (
        <VirtualAccountModal
          isOpen={isVirtualAccountModalOpen}
          onClose={handleCloseModal}
          payment={selectedPayment}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </div>
  );
}
