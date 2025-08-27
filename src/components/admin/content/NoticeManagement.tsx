'use client';

import { useState } from 'react';
import NoticeTable from './NoticeTable';
import NoticeEditModal from './NoticeEditModal';

interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'important' | 'urgent';
  displayLocation: 'main' | 'mypage' | 'popup';
  isActive: boolean;
  startDate: string;
  endDate?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  priority: number;
  targetAudience: 'all' | 'parents' | 'teachers';
}

export default function NoticeManagement() {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // 실제 공지사항 데이터
  const [notices] = useState<Notice[]>([
    {
      id: 'NOT001',
      title: '🎉 더모든 키즈 정식 서비스 오픈 안내',
      content: '안녕하세요. 더모든 키즈입니다.\n\n드디어 더모든 키즈가 정식 서비스를 시작하게 되었습니다. 발달치료가 필요한 아이들과 전문 치료사를 안전하게 연결하는 플랫폼으로 최선을 다하겠습니다.\n\n🔹 주요 서비스\n- 언어치료, 감각통합치료, 놀이치료, 인지학습치료 전문가 매칭\n- 안전결제 시스템을 통한 신뢰할 수 있는 거래\n- 체계적인 치료사 검증 시스템\n\n앞으로도 아이들의 건강한 발달을 위해 노력하겠습니다.\n감사합니다.',
      type: 'important',
      displayLocation: 'main',
      isActive: true,
      startDate: '2024-01-20 00:00',
      endDate: '2024-02-20 23:59',
      views: 1847,
      createdAt: '2024-01-20 10:00',
      updatedAt: '2024-01-20 10:00',
      createdBy: '관리자',
      priority: 1,
      targetAudience: 'all'
    },
    {
      id: 'NOT002',
      title: '[긴급] 시스템 점검 안내 (1/25 새벽 2-4시)',
      content: '안녕하세요. 더모든 키즈입니다.\n\n서비스 안정성 향상 및 기능 개선을 위한 시스템 점검을 실시합니다.\n\n📅 점검 일시: 2024년 1월 25일(목) 새벽 2:00 ~ 4:00 (약 2시간)\n🔧 점검 내용: 서버 최적화, 보안 업데이트, 매칭 알고리즘 개선\n\n점검 시간 동안 서비스 이용이 일시 중단됩니다.\n이용에 불편을 드려 죄송합니다.\n\n문의사항은 고객센터로 연락 부탁드립니다.',
      type: 'urgent',
      displayLocation: 'popup',
      isActive: true,
      startDate: '2024-01-22 00:00',
      endDate: '2024-01-26 00:00',
      views: 1293,
      createdAt: '2024-01-22 14:30',
      updatedAt: '2024-01-22 14:30',
      createdBy: '관리자',
      priority: 1,
      targetAudience: 'all'
    },
    {
      id: 'NOT003',
      title: '안전결제 시스템 이용 안내',
      content: '안녕하세요. 학부모님들의 안전한 거래를 위한 안전결제 시스템 안내를 드립니다.\n\n💳 안전결제 시스템이란?\n첫 수업료를 플랫폼에서 보관하다가 수업 진행 후 치료사에게 정산하는 시스템입니다.\n\n🔒 안전한 이유\n- 수업 전 미리 결제하여 치료사와의 신뢰 관계 구축\n- 만족스럽지 않을 경우 전액 환불 가능\n- 직거래로 인한 사기 위험 방지\n\n⚠️ 직거래 금지 안내\n플랫폼 외부에서의 직접 거래는 안전을 위해 금지되며, 이를 위반할 경우 이용 제재를 받을 수 있습니다.\n\n문의사항은 고객센터로 연락해주세요.',
      type: 'general',
      displayLocation: 'main',
      isActive: true,
      startDate: '2024-01-15 00:00',
      views: 742,
      createdAt: '2024-01-15 09:00',
      updatedAt: '2024-01-18 16:20',
      createdBy: '관리자',
      priority: 3,
      targetAudience: 'parents'
    },
    {
      id: 'NOT004',
      title: '치료사 프로필 인증 절차 안내',
      content: '안녕하세요. 치료사 선생님들을 위한 프로필 인증 절차를 안내드립니다.\n\n📋 필수 제출 서류\n1. 졸업증명서 (학사 이상)\n2. 관련 자격증 (언어재활사, 작업치료사 등)\n3. 경력증명서 (해당 시)\n4. 신분증 사본\n\n✅ 인증 절차\n1. 서류 제출\n2. 관리자 검토 (1-3일 소요)\n3. 승인/반려 알림\n4. 승인 시 \'인증 치료사\' 배지 부여\n\n🏆 인증 혜택\n- 검색 결과 상위 노출\n- 학부모 신뢰도 향상\n- 매칭 성공률 증가\n\n정확한 정보 제공 부탁드리며, 허위 정보 제출 시 영구 이용 제재를 받을 수 있습니다.',
      type: 'general',
      displayLocation: 'mypage',
      isActive: true,
      startDate: '2024-01-10 00:00',
      views: 568,
      createdAt: '2024-01-10 11:00',
      updatedAt: '2024-01-15 14:45',
      createdBy: '관리자',
      priority: 2,
      targetAudience: 'teachers'
    }
  ]);

  const handleNoticeSelect = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsCreating(false);
    setIsEditModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedNotice(null);
    setIsCreating(true);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedNotice(null);
    setIsCreating(false);
  };

  const handleSaveNotice = (noticeData: Partial<Notice>) => {
    // 실제 구현 시 API 호출
    console.log('Save notice:', noticeData);
    handleCloseModal();
  };

  const handleDeleteNotice = (noticeId: string) => {
    // 실제 구현 시 API 호출
    console.log('Delete notice:', noticeId);
    handleCloseModal();
  };

  const filteredNotices = notices.filter(notice => {
    if (typeFilter !== 'all' && notice.type !== typeFilter) return false;
    if (statusFilter === 'active' && !notice.isActive) return false;
    if (statusFilter === 'inactive' && notice.isActive) return false;
    return true;
  });

  const activeNotices = notices.filter(n => n.isActive);
  const urgentNotices = notices.filter(n => n.type === 'urgent' && n.isActive);

  return (
    <div className="space-y-6">
      {/* 상태 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📢</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">활성 공지</p>
              <p className="text-lg font-semibold text-gray-900">{activeNotices.length}건</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🚨</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">긴급 공지</p>
              <p className="text-lg font-semibold text-gray-900">{urgentNotices.length}건</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">💬</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">팝업 공지</p>
              <p className="text-lg font-semibold text-gray-900">
                {notices.filter(n => n.displayLocation === 'popup' && n.isActive).length}건
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">👁️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">총 조회수</p>
              <p className="text-lg font-semibold text-gray-900">
                {notices.reduce((sum, n) => sum + n.views, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">공지사항 관리</h2>
          <div className="flex items-center space-x-4">
            {/* 유형 필터 */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 유형</option>
              <option value="general">일반</option>
              <option value="important">중요</option>
              <option value="urgent">긴급</option>
            </select>

            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>

            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              + 새 공지 작성
            </button>
          </div>
        </div>

        {/* 긴급 공지 알림 */}
        {urgentNotices.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-red-800">
                {urgentNotices.length}건의 긴급 공지가 활성화되어 있습니다.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 공지사항 테이블 */}
      <NoticeTable
        notices={filteredNotices}
        onNoticeSelect={handleNoticeSelect}
      />

      {/* 공지사항 편집 모달 */}
      <NoticeEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        notice={selectedNotice}
        isCreating={isCreating}
        onSave={handleSaveNotice}
        onDelete={handleDeleteNotice}
      />
    </div>
  );
}
