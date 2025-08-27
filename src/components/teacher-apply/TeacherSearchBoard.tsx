'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TeacherSearchBoard() {
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('치료사 등록안내');
  const [selectedTab, setSelectedTab] = useState('서울');
  const [selectedPriceRange, setSelectedPriceRange] = useState('치료비');
  const [selectedStatus, setSelectedStatus] = useState('상태');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTherapyTypes, setSelectedTherapyTypes] = useState<string[]>([]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [isPopupClosing, setIsPopupClosing] = useState(false);

  // 팝업 닫기 함수 (애니메이션 포함)
  const closePopup = () => {
    setIsPopupClosing(true);
    setTimeout(() => {
      setShowRegistrationPopup(false);
      setIsPopupClosing(false);
    }, 300);
  };

  const sidebarItems = ['치료사등록', '치료사 등록안내', '정식(경력)치료사 등록'];
  const priceRanges = ['치료비', '5만원 이하', '5-6만원', '6-7만원', '7-8만원', '8만원 이상'];
  const statusOptions = ['상태', '등록완료', '추천중', '검토중', '보류'];
  const therapyCheckboxes = [
    { id: 'speech', label: '언어치료사' },
    { id: 'play', label: '놀이치료사' },
    { id: 'sensory', label: '감각통합치료사' },
    { id: 'cognitive', label: '인지학습치료사' },
    { id: 'art', label: '미술치료사' },
    { id: 'physical', label: '물리치료사' },
    { id: 'occupational', label: '작업치료사' },
    { id: 'aba', label: 'ABA치료사' },
    { id: 'music', label: '음악치료사' },
    { id: 'special', label: '특수교육교사' },
    { id: 'psychologist', label: '임상심리사' },
    { id: 'social', label: '사회복지사' },
    { id: 'behavior', label: '행동치료사' },
    { id: 'etc', label: '기타' }
  ];

  // 지역별 치료사 데이터
  const allRegionalTeachers = {
    '서울': [
      {
        id: 5015,
        category: '언어/인지치료',
        name: '김민* 언어재활사',
        details: '서울대병원 재활의학과 5년 근무 / 언어재활사 1급 / 아동언어발달지연 전문',
        hourlyRate: '7만원',
        status: '등록완료',
        applications: 12
      },
      {
        id: 5014,
        category: '놀이/감각통합치료',
        name: '박소* 놀이치료사',
        details: '연세의료원 소아정신과 3년 근무 / 놀이치료사 자격증 / 자폐스펙트럼 전문',
        hourlyRate: '6만원',
        status: '추천중',
        applications: 8
      },
      {
        id: 5013,
        category: '언어/인지치료',
        name: '이정* 언어재활사',
        details: '강남세브란스병원 재활의학과 4년 근무 / 언어재활사 1급 / 말더듬 교정 전문',
        hourlyRate: '6만 5천원',
        status: '등록완료',
        applications: 15
      },
      {
        id: 5012,
        category: '물리/작업치료',
        name: '최현* 작업치료사',
        details: '삼성서울병원 재활의학과 6년 근무 / 작업치료사 면허 / 감각통합치료 전문',
        hourlyRate: '7만 5천원',
        status: '추천중',
        applications: 6
      },
      {
        id: 5011,
        category: 'ABA/행동치료',
        name: '장미* ABA치료사',
        details: '서울아동병원 발달센터 4년 근무 / BCBA 국제자격 / 자폐행동치료 전문',
        hourlyRate: '8만원',
        status: '등록완료',
        applications: 18
      },
      {
        id: 5010,
        category: '미술/음악치료',
        name: '한예* 미술치료사',
        details: '서울시립아동병원 정신건강의학과 3년 근무 / 미술치료사 1급 / 정서치료 전문',
        hourlyRate: '5만 5천원',
        status: '추천중',
        applications: 9
      },
      {
        id: 5009,
        category: '언어/인지치료',
        name: '윤서* 언어재활사',
        details: '서울대어린이병원 재활의학과 7년 근무 / 언어재활사 1급 / 뇌성마비 언어치료 전문',
        hourlyRate: '8만 5천원',
        status: '등록완료',
        applications: 22
      },
      {
        id: 5008,
        category: '물리/작업치료',
        name: '김태* 물리치료사',
        details: '서울재활병원 소아재활과 5년 근무 / 물리치료사 면허 / 운동발달치료 전문',
        hourlyRate: '6만 8천원',
        status: '추천중',
        applications: 11
      }
    ],
    '인천/경기북부': [
      {
        id: 5107,
        category: '언어/인지치료',
        name: '정은* 언어재활사',
        details: '인하대병원 재활의학과 4년 근무 / 언어재활사 1급 / 조음장애 교정 전문',
        hourlyRate: '6만원',
        status: '추천중',
        applications: 7
      },
      {
        id: 5106,
        category: '놀이/감각통합치료',
        name: '강수* 놀이치료사',
        details: '고양시 아동발달센터 3년 근무 / 놀이치료사 자격증 / ADHD 치료 전문',
        hourlyRate: '5만 5천원',
        status: '등록완료',
        applications: 10
      },
      {
        id: 5105,
        category: '물리/작업치료',
        name: '윤지* 물리치료사',
        details: '명지병원 소아재활과 5년 근무 / 물리치료사 면허 / 뇌성마비 운동치료 전문',
        hourlyRate: '6만 8천원',
        status: '추천중',
        applications: 8
      },
      {
        id: 5104,
        category: 'ABA/행동치료',
        name: '조민* ABA치료사',
        details: '킨더하임 발달센터 2년 근무 / ABA 자격증 / 문제행동 수정 전문',
        hourlyRate: '7만원',
        status: '등록완료',
        applications: 5
      }
    ],
    '경기남부': [
      {
        id: 5205,
        category: '언어/인지치료',
        name: '송혜* 언어재활사',
        details: '분당서울대병원 재활의학과 6년 근무 / 언어재활사 1급 / 발음교정 전문',
        hourlyRate: '7만 2천원',
        status: '등록완료',
        applications: 14
      },
      {
        id: 5204,
        category: '물리/작업치료',
        name: '안성* 작업치료사',
        details: '용인세브란스병원 재활의학과 4년 근무 / 작업치료사 면허 / 손기능 훈련 전문',
        hourlyRate: '6만 5천원',
        status: '추천중',
        applications: 9
      },
      {
        id: 5203,
        category: 'ABA/행동치료',
        name: '임지* ABA치료사',
        details: '수원시 발달장애인센터 3년 근무 / BCBA 국제자격 / 사회성 훈련 전문',
        hourlyRate: '7만 8천원',
        status: '등록완료',
        applications: 12
      },
      {
        id: 5202,
        category: '미술/음악치료',
        name: '홍다* 음악치료사',
        details: '성남시 복지관 음악치료실 5년 근무 / 음악치료사 1급 / 정서안정 전문',
        hourlyRate: '5만 8천원',
        status: '추천중',
        applications: 6
      }
    ],
    '충청,강원,대전': [
      {
        id: 5305,
        category: '놀이/감각통합치료',
        name: '문소* 놀이치료사',
        details: '충남대병원 정신건강의학과 4년 근무 / 놀이치료사 자격증 / 트라우마 치료 전문',
        hourlyRate: '5만 5천원',
        status: '등록완료',
        applications: 8
      },
      {
        id: 5304,
        category: '언어/인지치료',
        name: '백민* 언어재활사',
        details: '대전을지대병원 재활의학과 3년 근무 / 언어재활사 1급 / 실어증 치료 전문',
        hourlyRate: '6만원',
        status: '추천중',
        applications: 5
      },
      {
        id: 5303,
        category: '물리/작업치료',
        name: '강희* 물리치료사',
        details: '춘천한림대병원 재활의학과 6년 근무 / 물리치료사 면허 / 보행훈련 전문',
        hourlyRate: '6만 3천원',
        status: '등록완료',
        applications: 11
      }
    ],
    '전라,경상,부산': [
      {
        id: 5405,
        category: '언어/인지치료',
        name: '장예* 언어재활사',
        details: '부산대병원 재활의학과 7년 근무 / 언어재활사 1급 / 삼킴장애 치료 전문',
        hourlyRate: '7만원',
        status: '등록완료',
        applications: 16
      },
      {
        id: 5404,
        category: '놀이/감각통합치료',
        name: '김다* 놀이치료사',
        details: '광주북구 아동발달센터 4년 근무 / 놀이치료사 자격증 / 발달지연 치료 전문',
        hourlyRate: '5만 7천원',
        status: '추천중',
        applications: 9
      },
      {
        id: 5403,
        category: '물리/작업치료',
        name: '이상* 작업치료사',
        details: '대구가톨릭대병원 재활의학과 5년 근무 / 작업치료사 면허 / 인지재활 전문',
        hourlyRate: '6만 8천원',
        status: '등록완료',
        applications: 13
      },
      {
        id: 5402,
        category: 'ABA/행동치료',
        name: '박지* ABA치료사',
        details: '울산시 장애인복지관 3년 근무 / ABA 자격증 / 자폐스펙트럼 치료 전문',
        hourlyRate: '7만 5천원',
        status: '추천중',
        applications: 7
      }
    ]
  };

  // 현재 선택된 지역의 치료사 가져오기
  const getCurrentTeachers = () => {
    if (selectedSidebarItem === '치료사등록') {
      // 모든 지역의 치료사를 합쳐서 보여줌
      return Object.values(allRegionalTeachers).flat();
    }
    return allRegionalTeachers[selectedSidebarItem as keyof typeof allRegionalTeachers] || [];
  };

  const filteredTeachers = getCurrentTeachers();

  const handleFilterSelect = () => {
    setShowFilterPopup(true);
  };

  const handleTherapyTypeChange = (therapyId: string) => {
    setSelectedTherapyTypes(prev => 
      prev.includes(therapyId) 
        ? prev.filter(id => id !== therapyId)
        : [...prev, therapyId]
    );
  };

  // 선택된 지역에 따른 제목과 탭 변경
  const getRegionTitle = () => {
    if (selectedSidebarItem === '치료사등록') return '정식(경력)치료사 등록';
    if (selectedSidebarItem === '정식(경력)치료사 등록') return '정식(경력)치료사 등록';
    if (selectedSidebarItem === '예비(학생)치료사 등록') return '예비(학생)치료사 등록';
    if (selectedSidebarItem === '치료사 등록안내') return '치료사 등록안내';
    return `${selectedSidebarItem}`;
  };

  const handleSidebarClick = (item: string) => {
    setSelectedSidebarItem(item);
  };

  // 브레드크럼 경로 생성
  const getBreadcrumbPath = () => {
    const basePath = [
      { label: '홈', href: '/' },
      { label: '치료사등록', href: '/teacher-apply' }
    ];
    
    if (selectedSidebarItem === '치료사등록') {
      basePath.push({ label: '정식(경력)치료사 등록', href: '#' });
    } else if (selectedSidebarItem !== '치료사등록') {
      basePath.push({ label: selectedSidebarItem, href: '#' });
    }
    
    return basePath;
  };

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="flex">
        {/* 사이드바 */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4">
            {sidebarItems.map((item, index) => (
              <div key={item} className={item === '치료사등록' ? 'mb-4' : 'mb-1'}>
                <button
                  onClick={() => handleSidebarClick(item)}
                  className={`w-full transition-colors ${
                    item === '치료사등록'
                      ? 'bg-blue-500 text-white text-lg font-bold rounded-lg h-[110px] flex items-center justify-center'
                      : selectedSidebarItem === item
                      ? 'bg-blue-50 text-blue-600 text-left px-4 py-3 rounded-lg text-sm font-medium'
                      : 'text-gray-700 hover:bg-gray-50 text-left px-4 py-3 rounded-lg text-sm font-medium'
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
          <div className="flex items-center justify-between mb-4">
            {/* 제목 */}
            <h1 className="text-2xl font-bold text-gray-900">{getRegionTitle()}</h1>
            
            {/* 브레드크럼 */}
            <div className="flex items-center text-sm text-gray-600">
              {getBreadcrumbPath().map((item, index) => (
                <div key={item.label} className="flex items-center">
                  {index > 0 && <span className="mx-2">&gt;</span>}
                  {item.href === '#' ? (
                    <span className="text-gray-900 font-medium">{item.label}</span>
                  ) : (
                    <Link href={item.href} className="hover:text-blue-600">{item.label}</Link>
                  )}
                </div>
              ))}
            </div>
          </div>



          {/* 메인 배너 - 치료사 등록 관련 페이지에서만 표시 */}
          {(selectedSidebarItem === '치료사등록' || selectedSidebarItem === '정식(경력)치료사 등록' || selectedSidebarItem === '예비(학생)치료사 등록') && (
            <div className="bg-gray-100 rounded-lg p-8 mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedSidebarItem === '예비(학생)치료사 등록' 
                    ? '예비 치료사 등록' 
                    : '가치를 찾으신 치료사 등록'
                  }
                </h2>
                <p className="text-lg text-gray-600">
                  {selectedSidebarItem === '예비(학생)치료사 등록' 
                    ? '학생 신분으로 치료사 경험을 쌓아보세요!' 
                    : '이력을 등록하고 가치를 치료사로 활동해보세요!'
                  }
                </p>
              </div>
              <div className="flex-shrink-0 ml-8">
                <div className="w-48 h-32 bg-green-200 rounded-lg flex items-center justify-center">
                  <span className="text-6xl">👩‍⚕️</span>
                </div>
              </div>
            </div>
          )}

          {/* 검색 폼 - 치료사 등록안내가 아닌 경우에만 표시 */}
          {selectedSidebarItem !== '치료사 등록안내' && (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
                <div className="flex gap-4 mb-4">
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {priceRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    placeholder="검색어를 입력해주세요"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                    검색
                  </button>
                </div>

                {/* 치료분야 체크박스 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">치료분야</h3>
                  <div className="grid grid-cols-5 gap-4">
                    {therapyCheckboxes.map((therapy) => (
                      <label key={therapy.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTherapyTypes.includes(therapy.id)}
                          onChange={() => handleTherapyTypeChange(therapy.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{therapy.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 치료사등록 헤더 */}
                                <div className="bg-white border border-gray-200 rounded-t-lg p-4 border-b-0">
                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => setShowRegistrationPopup(true)}
                        className="bg-white hover:bg-gray-50 text-black border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        치료사등록
                      </button>
                    </div>
                  </div>

              {/* 치료사 테이블 */}
              <div className="bg-white border border-gray-200 rounded-b-lg overflow-hidden border-t-0">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">분야</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">치료사 정보</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">치료비</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">진행</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTeachers.map((teacher, index) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {teacher.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            {teacher.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                              {teacher.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {teacher.details}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {teacher.hourlyRate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                            teacher.status === '추천중' 
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}>
                            {teacher.status}
                          </button>
                          <div className="text-xs text-blue-600 mt-1">
                            +{teacher.applications}
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
            </>
          )}

          {/* 치료사 등록안내 페이지 콘텐츠 */}
          {selectedSidebarItem === '치료사 등록안내' && (
            <div className="space-y-8">
              {/* 메인 안내 */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">더모든 키즈 치료사 등록 안내</h2>
                  <p className="text-gray-600 text-lg">전문 치료사로서 아이들의 성장을 도우며 안정적인 수입을 얻으세요</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-blue-900 mb-4">🩺 정식(경력) 치료사</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li>• 언어재활사, 작업치료사, 물리치료사 등 국가자격증 보유</li>
                      <li>• 병원 또는 센터에서 2년 이상 임상경험</li>
                      <li>• 시간당 5만원~10만원 수익</li>
                      <li>• 검증된 전문가로 우선 매칭</li>
                      <li>• 월 평균 80시간 이상 수업 보장</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-green-900 mb-4">🎓 예비(학생) 치료사</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li>• 관련 학과 3학년 이상 재학생</li>
                      <li>• 실습 과정 이수 또는 진행 중</li>
                      <li>• 시간당 3만원~5만원 수익</li>
                      <li>• 전문 멘토링 프로그램 제공</li>
                      <li>• 졸업 후 정식 등록 우선권</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 등록 절차 */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📋 등록 절차</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">1. 온라인 신청</h4>
                    <p className="text-sm text-gray-600">기본정보 및 자격증 업로드</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">2. 서류 검토</h4>
                    <p className="text-sm text-gray-600">3-5일 내 자격 검증</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💬</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">3. 화상 면접</h4>
                    <p className="text-sm text-gray-600">전문성 및 소통능력 확인</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✅</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">4. 활동 시작</h4>
                    <p className="text-sm text-gray-600">매칭 및 수업 진행</p>
                  </div>
                </div>
              </div>

              {/* 필요 서류 */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📎 필요 서류</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-blue-900 mb-4">✅ 공통 서류</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 신분증 사본</li>
                      <li>• 최종학력 증명서</li>
                      <li>• 경력증명서 (해당자)</li>
                      <li>• 범죄경력조회서</li>
                      <li>• 건강진단서</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900 mb-4">📜 자격증 관련</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 언어재활사 자격증</li>
                      <li>• 작업치료사 면허증</li>
                      <li>• 물리치료사 면허증</li>
                      <li>• 놀이치료사 자격증</li>
                      <li>• ABA 치료사 자격증</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 수익 및 혜택 */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💰 수익 및 혜택</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-yellow-50 p-6 rounded-lg text-center">
                    <h4 className="font-bold text-yellow-900 mb-2">월 평균 수익</h4>
                    <p className="text-2xl font-bold text-yellow-600 mb-2">200-400만원</p>
                    <p className="text-sm text-gray-600">주 20-30시간 기준</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg text-center">
                    <h4 className="font-bold text-green-900 mb-2">수수료</h4>
                    <p className="text-2xl font-bold text-green-600 mb-2">첫 수업만 15%</p>
                    <p className="text-sm text-gray-600">이후 수업료 100% 지급</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg text-center">
                    <h4 className="font-bold text-purple-900 mb-2">추가 혜택</h4>
                    <p className="text-sm text-purple-600 mb-2">• 교육비 지원</p>
                    <p className="text-sm text-purple-600 mb-2">• 보험료 지원</p>
                    <p className="text-sm text-purple-600">• 우수치료사 인증</p>
                  </div>
                </div>
              </div>

              {/* 연락처 */}
              <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-4">더 궁금한 점이 있으신가요?</h3>
                <p className="mb-4">전문 상담사가 1:1로 안내해드립니다</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className="flex items-center space-x-2">
                    <span>📞</span>
                    <span className="font-bold">1588-0000</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>💬</span>
                    <span className="font-bold">카카오톡: 더모든키즈</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✉️</span>
                    <span className="font-bold">info@momci.co.kr</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 필터 팝업 (향후 확장용) */}
      {showFilterPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">상세 필터</h3>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">경력</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>전체</option>
                  <option>1-3년</option>
                  <option>3-5년</option>
                  <option>5년 이상</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">자격증</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>전체</option>
                  <option>언어재활사</option>
                  <option>놀이치료사</option>
                  <option>작업치료사</option>
                  <option>물리치료사</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowFilterPopup(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 치료사 등록 팝업 */}
      {showRegistrationPopup && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4"
          style={{
            animation: isPopupClosing ? 'fadeOut 0.3s ease-out' : 'fadeIn 0.3s ease-out'
          }}
          onClick={closePopup}
        >
          <div 
            className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] min-h-[600px] overflow-hidden shadow-2xl flex flex-col"
            style={{
              animation: isPopupClosing ? 'slideOut 0.3s ease-out' : 'slideIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 팝업 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">더모든 키즈 전문가 프로필 등록</h3>
                <p className="text-base text-gray-600 mt-2">검증된 전문 치료사로 등록하여 안정적인 수익과 전문성 향상의 기회를 얻으세요.</p>
              </div>
              <button 
                onClick={closePopup}
                className="text-gray-400 hover:text-gray-600 text-3xl font-light min-w-[40px] h-[40px] flex items-center justify-center"
              >
                ×
              </button>
            </div>
            
            {/* 팝업 내용 - 스크롤 가능 */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                
                {/* 기본 정보 섹션 */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <span className="text-blue-600 text-lg">👤</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">기본 정보</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 프로필 사진 */}
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">프로필 사진 *</label>
                      <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-gray-500 text-base text-center">사진 등록<br/>(필수)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* 이름 */}
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">이름 *</label>
                        <input 
                          type="text" 
                          placeholder="김민지"
                          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      {/* 생년월일 */}
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">생년월일 *</label>
                        <input 
                          type="text" 
                          placeholder="YYYY-MM-DD"
                          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      {/* 성별 */}
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">성별 *</label>
                        <select className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>여성</option>
                          <option>남성</option>
                        </select>
                      </div>
                      
                      {/* 연락처 */}
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">연락처 *</label>
                        <input 
                          type="text" 
                          placeholder="010-1234-5678"
                          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 이메일 */}
                  <div className="mt-4">
                    <label className="block text-base font-medium text-gray-700 mb-2">이메일(ID) *</label>
                    <input 
                      type="email" 
                      placeholder="partn@example.com"
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* 주소 */}
                  <div className="mt-4">
                    <label className="block text-base font-medium text-gray-700 mb-2">주소 *</label>
                    <input 
                      type="text" 
                      placeholder="주소 검색"
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* 자격구분 */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">자격구분 *</label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="qualification" className="form-radio text-blue-600" />
                        <span className="ml-2 text-base">보유</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="qualification" className="form-radio text-blue-600" />
                        <span className="ml-2 text-base">미보유</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 프로필 정보 섹션 */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <span className="text-blue-600 text-lg">📋</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">프로필 정보 (학부모 공개)</h4>
                  </div>
                  
                  {/* 치료 활동 및 경력 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">치료 활동 및 경력 *</label>
                    <p className="text-sm text-gray-500 mb-3">
                      어떤 치료 분야에서 어떤 활동을 해왔는지, 어떤 경험과 성과를 가지고 계신지 자세히 작성해주세요. 
                      학부모님께 공개되는 내용입니다.
                    </p>
                    <textarea 
                      placeholder="예: 서울대학교병원 재활의학과에서 5년간 언어치료사로 근무하며 아동 언어발달 지연 전문 치료를 담당했습니다. 총 200명 이상의 아동을 담당하며 평균 80% 이상의 개선율을 보였습니다."
                      rows={4}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* 주요 치료 경력/전문 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">주요 치료 경력/전문 *</label>
                    <p className="text-sm text-gray-500 mb-3">
                      보유하신 전문 분야와 특화된 치료 기법, 주요 경력사항을 작성해주세요. 
                      (예: 병원명, 근무기간, 담당 업무, 보유 자격증 등)
                    </p>
                    <textarea 
                      placeholder="예: 언어재활사 1급, 놀이치료사 자격증 보유. 발음교정, 언어발달지연, 자폐스펙트럼 아동 전문. 연세의료원 소아재활의학과 (2019-2024), 삼성서울병원 언어치료실 (2017-2019) 근무 경력."
                      rows={4}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 경력 및 전문분야 섹션 */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  {/* 경력 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">🎯 경력 *</label>
                    <select className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>경력을 선택해주세요</option>
                      <option>1년 미만</option>
                      <option>1-2년</option>
                      <option>3-4년</option>
                      <option>5-7년</option>
                      <option>8년 이상</option>
                    </select>
                  </div>
                  
                  {/* 희망 치료 지역 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">치료 지역 (최대 3개) </label>
                    <input 
                      type="text" 
                      placeholder="예: 서울 강남구, 서초구, 송파구"
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* 치료 가능 요일 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">치료 가능 요일 *</label>
                    <div className="flex space-x-3">
                      {['월', '화', '수', '목', '금', '토', '일'].map(day => (
                        <label key={day} className="inline-flex items-center">
                          <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
                          <span className="ml-1 text-base">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* 치료 가능 시간 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">치료 가능 시간 *</label>
                    <input 
                      type="text" 
                      placeholder="예: 평일 오후 4시 이후 / 주말 오전 전원 가능"
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* 전문 분야 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">전문 분야 (중복 선택 가능)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        '언어치료', 'ABA치료', '놀이치료', '작업치료', 
                        '행동치료', '특수교육', '물리치료', '감각통합치료',
                        '인지치료', '미술치료', '음악치료', '심리치료',
                        '발달재활', '학습치료'
                      ].map(field => (
                        <label key={field} className="inline-flex items-center">
                          <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
                          <span className="ml-2 text-base">{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 자격 검증 섹션 */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <span className="text-blue-600 text-lg">🔍</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">자격 검증 (관리자 확인용)</h4>
                  </div>
                  
                  <p className="text-base text-gray-600 mb-4">
                    업로드하신 서류들은 관리자 검토 용도로만 사용되며, 학부모님께 공개되지 않습니다.
                  </p>
                  
                  {/* 학력 증빙 서류 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">학력 증빙 서류 (졸업증명서 등) *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <p className="text-base text-gray-500">파일을 여기에 드래그하거나 클릭하여 업로드하세요.</p>
                    </div>
                  </div>
                  
                  {/* 경력 증빙 서류 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">경력 증빙 서류 (재직증명서 등) *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <p className="text-base text-gray-500">파일을 여기에 드래그하거나 클릭하여 업로드하세요.</p>
                    </div>
                  </div>
                  
                  {/* 자격증 사본 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">자격증 사본 *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <p className="text-base text-gray-500">파일을 여기에 드래그하거나 클릭하여 업로드하세요.</p>
                    </div>
                  </div>
                </div>

                {/* 자신 정보 섹션 */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <span className="text-blue-600 text-lg">📄</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">계좌 정보 (관리자 확인용)</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* 은행명 */}
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">은행명 *</label>
                      <input 
                        type="text" 
                        placeholder="예: 국민은행"
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {/* 예금주명 */}
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">예금주명 *</label>
                      <input 
                        type="text" 
                        placeholder="예: 홍길동"
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  {/* 계좌번호 */}
                  <div className="mb-4">
                    <label className="block text-base font-medium text-gray-700 mb-2">계좌번호 *</label>
                    <input 
                      type="text" 
                      placeholder="- 없이 숫자만 입력"
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* 통장 사본 업로드 */}
                  <div className="mb-4">
                    <label className="block text-base font-medium text-gray-700 mb-2">통장 사본 *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <p className="text-base text-gray-500">통장 첫 페이지 사본을 업로드해주세요.</p>
                    </div>
                  </div>
                </div>

                {/* 최종 확인 및 동의 */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <span className="text-blue-600 text-lg">✓</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">최종 확인 및 동의</h4>
                  </div>
                  
                  <div className="space-y-3 text-base text-gray-700 mb-4">
                    <p>1. 제공한 개인정보는 플랫폼 내 치료사 활동, 정산, 세금 관련 업무에서만 사용되며, 제3자에게 제공되지 않습니다.</p>
                    <p>2. 제출한 자격증명서와 경력서류는 관리자 검토 후 승인여부를 결정하며, 허위정보 제공 시 등록이 취소될 수 있습니다.</p>
                    <p>3. 치료사 활동 중 발생하는 분쟁 또는 갈등에 대해서는 플랫폼의 중재를 받으며, 관련 규정에 따라 해결합니다.</p>
                    <p>4. 플랫폼은 치료사와 학부모 간의 매칭 서비스를 제공하며, 치료의 질과 효과에 대해서는 치료사가 직접 책임집니다.</p>
                    <p>5. 첫 수업 수수료를 제외한 모든 수업료는 100% 치료사에게 지급되며, 정산은 매월 말일 기준으로 익월 10일에 지급됩니다.</p>
                    <p>6. 외부 직거래는 금지되며, 발견 시 계약해지 및 법적 조치가 취해질 수 있습니다. 모든 거래는 플랫폼 내에서만 진행됩니다.</p>
                    <p>7. 본 약관에 동의함으로써 더모든 키즈의 치료사로서 전문성과 책임감을 가지고 활동할 것을 서약합니다.</p>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <input type="checkbox" className="form-checkbox text-blue-600 rounded mr-3" />
                    <span className="text-base text-gray-700">위 이용약관에 모두 동의합니다.</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 팝업 푸터 */}
            <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={closePopup}
                  className="px-8 py-3 text-base text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button className="px-10 py-3 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  프로필 등록 진행하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
