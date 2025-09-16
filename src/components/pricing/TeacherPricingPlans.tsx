'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface UserData {
  userType: 'parent' | 'therapist';
  name: string;
}

export default function TeacherPricingPlans() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
        }
      } catch (error) {
        console.error('사용자 데이터 불러오기 오류:', error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // 결제 페이지로 이동하는 함수
  const handleStartSubscription = () => {
    router.push('/teacher-payment');
  };

  // 이용권 구매 메뉴 렌더링 함수
  const renderPricingMenu = () => {
    if (!currentUser || !userData) {
      // 비로그인 사용자는 드롭다운으로 둘 다 표시 (현재 페이지가 치료사용이므로 강조)
      return (
        <div className="relative group">
          <div className="w-full bg-blue-50 text-blue-600 text-left px-4 py-3 rounded-2xl text-sm font-medium flex items-center justify-between">
            이용권 구매
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="absolute left-0 top-full mt-1 w-full bg-white shadow-lg rounded-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <Link href="/parent-pricing" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-t-xl">
              학부모용
            </Link>
            <div className="block px-4 py-3 text-sm text-blue-600 bg-blue-50 rounded-b-xl font-medium">
              선생님용
            </div>
          </div>
        </div>
      );
    }

    // 로그인한 사용자는 해당 유형의 이용권으로 직접 링크 (현재 페이지이면 강조 표시)
    if (userData.userType === 'parent') {
      return (
        <Link href="/parent-pricing" className="block w-full text-gray-700 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors">
          이용권 구매
        </Link>
      );
    } else if (userData.userType === 'therapist') {
      return (
        <div className="w-full bg-blue-50 text-blue-600 text-left px-4 py-3 rounded-2xl text-sm font-medium">
          이용권 구매
        </div>
      );
    }
  };
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
                {renderPricingMenu()}
              </div>
            </div>
          </div>
          
          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            <div className="bg-white border-4 border-blue-700 rounded-lg p-6">
            
            {/* 헤더 섹션 */}
            <div className="text-center mt-12 mb-12">
              {/* 메인 제목 */}
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-snug">
                선생님의 가치, 수수료 없이 100% 보상받으세요.
              </h1>
              
              {/* 설명 */}
              <p className="text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto">
                모든별 키즈는 매번 20%씩 떼어가는 수수료 대신, 선생님의 노하우 100% 수익으로 이어지는 투명한 환경을 제공합니다.
              </p>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="text-center">
              
              {/* 가격 박스 */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-16 max-w-3xl mx-auto">
                <h2 className="text-base font-bold text-gray-900 mb-2">
                  선생님 이용권: 월 19,900원 (VAT 포함)
                </h2>
                <p className="text-sm text-gray-600">
                  (단 한 번의 매칭만 성공해도 기존 수수료보다 훨씬 큰 이득입니다.)
                </p>
              </div>
              
              {/* 혜택 목록 */}
              <div className="space-y-16 mb-16 max-w-3xl mx-auto">
                
                {/* 첫 번째 혜택 */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-start space-x-4 text-left">
                    <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-2">
                        수익 극대화 (수수료 0%)
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        첫 매칭 수수료(주당 수업 횟수 x 1회분)를 제외한 모든 수업료는 <span className="font-semibold">100% 선생님의 수익</span>입니다. 더 이상 매번 수수료를 내지 마세요.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 두 번째 혜택 */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-start space-x-4 text-left">
                    <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-2">
                        주도적인 활동
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        기관 배정에 의존하지 않고, 원하는 시간, 장소, 비용을 직접 자유롭게 정하며 더 많은 기회를 만드세요.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 세 번째 혜택 */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-start space-x-4 text-left">
                    <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-2">
                        신뢰의 성장
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        플랫폼 내 성실한 활동은 <span className="font-semibold">&apos;모든별 키즈 인증 선생님&apos; 배지</span>로 이어져, 학부모의 신뢰를 얻는 가장 확실한 방법이 됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CTA 버튼 */}
              <button 
                onClick={handleStartSubscription}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-4 px-6 rounded-2xl transition-colors shadow-lg max-w-3xl mx-auto"
              >
                이용권 시작하고 새로운 기회 만들기
              </button>
            </div>

          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
