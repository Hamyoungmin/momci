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
          question: "더모든 키즈는 어떤 서비스입니까?",
          answer: "더모든 키즈는 전문 치료사와 학부모를 안전하게 연결하는 홈티칭 매칭 플랫폼입니다. 검증된 치료사를 통해 아이에게 맞는 맞춤형 치료 서비스를 제공합니다."
        },
        {
          question: "어떻게 선생님을 찾을 수 있나요?",
          answer: "두 가지 방법이 있습니다. 1) 선생님께 요청하기: 원하는 조건을 작성하여 선생님들의 지원을 받는 방식 2) 선생님 둘러보기: 등록된 선생님 프로필을 직접 탐색하는 방식"
        },
        {
          question: "1:1 채팅은 몇 명까지 무료인가요?",
          answer: "처음 2명의 선생님과는 무료로 1:1 실시간 채팅이 가능합니다. 3번째 선생님부터는 직거래 방지를 위해 보증금 10,000원이 필요합니다."
        },
        {
          question: "수업료 결제는 어떻게 하나요?",
          answer: "첫 날 수업료는 플랫폼을 통해 안전결제로 진행됩니다. 결제 완료 후 선생님의 연락처가 공개되며, 이후 수업료는 선생님과 직접 정산하시면 됩니다."
        }
      ]
    },
    {
      title: "요금 및 결제",
      faqs: [
        {
          question: "수수료는 얼마인가요?",
          answer: "더모든 키즈는 치료비에 붙는 중개 수수료를 0원으로 만들어 회기당 평균 1만원 이상 저렴한 합리적인 비용을 실현했습니다. 첫 매칭 성사시에만 (주당 수업 횟수 x 1회분)의 매칭 수수료가 발생하며, 이후 모든 수업료는 100% 선생님의 수익입니다."
        },
        {
          question: "이용권 요금은 어떻게 되나요?",
          answer: "학부모 이용권은 월 9,900원, 선생님 이용권은 월 19,900원(VAT 포함)입니다. 첫 달 50% 할인 이벤트도 진행 중입니다."
        },
        {
          question: "환불 정책은 어떻게 되나요?",
          answer: "이용권은 구매 후 7일 이내 전액 환불 가능하며, 첫 수업료는 수업 24시간 전까지 취소 시 전액 환불됩니다. 자세한 내용은 환불 규정을 참고해주세요."
        },
        {
          question: "결제 방법은 무엇이 있나요?",
          answer: "신용카드, 계좌이체, 가상계좌 입금이 가능합니다. 모든 결제는 SSL 보안으로 안전하게 처리됩니다."
        }
      ]
    },
    {
      title: "안전 및 보안",
      faqs: [
        {
          question: "선생님들은 어떻게 검증되나요?",
          answer: "모든 치료사는 자격증, 학력, 경력 등을 관리자가 직접 검토하여 승인됩니다. 허위 정보 제공 시 즉시 계정이 정지됩니다."
        },
        {
          question: "직거래는 왜 금지되나요?",
          answer: "직거래는 사기, 분쟁 등의 위험이 높고 플랫폼의 안전장치를 우회하는 행위입니다. 발견 시 계정 정지 등의 제재를 받습니다."
        },
        {
          question: "분쟁이 발생하면 어떻게 하나요?",
          answer: "플랫폼을 통해 매칭된 경우, 전문 중재팀이 공정하게 해결해드립니다. 필요시 채팅 내역 등을 확인하여 객관적으로 판단합니다."
        },
        {
          question: "개인정보는 안전하게 보호되나요?",
          answer: "네, SSL 암호화와 개인정보보호 인증을 통해 모든 개인정보를 안전하게 보호합니다. 매칭 확정 전까지는 개인 연락처가 공개되지 않습니다."
        }
      ]
    },
    {
      title: "치료사 등록",
      faqs: [
        {
          question: "치료사 등록 조건은 무엇인가요?",
          answer: "관련 분야 자격증 소지자로, 학력 및 경력을 증빙할 수 있어야 합니다. 제출된 서류는 관리자가 직접 검토하여 승인 여부를 결정합니다."
        },
        {
          question: "프로필 승인까지 얼마나 걸리나요?",
          answer: "일반적으로 3-5일 정도 소요됩니다. 서류 부족이나 추가 확인이 필요한 경우 더 오래 걸릴 수 있습니다."
        },
        {
          question: "어떤 치료 분야가 가능한가요?",
          answer: "언어치료, 놀이치료, 감각통합치료, 작업치료, 물리치료, 인지학습치료, ABA치료, 미술치료, 음악치료 등 다양한 분야가 가능합니다."
        },
        {
          question: "활동 지역에 제한이 있나요?",
          answer: "전국 어디서나 활동 가능합니다. 프로필 등록 시 희망 활동 지역을 설정할 수 있으며, 여러 지역 선택도 가능합니다."
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
                    <div key={faqIndex} className="bg-gray-50 rounded-lg">
                      {/* 질문 */}
                      <button
                        className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
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
