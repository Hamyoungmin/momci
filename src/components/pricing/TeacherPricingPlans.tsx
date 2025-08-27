export default function TeacherPricingPlans() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-4 border-blue-700 rounded-lg p-8">
            
            {/* 헤더 섹션 */}
            <div className="text-center mt-20 mb-20">
              {/* 메인 제목 */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-snug">
                선생님의 가치, 수수료 없이 100% 보상받으세요.
              </h1>
              
              {/* 설명 */}
              <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
                더모든 키즈는 매번 20%씩 떼어가는 수수료 대신, 선생님의 노하우 100% 수익으로 이어지는 투명한 환경을 제공합니다.
              </p>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="text-center">
              
              {/* 가격 박스 */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 mb-30 max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  선생님 이용권: 월 19,900원 (VAT 포함)
                </h2>
                <p className="text-gray-600">
                  (단 한 번의 매칭에 성공하는 기준 수수료를 절약한 월 절약액입니다.)
                </p>
              </div>
              
              {/* 혜택 목록 */}
              <div className="space-y-30 mb-30 max-w-4xl mx-auto">
                
                {/* 첫 번째 혜택 */}
                <div className="flex items-start space-x-6 text-left">
                  <div className="text-2xl text-green-500 mt-1">
                    ✅
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      수익 극대화 (수수료 0%)
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      수수료로 수업 비용 제안에 제한을 받지 않고 100% 선생님이 수익합니다. 더 이상 수수료에 내 수업이 좌우받지 않습니다.
                    </p>
                  </div>
                </div>

                {/* 두 번째 혜택 */}
                <div className="flex items-start space-x-6 text-left">
                  <div className="text-2xl text-orange-500 mt-1">
                    📅
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      주도적인 활동
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      기존 플랫폼의 딱딱한 양식, 정형화된 신청, 제한적 활동을 벗어나 직접 자유롭게 수업 가격 안내.
                    </p>
                  </div>
                </div>

                {/* 세 번째 혜택 */}
                <div className="flex items-start space-x-6 text-left">
                  <div className="text-2xl text-blue-500 mt-1">
                    🏆
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      신뢰의 성장
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      솔직한 후기 중심의 '더모든 키즈 인증' 배지가 지속적이고 안정적인 수업들과 더 많은 기회를 만듭니다.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* CTA 버튼 */}
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl py-5 px-8 rounded-2xl transition-colors shadow-lg max-w-4xl mx-auto">
                이용권 시작하고 새로운 기회 만들기
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
