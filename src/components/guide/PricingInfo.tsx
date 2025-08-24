export default function PricingInfo() {
  const parentPlan = {
    title: "부모님 이용권",
    subtitle: "홈티칭 비용의 거품을 빼고, 신뢰를 더했습니다",
    price: "9,900",
    period: "월",
    originalFee: "20%",
    newFee: "9%",
    features: [
      {
        icon: "🔍",
        title: "걱정된 진료비, 무제한 절약",
        description: "사실 아무곳 100% 시간 진료로 부담 없이 전문가와 믿을 수 있는 본원 시작"
      },
      {
        icon: "🔥", 
        title: "수수료 0%의 비용 절약",
        description: "진료료를 수수료 없이 모든 비용을 혜택하고, 학부모님은 기존 업체 가격으로 양질의 수업을 들을 수 있음"
      },
      {
        icon: "💬",
        title: "1:1 실시간 채팅으로 직접 소통", 
        description: "충분한 상담 바로 볼 수 있고, 선생님을 아이에게 가장 타당한 확인의의 신뢰을 결정 수 있음"
      }
    ],
    savings: "매월 4만원 이상의 비용을 아끼고 우수한 아이의 최고의 프로그램들을 만나보세요",
    cta: "지금 바로 이용권 시작하고 최고의 선생님 찾기"
  };

  const teacherPlan = {
    title: "선생님 이용권", 
    subtitle: "선생님의 가치, 수수료 없이 100% 보상받으세요",
    price: "19,900",
    period: "월",
    description: "더모든 키즈는 매칭 20%씩 떼어가던 수수료 대신, 선생님의 노력이 100% 수익으로 이어지는 투명한 환경을 제공합니다.",
    features: [
      {
        icon: "💰",
        title: "수익 극대화 (수수료 0%)",
        description: "첫 회차 수수료(최초 수업 수수료만)을 제외한 모든 수업료는 100% 선생님의 수익입니다. 더 이상 비싼 수수료를 내지 마세요."
      },
      {
        icon: "📅",
        title: "주도적인 활동",
        description: "기존 매칭에 머물지 않고, 활동할 시간, 장소, 비용을 직접 자유롭게 협의하여 더 많은 기회를 잡으세요."
      },
      {
        icon: "🏆", 
        title: "신뢰와 성장",
        description: "플랫폼 내 성실한 활동은 '더모든 키즈 인증 선생님' 배지로 이어지며, 학부모의 신뢰를 얻는 가장 확실한 방법입니다."
      }
    ],
    cta: "이용권 시작하고 새로운 기회 만들기"
  };

  const comparisonData = [
    {
      feature: "수수료",
      existing: "20%",
      momci: "9%",
      highlight: true
    },
    {
      feature: "안전결제",
      existing: "X",
      momci: "O",
      highlight: false
    },
    {
      feature: "전문가 검증",
      existing: "부분적",
      momci: "100%",
      highlight: false
    },
    {
      feature: "분쟁 중재",
      existing: "제한적",
      momci: "전문팀 운영",
      highlight: false
    },
    {
      feature: "1:1 채팅",
      existing: "유료",
      momci: "2회 무료",
      highlight: true
    },
    {
      feature: "후기 신뢰도",
      existing: "보통",
      momci: "검증된 후기만",
      highlight: false
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            요금 정보
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            합리적인 요금으로 최고의 서비스를 경험하세요
          </p>
        </div>

        {/* 요금제 비교 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* 부모님 이용권 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-500">
            <div className="text-center mb-8">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
                추천
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{parentPlan.title}</h3>
              <p className="text-gray-600 mb-4">{parentPlan.subtitle}</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-4xl font-bold text-blue-600">{parentPlan.price}</span>
                <span className="text-gray-600">원/{parentPlan.period}</span>
              </div>
              <div className="mt-4 flex items-center justify-center space-x-4">
                <span className="text-sm text-gray-500 line-through">기존 수수료 {parentPlan.originalFee}</span>
                <span className="text-sm text-orange-600 font-bold">→ 새로운 수수료 {parentPlan.newFee}</span>
              </div>
            </div>
            
            <div className="space-y-6 mb-8">
              {parentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 text-center">{parentPlan.savings}</p>
            </div>
            
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors">
              {parentPlan.cta}
            </button>
          </div>

          {/* 선생님 이용권 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{teacherPlan.title}</h3>
              <p className="text-gray-600 mb-4">{teacherPlan.subtitle}</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-4xl font-bold text-orange-600">{teacherPlan.price}</span>
                <span className="text-gray-600">원/{teacherPlan.period}</span>
                <span className="text-sm text-gray-500">(VAT 포함)</span>
              </div>
              <p className="text-sm text-gray-600 mt-4">{teacherPlan.description}</p>
            </div>
            
            <div className="space-y-6 mb-8">
              {teacherPlan.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors">
              {teacherPlan.cta}
            </button>
          </div>
        </div>

        {/* 기존 업체와 비교 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            기존 업체와 비교
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">비교 항목</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">기존 업체</th>
                  <th className="text-center py-3 px-4 font-semibold text-orange-600">더모든 키즈</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-900">{item.feature}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{item.existing}</td>
                    <td className={`py-4 px-4 text-center font-semibold ${item.highlight ? 'text-orange-600' : 'text-green-600'}`}>
                      {item.momci}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 하단 CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-orange-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              지금 시작하면 더 많이 절약하세요!
            </h3>
            <p className="text-lg mb-6 opacity-90">
              첫 달 50% 할인 이벤트 진행 중 (신규 가입자 한정)
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pricing?type=parent"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                학부모 이용권 구매
              </a>
              <a
                href="/pricing?type=teacher" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                치료사 이용권 구매
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
