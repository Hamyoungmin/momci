'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqCategories = [
    {
      title: "결제 및 이용권",
      items: [
        {
          question: "더모든 키즈는 어떤 서비스입니까?",
          answer: "더모든 키즈는 학부모와 전문 치료사를 안전하게 연결하는 홈티칭 매칭 플랫폼입니다. 기존의 높은 수수료를 대폭 줄여 합리적인 비용으로 양질의 치료 서비스를 받을 수 있습니다."
        },
        {
          question: "기존 홈티칭과 어떤 차이가 있나요?",
          answer: "기존 업체들은 20%에 달하는 높은 수수료를 받지만, 더모든 키즈는 수수료를 9%로 제한하여 학부모님은 더 저렴하게, 치료사님은 더 많은 수익을 얻을 수 있습니다."
        },
        {
          question: "이용권을 구매해야 하는 이유는 무엇인가요?",
          answer: "이용권 구매를 통해 검증된 회원만이 플랫폼을 이용할 수 있도록 하여 안전성을 보장합니다. 또한 무료 1:1 채팅 2회, 안전결제 시스템 등 다양한 혜택을 제공합니다."
        }
      ]
    },
    {
      title: "매칭 및 서비스",
      items: [
        {
          question: "치료사는 어떻게 찾나요?",
          answer: "두 가지 방법이 있습니다. 1) '선생님께 요청하기'에 글을 올려 치료사들의 지원을 받거나, 2) '선생님 둘러보기'에서 프로필을 보고 직접 연락하실 수 있습니다."
        },
        {
          question: "무료 채팅은 몇 번까지 가능한가요?",
          answer: "이용권 구매 시 2명의 치료사와 무료로 1:1 채팅이 가능합니다. 3번째 치료사부터는 직거래 방지를 위해 보증금 10,000원이 필요합니다."
        },
        {
          question: "수업료는 어떻게 결제하나요?",
          answer: "첫 수업료는 플랫폼을 통해 안전결제로 진행되며, 수업 완료 후 치료사에게 전달됩니다. 이후 수업료는 치료사와 직접 정산하시면 됩니다."
        },
        {
          question: "치료사의 자격은 어떻게 검증되나요?",
          answer: "모든 치료사는 관련 국가 자격증과 경력 증명서를 제출하며, 관리자가 직접 검증한 후 승인된 치료사만 활동할 수 있습니다."
        }
      ]
    },
    {
      title: "안전 및 분쟁",
      items: [
        {
          question: "직거래를 하면 안 되는 이유는 무엇인가요?",
          answer: "플랫폼 외의 직거래는 수업료 사기, 무단 취소 등 다양한 위험에 노출됩니다. 더모든 키즈의 안전결제 시스템과 분쟁 중재 서비스를 통해서만 안전한 거래가 보장됩니다."
        },
        {
          question: "분쟁이 발생하면 어떻게 해결되나요?",
          answer: "플랫폼 내에서 발생한 모든 분쟁은 공정한 중재 절차를 통해 해결됩니다. 증거 자료를 제출하시면 관리자가 검토하여 공정하게 처리해드립니다."
        },
        {
          question: "개인정보는 어떻게 보호되나요?",
          answer: "회원님의 개인정보는 개인정보처리방침에 따라 안전하게 관리되며, 수업 확정 전까지는 연락처가 공개되지 않습니다."
        }
      ]
    }
  ];

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const globalIndex = categoryIndex * 1000 + itemIndex;
    setOpenItem(openItem === globalIndex ? null : globalIndex);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            자주 묻는 질문 (FAQ)
          </h2>
          <p className="text-gray-600">
            더모든 키즈 이용에 관련된 자주 묻는 질문들입니다
          </p>
        </div>

        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white border-2 border-blue-500 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center">
                <span className="mr-3">🔵</span>
                {category.title}
              </h3>
              
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 1000 + itemIndex;
                  const isOpen = openItem === globalIndex;
                  
                  return (
                    <div key={itemIndex} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleItem(categoryIndex, itemIndex)}
                        className="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span className="font-medium text-gray-900">
                          Q. {item.question}
                        </span>
                        <span className={`text-blue-500 text-xl transition-transform ${
                          isOpen ? 'transform rotate-180' : ''
                        }`}>
                          ▼
                        </span>
                      </button>
                      
                      {isOpen && (
                        <div className="px-4 pb-4 border-t border-gray-200 bg-blue-50">
                          <p className="text-gray-700 pt-4 leading-relaxed">
                            <span className="font-medium text-blue-600">A. </span>
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 추가 문의 안내 */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              찾으시는 답변이 없으신가요?
            </h3>
            <p className="text-gray-600 mb-6">
              궁금한 점이 있으시면 언제든지 1:1 문의를 통해 연락주세요
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              1:1 문의하기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
