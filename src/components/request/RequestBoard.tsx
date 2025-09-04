'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// 게시글 타입 정의
interface Post {
  id: string;
  treatment: string;
  category: string;
  title: string;
  details: string;
  applications: number;
  region: string;
  createdAt: any;
}

export default function RequestBoard() {
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
  const times = ['희망시간을 입력하세요', '09:00-12:00', '13:00-16:00', '17:00-20:00'];
  const treatments = [
    '희망치료를 선택하세요', '전체', '언어치료', '놀이치료', '감각통합치료', 
    '인지학습치료', '작업치료', '물리/운동치료', 'ABA치료', '음악치료', 
    '미술치료', '특수체육', '특수교사', '모니터링', '임상심리'
  ];

  // 지역별 게시글 데이터
  const allRegionalPosts = {
    '서울': [
      {
        id: 6210,
        treatment: '언어치료',
        category: '강남구 대치동',
        title: '5세 남 주2회 홈티',
        details: '조음장애 진단받음. 발음교정 필요. 월,수 4-6시 가능',
        applications: 12
      },
      {
        id: 6209,
        treatment: '놀이치료',
        category: '서초구 반포동',
        title: '7세 여 주1회 홈티',
        details: '또래관계 어려움. 사회성 발달 치료 희망. 토 오전 선호',
        applications: 8
      },
      {
        id: 6208,
        treatment: '감각통합치료',
        category: '송파구 잠실동',
        title: '4세 남 주3회 홈티',
        details: '감각과민 심함. 터치 거부감 있음. 월,수,금 오후',
        applications: 15
      },
      {
        id: 6207,
        treatment: '언어치료',
        category: '노원구 상계동',
        title: '초1 여 주2회 홈티',
        details: '말더듬 증상. 유창성 치료 필요. 화,목 5-6시',
        applications: 9
      },
      {
        id: 6206,
        treatment: '작업치료',
        category: '마포구 상암동',
        title: '6세 남 주1회 홈티',
        details: '소근육 발달 지연. 쓰기 어려움. 일요일 오후',
        applications: 6
      },
      {
        id: 6205,
        treatment: '미술치료',
        category: '영등포구 여의도동',
        title: '초2 여 주2회 홈티',
        details: '정서표현 부족. 내성적 성격. 화,금 방과후',
        applications: 11
      },
      {
        id: 6204,
        treatment: 'ABA치료',
        category: '성북구 석관동',
        title: '5세 남 주3회 홈티',
        details: 'ADHD 진단. 집중력 향상 필요. 월,수,금 4-6시',
        applications: 4
      },
      {
        id: 6203,
        treatment: '물리치료',
        category: '강동구 천호동',
        title: '초3 남 주2회 홈티',
        details: '대근육 발달 지연. 균형감각 부족. 화,목 저녁',
        applications: 7
      },
      {
        id: 6202,
        treatment: '특수교사',
        category: '용산구 한남동',
        title: '초1 여 주1회 홈티',
        details: '학습지도 및 인지능력 향상. 토 오전 10-12시',
        applications: 5
      },
      {
        id: 6201,
        treatment: '인지학습치료',
        category: '강서구 화곡동',
        title: '초2 남 주2회 홈티',
        details: '주의집중력 부족. 학습능력 향상. 월,수 6-7시',
        applications: 10
      }
    ],
    '인천/경기북부': [
      {
        id: 6308,
        treatment: '언어치료',
        category: '인천 남동구',
        title: '6세 남 주2회 홈티',
        details: '어휘력 부족, 문장 구성 어려움. 화,목 4-6시',
        applications: 9
      },
      {
        id: 6307,
        treatment: '놀이치료',
        category: '고양시 일산동구',
        title: '5세 여 주1회 홈티',
        details: '선택적 함묵증. 표현능력 향상 필요. 토 오전',
        applications: 7
      },
      {
        id: 6306,
        treatment: '감각통합치료',
        category: '파주시 운정동',
        title: '4세 남 주3회 홈티',
        details: '전정감각 문제. 균형잡기 어려움. 월,수,금',
        applications: 12
      },
      {
        id: 6305,
        treatment: '물리치료',
        category: '김포시 장기동',
        title: '초1 여 주2회 홈티',
        details: '근육 긴장도 낮음. 자세 불안정. 화,목 5-6시',
        applications: 5
      },
      {
        id: 6304,
        treatment: '작업치료',
        category: '의정부시 신곡동',
        title: '7세 남 주2회 홈티',
        details: '손목 힘 부족. 가위질, 색칠 어려움. 월,수',
        applications: 8
      },
      {
        id: 6303,
        treatment: '미술치료',
        category: '부천시 상동',
        title: '초2 여 주1회 홈티',
        details: '자존감 낮음. 표현력 향상 희망. 토 오후',
        applications: 6
      }
    ],
    '경기남부': [
      {
        id: 6407,
        treatment: '언어치료',
        category: '수원시 영통구',
        title: '6세 여 주2회 홈티',
        details: '발음 불명확, 구문 이해 부족. 화,목 4-6시',
        applications: 11
      },
      {
        id: 6406,
        treatment: '감각통합치료',
        category: '성남시 분당구',
        title: '5세 남 주3회 홈티',
        details: '촉각 방어. 놀이 참여 어려움. 월,수,금 오후',
        applications: 8
      },
      {
        id: 6405,
        treatment: 'ABA치료',
        category: '안양시 동안구',
        title: '4세 남 주4회 홈티',
        details: '자폐스펙트럼. 행동 중재 필요. 월~목 오전',
        applications: 6
      },
      {
        id: 6404,
        treatment: '놀이치료',
        category: '용인시 수지구',
        title: '7세 여 주1회 홈티',
        details: '분리불안 심함. 독립성 향상. 토 오후',
        applications: 9
      },
      {
        id: 6403,
        treatment: '인지학습치료',
        category: '화성시 동탄',
        title: '초1 남 주2회 홈티',
        details: '집중력 부족, 기억력 저하. 화,목 방과후',
        applications: 7
      },
      {
        id: 6402,
        treatment: '작업치료',
        category: '안산시 상록구',
        title: '초2 여 주1회 홈티',
        details: '글씨 쓰기 어려움. 연필 잡기 부정확. 일요일',
        applications: 5
      }
    ],
    '충청,강원,대전': [
      {
        id: 6506,
        treatment: '언어치료',
        category: '대전 서구',
        title: '6세 남 주2회 홈티',
        details: '언어발달지연. 구어표현 부족. 월,수 5-6시',
        applications: 7
      },
      {
        id: 6505,
        treatment: '감각통합치료',
        category: '천안시 서북구',
        title: '4세 여 주3회 홈티',
        details: '감각 조절 어려움. 과잉행동. 화,목,토 오후',
        applications: 5
      },
      {
        id: 6504,
        treatment: '놀이치료',
        category: '춘천시 춘천동',
        title: '초1 남 주1회 홈티',
        details: '사회성 부족. 규칙 이해 어려움. 토 오전',
        applications: 4
      },
      {
        id: 6503,
        treatment: '물리치료',
        category: '청주시 상당구',
        title: '초2 여 주2회 홈티',
        details: '운동발달지연. 걸음걸이 불안정. 화,목',
        applications: 6
      },
      {
        id: 6502,
        treatment: '미술치료',
        category: '원주시 단계동',
        title: '7세 남 주1회 홈티',
        details: '감정 조절 어려움. 창의적 표현 향상. 일요일',
        applications: 3
      }
    ],
    '전라,경상,부산': [
      {
        id: 6607,
        treatment: '언어치료',
        category: '부산 연제구',
        title: '5세 남 주2회 홈티',
        details: '발달성 언어장애. 표현언어 부족. 월,수 4-6시',
        applications: 8
      },
      {
        id: 6606,
        treatment: '놀이치료',
        category: '광주 서구',
        title: '6세 여 주1회 홈티',
        details: '위축행동. 자신감 부족. 토 오전 10-12시',
        applications: 6
      },
      {
        id: 6605,
        treatment: '감각통합치료',
        category: '대구 달서구',
        title: '4세 남 주3회 홈티',
        details: '감각추구행동. 자극 조절 필요. 월,수,금',
        applications: 10
      },
      {
        id: 6604,
        treatment: '물리치료',
        category: '울산 중구',
        title: '초1 여 주2회 홈티',
        details: '근력 약화. 보행 패턴 이상. 화,목 5-6시',
        applications: 4
      },
      {
        id: 6603,
        treatment: '작업치료',
        category: '전주시 완산구',
        title: '7세 남 주1회 홈티',
        details: '시지각 문제. 도형 인식 어려움. 일요일',
        applications: 5
      },
      {
        id: 6602,
        treatment: '특수교사',
        category: '창원시 의창구',
        title: '초2 여 주2회 홈티',
        details: '학습부진. 기초학습능력 향상. 화,목 방과후',
        applications: 7
      }
    ]
  };

  // 게시글 데이터 상태 (동적으로 업데이트 가능)
  const [postsData, setPostsData] = useState(allRegionalPosts);

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

  // 자동 제목 생성 함수 (치료종류 지역 연령 성별 빈도 홈티)
  const generateAutoTitle = (treatment: string, region: string, detailLocation: string, age: string, gender: string, frequency: string) => {
    const location = detailLocation || region;
    return `${treatment} ${location} ${age} ${gender} ${frequency} 홈티`;
  };

  // 새 게시글 추가 함수
  const addNewPost = (postData: typeof newPost) => {
    const newId = Math.max(...Object.values(postsData).flat().map(post => post.id)) + 1;
    const newTitle = `${postData.age} ${postData.gender} ${postData.frequency} 홈티`;
    
    const newPostEntry = {
      id: newId,
      treatment: postData.treatment,
      category: postData.detailLocation || postData.region,
      title: newTitle,
      details: postData.timeDetails,
      applications: 0
    };

    setPostsData(prev => ({
      ...prev,
      [postData.region]: [...(prev[postData.region as keyof typeof prev] || []), newPostEntry]
    }));
    
    closeCreatePostModal();
  };

  // 현재 선택된 지역의 게시글 가져오기
  const getCurrentPosts = () => {
    if (selectedSidebarItem === '홈티매칭') {
      // 모든 지역의 게시글을 합쳐서 보여줌
      return Object.values(postsData).flat();
    }
    return postsData[selectedSidebarItem as keyof typeof postsData] || [];
  };

  const filteredPosts = getCurrentPosts();

  // 선택된 지역에 따른 제목과 탭 변경
  const getRegionTitle = () => {
    if (selectedSidebarItem === '홈티매칭') return '전국 홈티매칭';
    return `${selectedSidebarItem} 홈티매칭`;
  };

  const handleSidebarClick = (item: string) => {
    setSelectedSidebarItem(item);
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="flex">
        {/* 사이드바 */}
        <div className="w-64 bg-white shadow-lg">
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
                    console.log('치료 버튼 클릭됨, 현재 상태:', showTreatmentModal);
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
               
                {/* 바로 아래 펼쳐지는 치료 선택 패널 */}
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
                    console.log('지역 버튼 클릭됨, 현재 상태:', showLocationModal);
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
              
                {/* 바로 아래 펼쳐지는 지역 선택 패널 */}
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

          {/* 게시글 테이블 */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">치료</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지역</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">진행</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post, index) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        {post.treatment || '언어치료'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {post.details}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                        매칭중
                      </button>
                      <div className="text-xs text-blue-600 mt-1">
                        +{post.applications}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                이전
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-2 text-sm ${
                    page === 1
                      ? 'text-blue-600 font-bold'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                다음
              </button>
            </div>
          </div>
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

    </section>
  );
}
