import React from 'react';

export default function NoticePage() {
  const notices = [
    {
      id: 1,
      title: "[중요] 새로운 치료사 매칭 시스템 도입 안내",
      date: "2024.01.15",
      isNew: true,
      isImportant: true,
      content: "더 정확하고 빠른 매칭을 위해 새로운 AI 기반 매칭 시스템을 도입합니다.",
    },
    {
      id: 2,
      title: "설날 연휴 고객센터 운영 안내",
      date: "2024.01.10",
      isNew: true,
      isImportant: false,
      content: "설날 연휴 기간 중 고객센터 운영 시간이 변경됩니다.",
    },
    {
      id: 3,
      title: "치료사 교육 프로그램 업데이트",
      date: "2024.01.05",
      isNew: false,
      isImportant: false,
      content: "치료사 분들의 전문성 향상을 위한 새로운 교육 과정을 추가했습니다.",
    },
    {
      id: 4,
      title: "이용권 할인 이벤트 종료 안내",
      date: "2023.12.28",
      isNew: false,
      isImportant: false,
      content: "연말 특별 할인 이벤트가 12월 31일로 종료됩니다.",
    },
    {
      id: 5,
      title: "[서비스 점검] 시스템 정기 점검 안내",
      date: "2023.12.20",
      isNew: false,
      isImportant: true,
      content: "서비스 품질 향상을 위한 정기 점검을 실시합니다.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero 섹션 */}
      <section className="bg-blue-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">공지사항</h1>
            <p className="text-xl text-blue-100">
              모든별 키즈의 새로운 소식과 중요한 안내사항을 확인하세요
            </p>
          </div>
        </div>
      </section>

      {/* 공지사항 목록 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* 헤더 */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">전체 공지사항</h2>
                <span className="text-sm text-gray-500">총 {notices.length}건</span>
              </div>
            </div>

            {/* 목록 */}
            <div className="divide-y divide-gray-200">
              {notices.map((notice) => (
                <div key={notice.id} className="px-6 py-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {notice.isImportant && (
                          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                            중요
                          </span>
                        )}
                        {notice.isNew && (
                          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                            NEW
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-500 transition-colors">
                        {notice.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">{notice.content}</p>
                      <p className="text-sm text-gray-500">{notice.date}</p>
                    </div>
                    <div className="ml-4">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2">
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  ← 이전
                </button>
                <button className="px-3 py-2 text-sm bg-blue-500 text-white rounded-md">1</button>
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  2
                </button>
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  3
                </button>
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  다음 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 중요 안내 */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-100 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800 mb-2">공지사항 알림 서비스</h3>
                <p className="text-blue-700 text-sm mb-3">
                  중요한 공지사항을 놓치지 않도록 알림 서비스를 신청하세요.
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  알림 신청하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
