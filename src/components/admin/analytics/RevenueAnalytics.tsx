'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PaymentMethod {
  method: string;
  percentage: number;
  amount: number;
  count: number;
}

interface Performer {
  name: string;
  commission: number;
  transactions: number;
}

interface MonthlyRevenueTrend {
  month: string;
  total: number;
  subscription: number;
  commission: number;
}

interface RevenueAnalyticsProps {
  period: string;
}

export default function RevenueAnalytics({ period }: RevenueAnalyticsProps) {
  // 실제 데이터 (Firebase에서 실시간으로 가져오기)
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    monthlyGrowth: 0,
    subscriptionRevenue: {
      parents: 0,
      teachers: 0,
      total: 0
    },
    commissionRevenue: 0,
    monthlyTrend: [] as MonthlyRevenueTrend[]
  });

  const [subscriptionStats, setSubscriptionStats] = useState({
    activeSubscriptions: 0,
    newSubscriptions: 0,
    canceledSubscriptions: 0,
    churnRate: 0,
    avgRevenuePerUser: 0,
    lifetimeValue: 0,
    paymentMethods: [] as PaymentMethod[]
  });

  const commissionStats = {
    totalTransactions: 0,
    avgCommissionRate: 15, // 기본 수수료율 15%
    avgTransactionValue: 0,
    topPerformers: [] as Performer[]
  };

  const [projections, setProjections] = useState({
    nextMonth: 0,
    nextQuarter: 0,
    yearEnd: 0,
    growthFactor: 0
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

    // 1. 전체 매출 통계 (실시간)
    const paymentsQuery = query(
      collection(db, 'payments'),
      where('createdAt', '>=', Timestamp.fromDate(periodStart))
    );

    const paymentsUnsubscribe = onSnapshot(
      paymentsQuery,
      (snapshot) => {
        let totalRevenue = 0;
        let parentSubs = 0;
        let teacherSubs = 0;
        let commissionRevenue = 0;

        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const amount = data.amount || 0;
          totalRevenue += amount;

          if (data.type === 'subscription' || data.type === 'addon_token') {
            if (data.subscriptionType === 'parent') {
              parentSubs += amount;
            } else if (data.subscriptionType === 'therapist' || data.subscriptionType === 'teacher') {
              teacherSubs += amount;
            }
          } else if (data.type === 'lesson') {
            // 수업료의 15% 수수료
            commissionRevenue += amount * 0.15;
          }
        });

        setRevenueStats(prev => ({
          ...prev,
          totalRevenue,
          subscriptionRevenue: {
            parents: parentSubs,
            teachers: teacherSubs,
            total: parentSubs + teacherSubs
          },
          commissionRevenue
        }));
      }
    );
    unsubscribers.push(paymentsUnsubscribe);

    // 2. 구독 통계 (실시간)
    const subscriptionsQuery = query(
      collection(db, 'user-subscriptions'),
      where('purchaseDate', '>=', Timestamp.fromDate(periodStart))
    );

    const subscriptionsUnsubscribe = onSnapshot(
      subscriptionsQuery,
      (snapshot) => {
        const allSubs = snapshot.docs;
        const active = allSubs.filter(doc => doc.data().status === 'active').length;
        const newSubs = allSubs.length;
        const canceled = allSubs.filter(doc => doc.data().status === 'cancelled').length;
        
        const totalAmount = allSubs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
        const avgRevenuePerUser = newSubs > 0 ? Math.round(totalAmount / newSubs) : 0;
        
        // 이탈률 계산 (해지 / 전체)
        const churnRate = newSubs > 0 ? Math.round((canceled / newSubs) * 100 * 10) / 10 : 0;
        
        // 생애가치 계산 (평균 구독료 / 이탈률, 단순화)
        const lifetimeValue = churnRate > 0 ? Math.round(avgRevenuePerUser / (churnRate / 100)) : avgRevenuePerUser * 10;

        setSubscriptionStats(prev => ({
          ...prev,
          activeSubscriptions: active,
          newSubscriptions: newSubs,
          canceledSubscriptions: canceled,
          churnRate,
          avgRevenuePerUser,
          lifetimeValue
        }));
      }
    );
    unsubscribers.push(subscriptionsUnsubscribe);

    // 3. 월별 매출 추이 (최근 6개월)
    const generateMonthlyRevenueTrend = () => {
      const months = [];
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
          month: `${monthDate.getMonth() + 1}월`,
          date: monthDate
        });
      }
      
      // 각 월별 매출 데이터 조회
      months.forEach(({ month, date }) => {
        const monthStart = new Date(date);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthPaymentsQuery = query(
          collection(db, 'payments'),
          where('createdAt', '>=', Timestamp.fromDate(monthStart)),
          where('createdAt', '<=', Timestamp.fromDate(monthEnd))
        );
        
        const unsubMonth = onSnapshot(
          monthPaymentsQuery,
          (snapshot) => {
            let subscription = 0;
            let commission = 0;
            
            snapshot.docs.forEach(doc => {
              const data = doc.data();
              const amount = data.amount || 0;
              
              if (data.type === 'subscription' || data.type === 'addon_token') {
                subscription += amount;
              } else if (data.type === 'lesson') {
                commission += amount * 0.15;
              }
            });
            
            const total = subscription + commission;
            
            setRevenueStats(prev => {
              const newTrend = [...prev.monthlyTrend];
              const existingIndex = newTrend.findIndex(t => t.month === month);
              
              if (existingIndex >= 0) {
                newTrend[existingIndex] = { month, total, subscription, commission };
              } else {
                newTrend.push({ month, total, subscription, commission });
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
    
    generateMonthlyRevenueTrend();

    // 4. 매출 예측 (단순 선형 추정)
    setTimeout(() => {
      setRevenueStats(current => {
        const recentMonths = current.monthlyTrend.slice(-3);
        if (recentMonths.length >= 2) {
          const avgGrowth = recentMonths.reduce((sum, m, i) => {
            if (i === 0) return 0;
            const growth = ((m.total - recentMonths[i - 1].total) / recentMonths[i - 1].total) * 100;
            return sum + growth;
          }, 0) / (recentMonths.length - 1);
          
          const lastMonthRevenue = recentMonths[recentMonths.length - 1]?.total || 0;
          const growthFactor = Math.round(avgGrowth * 10) / 10;
          
          setProjections({
            nextMonth: Math.round(lastMonthRevenue * (1 + avgGrowth / 100)),
            nextQuarter: Math.round(lastMonthRevenue * 3 * (1 + avgGrowth / 100)),
            yearEnd: Math.round(lastMonthRevenue * 12 * (1 + avgGrowth / 100)),
            growthFactor
          });
        }
        return current;
      });
    }, 1000);

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

  const formatCurrency = (amount: number) => {
    if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억원`;
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(0)}천만원`;
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(0)}백만원`;
    if (amount >= 10000) return `${(amount / 10000).toFixed(0)}만원`;
    return `${amount.toLocaleString()}원`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">매출 분석</h3>
        <span className="text-sm text-gray-600">{getPeriodLabel(period)} 기준</span>
      </div>

      {/* 매출 개요 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">총 매출</p>
              <p className="text-2xl font-bold">{formatCurrency(revenueStats.totalRevenue)}</p>
              <p className="text-green-100 text-xs">전월 대비 +{revenueStats.monthlyGrowth}%</p>
            </div>
            <div className="text-3xl font-bold">₩</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">이용권 매출</p>
              <p className="text-2xl font-bold">{formatCurrency(revenueStats.subscriptionRevenue.total)}</p>
              <p className="text-blue-100 text-xs">전체 매출의 74.1%</p>
            </div>
            <div className="text-3xl font-bold">모바일</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">수수료 수익</p>
              <p className="text-2xl font-bold">{formatCurrency(revenueStats.commissionRevenue)}</p>
              <p className="text-purple-100 text-xs">전체 매출의 25.9%</p>
            </div>
            <div className="text-3xl">🤝</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">ARPU</p>
              <p className="text-2xl font-bold">{formatCurrency(subscriptionStats.avgRevenuePerUser)}</p>
              <p className="text-orange-100 text-xs">사용자당 평균 매출</p>
            </div>
            <div className="text-3xl">👤</div>
          </div>
        </div>
      </div>

      {/* 이용권 매출 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">이용권 매출 현황</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-lg font-bold text-pink-600">
                  {formatCurrency(revenueStats.subscriptionRevenue.parents)}
                </div>
                <div className="text-sm text-pink-700">학부모 이용권</div>
                <div className="text-xs text-pink-600">
                  ({Math.round((revenueStats.subscriptionRevenue.parents / revenueStats.subscriptionRevenue.total) * 100)}%)
                </div>
              </div>
              <div className="text-center p-4 bg-cyan-50 rounded-lg">
                <div className="text-lg font-bold text-cyan-600">
                  {formatCurrency(revenueStats.subscriptionRevenue.teachers)}
                </div>
                <div className="text-sm text-cyan-700">치료사 이용권</div>
                <div className="text-xs text-cyan-600">
                  ({Math.round((revenueStats.subscriptionRevenue.teachers / revenueStats.subscriptionRevenue.total) * 100)}%)
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold text-gray-900">{subscriptionStats.activeSubscriptions}</div>
                  <div className="text-gray-600">활성 구독</div>
                </div>
                <div>
                  <div className="font-semibold text-green-600">+{subscriptionStats.newSubscriptions}</div>
                  <div className="text-gray-600">신규 구독</div>
                </div>
                <div>
                  <div className="font-semibold text-red-600">-{subscriptionStats.canceledSubscriptions}</div>
                  <div className="text-gray-600">구독 해지</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">구독 지표</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-lg font-bold text-red-600">{subscriptionStats.churnRate}%</div>
                <div className="text-sm text-red-700">이탈률 (Churn)</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(subscriptionStats.lifetimeValue)}
                </div>
                <div className="text-sm text-blue-700">고객 생애가치 (LTV)</div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 mb-3 block">결제 수단별 현황</span>
              <div className="space-y-2">
                {subscriptionStats.paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{method.method}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{method.count}</span>
                      <span className="text-xs text-gray-500 w-12 text-right">({method.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 수수료 수익 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">🤝 수수료 수익 현황</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{commissionStats.totalTransactions}</div>
                <div className="text-sm text-purple-700">총 거래</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{commissionStats.avgCommissionRate}%</div>
                <div className="text-sm text-green-700">평균 수수료율</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(commissionStats.avgTransactionValue)}
                </div>
                <div className="text-sm text-blue-700">평균 거래액</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">수수료 Top 5 치료사</h4>
          
          <div className="space-y-3">
            {commissionStats.topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-medium ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-900">{performer.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(performer.commission)}
                  </div>
                  <div className="text-xs text-gray-500">{performer.transactions}건</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 월별 매출 추이 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-base font-medium text-gray-900 mb-4">월별 매출 추이</h4>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {revenueStats.monthlyTrend.map((month, index) => (
              <div key={index} className="flex-shrink-0 w-32">
                <div className="text-center mb-3">
                  <div className="text-sm font-medium text-gray-900">{month.month}</div>
                  <div className="text-xs text-gray-600">{formatCurrency(month.total)}</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-200 rounded-full h-20 flex flex-col justify-end overflow-hidden">
                    <div 
                      className="bg-blue-500 rounded-b-full"
                      style={{ height: `${(month.subscription / month.total) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-purple-500"
                      style={{ height: `${(month.commission / month.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">이용권</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">수수료</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 매출 예측 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-base font-medium text-gray-900 mb-4">🔮 매출 예측</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(projections.nextMonth)}</div>
            <div className="text-sm text-green-700">다음 달 예상 매출</div>
            <div className="text-xs text-green-600 mt-1">
              현재 추세 기준 +{projections.growthFactor}%
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(projections.nextQuarter)}</div>
            <div className="text-sm text-blue-700">다음 분기 예상 매출</div>
            <div className="text-xs text-blue-600 mt-1">
              3개월 누적 예상
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(projections.yearEnd)}</div>
            <div className="text-sm text-purple-700">연말 예상 매출</div>
            <div className="text-xs text-purple-600 mt-1">
              년간 목표 대비 87%
            </div>
          </div>
        </div>
      </div>

      {/* 매출 최적화 제안 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="text-base font-medium text-green-900 mb-4">매출 최적화 제안</h4>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <span className="font-bold text-green-600">1.</span>
            <div>
              <div className="text-sm font-medium text-green-900">치료사 이용권 가격 최적화</div>
              <div className="text-sm text-green-700">현재 60% 학부모 의존도를 50:50으로 균형 맞추기</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="font-bold text-green-600">2.</span>
            <div>
              <div className="text-sm font-medium text-green-900">수수료 구조 개선</div>
              <div className="text-sm text-green-700">첫 수업 외 추가 수업 수수료 모델 검토 (현재 15% → 5-10% 차등)</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="font-bold text-green-600">3.</span>
            <div>
              <div className="text-sm font-medium text-green-900">이탈률 개선</div>
              <div className="text-sm text-green-700">1.1% 이탈률을 1% 미만으로 줄여 LTV 10% 증대 목표</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
