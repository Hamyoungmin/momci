'use client';

import { useState } from 'react';

export default function PricingFAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "이용권을 구매하지 않고도 서비스를 이용할 수 있나요?",
      answer: "아니요, 더모든 키즈는 안전하고 질 높은 서비스 제공을 위해 이용권 구매 후에만 매칭 서비스를 이용할 수 있습니다. 다만 7일 무료 체험 기간을 제공하고 있어 부담 없이 서비스를 경험해보실 수 있습니다."
    },
    {
      question: "이용권 요금은 언제 결제되나요?",
      answer: "이용권은 구매일로부터 매월 같은 날에 자동 결제됩니다. 예를 들어 1월 15일에 구매하시면 매월 15일에 결제됩니다. 결제일 3일 전에 미리 알림을 보내드립니다."
    },
    {
      question: "중도 해지 시 환불이 가능한가요?",
      answer: "네, 가능합니다. 이용권 구매 후 7일 이내에는 전액 환불이 가능하며, 그 이후에는 사용 기간을 제외한 나머지 기간에 대해 일할 계산하여 환불해드립니다. 단, 매칭이 성사된 이후에는 환불이 제한될 수 있습니다."
    },
    {
      question: "첫 달 할인은 어떻게 적용되나요?",
      answer: "신규 가입자에 한해 첫 달 50% 할인이 자동으로 적용됩니다. 할인 혜택은 가입 시 즉시 확인할 수 있으며, 별도의 쿠폰 코드나 신청 과정이 필요하지 않습니다."
    },
    {
      question: "9% 수수료는 언제 부과되나요?",
      answer: "수수료는 매칭이 성사되어 첫 수업이 완료된 후에만 부과됩니다. 매칭이 이루어지지 않거나 첫 수업 전에 취소되는 경우에는 수수료가 부과되지 않습니다."
    },
    {
      question: "치료사 이용권과 학부모 이용권의 차이는 무엇인가요?",
      answer: "학부모 이용권(월 9,900원)은 치료사 찾기, 1:1 채팅, 매칭 서비스 등을 포함하며, 치료사 이용권(월 19,900원)은 프로필 등록, 지원하기, 학부모와의 매칭 등 치료사 활동에 필요한 모든 기능을 포함합니다."
    },
    {
      question: "이용권 업그레이드나 다운그레이드가 가능한가요?",
      answer: "현재는 학부모용과 치료사용으로 구분되어 있어 상호 변경은 불가능합니다. 다만 동일 계정으로 두 가지 이용권을 모두 구매하여 사용하는 것은 가능합니다."
    },
    {
      question: "해외에서도 이용할 수 있나요?",
      answer: "네, 온라인 서비스이므로 해외에서도 이용 가능합니다. 다만 국내 거주 치료사와의 매칭이 기본이므로, 온라인 화상 수업 형태로 진행될 수 있습니다."
    },
    {
      question: "가족 할인이나 단체 할인이 있나요?",
      answer: "현재 가족 할인은 제공하지 않지만, 친구 추천 시 추천인과 피추천인 모두에게 1개월 무료 이용권을 제공하는 추천 혜택이 있습니다."
    },
    {
      question: "결제 방법은 어떤 것들이 있나요?",
      answer: "신용카드(국내외), 체크카드, 계좌이체, 가상계좌 입금, 휴대폰 결제 등 다양한 결제 수단을 지원합니다. 모든 결제는 PG사를 통해 안전하게 처리됩니다."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            요금제 관련 FAQ
          </h2>
          <p className="text-xl text-gray-600">
            이용권과 요금제에 대해 자주 묻는 질문들을 확인해보세요
          </p>
        </div>

        {/* FAQ 리스트 */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFAQ === index;
            
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* 질문 */}
                <button
                  className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      Q{index + 1}. {faq.question}
                    </h3>
                    <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
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

        {/* 추가 문의 */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              더 궁금한 점이 있으신가요?
            </h3>
            <p className="text-gray-600 mb-6">
              요금제나 결제와 관련하여 추가 문의사항이 있으시면<br />
              언제든지 고객센터로 연락해주세요
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
