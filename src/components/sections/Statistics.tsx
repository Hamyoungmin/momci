'use client';

import { useEffect, useState, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { type SiteStatistics } from '@/lib/statistics';

// 카운트업 애니메이션을 위한 커스텀 훅
function useCountUp(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(end); // 즉시 end값으로 시작
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef<number | null>(null);
  
  // end 값이 변경되면 count도 즉시 업데이트
  useEffect(() => {
    setCount(end);
  }, [end]);

  const startCountUp = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutCubic 이징 함수 적용
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(start + (end - start) * easedProgress);
      
      setCount(currentValue);
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return { count, startCountUp, isAnimating };
}

export default function Statistics() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasStartedAnimation, setHasStartedAnimation] = useState(false);
  const [statsData, setStatsData] = useState<SiteStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  
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
              totalMatches: 100,
              totalTeachers: 40,
              parentSatisfaction: 98,
              lastUpdated: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('통계 데이터 처리 실패:', error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('실시간 통계 데이터 리스너 오류:', error);
        setLoading(false);
        // 에러 발생 시 기본값 사용
        setStatsData({
          totalMatches: 100,
          totalTeachers: 40,
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
    totalMatches: 100,
    totalTeachers: 40,
    parentSatisfaction: 98,
    lastUpdated: new Date().toISOString()
  };
  
  // 각 통계에 대한 카운트업 훅들 (기본값 보장)
  const count1 = useCountUp(displayData.totalMatches, 2000); // 누적 매칭건수
  const count2 = useCountUp(displayData.totalTeachers, 1800);  // 등록 전문 치료사
  const count3 = useCountUp(displayData.parentSatisfaction, 1500);    // 학부모 만족도
  
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      if (!hasStartedAnimation && !loading) {
        count1.startCountUp();
        count2.startCountUp();
        count3.startCountUp();
        setHasStartedAnimation(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  // 의존성을 최소화해 불필요한 재실행 방지
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasStartedAnimation]);

  const stats = [
    {
      title: "누적 매칭 건수",
      count: count1.count,
      unit: "건"
    },
    {
      title: "등록 전문 치료사", 
      count: count2.count,
      unit: "명"
    },
    {
      title: "학부모 만족도",
      count: count3.count,
      unit: "%"
    }
  ];

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 통계 지표들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => {
            // 숫자 포맷팅 함수
            const formatNumber = (num: number) => {
              return Math.floor(num).toLocaleString();
            };
            
            return (
              <div 
                key={index} 
                className={`text-center transform transition-all duration-700 delay-${index * 100} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                {/* 제목 */}
                <p className="text-xl text-blue-700 font-medium mb-4">
                  {stat.title}
                </p>
                
                {/* 통계 수치 */}
                <div className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                  {formatNumber(stat.count)} {stat.unit}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
