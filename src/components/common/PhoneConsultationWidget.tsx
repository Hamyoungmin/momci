'use client';

import { useState } from 'react';

export default function PhoneConsultationWidget() {
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [isPhoneClosing, setIsPhoneClosing] = useState(false);
  const [isNoticeClosing, setIsNoticeClosing] = useState(false);

  const togglePhonePopup = () => {
    if (isPhoneOpen) {
      setIsPhoneClosing(true);
      setTimeout(() => {
        setIsPhoneOpen(false);
        setIsPhoneClosing(false);
      }, 300);
    } else {
      setIsPhoneOpen(true);
    }
  };

  const toggleNoticePopup = () => {
    if (isNoticeOpen) {
      setIsNoticeClosing(true);
      setTimeout(() => {
        setIsNoticeOpen(false);
        setIsNoticeClosing(false);
      }, 300);
    } else {
      setIsNoticeOpen(true);
    }
  };

  const handleCall = () => {
    window.location.href = 'tel:010-4549-1903';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 공지사항 팝업 */}
      {isNoticeOpen && (
        <div className={`absolute bottom-32 right-0 mb-4 ${isNoticeClosing ? 'animate-fadeOutDown' : 'animate-fadeInUp'}`}>
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-80 transform transition-all duration-300 ease-in-out">
            {/* 화살표 */}
            <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
            
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">📢 공지사항</h3>
              <button
                onClick={toggleNoticePopup}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 공지사항 목록 */}
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-700">🎉 서비스 오픈</span>
                  <span className="text-xs text-blue-600">2024.01.20</span>
                </div>
                <p className="text-sm text-blue-800">더모든 키즈가 정식 서비스를 시작했습니다!</p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-yellow-700">⚠️ 시스템 점검</span>
                  <span className="text-xs text-yellow-600">2024.01.25</span>
                </div>
                <p className="text-sm text-yellow-800">1/25 새벽 2-4시 시스템 점검이 예정되어 있습니다.</p>
              </div>
            </div>

            {/* 더보기 버튼 */}
            <button 
              onClick={() => window.location.href = '/notice'}
              className="w-full mt-4 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors flex items-center justify-center space-x-1"
            >
              <span>전체 공지사항 보기</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 전화 상담 팝업 */}
      {isPhoneOpen && (
        <div className={`absolute bottom-20 right-0 mb-4 ${isPhoneClosing ? 'animate-fadeOutDown' : 'animate-fadeInUp'}`}>
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-72 transform transition-all duration-300 ease-in-out">
            {/* 화살표 */}
            <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
            
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">전화 상담</h3>
              <button
                onClick={togglePhonePopup}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 상담사 정보 */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">정</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">정진우</p>
                <p className="text-sm text-gray-600">상담 전문가</p>
              </div>
            </div>

            {/* 전화번호 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">직통 전화</p>
                  <p className="text-lg font-bold text-gray-900">010-4549-1903</p>
                </div>
                <button
                  onClick={handleCall}
                  className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 안내 메시지 */}
            <p className="text-xs text-gray-500 text-center">
              평일 09:00 - 18:00<br />
              언제든지 편안하게 문의해주세요
            </p>

            {/* 전화걸기 버튼 */}
            <button
              onClick={handleCall}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>지금 전화하기</span>
            </button>
          </div>
        </div>
      )}

      {/* 공지사항 버튼 */}
      <button
        onClick={toggleNoticePopup}
        className={`w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group mb-3 ${
          isNoticeOpen ? 'rotate-12' : ''
        }`}
      >
        <svg 
          className={`w-6 h-6 transition-transform duration-300 ${isNoticeOpen ? 'scale-110' : 'group-hover:scale-110'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
      </button>

      {/* 전화 상담 버튼 */}
      <button
        onClick={togglePhonePopup}
        className={`w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group ${
          isPhoneOpen ? 'rotate-12' : ''
        }`}
      >
        <svg 
          className={`w-6 h-6 transition-transform duration-300 ${isPhoneOpen ? 'scale-110' : 'group-hover:scale-110'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
          />
        </svg>
      </button>

      {/* 툴팁들 */}
      {!isPhoneOpen && !isNoticeOpen && (
        <>
          <div className="absolute bottom-20 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              전화 상담하기
              <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          <div className="absolute bottom-32 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              공지사항
              <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
