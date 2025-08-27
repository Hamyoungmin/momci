'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface MenuItem {
  title: string;
  href?: string;
  icon: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: '대시보드',
    href: '/admin',
    icon: '📊'
  },
  {
    title: '회원 관리',
    icon: '👥',
    children: [
      { title: '학부모 회원', href: '/admin/members/parents', icon: '👨‍👩‍👧‍👦' },
      { title: '치료사 회원', href: '/admin/members/teachers', icon: '👩‍⚕️' }
    ]
  },
  {
    title: '프로필 검증',
    href: '/admin/profile-verification',
    icon: '✅'
  },
  {
    title: '게시판 관리',
    icon: '📝',
    children: [
      { title: '선생님께 요청하기', href: '/admin/board/requests', icon: '📋' },
      { title: '선생님 둘러보기', href: '/admin/board/profiles', icon: '🔍' }
    ]
  },
  {
    title: '매칭 관리',
    href: '/admin/matching',
    icon: '🤝'
  },
  {
    title: '결제 관리',
    icon: '💳',
    children: [
      { title: '이용권 결제', href: '/admin/payments/subscriptions', icon: '💰' },
      { title: '첫 수업료', href: '/admin/payments/lessons', icon: '💵' },
      { title: '환불 관리', href: '/admin/payments/refunds', icon: '↩️' }
    ]
  },
  {
    title: '채팅 관리',
    href: '/admin/chat',
    icon: '💬'
  },
  {
    title: '신고 관리',
    href: '/admin/reports',
    icon: '🚨'
  },
  {
    title: '콘텐츠 관리',
    icon: '📄',
    children: [
      { title: '공지사항', href: '/admin/content/notices', icon: '📢' },
      { title: 'FAQ', href: '/admin/content/faq', icon: '❓' }
    ]
  },
  {
    title: '고객 지원',
    href: '/admin/support/inquiries',
    icon: '🎧'
  },
  {
    title: '통계 및 분석',
    href: '/admin/analytics/overview',
    icon: '📈'
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['회원 관리']);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);

    if (hasChildren) {
      return (
        <div key={item.title}>
          <button
            onClick={() => toggleExpanded(item.title)}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-sm font-medium rounded-lg transition-colors ${
              level > 0 ? 'ml-6' : ''
            } text-gray-700 hover:bg-blue-50 hover:text-blue-700`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-base">{item.icon}</span>
              <span>{item.title}</span>
            </div>
            <svg
              className={`w-4 h-4 transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {isExpanded && (
            <div className="ml-3 mt-1 space-y-1">
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.title}
        href={item.href!}
        className={`flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
          level > 0 ? 'ml-6' : ''
        } ${
          isActive(item.href!)
            ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200'
            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
        }`}
      >
        <span className="text-base">{item.icon}</span>
        <span>{item.title}</span>
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
      {/* 로고 및 타이틀 */}
      <div className="flex items-center space-x-3 px-6 py-6 border-b border-gray-200">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">관</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">관리자</h2>
          <p className="text-xs text-gray-500">더모든 키즈</p>
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="px-3 py-4 space-y-1">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* 하단 정보 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 더모든 키즈</p>
          <p>관리자 v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
