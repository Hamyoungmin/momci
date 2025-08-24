'use client';

import { useState } from 'react';

export default function Reviews() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const reviews = [
    {
      id: 1,
      title: "놀기만도 아니, 선생님께서 책임감이 정말 대단하세요!",
      content: "아이가 기존에서 늘어나던 기능이 학원에 다니면서 점점 향상되고 있어요. 기존에서 치료에서도 많은 도움을 받았고, 더모든 키즈를 통해 만난 선생님이 정말 전문적이시네요.",
      rating: 5,
      author: "김○○ 학부모",
      program: "언어치료",
      date: "2024.01.15"
    },
    {
      id: 2,
      title: "선생님들도 보고 선행복후 갑이 좋습니다!",
      content: "치료사 선생님의 열정과 전문성에 정말 감동받았어요. 아이가 점점 밝아지고 자신감을 갖게 되는 모습을 보니 너무 기뻐요. 더모든 키즈를 통해 좋은 선생님을 만날 수 있어서 감사합니다.",
      rating: 5,
      author: "박○○ 학부모", 
      program: "놀이치료",
      date: "2024.01.10"
    },
    {
      id: 3,
      title: "짧은 한 소개팬주서서 감사드립니다~",
      content: "선생님이과 좋아하는 친환한 선생님이에요. 아이의 특성을 잘 파악하시고 맞춤형 교육을 해주셔서 정말 만족합니다. 안전한 결제 시스템도 믿을 수 있어서 좋았어요.",
      rating: 5,
      author: "이○○ 학부모",
      program: "감각통합치료", 
      date: "2024.01.08"
    },
    {
      id: 4,
      title: "전문적이고 체계적인 치료로 아이가 많이 좋아졌어요",
      content: "처음에는 반신반의했는데, 선생님의 전문적인 접근과 꾸준한 관리 덕분에 아이의 집중력이 눈에 띄게 향상되었습니다. 학부모 상담도 정기적으로 해주셔서 신뢰가 갑니다.",
      rating: 5,
      author: "최○○ 학부모",
      program: "인지학습치료",
      date: "2024.01.05"
    },
    {
      id: 5,
      title: "안전한 매칭과 투명한 과정이 마음에 들어요",
      content: "다른 플랫폼과 달리 수수료도 합리적이고, 안전결제 시스템 덕분에 안심하고 이용할 수 있었어요. 선생님도 검증이 잘 되어 있어서 믿고 맡길 수 있습니다.",
      rating: 5,
      author: "정○○ 학부모",
      program: "작업치료",
      date: "2024.01.02"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            학부모님들의 생생한 후기
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            더모든 키즈를 통해 좋은 선생님을 만난 학부모님들의<br />
            진솔한 후기를 확인해보세요
          </p>
        </div>

        {/* 후기 슬라이더 */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {reviews.map((review) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-xl shadow-lg p-8 mx-auto max-w-4xl">
                    {/* 별점 */}
                    <div className="flex justify-center mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-2xl">⭐</span>
                      ))}
                    </div>
                    
                    {/* 제목 */}
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-4">
                      "{review.title}"
                    </h3>
                    
                    {/* 내용 */}
                    <p className="text-gray-700 text-center text-lg leading-relaxed mb-6 max-w-3xl mx-auto">
                      {review.content}
                    </p>
                    
                    {/* 작성자 정보 */}
                    <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{review.author}</div>
                        <div className="text-sm text-gray-600">{review.program} · {review.date}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 네비게이션 버튼 */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 슬라이드 인디케이터 */}
          <div className="flex justify-center mt-8 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 통계 요약 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">4.8/5.0</div>
            <div className="text-gray-600">평균 만족도</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">1,247+</div>
            <div className="text-gray-600">누적 후기 수</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">98%</div>
            <div className="text-gray-600">재이용 의사</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              더 많은 후기가 궁금하신가요?
            </h3>
            <p className="text-gray-600 mb-6">
              다양한 치료 분야별 후기와 치료사 평가를 확인해보세요
            </p>
            <a
              href="/reviews"
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              전체 후기 보기
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
