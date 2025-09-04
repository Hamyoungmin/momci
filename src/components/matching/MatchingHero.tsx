import Link from 'next/link';

export default function MatchingHero() {
  return (
    <section className="bg-white text-gray-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            아이에게 딱 맞는<br />
            <span className="text-blue-600">치료사 매칭</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto">
            더모든 키즈의 스마트 매칭 시스템으로<br />
            아이의 특성과 필요에 맞는 최고의 전문가를 찾아보세요
          </p>
          
          {/* 핵심 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <h3 className="font-semibold mb-1 text-gray-900">매칭 성공률</h3>
              <p className="text-sm text-gray-600">대부분의 학부모가 만족하는 매칭</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">3일</div>
              <h3 className="font-semibold mb-1 text-gray-900">평균 매칭 기간</h3>
              <p className="text-sm text-gray-600">빠르고 정확한 치료사 연결</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,200+</div>
              <h3 className="font-semibold mb-1 text-gray-900">검증된 치료사</h3>
              <p className="text-sm text-gray-600">다양한 분야의 전문가들</p>
            </div>
          </div>
          
          {/* 매칭 방법 선택 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <Link
              href="/request"
              className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">선생님께 요청하기</h3>
              <p className="text-sm text-gray-600 mb-4">
                원하는 조건을 작성하여<br />
                선생님들의 지원을 받는 방식
              </p>
              <div className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                요청글 작성하기
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            
            <Link
              href="/browse"
              className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="text-4xl mb-4">👀</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">선생님 둘러보기</h3>
              <p className="text-sm text-gray-600 mb-4">
                등록된 선생님 프로필을<br />
                직접 탐색하여 소통 시작
              </p>
              <div className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                선생님 찾아보기
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
          
          {/* 추가 CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="bg-blue-500 text-white hover:bg-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              이용권 구매하고 시작하기
            </Link>
            <Link
              href="/faq"
              className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              매칭 방법 자세히보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
