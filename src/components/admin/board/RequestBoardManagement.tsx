'use client';

import { useState, useEffect } from 'react';
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

  const [posts, setPosts] = useState<RequestPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // TODO: Firebase에서 실제 요청글 데이터 조회
        // const postsData = await getRequestPosts();
        setPosts([]);
      } catch (error) {
        console.error('요청글 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">📝</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">요청글 관리</h1>
              <p className="text-gray-600 mt-1">학부모의 치료 요청글을 관리하고 모니터링하세요</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{posts.filter(p => p.status === 'recruiting').length}</div>
              <div className="text-sm text-gray-500">모집 중</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">{posts.filter(p => p.urgent).length}</div>
              <div className="text-sm text-gray-500">급구 요청</div>
            </div>
          </div>
        </div>
      </div>

      {/* 상태 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">📝</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">모집 중</p>
              <div className="flex items-baseline space-x-1">
                <p className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                  {posts.filter(p => p.status === 'recruiting').length}
                </p>
                <span className="text-sm font-medium text-gray-600">건</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">매칭 완료</p>
              <div className="flex items-baseline space-x-1">
                <p className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                  {posts.filter(p => p.status === 'matched').length}
                </p>
                <span className="text-sm font-medium text-gray-600">건</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">🚨</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">급구 요청</p>
              <div className="flex items-baseline space-x-1">
                <p className="text-2xl font-bold text-red-600 group-hover:text-red-700 transition-colors">
                  {posts.filter(p => p.urgent).length}
                </p>
                <span className="text-sm font-medium text-gray-600">건</span>
              </div>
              {posts.filter(p => p.urgent).length > 0 && (
                <div className="mt-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block mr-2"></div>
                  <span className="text-xs text-red-600 font-medium">즉시 처리 필요</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">⭐</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">프리미엄</p>
              <div className="flex items-baseline space-x-1">
                <p className="text-2xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                  {posts.filter(p => p.premium).length}
                </p>
                <span className="text-sm font-medium text-gray-600">건</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-emerald-600 text-lg">🔍</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">요청글 관리</h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
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
              className="px-4 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
            >
              <option value="all">전체 치료</option>
              {treatmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg">
              📊 게시글 통계
            </button>
          </div>
        </div>

        {/* 급구 요청 알림 */}
        {posts.filter(p => p.urgent && p.status === 'recruiting').length > 0 && (
          <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-red-800">
                긴급! {posts.filter(p => p.urgent && p.status === 'recruiting').length}건의 급구 요청이 처리를 기다리고 있습니다.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 요청글 테이블 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-emerald-600 text-lg">📋</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">요청글 목록</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white rounded-lg border border-emerald-200 shadow-sm">
                <span className="text-sm font-semibold text-gray-700">총 </span>
                <span className="text-lg font-bold text-emerald-600">{filteredPosts.length}</span>
                <span className="text-sm font-semibold text-gray-700">건</span>
              </div>
            </div>
          </div>
        </div>
        <RequestPostTable
          posts={filteredPosts}
          onPostSelect={handlePostSelect}
        />
      </div>

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
