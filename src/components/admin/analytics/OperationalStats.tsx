'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface RegionStat {
  name: string;
  count: number;
  percentage: number;
}

interface TreatmentStat {
  name: string;
  count: number;
  percentage: number;
}

interface MonthlyTrend {
  month: string;
  matches: number;
  success: number;
}

interface OperationalStatsProps {
  period: string;
}

export default function OperationalStats({ period }: OperationalStatsProps) {
  // 실제 데이터 (Firebase에서 실시간으로 가져오기)
  const [memberStats, setMemberStats] = useState({
    totalMembers: 0,
    newMembers: {
      parents: 0,
      teachers: 0,
      total: 0
    },
    memberRatio: {
      parents: 0,
      teachers: 0
    },
    regions: [] as RegionStat[]
  });

  const [matchingStats, setMatchingStats] = useState({
    totalMatches: 0,
    successRate: 0,
    avgMatchingTime: 0,
    popularTreatments: [] as TreatmentStat[],
    monthlyTrend: [] as MonthlyTrend[]
  });

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // 기간 계산
    const getPeriodDate = () => {
      const now = new Date();
      switch (period) {
        case '7d':
          return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case '30d':
          return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case '90d':
          return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        case '1y':
          return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        default:
          return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
    };

    const periodStart = getPeriodDate();

    // 1. 회원 통계 (실시간)
    const usersUnsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const allUsers = snapshot.docs;
        const totalCount = allUsers.length;
        
        // 신규 가입자 (선택된 기간)
        const newUsers = allUsers.filter(doc => {
          const createdAt = doc.data().createdAt?.toDate();
          return createdAt && createdAt >= periodStart;
        });
        
        const newParents = newUsers.filter(doc => doc.data().userType === 'parent').length;
        const newTeachers = newUsers.filter(doc => doc.data().userType === 'therapist').length;
        
        // 전체 회원 비율
        const totalParents = allUsers.filter(doc => doc.data().userType === 'parent').length;
        const totalTeachers = allUsers.filter(doc => doc.data().userType === 'therapist').length;
        
        // 지역별 분포
        const regionMap = new Map<string, number>();
        allUsers.forEach(doc => {
          const region = doc.data().region || '미지정';
          regionMap.set(region, (regionMap.get(region) || 0) + 1);
        });
        
        const regions = Array.from(regionMap.entries())
          .map(([name, count]) => ({
            name,
            count,
            percentage: Math.round((count / totalCount) * 100)
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        setMemberStats({
          totalMembers: totalCount,
          newMembers: {
            parents: newParents,
            teachers: newTeachers,
            total: newUsers.length
          },
          memberRatio: {
            parents: totalCount > 0 ? Math.round((totalParents / totalCount) * 100) : 0,
            teachers: totalCount > 0 ? Math.round((totalTeachers / totalCount) * 100) : 0
          },
          regions
        });
      }
    );
    unsubscribers.push(usersUnsubscribe);

    // 2. 매칭 통계 (실시간)
    const matchingsQuery = query(
      collection(db, 'matchings'),
      where('createdAt', '>=', Timestamp.fromDate(periodStart))
    );

    const matchingsUnsubscribe = onSnapshot(
      matchingsQuery,
      (snapshot) => {
        const allMatchings = snapshot.docs;
        const totalMatches = allMatchings.length;
        const successfulMatches = allMatchings.filter(
          doc => doc.data().status === 'completed'
        ).length;
        
        // 평균 매칭 소요 시간 계산
        let totalDays = 0;
        let completedCount = 0;
        allMatchings.forEach(doc => {
          const data = doc.data();
          if (data.status === 'completed' && data.createdAt && data.completedAt) {
            const created = data.createdAt.toDate();
            const completed = data.completedAt.toDate();
            const days = Math.ceil((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
            totalDays += days;
            completedCount++;
          }
        });
        
        const avgMatchingTime = completedCount > 0 ? Math.round(totalDays / completedCount) : 0;
        
        setMatchingStats(prev => ({
          ...prev,
          totalMatches,
          successRate: totalMatches > 0 ? Math.round((successfulMatches / totalMatches) * 100) : 0,
          avgMatchingTime
        }));
      }
    );
    unsubscribers.push(matchingsUnsubscribe);

    // 3. 인기 치료 종목 (실시간)
    const postsQuery = query(
      collection(db, 'posts'),
      where('createdAt', '>=', Timestamp.fromDate(periodStart))
    );

    const postsUnsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const treatmentMap = new Map<string, number>();
        snapshot.docs.forEach(doc => {
          const treatment = doc.data().treatment || '미지정';
          treatmentMap.set(treatment, (treatmentMap.get(treatment) || 0) + 1);
        });
        
        const total = snapshot.size;
        const popularTreatments = Array.from(treatmentMap.entries())
          .map(([name, count]) => ({
            name,
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        setMatchingStats(prev => ({
          ...prev,
          popularTreatments
        }));
      }
    );
    unsubscribers.push(postsUnsubscribe);

    // 4. 월별 매칭 추이 (최근 6개월)
    const generateMonthlyTrend = () => {
      const months = [];
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
          month: `${monthDate.getMonth() + 1}월`,
          date: monthDate
        });
      }
      
      // 각 월별 매칭 데이터 조회
      months.forEach(({ month, date }) => {
        const monthStart = new Date(date);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthMatchingsQuery = query(
          collection(db, 'matchings'),
          where('createdAt', '>=', Timestamp.fromDate(monthStart)),
          where('createdAt', '<=', Timestamp.fromDate(monthEnd))
        );
        
        const unsubMonth = onSnapshot(
          monthMatchingsQuery,
          (snapshot) => {
            const matches = snapshot.size;
            const success = snapshot.docs.filter(
              doc => doc.data().status === 'completed'
            ).length;
            
            setMatchingStats(prev => {
              const newTrend = [...prev.monthlyTrend];
              const existingIndex = newTrend.findIndex(t => t.month === month);
              
              if (existingIndex >= 0) {
                newTrend[existingIndex] = { month, matches, success };
              } else {
                newTrend.push({ month, matches, success });
              }
              
              return {
                ...prev,
                monthlyTrend: newTrend.sort((a, b) => {
                  const aMonth = parseInt(a.month);
                  const bMonth = parseInt(b.month);
                  return aMonth - bMonth;
                })
              };
            });
          }
        );
        unsubscribers.push(unsubMonth);
      });
    };
    
    generateMonthlyTrend();

    // 클린업
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [period]);

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case '7d': return '최근 7일';
      case '30d': return '최근 30일';
      case '90d': return '최근 90일';
      case '1y': return '최근 1년';
      default: return '선택된 기간';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">운영 통계</h3>
        <span className="text-sm text-gray-600">{getPeriodLabel(period)} 기준</span>
      </div>

      {/* 가입자 통계 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">👥 가입자 통계</h4>
          
          {/* 신규 가입자 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">신규 가입자 ({getPeriodLabel(period)})</span>
              <span className="text-lg font-semibold text-gray-900">{memberStats.newMembers.total}명</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">학부모</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-pink-500 h-2 rounded-full" 
                      style={{ width: `${(memberStats.newMembers.parents / memberStats.newMembers.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{memberStats.newMembers.parents}명</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">치료사</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-cyan-500 h-2 rounded-full" 
                      style={{ width: `${(memberStats.newMembers.teachers / memberStats.newMembers.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{memberStats.newMembers.teachers}명</span>
                </div>
              </div>
            </div>
            
            {/* 회원 비율 */}
            <div className="pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 mb-3 block">전체 회원 비율</span>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span className="text-sm">학부모 {memberStats.memberRatio.parents}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span className="text-sm">치료사 {memberStats.memberRatio.teachers}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 지역별 분포 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">지역별 분포</h4>
          
          <div className="space-y-3">
            {memberStats.regions.map((region, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{region.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{region.count}명</span>
                  <span className="text-xs text-gray-500 w-12 text-right">({region.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 매칭 통계 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">🤝 매칭 성과</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{matchingStats.successRate}%</div>
                <div className="text-sm text-green-700">매칭 성공률</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{matchingStats.avgMatchingTime}일</div>
                <div className="text-sm text-blue-700">평균 매칭 소요시간</div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 mb-3 block">월별 매칭 추이 (최근 6개월)</span>
              <div className="space-y-2">
                {matchingStats.monthlyTrend.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{data.month}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">{data.success}/{data.matches}</span>
                      <span className="text-xs text-green-600">
                        ({Math.round((data.success / data.matches) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 인기 치료 종목 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">인기 치료 종목</h4>
          
          <div className="space-y-3">
            {matchingStats.popularTreatments.map((treatment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-900">{treatment.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${treatment.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{treatment.count}건</span>
                  <span className="text-xs text-gray-500 w-12 text-right">({treatment.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 트렌드 분석 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-base font-medium text-gray-900 mb-4">성장 트렌드</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2 font-bold">데이터</div>
            <div className="text-lg font-semibold text-gray-900">+12.5%</div>
            <div className="text-sm text-gray-600">회원 증가율 (전월 대비)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2 font-bold">성장</div>
            <div className="text-lg font-semibold text-gray-900">+8.7%</div>
            <div className="text-sm text-gray-600">매칭 성공률 증가</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2 font-bold">사용자</div>
            <div className="text-lg font-semibold text-gray-900">4.8/5.0</div>
            <div className="text-sm text-gray-600">평균 서비스 만족도</div>
          </div>
        </div>
      </div>
    </div>
  );
}
