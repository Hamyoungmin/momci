export default function Programs() {
  const programCategories = [
    {
      title: "소통과 표현",
      programs: [
        {
          icon: "🗨️",
          name: "언어치료",
          description: "말이 늦거나 발음이 부정확하고, 표현에 어려움을 겪는 아이",
          effect: "자신의 의사를 정확하게 표현하고 의사소통 능력 향상"
        },
        {
          icon: "👶",
          name: "놀이치료",
          description: "정서적 문제나 인지 소통에 어려움, 사회 적응 등 포괄적 상담",
          effect: "정서적 안정, 자신감 및 사회성 향상"
        }
      ]
    },
    {
      title: "신체와 감각",
      programs: [
        {
          icon: "🧠",
          name: "감각통합치료",
          description: "특정 감각에 예민 반응이 있거나, 수업 집중 어려움을 보이는 아이",
          effect: "주의 집중력 향상 및 사회성 활동 개선"
        },
        {
          icon: "👍",
          name: "작업치료",
          description: "연령 단계 및 수준 높은 활동으로 스스로 할 수 있고, 사회 참여에 어려움이 있는 아이",
          effect: "스스로 할 수 있는 능력, 일상생활 기능 향상 및 의사소통"
        },
        {
          icon: "🏃",
          name: "물리(운동)치료",
          description: "뇌성마비 등 운동 기능의 제약이 있거나, 앉기, 걷기, 활동 등 기본 활동 증진",
          effect: "전체 기능 및 다양한 활동 지원을 통한 자세 개선"
        }
      ]
    },
    {
      title: "학습과 행동",
      programs: [
        {
          icon: "🧐",
          name: "인지학습치료",
          description: "인지, 언어, 사고 신체 등 기초 성취가 부족하고, 학습 특별한 어려움을 보이는 아이",
          effect: "자기주도적 학습 능력, 체계적 사고, 기억력 및 집중력 증진"
        },
        {
          icon: "🎯",
          name: "ABA 치료",
          description: "자폐 스펙트럼 장애 문제 해결을 중점하거나 특정 행동 수정이 필요한 아이",
          effect: "문제 행동 감소, 소통능력 향상, 적절한 사회적 순응"
        }
      ]
    },
    {
      title: "예술과 사회성",
      programs: [
        {
          icon: "🎨",
          name: "미술치료",
          description: "창의 표현이 서투르거나 활동량이 높아 언어 소통이 어려운 아이",
          effect: "심리적 안정 및 스트레스 해소, 자기표현 및 창의력 증진"
        },
        {
          icon: "🎵",
          name: "음악치료",
          description: "감정 표현이나 그룹 활동이 어렵고, 관계형성에 도움이 필요한 아이",
          effect: "감정 조절 및 사회적 참여, 집중력 및 학습능력 증진"
        },
        {
          icon: "👑",
          name: "독서치료",
          description: "언어 발달이나 어휘력 향상, 그룹 활동이 어렵고, 관계형성이 필요한 아이",
          effect: "언어 능력 및 사회적 참여, 집중력 및 학습능력 증진"
        }
      ]
    },
    {
      title: "진단과 계획",
      programs: [
        {
          icon: "👩‍🏫",
          name: "특수교사",
          description: "교육적 환경에서의 전문적 지도가 필요한 아이",
          effect: "개별화된 교육 프로그램을 통한 학습 능력 향상"
        },
        {
          icon: "🧠",
          name: "임상심리",
          description: "심리적 평가와 상담이 필요한 아이",
          effect: "정확한 진단을 통한 맞춤형 치료 계획 수립"
        },
        {
          icon: "📊",
          name: "모니터링",
          description: "정기적 평가를 통한 객관적인 발달 상황 체크",
          effect: "지속적인 발달 모니터링을 통한 치료 효과 극대화"
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            더모든 키즈 프로그램 안내
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
            더모든 키즈에서 매칭하는 다양한 전문 프로그램들과 함께<br />
            아이에게 꼭 필요한 가장 효과적인 도움을 제공합니다.
          </p>
          <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
            <span className="mr-2">💡</span>
            모든 과정을 함께 지원합니다
          </div>
        </div>

        {/* 프로그램 카테고리들 */}
        <div className="space-y-12">
          {programCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl shadow-lg p-8">
              {/* 카테고리 제목 */}
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8 pb-4 border-b border-gray-200">
                {category.title}
              </h3>
              
              {/* 프로그램들 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.programs.map((program, programIndex) => (
                  <div key={programIndex} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                    {/* 프로그램 헤더 */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-3xl">{program.icon}</div>
                      <h4 className="text-xl font-bold text-gray-900">{program.name}</h4>
                    </div>
                    
                    {/* 대상 아동 */}
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-orange-600 mb-2">이런 아이에게</h5>
                      <p className="text-gray-700 text-sm leading-relaxed">{program.description}</p>
                    </div>
                    
                    {/* 기대 효과 */}
                    <div>
                      <h5 className="text-sm font-semibold text-blue-600 mb-2">기대 효과</h5>
                      <p className="text-gray-700 text-sm leading-relaxed">{program.effect}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-orange-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              아이에게 맞는 프로그램을 찾고 계신가요?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              전문 치료사들이 아이의 상태에 맞는 최적의 치료 프로그램을 제안해드려요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/request"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                선생님께 요청하기
              </a>
              <a
                href="/browse"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                전문가 둘러보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
