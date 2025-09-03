'use client';

import { useState, useEffect } from 'react';
import { getFAQs, groupFAQsByCategory, incrementFAQViews } from '@/lib/faq';
import type { FAQCategory } from '@/lib/faq';

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [faqCategories, setFaqCategories] = useState<FAQCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // FAQ 데이터 로드
  useEffect(() => {
    async function loadFAQs() {
      try {
        setLoading(true);
        const faqs = await getFAQs();
        const groupedFAQs = groupFAQsByCategory(faqs);
        setFaqCategories(groupedFAQs);
      } catch (error) {
        console.error('FAQ 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadFAQs();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);

    // FAQ 조회수 증가 (비동기적으로 처리)
    const categoryIndex = Math.floor(index / 100);
    const itemIndex = index % 100;
    const category = faqCategories[categoryIndex];
    if (category && category.faqs[itemIndex]) {
      incrementFAQViews(category.faqs[itemIndex].id);
    }
  };

  // 로딩 중일 때
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              자주 묻는 질문
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              더모든 키즈 이용에 관련된 자주 묻는 질문들을 확인해보세요
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">FAQ를 불러오는 중...</span>
          </div>
        </div>
      </section>
    );
  }

  // 데이터가 없는 경우
  if (faqCategories.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              자주 묻는 질문
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              더모든 키즈 이용에 관련된 자주 묻는 질문들을 확인해보세요
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">FAQ가 준비중입니다.</p>
          </div>
        </div>
      </section>
    );
  }

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
            <div key={category.id}>
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
                    <div key={faq.id} className="bg-gray-50 rounded-2xl">
                      {/* 질문 */}
                      <button
                        className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
                        onClick={() => toggleFAQ(globalIndex)}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900 pr-4">
                            Q. {faq.question}
                          </h4>
                          <div className={`transform transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}>
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                      
                      {/* 답변 */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen 
                          ? 'max-h-96 opacity-100' 
                          : 'max-h-0 opacity-0'
                      }`}>
                        <div className="px-6 pb-6">
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              <span className="font-semibold text-blue-600">A. </span>
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
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
