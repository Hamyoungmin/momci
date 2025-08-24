export default function MatchingProcess() {
  const processSteps = [
    {
      step: '1',
      title: '이용권 구매',
      icon: '💳',
      description: '더모든 키즈 이용권을 구매하고 매칭 서비스를 활성화하세요',
      details: [
        '학부모 이용권: 월 9,900원',
        '첫 달 50% 할인 혜택',
        '7일 무료 체험 제공',
        '언제든 취소 가능'
      ],
      note: '이용권 구매 후 바로 모든 기능 이용 가능'
    },
    {
      step: '2',
      title: '매칭 방식 선택',
      icon: '🎯',
      description: '요청하기 또는 둘러보기 중 원하는 매칭 방식을 선택하세요',
      details: [
        '선생님께 요청하기: 맞춤형 매칭',
        '선생님 둘러보기: 능동적 선택',
        '두 방식 모두 이용 가능',
        '상황에 따라 자유롭게 변경'
      ],
      note: '언제든 매칭 방식 변경 가능'
    },
    {
      step: '3',
      title: '선생님과 소통',
      icon: '💬',
      description: '1:1 실시간 채팅으로 선생님과 직접 상담하세요',
      details: [
        '최대 2명의 선생님과 무료 채팅',
        '실시간 상담 및 질문 가능',
        '아이 상태와 요구사항 공유',
        '수업 방식 및 일정 논의'
      ],
      note: '3번째 선생님부터는 보증금 10,000원 필요',
      warning: true
    },
    {
      step: '4',
      title: '매칭 확정',
      icon: '✅',
      description: '마음에 드는 선생님과 매칭을 확정하세요',
      details: [
        '선생님 선택 및 일정 확정',
        '첫 수업료 안전결제',
        '결제 완료 후 연락처 공개',
        '수업 준비 및 시작'
      ],
      note: '안전결제로 100% 보장'
    },
    {
      step: '5',
      title: '수업 진행',
      icon: '📚',
      description: '첫 수업 완료 후 자유롭게 수업을 계속 진행하세요',
      details: [
        '첫 수업 완료',
        '이후 수수료 없음 (100% 직접 거래)',
        '선생님과 직접 일정 조율',
        '지속적인 수업 진행'
      ],
      note: '이후 수업은 별도 수수료 없음'
    },
    {
      step: '6',
      title: '후기 작성',
      icon: '⭐',
      description: '수업 경험을 후기로 작성하여 다른 학부모들을 도와주세요',
      details: [
        '수업 1달 후 후기 작성',
        '선생님 평가 및 리뷰',
        '다른 학부모들을 위한 정보 공유',
        '후기 작성 시 혜택 제공'
      ],
      note: '후기 작성으로 커뮤니티 기여'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            매칭 프로세스
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            이용권 구매부터 수업 시작까지<br />
            더모든 키즈의 전체 매칭 과정을 확인해보세요
          </p>
        </div>

        {/* 프로세스 타임라인 */}
        <div className="relative">
          {/* 연결선 */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-orange-500 rounded-full"></div>
          
          {/* 프로세스 스텝들 */}
          <div className="space-y-8 lg:space-y-16">
            {processSteps.map((step, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-8 ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}>
                {/* 스텝 카드 */}
                <div className="flex-1 max-w-2xl">
                  <div className="bg-white rounded-2xl shadow-xl p-8 relative">
                    {/* 스텝 번호 */}
                    <div className="absolute -top-4 left-8 bg-gradient-to-r from-blue-500 to-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    
                    {/* 아이콘과 제목 */}
                    <div className="flex items-center space-x-4 mb-4 mt-4">
                      <div className="text-4xl">{step.icon}</div>
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    
                    {/* 설명 */}
                    <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                    
                    {/* 상세 내용 */}
                    <ul className="space-y-2 mb-6">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* 참고사항 */}
                    {step.note && (
                      <div className={`rounded-lg p-4 ${
                        step.warning 
                          ? 'bg-yellow-50 border border-yellow-200' 
                          : 'bg-blue-50 border border-blue-200'
                      }`}>
                        <p className={`text-sm ${
                          step.warning ? 'text-yellow-800' : 'text-blue-800'
                        }`}>
                          <span className="font-semibold">
                            {step.warning ? '⚠️ 주의: ' : '💡 참고: '}
                          </span>
                          {step.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 중앙 원 (데스크톱에서만) */}
                <div className="hidden lg:block relative z-10">
                  <div className="w-16 h-16 bg-white border-4 border-gradient-to-r from-blue-500 to-orange-500 rounded-full shadow-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"></div>
                  </div>
                </div>

                {/* 빈 공간 (균형 맞추기용) */}
                <div className="flex-1 max-w-2xl hidden lg:block"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 소요 시간 안내 */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-center text-gray-900 mb-8">
            ⏱️ 평균 소요 시간
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">즉시</div>
              <div className="font-semibold text-gray-900 mb-1">이용권 구매</div>
              <div className="text-sm text-gray-600">구매 후 바로 이용 가능</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">3-5일</div>
              <div className="font-semibold text-gray-900 mb-1">매칭 완료</div>
              <div className="text-sm text-gray-600">선생님 선택부터 확정까지</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">1주</div>
              <div className="font-semibold text-gray-900 mb-1">수업 시작</div>
              <div className="text-sm text-gray-600">첫 수업까지 평균 소요 시간</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-orange-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              지금 바로 매칭을 시작해보세요!
            </h3>
            <p className="text-lg mb-6 opacity-90">
              간편한 6단계로 아이에게 최적의 치료사를 만날 수 있습니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pricing"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                이용권 구매하기
              </a>
              <a
                href="/request"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                요청글 작성하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
