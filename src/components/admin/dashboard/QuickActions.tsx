'use client';

import Link from 'next/link';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

export default function QuickActions() {
  const quickActions: QuickAction[] = [
    {
      title: '프로필 승인',
      description: '대기 중인 치료사 프로필 검토',
      href: '/admin/profile-verification',
      icon: '✅',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: '신고 처리',
      description: '직거래 신고 내용 확인',
      href: '/admin/reports',
      icon: '🚨',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: '입금 확인',
      description: '미확인 입금 건 처리',
      href: '/admin/payments/subscriptions',
      icon: '💳',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: '고객 지원',
      description: '1:1 문의 답변',
      href: '/admin/support',
      icon: '🎧',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: '공지사항 작성',
      description: '새로운 공지사항 등록',
      href: '/admin/content/notices',
      icon: '📢',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: '매칭 관리',
      description: '진행 중인 매칭 상태 확인',
      href: '/admin/matching',
      icon: '🤝',
      color: 'bg-cyan-500 hover:bg-cyan-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">빠른 작업</h2>
        <span className="text-sm text-gray-500">자주 사용하는 기능</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group block p-4 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-start space-x-3">
              <div
                className={`w-10 h-10 ${action.color} rounded-2xl flex items-center justify-center text-white transition-colors group-hover:scale-105`}
              >
                <span className="text-lg">{action.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {action.description}
                </p>
              </div>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">오늘 처리한 작업</span>
          <span className="font-medium text-gray-900">23건</span>
        </div>
      </div>
    </div>
  );
}
