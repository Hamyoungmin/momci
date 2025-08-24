export default function SafetyFeatures() {
  const safetyFeatures = [
    {
      icon: "🛡️",
      title: "안전결제 시스템",
      description: "첫 수업료를 더모든 키즈가 안전결제로 보관하여 사기, 수업 불이행 등으로부터 피해를 100% 예방합니다.",
      benefits: [
        "사기 위험 완전 차단",
        "수업료 안전 보관",
        "분쟁 시 즉시 환불"
      ]
    },
    {
      icon: "⚖️", 
      title: "분쟁 중재 서비스",
      description: "분쟁 발생 시, 플랫폼이 공식 규정에 따라 공정하게 중재해 드립니다.",
      benefits: [
        "공정한 분쟁 해결",
        "전문 중재팀 운영",
        "빠른 처리 프로세스"
      ]
    },
    {
      icon: "✅",
      title: "검증된 후기",
      description: "오직 플랫폼을 통해 검증된 회원만 후기를 작성할 수 있습니다.",
      benefits: [
        "실제 이용자만 후기 작성",
        "허위 후기 완전 차단", 
        "신뢰할 수 있는 평가"
      ]
    },
    {
      icon: "🚫",
      title: "직거래 방지",
      description: "플랫폼 외의 거래는 엄격히 금지되며, 위반 시 강력한 제재를 받습니다.",
      benefits: [
        "안전한 거래 환경",
        "수수료 투명성",
        "사기 예방 시스템"
      ]
    },
    {
      icon: "👥",
      title: "전문가 검증",
      description: "모든 치료사는 자격증과 경력을 철저히 검증받은 전문가입니다.",
      benefits: [
        "자격증 100% 검증",
        "경력 사실 확인",
        "지속적인 품질 관리"
      ]
    },
    {
      icon: "📞",
      title: "24시간 고객지원",
      description: "언제든지 문제가 발생하면 고객센터를 통해 즉시 도움을 받을 수 있습니다.",
      benefits: [
        "24시간 상담 가능",
        "신속한 문제 해결",
        "전문 상담팀 운영"
      ]
    }
  ];

  const prohibitedActions = [
    {
      action: "플랫폼 외 직접 결제",
      description: "수업료를 직접 지불하거나 받는 행위",
      penalty: "계정 정지 1개월"
    },
    {
      action: "개인 연락처 사전 공유",
      description: "매칭 확정 전 개인 연락처를 공유하는 행위", 
      penalty: "경고 및 매칭 취소"
    },
    {
      action: "허위 정보 제공",
      description: "자격증, 경력 등 허위 정보를 제공하는 행위",
      penalty: "영구 이용 정지"
    },
    {
      action: "부적절한 채팅",
      description: "수업과 관련 없는 부적절한 대화",
      penalty: "경고 및 채팅 제한"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            안전 기능
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            더모든 키즈는 학부모와 치료사 모두가 안전하게 이용할 수 있는<br />
            다양한 보안 시스템을 운영합니다
          </p>
        </div>

        {/* 안전 기능들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {safetyFeatures.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              {/* 아이콘 */}
              <div className="text-4xl mb-4">{feature.icon}</div>
              
              {/* 제목 */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              
              {/* 설명 */}
              <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
              
              {/* 혜택 */}
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 금지 행위 안내 */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-red-800 mb-4">
              ⚠️ 금지 행위 및 제재 사항
            </h3>
            <p className="text-red-700">
              안전한 플랫폼 운영을 위해 다음 행위들은 엄격히 금지됩니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prohibitedActions.map((item, index) => (
              <div key={index} className="bg-white border border-red-200 rounded-lg p-6">
                <h4 className="font-bold text-red-800 mb-2">{item.action}</h4>
                <p className="text-gray-700 text-sm mb-3">{item.description}</p>
                <div className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full inline-block">
                  제재: {item.penalty}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 신고 시스템 */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-orange-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            🔔 클린 캠페인 - 직거래 신고
          </h3>
          <p className="text-lg mb-6 opacity-90">
            직거래 유도나 부적절한 행위를 발견하시면 즉시 신고해주세요<br />
            신고가 확인되면 <strong>1개월 무료 이용권</strong>을 드립니다
          </p>
          <a
            href="/support/report"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            직거래 신고하기
          </a>
        </div>

        {/* 보안 인증 */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-6">보안 인증</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-green-500">✓</span>
              <span className="font-medium">SSL 보안 인증</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-green-500">✓</span>
              <span className="font-medium">개인정보보호 인증</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-green-500">✓</span>
              <span className="font-medium">PCI DSS 인증</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-green-500">✓</span>
              <span className="font-medium">ISO 27001 인증</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
