import React from 'react';

export default function TeacherApplyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero 섹션 */}
      <section className="bg-green-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">치료사 신청</h1>
            <p className="text-xl text-green-100">
              더모든 키즈와 함께 아이들의 성장을 도와주세요
            </p>
          </div>
        </div>
      </section>

      {/* 신청 폼 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">치료사 신청서</h2>
              <p className="text-lg text-gray-600">아래 정보를 입력해주시면 검토 후 연락드리겠습니다</p>
            </div>

            <form className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="실명을 입력해주세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              {/* 전문 분야 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">전문 분야</label>
                <div className="grid md:grid-cols-3 gap-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">언어치료</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">학습치료</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">행동치료</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">놀이치료</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">미술치료</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">음악치료</span>
                  </label>
                </div>
              </div>

              {/* 자격증 및 학력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">보유 자격증</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="보유하신 자격증을 입력해주세요 (예: 언어치료사 2급, 특수교사 2급 등)"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">최종 학력</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="대학교 및 학과명을 입력해주세요"
                />
              </div>

              {/* 경력 사항 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">경력 사항</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                  placeholder="관련 경력을 상세히 입력해주세요 (근무처, 기간, 담당 업무 등)"
                ></textarea>
              </div>

              {/* 활동 지역 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">활동 가능 지역</label>
                <div className="grid md:grid-cols-4 gap-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">서울</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">경기</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">인천</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">부산</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">대구</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">광주</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">대전</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">기타</span>
                  </label>
                </div>
              </div>

              {/* 자기소개 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">자기소개</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={5}
                  placeholder="치료 철학, 강점, 아이들과의 소통 방식 등을 자유롭게 작성해주세요"
                ></textarea>
              </div>

              {/* 파일 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">서류 첨부</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="text-gray-500 mb-2">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">자격증, 졸업증명서, 경력증명서 등을 첨부해주세요</p>
                  <button type="button" className="text-green-500 hover:text-green-600 font-medium">
                    파일 선택
                  </button>
                </div>
              </div>

              {/* 동의 사항 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">개인정보 수집 및 이용 동의</h3>
                <div className="text-sm text-gray-600 space-y-2 mb-4">
                  <p>• 수집항목: 이름, 연락처, 이메일, 자격증, 경력 등</p>
                  <p>• 이용목적: 치료사 심사 및 매칭 서비스 제공</p>
                  <p>• 보유기간: 서비스 탈퇴 시까지</p>
                </div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                  <span className="ml-2 text-sm text-gray-700">개인정보 수집 및 이용에 동의합니다 (필수)</span>
                </label>
              </div>

              {/* 제출 버튼 */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                  신청서 제출
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 안내 사항 */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">신청 후 진행 과정</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 text-green-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">서류 검토</h3>
              <p className="text-sm text-gray-600">제출하신 서류를 꼼꼼히 검토합니다 (2-3일 소요)</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 text-green-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">면접 진행</h3>
              <p className="text-sm text-gray-600">화상 또는 대면 면접을 진행합니다 (1주일 내)</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 text-green-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">교육 이수</h3>
              <p className="text-sm text-gray-600">더모든 키즈 교육 프로그램을 이수합니다</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 text-green-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-semibold text-gray-900 mb-2">활동 시작</h3>
              <p className="text-sm text-gray-600">심사 완료 후 치료사 활동을 시작합니다</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

