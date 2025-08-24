export default function RegisterGuide() {
  const steps = [
    {
      step: '01',
      title: '프로필 등록 및 검증',
      icon: '📋',
      description: '치료사 자격증으로 가입 및 프로필(학력/경력/자격증)을 관련 서류를 제출하며, 관리자 검토를 통해 처리됩니다.',
      note: '첫 서류 제출 시 등록보류, 검증 완료 1주 이내 재검토 처리될 수 있으니 유의 바랍니다.'
    },
    {
      step: '02', 
      title: '매칭 활동 시작',
      icon: '🤝',
      description: '선생님께 요청하기에서 학부모님의 요청글에 직접 지원하거나, 선생님 둘러보기에 등록된 프로필을 보고 학부모님의 제안을 받습니다.',
      note: '두 가지 방법 모두 이용권 구매 후 가능합니다.'
    },
    {
      step: '03',
      title: '인터뷰 및 수업 확정', 
      icon: '💬',
      description: '관심 있는 학부모님과 1:1 실시간 채팅으로 인터뷰를 진행합니다. 수업이 확정되면 학부모님이 첫 수업료를 결제하고, 이후 연락처가 공개됩니다.',
      note: '매칭 확정 전까지는 개인 연락처가 보호됩니다.'
    },
    {
      step: '04',
      title: '투명한 수익 구조',
      icon: '💰', 
      description: '첫 회차 수수료를 제외한 모든 수업료는 100% 선생님의 수익입니다. 플랫폼 내에서 안전하게 활동하며 "인증 선생님"으로 성장하세요.',
      note: '첫 회차 직거래는 금지되며, 더모든 키즈의 선생님은 특별하고 인정받는 혜택을 얻습니다.'
    }
  ];

  const benefits = [
    {
      title: '수익 극대화',
      description: '첫 회차 이후 수수료 0%, 모든 수업료 100% 보장',
      icon: '💰'
    },
    {
      title: '신뢰도 향상',
      description: '검증된 전문가로 인증받아 학부모 신뢰 확보',
      icon: '🏆'
    },
    {
      title: '안전한 환경',
      description: '분쟁 중재, 수업료 보장 등 완전한 보호',
      icon: '🛡️'
    },
    {
      title: '성장 지원',
      description: '전문 매니저 지원 및 지속적인 교육 기회',
      icon: '📈'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            더모든 키즈 치료사 등록안내
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            치료사 등록부터 활동까지의 전체 프로세스를<br />
            단계별로 안내해드립니다
          </p>
        </div>

        {/* 등록 단계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center">
              {/* 스텝 번호 */}
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                {step.step}
              </div>
              
              {/* 아이콘 */}
              <div className="text-4xl mb-4">{step.icon}</div>
              
              {/* 제목 */}
              <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
              
              {/* 설명 */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{step.description}</p>
              
              {/* 참고사항 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <span className="font-semibold">💡 참고: </span>
                  {step.note}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 주요 혜택 */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            더모든 키즈만의 특별한 혜택
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-200">
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h4 className="font-bold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 자격 요건 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            등록 자격 요건
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">✅ 필수 자격</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>관련 분야 국가 자격증 보유 (언어재활사, 작업치료사, 물리치료사 등)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>관련 학과 졸업 또는 동등한 교육 이수</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>아동/청소년 치료 경력 1년 이상</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>신원조회 및 범죄경력 조회 동의</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">⭐ 우대 사항</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>석사 이상 학위 보유자</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>전문 분야 추가 자격증 보유</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>홈티칭 경험 3년 이상</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>다양한 연령대 치료 경험</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
