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
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showReportForm ? (
          <>
            {/* 클린 캠페인 안내 */}
            <div className="bg-white border-2 border-blue-500 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">
                  🔵 직거래 신고
                </h2>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  클린 캠페인: 직거래 신고 안내
                </h3>
                <p className="text-gray-600">
                  더모든 키즈는 선생님과 학부모님 모두가 신뢰할 수 있는 투명한 거래 환경을 위해 노력합니다.
                </p>
              </div>

              {/* 경고 메시지 */}
              <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-6 mb-8">
                <h4 className="font-bold text-pink-800 mb-3 text-lg">
                  ⚠️ 직거래는 금지됩니다!
                </h4>
                <p className="text-pink-700 leading-relaxed">
                  플랫폼의 안전거래 시스템을 통하지 않은 일체 거래(연락처 교환, 계좌이체 등)는 
                  수업료 사기, 분쟁 등 다양한 위험에 노출될 수 있어 엄격히 금지됩니다.
                </p>
              </div>

              {/* 신고 안내 */}
              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-4 text-lg">
                  📞 학부모님, 이런 경우 꼭 신고해 주세요!
                </h4>
                <p className="text-gray-700 mb-6">
                  안전한 거래를 위해 치료사가 수수료 회피를 목적으로 직거래를 유도한다면, 
                  즉시 고객센터를 통해 신고해 주세요.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-bold text-gray-900 mb-2">신고 대상 행위</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 개인 연락처 요구</li>
                      <li>• 계좌번호 직접 전달</li>
                      <li>• 플랫폼 우회 제안</li>
                      <li>• 수수료 회피 유도</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-bold text-gray-900 mb-2">제출 자료</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 채팅 스크린샷</li>
                      <li>• 음성 메시지</li>
                      <li>• 기타 증빙 자료</li>
                      <li>• 상황 설명서</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 혜택 안내 */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
                <h4 className="font-bold text-green-800 mb-3 text-lg">
                  💚 신고 포상 혜택
                </h4>
                <p className="text-green-700 mb-4">
                  신고 내용이 사실로 확인될 경우, 신고해주신 학부모님께 감사의 마음으로
                </p>
                <div className="text-center">
                  <div className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg inline-block">
                    더모든 키즈 이용권 1개월권 (무료 채팅 2회 포함) 무료 지급
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <p className="text-gray-600 mb-6">
                  여러분의 소중한 제보가 더 건전하고 신뢰할 수 있는 더모든 키즈를 만듭니다.
                </p>
                
                <button
                  onClick={() => setShowReportForm(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
                >
                  🔔 직거래 신고하러 가기
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 신고 폼 */}
            <div className="bg-white border-2 border-blue-500 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  📋 직거래 신고센터
                </h2>
                <p className="text-gray-600 mb-2">
                  불법한 플랫폼 외 거래를 신고해 주세요.
                </p>
                <p className="text-sm text-gray-500">
                  모든 내용은 안전하게 처리되며, 사실 확인 시 포상이 지급됩니다.
                </p>
              </div>

              {/* 신고자 정보 */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">👤 신고자 정보</h3>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="font-medium">김○○ 학부모님</p>
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
                    <option value="teacher1">김○○ 언어치료사 (7년차)</option>
                    <option value="teacher2">박○○ 놀이치료사 (5년차)</option>
                    <option value="teacher3">이○○ 작업치료사 (3년차)</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    신고 대상 선생님을 선택해 주세요. 치료사명을 확인하세요.
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
                    placeholder="직거래의 구체적 상황을 구체적으로 작성해주세요. (ex. 언제, 어떤 방식으로 접근, 계좌번호 전달 등)"
                    required
                  />
                </div>

                {/* 증빙 자료 첨부 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📎 증빙 자료 첨부 (선택)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500 mb-2">파일을 드래그하거나 클릭하여 업로드</p>
                    <p className="text-sm text-gray-400">관련 대화 내용 스크린샷 및 음성 파일을 업로드해 주세요.</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    허위 신고를 방지하고자 증빙자료가 있다면 함께 제출해주시면 감사합니다.
                  </p>
                </div>

                {/* 허위신고 경고 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>⚠️ 주의:</strong> 허위 신고는 허위신고죄에 따른 처벌 대상이 될 수 있으며, 
                    허위신고로 인해 발생하는 모든 책임에 대한 법적 책임을 져야 함을 알려드립니다.
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
                  <label htmlFor="agree" className="text-sm text-gray-700">
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
