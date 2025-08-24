import Link from 'next/link';

export default function CreateRequestGuide() {
  const guideSteps = [
    {
      step: '1',
      title: '기본 정보 입력',
      icon: '📝',
      description: '아이의 나이, 성별, 거주 지역 등 기본적인 정보를 입력하세요',
      tips: [
        '정확한 나이와 성별을 입력해주세요',
        '희망하는 수업 지역을 구체적으로 작성해주세요',
        '연락 가능한 시간대를 명시해주세요'
      ]
    },
    {
      step: '2',
      title: '치료 분야 선택',
      icon: '🎯',
      description: '필요한 치료 분야와 구체적인 요구사항을 선택하세요',
      tips: [
        '정확한 진단명이나 상태를 알려주세요',
        '이전 치료 경험이 있다면 함께 작성해주세요',
        '우선적으로 개선하고 싶은 부분을 명시해주세요'
      ]
    },
    {
      step: '3',
      title: '희망 조건 작성',
      icon: '⏰',
      description: '수업 일정, 예산, 기타 희망사항을 상세히 작성하세요',
      tips: [
        '구체적인 요일과 시간을 제시해주세요',
        '예산 범위를 현실적으로 설정해주세요',
        '선생님에게 바라는 특별한 자질이 있다면 작성해주세요'
      ]
    },
    {
      step: '4',
      title: '요청글 게시',
      icon: '📤',
      description: '작성한 내용을 검토한 후 게시하여 선생님들의 지원을 받으세요',
      tips: [
        '게시 전 내용을 한 번 더 확인해주세요',
        '개인정보는 최소한만 포함시켜주세요',
        '게시 후 지원자들의 프로필을 꼼꼼히 확인해주세요'
      ]
    }
  ];

  const writingTips = [
    {
      title: '구체적으로 작성하세요',
      description: '아이의 상태와 필요한 도움을 구체적으로 설명할수록 적합한 선생님을 찾을 확률이 높아집니다.',
      icon: '🔍'
    },
    {
      title: '예산을 현실적으로 설정하세요',
      description: '시장 가격을 고려하여 현실적인 예산 범위를 제시하면 더 많은 지원을 받을 수 있습니다.',
      icon: '💰'
    },
    {
      title: '선생님의 자격을 명시하세요',
      description: '필요한 자격증이나 경험, 전문성을 명확히 요청하면 질 높은 매칭이 가능합니다.',
      icon: '🏆'
    },
    {
      title: '소통 방식을 고려하세요',
      description: '학부모와의 소통 방식이나 진행 상황 공유 방법에 대한 선호사항을 포함해주세요.',
      icon: '💬'
    }
  ];

  const commonMistakes = [
    {
      mistake: '너무 간단한 설명',
      solution: '아이의 상태와 목표를 구체적으로 설명',
      example: '"언어치료 필요" → "4세 남아, 어휘력 부족 및 발음 불명확, 또래 대화 어려움"'
    },
    {
      mistake: '비현실적인 예산',
      solution: '시장 가격을 조사 후 적정 예산 제시',
      example: '"시간당 2만원" → "시간당 5-7만원 (협의 가능)"'
    },
    {
      mistake: '개인정보 과다 노출',
      solution: '필요한 정보만 포함하고 구체적 위치는 매칭 후 공유',
      example: '"서울 강남구 대치동 00아파트" → "서울 강남구 (대치동 인근)"'
    },
    {
      mistake: '일방적인 조건 제시',
      solution: '상호 협의 가능한 부분을 명시',
      example: '"무조건 주말만" → "주말 선호, 평일 저녁 협의 가능"'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            요청글 작성 가이드
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            좋은 요청글을 작성하여 아이에게 최적의 선생님을 찾아보세요<br />
            구체적이고 명확한 요청일수록 더 좋은 매칭 결과를 얻을 수 있습니다
          </p>
        </div>

        {/* 작성 단계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {guideSteps.map((step, index) => (
            <div key={index} className="text-center">
              {/* 스텝 아이콘 */}
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
              </div>
              
              {/* 제목과 설명 */}
              <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{step.description}</p>
              
              {/* 팁들 */}
              <ul className="text-left space-y-2">
                {step.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start space-x-2 text-xs text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 작성 팁 */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            💡 작성 팁
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {writingTips.map((tip, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{tip.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">{tip.title}</h4>
                    <p className="text-gray-700 text-sm">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 흔한 실수와 해결책 */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            ⚠️ 흔한 실수와 해결책
          </h3>
          <div className="space-y-6">
            {commonMistakes.map((item, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-bold text-red-800 mb-2">❌ 실수</h4>
                    <p className="text-red-700 text-sm">{item.mistake}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">✅ 해결책</h4>
                    <p className="text-blue-700 text-sm">{item.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800 mb-2">📝 예시</h4>
                    <p className="text-green-700 text-sm">{item.example}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 요청글 예시 */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            📋 좋은 요청글 예시
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gray-900">
                5세 남아 언어치료 및 놀이치료 선생님 구합니다
              </h4>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>아이 정보:</strong> 5세 남아, 언어발달지연 진단</p>
                <p><strong>현재 상태:</strong> 어휘력 부족, 2-3단어 조합 가능, 발음 일부 불명확</p>
                <p><strong>치료 목표:</strong> 어휘력 확장, 문장 구성 능력 향상, 또래와의 의사소통 개선</p>
                <p><strong>희망 일정:</strong> 주 2회, 평일 오후 3-6시 사이 (협의 가능)</p>
                <p><strong>예산:</strong> 회당 5-6만원 (경력에 따라 협의)</p>
                <p><strong>기타:</strong> 아이가 활발하고 호기심이 많음, 놀이를 통한 학습 선호</p>
                <p><strong>선생님 요건:</strong> 언어치료사 자격증 보유, 유아 경험 3년 이상</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              이제 요청글을 작성해보세요!
            </h3>
            <p className="text-lg mb-6 opacity-90">
              위의 가이드를 참고하여 아이에게 최적의 선생님을 찾아보세요<br />
              구체적인 요청일수록 더 좋은 결과를 얻을 수 있습니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request/create"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                📝 요청글 작성하기
              </Link>
              <Link
                href="/browse"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                👀 선생님 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
