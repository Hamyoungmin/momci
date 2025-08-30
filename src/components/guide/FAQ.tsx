'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqCategories = [
    {
      title: "서비스 이용",
      faqs: [
        {
          question: "더모든 키즈는 어떤 서비스인가요?",
          answer: "더모든 키즈는 발달치료가 필요한 아이들과 전문 치료사를 안전하게 연결하는 홈티칭 매칭 플랫폼입니다. 언어치료, 놀이치료, 감각통합치료, ABA치료 등 다양한 분야의 자격증을 보유한 전문가들이 등록되어 있으며, 체계적인 검증 과정을 통해 신뢰할 수 있는 서비스를 제공합니다."
        },
        {
          question: "어떻게 치료사를 찾을 수 있나요?",
          answer: "두 가지 방법으로 치료사를 찾을 수 있습니다:\n\n1️⃣ 선생님께 요청하기: 아이의 상태, 치료 분야, 예산, 희망 일정 등을 작성하면 관심 있는 치료사들이 지원합니다.\n\n2️⃣ 선생님 둘러보기: 등록된 치료사들의 프로필을 직접 확인하고 원하는 분을 선택할 수 있습니다.\n\n각 치료사의 자격증, 경력, 전문 분야, 리뷰 등을 상세히 확인한 후 선택하시면 됩니다."
        },
        {
          question: "매칭 과정은 어떻게 진행되나요?",
          answer: "매칭은 다음 단계로 진행됩니다:\n\n1️⃣ 요청글 작성 또는 치료사 선택\n2️⃣ 관심 치료사와 1:1 채팅 상담 (최대 2명 무료)\n3️⃣ 치료사 결정 후 첫 수업료 안전결제\n4️⃣ 결제 확인 후 양측 연락처 자동 공개\n5️⃣ 직접 연락하여 수업 일정 조율\n\n평균 2-3일 내에 매칭이 완료됩니다."
        },
        {
          question: "첫 수업 전 상담은 어떻게 진행되나요?",
          answer: "매칭 후 첫 수업 전에 치료사와 충분한 상담을 진행하는 것을 권장합니다:\n\n• 아이의 현재 상태와 발달 수준 공유\n• 치료 목표와 기대사항 논의\n• 치료 방법과 계획 설명\n• 가정에서의 연계 활동 안내\n• 수업 일정과 장소 확정\n\n상담을 통해 치료사와 학부모 간 신뢰관계를 구축할 수 있습니다."
        }
      ]
    },
    {
      title: "요금 및 결제",
      faqs: [
        {
          question: "이용권 가격은 얼마인가요?",
          answer: "더모든 키즈의 이용권 가격은 다음과 같습니다:\n\n👨‍👩‍👧‍👦 학부모 이용권: 월 9,900원\n👩‍⚕️ 치료사 이용권: 월 19,900원 (VAT 포함)\n\n🎁 특별 혜택:\n• 6개월 이용권 구매 시 1개월 무료\n• 신규 가입 시 첫 달 50% 할인\n\n이용권이 있어야 요청글 작성(학부모) 및 지원(치료사)이 가능합니다."
        },
        {
          question: "수업료는 어떻게 결제하나요?",
          answer: "수업료 결제는 안전결제 시스템을 통해 진행됩니다:\n\n1️⃣ 첫 수업료만 플랫폼을 통해 안전결제\n2️⃣ 가상계좌 입금 또는 카드 결제 가능\n3️⃣ 결제 확인 후 치료사 연락처 자동 공개\n4️⃣ 이후 수업료는 치료사와 직접 정산\n\n중개 수수료는 매칭 성사 시 1회만 발생하며, 이후 수업료에는 추가 수수료가 없습니다."
        },
        {
          question: "환불 정책은 어떻게 되나요?",
          answer: "명확하고 공정한 환불 정책을 운영합니다:\n\n💰 이용권 환불:\n• 구매 후 7일 이내 사용하지 않은 경우 전액 환불\n• 부분 사용 시 잔여 기간 비례 환불\n\n💰 수업료 환불:\n• 수업 24시간 전 취소: 전액 환불\n• 수업 당일 취소: 50% 환불\n• 치료사 귀책사유 취소: 전액 환불\n\n자세한 환불 규정은 이용약관을 확인해주세요."
        },
        {
          question: "결제가 안전한가요?",
          answer: "네, 안전한 결제 시스템을 제공합니다:\n\n🔒 보안 시스템:\n• SSL 256비트 암호화 통신\n• PCI DSS 보안 인증 획득\n• 개인정보보호 관리체계(PIMS) 인증\n\n💳 지원 결제수단:\n• 신용카드 (모든 카드사)\n• 계좌이체 (실시간 계좌이체)\n• 가상계좌 (무통장 입금)\n\n모든 결제 정보는 암호화되어 안전하게 처리됩니다."
        }
      ]
    },
    {
      title: "안전 및 보안",
      faqs: [
        {
          question: "치료사들은 어떻게 검증되나요?",
          answer: "철저한 검증 시스템을 통해 안전을 보장합니다:\n\n📋 필수 검증 항목:\n• 관련 분야 자격증 원본 확인\n• 학력증명서 및 성적증명서\n• 경력증명서 및 추천서\n• 신분증 및 신원조회\n• 범죄경력조회서 (아동학대 등)\n\n✅ 검증 과정:\n1️⃣ 서류 제출 및 1차 검토\n2️⃣ 화상 면접 및 전문성 평가\n3️⃣ 레퍼런스 체크\n4️⃣ 최종 승인 (평균 3-5일)\n\n허위 정보 제공 시 즉시 계정 정지 및 법적 조치를 취합니다."
        },
        {
          question: "아이의 안전은 어떻게 보장되나요?",
          answer: "아동 안전을 최우선으로 하는 다층 보안 시스템을 운영합니다:\n\n🛡️ 사전 예방:\n• 치료사 범죄경력조회 필수\n• 아동학대 이력 확인\n• 정기적인 재검증 시스템\n\n🛡️ 진행 중 모니터링:\n• 학부모 피드백 시스템\n• 이상행동 신고 채널 운영\n• 24시간 고객지원 센터\n\n🛡️ 사후 관리:\n• 문제 발생 시 즉시 대응팀 가동\n• 필요시 수업 중단 및 환불\n• 관련 기관 신고 및 협조"
        },
        {
          question: "개인정보는 어떻게 보호되나요?",
          answer: "엄격한 개인정보 보호 정책을 시행합니다:\n\n🔐 기술적 보안:\n• SSL 256비트 암호화 통신\n• 개인정보 암호화 저장\n• 해킹 방지 보안시스템 24시간 모니터링\n\n🔐 관리적 보안:\n• 개인정보보호 관리체계(PIMS) 인증\n• 직원 보안교육 의무화\n• 접근권한 최소화 원칙\n\n🔐 서비스 보안:\n• 매칭 확정 전까지 연락처 비공개\n• 채팅 내역 보안 저장\n• 필요시에만 최소 정보 공개"
        },
        {
          question: "문제가 발생하면 어떻게 해결되나요?",
          answer: "신속하고 공정한 분쟁 해결 시스템을 운영합니다:\n\n⚖️ 분쟁 해결 절차:\n1️⃣ 고객센터 신고 접수 (24시간)\n2️⃣ 전담팀 사실관계 조사\n3️⃣ 채팅기록, 결제내역 등 객관적 증거 검토\n4️⃣ 양측 의견 청취 및 조정\n5️⃣ 공정한 해결방안 제시\n\n🎯 해결 목표:\n• 신고 접수 후 24시간 내 1차 대응\n• 3일 내 조사 완료 및 해결방안 제시\n• 필요시 환불, 재매칭, 계정 정지 등 조치"
        }
      ]
    },
    {
      title: "치료사 등록",
      faqs: [
        {
          question: "치료사 등록 자격 조건은 무엇인가요?",
          answer: "전문 치료사로서 다음 조건을 모두 충족해야 합니다:\n\n📜 필수 자격:\n• 관련 분야 국가자격증 보유 (언어재활사, 작업치료사, 물리치료사 등)\n• 또는 관련 학과 학사 이상 학위 + 민간자격증\n• 해당 분야 1년 이상 실무 경력\n• 만 20세 이상 ~ 65세 이하\n\n📄 제출 서류:\n• 자격증 사본 (원본 대조 확인)\n• 학위증명서 및 성적증명서\n• 경력증명서 또는 재직증명서\n• 신분증 사본\n• 범죄경력조회서\n\n모든 서류는 발급일 기준 3개월 이내여야 합니다."
        },
        {
          question: "어떤 치료 분야를 등록할 수 있나요?",
          answer: "다양한 발달치료 분야에서 활동할 수 있습니다:\n\n🗣️ 언어치료:\n• 조음음운장애, 유창성장애, 언어발달지연, 실어증 등\n\n🎮 놀이치료:\n• 사회성 발달, 정서치료, 애착문제, 행동문제 등\n\n🧠 감각통합치료:\n• 감각처리장애, 감각과민/둔감, 전정계/고유수용계 문제 등\n\n🤹 작업치료:\n• 소근육 발달, 시지각 훈련, 일상생활 훈련 등\n\n🏃 물리치료:\n• 대근육 발달, 보행훈련, 자세교정, 운동발달지연 등\n\n🧩 기타 분야:\n• ABA치료, 인지학습치료, 미술치료, 음악치료, 특수교육 등"
        },
        {
          question: "등록 승인까지 얼마나 걸리나요?",
          answer: "철저한 검증을 위해 체계적인 절차를 거칩니다:\n\n⏰ 승인 일정:\n• 서류 제출 완료 후 3-5일 (평일 기준)\n• 서류 보완 요청 시 추가 1-2일\n• 면접 대상자는 추가 2-3일\n\n📋 승인 절차:\n1️⃣ 1일차: 서류 접수 및 기본 검토\n2️⃣ 2-3일차: 자격증 진위 확인 및 경력 검증\n3️⃣ 4일차: 화상 면접 (필요시)\n4️⃣ 5일차: 최종 승인 및 계정 활성화\n\n🚨 빠른 승인 팁:\n• 모든 서류를 정확히 제출\n• 고화질 이미지로 업로드\n• 연락처 정확히 기재"
        },
        {
          question: "수입과 활동 지역은 어떻게 되나요?",
          answer: "치료사님의 수익과 활동 범위에 대한 안내입니다:\n\n💰 수익 구조:\n• 첫 매칭 시에만 중개 수수료 발생\n• 이후 모든 수업료는 100% 치료사 수익\n• 월 평균 150-300만원 수익 (경력별 차이)\n• 시간당 5-12만원 (분야별, 경력별 차이)\n\n🗺️ 활동 지역:\n• 전국 어디서나 활동 가능\n• 여러 지역 동시 설정 가능\n• 출장비 별도 협의 가능\n• 온라인 수업도 지원\n\n📈 추가 혜택:\n• 치료사 전용 교육 프로그램 무료 제공\n• 우수 치료사 인센티브 지급\n• 프로필 상위 노출 기회"
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
            자주 묻는 질문
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            더모든 키즈 이용에 관련된 자주 묻는 질문들을 확인해보세요
          </p>
        </div>

        {/* FAQ 카테고리들 */}
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              {/* 카테고리 제목 */}
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                {category.title}
              </h3>
              
              {/* FAQ 목록 */}
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex;
                  const isOpen = openFAQ === globalIndex;
                  
                  return (
                    <div key={faqIndex} className="bg-gray-50 rounded-2xl">
                      {/* 질문 */}
                      <button
                        className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
                        onClick={() => toggleFAQ(globalIndex)}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900 pr-4">
                            Q. {faq.question}
                          </h4>
                          <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                      
                      {/* 답변 */}
                      {isOpen && (
                        <div className="px-6 pb-6">
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-gray-700 leading-relaxed">
                              <span className="font-semibold text-blue-600">A. </span>
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 추가 문의 */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              원하는 답변을 찾지 못하셨나요?
            </h3>
            <p className="text-gray-600 mb-6">
              고객센터를 통해 언제든지 문의해주세요<br />
              전문 상담팀이 신속하게 도움을 드리겠습니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/support"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                고객센터 문의
              </a>
              <a
                href="tel:1588-0000"
                className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                📞 1588-0000
              </a>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              운영시간: 평일 09:00 - 18:00 (주말 및 공휴일 휴무)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
