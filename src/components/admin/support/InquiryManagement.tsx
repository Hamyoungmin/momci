'use client';

import { useState, useEffect } from 'react';
import InquiryStatusCards from './InquiryStatusCards';
import InquiryTable from './InquiryTable';
import InquiryDetailModal from './InquiryDetailModal';
import TemplateManagementModal from './TemplateManagementModal';

interface Inquiry {
  id: string;
  userId: string;
  userName: string;
  userType: 'parent' | 'teacher';
  userEmail: string;
  category: 'service' | 'payment' | 'technical' | 'account' | 'other';
  title: string;
  content: string;
  status: 'pending' | 'assigned' | 'answered' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  attachments: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
  tags: string[];
  responseTime?: number; // 답변까지 걸린 시간 (시간 단위)
}

export default function InquiryManagement() {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Firebase에서 실제 데이터 가져오기
  const [inquiries] = useState<Inquiry[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Firebase에서 실제 문의 데이터 가져오기
    // setInquiries(inquiriesData);
    // setLoading(false);
  }, []);

  const handleInquirySelect = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedInquiry(null);
  };

  const handleInquiryAction = (
    inquiryId: string,
    action: 'assign' | 'answer' | 'close',
    data: {
      assignee?: string;
      answer?: string;
      priority?: string;
    }
  ) => {
    // 실제 구현 시 API 호출
    console.log('Inquiry action:', { inquiryId, action, data });
    handleCloseModal();
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (statusFilter !== 'all' && inquiry.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && inquiry.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && inquiry.priority !== priorityFilter) return false;
    return true;
  });

  const pendingInquiries = inquiries.filter(i => i.status === 'pending');
  const urgentInquiries = inquiries.filter(i => i.priority === 'urgent');

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">고객지원 관리</h1>
            <p className="text-gray-600 mt-1">고객 문의 및 지원 요청을 관리합니다</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{pendingInquiries.length}</div>
              <div className="text-sm text-gray-500">대기 중</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">{urgentInquiries.length}</div>
              <div className="text-sm text-gray-500">긴급</div>
            </div>
          </div>
        </div>
      </div>

      {/* 긴급 알림 */}
      {urgentInquiries.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-bold text-red-800 flex items-center">
                긴급 처리 필요
                <span className="ml-2 px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                  {urgentInquiries.length}건
                </span>
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>우선 처리가 필요한 긴급 문의가 있습니다. 즉시 확인해주세요.</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setPriorityFilter('urgent')}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
                >
                  긴급 문의 확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 상태 카드 */}
      <InquiryStatusCards inquiries={inquiries} />

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-purple-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">문의 필터 및 관리</h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">전체 상태</option>
              <option value="pending">접수</option>
              <option value="assigned">배정</option>
              <option value="answered">답변 완료</option>
              <option value="closed">종료</option>
            </select>

            {/* 카테고리 필터 */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">전체 유형</option>
              <option value="service">서비스 이용</option>
              <option value="payment">결제 관련</option>
              <option value="technical">기술 지원</option>
              <option value="account">계정 관련</option>
              <option value="other">기타</option>
            </select>

            {/* 우선순위 필터 */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-sm border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">전체 우선순위</option>
              <option value="urgent">긴급</option>
              <option value="high">높음</option>
              <option value="medium">보통</option>
              <option value="low">낮음</option>
            </select>

            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
            >
              답변 템플릿
            </button>

            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
              문의 통계
            </button>
          </div>
        </div>

        {/* 처리 현황 알림 */}
        {pendingInquiries.length > 0 && (
          <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-yellow-800">
                {pendingInquiries.length}건의 새로운 문의가 답변을 기다리고 있습니다.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 문의 목록 */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-purple-100">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-purple-100 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">문의 목록</h3>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                총 {filteredInquiries.length}건
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <InquiryTable
            inquiries={filteredInquiries}
            onInquirySelect={handleInquirySelect}
          />
        </div>
      </div>

      {/* 문의 상세 모달 */}
      {selectedInquiry && (
        <InquiryDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          inquiry={selectedInquiry}
          onInquiryAction={handleInquiryAction}
        />
      )}

      {/* 템플릿 관리 모달 */}
      <TemplateManagementModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
    </div>
  );
}
