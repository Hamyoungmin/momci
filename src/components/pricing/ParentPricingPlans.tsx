export default function ParentPricingPlans() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-4 border-blue-700 rounded-lg p-6">
            
            {/* 헤더 섹션 */}
            <div className="text-center mt-16 mb-16">
              {/* 메인 제목 */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                홈티칭 비용의 거품을 빼고, 신뢰를 더했습니다.
              </h1>
              
              {/* 설명 */}
              <p className="text-sm text-gray-600 leading-relaxed max-w-4xl mx-auto">
                기존 홈티칭의 높은 수수료(약 20%) 때문에 부담스러우셨나요? 모든별 키즈은 치료비에 붙는 중개 수수료를 <span className="text-blue-600 font-bold">0원</span>으로 만들어 회기당 평균 1만원 이상 저렴한 합리적인 비용을 실현했습니다.
              </p>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="text-center">
              
              {/* 가격 박스 */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-20 max-w-4xl mx-auto">
                <h2 className="text-base font-bold text-gray-900">
                  월 9,900원으로 누리는 핵심 혜택 3가지
                </h2>
              </div>
              
              {/* 혜택 목록 */}
              <div className="space-y-20 mb-20 max-w-4xl mx-auto">
                
                {/* 첫 번째 혜택 */}
                <div className="flex items-start space-x-4 text-left">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      검증된 전문가, 무제한 열람
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      자격/경력을 100% 사전 검증한 모든 선생님의 프로필을 확인하고 우리 아이에게 꼭 맞는 분을 직접 찾으세요.
                    </p>
                  </div>
                </div>

                {/* 두 번째 혜택 */}
                <div className="flex items-start space-x-4 text-left">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      수수료 0%로 비용 절감
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      선생님은 수수료 부담 없이 비용을 제안하고, 학부모님은 거품 없는 가격으로 최고의 수업을 받습니다.
                    </p>
                  </div>
                </div>

                {/* 세 번째 혜택 */}
                <div className="flex items-start space-x-4 text-left">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      1:1 실시간 채팅으로 직접 소통
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      궁금한 점은 바로 묻고, 인터뷰를 통해 아이와의 합을 미리 확인하며 신뢰를 쌓을 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 추가 정보 */}
              <p className="text-black text-base font-bold leading-relaxed mb-4 max-w-4xl mx-auto">
                커피 두 잔 값으로, 매달 4만원 이상의 비용을 아끼고 우리 아이의 최고의 파트너를 만나보세요.
              </p>
              
              {/* CTA 버튼 */}
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-4 px-6 rounded-2xl transition-colors shadow-lg max-w-4xl mx-auto">
                지금 바로 이용권 시작하고 최고의 선생님 찾기
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
