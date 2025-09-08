import React from 'react';

export default function ProgramGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 메인 프로그램 안내 섹션 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-4 border-blue-700 rounded-lg p-8">
            <div className="text-center mb-20 mt-20">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">더모든 키즈 프로그램 안내</h2>
              <p className="text-gray-500 max-w-4xl mx-auto">
                더모든은 아이의 잠재력을 이끌어내는 다양한 전문 프로그램을 통해 성장의 모든 과정을 함께 합니다.<br />
                우리아이에게 지금 가장 필요한 도움은 무엇인지 확인해 보세요.
              </p>
            </div>

            {/* 소통과 표현 */}
            <div className="mb-20">
              <h3 className="text-3xl font-bold text-black mb-6">소통과 표현</h3>
              
              {/* 제목 아래 구분선 */}
              <div className="border-t border-gray-300 mb-28"></div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-blue-600 mb-2">언어치료</h4>
                    <p className="text-gray-500 mb-2">
                      아이의 생각과 마음을 자유롭게 표현하도록 돕는 소통의 첫걸음입니다.
                    </p>
                    <p className="text-gray-700 mb-2">
                      <span className="font-semibold">이런 아이에게:</span> 말이 늦거나 발음이 부정확하고,표현에 어려움을 겪는 아이
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">기대효과:</span> 자신감 있는 의사소통 능력과 또래 관계 향상
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-blue-600 mb-2">놀이치료</h4>
                    <p className="text-gray-500 mb-2">
                      가장 편안한 언어인 &apos;놀이&apos;로 마음을 표현하고 건강한 성장을 지원합니다.
                    </p>
                    <p className="text-gray-700 mb-2">
                      <span className="font-semibold">이런 아이에게:</span> 불안감이 높거나 감정 조절이 어렵고, 사회성에 도움이 필요한 아이
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">기대 효과:</span> 정서적 안정, 자신감 및 사회성 향상
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 신체와 감각 */}
            <div className="mb-20">
              <h3 className="text-3xl font-bold text-black mb-6">신체와 감각</h3>
              
              {/* 제목 아래 구분선 */}
              <div className="border-t border-gray-300 mb-28"></div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-blue-600 mb-2">감각통합치료</h4>
                    <p className="text-gray-700 mb-2">
                      <span className="font-semibold">이런 아이에게:</span> 특정 감각에 예민하거나 움직임이 서툴고, 주의 집중이 어려운 아이
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">기대효과:</span> 주의 집중력 및 신체 조절 능력 향상, 정서적 안정
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3V1m0 18v2m8-10a4 4 0 00-4-4H7m8 4v6a4 4 0 004 4h2a2 2 0 002-2v-8a2 2 0 00-2-2h-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-blue-600 mb-2">작업치료</h4>
                    <p className="text-gray-700 mb-2">
                      <span className="font-semibold">이런 아이에게:</span> 연필 잡기 등 소근육 활동이나 스스로 옷 입기, 식사하기에 어려움이 있는 아이
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">기대 효과:</span> 소근육 발달, 일상생활 자립심 및 성취감 향상
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-blue-600 mb-2">물리(운동)치료</h4>
                    <p className="text-gray-700 mb-2">
                      <span className="font-semibold">이런 아이에게:</span> 뇌성마비 등 운동 기능에 제한이 있거나, 앉기, 걷기 등 대근육 발달이 지연된 아이
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">기대 효과:</span> 운동 기능 및 신체 활동 자신감 향상, 바른 자세 형성
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 학습과 행동 */}
            <div className="mb-20">
              <h3 className="text-3xl font-bold text-black mb-6">학습과 행동</h3>
              
              {/* 제목 아래 구분선 */}
              <div className="border-t border-gray-300 mb-28"></div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-blue-600 mb-2">인지학습치료</h4>
                    <p className="text-gray-700 mb-2">
                      <span className="font-semibold">이런 아이에게:</span> 학습 속도가 느리거나 집중 시간이 짧고, 기초 학습에 어려움을 겪는 아이
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">기대 효과:</span> 자기주도적 학습 태도 형성, 기억력 및 집중력 향상
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-blue-600 mb-2">ABA 치료</h4>
                    <p className="text-gray-700 mb-2">
                      <span className="font-semibold">이런 아이에게:</span> 자폐 스펙트럼 등 발달장애로 특정 기술 습득 및 행동 중재가 필요한 아이
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">기대 효과:</span> 문제 행동 감소, 실생활 기술(의사소통, 학습, 사회성) 습득
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 예술과 사회성 */}
            <div className="mb-20">
              <h3 className="text-3xl font-bold text-black mb-6">예술과 사회성</h3>
              
              {/* 제목 아래 구분선 */}
              <div className="border-t border-gray-300 mb-28"></div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-blue-600 mb-2">미술치료 & 음악치료</h4>
                    <p className="text-gray-700 mb-2">
                      <span className="font-semibold">이런 아이에게:</span> 감정 표현이 서툴거나 불안감이 높고, 비언어적 소통 경험이 필요한 아이
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">기대효과:</span> 심리적 안정 및 스트레스 해소, 자신감 및 창의력 향상
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-blue-600 mb-2">특수체육</h4>
                    <p className="text-gray-700 mb-2">
                      <span className="font-semibold">이런 아이에게:</span> 기초 체력이 약하거나 그룹 활동이 어렵고 긍정적인 에너지 발산이 필요한 아이
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">기대 효과:</span> 기초 체력 및 사회성 향상, 성취감 및 적극적인 태도 형성
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 진단과 계획 */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-black mb-6">진단과 계획</h3>
              
              {/* 제목 아래 구분선 */}
              <div className="border-t border-gray-300 mb-28"></div>
              
              <div className="grid md:grid-cols-1 gap-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-blue-600 mb-2">특수교사 & 임상심리 & 모니터링</h4>
                    <p className="text-gray-700">
                      정확한 평가와 체계적인 계획으로 아이의 성장을 함께하는 든든한 전문가 그룹입니다. <span className="font-bold text-gray-700">**특수교사**</span>가 교육의 컨트롤 타워 역할을 하고, <span className="font-bold text-gray-700">**임상심리사**</span>가 과학적인 평가로 로드맵을 제공하며, <span className="font-bold text-gray-700">**모니터링**</span>을 통해 성장 과정을 투명하게 공유합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

