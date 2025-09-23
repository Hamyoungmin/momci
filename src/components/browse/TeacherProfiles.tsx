'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
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
  createdAt: Date | string | number;
  certified?: boolean;
  insured?: boolean;
}

export default function TeacherProfiles() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 이름에서 성만 추출하는 함수
  const getLastName = (fullName: string | undefined): string => {
    if (!fullName) return '익명';
    // 한글 이름인 경우 첫 글자가 성
    return fullName.charAt(0);
  };

  // 선생님에게 요청하기 모달 상태
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  
  // 프로필 등록 확인 팝업 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirmModalClosing, setIsConfirmModalClosing] = useState(false);
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

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      console.log('📥 치료사 프로필 스냅샷 받음:', snapshot.size, '개의 문서');
      
      const teacherProfiles: Teacher[] = [];
      for (const d of snapshot.docs) {
        const data = d.data();
        console.log('📄 치료사 데이터:', { id: d.id, ...data });

        // 🔒 구독 활성 여부 확인: user-subscription-status에서 활성/만료일 확인
        let showProfile = true;
        try {
          const subSnap = await getDoc(doc(db, 'user-subscription-status', d.id));
          if (subSnap.exists()) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const subData: any = subSnap.data();
            const expiryMs = subData?.expiryDate && typeof subData.expiryDate.toDate === 'function' ? subData.expiryDate.toDate().getTime() : 0;
            const active = !!subData?.hasActiveSubscription && expiryMs > Date.now();
            showProfile = active;
          } else {
            showProfile = false;
          }
        } catch {
          showProfile = false;
        }

        if (!showProfile) continue; // 미활성 치료사는 노출 제외

        teacherProfiles.push({
          id: d.id,
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
          createdAt: data.createdAt,
          certified: data.isVerified === true || data.certificationBadge === 'certified',
          insured: data.insured === true || data.hasInsurance === true
        });
      }
      
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

  // 프로필 등록 확인 팝업 열기
  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };

  // 프로필 등록 확인 팝업 닫기
  const closeConfirmModal = () => {
    setIsConfirmModalClosing(true);
    setTimeout(() => {
      setShowConfirmModal(false);
      setIsConfirmModalClosing(false);
    }, 300);
  };

  // 프로필 등록 확인 후 작성 모달 열기
  const handleConfirmRegister = () => {
    closeConfirmModal();
    // 확인 팝업이 닫힌 후 프로필 작성 모달 열기
    setTimeout(() => {
      setShowRequestModal(true);
    }, 300);
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

      const genderText = postData.gender === '남' ? '남아' : postData.gender === '여' ? '여아' : postData.gender;
      const newTitle = `${postData.age} ${genderText} ${postData.treatment} 홈티`;
      
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
        preferredTeacherName: selectedTeacher?.name,
        // 게시글 타입 구분 (선생님 둘러보기에서 특정 선생님에게 요청)
        type: 'teacher-request'
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
      
      // 확인 팝업 외부 클릭 시 팝업 닫기
      if (showConfirmModal && !target.closest('.confirm-modal')) {
        closeConfirmModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRequestModal, showConfirmModal]);

  return (
    <section className="py-12 bg-gray-50">
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
              onClick={openConfirmModal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              새 게시글 작성
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
        <div className="space-y-6">
            {teachers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
                등록된 치료사가 없습니다.
              </div>
            ) : (
              teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-6">
              {/* 게시글 카드 스타일로 변경 */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* 제목 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {getLastName(teacher.name)}00 치료사 <span className="text-gray-600">[{teacher.experience || 0}년차 {teacher.specialties[0]}]</span>
                  </h3>
                  
                  {/* 메타 정보 */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span>경력: {teacher.experience}</span>
                    <span>•</span>
                    <span>📍 {teacher.location}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      {teacher.reviewCount > 0 ? (
                        <>
                          <span className="text-orange-400 mr-1">★</span>
                          {teacher.rating} ({teacher.reviewCount}개 후기)
                        </>
                      ) : (
                        <span className="text-gray-500">후기 없음</span>
                      )}
                    </span>
                    {/* 보험가입 / 인증 배지 영역: 보험가입 오른쪽에 파란 별 */}
                    {teacher.insured && (
                      <span className="flex items-center">
                        <span className="px-2 py-0.5 rounded-full border text-xs bg-white text-gray-700 border-gray-300">보험가입</span>
                        {teacher.certified && (
                          <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[11px]">★</span>
                        )}
                      </span>
                    )}
                    {!teacher.insured && teacher.certified && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[11px]">★</span>
                    )}
                  </div>
                  
                  {/* 내용 */}
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {teacher.introduction}
                  </p>
                  
                  {/* 태그들 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {teacher.specialties.slice(0, 3).map((specialty, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        #{specialty}
                      </span>
                    ))}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                      #{teacher.location}
                    </span>
                  </div>
                  
                  {/* 가격 */}
                  <div className="text-xl font-bold text-blue-600 mb-4">
                    회기당 {teacher.hourlyRate.toLocaleString()}원
                  </div>
                  
                  {/* 하단 정보 */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                      <span>{teacher.responseTime}</span>
                      <span>•</span>
                      <span>{teacher.availability}</span>
                    </div>
                    </div>
                  </div>
                  
                {/* 오른쪽: 버튼들 */}
                  <div className="flex flex-col items-end space-y-3 ml-6">
                    <button 
                      onClick={() => openRequestModal(teacher)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors shadow-sm"
                    >
                      선생님께 요청하기
                        </button>
                    
                  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors shadow-sm">
                    1:1 채팅
                  </button>
                  
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">
                        상세 프로필 보기 &gt;
                    </div>
                  </div>
                </div>
              </div>
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
                내 프로필 등록하기
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
                    <option value="모니터링">모니터링</option>
                    <option value="임상심리">임상심리</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">나이</label>
                  <input
                    type="text"
                    value={newPost.age}
                    onChange={(e) => setNewPost(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="5세, 36개월"
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

              {/* 요일 / 시간 | 회당 희망 금액 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">요일 / 시간</label>
                  <div className="relative flex items-center border border-gray-300 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                    <input
                      type="text"
                      value={newPost.timeDetails.split(' / ')[0] || ''}
                      onChange={(e) => {
                        const timePart = newPost.timeDetails.split(' / ')[1] || '';
                        setNewPost(prev => ({ ...prev, timeDetails: `${e.target.value} / ${timePart}` }));
                      }}
                      placeholder="월,수"
                      className="flex-1 px-4 py-3 border-0 rounded-l-2xl focus:outline-none text-center"
                      required
                    />
                    <div className="px-2 text-gray-400 font-medium">/</div>
                    <input
                      type="text"
                      value={newPost.timeDetails.split(' / ')[1] || ''}
                      onChange={(e) => {
                        const dayPart = newPost.timeDetails.split(' / ')[0] || '';
                        setNewPost(prev => ({ ...prev, timeDetails: `${dayPart} / ${e.target.value}` }));
                      }}
                      placeholder="5시~6시"
                      className="flex-1 px-4 py-3 border-0 rounded-r-2xl focus:outline-none text-center"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">회당 희망 금액</label>
                  <input
                    type="text"
                    value={newPost.price}
                    onChange={(e) => {
                      // 숫자만 추출하여 천 단위 콤마 적용
                      const numbers = e.target.value.replace(/[^\d]/g, '');
                      const formattedValue = numbers ? numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
                      setNewPost(prev => ({ ...prev, price: formattedValue }));
                    }}
                    placeholder="예: 50,000"
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
                      <p><strong>회당 희망 금액:</strong> {(() => {
                        if (!newPost.price) return '미입력';
                        const priceStr = newPost.price.toString();
                        if (priceStr.includes('원')) return priceStr;
                        const numericPrice = priceStr.replace(/[^0-9]/g, '');
                        if (!numericPrice) return newPost.price;
                        return numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
                      })()}</p>
                    </div>
                    <div className="col-span-2">
                      <p><strong>제목:</strong> {newPost.age} {newPost.gender === '남' ? '남아' : newPost.gender === '여' ? '여아' : newPost.gender} {newPost.treatment} 홈티</p>
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

      {/* 프로필 등록 확인 팝업 */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className={`bg-white rounded-2xl p-10 max-w-lg w-[90%] text-center shadow-2xl transform confirm-modal ${isConfirmModalClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
            {/* 로켓 아이콘 */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg width="56" height="56" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(45)">
                  {/* 로켓 본체 */}
                  <ellipse cx="16" cy="14" rx="4" ry="8" fill="#3B82F6"/>
                  {/* 로켓 머리 (뾰족한 부분) */}
                  <path d="M16 6l-2 4h4l-2-4z" fill="#1E40AF"/>
                  {/* 로켓 날개 */}
                  <path d="M12 18l-3 2v3l3-2z" fill="#3B82F6"/>
                  <path d="M20 18l3 2v3l-3-2z" fill="#3B82F6"/>
                  {/* 로켓 창문 */}
                  <circle cx="16" cy="12" r="1.5" fill="white"/>
                </svg>
              </div>
            </div>
            
            {/* 제목 */}
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
              프로필을 목록에 등록하시겠습니까?
            </h2>
            
            {/* 설명 */}
            <div className="text-center text-sm text-gray-600 mb-8 leading-relaxed space-y-1">
              <div>등록된 프로필은 &apos;선생님 둘러보기&apos; 목록에 노출되어 학부모님들이 볼 수 있게 됩니다.</div>
              <div>
                이후 <span className="text-blue-600 font-semibold">&apos;프로필 끌어올림&apos;</span> 기능을 이용해 내 프로필을 목록 상단으로 올려 더 많은 기회를 만들어보세요!
              </div>
              <div className="text-xs text-blue-500">(프로필 끌어올림은 24시간에 한 번만 가능합니다.)</div>
            </div>
            
            {/* 버튼들 */}
            <div className="flex gap-3">
              <button
                onClick={closeConfirmModal}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmRegister}
                className="flex-1 px-6 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                네, 등록합니다
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
