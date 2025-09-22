'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Statistics from '@/components/sections/Statistics';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0); // 0,1,2

  const goPrev = () => setCurrent((c) => (c + 2) % 3);
  const goNext = () => setCurrent((c) => (c + 1) % 3);

  // 5초마다 자동으로 다음 슬라이드로 전환
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % 3);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative bg-blue-50 min-h-[75vh] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-8">
        <div className="relative items-center min-h-[60vh] px-2 sm:px-4 md:px-6">
          {/* 슬라이드 컨테이너 (부드러운 전환) */}
          <div className="relative min-h-[60vh]">
            {/* Slide 1 */}
            <div className={`absolute inset-0 transition-opacity duration-700 ease-out ${current === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* 왼쪽 텍스트 영역 */}
              <div className="space-y-8 lg:min-h-[60vh] flex flex-col justify-center lg:ml-8 xl:ml-12">
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight break-keep">
                    <div className="text-blue-900 xl:whitespace-nowrap">우리 아이의 빛나는{'\u00A0'}잠재력,</div>
                    <div className="xl:whitespace-nowrap">
                      <span className="text-blue-400">최고의 전문가가{'\u00A0'}</span>
                      <span className="text-blue-900">함께 찾아요.</span>
                    </div>
                  </h1>
                  <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                    <span className="text-gray-600 font-bold">대한민국 No.1 아동 발달 전문가 매칭 플랫폼</span>
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/browse"
                      className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-xl flex items-center justify-center break-keep md:whitespace-nowrap"
                    >
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      우리 아이 맞춤 전문가 찾기
                    </Link>
                    <Link
                      href="/register-teacher"
                      className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-5 rounded-2xl font-bold text-xl transition-all break-keep md:whitespace-nowrap"
                    >
                      전문가로 활동하기
                    </Link>
                  </div>
                </div>
              </div>
              {/* 오른쪽 이미지 */}
              <div className="mt-10 flex items-center justify-center lg:justify-end lg:mt-0">
                <div className="relative aspect-square w-56 sm:w-64 md:w-72 lg:w-80 xl:w-[22rem] lg:translate-x-6 xl:translate-x-10">
                  <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20"></div>
                  <Image
                    src="/32.png"
                    alt="모든별 키즈 마스코트 여우"
                    fill
                    className="relative z-10 object-contain"
                    priority
                    unoptimized
                    sizes="(min-width:1280px) 22rem, (min-width:1024px) 20rem, (min-width:768px) 18rem, (min-width:640px) 16rem, 14rem"
                  />
                </div>
              </div>
              </div>
            </div>
            {/* Slide 2 */}
            <div className={`absolute inset-0 transition-opacity duration-700 ease-out ${current === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="space-y-4 mb-8">
                <h2 className="text-5xl lg:text-6xl font-bold leading-tight text-blue-900">
                  신뢰할 수 있는 전문가 찾기,
                  <br />
                  <span className="text-blue-400">3단계면 충분해요.</span>
                </h2>
                <p className="text-gray-500 font-semibold text-xl md:text-2xl">복잡한 과정 없이, 쉽고 빠르게 전문가와 연결됩니다.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl">
                {/* 1 */}
                <div className="p-8">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-100">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="8" stroke="#38BDF8" strokeWidth="2"/>
                      <path d="m21 21-4.35-4.35" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">1. 전문가 탐색</h3>
                  <p className="text-gray-600 text-xl">원하는 조건으로<br />맞춤 전문가를 찾아보세요.</p>
                </div>

                {/* 2 */}
                <div className="p-8">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-100">
                    <svg width="60" height="60" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <ellipse cx="20" cy="18" rx="8" ry="6" fill="#38BDF8"/>
                      <path d="M15 22l-3 3v-3" fill="#38BDF8"/>
                      <ellipse cx="12" cy="12" rx="6" ry="4.5" fill="#1E90FF"/>
                      <path d="M8 15l-2 2v-2" fill="#1E90FF"/>
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">2. 1:1 채팅 인터뷰</h3>
                  <p className="text-gray-600 text-xl">궁금한 점은 채팅으로<br />편하게 질문하고 조율하세요.</p>
                </div>

                {/* 3 */}
                <div className="p-8">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-100">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="#38BDF8"/>
                      <path d="M7 12l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">3. 홈티칭 시작</h3>
                  <p className="text-gray-600 text-xl">마음에 쏙 드는 전문가와<br />안전하게 수업을 시작해요.</p>
                </div>
              </div>
            </div>
            </div>

            {/* Slide 3 */}
            <div className={`absolute inset-0 transition-opacity duration-700 ease-out ${current === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center md:text-left">
              <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
                {/* 왼쪽 아이콘 */}
                <div className="flex flex-col items-center md:items-start justify-center">
                  <div className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-full bg-blue-50 flex items-center justify-center">
                    <svg width="140" height="140" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="#38BDF8" strokeWidth="2" />
                      <path d="M7 12l3 3 7-7" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="mt-6 text-2xl md:text-3xl text-blue-500 font-semibold">전문가 인증 시스템</div>
                </div>

                {/* 오른쪽 텍스트 */}
                <div className="md:col-span-2">
                  <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-blue-900">
                    안심하고 맡기실 수 있도록
                    <br />
                    <span className="text-blue-400">꼼꼼한 검증 절차</span>를 거쳐요.
                  </h2>
                  <ul className="mt-6 space-y-3 text-lg">
                    <li className="flex items-center space-x-3"><span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-xs">✔</span><span>자격증 및 경력 증명서 확인</span></li>
                    <li className="flex items-center space-x-3"><span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-xs">✔</span><span>성범죄 경력 조회 서류 확인</span></li>
                    <li className="flex items-center space-x-3"><span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-xs">✔</span><span>1:1 인터뷰를 통한 전문성 검증</span></li>
                    <li className="flex items-center space-x-3"><span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-xs">✔</span><span>1분 자기소개 영상으로 직접 확인</span></li>
                  </ul>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* 내비게이션 */}
          <button onClick={goPrev} aria-label="이전 슬라이드" className="hidden md:flex absolute md:left-[-120px] lg:left-[-200px] xl:left-[-260px] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full w-14 h-14 items-center justify-center z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 19l-7-7 7-7" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={goNext} aria-label="다음 슬라이드" className="hidden md:flex absolute md:right-[-120px] lg:right-[-200px] xl:right-[-260px] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full w-14 h-14 items-center justify-center z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 5l7 7-7 7" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          {/* 인디케이터 */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[0,1,2].map((i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`슬라이드 ${i+1}`} className={`w-2.5 h-2.5 rounded-full ${current===i ? 'bg-blue-500' : 'bg-gray-300'}`}></button>
            ))}
          </div>
        </div>

        {/* 히어로섹션 내 통계 */}
        <div>
          <Statistics />
        </div>
      </div>
    </section>
  );
}


