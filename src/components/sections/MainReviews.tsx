'use client';

import { useState, useEffect } from 'react';

export default function MainReviews() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const visibleItems = 3; // 한 번에 보여줄 후기 개수

  // 후기 작성/보기 페이지에서 가져온 후기 데이터
  const reviews = [
    {
      id: 1,
      title: "놀기만 하는 아이, 선생님께서 놀이를 치료로 바뀌니깐 차근차근 치료받고 있습니다^^",
      content: "아이가 자연스럽게 놀면서 치료를 받을 수 있어서 좋았습니다. 처음에는 치료를 받는 것을 싫어했는데, 놀이를 통해 접근하니 아이가 즐거워하면서 치료를 받더라고요. 선생님께서 아이의 상태를 정확히 파악하시고 적절한 놀이를 통해 치료해 주셔서 정말 감사합니다.",
      rating: 5,
      author: "신대방역 임**님",
      date: "2025.01.20"
    },
    {
      id: 2,
      title: "선생님들을 보고 선택할 수 있어서 좋았습니다!",
      content: "직접 선생님의 이력과 경력을 보고 선택할 수 있다는 점이 정말 좋았습니다. 우리 아이에게 맞는 선생님을 직접 고를 수 있어서 더욱 신뢰가 갔고, 실제로도 아이가 선생님을 좋아해서 치료 효과도 좋았습니다.",
      rating: 5,
      author: "가람마을 임**님",
      date: "2025.01.18"
    },
    {
      id: 3,
      title: "좋은 선생님께서 서서 컨설팅도-",
      content: "선생님께서 아이의 상태를 정확히 진단해 주시고, 앞으로의 치료 방향에 대해서도 자세히 설명해 주셔서 정말 도움이 되었습니다. 부모로서 궁금했던 점들도 친절하게 답변해 주시고, 가정에서 할 수 있는 활동들도 알려주셔서 감사했습니다.",
      rating: 5,
      author: "방화동 구**님",
      date: "2025.01.15"
    },
    {
      id: 4,
      title: "전문적인 치료로 아이가 많이 좋아졌어요",
      content: "선생님의 전문성이 정말 뛰어나시더라고요. 체계적이고 과학적인 접근으로 우리 아이의 문제를 정확히 파악하고 치료해 주셨습니다. 매주 상세한 피드백도 주시고, 집에서 할 수 있는 활동들도 알려주셔서 아이가 꾸준히 발전할 수 있었어요.",
      rating: 5,
      author: "강남구 김**님",
      date: "2025.01.12"
    },
    {
      id: 5,
      title: "아이가 치료를 즐거워해요",
      content: "처음에는 치료를 싫어했던 아이가 이제는 선생님 만나는 날을 기다립니다. 재미있게 치료받으면서 실력도 늘고 있어요. 선생님이 아이의 눈높이에 맞춰서 친근하게 다가가 주셔서 아이가 편안해합니다.",
      rating: 5,
      author: "서초구 박**님",
      date: "2025.01.10"
    },
    {
      id: 6,
      title: "세심한 케어에 감동받았습니다",
      content: "아이 하나하나의 특성을 잘 파악하시고 맞춤형 치료를 해주셔서 정말 감사했습니다. 부모 상담도 꼼꼼히 해주시고, 치료 과정에서 궁금한 점들을 언제든지 물어볼 수 있어서 좋았어요.",
      rating: 5,
      author: "송파구 이**님",
      date: "2025.01.08"
    },
    {
      id: 7,
      title: "체계적인 프로그램으로 효과가 확실해요",
      content: "다른 치료센터와는 달리 정말 체계적이고 과학적인 접근방법으로 치료를 진행해주셔서 눈에 띄는 효과를 볼 수 있었습니다. 매번 상세한 피드백도 주셔서 아이의 발전과정을 명확히 알 수 있어요.",
      rating: 5,
      author: "노원구 최**님",
      date: "2025.01.06"
    },
    {
      id: 8,
      title: "선생님의 전문성이 정말 뛰어나세요",
      content: "오랜 경험과 전문지식을 바탕으로 우리 아이의 문제점을 정확히 파악하고 해결책을 제시해주셨습니다. 아이도 선생님을 정말 좋아하고 신뢰하는 모습이 보여서 안심이 됩니다.",
      rating: 5,
      author: "강서구 정**님",
      date: "2025.01.04"
    },
    {
      id: 9,
      title: "믿고 맡길 수 있는 전문가입니다",
      content: "처음에는 반신반의했는데, 몇 개월 지나니 아이가 정말 많이 변했어요. 사회성도 늘고 자신감도 생겼습니다. 꾸준히 치료받으면서 더 좋은 결과를 기대하고 있어요.",
      rating: 4,
      author: "양천구 한**님",
      date: "2025.01.02"
    }
  ];

  const maxSlides = Math.ceil(reviews.length / visibleItems) - 1;
  const effectiveCurrentSlide = Math.min(currentSlide, maxSlides);

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (maxSlides + 1));
    }, 6000); // 6초마다 자동 전환

    return () => clearInterval(interval);
  }, [maxSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (maxSlides + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + (maxSlides + 1)) % (maxSlides + 1));
  };


  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${i < rating ? 'text-orange-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
        <span className="text-sm text-gray-500 ml-2">({rating}/5)</span>
      </>
    );
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 섹션 헤더 - 후기 페이지 스타일 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-blue-900">실제</span> <span className="text-blue-400">학부모님 후기</span>
            </h2>
            <p className="text-xl text-gray-600">
              먼저 경험한 학부모님들의 목소리를 들어보세요.
            </p>
          </div>

          {/* 후기 슬라이더 - 후기 페이지 스타일 */}
          <div className="relative">
            {/* 슬라이더 컨테이너 - 개별 후기 처리 */}
            <div className="relative overflow-hidden px-8">
              <div 
                className="flex transition-transform duration-500 ease-in-out gap-6"
                style={{ 
                  transform: `translateX(calc(-${effectiveCurrentSlide * 33.333333}% - ${effectiveCurrentSlide * 1.5}rem))`,
                }}
              >
                {reviews.map((review, index) => (
                  <div 
                    key={review.id}
                    className="flex-shrink-0 w-full md:w-1/3"
                    style={{
                      minWidth: 'calc(33.333333% - 1rem)'
                    }}
                  >
                    <div 
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm transform transition-all duration-300 hover:scale-105 hover:shadow-md h-full"
                      style={{
                        animationDelay: `${(index % visibleItems) * 100}ms`,
                        animation: index >= currentSlide && index < currentSlide + visibleItems ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                      }}
                    >
                      {/* 제목 */}
                      <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">
                        {review.title}
                      </h3>
                      
                      {/* 내용 미리보기 */}
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-4">
                        {review.content}
                      </p>
                      
                      {/* 별점 - 이름 위로 이동 */}
                      <div className="flex items-center mb-2">
                        {renderStars(review.rating || 5)}
                      </div>
              
                      {/* 작성자 정보 */}
                      <div className="text-sm text-gray-500">
                        <div className="font-medium">{review.author}</div>
                        <div>{review.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 네비게이션 화살표 */}
            {reviews.length > visibleItems && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-3 shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 z-10"
                  disabled={effectiveCurrentSlide === 0}
                >
                  <svg className="w-6 h-6 text-gray-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-3 shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 z-10"
                  disabled={effectiveCurrentSlide >= maxSlides}
                >
                  <svg className="w-6 h-6 text-gray-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* 페이지 인디케이터 */}
            {reviews.length > visibleItems && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: maxSlides + 1 }, (_, index) => {
                  const isCurrent = index === effectiveCurrentSlide;
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 transform hover:scale-125 ${
                        isCurrent
                          ? 'bg-blue-500 scale-125 shadow-md' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* 더보기 버튼 */}
          <div className="text-center mt-12">
            <button
              onClick={() => window.location.href = '/reviews'}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              더 많은 후기 보기 →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
