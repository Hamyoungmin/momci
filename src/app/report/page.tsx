import React from 'react';

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero 섹션 */}
      <section className="bg-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">직거래 신고</h1>
            <p className="text-xl text-red-100">
              안전한 서비스 이용을 위해 부적절한 직거래를 신고해주세요
            </p>
          </div>
        </div>
      </section>

      {/* 경고 안내 */}
      <section className="py-8 bg-red-50 border-b border-red-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L2.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800 mb-2">직거래 금지 안내</h3>
                <div className="text-red-700 text-sm space-y-2">
                  <p>• 더모든 키즈를 통하지 않은 직거래는 <strong>서비스 약관 위반</strong>입니다</p>
                  <p>• 직거래 시 발생하는 모든 문제에 대해 <strong>책임지지 않습니다</strong></p>
                  <p>• 직거래 적발 시 <strong>서비스 이용이 영구 정지</strong>될 수 있습니다</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 신고 사유 안내 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">이런 경우 신고해주세요</h2>
            <p className="text-lg text-gray-600">아래와 같은 상황을 목격하시면 즉시 신고해주세요</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
              <div className="flex items-start">
                <div className="text-red-500 text-2xl mr-4">🚫</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">치료사의 직거래 제안</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• "더모든 키즈 없이 직접 거래하자"는 제안</li>
                    <li>• 개인 계좌나 현금으로 결제 요구</li>
                    <li>• 플랫폼 수수료를 아끼자는 제안</li>
                    <li>• 비공식 채널로 연락 시도</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
              <div className="flex items-start">
                <div className="text-orange-500 text-2xl mr-4">⚠️</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">부적절한 행동</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• 개인 정보를 과도하게 요구</li>
                    <li>• 부적절한 신체 접촉이나 발언</li>
                    <li>• 아이에게 해로운 내용 교육</li>
                    <li>• 약속된 서비스와 다른 행동</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
              <div className="flex items-start">
                <div className="text-purple-500 text-2xl mr-4">💰</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">금전 관련 문제</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• 추가 비용을 별도로 요구</li>
                    <li>• 현금 봉투나 선물 요구</li>
                    <li>• 이용권 외 별도 결제 요구</li>
                    <li>• 금전적 이익을 위한 거짓말</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
              <div className="flex items-start">
                <div className="text-blue-500 text-2xl mr-4">📱</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">연락 방식 위반</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• 플랫폼 외부 연락처 교환 시도</li>
                    <li>• 개인 SNS나 메신저로 연락</li>
                    <li>• 다른 플랫폼으로 유도</li>
                    <li>• 개인적인 만남 제안</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 신고 폼 */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">신고하기</h2>
              <p className="text-lg text-gray-600">신고해주신 내용은 철저히 검토하여 조치하겠습니다</p>
            </div>

            <form className="space-y-6">
              {/* 신고자 정보 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">신고자 이름</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="실명을 입력해주세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              {/* 신고 대상 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">신고 대상 치료사 이름</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="신고하려는 치료사의 이름을 입력해주세요"
                />
              </div>

              {/* 신고 유형 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">신고 유형</label>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="report_type" className="text-red-500 focus:ring-red-500" />
                    <span className="ml-2 text-sm text-gray-700">직거래 제안</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="report_type" className="text-red-500 focus:ring-red-500" />
                    <span className="ml-2 text-sm text-gray-700">부적절한 행동</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="report_type" className="text-red-500 focus:ring-red-500" />
                    <span className="ml-2 text-sm text-gray-700">금전 요구</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="report_type" className="text-red-500 focus:ring-red-500" />
                    <span className="ml-2 text-sm text-gray-700">개인 정보 남용</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="report_type" className="text-red-500 focus:ring-red-500" />
                    <span className="ml-2 text-sm text-gray-700">서비스 약관 위반</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="report_type" className="text-red-500 focus:ring-red-500" />
                    <span className="ml-2 text-sm text-gray-700">기타</span>
                  </label>
                </div>
              </div>

              {/* 발생 일시 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">발생 날짜</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">발생 시간 (대략)</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 상세 내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상세 내용</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={6}
                  placeholder="신고하려는 내용을 구체적으로 작성해주세요. 대화 내용, 상황, 증거 등을 상세히 기록해주시면 조치에 도움이 됩니다."
                ></textarea>
              </div>

              {/* 증거 자료 첨부 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">증거 자료 첨부</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="text-gray-500 mb-2">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">스크린샷, 녹음 파일, 메시지 캡처 등 증거 자료가 있다면 첨부해주세요</p>
                  <button type="button" className="text-red-500 hover:text-red-600 font-medium">
                    파일 선택
                  </button>
                </div>
              </div>

              {/* 개인정보 동의 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">개인정보 수집 및 이용 동의</h3>
                <div className="text-sm text-gray-600 space-y-2 mb-4">
                  <p>• 수집항목: 이름, 연락처, 신고 내용</p>
                  <p>• 이용목적: 신고 사항 조사 및 조치, 결과 안내</p>
                  <p>• 보유기간: 조사 완료 후 6개월</p>
                </div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-red-500 focus:ring-red-500" />
                  <span className="ml-2 text-sm text-gray-700">개인정보 수집 및 이용에 동의합니다 (필수)</span>
                </label>
              </div>

              {/* 제출 버튼 */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                  신고 접수
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 신고 후 처리 과정 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">신고 후 처리 과정</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-red-100 text-red-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">신고 접수</h3>
              <p className="text-sm text-gray-600">신고가 접수되면 즉시 확인 후 조사를 시작합니다</p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 text-red-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">조사 진행</h3>
              <p className="text-sm text-gray-600">관련 당사자들의 진술과 증거를 수집하여 조사합니다</p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 text-red-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">조치 결정</h3>
              <p className="text-sm text-gray-600">조사 결과에 따라 적절한 조치를 결정합니다</p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 text-red-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-semibold text-gray-900 mb-2">결과 안내</h3>
              <p className="text-sm text-gray-600">신고자에게 조사 결과와 조치 사항을 안내합니다</p>
            </div>
          </div>
        </div>
      </section>

      {/* 긴급 연락처 */}
      <section className="py-16 bg-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">긴급한 상황인가요?</h2>
          <p className="text-xl text-red-100 mb-8">
            아이의 안전이 위험하거나 긴급한 상황이라면 즉시 연락해주세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              긴급 신고: 1588-0000
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-500 transition-colors">
              일반 문의하기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

