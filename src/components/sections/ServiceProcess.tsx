export default function ServiceProcess() {
  const processes = [
    {
      step: "STEP 1",
      title: "선생님 찾기 및 인터뷰",
      icon: "🔍",
      description: "이용권 구매 후 두 가지 방법으로 선생님을 찾을 수 있어요",
      details: [
        "선생님께 요청하기: 원하는 조건을 작성하여 선생님들의 지원을 받음",
        "선생님 둘러보기: 선생님 프로필을 직접 탐색하여 소통 시작",
        "관심있는 선생님과 1:1 실시간 채팅으로 인터뷰 (총 2명까지 무료)"
      ],
      note: "3번째 선생님과 채팅 시에는 직접거래 방지를 위해 보증금 10,000원 필요"
    },
    {
      step: "STEP 2", 
      title: "안전한 첫 시작",
      icon: "💳",
      description: "마음에 드는 선생님과 안전한 결제로 수업을 시작해요",
      details: [
        "인터뷰 후 마음에 드는 선생님과 일정 확정",
        "플랫폼에서 첫 날 수업료를 안전하게 결제 (사기 방지)",
        "결제 완료되면 선생님의 연락처 공개"
      ],
      note: "안전결제 시스템으로 100% 안전한 거래"
    },
    {
      step: "STEP 3",
      title: "자유로운 수업 진행", 
      icon: "📚",
      description: "첫 날 수업 완료 후 선생님과 직접 소통하여 원활한 수업이 이어져요",
      details: [
        "첫 수업 완료 후 선생님과 직접 소통",
        "이후 과정은 별도의 수수료 부과하지 않음",
        "원하는 방식으로 자유롭게 수업 진행"
      ],
      note: "수수료 0%로 부담 없는 지속적인 수업"
    },
    {
      step: "STEP 4",
      title: "후기 작성",
      icon: "⭐",
      description: "수업 1달 이후 후기를 작성하여 다른 학부모들을 도와주세요",
      details: [
        "수업 1달 이후 후기 작성",
        "다른 학부모들을 위한 소중한 후기 남기기",
        "후기 작성 시 다양한 혜택과 보상 제공"
      ],
      note: "후기 작성으로 커뮤니티에 기여하고 혜택도 받으세요"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            더모든 키즈 이용 가이드
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            전체 서비스 플로우를 4단계로 나누어 쉽고 안전하게 이용할 수 있어요
          </p>
        </div>

        {/* 프로세스 스텝들 */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border-2 border-blue-500 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              더모든 키즈 이용 가이드
            </h3>
            <div className="space-y-8">
              {processes.map((process, index) => (
                <div key={index} className="relative">
                  {/* 프로세스 카드 */}
                  <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                {/* 스텝 헤더 */}
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">{process.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {process.step}. {process.title}
                  </h3>
                </div>
                
                {/* 설명 */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {process.description}
                </p>
                
                {/* 상세 내용 */}
                <ul className="space-y-2 mb-4">
                  {process.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start space-x-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                
                {/* 주의사항 */}
                {process.note && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3">
                    <p className="text-xs text-yellow-800">
                      <span className="font-semibold">💡 참고: </span>
                      {process.note}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
            </div>
          </div>
        </div>

        {/* 하단 CTA */}
        <div className="text-center mt-12">
          <div className="bg-gray-50 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              간단한 4단계로 안전하고 편리하게!
            </h3>
            <p className="text-gray-600 mb-6">
              더모든 키즈와 함께 아이에게 최고의 치료사를 찾아보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pricing"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold transition-colors"
              >
                이용권 구매하기
              </a>
              <a
                href="/browse"
                className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-2xl font-semibold transition-colors"
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
