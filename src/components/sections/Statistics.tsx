'use client';

import { useEffect, useState } from 'react';

export default function Statistics() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      icon: "👥",
      title: "누적 회원수",
      value: "44,444",
      unit: "명",
      description: "플랫폼에 가입한 총 이용자 수"
    },
    {
      icon: "🤝", 
      title: "누적 매칭수",
      value: "34,467",
      unit: "건",
      description: "성공적으로 이루어진 매칭 건수"
    },
    {
      icon: "📈",
      title: "월간 활성 사용자",
      value: "8,961",
      unit: "명", 
      description: "매월 활발하게 이용하는 사용자 수"
    },
    {
      icon: "⭐",
      title: "평균 만족도",
      value: "4.8",
      unit: "점",
      description: "사용자들의 평균 서비스 만족도"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            더모든 키즈 성과
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            많은 학부모님과 치료사분들이 더모든 키즈를 통해<br />
            안전하고 효과적인 매칭을 경험하고 계십니다
          </p>
        </div>

        {/* 통계 지표들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`text-center transform transition-all duration-700 delay-${index * 100} ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              {/* 아이콘 */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full text-white text-3xl mb-4">
                {stat.icon}
              </div>
              
              {/* 통계 수치 */}
              <div className="mb-2">
                <span className="text-4xl md:text-5xl font-bold text-gray-900">
                  {stat.value}
                </span>
                <span className="text-2xl font-semibold text-blue-500 ml-1">
                  {stat.unit}
                </span>
              </div>
              
              {/* 제목 */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {stat.title}
              </h3>
              
              {/* 설명 */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* 추가 성과 정보 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">🛡️</div>
            <h4 className="font-bold text-gray-900 mb-2">안전결제율</h4>
            <div className="text-2xl font-bold text-blue-600 mb-1">100%</div>
            <p className="text-sm text-gray-600">모든 거래가 안전하게 보호됩니다</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">✅</div>
            <h4 className="font-bold text-gray-900 mb-2">검증된 전문가</h4>
            <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
            <p className="text-sm text-gray-600">모든 치료사가 철저히 검증됩니다</p>
          </div>
          
          <div className="bg-orange-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">💰</div>
            <h4 className="font-bold text-gray-900 mb-2">수수료 0원</h4>
            <div className="text-2xl font-bold text-orange-600 mb-1">0%</div>
            <p className="text-sm text-gray-600">중개 수수료 없는 투명한 거래</p>
          </div>
        </div>

        {/* 신뢰도 배지들 */}
        <div className="mt-16">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-center text-gray-900 mb-6">
              신뢰할 수 있는 플랫폼
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-green-500">✓</span>
                <span className="font-medium">개인정보보호 인증</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-green-500">✓</span>
                <span className="font-medium">안전결제 시스템</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-green-500">✓</span>
                <span className="font-medium">24시간 고객지원</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-green-500">✓</span>
                <span className="font-medium">전문가 검증 시스템</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
