'use client';

import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserData {
  userType: 'parent' | 'therapist';
  name: string;
}

export default function PricingPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserDataAndRedirect = async () => {
      // 비로그인 사용자는 바로 기존 UI 표시
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      // 로그인한 사용자만 로딩 표시
      setIsLoading(true);

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          
          // 사용자 타입에 따라 자동 리다이렉트
          if (data.userType === 'parent') {
            router.push('/parent-pricing');
            return;
          } else if (data.userType === 'therapist') {
            router.push('/teacher-pricing');
            return;
          }
        }
      } catch (error) {
        console.error('사용자 데이터 불러오기 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDataAndRedirect();
  }, [currentUser, router]);

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">이용권 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-12">
        <div className="flex max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 사이드바 */}
          <div className="w-64 bg-white shadow-lg rounded-lg mr-8 h-fit">
            <div className="p-4">
              <div className="mb-6">
                <button className="w-full bg-blue-500 text-white text-xl font-bold rounded-2xl h-[110px] flex items-center justify-center">
                  이용안내
                </button>
              </div>
              <div className="space-y-1">
                <Link href="/parent-guide" className="block w-full text-gray-700 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors">
                  학부모 이용안내
                </Link>
                <Link href="/teacher-guide" className="block w-full text-gray-700 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors">
                  선생님 이용안내
                </Link>
                <Link href="/program-guide" className="block w-full text-gray-700 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors">
                  프로그램 안내
                </Link>
                <div className="w-full bg-blue-50 text-blue-600 text-left px-4 py-3 rounded-2xl text-sm font-medium">
                  이용권 구매
                </div>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            <div className="bg-white border-4 border-blue-700 rounded-lg p-6">
              {/* 헤더 섹션 */}
              <div className="text-center mb-16 mt-16">
                {/* 메인 제목 */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">
                  이용권을 선택해주세요
                </h1>
                {/* 설명 */}
                <p className="text-sm text-gray-600 leading-relaxed max-w-4xl mx-auto">
                  모든별 키즈는 학부모님과 선생님 모두를 위한 합리적인 이용권을 제공합니다.
                </p>
              </div>

              {/* 선택 카드들 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* 학부모 이용권 카드 */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="mb-3">
                      <div className="bg-blue-100 p-3 rounded-full inline-flex">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      학부모 이용권
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      우리 아이에게 맞는 최고의 선생님을 찾아보세요
                    </p>
                    {/* 주요 혜택 */}
                    <div className="space-y-2 mb-6 text-left">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-gray-600">검증된 전문가 무제한 열람</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-gray-600">수수료 0%로 비용 절감</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-gray-600">1:1 실시간 채팅</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-blue-600 mb-4">
                      월 9,900원
                    </div>
                    <Link 
                      href="/parent-pricing"
                      className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      학부모 이용권 자세히 보기
                    </Link>
                  </div>
                </div>

                {/* 선생님 이용권 카드 */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="mb-3">
                      <div className="bg-blue-100 p-3 rounded-full inline-flex">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      선생님 이용권
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      수수료 없이 100% 수익을 가져가세요
                    </p>
                    {/* 주요 혜택 */}
                    <div className="space-y-2 mb-6 text-left">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-gray-600">수익 극대화 (수수료 0%)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-gray-600">주도적인 활동</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-gray-600">신뢰의 성장</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-blue-600 mb-4">
                      월 19,900원
                    </div>
                    <Link 
                      href="/teacher-pricing"
                      className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      선생님 이용권 자세히 보기
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
