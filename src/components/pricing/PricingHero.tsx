export default function PricingHero() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-orange-600 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            합리적인 요금으로<br />
            <span className="text-yellow-300">최고의 서비스</span>를 경험하세요
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            모든별 키즈는 기존 홈티칭의 높은 수수료 부담을 줄이고<br />
            안전하고 투명한 매칭 서비스를 제공합니다
          </p>
          
          {/* 핵심 혜택 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">수수료 대폭 절약</h3>
              <div className="text-lg">
                <span className="line-through opacity-60">기존 20%</span>
                <span className="mx-2">→</span>
                <span className="text-yellow-300 font-bold">9%</span>
              </div>
              <p className="text-sm opacity-80 mt-2">매월 4만원 이상 절약</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-2">100% 안전 보장</h3>
              <p className="text-sm opacity-80">
                안전결제 시스템으로<br />
                사기 위험 완전 차단
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-2">검증된 전문가</h3>
              <p className="text-sm opacity-80">
                자격증과 경력을<br />
                철저히 검증한 치료사들
              </p>
            </div>
          </div>
          
          {/* 할인 이벤트 배너 */}
          <div className="bg-yellow-400 text-gray-900 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">🎉</span>
              <h3 className="text-xl font-bold">신규 가입 특별 혜택</h3>
              <span className="text-2xl">🎉</span>
            </div>
            <p className="text-lg font-semibold">
              첫 달 <span className="text-red-600 text-2xl font-bold">50% 할인</span> + 
              <span className="text-blue-600 font-bold"> 1:1 채팅 2회 추가 무료</span>
            </p>
            <p className="text-sm mt-2 opacity-80">
              * 이벤트는 선착순 100명 한정이며, 예고 없이 종료될 수 있습니다
            </p>
          </div>
          
          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pricing-plans"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              요금제 선택하기
            </a>
            <a
              href="/guide"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              서비스 자세히 보기
            </a>
          </div>
        </div>
      </div>
      
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
    </section>
  );
}
