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
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: '누적 이용자 수',
      value: '1,247',
      change: '+12.5%',
      changeType: 'increase',
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      title: '누적 매칭 수',
      value: '789',
      change: '+18.2%',
      changeType: 'increase',
      icon: '🤝',
      color: 'bg-green-500'
    },
    {
      title: '활성 사용자',
      value: '342',
      change: '+7.1%',
      changeType: 'increase',
      icon: '📈',
      color: 'bg-purple-500'
    },
    {
      title: '오늘 신규 가입',
      value: '12',
      change: '+3',
      changeType: 'increase',
      icon: '🆕',
      color: 'bg-orange-500'
    },
    {
      title: '진행 중인 매칭',
      value: '45',
      change: '+8',
      changeType: 'increase',
      icon: '💬',
      color: 'bg-cyan-500'
    },
    {
      title: '오늘 매출',
      value: '1,890,000원',
      change: '+22.3%',
      changeType: 'increase',
      icon: '💰',
      color: 'bg-emerald-500'
    }
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <div className="flex items-center space-x-1">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === 'increase'
                      ? 'text-green-600'
                      : stat.changeType === 'decrease'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500">지난 주 대비</span>
              </div>
            </div>
            <div
              className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
