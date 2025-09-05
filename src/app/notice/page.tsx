'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Notice {
  id: string;
  title: string;
  date?: string;
  startDate?: string;
  isNew?: boolean;
  isImportant?: boolean;
  type?: 'general' | 'important' | 'urgent';
  content: string;
  createdAt?: Date | Timestamp | null;
}

export default function NoticePage() {
  const [firebaseNotices, setFirebaseNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotice, setExpandedNotice] = useState<string | null>(null);

  // Firebase에서 실제 공지사항 가져오기
  useEffect(() => {
    const noticesQuery = query(
      collection(db, 'notices'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(noticesQuery, (snapshot) => {
      const noticesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          // 날짜 필드 처리 (기존 date 또는 새로운 startDate 사용)
          date: data.date || (data.startDate ? data.startDate.split(' ')[0] : new Date().toISOString().split('T')[0]),
          // 중요도 처리 (기존 isImportant 또는 type 기반)
          isImportant: data.isImportant || data.type === 'important' || data.type === 'urgent',
        } as Notice;
      });
      
      setFirebaseNotices(noticesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 더미 데이터 (기존 디자인 유지용)
  const dummyNotices: Notice[] = [
    {
      id: '1',
      title: "[중요] 새로운 치료사 매칭 시스템 도입 안내",
      date: "2024.01.15",
      isNew: true,
      isImportant: true,
      type: 'important',
      content: "더 정확하고 빠른 매칭을 위해 새로운 AI 기반 매칭 시스템을 도입합니다.",
    },
    {
      id: '2',
      title: "설날 연휴 고객센터 운영 안내",
      date: "2024.01.10",
      isNew: true,
      isImportant: false,
      type: 'general',
      content: "설날 연휴 기간 중 고객센터 운영 시간이 변경됩니다.",
    },
    {
      id: '3',
      title: "치료사 교육 프로그램 업데이트",
      date: "2024.01.05",
      isNew: false,
      isImportant: false,
      type: 'general',
      content: "치료사 분들의 전문성 향상을 위한 새로운 교육 과정을 추가했습니다.",
    },
    {
      id: '4',
      title: "이용권 할인 이벤트 종료 안내",
      date: "2023.12.28",
      isNew: false,
      isImportant: false,
      type: 'general',
      content: "연말 특별 할인 이벤트가 12월 31일로 종료됩니다.",
    },
    {
      id: '5',
      title: "[서비스 점검] 시스템 정기 점검 안내",
      date: "2023.12.20",
      isNew: false,
      isImportant: true,
      type: 'important',
      content: "서비스 품질 향상을 위한 정기 점검을 실시합니다.",
    },
  ];

  // 드롭다운 토글 함수 (한 번에 하나만 열리도록)
  const toggleNotice = (noticeId: string) => {
    setExpandedNotice(prev => prev === noticeId ? null : noticeId);
  };

  // Firebase 데이터와 더미 데이터 병합 (실제 데이터가 우선)
  const allNotices = [
    ...firebaseNotices,
    ...dummyNotices.filter(dummy => 
      !firebaseNotices.some(firebase => firebase.title === dummy.title)
    )
  ].sort((a, b) => {
    // 긴급 공지사항을 최우선으로
    const aUrgent = a.type === 'urgent';
    const bUrgent = b.type === 'urgent';
    if (aUrgent && !bUrgent) return -1;
    if (!aUrgent && bUrgent) return 1;
    
    // 중요 공지사항을 다음 우선순위로 (새로운 type 또는 기존 isImportant)
    const aImportant = a.type === 'important' || (!a.type && a.isImportant);
    const bImportant = b.type === 'important' || (!b.type && b.isImportant);
    if (aImportant && !bImportant) return -1;
    if (!aImportant && bImportant) return 1;
    
    // 날짜순 정렬 (최신순)
    const dateA = a.date ? new Date(a.date) : new Date();
    const dateB = b.date ? new Date(b.date) : new Date();
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero 섹션 */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">공지사항</h1>
            <p className="text-xl text-gray-600">
              모든별 키즈의 새로운 소식과 중요한 안내사항을 확인하세요
            </p>
          </div>
        </div>
      </section>

      {/* 공지사항 목록 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">공지사항을 불러오는 중...</p>
            </div>
          ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* 헤더 */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">전체 공지사항</h2>
                <span className="text-sm text-gray-500">총 {allNotices.length}건</span>
              </div>
            </div>

            {/* 목록 */}
            <div className="divide-y divide-gray-200">
              {allNotices.map((notice) => {
                const isExpanded = expandedNotice === notice.id.toString();
                return (
                  <div key={notice.id} className="transition-all duration-200">
                    <div 
                      className="px-6 py-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => toggleNotice(notice.id.toString())}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {/* 유형 배지 (새로운 type 필드 우선, 기존 isImportant 백업) */}
                            {notice.type === 'urgent' && (
                              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                                긴급
                              </span>
                            )}
                            {notice.type === 'important' && (
                              <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full font-medium">
                                중요
                              </span>
                            )}
                            {notice.type === 'general' && (
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                                일반
                              </span>
                            )}
                            {/* 기존 isImportant 필드 지원 (type이 없는 경우) */}
                            {!notice.type && notice.isImportant && (
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
                          <p className="text-sm text-gray-500">{notice.date}</p>
                        </div>
                        <div className="ml-4">
                          <svg 
                            className={`h-5 w-5 text-gray-400 transform transition-transform duration-300 ${
                              isExpanded ? 'rotate-90' : ''
                            }`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* 드롭다운 내용 */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                        <div className="max-w-none text-gray-700 leading-relaxed">
                          {notice.content.split('\n').map((line, index) => (
                            <p key={index} className="mb-4 text-base leading-7 last:mb-0">
                              {line || '\u00A0'} {/* 빈 줄도 공간 차지하도록 */}
                            </p>
                          ))}
                          
                          {/* 추가 여백과 구분선 */}
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 italic">
                              자세한 문의사항이 있으시면 고객센터로 연락해 주세요.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
          )}
        </div>
      </section>

      {/* 중요 안내 */}

    </div>
  );
}
