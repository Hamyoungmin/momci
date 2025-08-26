'use client';

import React, { useState } from 'react';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const faqCategories = [
    {
      category: "서비스 이용",
      items: [
        {
          id: 1,
          question: "더모든 키즈는 어떤 서비스인가요?",
          answer: "더모든 키즈는 3세부터 초등학교 6학년까지의 아이들을 대상으로 하는 전문 홈스쿨링 치료 서비스입니다. 언어치료, 학습치료, 행동치료 등 다양한 분야의 전문 치료사가 직접 가정으로 방문하여 1:1 맞춤형 치료를 제공합니다."
        },
        {
          id: 2,
          question: "어떤 연령대의 아이들이 이용할 수 있나요?",
          answer: "3세부터 초등학교 6학년(만 12세)까지의 아이들이 서비스를 이용할 수 있습니다. 각 연령대별 발달 특성에 맞는 맞춤형 프로그램을 제공합니다."
        },
        {
          id: 3,
          question: "서비스 이용 지역은 어디까지인가요?",
          answer: "현재 서울, 경기, 인천 지역에서 서비스를 제공하고 있으며, 점차 서비스 지역을 확대해 나갈 예정입니다. 자세한 서비스 가능 지역은 고객센터로 문의해주세요."
        }
      ]
    },
    {
      category: "매칭 및 예약",
      items: [
        {
          id: 4,
          question: "치료사 매칭은 어떻게 이루어지나요?",
          answer: "아이의 상태, 필요한 치료 분야, 선호하는 선생님 성향, 활동 지역 등을 종합적으로 고려하여 가장 적합한 치료사를 매칭해드립니다. AI 기반 매칭 시스템을 통해 높은 만족도의 매칭을 제공합니다."
        },
        {
          id: 5,
          question: "치료사 변경이 가능한가요?",
          answer: "네, 가능합니다. 아이와의 궁합이 맞지 않거나 다른 사유로 변경을 원하실 경우, 언제든지 고객센터로 연락주시면 새로운 치료사를 매칭해드립니다."
        },
        {
          id: 6,
          question: "수업 일정은 어떻게 정하나요?",
          answer: "치료사와 학부모님이 상호 협의하여 수업 일정을 정합니다. 주 1회부터 주 3회까지 선택 가능하며, 시간은 평일 오후 2시부터 오후 8시까지 가능합니다."
        }
      ]
    },
    {
      category: "결제 및 이용권",
      items: [
        {
          id: 7,
          question: "이용권은 어떻게 구매하나요?",
          answer: "홈페이지의 '이용권 구매' 메뉴에서 원하는 이용권을 선택하여 구매하실 수 있습니다. 신용카드, 계좌이체, 무통장입금 등 다양한 결제 방법을 지원합니다."
        },
        {
          id: 8,
          question: "이용권의 유효기간은 얼마나 되나요?",
          answer: "이용권 종류에 따라 다르지만, 일반적으로 구매일로부터 3개월입니다. 유효기간 내에 사용하지 않은 이용권은 자동으로 소멸되니 주의해주세요."
        },
        {
          id: 9,
          question: "환불은 어떻게 받을 수 있나요?",
          answer: "서비스 이용 전이라면 100% 환불이 가능하며, 부분 이용 시에는 이용한 만큼을 제외하고 환불해드립니다. 자세한 환불 규정은 '환불규정' 페이지를 참고해주세요."
        }
      ]
    },
    {
      category: "치료사 관련",
      items: [
        {
          id: 10,
          question: "치료사들의 자격은 어떻게 되나요?",
          answer: "모든 치료사는 관련 학과 졸업 또는 해당 분야 자격증을 보유하고 있으며, 엄격한 심사와 면접을 통과한 전문가들입니다. 또한 정기적인 교육과 평가를 통해 서비스 품질을 유지합니다."
        },
        {
          id: 11,
          question: "치료사의 경력은 어느 정도인가요?",
          answer: "최소 1년 이상의 아동 관련 경력을 보유한 치료사들로 구성되어 있으며, 평균 3-5년의 풍부한 경험을 가지고 있습니다. 각 치료사의 상세한 경력은 프로필에서 확인하실 수 있습니다."
        }
      ]
    },
    {
      category: "기타",
      items: [
        {
          id: 12,
          question: "개인정보는 안전하게 보호되나요?",
          answer: "네, 철저하게 보호됩니다. 개인정보보호법에 따라 수집된 모든 정보는 암호화되어 저장되며, 서비스 제공 목적 외에는 절대 사용되지 않습니다."
        },
        {
          id: 13,
          question: "고객센터 운영시간은 어떻게 되나요?",
          answer: "평일 오전 9시부터 오후 6시까지 운영됩니다. 주말 및 공휴일에는 휴무이며, 긴급한 경우 온라인 문의를 남겨주시면 영업일에 빠르게 답변드립니다."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero 섹션 */}
      <section className="bg-blue-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">자주 묻는 질문</h1>
            <p className="text-xl text-blue-100">
              더모든 키즈에 대한 궁금한 점들을 확인해보세요
            </p>
          </div>
        </div>
      </section>

      {/* 검색 섹션 */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <input
              type="text"
              placeholder="궁금한 내용을 검색해보세요"
              className="w-full px-6 py-4 pr-12 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ 내용 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-3">
                          <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded font-medium flex-shrink-0 mt-0.5">
                            Q
                          </span>
                          <h3 className="text-lg font-medium text-gray-900 text-left">
                            {item.question}
                          </h3>
                        </div>
                        <svg 
                          className={`h-5 w-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                            openItems.includes(item.id) ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                    
                    {openItems.includes(item.id) && (
                      <div className="px-6 pb-4 border-t border-gray-100">
                        <div className="flex items-start space-x-3 pt-4">
                          <span className="bg-green-500 text-white text-sm px-2 py-1 rounded font-medium flex-shrink-0">
                            A
                          </span>
                          <p className="text-gray-600 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 추가 문의 */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            원하는 답변을 찾지 못하셨나요?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            고객센터로 문의하시면 빠르고 정확한 답변을 드리겠습니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              1:1 문의하기
            </button>
            <button className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              전화 문의: 1588-0000
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

