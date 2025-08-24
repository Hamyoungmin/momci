'use client';

import { useState } from 'react';

export default function SuccessStories() {
  const [activeTab, setActiveTab] = useState(0);

  const successStories = [
    {
      category: '언어치료',
      icon: '🗨️',
      cases: [
        {
          title: '4세 아이의 발음 개선 성공사례',
          childAge: '4세',
          problem: '발음 불명확, 어휘력 부족',
          solution: '체계적 발음 교정 + 놀이 중심 어휘 확장',
          result: '3개월 후 80% 이상 명확한 발음, 어휘력 2배 증가',
          duration: '3개월',
          teacher: '김○○ 언어치료사 (10년 경력)',
          rating: 5,
          parentReview: '아이가 집에서도 자신감 있게 말하게 되었어요. 선생님의 체계적인 지도 덕분입니다.',
          method: '선생님께 요청하기'
        },
        {
          title: '6세 아이의 언어 발달 지연 극복',
          childAge: '6세',
          problem: '또래 대비 언어 발달 지연',
          solution: '개별 맞춤 프로그램 + 가정 연계 지도',
          result: '6개월 후 또래 수준 언어 능력 회복',
          duration: '6개월',
          teacher: '박○○ 언어치료사 (8년 경력)',
          rating: 5,
          parentReview: '선생님의 세심한 관찰과 맞춤 지도로 아이가 많이 발전했어요.',
          method: '선생님 둘러보기'
        }
      ]
    },
    {
      category: '놀이치료',
      icon: '👶',
      cases: [
        {
          title: '5세 아이의 사회성 향상 사례',
          childAge: '5세',
          problem: '내성적 성격, 또래 관계 어려움',
          solution: '그룹 놀이 활동 + 사회성 기술 훈련',
          result: '4개월 후 적극적인 또래 교류, 자신감 향상',
          duration: '4개월',
          teacher: '이○○ 놀이치료사 (12년 경력)',
          rating: 5,
          parentReview: '아이가 친구들과 잘 어울리게 되어서 너무 기뻐요.',
          method: '선생님께 요청하기'
        },
        {
          title: '7세 아이의 정서 안정 회복',
          childAge: '7세',
          problem: '불안감, 분리불안',
          solution: '감정 표현 놀이 + 안정감 강화 활동',
          result: '3개월 후 불안감 현저히 감소, 독립성 향상',
          duration: '3개월',
          teacher: '최○○ 놀이치료사 (9년 경력)',
          rating: 5,
          parentReview: '아이가 훨씬 안정되고 밝아졌어요. 정말 감사합니다.',
          method: '선생님 둘러보기'
        }
      ]
    },
    {
      category: '감각통합',
      icon: '🧠',
      cases: [
        {
          title: '6세 아이의 집중력 향상 성공',
          childAge: '6세',
          problem: '주의산만, 과잉행동',
          solution: '감각 조절 훈련 + 집중력 강화 프로그램',
          result: '5개월 후 집중 시간 3배 증가, 학습 태도 개선',
          duration: '5개월',
          teacher: '정○○ 작업치료사 (11년 경력)',
          rating: 5,
          parentReview: '학교에서도 집중력이 좋아졌다고 선생님이 칭찬해주세요.',
          method: '선생님께 요청하기'
        }
      ]
    }
  ];

  const statistics = [
    {
      icon: '📈',
      title: '매칭 성공률',
      value: '98.2%',
      description: '매칭된 가정의 만족도'
    },
    {
      icon: '⏱️',
      title: '평균 개선 기간',
      value: '3.5개월',
      description: '눈에 띄는 개선까지'
    },
    {
      icon: '🔄',
      title: '재이용률',
      value: '94%',
      description: '다시 이용하는 비율'
    },
    {
      icon: '⭐',
      title: '평균 만족도',
      value: '4.8점',
      description: '5점 만점 기준'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            성공 사례
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            더모든 키즈를 통해 좋은 선생님을 만나<br />
            아이가 건강하게 성장한 실제 사례들을 확인해보세요
          </p>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="font-semibold text-gray-700 mb-1">{stat.title}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* 카테고리 탭 */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-xl p-2">
            <div className="flex space-x-2">
              {successStories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === index
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category.icon} {category.category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 선택된 카테고리의 사례들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {successStories[activeTab].cases.map((caseItem, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8">
              {/* 사례 헤더 */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{caseItem.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>👶 {caseItem.childAge}</span>
                    <span>⏱️ {caseItem.duration}</span>
                    <span>📍 {caseItem.method}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(caseItem.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
              </div>

              {/* 문제 상황 */}
              <div className="mb-4">
                <h4 className="font-semibold text-red-600 mb-2">😟 문제 상황</h4>
                <p className="text-gray-700 text-sm">{caseItem.problem}</p>
              </div>

              {/* 해결 방법 */}
              <div className="mb-4">
                <h4 className="font-semibold text-blue-600 mb-2">💡 해결 방법</h4>
                <p className="text-gray-700 text-sm">{caseItem.solution}</p>
              </div>

              {/* 결과 */}
              <div className="mb-6">
                <h4 className="font-semibold text-green-600 mb-2">✅ 결과</h4>
                <p className="text-gray-700 text-sm">{caseItem.result}</p>
              </div>

              {/* 담당 선생님 */}
              <div className="mb-4">
                <h4 className="font-semibold text-purple-600 mb-2">👩‍⚕️ 담당 선생님</h4>
                <p className="text-gray-700 text-sm">{caseItem.teacher}</p>
              </div>

              {/* 학부모 후기 */}
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">💬 학부모 후기</h4>
                <p className="text-gray-700 text-sm italic">"{caseItem.parentReview}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* 매칭 방법별 성공률 */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-orange-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold text-center mb-8">
              매칭 방법별 성공률
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📝</div>
                <h4 className="text-xl font-bold mb-2">선생님께 요청하기</h4>
                <div className="text-3xl font-bold text-yellow-300 mb-2">97.8%</div>
                <p className="text-sm opacity-90">맞춤형 매칭으로 높은 만족도</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👀</div>
                <h4 className="text-xl font-bold mb-2">선생님 둘러보기</h4>
                <div className="text-3xl font-bold text-yellow-300 mb-2">98.5%</div>
                <p className="text-sm opacity-90">능동적 선택으로 더 높은 만족도</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              우리 아이도 성공 사례의 주인공이 될 수 있어요!
            </h3>
            <p className="text-gray-600 mb-6">
              더모든 키즈의 검증된 전문가들과 함께<br />
              아이의 밝은 미래를 만들어가세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/request"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                📝 요청글 작성하기
              </a>
              <a
                href="/browse"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                👀 선생님 둘러보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
