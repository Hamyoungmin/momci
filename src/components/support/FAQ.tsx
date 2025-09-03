'use client';

import { useState, useEffect } from 'react';
import { getFAQs, groupFAQsByCategory, incrementFAQViews } from '@/lib/faq';
import type { FAQCategory } from '@/lib/faq';

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(0);
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

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const globalIndex = categoryIndex * 1000 + itemIndex;
    setOpenItem(openItem === globalIndex ? null : globalIndex);

    // FAQ 조회수 증가 (비동기적으로 처리)
    const category = faqCategories[categoryIndex];
    if (category && category.faqs[itemIndex]) {
      incrementFAQViews(category.faqs[itemIndex].id);
    }
  };

  // 로딩 중일 때
  if (loading) {
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
          <div className="text-center py-12">
            <p className="text-gray-500">FAQ가 준비중입니다.</p>
          </div>
        </div>
      </section>
    );
  }

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
            <div key={category.id} className="bg-white border-2 border-blue-500 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center">
                <span className="mr-3">🔵</span>
                {category.title}
              </h3>
              
              <div className="space-y-4">
                {category.faqs.map((faq, itemIndex) => {
                  const globalIndex = categoryIndex * 1000 + itemIndex;
                  const isOpen = openItem === globalIndex;
                  
                  return (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleItem(categoryIndex, itemIndex)}
                        className="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span className="font-medium text-gray-900">
                          Q. {faq.question}
                        </span>
                        <span className={`text-blue-500 text-xl transition-transform duration-300 ease-in-out ${
                          isOpen ? 'transform rotate-180' : ''
                        }`}>
                          ▼
                        </span>
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen 
                          ? 'max-h-96 opacity-100' 
                          : 'max-h-0 opacity-0'
                      }`}>
                        <div className="px-4 pb-4 border-t border-gray-200 bg-blue-50">
                          <p className="text-gray-700 pt-4 leading-relaxed whitespace-pre-wrap">
                            <span className="font-medium text-blue-600">A. </span>
                            {faq.answer}
                          </p>
                        </div>
                      </div>
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