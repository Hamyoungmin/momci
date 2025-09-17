'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserData {
  userType: 'parent' | 'therapist';
  name: string;
}

export default function ParentGuidePage() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

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

  // 이용권 구매 메뉴 렌더링 함수
  const renderPricingMenu = () => {
    if (!currentUser || !userData) {
      return (
        <Link href="/pricing" className="block w-full text-gray-700 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors">
          이용권 구매
        </Link>
      );
    }

    // 로그인한 사용자는 해당 유형의 이용권으로 직접 링크
    if (userData.userType === 'parent') {
      return (
        <Link href="/parent-pricing" className="block w-full text-gray-700 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors">
          이용권 구매
        </Link>
      );
    } else if (userData.userType === 'therapist') {
      return (
        <Link href="/teacher-pricing" className="block w-full text-gray-700 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors">
          이용권 구매
        </Link>
      );
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 메인 가이드 섹션 */}
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
                <div className="w-full bg-blue-50 text-blue-600 text-left px-4 py-3 rounded-2xl text-sm font-medium">
                  학부모 이용안내
                </div>
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
            <div className="text-center mb-12 mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">모든별 키즈 이용 가이드</h2>
            </div>

            {/* STEP 1 */}
            <div className="mb-12">
              <h3 className="text-lg font-bold text-black mb-4">STEP 1. 선생님 찾기 및 인터뷰</h3>
              
              {/* STEP 1 제목 아래 구분선 */}
              <div className="border-t border-gray-300 mb-4"></div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-4">
                  1. <span className="text-black font-semibold">이용권 구매</span>: 회원가입 후 이용권을 구매해야 선생님께 글을 쓰거나 소통할 수 있습니다.(게시글 열람은 무료)
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2"><span className="text-sm text-gray-700">2.</span> <span className="text-black font-semibold">선생님 찾기 (2가지 방법)</span>:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-xs text-gray-700">
                  <li><span className="text-blue-700 font-semibold">[선생님 요청하기]</span>에 원하는 홈티 조건을 게시하여 선생님들의 지원을 받습니다.</li>
                  <li><span className="text-blue-700 font-semibold">[선생님 둘러보기]</span>에서 선생님 프로필을 직접 확인하고 소통을 시작합니다.</li>
                </ul>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="text-sm text-gray-700">3.</span> <span className="text-black font-semibold">인터뷰 진행</span>: 연결된 선생님과 <span className="text-blue-700 font-semibold">1:1 실시간 채팅</span>으로 소통하여 인터뷰를 진행합니다. (총 2명의 선생님까지 무료)
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm text-red-600">
                  <span className="text-sm text-red-600">*</span>3번째 선생님과 채팅창을 여는 시점부터는 추가 인터뷰 비용(10,000원)이 발생합니다.
                </p>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="mb-12">
              <h3 className="text-lg font-bold text-black mb-4">STEP 2. 안전한 첫 시작 (첫 달 결제)</h3>
              
              {/* STEP 2 제목 아래 구분선 */}
              <div className="border-t border-gray-300 mb-4"></div>
              
              <ul className="list-disc list-outside space-y-3 text-xs text-gray-700 ml-6">
                <li>
                  <span className="text-black font-semibold">수업결정:</span> 인터뷰 후 마음에 드는 선생님이 정해지면, 대표번호로 확정된 스케줄을 알려주세요.
                  <div className="text-xs text-gray-500 mt-1 ml-0">(문자 예시): 김00 220303 / 주 1회 / 25.08.04(월) 1시 시작</div>
                </li>
                <li>
                  <span className="text-black font-semibold">안전결제:</span> 관리자의 안내에 따라 첫 달 수업료를 플랫폼에 선결제합니다. 이는 사기 등의 문제를 예방하고 양측을 보호하는 필수 절차입니다.
                  <div className="text-xs text-gray-500 mt-1 ml-0">첫 수업료는 한 달(4주) 기준으로, <span className="text-blue-700 font-semibold">(주당 수업 횟수 x 4회분)</span>의 금액을 입금합니다.</div>
                </li>
                <li>
                  <span className="text-black font-semibold">연락처 공개:</span> 결제가 완료 되어야 선생님의 연락처가 안전하게 공개됩니다.
                </li>
              </ul>
            </div>

            {/* STEP 3 */}
            <div className="mb-12">
              <h3 className="text-lg font-bold text-black mb-4">STEP 3. 자유로운 수업 진행</h3>
              
              {/* STEP 3 제목 아래 구분선 */}
              <div className="border-t border-gray-300 mb-4"></div>
              
              <p className="text-sm text-gray-700">
                첫 달 수업 완료 후, 선생님과 직접 소통하며 편리안 후불제(개인 계좌 이체)로 정산합니다. 이후 과정에 <span className="text-blue-700 font-semibold">모든별 키즈</span>는 수수료를 부과하지 않습니다.
              </p>
            </div>

            {/* STEP 4 */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-black mb-4">STEP 4. 후기 작성</h3>
              
              {/* STEP 4 제목 아래 구분선 */}
              <div className="border-t border-gray-300 mb-4"></div>
              
              <p className="text-sm text-gray-700 mb-4">
                수업을 1회 이상 진행하셨다면, 다른 학부모님들을 위해 소중한 후기를 남겨주세요.
              </p>
              <p className="text-xs text-gray-500">
                (* 플랫폼 외부 직거래는 엄격히 금지되어, 직거래 유도 신고 시 포상 제도가 운영중입니다.)
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

