'use client';

import { useState } from 'react';
import RefundTable from './RefundTable';
import RefundDetailModal from './RefundDetailModal';

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

export default function RefundManagement() {
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // 임시 데이터
  const [refunds] = useState<RefundRequest[]>([
    {
      id: 'RF001',
      userId: 'P001',
      userName: '김○○',
      userType: 'parent',
      refundType: 'subscription',
      originalPaymentId: 'SUB001',
      originalAmount: 9900,
      refundAmount: 6600, // 3일 사용 후 환불
      reason: '개인 사정으로 인한 환불 요청',
      requestDate: '2024-01-20 14:30',
      status: 'pending',
      refundMethod: 'bank_transfer',
      bankInfo: {
        bank: 'KB국민은행',
        accountNumber: '123456-78-901234',
        accountHolder: '김○○'
      }
    },
    {
      id: 'RF002',
      userId: 'T001',
      userName: '이○○',
      userType: 'teacher',
      refundType: 'lesson',
      originalPaymentId: 'LP001',
      originalAmount: 65000,
      refundAmount: 65000,
      reason: '학부모 취소로 인한 첫 수업료 환불',
      requestDate: '2024-01-19 10:15',
      status: 'approved',
      adminNote: '정당한 환불 사유 확인',
      refundMethod: 'bank_transfer',
      bankInfo: {
        bank: '신한은행',
        accountNumber: '987654-32-109876',
        accountHolder: '이○○'
      }
    },
    {
      id: 'RF003',
      userId: 'P002',
      userName: '박○○',
      userType: 'parent',
      refundType: 'subscription',
      originalPaymentId: 'SUB002',
      originalAmount: 9900,
      refundAmount: 0,
      reason: '환불 규정 위반 (이용기간 초과)',
      requestDate: '2024-01-18 16:45',
      status: 'rejected',
      adminNote: '이용기간 20일 초과로 환불 불가',
      processedDate: '2024-01-19 09:00',
      refundMethod: 'bank_transfer'
    },
    {
      id: 'RF004',
      userId: 'T002',
      userName: '정○○',
      userType: 'teacher',
      refundType: 'subscription',
      originalPaymentId: 'SUB003',
      originalAmount: 19900,
      refundAmount: 15920, // 80% 환불
      reason: '서비스 불만족',
      requestDate: '2024-01-17 11:20',
      status: 'completed',
      adminNote: '환불 처리 완료',
      processedDate: '2024-01-18 14:30',
      refundMethod: 'bank_transfer',
      bankInfo: {
        bank: '우리은행',
        accountNumber: '456789-12-345678',
        accountHolder: '정○○'
      }
    }
  ]);

  const handleRefundSelect = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRefund(null);
  };

  const handleRefundAction = (refundId: string, action: 'approve' | 'reject', note: string, amount?: number) => {
    // 실제 구현 시 API 호출
    console.log('Refund action:', { refundId, action, note, amount });
    handleCloseModal();
  };

  const filteredRefunds = refunds.filter(refund => {
    if (statusFilter !== 'all' && refund.status !== statusFilter) return false;
    if (typeFilter !== 'all' && refund.refundType !== typeFilter) return false;
    return true;
  });

  const pendingCount = refunds.filter(r => r.status === 'pending').length;
  const totalRefundAmount = refunds
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.refundAmount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⏳</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">처리 대기</p>
              <p className="text-lg font-semibold text-gray-900">{pendingCount}건</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✅</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">승인</p>
              <p className="text-lg font-semibold text-gray-900">
                {refunds.filter(r => r.status === 'approved').length}건
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">❌</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">반려</p>
              <p className="text-lg font-semibold text-gray-900">
                {refunds.filter(r => r.status === 'rejected').length}건
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">💰</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">총 환불액</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalRefundAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">환불 요청 관리</h2>
          <div className="flex items-center space-x-4">
            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 상태</option>
              <option value="pending">처리 대기</option>
              <option value="approved">승인</option>
              <option value="rejected">반려</option>
              <option value="completed">완료</option>
            </select>

            {/* 유형 필터 */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 유형</option>
              <option value="subscription">이용권</option>
              <option value="lesson">첫 수업료</option>
            </select>

            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              환불 내역 다운로드
            </button>
          </div>
        </div>

        {/* 긴급 처리 알림 */}
        {pendingCount > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">
                {pendingCount}건의 환불 요청이 처리를 기다리고 있습니다.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 환불 테이블 */}
      <RefundTable
        refunds={filteredRefunds}
        onRefundSelect={handleRefundSelect}
      />

      {/* 상세 정보 모달 */}
      {selectedRefund && (
        <RefundDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          refund={selectedRefund}
          onRefundAction={handleRefundAction}
        />
      )}
    </div>
  );
}
