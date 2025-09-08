'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

// 게시글 타입 정의
interface Post {
  id: string;
  treatment: string;
  category: string;
  title: string;
  details: string;
  applications: number;
  region: string;
  age: string;
  gender: string;
  frequency: string;
  timeDetails: string;
  price: string;
  additionalInfo: string;
  createdAt: unknown;
  authorId: string; // 게시글 작성자 ID
  status: 'matching' | 'meeting' | 'completed'; // 진행 상태
  // 치료사 정보
  teacherUserId?: string; // 매칭된 치료사의 실제 사용자 ID
  teacherName?: string;
  teacherExperience?: number;
  teacherSpecialty?: string;
  teacherRating?: number;
  teacherReviewCount?: number;
  teacherProfileImage?: string;
  teacherCertifications?: string[];
  teacherEducation?: string;
  teacherCareer?: string;
  teacherRegions?: string[];
  teacherSchedule?: string;
  teacherIntroduction?: string;
  teacherPhilosophy?: string;
  teacherServices?: string;
  teacherVideoUrl?: string;
  // 실제 사용자 데이터 통합 필드
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  // 인증 상태
  isVerified?: boolean;
  hasCertification?: boolean;
  hasExperienceProof?: boolean;
  hasIdVerification?: boolean;
}


export default function RequestBoardFirebase() {
  const { currentUser, userData } = useAuth();
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('서울');
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [isSafetyModalClosing, setIsSafetyModalClosing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('서울');
  const [selectedLocation, setSelectedLocation] = useState('희망지역을 선택하세요');
  const [selectedTime, setSelectedTime] = useState('희망시간을 입력하세요');
  const [selectedTreatment, setSelectedTreatment] = useState('희망치료를 선택하세요');

  // 사용자 권한 체크 (학부모 또는 관리자, 또는 특정 관리자 이메일만 게시글 작성 가능)
  const canCreatePost = currentUser?.email === 'dudals7334@naver.com' || 
    currentUser?.email === 'everystars@naver.com' ||
    (userData && (userData.userType === 'parent' || userData.userType === 'admin'));

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSuccessModalClosing, setIsSuccessModalClosing] = useState(false);

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

  // 상세 프로필 모달 상태
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Post | null>(null);
  const [isProfileModalClosing, setIsProfileModalClosing] = useState(false);

  const sidebarItems = ['홈티매칭', '서울', '인천/경기북부', '경기남부', '충청,강원,대전', '전라,경상,부산'];
  const tabs = ['서울', '인천/경기북부', '경기남부', '충청,강원,대전', '전라,경상,부산'];
  
  // 지역별 상세 구역들
  const locationsByRegion = {
    '서울': [
      '희망지역을 선택하세요', '전체', '강남구', '강동구', '강서구', '강북구', '관악구', '광진구', 
      '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', 
      '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
    ],
    '인천/경기북부': [
      '희망지역을 선택하세요', '전체', '인천 중구', '인천 동구', '인천 미추홀구', '인천 연수구', '인천 남동구', 
      '인천 부평구', '인천 계양구', '인천 서구', '고양시', '파주시', '김포시', '의정부시', '양주시', '동두천시', '포천시'
    ],
    '경기남부': [
      '희망지역을 선택하세요', '전체', '수원시', '성남시', '안양시', '안산시', '용인시', '화성시', 
      '평택시', '오산시', '시흥시', '군포시', '의왕시', '하남시', '여주시', '이천시', '안성시', '광주시', '과천시'
    ],
    '충청,강원,대전': [
      '희망지역을 선택하세요', '전체', '대전 유성구', '대전 서구', '대전 중구', '대전 동구', '대전 대덕구', 
      '세종시', '천안시', '청주시', '충주시', '춘천시', '원주시', '강릉시', '속초시'
    ],
    '전라,경상,부산': [
      '희망지역을 선택하세요', '전체', '부산 해운대구', '부산 부산진구', '부산 동래구', '부산 남구', '부산 북구',
      '대구 중구', '대구 동구', '대구 서구', '대구 남구', '대구 북구', '대구 수성구', '광주 동구', '광주 서구', '광주 남구', '광주 북구'
    ]
  };
  
  const treatments = [
    '희망치료를 선택하세요', '전체', '언어치료', '놀이치료', '감각통합치료', 
    '인지학습치료', '작업치료', '물리/운동치료', 'ABA치료', '음악치료', 
    '미술치료', '특수체육', '특수교사', '모니터링', '임상심리'
  ];

  // Firebase에서 가져온 게시글 데이터 상태
  const [postsData, setPostsData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // 페이지당 게시글 수

  // Firebase에서 게시글 데이터 실시간으로 가져오기 (최신순으로 정렬)
  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('📥 실시간 데이터 업데이트:', snapshot.size, '개의 문서');
      
      const posts: Post[] = [];
      snapshot.forEach((doc) => {
        const docData = doc.data();
        console.log('📄 문서 데이터:', { id: doc.id, ...docData });
        
        posts.push({
          id: doc.id,
          ...docData
        } as Post);
      });
      
      console.log('✅ 실시간 업데이트 완료:', posts.length, '개 게시글');
      setPostsData(posts);
      setLoading(false);
    }, (error) => {
      console.error('❌ 실시간 데이터 로딩 오류:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 모달 닫기 함수 (애니메이션 포함)
  const closeCreatePostModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowCreatePostModal(false);
      setIsModalClosing(false);
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

  // 성공 모달 닫기 함수
  const closeSuccessModal = () => {
    setIsSuccessModalClosing(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setIsSuccessModalClosing(false);
    }, 300);
  };

  // 상세 요청 모달 열기 - 게시글 작성 내용 표시
  const openProfileModal = async (post: Post) => {
    console.log('🔍 요청 모달 열기 - 게시글 ID:', post.id);
    
    try {
      // 게시글 작성자 정보 가져오기
      const userDoc = await getDoc(doc(db, 'users', post.authorId));
      let userData = null;
      if (userDoc.exists()) {
        userData = userDoc.data();
        console.log('✅ 작성자 정보:', userData);
      }
      
      // 게시글 데이터 그대로 사용
      const requestProfile = {
        ...post,
        authorName: userData?.name || '익명',
        authorEmail: userData?.email,
        authorPhone: userData?.phone,
      };
      
      console.log('📋 요청 게시글 정보:', requestProfile);
      
      setSelectedProfile(requestProfile);
      setShowProfileModal(true);
      
    } catch (error) {
      console.error('❌ 요청 모달 열기 오류:', error);
      
      // 오류가 발생해도 기본 정보로 모달 표시
      const basicProfile = {
        ...post,
        authorName: '익명',
      };
      
      setSelectedProfile(basicProfile);
      setShowProfileModal(true);
    }
  };


  // 상세 프로필 모달 닫기
  const closeProfileModal = () => {
    setIsProfileModalClosing(true);
    setTimeout(() => {
      setShowProfileModal(false);
      setIsProfileModalClosing(false);
      setSelectedProfile(null);
    }, 300);
  };

  const closeSafetyModal = () => {
    setIsSafetyModalClosing(true);
    setTimeout(() => {
      setShowSafetyModal(false);
      setIsSafetyModalClosing(false);
    }, 300);
  };

  // 새 게시글 Firebase에 저장
  const addNewPost = async (postData: typeof newPost) => {
    try {
      // 강화된 인증 확인
      if (!auth.currentUser) {
        alert('로그인이 필요합니다.');
        return;
      }

      // Firebase 연결 상태 확인
      console.log('🔐 Firebase 인증 상태:', {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email
      });

      const newTitle = `${postData.age} ${postData.gender} ${postData.frequency} ${postData.treatment} 홈티 모집`;
      
      // 전송할 데이터 준비
      const postDataToSend = {
        treatment: postData.treatment,
        region: postData.region || selectedTab,
        age: postData.age,
        gender: postData.gender,
        frequency: postData.frequency,
        timeDetails: postData.timeDetails,
        price: postData.price,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        status: 'matching',
        applications: 0,
        // 추가 정보들
        title: newTitle,
        category: postData.detailLocation || postData.region,
        details: postData.timeDetails,
        additionalInfo: postData.additionalInfo || '',
        // 게시글 타입 구분 (학부모 요청용)
        type: 'request'
      };

      console.log('📤 전송할 데이터:', postDataToSend);
      
      const docRef = await addDoc(collection(db, 'posts'), postDataToSend);
      
      console.log('✅ 게시글이 성공적으로 등록되었습니다. ID: ', docRef.id);
      
      // 모달 닫기
      closeCreatePostModal();
      
      // 성공 모달 표시
      setShowSuccessModal(true);
      
      // 첫 번째 페이지로 이동하여 새 게시글 확인
      setCurrentPage(1);
      
      // 실시간 업데이트는 onSnapshot에 의해 자동으로 처리됨
    } catch (error) {
      console.error('Error adding document: ', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      alert('게시글 저장 중 오류가 발생했습니다: ' + errorMessage);
    }
  };

  // 진행 상태 표시 함수
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'meeting':
        return { text: '미팅중', bgColor: 'bg-blue-100', textColor: 'text-blue-700' };
      case 'completed':
        return { text: '매칭완료', bgColor: 'bg-green-100', textColor: 'text-green-700' };
      case 'matching':
      default:
        return { text: '매칭중', bgColor: 'bg-orange-100', textColor: 'text-orange-700' };
    }
  };

  // 현재 선택된 지역의 게시글 필터링 (디버깅 추가)
  const getCurrentPosts = () => {
    console.log('🗺️ 지역 필터링:', {
      selectedSidebarItem,
      totalPosts: postsData.length,
      allPostsRegions: postsData.map(p => p.region)
    });
    
    if (selectedSidebarItem === '홈티매칭') {
      // 모든 지역의 게시글을 보여줌
      console.log('🌍 전국 모드: 모든 게시글 표시');
      return postsData;
    }
    
    const regionFiltered = postsData.filter(post => post.region === selectedSidebarItem);
    console.log('🎯 지역 필터링 결과:', regionFiltered.length, '개');
    return regionFiltered;
  };

  // 검색 필터링 (디버깅 추가)
  const filteredPosts = getCurrentPosts().filter((post: Post) => {
    const treatmentMatch = selectedTreatment === '희망치료를 선택하세요' || selectedTreatment === '전체' || post.treatment === selectedTreatment;
    const locationMatch = selectedLocation === '희망지역을 선택하세요' || selectedLocation === '전체' || 
                         post.category?.includes(selectedLocation);
    
    console.log('🔍 필터링 체크:', {
      post: post,
      selectedTreatment,
      selectedLocation,
      treatmentMatch,
      locationMatch,
      finalMatch: treatmentMatch && locationMatch
    });
    
    return treatmentMatch && locationMatch;
  });
  
  console.log('🎯 필터링된 최종 게시글 수:', filteredPosts.length);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  console.log('📄 페이지네이션 정보:', {
    totalPosts: filteredPosts.length,
    currentPage,
    totalPages,
    postsPerPage,
    startIndex,
    endIndex,
    currentPagePosts: currentPosts.length
  });

  // 선택된 지역에 따른 제목과 탭 변경
  const getRegionTitle = () => {
    if (selectedSidebarItem === '홈티매칭') return '전국 홈티매칭';
    return `${selectedSidebarItem} 홈티매칭`;
  };

  const handleSidebarClick = (item: string) => {
    setSelectedSidebarItem(item);
    setCurrentPage(1); // 지역 변경 시 1페이지로 리셋
    if (item !== '홈티매칭') {
      setSelectedTab(item);
    }
  };

  // 현재 선택된 탭에 따른 지역 목록 가져오기
  const getCurrentLocations = () => {
    return locationsByRegion[selectedTab as keyof typeof locationsByRegion] || locationsByRegion['서울'];
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // 지역 모달 외부 클릭 시 모달 닫기
      if (!target.closest('.location-modal') && !target.closest('[data-location-button]')) {
        setShowLocationModal(false);
      }
      // 치료 모달 외부 클릭 시 모달 닫기
      if (!target.closest('.treatment-modal') && !target.closest('[data-treatment-button]')) {
        setShowTreatmentModal(false);
      }
      // 게시글 작성 모달 외부 클릭 시 모달 닫기
      if (!target.closest('.create-post-modal') && !target.closest('[data-create-post-button]')) {
        closeCreatePostModal();
      }
      // 상세 프로필 모달 외부 클릭 시 모달 닫기
      if (showProfileModal && !target.closest('.profile-modal')) {
        closeProfileModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileModal]);

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="flex">
        {/* 사이드바 */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4">
            {sidebarItems.map((item) => (
              <div key={item} className={item === '홈티매칭' ? 'mb-6' : 'mb-1'}>
                <button
                  onClick={() => handleSidebarClick(item)}
                  className={`w-full transition-colors ${
                    item === '홈티매칭'
                      ? 'bg-blue-500 text-white text-xl font-bold rounded-2xl h-[110px] flex items-center justify-center'
                      : selectedSidebarItem === item
                      ? 'bg-blue-50 text-blue-600 text-left px-4 py-3 rounded-2xl text-sm font-medium'
                      : 'text-gray-700 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl text-sm font-medium'
                  }`}
                >
                  {item}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 p-8">
          {/* 제목과 브레드크럼 */}
          <div className="flex items-center justify-between mb-6">
            {/* 제목 */}
            <h1 className="text-2xl font-bold text-gray-900">{getRegionTitle()}</h1>
            
            {/* 브레드크럼 */}
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">홈</Link>
              <span className="mx-2">&gt;</span>
              <Link href="/matching" className="hover:text-blue-600">홈티매칭</Link>
              <span className="mx-2">&gt;</span>
              <span className="text-gray-900 font-medium">{getRegionTitle()}</span>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="mb-6">
            <div className="bg-gray-50 rounded-3xl p-2 flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setSelectedTab(tab);
                    setSelectedSidebarItem(tab);
                    setCurrentPage(1); // 탭 변경 시 1페이지로 리셋
                  }}
                  className={`flex-1 py-3 text-sm font-medium rounded-2xl transition-colors text-center ${
                    selectedTab === tab
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-blue-700 hover:text-blue-900 hover:bg-blue-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 검색 폼 */}
          <div className="mb-6 flex">
            {/* 희망치료 드롭다운 */}
            <div className="relative dropdown-container flex-1">
              <button
                onClick={() => {
                  setShowTreatmentModal(!showTreatmentModal);
                  setShowLocationModal(false);
                }}
                data-treatment-button
                className="w-full h-16 px-6 py-4 text-left focus:outline-none bg-white hover:bg-gray-50 flex items-center justify-between text-lg rounded-l-2xl border-2 border-r border-blue-500"
              >
                <span className={`truncate ${selectedTreatment === '희망치료를 선택하세요' ? 'text-gray-500' : 'text-gray-900'}`}>
                  {selectedTreatment}
                </span>
                <span className="flex-shrink-0 ml-2">
                  <svg className={`w-4 h-4 transition-transform ${showTreatmentModal ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              {/* 치료 선택 패널 */}
              {showTreatmentModal && (
                <div className="absolute top-full left-[26px] mt-2 bg-white rounded-2xl shadow-xl border-2 border-blue-500 z-[9999] p-6 w-[900px] treatment-modal">
                  <h3 className="text-lg font-semibold mb-4">희망치료를 선택하세요</h3>
                  
                  {/* 치료 옵션 그리드 */}
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    {treatments.filter(treatment => treatment !== '희망치료를 선택하세요').map((treatment) => (
                      <button
                        key={treatment}
                        onClick={() => {
                          setSelectedTreatment(treatment);
                          setShowTreatmentModal(false);
                          setCurrentPage(1); // 치료법 변경 시 1페이지로 리셋
                        }}
                        className={`p-3 text-sm rounded-2xl border transition-colors ${
                          selectedTreatment === treatment
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        {treatment}
                      </button>
                    ))}
                  </div>

                  {/* 버튼들 */}
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowTreatmentModal(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors text-sm"
                    >
                      닫기
                    </button>
                    <button
                      onClick={() => setShowTreatmentModal(false)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors text-sm"
                    >
                      적용
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 희망지역 드롭다운 */}
            <div className="relative dropdown-container flex-1">
              <button
                onClick={() => {
                  setShowLocationModal(!showLocationModal);
                  setShowTreatmentModal(false);
                }}
                data-location-button
                className="w-full h-16 px-6 py-4 text-left focus:outline-none bg-white hover:bg-gray-50 flex items-center justify-between text-lg border-2 border-r border-l-0 border-blue-500"
              >
                <span className={`truncate ${selectedLocation === '희망지역을 선택하세요' ? 'text-gray-500' : 'text-gray-900'}`}>
                  {selectedLocation}
                </span>
                <span className="flex-shrink-0 ml-2">
                  <svg className={`w-4 h-4 transition-transform ${showLocationModal ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              {/* 지역 선택 패널 */}
              {showLocationModal && (
                <div className="absolute top-full left-[-248px] mt-2 bg-white rounded-2xl shadow-xl border-2 border-blue-500 z-[9999] p-6 w-[900px] location-modal">
                  <h3 className="text-lg font-semibold mb-4">희망지역을 선택하세요 ({selectedTab})</h3>
                  
                  {/* 지역 옵션 그리드 */}
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    {getCurrentLocations().filter(location => location !== '희망지역을 선택하세요').map((location) => (
                      <button
                        key={location}
                        onClick={() => {
                          setSelectedLocation(location);
                          setShowLocationModal(false);
                          setCurrentPage(1); // 지역 선택 시 1페이지로 리셋
                        }}
                        className={`p-3 text-sm rounded-2xl border transition-colors ${
                          selectedLocation === location
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>

                  {/* 버튼들 */}
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowLocationModal(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors text-sm"
                    >
                      닫기
                    </button>
                    <button
                      onClick={() => setShowLocationModal(false)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors text-sm"
                    >
                      적용
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* 희망시간 */}
            <div className="flex-1">
              <input
                type="text"
                value={selectedTime === '희망시간을 입력하세요' ? '' : selectedTime}
                onChange={(e) => setSelectedTime(e.target.value || '희망시간을 입력하세요')}
                placeholder="희망시간을 입력하세요 (예: 14:00-16:00)"
                className="w-full h-16 px-6 py-4 focus:outline-none bg-white text-lg border-2 border-r border-l-0 border-blue-500"
              />
            </div>
            
            {/* 검색 버튼 */}
            <button className="h-16 bg-blue-500 hover:bg-blue-600 text-white px-8 font-bold transition-colors rounded-r-2xl border-2 border-l-0 border-blue-500">
              홈티검색
            </button>
          </div>

          {/* 새 게시글 작성 버튼 */}
          <div className="mb-6 flex justify-end">
            {canCreatePost ? (
              <button
                onClick={() => setShowCreatePostModal(true)}
                data-create-post-button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                선생님에게 요청하기
              </button>
            ) : (
              <div className="text-center">
                <button
                  disabled
                  className="bg-gray-400 cursor-not-allowed text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 mb-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  선생님에게 요청하기
                </button>
                <p className="text-sm text-gray-600">
                  {currentUser ? 
                    '학부모 계정만 게시글을 작성할 수 있습니다.' : 
                    '로그인 후 이용해주세요.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-gray-500">로딩 중...</div>
            </div>
          )}

          {/* 게시글 테이블 */}
          {!loading && (
            <div className="bg-white rounded-2xl border-2 border-blue-200 overflow-hidden shadow-lg">
              {filteredPosts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  등록된 게시글이 없습니다.
                </div>
              ) : (
                <>
                  {/* 테이블 헤더 */}
                  <div className="bg-blue-500 text-white">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4">
                      <div className="col-span-1 text-center font-medium">번호</div>
                      <div className="col-span-2 text-center font-medium">지역</div>
                      <div className="col-span-7 text-left font-medium">제목</div>
                      <div className="col-span-2 text-center font-medium">진행</div>
                          </div>
                        </div>
                        
                  {/* 테이블 바디 */}
                  <div>
                    {currentPosts.map((post) => (
                        <div key={post.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer"
                             onClick={() => openProfileModal(post)}>
                          {/* 번호 */}
                          <div className="col-span-1 text-center text-blue-600 font-medium">
                            {(() => {
                              // 내림차순 번호: 최신 게시글이 가장 큰 번호
                              const allPostIndex = filteredPosts.findIndex(p => p.id === post.id);
                              return filteredPosts.length - allPostIndex;
                            })()}
                          </div>
                          
                          {/* 지역 */}
                          <div className="col-span-2 text-center">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              {post.region || post.category}
                            </span>
                          </div>
                          
                          {/* 제목 */}
                          <div className="col-span-7 text-left">
                            <div className="flex items-center space-x-3">
                              <div className="flex-1">
                                <h3 className="text-gray-900 font-medium text-base mb-1">
                                  {post.age} {post.gender} {post.frequency} {post.treatment} 홈티 모집
                                </h3>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <span>{post.timeDetails}</span>
                                  {post.price && (
                                    <>
                                      <span>•</span>
                                      <span className="text-blue-600 font-medium">
                            회기당 {(() => {
                              const priceStr = post.price.toString();
                              if (priceStr.includes('원')) return priceStr;
                              const numericPrice = priceStr.replace(/[^0-9]/g, '');
                              return numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
                            })()}
                            </span>
                                    </>
                                  )}
                                </div>
                          </div>
                        </div>
                      </div>
                      
                          {/* 진행 상태 */}
                          <div className="col-span-2 text-center">
                            {(() => {
                              const statusInfo = getStatusDisplay(post.status || 'matching');
                              return (
                                <span className={`inline-block px-3 py-1 ${statusInfo.bgColor} ${statusInfo.textColor} rounded-full text-sm font-medium`}>
                                  {statusInfo.text}
                                </span>
                              );
                            })()}
                        </div>
                        </div>
                      ))}
                      </div>
                </>
              )}
            </div>
          )}

          {/* 페이지네이션 */}
          {!loading && filteredPosts.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                {/* 이전 버튼 */}
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  이전
                </button>
                
                {/* 페이지 번호 버튼들 */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      page === currentPage
                        ? 'bg-blue-500 text-white font-bold'
                        : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                {/* 다음 버튼 */}
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  다음
                </button>
              </div>
              
              {/* 페이지 정보 표시 */}
              <div className="ml-6 text-sm text-gray-500 flex items-center">
                총 {filteredPosts.length}개 게시글 | {currentPage}/{totalPages} 페이지
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 새 게시글 작성 모달 */}
      {showCreatePostModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className={`bg-white rounded-lg p-8 max-w-6xl w-[95vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto create-post-modal ${isModalClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">선생님에게 요청하기</h2>
              <button
                onClick={closeCreatePostModal}
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
                      <p><strong>제목:</strong> {newPost.age} {newPost.gender} {newPost.frequency} {newPost.treatment} 홈티 모집</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 버튼 */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={closeCreatePostModal}
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

      {/* 상세 요청 모달 */}
      {showProfileModal && selectedProfile && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className={`bg-white rounded-lg max-w-6xl w-[95vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto profile-modal ${isProfileModalClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">요청 상세 정보</h2>
              <button
                onClick={closeProfileModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            {/* 모달 바디 */}
            <div className="px-8 py-6">
              {/* 요청 기본 정보 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedProfile.age} {selectedProfile.gender} {selectedProfile.frequency} {selectedProfile.treatment} 홈티 모집
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        #{selectedProfile.treatment}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        #{selectedProfile.region || selectedProfile.category}
                      </span>
                      {(() => {
                        const statusInfo = getStatusDisplay(selectedProfile.status || 'matching');
                        return (
                          <span className={`inline-flex items-center px-3 py-1 ${statusInfo.bgColor} ${statusInfo.textColor} rounded-full text-sm font-medium`}>
                            {statusInfo.text}
                          </span>
                        );
                      })()}
                  </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                    회기당 {(() => {
                        if (!selectedProfile.price) return '협의';
                      const priceStr = selectedProfile.price.toString();
                      if (priceStr.includes('원')) return priceStr;
                      const numericPrice = priceStr.replace(/[^0-9]/g, '');
                        if (!numericPrice) return '협의';
                      return numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
                    })()}
                  </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {selectedProfile.createdAt ? 
                        new Date(
                          (selectedProfile.createdAt && typeof selectedProfile.createdAt === 'object' && 'toDate' in selectedProfile.createdAt && typeof selectedProfile.createdAt.toDate === 'function') 
                            ? selectedProfile.createdAt.toDate() 
                            : selectedProfile.createdAt as string | number
                        ).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : '작성일 미상'
                      }
                </div>
              </div>
              </div>
              </div>

              {/* 요청 상세 정보 */}
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-4 text-gray-900 text-lg">기본 정보</h4>
                  <div className="grid grid-cols-2 gap-4">
                  <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">치료 분야</div>
                      <div className="text-sm text-gray-900">{selectedProfile.treatment}</div>
                  </div>
                  <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">대상 연령</div>
                      <div className="text-sm text-gray-900">{selectedProfile.age}</div>
                  </div>
                  <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">성별</div>
                      <div className="text-sm text-gray-900">{selectedProfile.gender}</div>
                        </div>
                  <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">희망 횟수</div>
                      <div className="text-sm text-gray-900">{selectedProfile.frequency}</div>
                    </div>
                  <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">지역</div>
                      <div className="text-sm text-gray-900">{selectedProfile.region || selectedProfile.category}</div>
                              </div>
                              <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">희망 시간</div>
                      <div className="text-sm text-gray-900">{selectedProfile.timeDetails || '협의 후 결정'}</div>
                              </div>
                    </div>
                  </div>

                {/* 세부 내용 */}
                {selectedProfile.additionalInfo && (
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900 text-lg">세부 내용</h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {selectedProfile.additionalInfo}
                      </pre>
                          </div>
                    </div>
                )}

                {/* 작성자 정보 */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900 text-lg">작성자 정보</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {(selectedProfile as { authorName?: string }).authorName?.[0] || '익'}
                              </span>
                          </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {(selectedProfile as { authorName?: string }).authorName || '익명'}
                        </div>
                        <div className="text-xs text-gray-500">학부모</div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              {/* 1:1 채팅으로 문의하기 버튼 */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setShowSafetyModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg w-full max-w-md inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  1:1 채팅으로 문의하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 안전 매칭을 위한 필수 확인 사항 팝업 */}
      {showSafetyModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className={`bg-white border-4 border-blue-700 rounded-lg max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto shadow-xl ${isSafetyModalClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
            {/* 헤더 - X 버튼만 */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeSafetyModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* 메인 내용 */}
            <div className="px-8 pb-8">
              <div className="text-center mb-20 mt-20">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">
                  안전 매칭을 위한 필수 확인 사항
                </h2>
                <p className="text-gray-600 text-2xl">
                  선생님과 소통을 시작하기 전, 아래 내용을 반드시 확인하고 동의해 주세요.
                </p>
              </div>

              {/* 모든별 키즈 이용 혜택 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center mr-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#3B82F6">
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">모든별 키즈 이용 혜택</h3>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">안전결제 시스템:</span> 첫 수업료를 모든별 키즈가 안전하게 보관하여 사기, 수업 불이행 등의 문제를 100% 예방합니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">분쟁 중재 서비스:</span> 문제 발생 시, 플랫폼이 공식 규정에 따라 공정하게 중재해 드립니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">검증된 후기:</span> 오직 플랫폼 결제 회원만 후기를 참고하고 작성할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 직거래 금지 안내 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="#EF4444">
                      <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">직거래 금지 안내</h3>
                </div>
                
                <div className="bg-red-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        플랫폼 외부 거래(현금, 계좌이체 등)는 <span className="font-bold">엄격히 금지</span>됩니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        직거래 시 발생하는 모든 문제에 대해 플랫폼은 어떠한 보호나 책임도 지지 않습니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        직거래 유도 신고 시, 확인 후 <span className="font-bold">이용권 1개월을 포상</span>으로 지급합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 동의 체크박스 */}
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-gray-100 rounded-lg p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      위 내용을 모두 확인했으며, 플랫폼의 안전 규정을 준수하는 것에 동의합니다.
                    </span>
                  </label>
                </div>
              </div>

              {/* 확인 버튼 */}
              <div className="mt-6 text-center">
                <button
                  onClick={closeSafetyModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  확인했습니다
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 성공 메시지 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className={`bg-white rounded-3xl p-8 max-w-md w-[90%] text-center shadow-2xl transform ${isSuccessModalClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
            {/* 성공 아이콘 */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            {/* 메시지 */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">성공했습니다!</h2>
            <p className="text-gray-600 mb-8">게시글이 성공적으로 등록되었습니다.</p>
            
            {/* 확인 버튼 */}
            <button
              onClick={closeSuccessModal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-medium transition-colors w-full"
            >
              확인
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
