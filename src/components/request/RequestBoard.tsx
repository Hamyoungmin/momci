'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RequestBoard() {
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('서울');
  const [selectedTab, setSelectedTab] = useState('서울');
  const [selectedLocation, setSelectedLocation] = useState('희망지역을 선택하세요');
  const [selectedAge, setSelectedAge] = useState('희망연령을 선택하세요');
  const [selectedTime, setSelectedTime] = useState('희망시간을 입력하세요');
  const [showTimePopup, setShowTimePopup] = useState(false);

  const sidebarItems = ['홈티매칭', '서울', '인천/경기북부', '경기남부', '충청,강원,대전', '전라,경상,부산'];
  const tabs = ['서울', '인천/경기북부', '경기남부', '충청,강원,대전', '전라,경상,부산'];
  const locations = ['희망지역을 선택하세요', '강남구', '강서구', '서초구', '송파구', '마포구', '용산구'];
  const ages = ['희망연령을 선택하세요', '0-3세', '4-6세', '초등학생', '중학생', '고등학생'];
  const times = ['희망시간을 입력하세요', '09:00-12:00', '13:00-16:00', '17:00-20:00'];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  // 지역별 게시글 데이터
  const allRegionalPosts = {
    '서울': [
      {
        id: 6205,
        category: '마포구 창전동',
        title: '초3학년 남 주2회 언어치료 홈티 모집',
        details: '월,수 5시~6시',
        applications: 2
      },
      {
        id: 6204,
        category: '서초구 반포동',
        title: '초1학년 남 주2회 놀이치료 홈티 모집',
        details: '화,수,목,금 7시~8시 / 토,일 9시~10시',
        applications: 4
      },
      {
        id: 6203,
        category: '성북구 석관동',
        title: '초1학년 남 주2회 ABA치료 홈티 모집',
        details: '월,수 7시~8시 / 화,목 4시~6시',
        applications: 1
      },
      {
        id: 6202,
        category: '강동구 상일동',
        title: '5세 2개월 남 주2회 언어치료 홈티 모집',
        details: '월,수,금 2시~4시',
        applications: 2
      },
      {
        id: 6201,
        category: '용산구 이태원동',
        title: '초2학년 여 주1회 감각통합 홈티 모집',
        details: '토,일 10시~12시',
        applications: 3
      }
    ],
    '인천/경기북부': [
      {
        id: 6305,
        category: '인천 부평구',
        title: '초2학년 여 주3회 물리치료 홈티 모집',
        details: '월,수,금 4시~5시',
        applications: 3
      },
      {
        id: 6304,
        category: '고양시 일산동구',
        title: '유치원생 남 주1회 놀이치료 홈티 모집',
        details: '토 10시~12시',
        applications: 5
      },
      {
        id: 6303,
        category: '파주시 교하읍',
        title: '초3학년 남 주2회 언어치료 홈티 모집',
        details: '화,목 6시~7시',
        applications: 2
      },
      {
        id: 6302,
        category: '김포시 장기동',
        title: '6세 여 주2회 감각통합 홈티 모집',
        details: '월,금 3시~4시',
        applications: 1
      }
    ],
    '경기남부': [
      {
        id: 6405,
        category: '수원시 영통구',
        title: '초1학년 남 주2회 ABA치료 홈티 모집',
        details: '화,목 5시~6시',
        applications: 4
      },
      {
        id: 6404,
        category: '성남시 분당구',
        title: '초4학년 여 주1회 인지치료 홈티 모집',
        details: '일 2시~4시',
        applications: 2
      },
      {
        id: 6403,
        category: '안양시 만안구',
        title: '유치원생 남 주3회 언어치료 홈티 모집',
        details: '월,수,금 4시~5시',
        applications: 6
      },
      {
        id: 6402,
        category: '용인시 기흥구',
        title: '초2학년 남 주2회 놀이치료 홈티 모집',
        details: '화,목 7시~8시',
        applications: 3
      }
    ],
    '충청,강원,대전': [
      {
        id: 6505,
        category: '대전 유성구',
        title: '초3학년 남 주2회 언어치료 홈티 모집',
        details: '월,수 6시~7시',
        applications: 2
      },
      {
        id: 6504,
        category: '천안시 동남구',
        title: '유치원생 여 주1회 놀이치료 홈티 모집',
        details: '토 11시~12시',
        applications: 3
      },
      {
        id: 6503,
        category: '춘천시 효자동',
        title: '초1학년 남 주2회 감각통합 홈티 모집',
        details: '화,목 5시~6시',
        applications: 1
      },
      {
        id: 6502,
        category: '청주시 흥덕구',
        title: '5세 남 주3회 ABA치료 홈티 모집',
        details: '월,수,금 3시~4시',
        applications: 4
      }
    ],
    '전라,경상,부산': [
      {
        id: 6605,
        category: '부산 해운대구',
        title: '초2학년 여 주2회 언어치료 홈티 모집',
        details: '월,목 4시~5시',
        applications: 3
      },
      {
        id: 6604,
        category: '광주 북구',
        title: '유치원생 남 주1회 놀이치료 홈티 모집',
        details: '토 9시~11시',
        applications: 2
      },
      {
        id: 6603,
        category: '대구 수성구',
        title: '초3학년 남 주2회 물리치료 홈티 모집',
        details: '화,금 6시~7시',
        applications: 5
      },
      {
        id: 6602,
        category: '울산 남구',
        title: '6세 여 주3회 감각통합 홈티 모집',
        details: '월,수,금 2시~3시',
        applications: 1
      }
    ]
  };

  // 현재 선택된 지역의 게시글 가져오기
  const getCurrentPosts = () => {
    if (selectedSidebarItem === '홈티매칭') {
      // 모든 지역의 게시글을 합쳐서 보여줌
      return Object.values(allRegionalPosts).flat();
    }
    return allRegionalPosts[selectedSidebarItem as keyof typeof allRegionalPosts] || [];
  };

  const filteredPosts = getCurrentPosts();

  const handleTimeSelect = () => {
    setShowTimePopup(true);
  };

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
                      ? 'bg-blue-500 text-white text-xl font-bold rounded-lg h-[110px] flex items-center justify-center'
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
            <div className="flex space-x-0 border border-gray-300 rounded-lg overflow-hidden">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-6 py-3 text-sm font-medium border-r border-gray-300 last:border-r-0 ${
                    selectedTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 검색 폼 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex gap-4">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ages.map((age) => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
              
              <button
                onClick={handleTimeSelect}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-left text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {selectedTime}
              </button>
              
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                홈티검색
              </button>
            </div>
          </div>

          {/* 게시글 테이블 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
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

      {/* 시간 검색 팝업 */}
      {showTimePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">시간 선택</h3>
              <button
                onClick={() => setShowTimePopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setSelectedTime(time);
                    setShowTimePopup(false);
                  }}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded text-sm font-medium transition-colors"
                >
                  {time}
                </button>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowTimePopup(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
