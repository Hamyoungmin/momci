'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

export default function MyPage() {
  const { currentUser, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/auth/login');
    }
  }, [currentUser, loading, router]);

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
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600 mt-2">
                {userData?.userType === 'parent' ? '요청한 게시글' : '지원한 게시글'}
              </div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-2xl">
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600 mt-2">매칭 성공</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <div className="text-3xl font-bold text-purple-600">0</div>
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
                  <div className="text-2xl mb-2">📝</div>
                  <span className="text-sm font-medium text-gray-900">요청하기</span>
                </a>
                <a 
                  href="/browse" 
                  className="flex flex-col items-center p-6 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors"
                >
                  <div className="text-2xl mb-2">🔍</div>
                  <span className="text-sm font-medium text-gray-900">치료사 찾기</span>
                </a>
              </>
            ) : (
              <>
                <a 
                  href="/browse" 
                  className="flex flex-col items-center p-6 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors"
                >
                  <div className="text-2xl mb-2">🔍</div>
                  <span className="text-sm font-medium text-gray-900">요청글 보기</span>
                </a>
                <a 
                  href="/teacher-apply" 
                  className="flex flex-col items-center p-6 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors"
                >
                  <div className="text-2xl mb-2">📋</div>
                  <span className="text-sm font-medium text-gray-900">프로필 등록</span>
                </a>
              </>
            )}
            <a 
              href="/reviews" 
              className="flex flex-col items-center p-6 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors"
            >
              <div className="text-2xl mb-2">⭐</div>
              <span className="text-sm font-medium text-gray-900">후기 보기</span>
            </a>
            <a 
              href="/support" 
              className="flex flex-col items-center p-6 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors"
            >
              <div className="text-2xl mb-2">💬</div>
              <span className="text-sm font-medium text-gray-900">고객센터</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
