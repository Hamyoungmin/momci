export default function ComparisonTable() {
  const comparisonData = [
    {
      category: "기본 정보",
      items: [
        {
          feature: "수수료율",
          existing: "15-25%",
          momci: "9%",
          highlight: true,
          description: "매칭 성사 시 수수료"
        },
        {
          feature: "월 이용료",
          existing: "무료",
          momci: "9,900원 (학부모) / 19,900원 (치료사)",
          highlight: false,
          description: "플랫폼 이용을 위한 월 정액 요금"
        },
        {
          feature: "초기 상담",
          existing: "유료 (회당 5,000-10,000원)",
          momci: "2회 무료",
          highlight: true,
          description: "치료사와의 초기 상담 비용"
        }
      ]
    },
    {
      category: "안전성",
      items: [
        {
          feature: "안전결제",
          existing: "미제공 (직접 거래)",
          momci: "100% 안전결제",
          highlight: true,
          description: "플랫폼을 통한 안전한 결제 시스템"
        },
        {
          feature: "치료사 검증",
          existing: "부분적 검증",
          momci: "100% 서류 검증",
          highlight: true,
          description: "자격증, 경력, 학력 등 철저한 검증"
        },
        {
          feature: "분쟁 해결",
          existing: "개인 해결",
          momci: "전문팀 중재",
          highlight: true,
          description: "문제 발생 시 해결 방법"
        },
        {
          feature: "개인정보 보호",
          existing: "부분적",
          momci: "완전 보호",
          highlight: false,
          description: "매칭 전까지 개인정보 비공개"
        }
      ]
    },
    {
      category: "서비스 품질",
      items: [
        {
          feature: "후기 신뢰도",
          existing: "허위 후기 가능",
          momci: "검증된 후기만",
          highlight: true,
          description: "실제 이용자만 후기 작성 가능"
        },
        {
          feature: "고객지원",
          existing: "평일 근무시간",
          momci: "24시간 지원",
          highlight: false,
          description: "고객센터 운영 시간"
        },
        {
          feature: "매칭 속도",
          existing: "평균 1-2주",
          momci: "평균 3-5일",
          highlight: true,
          description: "치료사 매칭까지 소요 시간"
        },
        {
          feature: "프로필 품질",
          existing: "기본 정보만",
          momci: "상세 정보 + 검증",
          highlight: false,
          description: "치료사 프로필 정보의 질"
        }
      ]
    },
    {
      category: "편의성",
      items: [
        {
          feature: "모바일 최적화",
          existing: "부분적",
          momci: "완전 최적화",
          highlight: false,
          description: "모바일 환경에서의 사용 편의성"
        },
        {
          feature: "실시간 채팅",
          existing: "전화/문자만",
          momci: "플랫폼 내 채팅",
          highlight: true,
          description: "치료사와의 소통 방법"
        },
        {
          feature: "일정 관리",
          existing: "개별 관리",
          momci: "통합 관리",
          highlight: false,
          description: "수업 일정 관리 기능"
        },
        {
          feature: "결제 관리",
          existing: "개별 관리",
          momci: "통합 관리",
          highlight: false,
          description: "수업료 결제 및 관리"
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            기존 업체와 비교
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            더모든 키즈가 기존 홈티칭 업체들과 어떻게 다른지 확인해보세요
          </p>
        </div>

        {/* 비교 테이블 */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* 테이블 헤더 */}
          <div className="bg-gradient-to-r from-blue-600 to-orange-600 text-white p-6">
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="text-lg font-bold">비교 항목</div>
              <div className="text-lg font-bold text-center">기존 업체</div>
              <div className="text-lg font-bold text-center">더모든 키즈</div>
              <div className="text-lg font-bold text-center">설명</div>
            </div>
          </div>

          {/* 테이블 내용 */}
          <div className="divide-y divide-gray-200">
            {comparisonData.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                {/* 카테고리 헤더 */}
                <div className="bg-gray-50 p-4">
                  <h3 className="text-lg font-bold text-gray-900">{category.category}</h3>
                </div>
                
                {/* 카테고리 항목들 */}
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className={`p-4 ${item.highlight ? 'bg-blue-50' : ''}`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      {/* 기능명 */}
                      <div className="font-semibold text-gray-900">
                        {item.feature}
                        {item.highlight && (
                          <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                            핵심
                          </span>
                        )}
                      </div>
                      
                      {/* 기존 업체 */}
                      <div className="text-center">
                        <div className={`p-3 rounded-lg ${
                          item.highlight ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.existing}
                        </div>
                      </div>
                      
                      {/* 더모든 키즈 */}
                      <div className="text-center">
                        <div className={`p-3 rounded-lg ${
                          item.highlight ? 'bg-green-100 text-green-800 font-semibold' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.momci}
                        </div>
                      </div>
                      
                      {/* 설명 */}
                      <div className="text-sm text-gray-600">
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 요약 통계 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-3xl text-green-600 font-bold mb-2">11%</div>
            <div className="text-lg font-semibold text-green-800 mb-1">수수료 절약</div>
            <div className="text-sm text-green-700">기존 대비 평균 11% 절약</div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <div className="text-3xl text-blue-600 font-bold mb-2">100%</div>
            <div className="text-lg font-semibold text-blue-800 mb-1">안전 보장</div>
            <div className="text-sm text-blue-700">안전결제 + 전문가 검증</div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
            <div className="text-3xl text-orange-600 font-bold mb-2">3배</div>
            <div className="text-lg font-semibold text-orange-800 mb-1">빠른 매칭</div>
            <div className="text-sm text-orange-700">기존 대비 3배 빠른 매칭</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-orange-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              차이를 직접 경험해보세요!
            </h3>
            <p className="text-lg mb-6 opacity-90">
              더모든 키즈만의 차별화된 서비스를 7일 무료로 체험해보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#pricing-plans"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                7일 무료 체험 시작
              </a>
              <a
                href="/guide"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                서비스 자세히 보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
