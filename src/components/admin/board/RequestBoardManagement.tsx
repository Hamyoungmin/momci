'use client';

import { useState } from 'react';
import RequestPostTable from './RequestPostTable';
import RequestPostDetailModal from './RequestPostDetailModal';

interface RequestPost {
  id: string;
  parentId: string;
  parentName: string;
  title: string;
  content: string;
  childInfo: {
    age: string;
    gender: 'male' | 'female';
    condition: string;
  };
  treatmentTypes: string[];
  location: string;
  schedule: string;
  budget: string;
  status: 'recruiting' | 'matched' | 'closed';
  applicants: number;
  createdAt: string;
  updatedAt: string;
  views: number;
  premium: boolean;
  urgent: boolean;
}

export default function RequestBoardManagement() {
  const [selectedPost, setSelectedPost] = useState<RequestPost | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [treatmentFilter, setTreatmentFilter] = useState('all');

  // 임시 데이터
  const [posts] = useState<RequestPost[]>([
    {
      id: 'REQ001',
      parentId: 'P001',
      parentName: '김○○',
      title: '5세 남아 언어치료 선생님을 찾습니다',
      content: '발음이 부정확하고 어휘력이 부족한 것 같아서 전문적인 도움이 필요합니다...',
      childInfo: {
        age: '5세',
        gender: 'male',
        condition: '언어발달지연'
      },
      treatmentTypes: ['언어치료'],
      location: '서울 강남구',
      schedule: '주 2회, 오후 2-4시',
      budget: '회당 6-8만원',
      status: 'recruiting',
      applicants: 3,
      createdAt: '2024-01-20 14:30',
      updatedAt: '2024-01-20 14:30',
      views: 24,
      premium: true,
      urgent: false
    },
    {
      id: 'REQ002',
      parentId: 'P002',
      parentName: '박○○',
      title: '3세 감각통합치료 + 놀이치료 통합 요청',
      content: '감각 과민이 심하고 사회성 발달이 늦어서 복합적인 치료가 필요한 상황입니다...',
      childInfo: {
        age: '3세',
        gender: 'female',
        condition: '감각통합장애'
      },
      treatmentTypes: ['감각통합치료', '놀이치료'],
      location: '경기 성남시',
      schedule: '주 3회, 오전 10-12시',
      budget: '회당 7-9만원',
      status: 'matched',
      applicants: 5,
      createdAt: '2024-01-19 10:15',
      updatedAt: '2024-01-20 09:30',
      views: 42,
      premium: false,
      urgent: true
    },
    {
      id: 'REQ003',
      parentId: 'P003',
      parentName: '최○○',
      title: '7세 인지학습치료 선생님 구합니다 (급구)',
      content: '학습 집중력이 부족하고 기억력에 문제가 있어서 전문적인 인지치료가 필요합니다...',
      childInfo: {
        age: '7세',
        gender: 'male',
        condition: 'ADHD'
      },
      treatmentTypes: ['인지학습치료'],
      location: '부산 해운대구',
      schedule: '주 2회, 방과후',
      budget: '회당 5-7만원',
      status: 'closed',
      applicants: 8,
      createdAt: '2024-01-18 16:45',
      updatedAt: '2024-01-19 20:10',
      views: 67,
      premium: false,
      urgent: true
    }
  ]);

  const handlePostSelect = (post: RequestPost) => {
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPost(null);
  };

  const handlePostAction = (postId: string, action: 'hide' | 'show' | 'delete' | 'close', reason?: string) => {
    // 실제 구현 시 API 호출
    console.log('Post action:', { postId, action, reason });
    handleCloseModal();
  };

  const filteredPosts = posts.filter(post => {
    if (statusFilter !== 'all' && post.status !== statusFilter) return false;
    if (treatmentFilter !== 'all' && !post.treatmentTypes.includes(treatmentFilter)) return false;
    return true;
  });

  const treatmentTypes = ['언어치료', '감각통합치료', '놀이치료', '인지학습치료', '음악치료', '미술치료'];

  return (
    <div className="space-y-6">
      {/* 상태 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📝</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">모집 중</p>
              <p className="text-lg font-semibold text-gray-900">
                {posts.filter(p => p.status === 'recruiting').length}건
              </p>
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
              <p className="text-sm font-medium text-gray-500">매칭 완료</p>
              <p className="text-lg font-semibold text-gray-900">
                {posts.filter(p => p.status === 'matched').length}건
              </p>
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
              <p className="text-sm font-medium text-gray-500">급구 요청</p>
              <p className="text-lg font-semibold text-gray-900">
                {posts.filter(p => p.urgent).length}건
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⭐</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">프리미엄</p>
              <p className="text-lg font-semibold text-gray-900">
                {posts.filter(p => p.premium).length}건
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">요청글 관리</h2>
          <div className="flex items-center space-x-4">
            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 상태</option>
              <option value="recruiting">모집 중</option>
              <option value="matched">매칭 완료</option>
              <option value="closed">마감</option>
            </select>

            {/* 치료 종목 필터 */}
            <select
              value={treatmentFilter}
              onChange={(e) => setTreatmentFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 치료</option>
              {treatmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              게시글 통계
            </button>
          </div>
        </div>

        {/* 급구 요청 알림 */}
        {posts.filter(p => p.urgent && p.status === 'recruiting').length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-red-800">
                {posts.filter(p => p.urgent && p.status === 'recruiting').length}건의 급구 요청이 있습니다.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 요청글 테이블 */}
      <RequestPostTable
        posts={filteredPosts}
        onPostSelect={handlePostSelect}
      />

      {/* 상세 정보 모달 */}
      {selectedPost && (
        <RequestPostDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          post={selectedPost}
          onPostAction={handlePostAction}
        />
      )}
    </div>
  );
}
