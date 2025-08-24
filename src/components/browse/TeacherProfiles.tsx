'use client';

import { useState } from 'react';

export default function TeacherProfiles() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 샘플 치료사 데이터
  const teachers = [
    {
      id: 1,
      name: '김○○',
      title: '7년차 언어재활사',
      rating: 4.8,
      reviewCount: 13,
      experience: '7년',
      hourlyRate: 65000,
      profileImage: null,
      specialties: ['놀이치료', '감각통합', '언어발달원활화', '인증관련'],
      location: '서울 강남구',
      introduction: '아이들과의 소통을 중시하며, 개별 맞춤형 프로그램으로 언어 발달을 도와드립니다.',
      education: '○○대학교 언어병리학과 졸업',
      certificates: ['언어재활사 1급', '발음교정 전문가'],
      isOnline: true,
      responseTime: '평균 2시간 이내',
      availability: '평일 오후, 주말 가능'
    },
    {
      id: 2,
      name: '박○○',
      title: '5년차 놀이치료사',
      rating: 4.9,
      reviewCount: 21,
      experience: '5년',
      hourlyRate: 55000,
      profileImage: null,
      specialties: ['놀이치료', '정서치료', '사회성향상'],
      location: '경기 수원시',
      introduction: '놀이를 통해 아이의 정서적 안정과 사회성 발달을 도와드리겠습니다.',
      education: '○○대학교 아동학과 졸업',
      certificates: ['놀이치료사 자격증', '아동상담사'],
      isOnline: false,
      responseTime: '평균 4시간 이내',
      availability: '평일 오전, 주말 오후'
    },
    {
      id: 3,
      name: '이○○',
      title: '10년차 작업치료사',
      rating: 4.7,
      reviewCount: 34,
      experience: '10년',
      hourlyRate: 70000,
      profileImage: null,
      specialties: ['감각통합치료', '작업치료', '미세운동'],
      location: '서울 서초구',
      introduction: '체계적인 감각통합 프로그램으로 아이의 일상생활 능력 향상을 목표로 합니다.',
      education: '○○대학교 작업치료학과 졸업',
      certificates: ['작업치료사 면허', '감각통합치료 전문가'],
      isOnline: true,
      responseTime: '평균 1시간 이내',
      availability: '평일/주말 모두 가능'
    },
    {
      id: 4,
      name: '최○○',
      title: '3년차 물리치료사',
      rating: 4.6,
      reviewCount: 8,
      experience: '3년',
      hourlyRate: 60000,
      profileImage: null,
      specialties: ['물리치료', '운동치료', '자세교정'],
      location: '인천 남동구',
      introduction: '운동 발달이 늦은 아이들의 신체 기능 향상을 전문으로 합니다.',
      education: '○○대학교 물리치료학과 졸업',
      certificates: ['물리치료사 면허', '소아발달 전문가'],
      isOnline: false,
      responseTime: '평균 6시간 이내',
      availability: '평일 오후만 가능'
    },
    {
      id: 5,
      name: '정○○',
      title: '8년차 ABA치료사',
      rating: 4.9,
      reviewCount: 17,
      experience: '8년',
      hourlyRate: 75000,
      profileImage: null,
      specialties: ['ABA치료', '행동수정', '자폐스펙트럼'],
      location: '대전 유성구',
      introduction: 'ABA 기법을 통해 자폐스펙트럼 아동의 행동 개선과 사회성 발달을 도와드립니다.',
      education: '○○대학교 특수교육학과 졸업',
      certificates: ['ABA 치료사', 'BCBA 자격증'],
      isOnline: true,
      responseTime: '평균 3시간 이내',
      availability: '평일 오전 선호'
    },
    {
      id: 6,
      name: '장○○',
      title: '4년차 미술치료사',
      rating: 4.8,
      reviewCount: 12,
      experience: '4년',
      hourlyRate: 50000,
      profileImage: null,
      specialties: ['미술치료', '정서치료', '창의성개발'],
      location: '부산 해운대구',
      introduction: '미술 활동을 통해 아이의 내면 표현과 정서적 안정을 도와드립니다.',
      education: '○○대학교 미술치료학과 졸업',
      certificates: ['미술치료사', '아동심리상담사'],
      isOnline: false,
      responseTime: '평균 5시간 이내',
      availability: '주말 위주'
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
                      <span key={index} className={`px-2 py-1 rounded text-xs ${
                        index < 2 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  {/* 위치 */}
                  <p className="text-gray-500 text-sm mb-4">📍 {teacher.location}</p>
                  
                  {/* 버튼 */}
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors">
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
                            <span key={index} className={`px-2 py-1 rounded text-xs ${
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
