export default function RefundPolicy() {
  const refundPolicies = [
    {
      title: "📋 1. 이용권 환불",
      subtitle: "기간별 이용권",
      policies: [
        {
          type: "즉시 환불",
          condition: "이용권 구매 후 3일 이하이며 아무런 서비스를 이용하지 않은 경우",
          refundRate: "100%",
          color: "bg-green-100 text-green-800"
        },
        {
          type: "부분 환불", 
          condition: "서비스를 일부 이용했지만 1개월 이내인 경우",
          refundRate: "50%",
          color: "bg-yellow-100 text-yellow-800"
        }
      ]
    },
    {
      title: "📋 2. 첫 수업료 환불",
      subtitle: "안전결제로 진행된 첫 수업료",
      policies: [
        {
          type: "즉시 환불",
          condition: "수업 진행 전 2시간 이전에 취소 시",
          refundRate: "100%",
          color: "bg-green-100 text-green-800"
        },
        {
          type: "부분 환불",
          condition: "치료사의 귀책사유로 인한 수업 취소",
          refundRate: "100%",
          color: "bg-green-100 text-green-800"
        },
        {
          type: "환불 불가",
          condition: "수업 진행 후 또는 학부모 귀책사유로 인한 취소",
          refundRate: "0%",
          color: "bg-red-100 text-red-800"
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            더모든 키즈 환불 규정
          </h2>
          <p className="text-gray-600">
            투명하고 공정한 환불 정책을 안내드립니다
          </p>
        </div>

        <div className="bg-white border-2 border-blue-500 rounded-2xl p-8">
          <div className="space-y-12">
            {refundPolicies.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="text-2xl font-bold text-blue-600 mb-6">
                  {section.title}
                </h3>
                
                {section.subtitle && (
                  <p className="text-gray-600 mb-6">{section.subtitle}</p>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {section.policies.map((policy, policyIndex) => (
                    <div key={policyIndex} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${policy.color} mr-3`}>
                              {policy.type}
                            </span>
                            <span className="text-lg font-bold text-blue-600">
                              환불률: {policy.refundRate}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {policy.condition}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 추가 안내사항 */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-800 mb-4">📌 환불 신청 안내</h4>
            <div className="text-blue-700 space-y-2 text-sm">
              <p>• 환불 신청은 고객센터를 통해 접수하실 수 있습니다.</p>
              <p>• 환불 처리는 신청일로부터 영업일 기준 3-5일 소요됩니다.</p>
              <p>• 환불 시 결제 수수료를 제외한 금액이 환불됩니다.</p>
              <p>• 부분 환불의 경우 사용 기간에 따라 차등 적용됩니다.</p>
            </div>
          </div>

          {/* 특별 케이스 */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-bold text-yellow-800 mb-4">⚠️ 특별한 경우</h4>
            <div className="text-yellow-700 space-y-2 text-sm">
              <p>• <strong>플랫폼 오류:</strong> 시스템 오류로 인한 불편 시 100% 환불</p>
              <p>• <strong>치료사 문제:</strong> 치료사의 자격 미달이 확인된 경우 전액 환불</p>
              <p>• <strong>안전사고:</strong> 플랫폼 이용 중 안전사고 발생 시 별도 보상</p>
              <p>• <strong>직거래 피해:</strong> 직거래로 인한 피해 시 보상 지원</p>
            </div>
          </div>

          {/* 환불 신청 버튼 */}
          <div className="mt-8 text-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-colors mr-4">
              환불 신청하기
            </button>
            <button className="border border-blue-500 text-blue-500 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium transition-colors">
              환불 현황 조회
            </button>
          </div>

          {/* 하단 참고사항 */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>※ 기타 환불과 관련된 자세한 문의는 고객센터로 연락주시기 바랍니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
