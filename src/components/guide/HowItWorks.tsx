export default function HowItWorks() {
  const parentSteps = [
    {
      step: "1",
      title: "선생님 찾기 및 인터뷰",
      icon: "🔍",
      description: "이용권 구매 후 원하는 선생님을 찾아보세요",
      details: [
        {
          method: "선생님께 요청하기",
          desc: "원하는 조건을 작성하여 선생님들의 지원을 받는 방식"
        },
        {
          method: "선생님 둘러보기", 
          desc: "등록된 선생님 프로필을 직접 탐색하여 소통을 시작하는 방식"
        }
      ],
      note: "관심있는 선생님과 1:1 실시간 채팅으로 인터뷰 (총 2명까지 무료)",
      warning: "3번째 선생님과 채팅 시에는 직접거래 방지를 위해 보증금 10,000원 필요"
    },
    {
      step: "2",
      title: "안전한 첫 시작 (첫 날 결제)",
      icon: "💳",
      description: "인터뷰 후 마음에 드는 선생님과 수업을 확정하세요",
      process: [
        "수업 결정: 인터뷰 후 마음에 드는 선생님과 일정 확정, 대표번호로 확정 신청",
        "안전결제: 플랫폼에서 첫 날 수업료를 안전하게 결제 (사기 방지 및 안전한 거래)",
        "연락처 공개: 결제 완료되면 선생님의 연락처 공개"
      ]
    },
    {
      step: "3", 
      title: "자유로운 수업 진행",
      icon: "📚",
      description: "첫 날 수업 완료 후 자유롭게 수업을 진행하세요",
      process: [
        "첫 날 수업 완료 후, 선생님과 직접 소통하여 원활한 수업이 이어짐",
        "이후 과정은 별도의 수수료 부과하지 않음",
        "학부모님과 선생님이 직접 일정과 방식을 조율"
      ]
    },
    {
      step: "4",
      title: "후기 작성",
      icon: "⭐",
      description: "수업 경험을 다른 학부모들과 공유해주세요",
      process: [
        "수업 1달 이후 후기 작성",
        "다른 학부모들을 위한 소중한 후기 남기기",
        "후기 작성 시 차회 이용 시 할인 혜택 등 보상 제공"
      ]
    }
  ];

  const teacherSteps = [
    {
      step: "1",
      title: "프로필 등록 및 활동 시작",
      icon: "📝",
      description: "전문 치료사로서 활동을 시작하세요",
      process: [
        "프로필 등록 및 승인: 치료사는 프로필을 등록하고, 관리자의 검토 후 승인",
        "이용권 구매: 프로필 승인이 완료되면, 기간제 이용권을 구매하여 모든 활동 시작"
      ]
    },
    {
      step: "2",
      title: "매칭 시작 및 인터뷰", 
      icon: "🤝",
      description: "학부모님과의 매칭을 시작하세요",
      details: [
        {
          method: "적극 매칭",
          desc: "선생님께 요청하기에서 학부모님의 요청글에 직접 지원"
        },
        {
          method: "수동 매칭", 
          desc: "선생님 둘러보기에 등록된 프로필을 보고 학부모님의 채팅을 받음"
        }
      ],
      note: "관심있는 학부모님과 1:1 실시간 채팅으로 인터뷰를 먼저 진행"
    },
    {
      step: "3",
      title: "수업 확정 및 수업 시작",
      icon: "🎯", 
      description: "매칭이 확정되면 수업을 시작하세요",
      process: [
        "수업 확정: 인터뷰 후 수업이 결정되면, 학부모님이 플랫폼을 통해 첫 날 수업료를 결제하고 매칭이 확정",
        "연락처 공개: 결제가 완료되어야 학부모님의 연락처가 공개됨"
      ]
    },
    {
      step: "4",
      title: "투명한 수수료 정책",
      icon: "💰",
      description: "합리적인 수수료로 안정적인 수입을 확보하세요",
      process: [
        "첫 매칭 수수료: 첫 수업 확정시, (주당 수업 횟수 x 1회분)의 수업료가 매칭 성사 수수료로 발생",
        "이후 수익 100% 보장: 첫 매칭 수수료를 제외한 모든 이후의 수업료는 100% 선생님의 수익"
      ],
      note: "학부모님과 직접 정산하면 됩니다"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            이용 방법
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            학부모와 치료사 모두를 위한 간단하고 안전한 이용 프로세스
          </p>
        </div>

        {/* 탭 선택 */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <div className="grid grid-cols-2 gap-1">
              <button className="px-6 py-3 rounded-md bg-blue-500 text-white font-semibold">
                학부모님
              </button>
              <button className="px-6 py-3 rounded-md text-gray-600 hover:text-gray-900 font-semibold">
                치료사님
              </button>
            </div>
          </div>
        </div>

        {/* 학부모 프로세스 */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            학부모님 이용 가이드
          </h3>
          
          {parentSteps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start space-x-6">
                {/* 스텝 아이콘 */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {step.step}
                  </div>
                </div>
                
                {/* 내용 */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{step.icon}</span>
                    <h4 className="text-xl font-bold text-gray-900">{step.title}</h4>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{step.description}</p>
                  
                  {/* 상세 내용 */}
                  {step.details && (
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-semibold text-blue-600 mb-2">{detail.method}</h5>
                          <p className="text-sm text-gray-700">{detail.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {step.process && (
                    <ul className="space-y-2 mb-4">
                      {step.process.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {step.note && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">💡 참고: </span>
                        {step.note}
                      </p>
                    </div>
                  )}
                  
                  {step.warning && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <span className="font-semibold">⚠️ 주의: </span>
                        {step.warning}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-500 to-orange-500 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              지금 바로 시작해보세요!
            </h3>
            <p className="text-lg mb-6 opacity-90">
              간단한 4단계로 아이에게 최적의 치료사를 만나보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pricing"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                이용권 구매하기
              </a>
              <a
                href="/browse"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                선생님 둘러보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
