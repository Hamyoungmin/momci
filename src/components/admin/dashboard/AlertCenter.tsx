'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Alert {
  type: 'urgent' | 'warning' | 'info';
  title: string;
  count: number;
  href: string;
  icon: string;
}

export default function AlertCenter() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        // TODO: Firebase에서 실제 알림 데이터 조회
        // const alertsData = await getAdminAlerts();
        
        // 임시로 빈 배열로 시작
        setAlerts([
          {
            type: 'urgent',
            title: '미승인 프로필',
            count: 0,
            href: '/admin/profile-verification',
            icon: '🔍'
          },
          {
            type: 'urgent',
            title: '직거래 신고',
            count: 0,
            href: '/admin/reports',
            icon: '🚨'
          },
          {
            type: 'warning',
            title: '미확인 입금',
            count: 0,
            href: '/admin/payments/subscriptions',
            icon: '💳'
          },
          {
            type: 'info',
            title: '답변 대기 문의',
            count: 0,
            href: '/admin/support/inquiries',
            icon: '❓'
          }
        ]);
      } catch (error) {
        console.error('알림 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';
    }
  };

  const getCountColor = (type: Alert['type']) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">🚨</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">긴급 알림 센터</h2>
            <p className="text-sm text-gray-500">실시간 모니터링 중</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-600">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {alerts.map((alert, index) => (
          <Link
            key={index}
            href={alert.href}
            className={`group block p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {alert.icon}
                </div>
                <div>
                  <p className="font-semibold group-hover:font-bold transition-all">{alert.title}</p>
                  <p className="text-xs opacity-70 font-medium">처리 필요</p>
                </div>
              </div>
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform duration-300 ${getCountColor(
                    alert.type
                  )}`}
                >
                  {alert.count}
                </div>
                {alert.type === 'urgent' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* 하단 요약 */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            총 <span className="font-semibold text-gray-900">{alerts.reduce((sum, alert) => sum + alert.count, 0)}건</span>의 알림이 있습니다
          </span>
          <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            전체 알림 보기 →
          </button>
        </div>
      </div>
    </div>
  );
}
