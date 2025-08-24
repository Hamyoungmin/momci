'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">더</span>
              </div>
              <span className="text-xl font-bold text-gray-900">더모든 키즈</span>
            </Link>
          </div>

          {/* 네비게이션 메뉴 (데스크톱) */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/guide" className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              이용안내
            </Link>
            <Link href="/matching" className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              홈티매칭
            </Link>
            <Link href="/reviews" className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              치료사 후기
            </Link>
            <Link href="/support" className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              고객센터
            </Link>
          </nav>

          {/* 우측 버튼들 */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/pricing" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              이용권 구매
            </Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              로그인
            </Link>
            <Link href="/auth/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              회원가입
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link href="/guide" className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">
                이용안내
              </Link>
              <Link href="/matching" className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">
                홈티매칭
              </Link>
              <Link href="/reviews" className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">
                치료사 후기
              </Link>
              <Link href="/support" className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">
                고객센터
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex flex-col space-y-2">
                  <Link href="/pricing" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors">
                    이용권 구매
                  </Link>
                  <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium text-center">
                    로그인
                  </Link>
                  <Link href="/auth/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors">
                    회원가입
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
