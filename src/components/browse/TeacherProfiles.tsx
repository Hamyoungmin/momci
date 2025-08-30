'use client';

import { useState } from 'react';

export default function TeacherProfiles() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 실제 치료사 데이터
  const teachers = [
    {
      id: 1,
      name: '김민정',
      title: '12년차 언어재활사',
      rating: 4.9,
      reviewCount: 127,
      experience: '12년',
      hourlyRate: 80000,
      profileImage: null,
      specialties: ['언어치료', '조음장애', '유창성장애', '언어발달지연'],
      location: '서울 강남구',
      introduction: '연세대학교 언어병리학 석사 출신으로, 다양한 언어장애 아동들과 함께 성장해온 경험이 있습니다. 아이 개별 특성에 맞는 체계적인 치료 프로그램을 제공합니다.',
      education: '연세대학교 언어병리학과 석사 졸업',
      certificates: ['언어재활사 1급', '조음음운장애 전문가', '유창성장애 전문치료사'],
      isOnline: true,
      responseTime: '평균 1시간 이내',
      availability: '평일 오후 2-8시, 토요일 오전'
    },
    {
      id: 2,
      name: '박소영',
      title: '8년차 놀이치료사',
      rating: 4.8,
      reviewCount: 89,
      experience: '8년',
      hourlyRate: 70000,
      profileImage: null,
      specialties: ['놀이치료', '사회성치료', '정서치료', '애착문제'],
      location: '서울 서초구',
      introduction: '아이들의 마음을 놀이로 이해하고 소통합니다. 불안, 우울, 사회성 부족 등 다양한 정서적 어려움을 겪는 아이들과 함께 성장의 여정을 걸어가고 있습니다.',
      education: '이화여자대학교 아동학과 졸업',
      certificates: ['놀이치료사 1급', '가족놀이치료사', '모래놀이치료사'],
      isOnline: false,
      responseTime: '평균 2시간 이내',
      availability: '평일 오전 10-6시, 토요일 오후'
    },
    {
      id: 3,
      name: '이현우',
      title: '15년차 작업치료사',
      rating: 4.9,
      reviewCount: 156,
      experience: '15년',
      hourlyRate: 85000,
      profileImage: null,
      specialties: ['감각통합치료', '작업치료', '소근육발달', '시지각훈련'],
      location: '경기 성남시',
      introduction: '감각통합의 아버지 A.J Ayres의 이론을 바탕으로 아이들의 감각 처리 능력 향상에 집중합니다. 국제인증 감각통합치료사로서 전문적인 평가와 치료를 제공합니다.',
      education: '연세대학교 작업치료학과 졸업',
      certificates: ['작업치료사 면허', 'SIPT 국제인증', '감각통합치료 전문가'],
      isOnline: true,
      responseTime: '평균 30분 이내',
      availability: '평일/주말 모두 가능'
    },
    {
      id: 4,
      name: '최지은',
      title: '6년차 물리치료사',
      rating: 4.7,
      reviewCount: 73,
      experience: '6년',
      hourlyRate: 65000,
      profileImage: null,
      specialties: ['소아물리치료', '운동발달', '자세교정', '보바스치료'],
      location: '인천 남동구',
      introduction: '뇌성마비, 발달지연 등으로 운동발달에 어려움을 겪는 아이들의 기능 향상을 전문으로 합니다. NDT-Bobath 접근법을 통한 체계적인 치료를 제공합니다.',
      education: '삼육대학교 물리치료학과 졸업',
      certificates: ['물리치료사 면허', 'NDT-Bobath 인증', '소아발달 전문가'],
      isOnline: false,
      responseTime: '평균 3시간 이내',
      availability: '평일 오후 1-7시'
    },
    {
      id: 5,
      name: '정현석',
      title: '10년차 ABA치료사',
      rating: 4.8,
      reviewCount: 94,
      experience: '10년',
      hourlyRate: 90000,
      profileImage: null,
      specialties: ['ABA치료', '자폐스펙트럼', 'ADHD', '행동중재'],
      location: '서울 송파구',
      introduction: '자폐스펙트럼장애 및 발달장애 아동을 위한 응용행동분석(ABA) 전문가입니다. 미국에서 BCBA 자격을 취득하여 국제적 수준의 치료 서비스를 제공합니다.',
      education: '미국 UCLA 특수교육학 석사',
      certificates: ['BCBA 국제인증', 'ABA 전문치료사', 'VB-MAPP 인증'],
      isOnline: true,
      responseTime: '평균 1시간 이내',
      availability: '평일 저녁, 주말 전일 가능'
    },
    {
      id: 6,
      name: '한수진',
      title: '9년차 미술치료사',
      rating: 4.6,
      reviewCount: 68,
      experience: '9년',
      hourlyRate: 60000,
      profileImage: null,
      specialties: ['미술치료', '표현예술치료', '트라우마치료', '자존감향상'],
      location: '경기 고양시',
      introduction: '미술을 통해 말로 표현하기 어려운 아이들의 마음을 이해하고 치유합니다. 특히 트라우마나 정서적 어려움을 겪는 아이들과의 작업에 전문성을 가지고 있습니다.',
      education: '홍익대학교 미술치료학과 석사 졸업',
      certificates: ['미술치료사 1급', '표현예술치료사', '트라우마 전문상담사'],
      isOnline: false,
      responseTime: '평균 4시간 이내',
      availability: '평일 오전, 주말 오후'
    },
    {
      id: 7,
      name: '윤태영',
      title: '7년차 특수교사',
      rating: 4.7,
      reviewCount: 52,
      experience: '7년',
      hourlyRate: 55000,
      profileImage: null,
      specialties: ['학습지도', '인지능력향상', '기초학습', '개별교육'],
      location: '부산 해운대구',
      introduction: '학습에 어려움을 겪는 아이들을 위한 개별 맞춤 교육을 제공합니다. 아이의 강점을 발견하여 자신감을 기르고, 체계적인 학습 전략을 통해 학업 성취를 도와드립니다.',
      education: '부산대학교 특수교육과 졸업',
      certificates: ['특수교사 자격증', '학습치료사', '개별화교육 전문가'],
      isOnline: true,
      responseTime: '평균 2시간 이내',
      availability: '평일 방과후, 주말 가능'
    },
    {
      id: 8,
      name: '강민아',
      title: '5년차 인지학습치료사',
      rating: 4.5,
      reviewCount: 41,
      experience: '5년',
      hourlyRate: 50000,
      profileImage: null,
      specialties: ['인지학습치료', '주의집중', '기억력향상', '학습전략'],
      location: '대전 유성구',
      introduction: 'ADHD, 학습장애 등으로 학습에 어려움을 겪는 아이들의 인지능력 향상을 전문으로 합니다. 과학적 근거에 기반한 인지훈련 프로그램을 제공합니다.',
      education: '대전대학교 심리학과 졸업',
      certificates: ['인지학습치료사', '주의집중향상 전문가', '학습코칭 전문가'],
      isOnline: true,
      responseTime: '평균 3시간 이내',
      availability: '평일 오후 3-8시, 토요일'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">검증된 전문 치료사</h2>
            <p className="text-gray-600 mt-1">총 {teachers.length}명의 선생님이 등록되어 있습니다</p>
          </div>
          
          {/* 보기 모드 선택 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 치료사 목록 */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-6'
        }>
          {teachers.map((teacher) => (
            <div key={teacher.id} className={`bg-white border border-blue-500 rounded-xl shadow-sm hover:shadow-lg transition-shadow ${
              viewMode === 'list' ? 'p-6' : 'p-6'
            }`}>
              {viewMode === 'grid' ? (
                // 그리드 뷰
                <div className="text-center">
                  {/* 프로필 이미지 */}
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">👩‍⚕️</span>
                  </div>
                  
                  {/* 기본 정보 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{teacher.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{teacher.title}</p>
                  
                  {/* 평점 */}
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        {i < Math.floor(teacher.rating) ? '⭐' : '☆'}
                      </span>
                    ))}
                    <span className="text-sm text-gray-500 ml-1">
                      {teacher.rating} ({teacher.reviewCount}개)
                    </span>
                  </div>
                  
                  {/* 가격 */}
                  <div className="text-xl font-bold text-blue-600 mb-4">
                    시간당 {teacher.hourlyRate.toLocaleString()}원
                  </div>
                  
                  {/* 전문 분야 */}
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {teacher.specialties.slice(0, 3).map((specialty, index) => (
                      <span key={index} className={`px-2 py-1 rounded-full text-xs ${
                        index < 2 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  {/* 위치 */}
                  <p className="text-gray-500 text-sm mb-4">📍 {teacher.location}</p>
                  
                  {/* 버튼 */}
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-2xl font-medium transition-colors">
                    1:1 채팅
                  </button>
                </div>
              ) : (
                // 리스트 뷰
                <div className="flex items-start space-x-4">
                  {/* 프로필 이미지 */}
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👩‍⚕️</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{teacher.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{teacher.title}</p>
                        
                        {/* 평점 */}
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-sm">
                              {i < Math.floor(teacher.rating) ? '⭐' : '☆'}
                            </span>
                          ))}
                          <span className="text-sm text-gray-500 ml-1">
                            {teacher.rating} ({teacher.reviewCount}개)
                          </span>
                        </div>
                        
                        {/* 소개 */}
                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{teacher.introduction}</p>
                        
                        {/* 전문 분야 */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {teacher.specialties.map((specialty, index) => (
                            <span key={index} className={`px-2 py-1 rounded-full text-xs ${
                              index < 2 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {specialty}
                            </span>
                          ))}
                        </div>
                        
                        {/* 추가 정보 */}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>📍 {teacher.location}</span>
                          <span>💬 {teacher.responseTime}</span>
                          <span>⏰ {teacher.availability}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600 mb-2">
                          시간당 {teacher.hourlyRate.toLocaleString()}원
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          1:1 채팅
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                    ? 'bg-purple-500 text-white'
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
      </div>
    </section>
  );
}
