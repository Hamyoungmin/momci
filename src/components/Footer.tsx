'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 정보 */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-gray-300 mb-4 leading-relaxed">
              모든별 키즈는 전문가와 학부모를 안전하게 연결하는 홈티칭 플랫폼입니다.
            </p>
            <div className="text-sm text-gray-400">
              <p>모든별(주)</p>
              <p>서울시 마포구 마포대로 92 효성해링턴 스퀘어 A동 3층</p>
              <p>대표 정진우</p>
              <p>사업자등록번호:</p>
              <p>통신판매업 신고번호:</p>
              <p>대표번호: 010-4549-1903(전화 및 문자 상담가능)</p>
              <p>팩스번호:</p>
              <p>개인정보 보호책임자: 정진우</p>
              <p>everystar@naver.com</p>
            </div>
          </div>

          {/* 서비스 메뉴 */}
          <div>
            <h3 className="font-semibold mb-4">서비스</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {/* 이용안내 드롭다운 */}
              <li>
                <button
                  onClick={() => toggleDropdown('guide')}
                  className="text-left hover:text-white transition-colors"
                >
                  이용안내
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-out ${
                  openDropdown === 'guide' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`} style={{display: 'block'}}>
                  <ul className="mt-2 ml-4 space-y-1 block">
                    <li>
                      <Link href="/parent-guide" className="block hover:text-white transition-colors w-full">
                        학부모 이용안내
                      </Link>
                    </li>
                    <li>
                      <Link href="/teacher-guide" className="block hover:text-white transition-colors w-full">
                        선생님 이용안내
                      </Link>
                    </li>
                    <li>
                      <Link href="/program-guide" className="block hover:text-white transition-colors">
                        프로그램 안내
                      </Link>
                    </li>
                    <li>
                      <Link href="/pricing" className="block hover:text-white transition-colors">
                        이용권 구매
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              
              {/* 홈티매칭 드롭다운 */}
              <li>
                <button
                  onClick={() => toggleDropdown('matching')}
                  className="text-left hover:text-white transition-colors"
                >
                  홈티매칭
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-out ${
                  openDropdown === 'matching' ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                }`} style={{display: 'block'}}>
                  <ul className="mt-2 ml-4 space-y-1 block">
                    <li>
                      <Link href="/request" className="block hover:text-white transition-colors">
                        선생님께 요청하기
                      </Link>
                    </li>
                    <li>
                      <Link href="/browse" className="block hover:text-white transition-colors">
                        선생님 둘러보기
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            
            {/* 1:1문의 정보 */}
            <div className="mt-12">
              <h4 className="font-semibold text-gray-300 mb-2">1:1문의</h4>
              <div className="text-xs text-gray-400 leading-relaxed">
                <p>※운영 시간 : 평일 10:00~18:00</p>
                <p>(점심시간 13:00 ~ 14:00 제외/주말 및 공휴일 제외)</p>
              </div>
            </div>
          </div>

          {/* 두 번째 컬럼 - 제목 없음 */}
          <div>
            {/* 빈 제목 공간으로 첫 번째 컬럼과 정렬 */}
            <div className="h-6 mb-4"></div>
            <ul className="space-y-2 text-sm text-gray-300">
              {/* 치료사 등록 드롭다운 */}
              <li>
                <button
                  onClick={() => toggleDropdown('teacher')}
                  className="text-left hover:text-white transition-colors"
                >
                  치료사 등록
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-out ${
                  openDropdown === 'teacher' ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                }`} style={{display: 'block'}}>
                  <ul className="mt-2 ml-4 space-y-1 block">
                    <li>
                      <Link href="/register-teacher" className="block hover:text-white transition-colors">
                        치료사 등록하기
                      </Link>
                    </li>
                    <li>
                      <Link href="/teacher-apply" className="block hover:text-white transition-colors">
                        치료사 지원하기
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              
              {/* 고객센터 드롭다운 */}
              <li>
                <button
                  onClick={() => toggleDropdown('support')}
                  className="text-left hover:text-white transition-colors"
                >
                  고객센터
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-out ${
                  openDropdown === 'support' ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`} style={{display: 'block'}}>
                  <ul className="mt-2 ml-4 space-y-1 block">
                    <li>
                      <Link href="/notice" className="block hover:text-white transition-colors">
                        공지사항
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq" className="block hover:text-white transition-colors">
                        자주 묻는 질문(FAQ)
                      </Link>
                    </li>
                    <li>
                      <Link href="/reviews" className="block hover:text-white transition-colors">
                        후기 작성/보기
                      </Link>
                    </li>
                    <li>
                      <Link href="/refund-policy" className="block hover:text-white transition-colors">
                        환불 규정
                      </Link>
                    </li>
                    <li>
                      <Link href="/report" className="block hover:text-white transition-colors">
                        직거래 신고
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 구분선 및 정책 링크 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4 md:mb-0">
              <Link href="/terms" className="hover:text-white transition-colors">
                이용약관
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors font-semibold">
                개인정보처리방침
              </Link>
              <Link href="/location-terms" className="hover:text-white transition-colors">
                위치기반서비스 이용약관
              </Link>
              <Link href="/youth-protection" className="hover:text-white transition-colors">
                청소년보호정책
              </Link>
            </div>
             <div className="text-sm text-gray-400">
               © 2025 Modeunbyeol Kids Inc. All Rights Reserved.
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
