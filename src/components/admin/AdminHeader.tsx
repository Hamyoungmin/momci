'use client';

import { useState } from 'react';

export default function AdminHeader() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-64 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* 왼쪽: 페이지 정보 */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">키</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">더모든 키즈 관리자</h1>
              <p className="text-sm text-gray-600">안전한 매칭 플랫폼 운영 관리</p>
            </div>
          </div>
        </div>

        {/* 가운데: 실시간 알림 */}
        <div className="flex items-center space-x-4">
          {/* 긴급 알림 */}
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl shadow-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-red-700 font-semibold">긴급 신고 2건</span>
          </div>

          {/* 처리 대기 */}
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl shadow-sm">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span className="text-sm text-yellow-700 font-semibold">처리 대기 11건</span>
          </div>

          {/* 실시간 접속자 */}
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-green-700 font-semibold">접속자 73명</span>
          </div>
        </div>

        {/* 오른쪽: 사용자 메뉴 */}
        <div className="flex items-center space-x-4">
          {/* 알림 버튼 */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* 사용자 프로필 */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">관</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">최고관리자</div>
                <div className="text-xs text-gray-500">admin@momci.kr</div>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                <div className="py-2">
                  <a href="#" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <span className="text-base mr-3">👤</span>
                    프로필 설정
                  </a>
                  <a href="#" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <span className="text-base mr-3">🔐</span>
                    비밀번호 변경
                  </a>
                  <a href="#" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <span className="text-base mr-3">📋</span>
                    활동 로그
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <a href="#" className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <span className="text-base mr-3">🚪</span>
                    로그아웃
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}