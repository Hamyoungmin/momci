'use client';

import { useState, useEffect } from 'react';

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: string;
}

export default function StatsCards() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제 통계 데이터 불러오기
    const fetchStats = async () => {
      try {
        setLoading(true);
        // TODO: Firebase에서 실제 통계 데이터 조회
        // const statsData = await getAdminStats();
        
        // 실제 데이터 (Firebase에서 가져올 예정)
        setStats([
          {
            title: '누적 이용자 수',
            value: '0',
            change: '0%',
            changeType: 'neutral',
            icon: 'U',
            color: 'bg-blue-500'
          },
          {
            title: '누적 매칭 수',
            value: '0',
            change: '0%',
            changeType: 'neutral',
            icon: 'M',
            color: 'bg-green-500'
          },
          {
            title: '활성 사용자',
            value: '0',
            change: '0%',
            changeType: 'neutral',
            icon: 'A',
            color: 'bg-purple-500'
          },
          {
            title: '오늘 신규 가입',
            value: '0',
            change: '0',
            changeType: 'neutral',
            icon: 'N',
            color: 'bg-orange-500'
          },
          {
            title: '진행 중인 매칭',
            value: '0',
            change: '0',
            changeType: 'neutral',
            icon: 'P',
            color: 'bg-cyan-500'
          },
          {
            title: '오늘 매출',
            value: '0원',
            change: '0%',
            changeType: 'neutral',
            icon: 'S',
            color: 'bg-emerald-500'
          }
        ]);
      } catch (error) {
        console.error('통계 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl border-2 border-gray-100 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{stat.value}</p>
              <div className="flex items-center space-x-2">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                  stat.changeType === 'increase'
                    ? 'bg-green-100 text-green-700'
                    : stat.changeType === 'decrease'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {stat.changeType === 'increase' && '↗'}
                  {stat.changeType === 'decrease' && '↘'}
                  {stat.changeType === 'neutral' && '→'}
                  <span className="ml-1">{stat.change}</span>
                </div>
                <span className="text-xs text-gray-400">지난 주 대비</span>
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
