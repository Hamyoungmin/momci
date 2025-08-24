'use client';

import { useState } from 'react';

export default function ReviewsList() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  
  const categories = ['전체', '언어치료', '놀이치료', '감각통합치료', '작업치료', 'ABA치료', '미술치료', '음악치료'];

  const reviews = [
    {
      id: 1,
      title: "놀기만 도아니, 선생님께서 책임감이 주처럼 처음을 뵙겠 그렇고야!",
      content: "아이가 기연에서 늘을 밖이 기현이 학원에 돌렸지 전혜에 희원으로 기현에서 치료에서네에도 정말 많은 도움을 받았습니다. 선생님이 아이의 특성을 잘 파악해주시고 맞춤형 치료를 해주셔서 아이가 많이 나아졌어요.",
      rating: 5,
      author: "김○○ 학부모",
      category: "놀이치료",
      therapist: "박○○ 치료사",
      date: "2024-01-15",
      helpfulCount: 23
    },
    {
      id: 2,
      title: "선생님들도 보고 선행복후 갑이 좋습시다!",
      content: "치료사 선타타의 어허에서 고군 맛을 볼 수 있어도 밥이... 정말 전문적이시고 아이가 좋아해요. 매주 기다리는 수업이 되었습니다.",
      rating: 5,
      author: "이○○ 학부모",
      category: "언어치료",
      therapist: "최○○ 치료사",
      date: "2024-01-12",
      helpfulCount: 18
    },
    {
      id: 3,
      title: "짧은 한 소개팬주서서 감사드립니다~",
      content: "선생님이과 좋아하는 친환한 선생님예위... 아이가 처음에는 낯가림이 심했는데 금세 적응하고 즐겁게 치료받고 있어요.",
      rating: 5,
      author: "박○○ 학부모",
      category: "감각통합치료",
      therapist: "정○○ 치료사",
      date: "2024-01-10",
      helpfulCount: 31
    },
    {
      id: 4,
      title: "체계적인 ABA 프로그램으로 많은 변화가 있었어요",
      content: "자폐스펙트럼 진단을 받은 아이인데, 선생님의 전문적인 ABA 치료로 문제행동이 많이 줄어들고 소통 능력이 향상되었습니다. 데이터 기반으로 체계적으로 접근해주셔서 믿음이 갑니다.",
      rating: 5,
      author: "장○○ 학부모",
      category: "ABA치료",
      therapist: "김○○ 치료사",
      date: "2024-01-08",
      helpfulCount: 27
    },
    {
      id: 5,
      title: "미술을 통해 아이의 마음을 열어주신 선생님",
      content: "내성적이던 아이가 미술치료를 통해 자신의 감정을 표현하는 법을 배웠어요. 선생님이 아이의 작품을 통해 심리상태를 잘 파악해주시고 적절한 지도를 해주십니다.",
      rating: 4,
      author: "윤○○ 학부모",
      category: "미술치료",
      therapist: "서○○ 치료사",
      date: "2024-01-05",
      helpfulCount: 15
    },
    {
      id: 6,
      title: "작업치료로 일상생활 능력이 많이 향상되었어요",
      content: "소근육 발달이 늦었던 아이인데, 선생님의 전문적인 작업치료 덕분에 젓가락 사용, 글쓰기 등 일상생활에 필요한 기능들이 크게 향상되었습니다.",
      rating: 5,
      author: "한○○ 학부모",
      category: "작업치료",
      therapist: "이○○ 치료사",
      date: "2024-01-03",
      helpfulCount: 22
    }
  ];

  const filteredReviews = selectedCategory === '전체' 
    ? reviews 
    : reviews.filter(review => review.category === selectedCategory);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            실제 이용자 후기
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            더모든 키즈를 통해 만난 전문 치료사들과의 경험을 생생하게 들어보세요
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 후기 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white border-2 border-blue-500 rounded-xl p-6 hover:shadow-lg transition-shadow">
              {/* 카테고리 태그 */}
              <div className="flex items-center justify-between mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {review.category}
                </span>
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              {/* 제목 */}
              <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                {review.title}
              </h3>
              
              {/* 내용 */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                {review.content}
              </p>
              
              {/* 치료사 정보 */}
              <div className="text-sm text-blue-600 mb-3">
                👩‍⚕️ {review.therapist}
              </div>
              
              {/* 하단 정보 */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  <div>{review.author}</div>
                  <div>{review.date}</div>
                </div>
                <div className="flex items-center space-x-1">
                  <span>👍</span>
                  <span>{review.helpfulCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 더보기 버튼 */}
        <div className="text-center mt-12">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            더 많은 후기 보기
          </button>
        </div>

        {/* 후기 작성 안내 */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            소중한 후기를 남겨주세요
          </h3>
          <p className="text-gray-600 mb-6">
            치료가 완료된 후 1달 뒤부터 후기 작성이 가능합니다.<br />
            다른 학부모님들에게 도움이 되는 솔직한 후기를 남겨주시면 감사하겠습니다.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            후기 작성하기
          </button>
        </div>
      </div>
    </section>
  );
}
