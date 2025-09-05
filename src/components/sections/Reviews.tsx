'use client';

import { useState } from 'react';

export default function Reviews() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const reviews = [
    {
      id: 1,
      title: "6개월 만에 아이 발음이 완전히 달라졌어요!",
      content: "조음장애로 고민이 많았던 5세 아들이 김민정 선생님의 체계적인 언어치료를 받으면서 놀라운 변화를 보였습니다. 전문적인 평가부터 맞춤 치료까지, 매주 진행상황을 상세히 피드백해주셔서 집에서도 연습할 수 있었어요.",
      rating: 5,
      author: "김미영 학부모",
      program: "언어치료",
      date: "2024.01.20"
    },
    {
      id: 2,
      title: "분리불안이 심했던 아이가 이제 혼자서도 잘해요",
      content: "7세 딸의 분리불안 때문에 어린이집도 못 보냈는데, 박소영 선생님의 놀이치료 덕분에 점점 독립적으로 변하고 있습니다. 아이의 마음을 정말 잘 이해해주시는 전문가입니다. 모든별 키즈를 통해 만난 최고의 선생님이에요!",
      rating: 5,
      author: "이수진 학부모", 
      program: "놀이치료",
      date: "2024.01.18"
    },
    {
      id: 3,
      title: "15년 경력의 전문성이 정말 느껴져요",
      content: "감각과민 문제로 일상생활이 힘들었던 4세 아들이 이현우 선생님의 감각통합치료를 받으면서 많이 안정되었습니다. SIPT 평가부터 치료 계획까지 모든 과정이 과학적이고 체계적이에요. 안전한 결제 시스템도 믿을 수 있어서 좋았습니다.",
      rating: 5,
      author: "박현수 학부모",
      program: "감각통합치료", 
      date: "2024.01.15"
    },
    {
      id: 4,
      title: "BCBA 자격의 전문가다운 체계적인 ABA 치료",
      content: "자폐스펙트럼 진단을 받은 5세 아들이 정현석 선생님의 ABA 치료를 받으면서 눈맞춤이 늘고 의사소통이 가능해졌습니다. 데이터 기반의 객관적인 평가와 상세한 기록으로 진전 상황을 명확히 알 수 있어서 신뢰가 갑니다.",
      rating: 5,
      author: "정유리 학부모",
      program: "ABA치료",
      date: "2024.01.12"
    },
    {
      id: 5,
      title: "미술치료로 내성적인 아이가 자신감을 찾았어요",
      content: "자존감이 낮고 내성적이었던 6세 딸이 한수진 선생님의 미술치료를 받으면서 완전히 달라졌습니다. 그림을 통해 감정 표현법을 배우고 자신감도 생겼어요. 모든별 키즈의 검증된 전문가 시스템 덕분에 믿고 맡길 수 있었습니다.",
      rating: 5,
      author: "윤정희 학부모",
      program: "미술치료",
      date: "2024.01.10"
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
            모든별 키즈를 통해 좋은 선생님을 만난 학부모님들의<br />
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
                      &ldquo;{review.title}&rdquo;
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
