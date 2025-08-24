export default function ReviewsHero() {
  return (
    <section className="bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            치료사 후기
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto">
            실제 이용하신 학부모님들의 생생한 후기를<br />
            확인하고 믿을 수 있는 치료사를 선택하세요
          </p>
          
          {/* 주요 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.8점</div>
              <h3 className="font-bold mb-1 text-gray-900">평균 만족도</h3>
              <p className="text-sm text-gray-600">1,200+ 실제 후기 기준</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <h3 className="font-bold mb-1 text-gray-900">재이용 의향</h3>
              <p className="text-sm text-gray-600">만족한 학부모님들의 선택</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,500+</div>
              <h3 className="font-bold mb-1 text-gray-900">성공 매칭</h3>
              <p className="text-sm text-gray-600">지금까지 성사된 홈티칭</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
