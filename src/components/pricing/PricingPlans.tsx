'use client';

import { useState } from 'react';

export default function PricingPlans() {
  const [selectedPlan, setSelectedPlan] = useState<'parent' | 'teacher'>('parent');

  const parentPlan = {
    type: 'parent',
    title: '부모님 이용권',
    subtitle: '홈티칭 비용의 거품을 빼고, 신뢰를 더했습니다',
    originalPrice: '19,800',
    discountPrice: '9,900',
    period: '월',
    discount: '50%',
    description: '기존 홈티칭의 높은 수수료(약 20%) 때문에 부담스러우셨나요? 더모든키즈는 치료비에 영향을 주지 않는 수수료를 9%로 한정하여, 치료팀과 1만원 이상 저렴한 합리적인 비용을 실현',
    features: [
      {
        icon: '🔍',
        title: '걱정된 진료비, 무제한 절약',
        description: '사실 아무곳 100% 시간 진료로 부담 없이되어 프로강목을 확십하고 온전 아이에게 생성 실천 장소를 허치하고 있는 본원 시작'
      },
      {
        icon: '🔥',
        title: '수수료 0%의 비용 절약',
        description: '진료료를 수수료 없이 화이 비료를 혜영하고, 학부모님은 기존 업체 가격으로 양질의 수업을 들을 수 있음'
      },
      {
        icon: '💬',
        title: '1:1 실시간 채팅으로 직접 소통',
        description: '충접한 할전 바로 볼 수, 선생님을 활목 아이에게 향상 타면 확인이의 신채을 결정 수 있음'
      }
    ],
    benefits: [
      '2명까지 무료 1:1 채팅',
      '안전결제 시스템',
      '검증된 전문가 매칭',
      '분쟁 시 무료 중재',
      '24시간 고객지원'
    ],
    cta: '지금 바로 이용권 시작하고 최고의 선생님 찾기',
    popular: true
  };

  const teacherPlan = {
    type: 'teacher',
    title: '선생님 이용권',
    subtitle: '선생님의 가치, 수수료 없이 100% 보상받으세요',
    originalPrice: '39,800',
    discountPrice: '19,900',
    period: '월',
    discount: '50%',
    vatIncluded: true,
    description: '더모든 키즈는 매칭 20%씩 떼어가던 수수료 대신, 선생님의 노력이 100% 수익으로 이어지는 투명한 환경을 제공합니다.',
    features: [
      {
        icon: '💰',
        title: '수익 극대화 (수수료 0%)',
        description: '첫 회차 수수료(순상 수업 되죽라명)을 제외한 모든 수업료는 100% 선생님의 수익입니다. 더 이상 비싼 수수료를 내지 마세요.'
      },
      {
        icon: '📅',
        title: '주도적인 활동',
        description: '기존 매칭에 머물러 않고, 활발은 시간, 장소, 비용을 직접 자유롭게 협의하여 더 많은 기회를 잡으세요.'
      },
      {
        icon: '🏆',
        title: '신뢰와 성장',
        description: '플랫폼 내 성심은 활동은 "더모든 키즈 인증 선생님" 배지로 이어지며, 학부모의 신뢰를 얻는 가장 확실한 방법입니다.'
      }
    ],
    benefits: [
      '무제한 학부모 지원',
      '프로필 최상위 노출',
      '인증 선생님 배지',
      '수익 100% 보장',
      '전문 매니저 지원'
    ],
    cta: '이용권 시작하고 새로운 기회 만들기',
    popular: false
  };

  const currentPlan = selectedPlan === 'parent' ? parentPlan : teacherPlan;

  return (
    <section id="pricing-plans" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            이용권 선택
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            학부모님과 치료사님을 위한 맞춤형 요금제를 선택하세요
          </p>
        </div>

        {/* 플랜 선택 탭 */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-xl p-2 shadow-lg">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedPlan('parent')}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                  selectedPlan === 'parent'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                👨‍👩‍👧‍👦 학부모님
              </button>
              <button
                onClick={() => setSelectedPlan('teacher')}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                  selectedPlan === 'teacher'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                👩‍⚕️ 치료사님
              </button>
            </div>
          </div>
        </div>

        {/* 선택된 플랜 카드 */}
        <div className="max-w-4xl mx-auto">
          <div className={`bg-white rounded-2xl shadow-2xl p-8 border-2 ${
            selectedPlan === 'parent' ? 'border-blue-500' : 'border-blue-500'
          } relative overflow-hidden`}>
            
            {/* 인기 배지 */}
            {currentPlan.popular && (
              <div className="absolute top-0 right-0 bg-red-500 text-white px-6 py-2 rounded-bl-lg font-bold">
                🔥 인기
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* 좌측: 요금 정보 */}
              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentPlan.title}
                </h3>
                <p className="text-gray-600 mb-6">{currentPlan.subtitle}</p>
                
                {/* 가격 */}
                <div className="mb-6">
                  <div className="flex items-center justify-center lg:justify-start space-x-4 mb-2">
                    <span className="text-2xl text-gray-500 line-through">
                      {currentPlan.originalPrice}원
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {currentPlan.discount} 할인
                    </span>
                  </div>
                  <div className="flex items-baseline justify-center lg:justify-start space-x-2">
                    <span className={`text-5xl font-bold ${
                      selectedPlan === 'parent' ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {currentPlan.discountPrice}
                    </span>
                    <span className="text-gray-600 text-xl">원/{currentPlan.period}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">(VAT 포함)</p>
                </div>
                
                {/* 설명 */}
                <p className="text-gray-700 leading-relaxed mb-6">
                  {currentPlan.description}
                </p>
                
                {/* 혜택 목록 */}
                <div className="space-y-3 mb-8">
                  {currentPlan.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        selectedPlan === 'parent' ? 'bg-blue-500' : 'bg-orange-500'
                      }`}>
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA 버튼 */}
                <button className={`w-full lg:w-auto px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg ${
                  selectedPlan === 'parent'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}>
                  {currentPlan.cta}
                </button>
              </div>
              
              {/* 우측: 주요 기능 */}
              <div className="space-y-6">
                <h4 className="text-xl font-bold text-gray-900 text-center lg:text-left">
                  주요 혜택 3가지
                </h4>
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{feature.icon}</div>
                      <div>
                        <h5 className="font-bold text-gray-900 mb-2">{feature.title}</h5>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              🎁 특별 혜택 안내
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>✅ 첫 7일 무료 체험 (언제든 취소 가능)</p>
              <p>✅ 첫 달 50% 할인 (신규 가입자 한정)</p>
              <p>✅ 3개월 이상 결제 시 추가 10% 할인</p>
              <p>✅ 친구 추천 시 양쪽 모두 1개월 무료</p>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              * 모든 혜택은 중복 적용 가능하며, 이벤트는 예고 없이 변경될 수 있습니다
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
