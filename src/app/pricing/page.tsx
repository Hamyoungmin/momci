import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용권 구매 - 모든별 키즈",
  description: "모든별 키즈 이용권을 구매하고 전문 치료사와 안전하게 매칭받으세요. 학부모와 선생님을 위한 합리적인 요금제를 확인하세요.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-4 border-blue-700 rounded-lg p-8">
            
            {/* 헤더 섹션 */}
            <div className="text-center mb-20 mt-20">
              {/* 메인 제목 */}
              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-snug">
                이용권을 선택해주세요
              </h1>
              
              {/* 설명 */}
              <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
                모든별 키즈는 학부모님과 선생님 모두를 위한 합리적인 이용권을 제공합니다.
              </p>
            </div>

            {/* 선택 카드들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              
              {/* 학부모 이용권 카드 */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="bg-blue-100 p-4 rounded-full inline-flex">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    학부모 이용권
                  </h2>
                  <p className="text-gray-600 mb-6">
                    우리 아이에게 맞는 최고의 선생님을 찾아보세요
                  </p>
                  
                  {/* 주요 혜택 */}
                  <div className="space-y-3 mb-8 text-left">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">검증된 전문가 무제한 열람</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">수수료 0%로 비용 절감</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
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
                  <div className="mb-4">
                    <div className="bg-blue-100 p-4 rounded-full inline-flex">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    선생님 이용권
                  </h2>
                  <p className="text-gray-600 mb-6">
                    수수료 없이 100% 수익을 가져가세요
                  </p>
                  
                  {/* 주요 혜택 */}
                  <div className="space-y-3 mb-8 text-left">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">수익 극대화 (수수료 0%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">주도적인 활동</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
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
