import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero 섹션 */}
      <section className="bg-blue-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">환불규정</h1>
            <p className="text-xl text-blue-100">
              더모든 키즈의 환불 정책과 절차를 안내해드립니다
            </p>
          </div>
        </div>
      </section>

      {/* 환불규정 내용 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            
            {/* 기본 원칙 */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">환불 기본 원칙</h2>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  더모든 키즈는 고객님의 권익 보호를 위해 공정하고 투명한 환불 정책을 운영하고 있습니다. 
                  모든 환불은 전자상거래 등에서의 소비자보호에 관한 법률에 따라 처리됩니다.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    💡 환불 신청은 고객센터(1588-0000) 또는 온라인 문의를 통해 가능합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 이용권별 환불 정책 */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">이용권별 환불 정책</h2>
              
              <div className="space-y-6">
                {/* 미사용 이용권 */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                    미사용 이용권
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p>• <strong>서비스 이용 전:</strong> 100% 전액 환불</p>
                    <p>• <strong>첫 수업 예약 후 24시간 이내:</strong> 100% 전액 환불</p>
                    <p>• <strong>환불 처리 기간:</strong> 신청일로부터 영업일 기준 3-5일</p>
                  </div>
                </div>

                {/* 부분 사용 이용권 */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                    부분 사용 이용권
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p>• <strong>이용한 수업료:</strong> 정가 기준으로 차감</p>
                    <p>• <strong>남은 금액:</strong> 100% 환불</p>
                    <p>• <strong>예시:</strong> 20만원 이용권 중 5만원 상당 수업 이용 시 → 15만원 환불</p>
                  </div>
                </div>

                {/* 특별 할인 이용권 */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                    특별 할인 이용권
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p>• <strong>미사용 시:</strong> 결제 금액 100% 환불</p>
                    <p>• <strong>부분 사용 시:</strong> 이용한 수업료를 정가로 차감 후 환불</p>
                    <p>• <strong>주의사항:</strong> 할인 혜택이 적용된 이용권의 경우 정가 기준으로 계산됩니다</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 환불 불가 사유 */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">환불 불가 사유</h2>
              <div className="bg-red-50 p-6 rounded-lg">
                <div className="space-y-3 text-red-700">
                  <p>• 이용권 유효기간이 만료된 경우</p>
                  <p>• 고객의 귀책사유로 수업이 취소된 경우 (연속 3회 이상 무단 취소)</p>
                  <p>• 치료사에게 부적절한 행동이나 발언을 한 경우</p>
                  <p>• 서비스 약관을 위반한 경우</p>
                  <p>• 허위 정보로 가입하여 서비스를 이용한 경우</p>
                </div>
              </div>
            </div>

            {/* 환불 절차 */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">환불 신청 절차</h2>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                  <h3 className="font-semibold text-gray-900 mb-2">신청</h3>
                  <p className="text-sm text-gray-600">고객센터 또는 온라인으로 환불 신청</p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                  <h3 className="font-semibold text-gray-900 mb-2">검토</h3>
                  <p className="text-sm text-gray-600">이용 내역 확인 및 환불 금액 산정</p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                  <h3 className="font-semibold text-gray-900 mb-2">승인</h3>
                  <p className="text-sm text-gray-600">환불 승인 후 고객님께 안내</p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
                  <h3 className="font-semibold text-gray-900 mb-2">완료</h3>
                  <p className="text-sm text-gray-600">환불 금액 지급 완료</p>
                </div>
              </div>
            </div>

            {/* 환불 방법 및 수수료 */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">환불 방법 및 수수료</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">결제 방법</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">환불 방법</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">수수료</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">처리 기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">신용카드</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">카드 취소</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">무료</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">영업일 3-5일</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">계좌이체</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">계좌 입금</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">무료</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">영업일 1-3일</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">무통장입금</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">계좌 입금</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">무료</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">영업일 1-3일</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 주의사항 */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">주의사항</h2>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 font-bold">⚠️</span>
                  <p>환불 신청 시 정확한 계좌 정보를 제공해주세요. 잘못된 정보로 인한 환불 지연은 고객님의 책임입니다.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 font-bold">⚠️</span>
                  <p>이용권 구매 시 제공된 쿠폰이나 적립금은 환불되지 않습니다.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 font-bold">⚠️</span>
                  <p>환불 처리 중에는 해당 이용권으로 새로운 수업 예약이 불가능합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 문의 섹션 */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            환불 관련 문의가 있으시나요?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            고객센터로 연락주시면 빠르고 정확한 안내를 받으실 수 있습니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              환불 신청하기
            </button>
            <button className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              전화 문의: 1588-0000
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

