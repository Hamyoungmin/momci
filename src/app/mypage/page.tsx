'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Timestamp, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MyPage() {
  const { currentUser, userData, loading } = useAuth();
  const router = useRouter();

  // 통계 데이터 상태
  const [stats, setStats] = useState({
    postsCount: 0,
    matchesCount: 0,
    reviewsCount: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/auth/login');
    }
  }, [currentUser, loading, router]);

  // 실시간 통계 데이터 가져오기
  useEffect(() => {
    if (!currentUser) return;

    console.log('📊 통계 데이터 가져오기 시작 - 사용자:', currentUser.uid);
    setStatsLoading(true);

    const unsubscribes: (() => void)[] = [];

    try {
      // 1. 작성한 게시글 수 가져오기
      const postsQuery = query(
        collection(db, 'posts'),
        where('authorId', '==', currentUser.uid)
      );

      const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
        const postsCount = snapshot.size;
        console.log('📝 작성한 게시글 수:', postsCount);
        setStats(prev => ({ ...prev, postsCount }));
      }, (error) => {
        console.error('❌ 게시글 수 조회 오류:', error);
      });
      unsubscribes.push(unsubscribePosts);

      // 2. 매칭 성공 수 가져오기
      // successful-matches 컬렉션이 있는지 확인하고, 없으면 matchings 컬렉션에서 가져오기
      const matchesQuery = query(
        collection(db, 'successful-matches'),
        where(userData?.userType === 'parent' ? 'parentId' : 'therapistId', '==', currentUser.uid)
      );

      const unsubscribeMatches = onSnapshot(matchesQuery, (snapshot) => {
        const matchesCount = snapshot.size;
        console.log('🤝 매칭 성공 수:', matchesCount);
        setStats(prev => ({ ...prev, matchesCount }));
      }, (error) => {
        console.error('❌ 매칭 수 조회 오류 (successful-matches에서):', error);
        // successful-matches 컬렉션이 없거나 오류가 있으면 matchings에서 시도
        console.log('🔄 matchings 컬렉션에서 재시도...');
        
        const backupMatchesQuery = query(
          collection(db, 'matchings'),
          where(userData?.userType === 'parent' ? 'parentId' : 'therapistId', '==', currentUser.uid)
        );
        
        const unsubscribeBackupMatches = onSnapshot(backupMatchesQuery, (backupSnapshot) => {
          const matchesCount = backupSnapshot.size;
          console.log('🤝 매칭 수 (matchings에서):', matchesCount);
          setStats(prev => ({ ...prev, matchesCount }));
        }, (backupError) => {
          console.error('❌ matchings 컬렉션 조회도 실패:', backupError);
          setStats(prev => ({ ...prev, matchesCount: 0 }));
        });
        
        unsubscribes.push(unsubscribeBackupMatches);
      });
      unsubscribes.push(unsubscribeMatches);

      // 3. 작성한 후기 수 가져오기 
      let reviewsQuery;
      if (userData?.userType === 'parent') {
        // 학부모는 치료사에 대한 후기 작성
        reviewsQuery = query(
          collection(db, 'therapist-reviews'),
          where('parentId', '==', currentUser.uid)
        );
      } else {
        // 일반 후기 또는 치료사가 작성하는 후기 (있다면)
        reviewsQuery = query(
          collection(db, 'reviews'),
          where('userId', '==', currentUser.uid)
        );
      }

      const unsubscribeReviews = onSnapshot(reviewsQuery, (snapshot) => {
        const reviewsCount = snapshot.size;
        console.log('⭐ 작성한 후기 수:', reviewsCount);
        setStats(prev => ({ ...prev, reviewsCount }));
        setStatsLoading(false);
      }, (error) => {
        console.error('❌ 후기 수 조회 오류:', error);
        setStats(prev => ({ ...prev, reviewsCount: 0 }));
        setStatsLoading(false);
      });
      unsubscribes.push(unsubscribeReviews);

    } catch (error) {
      console.error('❌ 통계 데이터 조회 전체 오류:', error);
      setStatsLoading(false);
    }

    // 클린업 함수
    return () => {
      console.log('🧹 통계 데이터 구독 정리');
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [currentUser, userData?.userType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // 리디렉트 중
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {userData?.name?.charAt(0) || currentUser.email?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {userData?.name || '이름 없음'}
              </h1>
              <p className="text-gray-600">{currentUser.email}</p>
              <div className="mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  userData?.userType === 'parent' 
                    ? 'bg-green-100 text-green-800'
                    : userData?.userType === 'therapist'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {userData?.userType === 'parent' ? '👨‍👩‍👧‍👦 학부모' : 
                   userData?.userType === 'therapist' ? '👩‍⚕️ 치료사' : '일반회원'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 계정 정보 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">계정 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
              <p className="px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 text-gray-900">
                {currentUser.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
              <p className="px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 text-gray-900">
                {userData?.name || '이름 없음'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
              <p className="px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 text-gray-900">
                {userData?.phone || '연락처 없음'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">회원 유형</label>
              <p className="px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 text-gray-900">
                {userData?.userType === 'parent' ? '학부모' : 
                 userData?.userType === 'therapist' ? '치료사' : '일반회원'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">가입일</label>
              <p className="px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 text-gray-900">
                {userData?.createdAt ? 
                  (userData.createdAt instanceof Timestamp ? 
                    userData.createdAt.toDate().toLocaleDateString('ko-KR') :
                    new Date(userData.createdAt as Date | string | number).toLocaleDateString('ko-KR')
                  ) : 
                  currentUser?.metadata?.creationTime ? 
                    new Date(currentUser.metadata.creationTime).toLocaleDateString('ko-KR') : 
                    '정보 없음'
                }
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이메일 인증</label>
              <p className="px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 text-gray-900">
                {currentUser.emailVerified ? (
                  <span className="text-green-600 font-medium">✓ 인증됨</span>
                ) : (
                  <span className="text-red-600 font-medium">✗ 미인증</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 서비스 이용 현황 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">서비스 이용 현황</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              {statsLoading ? (
                <div className="text-3xl font-bold text-blue-600">
                  <div className="animate-pulse">...</div>
                </div>
              ) : (
                <div className="text-3xl font-bold text-blue-600">{stats.postsCount}</div>
              )}
              <div className="text-sm text-gray-600 mt-2">
                {userData?.userType === 'parent' ? '요청한 게시글' : '작성한 게시글'}
              </div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-2xl">
              {statsLoading ? (
                <div className="text-3xl font-bold text-green-600">
                  <div className="animate-pulse">...</div>
                </div>
              ) : (
                <div className="text-3xl font-bold text-green-600">{stats.matchesCount}</div>
              )}
              <div className="text-sm text-gray-600 mt-2">매칭 성공</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              {statsLoading ? (
                <div className="text-3xl font-bold text-purple-600">
                  <div className="animate-pulse">...</div>
                </div>
              ) : (
                <div className="text-3xl font-bold text-purple-600">{stats.reviewsCount}</div>
              )}
              <div className="text-sm text-gray-600 mt-2">작성한 후기</div>
            </div>
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">빠른 액션</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userData?.userType === 'parent' ? (
              <>
                <a 
                  href="/request" 
                  className="flex flex-col items-center p-6 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">요청하기</span>
                </a>
                <a 
                  href="/browse" 
                  className="flex flex-col items-center p-6 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">치료사 찾기</span>
                </a>
              </>
            ) : (
              <>
                <a 
                  href="/browse" 
                  className="flex flex-col items-center p-6 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">요청글 보기</span>
                </a>
                <a 
                  href="/teacher-apply" 
                  className="flex flex-col items-center p-6 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">프로필 등록</span>
                </a>
              </>
            )}
            <a 
              href="/reviews" 
              className="flex flex-col items-center p-6 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">후기 보기</span>
            </a>
            <a 
              href="/support" 
              className="flex flex-col items-center p-6 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">고객센터</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
