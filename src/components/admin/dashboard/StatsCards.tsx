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
            <div className="relative">
              <div
                className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                {stat.icon}
              </div>
              <div className={`absolute inset-0 ${stat.color} rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
