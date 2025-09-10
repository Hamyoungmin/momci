import React from 'react';

export default function TeacherGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 메인 가이드 섹션 */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-4 border-blue-700 rounded-lg p-6">
            <div className="text-center mb-16 mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">모든별 키즈 치료사 이용 가이드</h2>
            </div>

            {/* STEP 1 */}
            <div className="mb-16">
              <h3 className="text-xl font-bold text-black mb-4">STEP 1. 프로필 등록 및 활동 시작</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-3">
                  1. <span className="text-black font-semibold">프로필 등록 및 승인</span>: 회원가입 후, <span className="text-blue-700 font-semibold">전문성</span>이 드러나도록 프로필(학력, 경력, 자격증 등)을 작성하고 서류를 제출하면 관리자가 검토 후 승인합니다.
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">2. <span className="text-black font-semibold">이용권 구매</span>: 프로필 승인이 완료되면, 기간제 이용권을 구매하여 모든 활동을 시작할 준비를 합니다.</p>
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-300 my-12"></div>

            {/* STEP 2 */}
            <div className="mb-16">
              <h3 className="text-xl font-bold text-black mb-4">STEP 2. 매칭 시작 및 인터뷰</h3>
              
              <p className="text-sm text-gray-700 mb-4"><span className="text-black font-semibold">매칭 (2가지 방법)</span>:</p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-700 mb-4">
                <li><span className="text-black font-semibold">직접지원</span>: <span className="text-blue-700 font-semibold">[선생님 요청하기]</span>에서 학부모님의 요청글에 직접 지원합니다.</li>
                <li><span className="text-black font-semibold">제안받기</span>: <span className="text-blue-700 font-semibold">[선생님 둘러보기]</span>에 등록된 프로필을 보고 학부모님의 제안을 받습니다.</li>
              </ul>

              <p className="text-sm text-gray-700 mb-4">
                <span className="text-black font-semibold">인터뷰 진행</span>: 연결된 학부모님과 <span className="text-blue-700 font-semibold">1:1 실시간 채팅</span>으로 소통하며, 인터뷰는 비용 없이 진행됩니다.
              </p>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="text-sm text-amber-700">
                    <span className="text-amber-700 font-bold">신뢰를 위한 약속</span>: 첫 소통부터 매칭 확정까지는 반드시 플랫폼 시스템을 이용해 주세요. 이는 양측 보호와 <span className="text-blue-700 font-semibold">&apos;인증 선생님&apos;</span> 자격을 위한 필수 과정입니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-300 my-12"></div>

            {/* STEP 3 */}
            <div className="mb-16">
              <h3 className="text-xl font-bold text-black mb-4">STEP 3. 수업 확정 및 수익 창출</h3>
              
              <p className="text-sm text-gray-700 mb-4">
                <span className="text-black font-semibold">수업 확정</span>: 인터뷰 후 수업이 결정되면, 학부모님이 플랫폼을 통해 첫 수업료를 결제하고 매칭이 최종 확정 됩니다.
              </p>

              <p className="text-sm text-gray-700 mb-4">
                <span className="text-black font-semibold">연락처 공개</span>: 결제가 완료되어야 학부모님의 연락처가 안전하게 공개됩니다.
              </p>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-300 my-12"></div>

            {/* STEP 4 */}
            <div className="mb-16">
              <h3 className="text-xl font-bold text-black mb-4">STEP 4. 투명한 수수료 정책</h3>
              
              <p className="text-sm text-gray-700 mb-4">
                <span className="text-black font-semibold">첫 매칭 수수료</span>: 첫 수업 확정시, <span className="text-blue-700 font-semibold">(주당 수업 횟수 x 1회분)</span>의 수업료가 매칭 성사 수수료를 발생합니다.
              </p>
              <p className="text-xs text-gray-500">
                (예시) 주 1회 수업 → 첫 <span className="text-blue-700 font-semibold">1회분</span> / 주 2회 수업 → 첫 <span className="text-blue-700 font-semibold">2회분</span>
              </p>

              <p className="text-sm text-gray-700 mb-4">
                <span className="text-black font-semibold">이후 수익 100% 보장</span>: 첫 매칭 수수료를 제외한 모든 이후의 수업료는 <span className="text-blue-700 font-semibold">100% 선생님의 수익</span>으로, 학부모님과 직접 정산하여 받으시면 됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

