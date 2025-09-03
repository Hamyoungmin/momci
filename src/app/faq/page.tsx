'use client';

import React, { useState, useEffect } from 'react';
import { getFAQs, groupFAQsByCategory, incrementFAQViews } from '@/lib/faq';
import type { FAQCategory } from '@/lib/faq';

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<number | null>(null);
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

  const toggleItem = (id: number) => {
    // 같은 항목 클릭시 닫기, 다른 항목 클릭시 그것만 열기
    setOpenItem(prev => prev === id ? null : id);

    // FAQ 조회수 증가 (비동기적으로 처리)
    const categoryIndex = Math.floor(id / 1000);
    const itemIndex = id % 1000;
    const category = faqCategories[categoryIndex];
    if (category && category.faqs[itemIndex]) {
      incrementFAQViews(category.faqs[itemIndex].id);
    }
  };

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">자주 묻는 질문(FAQ)</h1>
            <p className="text-gray-600">
              모든별 키즈 이용에 궁금한 점이 있으신가요?<br />
              사용자들이 가장 자주 묻는 질문들을 모았습니다.
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">FAQ를 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (faqCategories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">자주 묻는 질문(FAQ)</h1>
            <p className="text-gray-600">
              모든별 키즈 이용에 궁금한 점이 있으신가요?<br />
              사용자들이 가장 자주 묻는 질문들을 모았습니다.
            </p>
          </div>
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">FAQ가 준비중입니다</h3>
            <p className="mt-1 text-sm text-gray-500">잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 페이지 제목 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">자주 묻는 질문(FAQ)</h1>
          <p className="text-gray-600">
            모든별 키즈 이용에 궁금한 점이 있으신가요?<br />
            사용자들이 가장 자주 묻는 질문들을 모았습니다.
          </p>
        </div>

        {/* 검색 섹션 */}
        <div className="mb-12">
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

        {/* FAQ 내용 */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={category.id} className="bg-white border-2 border-blue-500 rounded-xl p-6">
              <h2 className="text-xl font-bold text-blue-600 mb-6 flex items-center">
                <span className="mr-3">🔵</span>
                {category.title}
              </h2>
              
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const globalId = categoryIndex * 1000 + faqIndex;
                  return (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                        onClick={() => toggleItem(globalId)}
                      className="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span className="font-medium text-gray-900">
                          Q. {faq.question}
                      </span>
                      <svg 
                        className={`w-5 h-5 text-blue-500 transition-transform duration-300 ease-in-out ${
                            openItem === globalId ? 'transform rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openItem === globalId 
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
      </div>


    </div>
  );
}

