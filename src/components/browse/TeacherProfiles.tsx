'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

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

  // 선생님에게 요청하기 모달 상태
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // 새 게시글 작성용 상태
  const [newPost, setNewPost] = useState({
    treatment: '',
    region: '',
    detailLocation: '',
    age: '',
    gender: '',
    frequency: '',
    timeDetails: '',
    price: '',
    additionalInfo: ''
  });

  // Firebase에서 치료사 데이터 실시간으로 가져오기
  useEffect(() => {
    console.log('🔍 Firebase에서 치료사 프로필 데이터 가져오기 시작...');
    
    // 임시로 status 조건 제거해서 모든 치료사 프로필 가져오기 (테스트용)
    const q = query(
      collection(db, 'therapistProfiles'),
      // where('status', '==', 'approved'), // 임시 주석
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
      
            // Firebase에서 가져온 실제 데이터만 사용
      setTeachers(teacherProfiles);
      setLoading(false);
    }, (error) => {
      console.error('❌ 치료사 프로필 가져오기 오류:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 모달 닫기 함수 (애니메이션 포함)
  const closeRequestModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setIsModalClosing(false);
      setSelectedTeacher(null);
      // 폼 초기화
      setNewPost({
        treatment: '',
        region: '',
        detailLocation: '',
        age: '',
        gender: '',
        frequency: '',
        timeDetails: '',
        price: '',
        additionalInfo: ''
      });
    }, 300); // 애니메이션 시간과 맞춤
  };

  // 선생님에게 요청하기 모달 열기 (특정 선생님 지정)
  const openRequestModal = (teacher?: Teacher) => {
    if (teacher) {
      setSelectedTeacher(teacher);
    } else {
      setSelectedTeacher(null); // 일반 게시글 작성
    }
    setShowRequestModal(true);
  };

  // 새 게시글 Firebase에 저장
  const addNewPost = async (postData: typeof newPost) => {
    try {
      // 강화된 인증 확인
      if (!auth.currentUser) {
        alert('로그인이 필요합니다.');
        return;
      }

      const newTitle = `${postData.age} ${postData.gender} ${postData.frequency} 홈티`;
      
      // 전송할 데이터 준비
      const postDataToSend = {
        treatment: postData.treatment,
        region: postData.region || '서울',
        age: postData.age,
        gender: postData.gender,
        frequency: postData.frequency,
        timeDetails: postData.timeDetails,
        price: postData.price,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        status: 'active',
        applications: 0,
        // 추가 정보들
        title: newTitle,
        category: postData.detailLocation || postData.region,
        details: postData.timeDetails,
        additionalInfo: postData.additionalInfo || '',
        // 선택한 치료사 정보 추가
        preferredTeacherId: selectedTeacher?.id,
        preferredTeacherName: selectedTeacher?.name
      };

      console.log('📤 전송할 데이터:', postDataToSend);
      
      const docRef = await addDoc(collection(db, 'posts'), postDataToSend);
      
      console.log('✅ 요청이 성공적으로 등록되었습니다. ID: ', docRef.id);
      
      // 성공 알림
      alert('요청이 성공적으로 전송되었습니다!\n게시판에서 확인하실 수 있습니다.');
      
      // 모달 닫기
      closeRequestModal();
      
      // 실시간 업데이트는 게시판의 onSnapshot에 의해 자동으로 처리됨
    } catch (error) {
      console.error('Error adding document: ', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      alert('요청 전송 중 오류가 발생했습니다: ' + errorMessage);
    }
  };

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // 요청 모달 외부 클릭 시 모달 닫기
      if (showRequestModal && !target.closest('.request-modal')) {
        closeRequestModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRequestModal]);

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
          
          <div className="flex items-center space-x-4">
            {/* 새 게시글 작성 버튼 */}
            <button
              onClick={() => setShowRequestModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              선생님 둘러보기
            </button>
          
          {/* 보기 모드 선택 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
            </button>
          </div>
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
                  <button 
                    onClick={() => openRequestModal(teacher)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-2xl font-medium transition-colors"
                  >
                    선생님에게 요청하기
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
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
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
                  
                  {/* 오른쪽: 요청하기 버튼 */}
                  <div className="flex flex-col items-end space-y-3 ml-6">
                    <button 
                      onClick={() => openRequestModal(teacher)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors shadow-sm"
                    >
                      선생님에게 요청하기
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
        )}
      </div>

      {/* 선생님에게 요청하기 모달 */}
      {showRequestModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className={`bg-white rounded-lg p-8 max-w-6xl w-[95vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto request-modal ${isModalClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedTeacher ? `${selectedTeacher.name} 선생님에게 요청하기` : '선생님 둘러보기'}
              </h2>
              <button
                onClick={closeRequestModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              addNewPost(newPost);
            }} className="space-y-6">
              {/* 재활 프로그램 | 나이 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">재활 프로그램</label>
                  <select
                    value={newPost.treatment}
                    onChange={(e) => setNewPost(prev => ({ ...prev, treatment: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">재활 프로그램을 선택하세요</option>
                    <option value="언어치료">언어치료</option>
                    <option value="놀이치료">놀이치료</option>
                    <option value="감각통합치료">감각통합치료</option>
                    <option value="인지학습치료">인지학습치료</option>
                    <option value="작업치료">작업치료</option>
                    <option value="물리치료">물리치료</option>
                    <option value="ABA치료">ABA치료</option>
                    <option value="음악치료">음악치료</option>
                    <option value="미술치료">미술치료</option>
                    <option value="특수체육">특수체육</option>
                    <option value="특수교사">특수교사</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">나이</label>
                  <input
                    type="text"
                    value={newPost.age}
                    onChange={(e) => setNewPost(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="예: 초1, 5세"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* 성별 | 희망 횟수 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                  <select
                    value={newPost.gender}
                    onChange={(e) => setNewPost(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">성별 선택</option>
                    <option value="남">남</option>
                    <option value="여">여</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">희망 횟수</label>
                  <input
                    type="text"
                    value={newPost.frequency}
                    onChange={(e) => setNewPost(prev => ({ ...prev, frequency: e.target.value }))}
                    placeholder="예: 주2회"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* 희망 시간 | 회당 희망 금액 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">희망 시간</label>
                  <input
                    type="text"
                    value={newPost.timeDetails}
                    onChange={(e) => setNewPost(prev => ({ ...prev, timeDetails: e.target.value }))}
                    placeholder="예: 월,수 5시~6시"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">회당 희망 금액</label>
                  <input
                    type="text"
                    value={newPost.price}
                    onChange={(e) => setNewPost(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="예: 50,000원"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* 지역 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
                <select
                  value={newPost.region}
                  onChange={(e) => setNewPost(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">지역을 선택하세요</option>
                  <option value="서울">서울</option>
                  <option value="인천/경기북부">인천/경기북부</option>
                  <option value="경기남부">경기남부</option>
                  <option value="충청,강원,대전">충청,강원,대전</option>
                  <option value="전라,경상,부산">전라,경상,부산</option>
                </select>
              </div>

              {/* 세부내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">세부내용</label>
                <textarea
                  value={newPost.additionalInfo}
                  onChange={(e) => setNewPost(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder={`홈티위치 : 사명역, 교대역 인근
치료정보 : 주1회 언어치료
희망시간 : 월2~5시, 화,목 7시~, 토 1~2시, 6시~, 일 전체
아동정보 : 조음장애진단으로 조음치료 경험(1년전 종결)있으나 다시 발음이 뭉개짐

* 치료가능한 요일과 시간을 댓글로 작성해주시면 접수됩니다.
* 지원자는 비공개 익명으로 표기되며, 본인만 확인하실 수 있습니다.`}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* 미리보기 */}
              {newPost.treatment && newPost.age && newPost.gender && newPost.frequency && newPost.timeDetails && newPost.price && (
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">게시글 미리보기:</h3>
                  <div className="text-blue-700 font-medium grid grid-cols-2 gap-4">
                    <div>
                      <p><strong>재활 프로그램:</strong> {newPost.treatment}</p>
                      <p><strong>성별:</strong> {newPost.gender}</p>
                      <p><strong>희망 시간:</strong> {newPost.timeDetails}</p>
                    </div>
                    <div>
                      <p><strong>나이:</strong> {newPost.age}</p>
                      <p><strong>희망 횟수:</strong> {newPost.frequency}</p>
                      <p><strong>회당 희망 금액:</strong> {newPost.price}</p>
                    </div>
                    <div className="col-span-2">
                      <p><strong>제목:</strong> {newPost.age} {newPost.gender} {newPost.frequency} 홈티</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 버튼 */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={closeRequestModal}
                  className="px-6 py-3 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
                >
                  홈티지원하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
