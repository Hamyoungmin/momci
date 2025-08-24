import Link from 'next/link';

export default function GuideHero() {
  return (
    <section className="bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            더모든 키즈 이용안내
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto">
            안전하고 투명한 홈티칭 매칭 플랫폼<br />
            더모든 키즈 이용 방법을 자세히 알아보세요
          </p>
          
          {/* 주요 특징 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-bold mb-2 text-gray-900">안전한 거래</h3>
              <p className="text-sm text-gray-600">검증된 치료사와 안전결제 시스템</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold mb-2 text-gray-900">합리적 수수료</h3>
              <p className="text-sm text-gray-600">업계 최저 9% 수수료</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-bold mb-2 text-gray-900">맞춤형 매칭</h3>
              <p className="text-sm text-gray-600">아이에게 최적화된 치료사 연결</p>
            </div>
          </div>
          
          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="bg-blue-500 text-white hover:bg-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              이용권 구매하기
            </Link>
            <Link
              href="#how-it-works"
              className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              이용방법 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
