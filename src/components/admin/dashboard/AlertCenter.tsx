'use client';

import Link from 'next/link';

interface Alert {
  type: 'urgent' | 'warning' | 'info';
  title: string;
  count: number;
  href: string;
  icon: string;
}

export default function AlertCenter() {
  const alerts: Alert[] = [
    {
      type: 'urgent',
      title: '미승인 프로필',
      count: 4,
      href: '/admin/profile-verification',
      icon: '🔍'
    },
    {
      type: 'urgent',
      title: '직거래 신고',
      count: 2,
      href: '/admin/reports',
      icon: '🚨'
    },
    {
      type: 'warning',
      title: '미확인 입금',
      count: 7,
      href: '/admin/payments/subscriptions',
      icon: '💳'
    },
    {
      type: 'info',
      title: '답변 대기 문의',
      count: 3,
      href: '/admin/support/inquiries',
      icon: '❓'
    }
  ];

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">긴급 알림 센터</h2>
        <span className="text-sm text-gray-500">실시간 업데이트</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {alerts.map((alert, index) => (
          <Link
            key={index}
            href={alert.href}
            className={`block p-4 rounded-lg border-2 transition-colors ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{alert.icon}</span>
                <div>
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm opacity-80">처리 필요</p>
                </div>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getCountColor(
                  alert.type
                )}`}
              >
                {alert.count}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
