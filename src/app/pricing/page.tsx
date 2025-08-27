import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용권 구매 - 더모든 키즈",
  description: "더모든 키즈 이용권을 구매하고 전문 치료사와 안전하게 매칭받으세요. 학부모와 선생님을 위한 합리적인 요금제를 확인하세요.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-4 border-blue-700 rounded-lg p-8">
            
            {/* 헤더 섹션 */}
            <div className="text-center mt-20 mb-20">
              {/* 메인 제목 */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-snug">
                이용권을 선택해주세요
              </h1>
              
              {/* 설명 */}
              <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
                더모든 키즈는 학부모님과 선생님 모두를 위한 합리적인 이용권을 제공합니다.
              </p>
            </div>

            {/* 선택 카드들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              
              {/* 학부모 이용권 카드 */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    학부모 이용권
                  </h2>
                  <p className="text-gray-600 mb-6">
                    우리 아이에게 맞는 최고의 선생님을 찾아보세요
                  </p>
                  
                  {/* 주요 혜택 */}
                  <div className="space-y-3 mb-8 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">✅</span>
                      <span className="text-sm text-gray-600">검증된 전문가 무제한 열람</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">✅</span>
                      <span className="text-sm text-gray-600">수수료 0%로 비용 절감</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">✅</span>
                      <span className="text-sm text-gray-600">1:1 실시간 채팅</span>
                    </div>
                  </div>
                  
                  <div className="text-xl font-bold text-blue-600 mb-6">
                    월 9,900원
                  </div>
                  
                  <Link 
                    href="/parent-pricing"
                    className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    학부모 이용권 자세히 보기
                  </Link>
                </div>
              </div>

              {/* 선생님 이용권 카드 */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="text-4xl mb-4">👨‍🏫</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    선생님 이용권
                  </h2>
                  <p className="text-gray-600 mb-6">
                    수수료 없이 100% 수익을 가져가세요
                  </p>
                  
                  {/* 주요 혜택 */}
                  <div className="space-y-3 mb-8 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">✅</span>
                      <span className="text-sm text-gray-600">수익 극대화 (수수료 0%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">✅</span>
                      <span className="text-sm text-gray-600">주도적인 활동</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">✅</span>
                      <span className="text-sm text-gray-600">신뢰의 성장</span>
                    </div>
                  </div>
                  
                  <div className="text-xl font-bold text-blue-600 mb-6">
                    월 19,900원
                  </div>
                  
                  <Link 
                    href="/teacher-pricing"
                    className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    선생님 이용권 자세히 보기
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
