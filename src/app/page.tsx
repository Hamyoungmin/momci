import Link from 'next/link';
import Image from 'next/image';
import Statistics from '@/components/sections/Statistics';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="relative bg-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* 왼쪽 텍스트 영역 */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="text-blue-900">우리 아이의 빛나는 잠재력,</span><br />
                  <span className="text-blue-400">최고의 전문가가</span><br />
                  <span className="text-blue-900">함께 찾아요.</span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                  <span className="text-gray-600 font-bold">대한민국 No.1 아동 발달 전문가 매칭 플랫폼</span>
                </p>
              </div>


              {/* CTA 버튼들 */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/browse"
                    className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-xl flex items-center justify-center"
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    우리 아이 맞춤 전문가 찾기
                  </Link>
                  <Link
                    href="/register-teacher"
                    className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-5 rounded-2xl font-bold text-xl transition-all"
                  >
                    전문가로 활동하기
                  </Link>
                </div>
              </div>
            </div>

            {/* 오른쪽 치료사 프로필 카드 */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100 rounded-2xl p-8">
                    <div className="text-center" style={{gap: '10px', display: 'flex', flexDirection: 'column'}}>
                      {/* 프로필 이미지 */}
                      <div className="w-32 h-32 bg-blue-300 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-5xl">👩‍⚕️</span>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">전문 치료사</h3>
                        <p className="text-gray-600 text-lg">검증된 자격증 보유</p>
                      </div>
                      
                      {/* 별점 */}
                      <div className="flex justify-center items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">⭐</span>
                        ))}
                        <span className="text-gray-500 ml-2 font-medium">4.8 (137개)</span>
                      </div>
                      
                      {/* 가격 */}
                      <div className="space-y-1">
                        <div className="text-3xl font-bold text-blue-600">65,000원</div>
                        <p className="text-gray-500">시간당</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 배경 장식 */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-200 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 통계 섹션 */}
      <Statistics />

      {/* 핵심 역량 섹션 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-blue-900">모든별 키즈만의</span> <span className="text-blue-400">핵심 역량</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              소중한 우리 아이를 위해, 이 세 가지만은 반드시 약속합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <svg width="80" height="80" viewBox="0 0 110 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* 사람 머리 */}
                    <circle cx="40" cy="30" r="16" fill="#38BDF8"/>
                    {/* 사람 어깨/몸통 */}
                    <path d="M12 80C12 62 24 50 40 50C56 50 68 62 68 80H12Z" fill="#38BDF8"/>
                    {/* 체크 표시 */}
                    <path d="M62 46L74 58L94 36" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">검증된 전문가</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  업계 최상 및 철저 검증을 통과한<br />
                  전문가들이 아이와 함께합니다.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* 달러 표시만 크게 */}
                    <text x="40" y="45" fill="#38BDF8" fontSize="52" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">$</text>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">투명한 이용료</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  매월 20%씩 내는 번잡 수수료 대신,<br />
                  합리적인 이용권으로 부담을 줄였습니다.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image 
                    src="/30.png" 
                    alt="1:1 맞춤 수업"
                    width={80}
                    height={80}
                    className="object-contain" 
                    style={{
                      imageRendering: 'pixelated',
                      filter: 'contrast(1.3) brightness(1.1) saturate(1.2) sharpen(1px)',
                      WebkitFilter: 'contrast(1.3) brightness(1.1) saturate(1.2)',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                      WebkitFontSmoothing: 'antialiased'
                    }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">1:1 맞춤 수업</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  우리 아이에게 꼭 맞는 프로그램을<br />
                  전문가와 직접 소통하며 찾아보세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 실제 학부모님 후기 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-blue-900">실제</span> <span className="text-blue-400">학부모님 후기</span>
            </h2>
            <p className="text-xl text-gray-600">
              먼저 경험한 학부모님들의 목소리를 들어보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="flex mb-6 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className="w-6 h-6 text-yellow-400"
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed text-left">
                &ldquo;언어 발달이 늦어 걱정했는데, 좋은 선생님을 만나 아이가 자신감을 찾고 말이 정말 많이 늘었어요. 체계적으로 이끌어주셔서 감사합니다.&rdquo;
              </p>
              <p className="text-gray-500 text-left">- 김○영 학부모님 (언어치료)</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="flex mb-6 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className="w-6 h-6 text-yellow-400"
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed text-left">
                &ldquo;산만하던 아이가 선생님과 수업하면서 집중하는 시간이 길어졌어요. 아이의 변화가 눈에 보여서 정말 신기하고 만족스럽습니다. 강력 추천해요!&rdquo;
              </p>
              <p className="text-gray-500 text-left">- 박○수 학부모님 (놀이치료)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 간편한 이용 방법 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-blue-900">간편한</span> <span className="text-blue-400">이용 방법</span>
            </h2>
            <p className="text-xl text-gray-600">
              단 4단계면 충분해요. 지금 바로 시작해보세요.
            </p>
          </div>

          <div className="flex items-center justify-center overflow-x-auto" style={{gap: '80px', minWidth: '100%'}}>
            {/* 1. 전문가 찾기 */}
            <div className="text-center" style={{gap: '10px', display: 'flex', flexDirection: 'column'}}>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-md border border-gray-100">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="#00BFFF" strokeWidth="2"/>
                  <path d="m21 21-4.35-4.35" stroke="#00BFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">1. 전문가 찾기</h3>
            </div>
            
            {/* 화살표 1 */}
            <div className="hidden md:flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14m-7-7l7 7-7 7" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* 2. 1:1 채팅 */}
            <div className="text-center" style={{gap: '10px', display: 'flex', flexDirection: 'column'}}>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-md border border-gray-100">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* 뒤쪽 큰 말풍선 */}
                  <ellipse cx="20" cy="14" rx="8" ry="6" fill="#00BFFF"/>
                  <path d="M15 18l-3 3v-3" fill="#00BFFF"/>
                  {/* 앞쪽 작은 말풍선 */}
                  <ellipse cx="12" cy="8" rx="6" ry="4.5" fill="#1E90FF"/>
                  <path d="M8 11l-2 2v-2" fill="#1E90FF"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">2. 1:1 채팅</h3>
            </div>
            
            {/* 화살표 2 */}
            <div className="hidden md:flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14m-7-7l7 7-7 7" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* 3. 안전 결제 */}
            <div className="text-center" style={{gap: '10px', display: 'flex', flexDirection: 'column'}}>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-md border border-gray-100">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="20" height="12" rx="2" ry="2" fill="#00BFFF"/>
                  <line x1="2" y1="10" x2="22" y2="10" stroke="white" strokeWidth="1.5"/>
                  <line x1="6" y1="14" x2="10" y2="14" stroke="white" strokeWidth="1.5"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">3. 안전 결제</h3>
            </div>
            
            {/* 화살표 3 */}
            <div className="hidden md:flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14m-7-7l7 7-7 7" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* 4. 수업 시작 */}
            <div className="text-center" style={{gap: '10px', display: 'flex', flexDirection: 'column'}}>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-md border border-gray-100">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l8 6v8l-8 6-8-6V8l8-6z" fill="#00BFFF"/>
                  <path d="M8 10l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">4. 수업 시작</h3>
            </div>
          </div>
        </div>
      </section>
      
      {/* 최종 CTA 섹션 */}
      <section className="py-20 bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              지금 바로 우리 아이의<br />
              놀라운 변화를 확인해보세요.
            </h2>
            <Link
              href="/browse"
              className="inline-block bg-white text-blue-800 hover:bg-gray-100 px-12 py-6 rounded-full font-bold text-xl transition-all transform hover:scale-105 shadow-lg"
            >
              무료로 전문가 프로필 둘러보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}