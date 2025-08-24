export default function RegisterHero() {
  return (
    <section className="bg-gradient-to-br from-green-600 to-teal-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            더모든 키즈 치료사 등록
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            선생님의 전문성과 가치를 돋보이는 곳<br />
            더모든 키즈에 오신 것을 환영합니다
          </p>
          
          {/* 주요 혜택 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold mb-2">수익 100% 보장</h3>
              <p className="text-sm opacity-90">첫 회차 이후 수수료 없음</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="font-bold mb-2">인증 선생님 배지</h3>
              <p className="text-sm opacity-90">신뢰도 향상 및 우선 노출</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-bold mb-2">안전한 거래</h3>
              <p className="text-sm opacity-90">분쟁 중재 및 수업료 보장</p>
            </div>
          </div>
          
          {/* 등록 안내 */}
          <div className="bg-yellow-400 text-gray-900 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold mb-2">📋 등록 절차</h3>
            <p className="text-sm">
              프로필 등록 → 서류 검증 → 승인 완료 → 이용권 구매 → 활동 시작<br />
              <strong>평균 3-5일</strong> 내에 검증이 완료됩니다
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
