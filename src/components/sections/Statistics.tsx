'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { type SiteStatistics } from '@/lib/statistics';

export default function Statistics() {
  const [isVisible, setIsVisible] = useState(false);
  const [statsData, setStatsData] = useState<SiteStatistics | null>(null);
  
  // 통계 데이터를 Firebase에서 실시간으로 가져오기
  useEffect(() => {
    const statsRef = doc(db, 'statistics', 'site-stats');
    
    // 실시간 리스너 설정
    const unsubscribe = onSnapshot(statsRef, 
      (docSnapshot) => {
        try {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data() as SiteStatistics;
            setStatsData(data);
          } else {
            // 문서가 없으면 기본값 사용
            console.warn('통계 문서가 존재하지 않습니다. 기본값을 사용합니다.');
            setStatsData({
              totalMatches: 1275,
              totalTeachers: 3026,
              parentSatisfaction: 98,
              lastUpdated: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('통계 데이터 처리 실패:', error);
        }
      },
      (error) => {
        console.error('실시간 통계 데이터 리스너 오류:', error);
        // 에러 발생 시 기본값 사용
        setStatsData({
          totalMatches: 1275,
          totalTeachers: 3026,
          parentSatisfaction: 98,
          lastUpdated: new Date().toISOString()
        });
      }
    );

    // 컴포넌트 언마운트 시 리스너 정리
    return () => unsubscribe();
  }, []);
  
  // 로딩 중이거나 데이터가 없을 때는 기본값으로 표시
  const displayData = statsData || {
    totalMatches: 1275,
    totalTeachers: 3026,
    parentSatisfaction: 98,
    lastUpdated: new Date().toISOString()
  };
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      title: "누적 매칭 건수",
      count: displayData.totalMatches,
      unit: ""
    },
    {
      title: "등록 전문 치료사", 
      count: displayData.totalTeachers,
      unit: ""
    },
    {
      title: "학부모 만족도",
      count: displayData.parentSatisfaction,
      unit: "%"
    }
  ];

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 통계 지표들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            // 숫자 포맷팅 함수
            const formatNumber = (num: number) => {
              return Math.floor(num).toLocaleString();
            };
            
            return (
              <div 
                key={index} 
                className={`bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center transform transition-all duration-700 delay-${index * 100} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                {/* 제목 */}
                <p className="text-base text-blue-700 font-medium mb-4">
                  {stat.title}
                </p>
                
                {/* 통계 수치 */}
                <div className="text-4xl lg:text-5xl font-bold text-blue-600">
                  {formatNumber(stat.count)}{stat.unit}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
