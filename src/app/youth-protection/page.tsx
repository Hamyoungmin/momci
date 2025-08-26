import React from 'react';

export default function YouthProtectionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero 섹션 */}
      <section className="bg-blue-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">청소년 보호정책</h1>
            <p className="text-xl text-blue-100">
              더모든 키즈는 청소년을 유해한 환경으로부터 보호하기 위해 최선을 다합니다
            </p>
          </div>
        </div>
      </section>

      {/* 정책 내용 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            
            {/* 정책 목적 */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">청소년 보호정책의 목적</h2>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  더모든 키즈는 「청소년 보호법」 및 관련 법령에 따라 청소년이 안전하고 건전한 환경에서 
                  학습할 수 있도록 보호하기 위한 정책을 운영하고 있습니다.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">
                    <strong>💡 더모든 키즈는 만 19세 미만의 청소년을 대상으로 하는 교육 서비스를 제공합니다.</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* 청소년 보호 원칙 */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">청소년 보호 원칙</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                    안전한 학습 환경 제공
                  </h3>
                  <ul className="space-y-2 text-gray-600 ml-11">
                    <li>• 검증된 전문 치료사만 매칭 서비스 제공</li>
                    <li>• 모든 치료사는 범죄경력조회 및 아동학대 경력 조회 완료</li>
                    <li>• 정기적인 교육과 평가를 통한 서비스 품질 관리</li>
                    <li>• 24시간 모니터링 시스템 운영</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                    유해 콘텐츠 차단
                  </h3>
                  <ul className="space-y-2 text-gray-600 ml-11">
                    <li>• 교육 목적에 부합하지 않는 콘텐츠 제한</li>
                    <li>• 폭력적, 선정적 내용 엄격 금지</li>
                    <li>• 사용자 신고 시스템을 통한 실시간 모니터링</li>
                    <li>• AI 기반 유해 콘텐츠 자동 필터링</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                    개인정보 보호 강화
                  </h3>
                  <ul className="space-y-2 text-gray-600 ml-11">
                    <li>• 만 14세 미만 아동의 개인정보 수집 시 법정대리인 동의 필수</li>
                    <li>• 최소한의 개인정보만 수집 및 이용</li>
                    <li>• 암호화된 보안 시스템으로 개인정보 보호</li>
                    <li>• 개인정보 제3자 제공 금지</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 치료사 선발 기준 */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">치료사 선발 및 관리 기준</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">필수 요건</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ 관련 학과 졸업 또는 자격증 보유</li>
                    <li>✓ 아동 관련 경력 1년 이상</li>
                    <li>✓ 범죄경력조회서 제출</li>
                    <li>✓ 아동학대 관련 경력 조회</li>
                    <li>✓ 건강진단서 제출</li>
                    <li>✓ 추천서 2부 이상</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">정기 관리</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ 월 1회 정기 교육 참여</li>
                    <li>✓ 분기별 서비스 평가</li>
                    <li>✓ 학부모 만족도 조사</li>
                    <li>✓ 청소년 보호 교육 이수</li>
                    <li>✓ 응급처치 교육 이수</li>
                    <li>✓ 연 1회 재심사</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 신고 및 대응 */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">신고 및 대응 체계</h2>
              
              <div className="space-y-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">긴급 신고 대상</h3>
                  <ul className="space-y-2 text-red-700 text-sm">
                    <li>• 아동에 대한 신체적, 정서적 학대</li>
                    <li>• 부적절한 신체 접촉이나 성희롱</li>
                    <li>• 교육 목적과 관련 없는 개인적 요구</li>
                    <li>• 유해한 내용의 교육이나 발언</li>
                    <li>• 개인정보 유출이나 사생활 침해</li>
                  </ul>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-red-100 text-red-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                    <h3 className="font-semibold text-gray-900 mb-2">즉시 신고</h3>
                    <p className="text-sm text-gray-600">24시간 신고 접수<br/>전화: 1588-0000</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-red-100 text-red-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                    <h3 className="font-semibold text-gray-900 mb-2">긴급 조치</h3>
                    <p className="text-sm text-gray-600">해당 치료사 즉시 활동 정지<br/>피해 아동 보호 조치</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-red-100 text-red-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                    <h3 className="font-semibold text-gray-900 mb-2">후속 조치</h3>
                    <p className="text-sm text-gray-600">관련 기관 신고<br/>법적 대응 지원</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 부모님을 위한 안내 */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">부모님을 위한 안전 수칙</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 사전 점검사항</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• 치료사의 자격증과 경력 확인</li>
                    <li>• 첫 수업 시 부모님 참관 권장</li>
                    <li>• 수업 장소는 개방된 공간 선택</li>
                    <li>• 치료사와의 연락은 플랫폼 내에서만</li>
                    <li>• 수업 일지 정기적으로 확인</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 주의 관찰사항</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• 아이의 행동이나 감정 변화</li>
                    <li>• 수업에 대한 아이의 반응</li>
                    <li>• 치료사와의 상호작용 방식</li>
                    <li>• 교육 내용과 방법의 적절성</li>
                    <li>• 아이가 표현하는 불편함이나 거부감</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 연락처 및 신고 */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">청소년 보호 책임자</h2>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-3">청소년 보호 책임자</h3>
                    <div className="text-blue-800 text-sm space-y-1">
                      <p>이름: 김청소년</p>
                      <p>직책: 안전관리팀장</p>
                      <p>전화: 1588-0000 (내선 101)</p>
                      <p>이메일: youth@momci.co.kr</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-blue-900 mb-3">24시간 신고센터</h3>
                    <div className="text-blue-800 text-sm space-y-1">
                      <p>긴급신고: 1588-0000</p>
                      <p>온라인 신고: report.momci.co.kr</p>
                      <p>카카오톡: @더모든키즈</p>
                      <p>운영시간: 24시간 연중무휴</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 외부 기관 연락처 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">관련 기관 연락처</h2>
            <p className="text-gray-600">긴급한 상황에서 직접 연락할 수 있는 기관들입니다</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-blue-500 text-3xl mb-3">🚨</div>
              <h3 className="font-semibold text-gray-900 mb-2">아동학대 신고</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">112</p>
              <p className="text-sm text-gray-500">24시간 신고 가능</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-green-500 text-3xl mb-3">📞</div>
              <h3 className="font-semibold text-gray-900 mb-2">청소년 상담</h3>
              <p className="text-2xl font-bold text-green-600 mb-2">1388</p>
              <p className="text-sm text-gray-500">청소년사이버상담센터</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-purple-500 text-3xl mb-3">🏥</div>
              <h3 className="font-semibold text-gray-900 mb-2">학교폭력 신고</h3>
              <p className="text-2xl font-bold text-purple-600 mb-2">117</p>
              <p className="text-sm text-gray-500">학교폭력신고센터</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">안전한 학습 환경을 위해</h2>
          <p className="text-xl text-blue-100 mb-8">
            의심스러운 상황이나 불편한 일이 있다면 언제든지 연락해주세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              신고하기
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-500 transition-colors">
              상담 문의
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

