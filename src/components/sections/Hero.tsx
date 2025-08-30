import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-orange-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 텍스트 콘텐츠 */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              아이에게 딱 맞는<br />
              <span className="text-orange-500">전문 치료사</span>를<br />
              찾아보세요
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              더모든 키즈는 검증된 전문 치료사와 학부모를 안전하게 연결하는<br />
              홈티칭 매칭 플랫폼입니다. 아이에게 꼭 필요한 가장 효과적인 도움을 제공합니다.
            </p>
            
            {/* 주요 혜택 포인트 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">수수료 9%</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">안전결제 시스템</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">검증된 전문가</span>
              </div>
            </div>
            
            {/* CTA 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/pricing"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-lg"
              >
                이용권 구매하고 시작하기
              </Link>
              <Link
                href="/guide"
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg transition-colors"
              >
                서비스 이용방법 보기
              </Link>
            </div>
          </div>
          
          {/* 이미지/일러스트 영역 */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-100 to-orange-100 rounded-2xl p-8">
                <div className="text-center">
                  <div className="w-32 h-32 bg-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-4xl">👩‍⚕️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">김OO 치료사</h3>
                  <p className="text-gray-600 mb-4">7년차 언어재활사</p>
                  <div className="flex justify-center items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                    <span className="text-sm text-gray-500 ml-2">4.8 (13개)</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">65,000원</div>
                  <p className="text-sm text-gray-500">시간당</p>
                </div>
              </div>
            </div>
            
            {/* 배경 장식 요소들 */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-200 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
      
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
    </section>
  );
}
