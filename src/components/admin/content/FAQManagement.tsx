'use client';

import { useState, useEffect } from 'react';
import FAQTable from './FAQTable';
import FAQEditModal from './FAQEditModal';
import { FAQ, getAllFAQsForAdmin, addFAQ, updateFAQ, deleteFAQ, initializeFAQs } from '@/lib/faq';

export default function FAQManagement() {
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Firebase에서 실제 데이터 가져오기
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  // FAQ 데이터 로드
  const loadFAQs = async () => {
    try {
      setLoading(true);
      const faqList = await getAllFAQsForAdmin();
      setFaqs(faqList);
    } catch (error) {
      console.error('FAQ 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFAQs();
  }, []);

  const handleFAQSelect = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsCreating(false);
    setIsEditModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedFAQ(null);
    setIsCreating(true);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedFAQ(null);
    setIsCreating(false);
  };

  const handleSaveFAQ = async (faqData: Partial<FAQ>) => {
    try {
      console.log('FAQ 저장 시작:', faqData);
      
      if (isCreating) {
        await addFAQ(faqData as Omit<FAQ, 'id' | 'createdAt' | 'updatedAt' | 'views'>);
        alert('✅ FAQ가 성공적으로 작성되었습니다!');
      } else if (selectedFAQ) {
        await updateFAQ(selectedFAQ.id, faqData);
        alert('✅ FAQ가 성공적으로 수정되었습니다!');
      }
      await loadFAQs(); // 데이터 새로고침
      handleCloseModal();
    } catch (error: unknown) {
      console.error('FAQ 저장 오류 상세:', error);
      
      let errorMessage = 'FAQ 저장 중 오류가 발생했습니다.';
      
      const err = error as { message?: string; code?: string };
      if (err.message) {
        if (err.message.includes('사용자가 인증되지 않았습니다')) {
          errorMessage = '❌ 로그인이 필요합니다.\n페이지를 새로고침하고 다시 로그인해주세요.';
        } else if (err.message.includes('필수 필드가 누락되었습니다')) {
          errorMessage = '❌ 필수 항목을 모두 입력해주세요.\n(카테고리, 질문, 답변)';
        } else if (err.code === 'permission-denied') {
          errorMessage = '❌ 권한이 없습니다.\n관리자 계정으로 로그인했는지 확인해주세요.';
        } else if (err.code === 'unauthenticated') {
          errorMessage = '❌ 인증이 만료되었습니다.\n페이지를 새로고침하고 다시 로그인해주세요.';
        } else if (err.message.includes('Network')) {
          errorMessage = '❌ 네트워크 오류입니다.\n인터넷 연결을 확인해주세요.';
        } else {
          errorMessage = `❌ 오류: ${err.message}`;
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleDeleteFAQ = async (faqId: string) => {
    try {
      await deleteFAQ(faqId);
      await loadFAQs(); // 데이터 새로고침
      handleCloseModal();
    } catch (error) {
      console.error('FAQ 삭제 오류:', error);
      alert('FAQ 삭제 중 오류가 발생했습니다.');
    }
  };

  const filteredFAQs = faqs.filter(faq => {
    if (categoryFilter !== 'all' && faq.category !== categoryFilter) return false;
    if (statusFilter === 'active' && !faq.isActive) return false;
    if (statusFilter === 'inactive' && faq.isActive) return false;
    return true;
  });

  const activeFAQs = faqs.filter(f => f.isActive);
  const totalViews = faqs.reduce((sum, f) => sum + f.views, 0);

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FAQ 관리</h1>
            <p className="text-gray-600 mt-1">자주 묻는 질문을 관리하고 편집합니다</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{activeFAQs.length}</div>
              <div className="text-sm text-gray-500">활성 FAQ</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-500">총 조회수</div>
            </div>
          </div>
        </div>
      </div>

      {/* 상태 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border-2 border-blue-100 p-6 hover:border-blue-200 transition-all duration-200 group">
          <div className="flex items-center">
            <div className="">
              <p className="text-sm font-medium text-gray-500">활성 FAQ</p>
              <p className="text-xl font-bold text-gray-900">{activeFAQs.length}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-green-100 p-6 hover:border-green-200 transition-all duration-200 group">
          <div className="flex items-center">
            <div className="">
              <p className="text-sm font-medium text-gray-500">자주묻는질문</p>
              <p className="text-xl font-bold text-gray-900">
                {faqs.filter(f => f.category === 'general').length}개
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-purple-100 p-6 hover:border-purple-200 transition-all duration-200 group">
          <div className="flex items-center">
            <div className="">
              <p className="text-sm font-medium text-gray-500">결제 및 환불</p>
              <p className="text-xl font-bold text-gray-900">
                {faqs.filter(f => f.category === 'payment').length}개
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-orange-100 p-6 hover:border-orange-200 transition-all duration-200 group">
          <div className="flex items-center">
            <div className="">
              <p className="text-sm font-medium text-gray-500">총 조회수</p>
              <p className="text-xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-blue-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">FAQ 필터 및 관리</h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* 카테고리 필터 */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">전체 카테고리</option>
              <option value="common">공통질문</option>
              <option value="parent">학부모 회원</option>
              <option value="therapist">치료사 회원</option>
              <option value="payment">결제 및 회원</option>
            </select>

            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>

            <div className="flex items-center space-x-3">
              {faqs.length === 0 && (
                <button
                  onClick={async () => {
                    if (confirm('기본 FAQ 데이터를 초기화하시겠습니까?')) {
                      try {
                        await initializeFAQs();
                        await loadFAQs();
                        alert('기본 FAQ 데이터가 초기화되었습니다.');
                      } catch (error) {
                        console.error('FAQ 초기화 오류:', error);
                        alert('FAQ 초기화 중 오류가 발생했습니다.');
                      }
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
                >
                  🌱 기본 데이터 초기화
                </button>
              )}
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
              >
                + 새 FAQ 작성
              </button>
            </div>
          </div>
        </div>

        {/* 인기 FAQ 알림 */}
        {faqs.length > 0 && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-blue-800">
                  가장 많이 조회된 FAQ: &ldquo;{faqs.sort((a, b) => b.views - a.views)[0]?.question}&rdquo;
                </span>
              </div>
              <span className="text-sm text-blue-600 font-semibold">
                {faqs.sort((a, b) => b.views - a.views)[0]?.views.toLocaleString()}회 조회
              </span>
            </div>
          </div>
        )}
      </div>

      {/* FAQ 목록 */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-blue-100">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">FAQ 목록</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                총 {filteredFAQs.length}개
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">FAQ 데이터를 불러오는 중...</span>
            </div>
          ) : filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">FAQ가 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500">
                {faqs.length === 0 ? '첫 번째 FAQ를 작성해보세요.' : '검색 조건에 맞는 FAQ가 없습니다.'}
              </p>
              {faqs.length === 0 && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    새 FAQ 작성
                  </button>
                </div>
              )}
            </div>
          ) : (
            <FAQTable
              faqs={filteredFAQs}
              onFAQSelect={handleFAQSelect}
            />
          )}
        </div>
      </div>

      {/* FAQ 편집 모달 */}
      <FAQEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        faq={selectedFAQ}
        isCreating={isCreating}
        onSave={handleSaveFAQ}
        onDelete={handleDeleteFAQ}
      />
    </div>
  );
}
