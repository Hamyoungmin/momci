import Link from 'next/link';

export default function MatchingMethods() {
  const methods = [
    {
      id: 'request',
      title: '선생님께 요청하기',
      subtitle: '맞춤형 매칭',
      icon: '📝',
      description: '아이의 상황과 원하는 조건을 상세히 작성하면, 조건에 맞는 선생님들이 직접 지원해주는 방식입니다.',
      howItWorks: [
        {
          step: '1',
          title: '요청글 작성',
          desc: '아이의 나이, 상태, 원하는 치료 분야, 희망 시간 등을 자세히 작성'
        },
        {
          step: '2', 
          title: '선생님 지원',
          desc: '조건에 맞는 전문 치료사들이 요청글에 지원'
        },
        {
          step: '3',
          title: '프로필 확인',
          desc: '지원한 선생님들의 프로필과 자기소개를 확인'
        },
        {
          step: '4',
          title: '1:1 채팅',
          desc: '마음에 드는 선생님과 실시간 채팅으로 상담'
        }
      ],
      benefits: [
        '조건에 맞는 선생님들만 지원',
        '다양한 선택지 제공',
        '상세한 상담 가능',
        '비교 검토 용이'
      ],
      bestFor: [
        '구체적인 요구사항이 있는 경우',
        '여러 선생님을 비교하고 싶은 경우',
        '특별한 케어가 필요한 경우',
        '처음 이용하는 경우'
      ],
      color: 'blue',
      link: '/request'
    },
    {
      id: 'browse',
      title: '선생님 둘러보기',
      subtitle: '능동적 선택',
      icon: '👀',
      description: '등록된 모든 선생님의 프로필을 직접 확인하고, 마음에 드는 선생님에게 직접 연락하는 방식입니다.',
      howItWorks: [
        {
          step: '1',
          title: '프로필 탐색',
          desc: '지역, 치료 분야, 경력 등으로 필터링하여 선생님 검색'
        },
        {
          step: '2',
          title: '상세 정보 확인',
          desc: '프로필, 자격증, 경력, 후기 등을 상세히 검토'
        },
        {
          step: '3',
          title: '즉시 연락',
          desc: '마음에 드는 선생님에게 바로 1:1 채팅 요청'
        },
        {
          step: '4',
          title: '빠른 매칭',
          desc: '간단한 상담 후 빠른 매칭 성사'
        }
      ],
      benefits: [
        '빠른 매칭 가능',
        '주도적 선택',
        '투명한 정보 공개',
        '즉시 소통 가능'
      ],
      bestFor: [
        '빠른 매칭을 원하는 경우',
        '스스로 선택하고 싶은 경우',
        '특정 선생님이 있는 경우',
        '재이용하는 경우'
      ],
      color: 'orange',
      link: '/browse'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            두 가지 매칭 방법
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            더모든 키즈는 학부모님의 상황에 맞는 두 가지 매칭 방식을 제공합니다<br />
            어떤 방법이든 안전하고 확실한 매칭을 보장합니다
          </p>
        </div>

        {/* 매칭 방법들 */}
        <div className="space-y-16">
          {methods.map((method, index) => (
            <div key={method.id} className={`${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} flex flex-col lg:flex-row items-center gap-12`}>
              {/* 좌측: 설명 */}
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`text-5xl`}>{method.icon}</div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{method.title}</h3>
                    <p className={`text-lg font-semibold ${method.color === 'blue' ? 'text-blue-600' : 'text-orange-600'}`}>
                      {method.subtitle}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  {method.description}
                </p>
                
                {/* 이런 분께 추천 */}
                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 mb-4">📌 이런 분께 추천</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {method.bestFor.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${method.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 주요 혜택 */}
                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 mb-4">✨ 주요 혜택</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {method.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${method.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* CTA 버튼 */}
                <Link
                  href={method.link}
                  className={`inline-flex items-center px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg ${
                    method.color === 'blue'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {method.title} 시작하기
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              {/* 우측: 프로세스 */}
              <div className="flex-1">
                <div className={`bg-gradient-to-br ${method.color === 'blue' ? 'from-blue-50 to-blue-100' : 'from-orange-50 to-orange-100'} rounded-2xl p-8`}>
                  <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    📋 이용 프로세스
                  </h4>
                  <div className="space-y-6">
                    {method.howItWorks.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          method.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                        }`}>
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">{step.title}</h5>
                          <p className="text-gray-700 text-sm">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 비교 요약 */}
        <div className="mt-20">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              빠른 비교
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">구분</th>
                    <th className="text-center py-3 px-4 font-semibold text-blue-600">선생님께 요청하기</th>
                    <th className="text-center py-3 px-4 font-semibold text-orange-600">선생님 둘러보기</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">매칭 속도</td>
                    <td className="py-3 px-4 text-center">보통 (3-5일)</td>
                    <td className="py-3 px-4 text-center">빠름 (1-2일)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">선택의 폭</td>
                    <td className="py-3 px-4 text-center">높음 (조건별 매칭)</td>
                    <td className="py-3 px-4 text-center">매우 높음 (전체 탐색)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">맞춤도</td>
                    <td className="py-3 px-4 text-center">매우 높음</td>
                    <td className="py-3 px-4 text-center">높음</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">추천 대상</td>
                    <td className="py-3 px-4 text-center">신중한 선택을 원하는 분</td>
                    <td className="py-3 px-4 text-center">빠른 매칭을 원하는 분</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
