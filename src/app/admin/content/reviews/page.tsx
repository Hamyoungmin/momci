'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Review {
  id: string;
  title: string;
  content: string;
  category: string;
  therapist?: string;
  author?: string;
  rating: number;
  helpfulCount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  userId?: string;
  userEmail?: string;
}

export default function ReviewsManagePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = ['전체', '언어치료', '놀이치료', '감각통합치료', '작업치료', 'ABA치료', '미술치료', '음악치료'];

  // 후기 데이터 가져오기
  useEffect(() => {
    let reviewsQuery;
    
    if (filter === 'all') {
      reviewsQuery = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc')
      );
    } else {
      reviewsQuery = query(
        collection(db, 'reviews'),
        where('status', '==', filter),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Review[];
      
      setReviews(reviewsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter]);

  // 후기 승인
  const approveReview = async (reviewId: string) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        status: 'approved'
      });
      alert('후기가 승인되었습니다.');
    } catch (error) {
      console.error('후기 승인 실패:', error);
      alert('후기 승인에 실패했습니다.');
    }
  };

  // 후기 거부
  const rejectReview = async (reviewId: string) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        status: 'rejected'
      });
      alert('후기가 거부되었습니다.');
    } catch (error) {
      console.error('후기 거부 실패:', error);
      alert('후기 거부에 실패했습니다.');
    }
  };

  // 후기 삭제
  const deleteReview = async (reviewId: string) => {
    if (!confirm('정말로 이 후기를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      alert('후기가 삭제되었습니다.');
    } catch (error) {
      console.error('후기 삭제 실패:', error);
      alert('후기 삭제에 실패했습니다.');
    }
  };

  // 필터링된 후기
  const filteredReviews = selectedCategory === '전체' 
    ? reviews 
    : reviews.filter(review => review.category === selectedCategory);

  // 상태별 카운트
  const statusCounts = {
    all: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-sm ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">승인 대기</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">승인됨</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">거부됨</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">알 수 없음</span>;
    }
  };

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">후기 관리</h1>
        <p className="text-gray-600 mt-2">등록된 후기를 관리하고 승인/거부 처리를 할 수 있습니다</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 후기</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">승인 대기</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 text-xl">⏰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">승인됨</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.approved}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">거부됨</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <span className="text-red-600 text-xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 영역 */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 상태 필터 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체 ({statusCounts.all})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              승인 대기 ({statusCounts.pending})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              승인됨 ({statusCounts.approved})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              거부됨 ({statusCounts.rejected})
            </button>
          </div>

          {/* 카테고리 필터 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 후기 목록 */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">후기를 불러오는 중...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-8 text-center">
            <span className="text-4xl mb-4 block">📝</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">후기가 없습니다</h3>
            <p className="text-gray-600">선택한 조건에 맞는 후기가 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* 헤더 */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {review.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600 ml-1">({review.rating}.0)</span>
                      </div>
                      {getStatusBadge(review.status)}
                    </div>

                    {/* 제목 */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {review.title}
                    </h3>

                    {/* 내용 */}
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                      {review.content}
                    </p>

                    {/* 메타 정보 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">작성자:</span> {review.author || '익명'}
                      </div>
                      {review.therapist && (
                        <div>
                          <span className="font-medium">치료사:</span> {review.therapist}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">작성일:</span> {
                          review.createdAt ? 
                            review.createdAt.toLocaleDateString('ko-KR') : 
                            '날짜정보없음'
                        }
                      </div>
                      <div>
                        <span className="font-medium">도움:</span> {review.helpfulCount || 0}개
                      </div>
                    </div>

                    {/* 사용자 정보 */}
                    {review.userEmail && (
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">등록 이메일:</span> {review.userEmail}
                      </div>
                    )}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex flex-col gap-2 ml-4">
                    {review.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approveReview(review.id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => rejectReview(review.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                        >
                          거부
                        </button>
                      </>
                    )}
                    {review.status === 'approved' && (
                      <button
                        onClick={() => rejectReview(review.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                      >
                        승인 취소
                      </button>
                    )}
                    {review.status === 'rejected' && (
                      <button
                        onClick={() => approveReview(review.id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                      >
                        승인
                      </button>
                    )}
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
