'use client';

import { useState } from 'react';

export default function ReviewsList() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  
  const categories = ['전체', '언어치료', '놀이치료', '감각통합치료', '작업치료', 'ABA치료', '미술치료', '음악치료'];

  const reviews = [
    {
      id: 1,
      title: "6개월 만에 아이가 완전히 달라졌어요!",
      content: "5세 아들이 조음장애로 또래 친구들과 소통에 어려움이 있었는데, 김민정 선생님의 체계적인 언어치료 덕분에 발음이 정확해지고 어휘력도 늘었습니다. 매주 진행사항을 상세히 피드백해주셔서 집에서도 연습할 수 있었어요. 정말 감사합니다!",
      rating: 5,
      author: "김미영 학부모",
      category: "언어치료",
      therapist: "김민정 치료사",
      date: "2024-01-20",
      helpfulCount: 89
    },
    {
      id: 2,
      title: "놀이치료를 통해 아이가 밝아졌어요",
      content: "분리불안이 심했던 7세 딸이 박소영 선생님의 놀이치료를 받으면서 점점 독립적으로 변하고 있습니다. 처음에는 엄마와 떨어지는 것조차 힘들어했는데, 이제는 스스로 선생님께 가서 인사하고 치료실에 들어가요. 아이의 마음을 잘 이해해주시는 전문가입니다.",
      rating: 5,
      author: "이수진 학부모",
      category: "놀이치료",
      therapist: "박소영 치료사",
      date: "2024-01-18",
      helpfulCount: 67
    },
    {
      id: 3,
      title: "감각통합치료의 전문성에 감동받았습니다",
      content: "4세 아들의 감각과민 문제로 고민이 많았는데, 이현우 선생님께서 정확한 평가를 통해 맞춤형 치료 계획을 세워주셨어요. SIPT 평가 결과도 자세히 설명해주시고, 가정에서 할 수 있는 활동들도 알려주셔서 정말 도움이 되었습니다. 15년 경력이 정말 느껴집니다.",
      rating: 5,
      author: "박현수 학부모",
      category: "감각통합치료",
      therapist: "이현우 치료사",
      date: "2024-01-15",
      helpfulCount: 94
    },
    {
      id: 4,
      title: "ABA 치료로 자폐스펙트럼 아이가 많이 발전했어요",
      content: "5세 아들이 자폐스펙트럼 진단을 받고 절망했었는데, 정현석 선생님의 체계적인 ABA 프로그램 덕분에 눈맞춤도 늘고 간단한 의사소통도 가능해졌습니다. BCBA 자격을 가진 전문가답게 데이터 기반으로 객관적인 평가를 해주시고, 매회 상세한 기록을 남겨주셔서 진전 상황을 명확히 알 수 있었어요.",
      rating: 5,
      author: "정유리 학부모",
      category: "ABA치료",
      therapist: "정현석 치료사",
      date: "2024-01-12",
      helpfulCount: 78
    },
    {
      id: 5,
      title: "미술치료로 아이의 내면이 치유되고 있어요",
      content: "내성적이고 자존감이 낮았던 6세 딸이 한수진 선생님의 미술치료를 받으면서 점점 자신감을 갖게 되었습니다. 그림을 통해 자신의 감정을 표현하는 법을 배우고, 완성작을 보며 성취감도 느끼고 있어요. 선생님이 아이의 작품을 통해 심리상태를 세심하게 파악해주시는 게 정말 놀랍습니다.",
      rating: 5,
      author: "윤정희 학부모",
      category: "미술치료",
      therapist: "한수진 치료사",
      date: "2024-01-10",
      helpfulCount: 52
    },
    {
      id: 6,
      title: "물리치료로 아이의 운동능력이 향상되었습니다",
      content: "뇌성마비가 있는 초1 딸의 보행 훈련을 위해 최지은 선생님께 치료를 받고 있습니다. NDT-Bobath 기법을 적용한 체계적인 치료로 자세가 안정되고 걸음걸이도 많이 좋아졌어요. 매번 아이의 상태를 꼼꼼히 체크하시고 부모 교육도 병행해주셔서 정말 감사합니다.",
      rating: 5,
      author: "최은영 학부모",
      category: "물리치료",
      therapist: "최지은 치료사",
      date: "2024-01-08",
      helpfulCount: 61
    },
    {
      id: 7,
      title: "작업치료로 일상생활이 가능해졌어요",
      content: "발달지연으로 소근육 발달이 늦었던 6세 아들이 이현우 선생님의 작업치료를 받으면서 젓가락 사용, 가위질, 단추 끼우기 등이 가능해졌습니다. 특히 글씨 쓰기에 어려움이 많았는데, 단계별로 차근차근 지도해주셔서 이제 자신의 이름도 쓸 수 있어요!",
      rating: 5,
      author: "한민철 학부모",
      category: "작업치료",
      therapist: "이현우 치료사",
      date: "2024-01-05",
      helpfulCount: 73
    },
    {
      id: 8,
      title: "특수교육으로 학습능력이 크게 향상되었습니다",
      content: "학습부진으로 고민이 많았던 초2 아들이 윤태영 선생님의 특수교육을 받으면서 읽기, 쓰기, 계산 능력이 눈에 띄게 좋아졌습니다. 아이의 학습 스타일을 정확히 파악하시고 개별화된 교육계획을 세워주셔서 자신감도 많이 생겼어요.",
      rating: 4,
      author: "김소라 학부모",
      category: "특수교육",
      therapist: "윤태영 교사",
      date: "2024-01-03",
      helpfulCount: 45
    },
    {
      id: 9,
      title: "인지학습치료로 ADHD 아이의 집중력이 개선됐어요",
      content: "ADHD 진단을 받은 초1 아들의 집중력 문제로 강민아 선생님께 인지학습치료를 받고 있습니다. 과학적 근거에 기반한 훈련 프로그램으로 주의집중 시간이 늘어나고 충동성도 많이 줄었어요. 학교 생활도 한결 수월해졌습니다.",
      rating: 5,
      author: "조현준 학부모",
      category: "인지학습치료",
      therapist: "강민아 치료사",
      date: "2024-01-01",
      helpfulCount: 38
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
