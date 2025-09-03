'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 치료사 타입 정의
interface Teacher {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviewCount: number;
  experience: string;
  hourlyRate: number;
  profileImage?: string;
  specialties: string[];
  location: string;
  introduction: string;
  education: string;
  certificates: string[];
  isOnline: boolean;
  responseTime: string;
  availability: string;
  createdAt: any;
}

export default function TeacherProfiles() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Firebase에서 치료사 데이터 실시간으로 가져오기
  useEffect(() => {
    console.log('🔍 Firebase에서 치료사 프로필 데이터 가져오기 시작...');
    
    const q = query(
      collection(db, 'therapistProfiles'),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('📥 치료사 프로필 스냅샷 받음:', snapshot.size, '개의 문서');
      
      const teacherProfiles: Teacher[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log('📄 치료사 데이터:', { id: doc.id, ...data });
        
        teacherProfiles.push({
          id: doc.id,
          name: data.name || '치료사',
          title: `${data.experience || '0'}년차 ${data.specialty || '치료사'}`,
          rating: data.rating || 4.8,
          reviewCount: data.reviewCount || 0,
          experience: data.experience || '0년',
          hourlyRate: data.hourlyRate || 65000,
          profileImage: data.profileImage,
          specialties: data.specialties || [data.specialty || '치료'],
          location: data.location || '서울',
          introduction: data.introduction || '전문적인 치료 서비스를 제공합니다.',
          education: data.education || '관련 학과 졸업',
          certificates: data.certificates || ['자격증'],
          isOnline: data.isOnline || true,
          responseTime: data.responseTime || '평균 2시간 이내',
          availability: data.availability || '평일/주말 상담 가능',
          createdAt: data.createdAt
        });
      });
      
      console.log('✅ 최종 치료사 프로필 배열:', teacherProfiles);
      setTeachers(teacherProfiles);
      setLoading(false);
    }, (error) => {
      console.error('❌ 치료사 프로필 가져오기 오류:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">검증된 전문 치료사</h2>
            <p className="text-gray-600 mt-1">
              {loading ? '치료사 정보를 불러오는 중...' : `총 ${teachers.length}명의 선생님이 등록되어 있습니다`}
            </p>
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

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500">치료사 정보를 불러오는 중...</div>
          </div>
        )}

        {/* 치료사 목록 */}
        {!loading && (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-6'
          }>
            {teachers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500 col-span-full">
                등록된 치료사가 없습니다.
              </div>
            ) : (
              teachers.map((teacher) => (
            <div key={teacher.id} className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 ${
              viewMode === 'list' 
                ? 'border-2 border-blue-100 hover:border-blue-200 p-6' 
                : 'border border-blue-500 p-6'
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
                // 리스트 뷰 - 새로운 치료사 프로필 카드 디자인
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                  {/* 프로필 이미지 */}
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                      <div className="text-center">
                        <span className="text-gray-500 text-xs font-medium block">프로필</span>
                        <span className="text-gray-400 text-xs block">사진</span>
                      </div>
                  </div>
                  
                    {/* 치료사 정보 */}
                  <div className="flex-1">
                      {/* 치료사 이름과 경력 */}
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {teacher.name} 치료사
                        </h3>
                        <span className="text-sm text-gray-600">
                          ({teacher.experience}차 {teacher.specialties[0]}사)
                          </span>
                        </div>
                        
                      {/* 별점과 후기 */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          <span className="text-orange-400 text-lg">★</span>
                          <span className="text-sm font-medium ml-1">{teacher.rating}</span>
                          <span className="text-xs text-gray-500 ml-1">(후기 {teacher.reviewCount}개)</span>
                        </div>
                      </div>
                      
                      {/* 치료분야 태그 */}
                      <div className="flex items-center space-x-2 mb-3">
                        {teacher.specialties.slice(0, 3).map((specialty, index) => (
                          <span key={index} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            index === 0 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : index === 1 
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-green-50 text-green-700 border border-green-200'
                          }`}>
                            #{specialty}
                            </span>
                          ))}
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                          #{teacher.location.split(' ')[1] || teacher.location}
                        </span>
                        </div>
                        
                      {/* 가격 정보 */}
                      <div className="text-xl font-bold text-blue-600 mb-4">
                        회기당 {teacher.hourlyRate.toLocaleString()}원
                      </div>
                      
                      {/* 구분선 */}
                      <div className="border-t border-gray-200 pt-3 mb-3"></div>
                      
                      {/* 인증 정보 - 체크마크 스타일 */}
                      <div className="flex items-center space-x-4">
                        {teacher.certificates.slice(0, 3).map((cert, index) => (
                          <div key={index} className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-sm text-gray-700">
                              {cert.includes('자격') || cert.includes('면허') ? '자격증' :
                               cert.includes('경력') || cert.includes('인증') ? '경력증명' :
                               '신분증확인서'}
                            </span>
                          </div>
                        ))}
                        <span className="text-gray-400 text-xs">보험가입</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-blue-600 text-sm">★</span>
                          <span className="text-sm text-blue-600">더많은 인증</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 오른쪽: 채팅 버튼 */}
                  <div className="flex flex-col items-end space-y-3 ml-6">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors shadow-sm">
                          1:1 채팅
                        </button>
                    
                    <div className="text-right">
                      {/* 상세 프로필 보기 텍스트 스타일 변경 */}
                      <div className="text-xs text-gray-500 mb-1">
                        상세 프로필 보기 &gt;
                      </div>
                      
                      {/* 응답 시간 */}
                      <div className="text-xs text-gray-400">
                        {teacher.responseTime}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
                ))
              )}
          </div>
        )}

        {/* 페이지네이션 */}
        {!loading && teachers.length > 0 && (
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
        )}
      </div>
    </section>
  );
}
