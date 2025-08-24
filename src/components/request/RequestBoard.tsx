'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RequestBoard() {
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const regions = ['전체', '서울', '경기', '인천', '대전', '대구', '부산', '광주', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
  
  const categories = [
    '전체',
    '홈티치료사 인력매칭',
    '월급제치료사 인력매칭',
    '월급치료사 인력매칭',
    '임시치료사 인력매칭'
  ];

  // 샘플 게시글 데이터
  const requestPosts = [
    {
      id: 1,
      title: '0세 3개월 남 주1회 물리/운동치료사 홈티 모집',
      content: '뇌성마비로 인한 운동발달 지연이 있는 아이입니다. 물리치료 경험이 풍부한 선생님을 찾고 있어요.',
      author: '김○○',
      region: '서울 강서구',
      category: '물리/운동치료',
      createdAt: '2024.01.20',
      applicants: 5,
      status: '모집중',
      budget: '회당 65,000원',
      schedule: '토,일 09:00~19:00',
      age: '0세 3개월',
      isUrgent: true
    },
    {
      id: 2,
      title: '4세 여아 언어치료 선생님 구합니다',
      content: '말이 늦고 발음이 부정확한 아이입니다. 아이와 잘 소통할 수 있는 경험 많은 선생님 부탁드려요.',
      author: '박○○',
      region: '경기 수원시',
      category: '언어치료',
      createdAt: '2024.01.19',
      applicants: 8,
      status: '모집중',
      budget: '회당 55,000원',
      schedule: '주 2회, 평일 오후',
      age: '4세',
      isUrgent: false
    },
    {
      id: 3,
      title: '6세 남아 놀이치료 및 사회성 향상 도움 요청',
      content: '내성적이고 또래 관계에 어려움이 있어요. 놀이를 통해 사회성을 키워줄 선생님을 찾습니다.',
      author: '이○○',
      region: '서울 강남구',
      category: '놀이치료',
      createdAt: '2024.01.18',
      applicants: 12,
      status: '모집중',
      budget: '회당 60,000원',
      schedule: '주 1회, 주말',
      age: '6세',
      isUrgent: false
    },
    {
      id: 4,
      title: '5세 쌍둥이 감각통합치료 선생님 모집',
      content: '감각에 예민한 쌍둥이 아이들입니다. 쌍둥이 지도 경험이 있는 선생님 우대합니다.',
      author: '최○○',
      region: '인천 남동구',
      category: '감각통합치료',
      createdAt: '2024.01.17',
      applicants: 3,
      status: '모집중',
      budget: '회당 70,000원',
      schedule: '주 2회, 평일',
      age: '5세 쌍둥이',
      isUrgent: true
    },
    {
      id: 5,
      title: '7세 남아 ABA 치료 전문가 찾습니다',
      content: '자폐스펙트럼 진단을 받은 아이입니다. ABA 치료 경험이 풍부한 전문가를 찾고 있어요.',
      author: '정○○',
      region: '대전 유성구',
      category: 'ABA 치료',
      createdAt: '2024.01.16',
      applicants: 2,
      status: '모집중',
      budget: '회당 80,000원',
      schedule: '주 3회, 평일 오전',
      age: '7세',
      isUrgent: false
    }
  ];

  const filteredPosts = requestPosts.filter(post => {
    const regionMatch = selectedRegion === '전체' || post.region.includes(selectedRegion);
    const categoryMatch = selectedCategory === '전체' || post.category.includes(selectedCategory.replace('인력매칭', ''));
    return regionMatch && categoryMatch;
  });

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 브레드크럼 */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600">홈</Link>
          <span>{'>'}</span>
          <Link href="/matching" className="hover:text-blue-600">홈티매칭</Link>
          <span>{'>'}</span>
          <span className="text-gray-900 font-medium">선생님께 요청하기</span>
        </div>

        {/* 헤더 */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">선생님께 요청하기</h1>
            <p className="text-gray-600">원하는 조건을 작성하여 적합한 선생님들의 지원을 받아보세요</p>
          </div>
          <Link
            href="/request/create"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors mt-4 lg:mt-0"
          >
            📝 요청글 작성하기
          </Link>
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 지역 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* 게시글 헤더 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {post.isUrgent && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">긴급</span>
                      )}
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-sm">{post.region}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">{post.content}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      post.status === '모집중' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </div>
                  </div>
                </div>

                {/* 게시글 정보 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">대상:</span>
                    <span className="font-medium ml-1">{post.age}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">예산:</span>
                    <span className="font-medium ml-1">{post.budget}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">일정:</span>
                    <span className="font-medium ml-1">{post.schedule}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">지원자:</span>
                    <span className="font-medium ml-1 text-blue-600">{post.applicants}명</span>
                  </div>
                </div>

                {/* 게시글 하단 */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>작성자: {post.author}</span>
                    <span>작성일: {post.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      상세보기
                    </button>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      지원하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50">
              이전
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded-lg ${
                  page === 1
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50">
              다음
            </button>
          </div>
        </div>

        {/* 통계 정보 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">1,247</div>
            <div className="text-gray-600">총 요청글 수</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">98%</div>
            <div className="text-gray-600">매칭 성공률</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">24시간</div>
            <div className="text-gray-600">평균 응답 시간</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">4.8점</div>
            <div className="text-gray-600">평균 만족도</div>
          </div>
        </div>
      </div>
    </section>
  );
}
