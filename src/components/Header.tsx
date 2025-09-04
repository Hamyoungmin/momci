'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { currentUser, userData, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isGuideDropdownOpen, setIsGuideDropdownOpen] = useState(false);
  const [isMatchingDropdownOpen, setIsMatchingDropdownOpen] = useState(false);
  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(false);
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
  const [isSupportDropdownOpen, setIsSupportDropdownOpen] = useState(false);
  const [isMobileGuideOpen, setIsMobileGuideOpen] = useState(false);
  const [isMobileMatchingOpen, setIsMobileMatchingOpen] = useState(false);
  const [isMobileRegisterOpen, setIsMobileRegisterOpen] = useState(false);
  const [isMobileCommunityOpen, setIsMobileCommunityOpen] = useState(false);
  const [isMobileSupportOpen, setIsMobileSupportOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserDropdownOpen(false);
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-700">모든별 키즈</span>
            </Link>
          </div>

          {/* 네비게이션 메뉴 (데스크톱) */}
          <nav className="hidden md:flex space-x-10">
            {/* 이용안내 드롭다운 */}
            <div 
              className="relative"
              onMouseEnter={() => setIsGuideDropdownOpen(true)}
              onMouseLeave={() => setIsGuideDropdownOpen(false)}
            >
              <div 
                className="text-gray-700 hover:text-blue-500 px-4 py-3 rounded-2xl text-base font-medium transition-colors cursor-pointer"
              >
                이용안내
              </div>

              {/* 드롭다운 메뉴 */}
              <div className={`absolute top-full left-0 mt-1 w-48 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 transition-all duration-200 ${
                isGuideDropdownOpen 
                  ? 'opacity-100 translate-y-0 visible' 
                  : 'opacity-0 -translate-y-2 invisible'
              }`}>
                                <Link 
                  href="/parent-guide" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors first:rounded-t-2xl"
                >
                  학부모 이용안내
                </Link>
                <Link 
                  href="/teacher-guide" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                >
                  선생님 이용안내
                </Link>
                <Link 
                  href="/program-guide" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                >
                  프로그램 안내
                </Link>
                <Link 
                  href="/pricing" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors last:rounded-b-2xl"
                >
                  이용권 구매
                </Link>
              </div>
            </div>

            {/* 홈티매칭 드롭다운 */}
            <div 
              className="relative"
              onMouseEnter={() => setIsMatchingDropdownOpen(true)}
              onMouseLeave={() => setIsMatchingDropdownOpen(false)}
            >
              <div 
                className="text-gray-700 hover:text-blue-500 px-4 py-3 rounded-2xl text-base font-medium transition-colors cursor-pointer"
              >
                홈티매칭
              </div>

              {/* 드롭다운 메뉴 */}
              <div className={`absolute top-full left-0 mt-1 w-48 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 transition-all duration-200 ${
                isMatchingDropdownOpen 
                  ? 'opacity-100 translate-y-0 visible' 
                  : 'opacity-0 -translate-y-2 invisible'
              }`}>
                <Link 
                  href="/request" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors first:rounded-t-2xl"
                >
                  선생님께 요청하기
                </Link>
                <Link 
                  href="/browse" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors last:rounded-b-2xl"
                >
                  선생님 둘러보기
                </Link>
              </div>
            </div>
            {/* 치료사 등록 드롭다운 */}
            <div 
              className="relative"
              onMouseEnter={() => setIsRegisterDropdownOpen(true)}
              onMouseLeave={() => setIsRegisterDropdownOpen(false)}
            >
              <div 
                className="text-gray-700 hover:text-blue-500 px-4 py-3 rounded-2xl text-base font-medium transition-colors cursor-pointer"
              >
                치료사 등록
              </div>

              {/* 드롭다운 메뉴 */}
              <div className={`absolute top-full left-0 mt-1 w-48 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 transition-all duration-200 ${
                isRegisterDropdownOpen 
                  ? 'opacity-100 translate-y-0 visible' 
                  : 'opacity-0 -translate-y-2 invisible'
              }`}>
                                <Link 
                  href="/register-teacher" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors first:rounded-t-2xl"
                >
                  치료사 등록안내
                </Link>
                <Link 
                  href="/teacher-apply" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors last:rounded-b-2xl"
                >
                  치료사 신청
                </Link>
              </div>
            </div>

            {/* 커뮤니티 드롭다운 */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCommunityDropdownOpen(true)}
              onMouseLeave={() => setIsCommunityDropdownOpen(false)}
            >
              <div 
                className="text-gray-700 hover:text-blue-500 px-4 py-3 rounded-2xl text-base font-medium transition-colors cursor-pointer"
              >
                커뮤니티
              </div>

              {/* 드롭다운 메뉴 */}
              <div className={`absolute top-full left-0 mt-1 w-48 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 transition-all duration-200 ${
                isCommunityDropdownOpen 
                  ? 'opacity-100 translate-y-0 visible' 
                  : 'opacity-0 -translate-y-2 invisible'
              }`}>
                                <Link 
                  href="/reviews" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors rounded-2xl"
                >
                  후기 작성/보기
                </Link>
              </div>
            </div>

            {/* 고객센터 드롭다운 */}
            <div 
              className="relative"
              onMouseEnter={() => setIsSupportDropdownOpen(true)}
              onMouseLeave={() => setIsSupportDropdownOpen(false)}
            >
              <div 
                className="text-gray-700 hover:text-blue-500 px-4 py-3 rounded-2xl text-base font-medium transition-colors cursor-pointer"
              >
                고객센터
              </div>

              {/* 드롭다운 메뉴 */}
              <div className={`absolute top-full left-0 mt-1 w-48 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 transition-all duration-200 ${
                isSupportDropdownOpen 
                  ? 'opacity-100 translate-y-0 visible' 
                  : 'opacity-0 -translate-y-2 invisible'
              }`}>
                                <Link 
                  href="/notice" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors first:rounded-t-2xl"
                >
                  공지사항
                </Link>
                <Link 
                  href="/faq" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                >
                  자주 묻는 질문 (FAQ)
                </Link>
                <Link 
                  href="/refund-policy" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                >
                  환불규정
                </Link>
                <Link 
                  href="/report" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors last:rounded-b-2xl"
                >
                  직거래 신고
                </Link>
              </div>
            </div>
          </nav>

          {/* 우측 버튼들 */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              // 로그인된 경우
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 px-4 py-2 rounded-2xl text-base font-medium transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userData?.name?.charAt(0) || currentUser.email?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span>{userData?.name || currentUser.email}</span>
                  <svg className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 사용자 드롭다운 메뉴 */}
                <div className={`absolute top-full right-0 mt-1 w-48 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 transition-all duration-200 ${
                  isUserDropdownOpen 
                    ? 'opacity-100 translate-y-0 visible' 
                    : 'opacity-0 -translate-y-2 invisible'
                }`}>
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm text-gray-600">로그인됨</p>
                    <p className="text-sm font-medium text-gray-900">{userData?.name || currentUser.email}</p>
                    <p className="text-xs text-gray-500">
                      {userData?.userType === 'parent' ? '학부모' : 
                       userData?.userType === 'therapist' ? '치료사' : '일반회원'}
                    </p>
                  </div>
                  <Link 
                    href="/mypage" 
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors rounded-b-2xl"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              // 로그인되지 않은 경우
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-2xl text-base font-medium">
                  로그인
                </Link>
                <Link href="/auth/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-base font-medium transition-colors">
                  회원가입
                </Link>
              </>
            )}
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
              {/* 모바일 이용안내 드롭다운 */}
              <div>
                <button
                  onClick={() => setIsMobileGuideOpen(!isMobileGuideOpen)}
                  className="text-gray-700 hover:text-blue-500 w-full px-4 py-3 rounded-2xl text-lg font-medium text-left"
                >
                  이용안내
                </button>
                <div className={`pl-6 space-y-1 transition-all duration-200 overflow-hidden ${
                  isMobileGuideOpen 
                    ? 'max-h-48 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}>
                  <Link 
                    href="/parent-guide" 
                    className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-2xl text-sm transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileGuideOpen(false);
                    }}
                  >
                    학부모 이용안내
                  </Link>
                  <Link 
                    href="/teacher-guide" 
                    className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-2xl text-sm transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileGuideOpen(false);
                    }}
                  >
                    선생님 이용안내
                  </Link>
                  <Link 
                    href="/program-guide" 
                    className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-2xl text-sm transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileGuideOpen(false);
                    }}
                  >
                    프로그램 안내
                  </Link>
                  <Link 
                    href="/pricing" 
                    className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-2xl text-sm transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileGuideOpen(false);
                    }}
                  >
                    이용권 구매
              </Link>
                </div>
              </div>

              {/* 모바일 홈티매칭 드롭다운 */}
              <div>
                <button
                  onClick={() => setIsMobileMatchingOpen(!isMobileMatchingOpen)}
                  className="text-gray-700 hover:text-blue-500 w-full px-4 py-3 rounded-2xl text-lg font-medium text-left"
                >
                  홈티매칭
                </button>
                <div className={`pl-6 space-y-1 transition-all duration-200 overflow-hidden ${
                  isMobileMatchingOpen 
                    ? 'max-h-32 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}>
                  <Link 
                    href="/request" 
                    className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-2xl text-sm transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileMatchingOpen(false);
                    }}
                  >
                    선생님께 요청하기
                  </Link>
                  <Link 
                    href="/browse" 
                    className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-2xl text-sm transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileMatchingOpen(false);
                    }}
                  >
                    선생님 둘러보기
                  </Link>
                </div>
              </div>

              {/* 모바일 치료사 등록 드롭다운 */}
              <div>
                <button
                  onClick={() => setIsMobileRegisterOpen(!isMobileRegisterOpen)}
                  className="text-gray-700 hover:text-blue-500 w-full px-4 py-3 rounded-2xl text-lg font-medium text-left"
                >
                  치료사 등록
                </button>
                <div className={`pl-6 space-y-1 transition-all duration-200 overflow-hidden ${
                  isMobileRegisterOpen 
                    ? 'max-h-32 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}>
                  <Link 
                    href="/register-teacher" 
                    className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-2xl text-sm transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileRegisterOpen(false);
                    }}
                  >
                    치료사 등록안내
                  </Link>
                  <Link 
                    href="/teacher-apply" 
                    className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-2xl text-sm transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileRegisterOpen(false);
                    }}
                  >
                    치료사 신청
              </Link>
                </div>
              </div>

              {/* 모바일 커뮤니티 드롭다운 */}
              <div>
                <button
                  onClick={() => setIsMobileCommunityOpen(!isMobileCommunityOpen)}
                  className="text-gray-700 hover:text-blue-500 w-full px-4 py-3 rounded-2xl text-lg font-medium text-left"
                >
                  커뮤니티
                </button>
                <div className={`pl-6 space-y-1 transition-all duration-200 overflow-hidden ${
                  isMobileCommunityOpen 
                    ? 'max-h-16 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}>
                  <Link 
                    href="/reviews" 
                    className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-2xl text-sm transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileCommunityOpen(false);
                    }}
                  >
                    후기 작성/보기
              </Link>
                </div>
              </div>

              {/* 모바일 고객센터 드롭다운 */}
              <div>
                <button
                  onClick={() => setIsMobileSupportOpen(!isMobileSupportOpen)}
                  className="text-gray-700 hover:text-blue-500 w-full px-4 py-3 rounded-2xl text-lg font-medium text-left"
                >
                  고객센터
                </button>
                <div className={`pl-6 space-y-1 transition-all duration-200 overflow-hidden ${
                  isMobileSupportOpen 
                    ? 'max-h-64 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}>
                  <Link 
                    href="/notice" 
                    className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-2xl text-sm transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileSupportOpen(false);
                    }}
                  >
                    공지사항
                  </Link>
                  <Link 
                    href="/faq" 
                    className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-2xl text-sm transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileSupportOpen(false);
                    }}
                  >
                    자주 묻는 질문 (FAQ)
                  </Link>
                  <Link 
                    href="/refund-policy" 
                    className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-2xl text-sm transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileSupportOpen(false);
                    }}
                  >
                    환불규정
                  </Link>
                  <Link 
                    href="/report" 
                    className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-2xl text-sm transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileSupportOpen(false);
                    }}
                  >
                    직거래 신고
              </Link>
                </div>
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                {currentUser ? (
                  // 모바일 로그인된 경우
                  <div className="flex flex-col space-y-2">
                    <div className="px-4 py-2 text-center">
                      <div className="inline-flex items-center space-x-2 text-gray-700">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {userData?.name?.charAt(0) || currentUser.email?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium">{userData?.name || currentUser.email}</p>
                          <p className="text-xs text-gray-500">
                            {userData?.userType === 'parent' ? '학부모' : 
                             userData?.userType === 'therapist' ? '치료사' : '일반회원'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link 
                      href="/mypage" 
                      className="text-gray-700 hover:text-gray-900 px-4 py-3 rounded-2xl text-base font-medium text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-red-600 hover:text-red-700 px-4 py-3 rounded-2xl text-base font-medium text-center"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  // 모바일 로그인되지 않은 경우
                  <div className="flex flex-col space-y-2">
                    <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 px-4 py-3 rounded-2xl text-base font-medium text-center">
                      로그인
                    </Link>
                    <Link href="/auth/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl text-base font-medium text-center transition-colors">
                      회원가입
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
