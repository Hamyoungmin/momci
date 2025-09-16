import Link from 'next/link';
import Image from 'next/image';
import Statistics from '@/components/sections/Statistics';
import MainReviews from '@/components/sections/MainReviews';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="relative bg-blue-50 min-h-[75vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
            {/* 왼쪽 텍스트 영역 */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <div className="text-blue-900" style={{whiteSpace: 'nowrap'}}>우리 아이의 빛나는 잠재력,</div>
                  <div style={{whiteSpace: 'nowrap'}}>
                    <span className="text-blue-400">최고의 전문가가 </span>
                    <span className="text-blue-900">함께 찾아요.</span>
                  </div>
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

            {/* 오른쪽 이미지 영역 */}
            <div className="flex items-center justify-center lg:justify-end lg:pr-8">
              <div className="relative w-80 h-80 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20"></div>
                <Image
                  src="/32.png"
                  alt="모든별 키즈 마스코트 여우"
                  width={300}
                  height={300}
                  className="relative z-10 object-contain"
                  priority
                  unoptimized
                />
              </div>
            </div>

          </div>
          
          {/* 히어로섹션 내 통계 */}
          <div>
            <Statistics />
          </div>
        </div>
      </section>


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
                  엄격한 서류 및 경력 검증을 통과한<br />
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
                  매번 20%씩 내는 비싼 수수료 대신,<br />
                  합리적인 이용권으로 부담을 없앴습니다.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* 흰색 배경 */}
                    <rect width="80" height="80" fill="white" rx="10"/>
                    
                    {/* 파란색 사람 - 30.png와 동일 */}
                    <path d="M40 12 
                             C46 12, 50 16, 50 22 
                             C50 28, 46 32, 40 32 
                             C34 32, 30 28, 30 22 
                             C30 16, 34 12, 40 12 Z
                             
                             M38 32 L38 48 
                             L24 44 C22 43, 22 41, 24 42 L38 46 
                             L38 52 L34 68 C34 70, 36 70, 36 68 L40 54
                             L44 68 C44 70, 46 70, 46 68 L42 52
                             L42 46 L56 42 C58 41, 58 43, 56 44 L42 48
                             L42 32 C42 32, 38 32, 38 32 Z" 
                          fill="#38BDF8"/>
                  </svg>
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

      {/* 실제 학부모님 후기 - 새로운 슬라이드 버전 */}
      <MainReviews />

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
                <svg width="50" height="50" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* 뒤쪽 큰 말풍선 */}
                  <ellipse cx="20" cy="18" rx="8" ry="6" fill="#00BFFF"/>
                  <path d="M15 22l-3 3v-3" fill="#00BFFF"/>
                  {/* 앞쪽 작은 말풍선 */}
                  <ellipse cx="12" cy="12" rx="6" ry="4.5" fill="#1E90FF"/>
                  <path d="M8 15l-2 2v-2" fill="#1E90FF"/>
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
                <svg width="50" height="50" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(45)">
                  {/* 로켓 본체 */}
                  <ellipse cx="16" cy="14" rx="4" ry="8" fill="#00BFFF"/>
                  {/* 로켓 머리 (뾰족한 부분) */}
                  <path d="M16 6l-2 4h4l-2-4z" fill="#1E90FF"/>
                  {/* 로켓 날개 */}
                  <path d="M12 18l-3 2v3l3-2z" fill="#00BFFF"/>
                  <path d="M20 18l3 2v3l-3-2z" fill="#00BFFF"/>
                  {/* 로켓 창문 */}
                  <circle cx="16" cy="12" r="1.5" fill="white"/>
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