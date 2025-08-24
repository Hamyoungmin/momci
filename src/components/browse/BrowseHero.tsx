export default function BrowseHero() {
  return (
    <section className="bg-gradient-to-br from-purple-600 to-orange-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            선생님 둘러보기
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            검증된 전문 치료사들의 프로필을 확인하고<br />
            아이에게 최적의 선생님을 직접 선택하세요
          </p>
          
          {/* 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-300 mb-2">1,200+</div>
              <h3 className="font-bold mb-1">검증된 전문가</h3>
              <p className="text-sm opacity-80">모든 자격증과 경력 확인 완료</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-300 mb-2">4.8점</div>
              <h3 className="font-bold mb-1">평균 만족도</h3>
              <p className="text-sm opacity-80">실제 이용자들의 진솔한 평가</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-300 mb-2">즉시</div>
              <h3 className="font-bold mb-1">빠른 연결</h3>
              <p className="text-sm opacity-80">마음에 드는 선생님과 바로 채팅</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
