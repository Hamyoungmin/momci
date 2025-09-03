'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

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
  createdAt: any;
}

export default function RequestBoardFirebase() {
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('서울');
  const [selectedTab, setSelectedTab] = useState('서울');
  const [selectedLocation, setSelectedLocation] = useState('희망지역을 선택하세요');
  const [selectedTime, setSelectedTime] = useState('희망시간을 입력하세요');
  const [selectedTreatment, setSelectedTreatment] = useState('희망치료를 선택하세요');

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);

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
  const postsPerPage = 5; // 페이지당 게시글 수

  // Firebase에서 게시글 데이터 실시간으로 가져오기
  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('📥 Firestore 스냅샷 받음:', snapshot.size, '개의 문서');
      
      const posts: Post[] = [];
      snapshot.forEach((doc) => {
        const docData = doc.data();
        console.log('📄 문서 데이터:', { id: doc.id, ...docData });
        
        posts.push({
          id: doc.id,
          ...docData
        } as Post);
      });
      
      console.log('✅ 최종 posts 배열:', posts);
      setPostsData(posts);
      setLoading(false);
    }, (error) => {
      console.error('❌ Error fetching posts:', error);
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

  // 상세 프로필 모달 열기
  const openProfileModal = (post: Post) => {
    setSelectedProfile(post);
    setShowProfileModal(true);
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

      const newTitle = `${postData.age} ${postData.gender} ${postData.frequency} 홈티`;
      
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
        status: 'active',
        applications: 0,
        // 추가 정보들
        title: newTitle,
        category: postData.detailLocation || postData.region,
        details: postData.timeDetails,
        additionalInfo: postData.additionalInfo || ''
      };

      console.log('📤 전송할 데이터:', postDataToSend);
      
      const docRef = await addDoc(collection(db, 'posts'), postDataToSend);
      
      console.log('Document written with ID: ', docRef.id);
      setCurrentPage(1); // 새 게시글 저장 후 1페이지로 이동
      closeCreatePostModal();
    } catch (error) {
      console.error('Error adding document: ', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      alert('게시글 저장 중 오류가 발생했습니다: ' + errorMessage);
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
            {sidebarItems.map((item, index) => (
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
              {tabs.map((tab, index) => (
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
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-gray-500">로딩 중...</div>
            </div>
          )}

          {/* 게시글 카드 */}
          {!loading && (
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
                  등록된 게시글이 없습니다.
                </div>
              ) : (
                currentPosts.map((post, index) => (
                  <div key={post.id} className="bg-white rounded-2xl border-2 border-blue-100 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200">
                    <div className="flex items-start justify-between">
                      {/* 왼쪽: 프로필 정보 */}
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
                              김OO 치료사
                            </h3>
                            <span className="text-sm text-gray-600">
                              (7년차 {post.treatment}사)
                            </span>
                          </div>
                          
                          {/* 별점과 후기 */}
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center">
                              <span className="text-orange-400 text-lg">★</span>
                              <span className="text-sm font-medium ml-1">4.8</span>
                              <span className="text-xs text-gray-500 ml-1">(후기 15개)</span>
                            </div>
                          </div>
                          
                          {/* 치료분야 태그 */}
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              #{post.treatment}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                              #{post.category}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                              #{post.frequency}
                            </span>
                          </div>
                          
                          {/* 가격 정보 */}
                          <div className="text-xl font-bold text-blue-600 mb-4">
                            회기당 {(() => {
                              if (!post.price) return '65,000원';
                              const priceStr = post.price.toString();
                              if (priceStr.includes('원')) return priceStr;
                              const numericPrice = priceStr.replace(/[^0-9]/g, '');
                              return numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
                            })()}
                          </div>
                          
                          {/* 구분선 */}
                          <div className="border-t border-gray-200 pt-3 mb-3"></div>
                          
                          {/* 인증 정보 - 체크마크 스타일 */}
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                              <span className="text-sm text-gray-700">자격증</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                              <span className="text-sm text-gray-700">경력증명</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                              <span className="text-sm text-gray-700">신분증확인서</span>
                            </div>
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
                          {/* 상세 프로필 보기 버튼 */}
                          <button 
                            onClick={() => openProfileModal(post)}
                            className="text-xs text-gray-500 hover:text-blue-600 mb-1 cursor-pointer transition-colors"
                          >
                            상세 프로필 보기 &gt;
                          </button>
                          
                          {/* 작성일 */}
                          <div className="text-xs text-gray-400">
                            {post.createdAt ? 
                              new Date(post.createdAt.toDate ? post.createdAt.toDate() : post.createdAt).toLocaleDateString('ko-KR', {
                                month: 'long',
                                day: 'numeric'
                              }) : '9월 2일'
                            }
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
                      <p><strong>제목:</strong> {newPost.age} {newPost.gender} {newPost.frequency} 홈티</p>
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

      {/* 상세 프로필 모달 */}
      {showProfileModal && selectedProfile && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          {/* 모달 콘텐츠 */}
          <div className={`bg-white rounded-lg max-w-6xl w-[95vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto profile-modal ${isProfileModalClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
            {/* 모달 헤더 - 닫기 버튼만 */}
            <div className="flex justify-end p-6 pb-2">
              <button
                onClick={closeProfileModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            {/* 모달 바디 */}
            <div className="px-8 pb-8">
              {/* 프로필 헤더 - 26.png 스타일 */}
              <div className="flex items-center space-x-4 mb-6">
                {/* 프로필 이미지 */}
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                  <div className="text-center">
                    <span className="text-gray-500 text-xs font-medium block">프로필</span>
                    <span className="text-gray-400 text-xs block">사진</span>
                  </div>
                </div>
                
                {/* 기본 정보 */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">김OO 치료사 (7년차 언어치료사)</h2>
                  <div className="flex items-center mb-2">
                    <span className="text-orange-400 text-lg">★</span>
                    <span className="text-sm font-medium ml-1">4.8</span>
                    <span className="text-xs text-gray-500 ml-1">(후기 15개)</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-3">
                    회기당 {(() => {
                      if (!selectedProfile.price) return '65,000원';
                      const priceStr = selectedProfile.price.toString();
                      if (priceStr.includes('원')) return priceStr;
                      const numericPrice = priceStr.replace(/[^0-9]/g, '');
                      return numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
                    })()}
                  </div>
                </div>
              </div>

              {/* 태그들 */}
              <div className="flex items-center space-x-2 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  #{selectedProfile.treatment}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  #{selectedProfile.category}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                  #{selectedProfile.frequency}
                </span>
              </div>
              
              {/* 인증 정보 체크마크들 */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">자격증</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">경력증명</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">신분증확인서</span>
                </div>
                <span className="text-gray-400 text-xs">보험가입</span>
                <div className="flex items-center space-x-1">
                  <span className="text-blue-600 text-sm">★</span>
                  <span className="text-sm text-blue-600">더많은 인증</span>
                </div>
              </div>

              {/* 선생님 소개 - 27.png 스타일 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-blue-500 mr-2">👤</span>
                  <h3 className="text-lg font-semibold text-gray-900">선생님 소개</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">치료 철학 및 접근</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      저는 아이의 독특한 의사소통 능력을 통해 각 아이에게 맞는 치료 접근을 중요하게 생각합니다. 아이에게 지친 부모는 제가 즐길 수 있을 만큼 실상에 절실함을 얻었어 아이의 지금의 단계를 발견하는 것이 가장 강력한 해결을 만드는 것이라고 생각합니다.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">주요 치료영역/서비스</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      OOO 치료영역에서 약 5년간 근무하면서 더 각 아이들 수준에 따른 치료를 해봤고, 요즘은 감각을 약간 어려워하는 아이를 지원하는 상호 작용이 아이적어서 치료 가능성을 훈련 아이에게 있어주고 있습니다.
                    </p>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg">
                    <div className="text-center py-12 text-gray-500 text-sm">
                      영상이 등록될 경우, 영상 플레이어가 여기에 표시됩니다.
                    </div>
                  </div>
                </div>
              </div>

              {/* 학실 정보 학부모 보기 - 테이블 형태 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-blue-500 mr-2">📄</span>
                  <h3 className="text-lg font-semibold text-gray-900">학실 정보 학부모 보기</h3>
                </div>
                
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50 w-1/4">학력 사항</td>
                        <td className="px-4 py-3 text-gray-600">1급기 / 65,000원</td>
                        <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50 w-1/4">총 경력</td>
                        <td className="px-4 py-3 text-gray-600">7년 3개월</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50">활동 가능 지역</td>
                        <td className="px-4 py-3 text-gray-600">서울시 강남구, 서초구, 송파구</td>
                        <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50">치료 가능 시간</td>
                        <td className="px-4 py-3 text-gray-600">평일 오후 4시 이후 / 주말 오전 (법일 기준)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 학부모 후기 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-blue-500 mr-2">💬</span>
                  <h3 className="text-lg font-semibold text-gray-900">학부모 후기 (3건)</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                      "신경쓰 정말 최고에요! 저희 아이가 너무 달라져 가리되네, 처음에는 마음을 열지 않으셨는데 지금은 수업시간이 기다려져요. 센터에도 인정받는 선생님 정말 감사해요."
                    </p>
                    <div className="text-xs text-gray-500 text-right">- 학부모 (2025.08.15)</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                      "체계적으로 잘 가르쳐주시고, 아이의 부족한 능력과 놓이니 시간대비와, 각 종류마다"
                    </p>
                    <div className="text-xs text-gray-500 text-right">- 학부모 (2025.07.20)</div>
                  </div>
                </div>
              </div>

              {/* 1:1 채팅으로 문의하기 버튼 */}
              <div className="text-center">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg w-full max-w-md">
                  <span className="mr-2">💬</span>
                  1:1 채팅으로 문의하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
