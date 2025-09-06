'use client';

import { useEffect, useState, useRef } from 'react';

// 카운트업 애니메이션을 위한 커스텀 훅
function useCountUp(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef<number | null>(null);

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
  
  // 각 통계에 대한 카운트업 훅들
  const count1 = useCountUp(34575, 2000); // 누적 매칭건수
  const count2 = useCountUp(8983, 1800);  // 등록 전문 치료사
  const count3 = useCountUp(98, 1500);    // 학부모 만족도
  
  useEffect(() => {
    setIsVisible(true);
    // 컴포넌트가 보여진 후 0.5초 뒤에 애니메이션 시작
    const timer = setTimeout(() => {
      if (!hasStartedAnimation) {
        count1.startCountUp();
        count2.startCountUp();
        count3.startCountUp();
        setHasStartedAnimation(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [count1, count2, count3, hasStartedAnimation]);

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
    <section className="py-20 bg-gray-50">
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
