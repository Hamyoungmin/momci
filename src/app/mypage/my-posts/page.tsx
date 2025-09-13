'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Post {
  id: string;
  treatment: string;
  region: string;
  age: string;
  gender: string;
  frequency: string;
  timeDetails: string;
  price: string;
  additionalInfo?: string;
  status: string;
  createdAt: Timestamp;
  applications: number;
}

export default function MyPostsPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/auth/login');
    }
  }, [currentUser, loading, router]);

  // 내가 작성한 게시글 가져오기
  useEffect(() => {
    if (!currentUser) return;

    console.log('📝 내 게시글 가져오기 시작 - 사용자:', currentUser.uid);
    setPostsLoading(true);

    const postsQuery = query(
      collection(db, 'posts'),
      where('authorId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const myPosts: Post[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        myPosts.push({
          id: doc.id,
          ...data
        } as Post);
      });

      // 클라이언트에서 정렬 (createdAt 기준)
      myPosts.sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.toDate() : new Date(0);
        const timeB = b.createdAt ? b.createdAt.toDate() : new Date(0);
        return timeB.getTime() - timeA.getTime();
      });

      console.log('✅ 내 게시글 조회 완료:', myPosts.length, '개');
      setPosts(myPosts);
      setPostsLoading(false);
    }, (error) => {
      console.error('❌ 내 게시글 조회 오류:', error);
      setPosts([]);
      setPostsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 게시글 상태 변경
  const handleStatusChange = async (postId: string, newStatus: string) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        status: newStatus
      });
      alert('게시글 상태가 변경되었습니다.');
    } catch (error) {
      console.error('상태 변경 오류:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  // 게시글 상세보기
  const handleViewDetails = (postId: string) => {
    router.push(`/request?postId=${postId}`);
  };

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'matching':
        return 'bg-blue-100 text-blue-800';
      case 'meeting':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '모집중';
      case 'matching':
        return '매칭중';
      case 'meeting':
        return '진행중';
      case 'completed':
        return '완료';
      default:
        return status;
    }
  };

  if (loading || postsLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">나의 요청글 관리</h1>
          </div>
          <div className="text-sm text-gray-500">
            총 {posts.length}개의 게시글
          </div>
        </div>

        {/* 게시글 목록 */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl text-gray-300 mb-4">📝</div>
            <div className="text-lg font-medium text-gray-500 mb-2">아직 작성한 게시글이 없습니다</div>
            <div className="text-sm text-gray-400 mb-6">선생님께 요청하기 페이지에서 첫 게시글을 작성해보세요!</div>
            <button 
              onClick={() => router.push('/request')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              게시글 작성하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(post.status)}`}>
                      {getStatusText(post.status)}
                    </span>
                    {post.applications > 0 && (
                      <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        신청 {post.applications}개
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {post.createdAt?.toDate?.()?.toLocaleDateString('ko-KR') || '날짜 정보 없음'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500">치료 분야</div>
                    <div className="font-medium">{post.treatment}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">지역</div>
                    <div className="font-medium">{post.region}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">대상</div>
                    <div className="font-medium">{post.age} / {post.gender}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">빈도</div>
                    <div className="font-medium">{post.frequency}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">희망 시간</div>
                  <div className="font-medium">{post.timeDetails}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewDetails(post.id)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    상세보기
                  </button>
                  
                  {post.status === 'active' && (
                    <button 
                      onClick={() => handleStatusChange(post.id, 'completed')}
                      className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      모집완료
                    </button>
                  )}
                  
                  {post.status === 'completed' && (
                    <button 
                      onClick={() => handleStatusChange(post.id, 'active')}
                      className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                    >
                      다시 모집
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
