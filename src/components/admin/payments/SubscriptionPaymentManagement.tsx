'use client';

import { useState, useEffect } from 'react';
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

  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        // TODO: Firebase에서 실제 결제 데이터 조회
        // const paymentsData = await getSubscriptionPayments();
        setPayments([]);
      } catch (error) {
        console.error('결제 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

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
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">💳</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">이용권 결제 관리</h1>
              <p className="text-gray-600 mt-1">학부모와 치료사의 이용권 결제 현황을 관리하세요</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{payments.filter(p => p.status === 'pending').length}</div>
              <div className="text-sm text-gray-500">입금 대기</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{payments.filter(p => p.status === 'completed').length}</div>
              <div className="text-sm text-gray-500">결제 완료</div>
            </div>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <PaymentStatusCards payments={payments} type="subscription" />

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg">🔍</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">이용권 결제 현황</h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
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
              className="px-4 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
            >
              <option value="all">전체 유형</option>
              <option value="parent">학부모</option>
              <option value="teacher">치료사</option>
            </select>

            <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg">
              📊 엑셀 다운로드
            </button>
          </div>
        </div>

        {/* 긴급 처리 필요 알림 */}
        {payments.filter(p => p.status === 'pending').length > 0 && (
          <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-yellow-800">
                주의! {payments.filter(p => p.status === 'pending').length}건의 입금 확인이 필요합니다.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 결제 테이블 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">📋</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">결제 내역</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white rounded-lg border border-green-200 shadow-sm">
                <span className="text-sm font-semibold text-gray-700">총 </span>
                <span className="text-lg font-bold text-green-600">{filteredPayments.length}</span>
                <span className="text-sm font-semibold text-gray-700">건</span>
              </div>
            </div>
          </div>
        </div>
        <SubscriptionTable
          payments={filteredPayments}
          onPaymentSelect={handlePaymentSelect}
          onConfirmPayment={handleConfirmPayment}
        />
      </div>

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
