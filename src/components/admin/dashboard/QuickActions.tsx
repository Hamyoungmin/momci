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
    <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">⚡</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">빠른 작업</h2>
            <p className="text-sm text-gray-500">자주 사용하는 기능</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-blue-600">활성</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group block p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 shadow-md`}
              >
                <span className="text-xl">{action.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {action.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">오늘 처리한 작업</span>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">23</span>
            <span className="text-sm text-gray-600">건</span>
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">오늘 목표 30건 중 78% 완료</p>
      </div>
    </div>
  );
}
