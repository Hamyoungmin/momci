'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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

  useEffect(() => {
    console.log('🔥 관리자 페이지 - Firebase 실시간 게시글 데이터 로딩 시작');

    // posts 컬렉션에서 모든 게시글을 실시간으로 가져오기 (요청글 + 선생님 둘러보기)
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      console.log('📥 관리자 실시간 게시글 데이터 업데이트:', snapshot.size, '개의 문서');
      
      const postsData: RequestPost[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log('📝 게시글 데이터:', doc.id, data);

        // Firebase 데이터를 RequestPost 인터페이스에 맞게 변환
        const post: RequestPost = {
          id: doc.id,
          parentId: data.authorId || 'unknown',
          parentName: data.title || `${data.age || ''} ${data.gender || ''} ${data.treatment || '치료'} 요청`,
          title: data.title || `${data.age || ''} ${data.gender || ''} ${data.treatment || '치료'} 요청`,
          content: data.additionalInfo || data.details || '상세 내용 없음',
          childInfo: {
            age: data.age || '정보 없음',
            gender: data.gender === '남' ? 'male' : data.gender === '여' ? 'female' : 'male',
            condition: data.treatment || '정보 없음'
          },
          treatmentTypes: [data.treatment || '기타'],
          location: data.region || '정보 없음',
          schedule: data.timeDetails || '협의',
          budget: data.price || '협의',
          status: data.status === 'active' ? 'recruiting' : data.status === 'matched' ? 'matched' : 'closed',
          applicants: data.applications || 0,
          createdAt: data.createdAt ? 
            (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : new Date(data.createdAt).toISOString()) :
            new Date().toISOString(),
          updatedAt: data.updatedAt ? 
            (data.updatedAt.toDate ? data.updatedAt.toDate().toISOString() : new Date(data.updatedAt).toISOString()) :
            new Date().toISOString(),
          views: 0, // 조회수는 현재 저장하지 않음
          premium: false, // 프리미엄 여부는 현재 저장하지 않음
          urgent: false // 급구 여부는 현재 저장하지 않음
        };

        postsData.push(post);
      });

      console.log('✅ 관리자 페이지 게시글 데이터 로딩 완료:', postsData.length, '건');
      setPosts(postsData);
    }, (error) => {
      console.error('❌ 관리자 페이지 게시글 데이터 로딩 오류:', error);
    });

    return () => {
      console.log('🧹 관리자 페이지 게시글 구독 해제');
      unsubscribe();
    };
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">요청글 관리</h1>
            <p className="text-gray-600 mt-1">학부모의 치료 요청글을 관리하고 모니터링하세요</p>
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
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">모집 중</p>
            <div className="flex items-baseline space-x-1">
              <p className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                {posts.filter(p => p.status === 'recruiting').length}
              </p>
              <span className="text-sm font-medium text-gray-600">건</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">매칭 완료</p>
            <div className="flex items-baseline space-x-1">
              <p className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                {posts.filter(p => p.status === 'matched').length}
              </p>
              <span className="text-sm font-medium text-gray-600">건</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div>
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

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div>
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

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
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
              게시글 통계
            </button>
          </div>
        </div>

        {/* 급구 요청 알림 */}
        {posts.filter(p => p.urgent && p.status === 'recruiting').length > 0 && (
          <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-center">

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
            <div>
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
