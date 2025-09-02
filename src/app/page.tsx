import Link from 'next/link';
import Hero from '@/components/sections/Hero';

export default function Home() {
  return (
    <div>
      {/* 히어로 섹션 */}
      <Hero />
      
      {/* 핵심 기능 소개 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              모든별 키즈가 특별한 이유
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              안전하고 투명한 홈티칭 매칭으로 아이에게 최고의 치료 환경을 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/guide" className="group">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-lg hover:border-blue-500 transition-all">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">가이드</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">이용안내</h3>
                <p className="text-gray-600 text-sm">4단계 간단한 이용 방법을 확인하세요</p>
              </div>
            </Link>

            <Link href="/matching" className="group">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-lg hover:border-blue-500 transition-all">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-lg">매칭</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">홈티매칭</h3>
                <p className="text-gray-600 text-sm">다양한 치료 프로그램과 전문가 매칭</p>
              </div>
            </Link>

            <Link href="/reviews" className="group">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-lg hover:border-blue-500 transition-all">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-yellow-600 font-bold text-lg">후기</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">치료사 후기</h3>
                <p className="text-gray-600 text-sm">실제 이용자들의 생생한 후기를 확인</p>
              </div>
            </Link>

            <Link href="/support" className="group">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-lg hover:border-blue-500 transition-all">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-lg">지원</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">고객센터</h3>
                <p className="text-gray-600 text-sm">문의사항과 지원 서비스 이용</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA 섹션 */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 opacity-90">
            모든별 키즈와 함께 아이에게 최고의 치료사를 만나보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="bg-white text-blue-500 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              이용권 구매하기
            </Link>
            <Link
              href="/browse"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-500 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              선생님 둘러보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
