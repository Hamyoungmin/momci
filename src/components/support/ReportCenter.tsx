'use client';

import { useState } from 'react';

export default function ReportCenter() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher || !reportContent || !agreedToTerms) {
      alert('모든 필수 항목을 입력하고 동의해주세요.');
      return;
    }
    alert('신고가 접수되었습니다. 검토 후 결과를 안내드리겠습니다.');
    setShowReportForm(false);
    setSelectedTeacher('');
    setReportContent('');
    setAgreedToTerms(false);
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showReportForm ? (
          <>
            {/* 메인 박스 */}
            <div className="bg-white border-4 border-blue-700 rounded-lg p-8">
              {/* 제목 */}
              <div className="text-center mb-20 mt-20">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">클린 캠페인: 직거래 신고 안내</h2>
                <p className="text-gray-600 text-center leading-relaxed text-lg">
                  <span className="text-blue-700 font-semibold">더모든 키즈는</span> 선생님과 학부모님 모두가 신뢰할 수 있는 투명한 거래 환경을 위해 노력합니다.
                </p>
              </div>

              {/* 경고 박스 */}
              <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-32">
                <h3 className="font-bold text-red-700 mb-3">
                  엄격히 금지됩니다!
                </h3>
                <p className="text-red-700 leading-relaxed">
                  플랫폼의 안전결제 시스템을 통하지 않은 외부 거래(현금, 계좌이체 등)는 
                  수업료 사기, 분쟁 등 다양한 위험에 노출될 수 있어 엄격히 금지됩니다.
                </p>
              </div>

              {/* 신고 안내 */}
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-black mb-6">
                  학부모님, 이런 경우 꼭 신고해 주세요!
                </h3>
                
                {/* 구분선 */}
                <div className="border-t border-gray-300 mb-6"></div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  만약 일부 치료사가 수수료 회피를 목적으로 직거래를 유도한다면, 
                  즉시 고객센터를 통해 신고해 주세요.
                </p>
              </div>

              {/* 혜택 박스 */}
              <div className="bg-green-100 p-6 rounded-xl mb-6">
                <div className="text-center">
                  <p className="text-green-800 text-sm font-bold mb-2">신고 내용이 사실로 확인될 경우,</p>
                  <p className="text-green-700 text-sm mb-3">제보해 주신 학부모님께 감사의 의미로</p>
                  <p className="text-xl leading-relaxed font-bold">
                    <span className="text-green-500">더모든 키즈 이용권 1개월권</span><span className="text-green-800">(무료 인터뷰 2회 포함)을 포상으로 지급해 드립니다.</span>
                  </p>
                </div>
              </div>

              {/* 하단 텍스트 */}
              <div className="text-center mb-24">
                <p className="text-gray-500">
                  여러분의 소중한 제보가 더 안전하고 신뢰도 높은 더모든 키즈를 만듭니다.
                </p>
              </div>

              {/* 버튼 */}
              <div className="text-center">
                <button
                  onClick={() => setShowReportForm(true)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  🔔 직거래 신고하러 가기
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 신고 폼 */}
            <div className="bg-white border-4 border-blue-700 rounded-lg p-8">
              <div className="text-center mb-20 mt-20">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">
                  직거래 신고센터
                </h2>
                <p className="text-gray-600">
                  클린 캠페인에 동참해 주셔서 감사합니다.
                </p>
                <p className="text-gray-600">
                  모든 내용은 안전하게 처리되며, 사실 확인 시 포상이 지급됩니다.
                </p>
              </div>

              {/* 신고자 정보 */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">👤 신고자 이름</h3>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="font-medium">로그인된 사용자</p>
                  <p className="text-sm text-gray-600 mt-1">귀하의 정보는 안전하게 보호됩니다.</p>
                </div>
              </div>

              {/* 신고 폼 */}
              <form onSubmit={handleSubmitReport} className="space-y-6">
                {/* 신고 대상 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    신고 대상 선택 *
                  </label>
                  <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">선생님을 선택해주세요</option>
                    <option value="direct_input">직접 입력하기</option>
                  </select>
                  
                  {selectedTeacher === 'direct_input' && (
                    <input
                      type="text"
                      placeholder="신고 대상 치료사의 이름을 입력해주세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-2"
                      required
                    />
                  )}
                  
                  <p className="text-sm text-gray-500 mt-1">
                    ※ 최근에 1:1 채팅을 신청한 선생님 목록이 자동으로 표시됩니다.
                  </p>
                </div>

                {/* 신고 내용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    신고 내용 *
                  </label>
                  <textarea
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="직거래를 유도한 상황을 구체적으로 작성해주세요. ( 예: 언제, 어떤 방식으로 제안했는지 등 )"
                    required
                  />
                </div>

                {/* 증빙 자료 첨부 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📎 증빙 자료 첨부 (선택)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500 mb-2">관련 대화 내용 스크린샷 등 증빙 자료들을 첨부해주세요.</p>
                    <p className="text-sm text-gray-400">파일을 여기에 드래그하거나 클릭하여 업로드</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    ※ 카카오톡 대화, 문자 메세지 등을 캡처하여 첨부하시면 더 빠른 처리가 가능합니다.
                  </p>
                </div>

                {/* 허위신고 경고 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>⚠️ 주의:</strong> 허위 신고로 밝혀질 경우, 포상 지급이 취소될 뿐만 아니라 플랫폼 이용이 영구적으로 제한될 수 있습니다.
                  </p>
                </div>

                {/* 동의 체크박스 */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1"
                    required
                  />
                  <label htmlFor="agree" className="text-base font-bold text-gray-900">
                    위 내용을 모두 확인했으며, 사실에 근거하여 신고합니다. *
                  </label>
                </div>

                {/* 버튼 */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    신고 제출하기
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
