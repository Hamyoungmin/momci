import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* 왼쪽 텍스트 영역 */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                  아이에게 딱 맞는<br />
                  <span className="text-orange-500">전문 치료사</span>들을<br />
                  찾아보세요
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                  <span className="text-blue-700 font-bold">모든별 키즈</span>는 검증된 전문 치료사와 학부모를 안전하게 연결하는<br />
                  홈티칭 매칭 플랫폼입니다. 아이에게 꼭 필요한 가장 효과적인 도움을<br />
                  제공합니다.
                </p>
              </div>

              {/* 특징 포인트들 */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-lg font-medium text-gray-700">수수료 9%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-lg font-medium text-gray-700">안전결제 시스템</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-lg font-medium text-gray-700">검증된 전문가</span>
                </div>
              </div>

              {/* CTA 버튼들과 알림 배지 */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <span>N</span>
                    <span>1 Issue</span>
                    <span>×</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/request"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-xl"
                  >
                    선생님께 신청하고 시작하기!
                  </Link>
                  <Link
                    href="/browse"
                    className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-5 rounded-2xl font-bold text-xl transition-all"
                  >
                    선생님 직접방법 보기
                  </Link>
                </div>
              </div>
            </div>

            {/* 오른쪽 치료사 프로필 카드 */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-gradient-to-br from-blue-100 via-purple-50 to-orange-100 rounded-2xl p-8">
                    <div className="text-center space-y-4">
                      {/* 프로필 이미지 */}
                      <div className="w-32 h-32 bg-orange-300 rounded-full mx-auto flex items-center justify-center">
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
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-200 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 모든별 키즈 소개 섹션 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-3xl p-12">
            <div className="text-center space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                우리 아이의 빛나는 집중력
              </h2>
              <h3 className="text-2xl lg:text-3xl font-bold text-blue-600">
                청각의 전문가가 함께 찾아요.
              </h3>
              
              <div className="flex justify-center items-center space-x-4 my-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">👂</span>
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors">
                  우리 아이에 집중 전문가와 함께하기
                </button>
              </div>
              
              <div className="flex justify-center">
                <button className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold text-lg transition-colors">
                  전문가의 둘러보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold text-blue-600 mb-4">34,575 건</div>
              <p className="text-xl text-gray-700 font-medium">누적 매칭 건수</p>
            </div>
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold text-blue-600 mb-4">8,983 명</div>
              <p className="text-xl text-gray-700 font-medium">등록 전문 치료사</p>
            </div>
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold text-blue-600 mb-4">98 %</div>
              <p className="text-xl text-gray-700 font-medium">학부모 만족도</p>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 역량 섹션 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              모든별 키즈만의 핵심 역량
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              오랜 경험 우리 아이에게 치료, 아이 가격정책 방식으로 해드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 text-3xl">👩‍⚕️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">검증된 전문가</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                등록한 치료사 분들은 관련분야 졸업을 근무경력
                전문 자격증을 기반으로 아이에게 도움이
                가능합니다
              </p>
                </div>
            
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">투명한 이용료</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                매칭 성공시에는 내가 수업과 수수료만
                지. 발매있게 이용하실 수 있습니다 안정정을
                목표로 합니다
              </p>
            </div>
            
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 text-3xl">👥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">1:1 전속 수업</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                각 아이에게 알맞은 개별맞춤 수업은만들고
                집에서도 학습 개선 교육비는 다양한 방법이의
                방법한방다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 실제 학부모님 후기 */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              실제 학부모님 후기
            </h2>
            <p className="text-xl text-gray-600">
              전국 곳곳의 학부모님들의 추천 소감을 들어보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-3xl">😊</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">학부모님</h4>
                  <div className="flex text-yellow-400 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                &ldquo;아이가 집중하지 못해 자폐교육에서 쫓겨나듯 온 적이 있었는데 
                치료분야 센터가 좀더 다양한 방법으로 치료해주신 덕분에 
                시 집중하였습니다&rdquo;
              </p>
              <p className="text-gray-500">- 언어 발달상담 (학부모님)</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-3xl">😊</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">학부모님</h4>
                  <div className="flex text-yellow-400 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                &ldquo;검증받은 아이가 건전한 상호작용을 통한해서 즐겁히 실제 
                활동에. 아이가 집중력 배울 수 있어서 심야 전체적인 감정도는 
                낮다. 정말 수준해집니다&rdquo;
              </p>
              <p className="text-gray-500">- 언어 발달상담 (학부모님)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 간편한 이용 방법 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              간편한 이용 방법
            </h2>
            <p className="text-xl text-gray-600">
              단 4단계로 훌륭하도록, 자금 모집 시작해보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">1. 선생님 찾기</h3>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 text-3xl">👋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">2. 1:1 채팅</h3>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">3. 신청 결제</h3>
                </div>
            
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 text-3xl">✈️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">4. 수업 시작</h3>
            </div>
          </div>
        </div>
      </section>
      
      {/* 최종 CTA 섹션 */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              지금 바로 우리 아이의<br />
              믿음을 선생님을 찾아보세요.
            </h2>
            <Link
              href="/request"
              className="inline-block bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg"
            >
              우리 아이 선생님 요청 홈버턴으기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}