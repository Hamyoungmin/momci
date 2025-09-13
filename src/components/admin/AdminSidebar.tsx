'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface MenuItem {
  title: string;
  href?: string;
  children?: MenuItem[];
  adminOnly?: boolean; // 관리자 전용 메뉴
}

const menuItems: MenuItem[] = [
  {
    title: '대시보드',
    href: '/admin'
  },
  {
    title: '회원 관리',
    children: [
      { title: '학부모 회원', href: '/admin/members/parents' },
      { title: '치료사 회원', href: '/admin/members/teachers' }
    ]
  },
  {
    title: '프로필 검증',
    href: '/admin/profile-verification'
  },
  {
    title: '게시판 관리',
    children: [
      { title: '선생님께 요청하기', href: '/admin/board/requests' },
      { title: '선생님 둘러보기', href: '/admin/board/profiles' }
    ]
  },
  {
    title: '매칭 관리',
    href: '/admin/matching'
  },
  {
    title: '결제 관리',
    adminOnly: true,
    children: [
      { title: '이용권 결제', href: '/admin/payments/subscriptions', adminOnly: true },
      { title: '첫 수업료', href: '/admin/payments/lessons', adminOnly: true },
      { title: '환불 관리', href: '/admin/payments/refunds', adminOnly: true },
      { title: '결제 설정', href: '/admin/payments/settings', adminOnly: true }
    ]
  },
  {
    title: '채팅 관리',
    href: '/admin/chat',
    adminOnly: true
  },
  {
    title: '신고 관리',
    href: '/admin/reports',
    adminOnly: true
  },
  {
    title: '콘텐츠 관리',
    children: [
      { title: '공지사항', href: '/admin/content/notices' },
      { title: 'FAQ', href: '/admin/content/faq' },
      { title: '후기 관리', href: '/admin/content/reviews' }
    ]
  },
  {
    title: '고객 지원',
    href: '/admin/support/inquiries'
  },
  {
    title: '통계 및 분석',
    href: '/admin/analytics/overview'
  }
];

interface AdminSidebarProps {
  isAdmin: boolean;
}

export default function AdminSidebar({ isAdmin }: AdminSidebarProps) {
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
    const isDisabled = item.adminOnly && !isAdmin;

    // 관리자 전용 메뉴는 표시하되 비활성화 처리

    if (hasChildren) {
      return (
        <div key={item.title}>
          <button
            onClick={() => !isDisabled && toggleExpanded(item.title)}
            disabled={isDisabled}
            className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors ${
              level > 0 ? 'ml-2' : ''
            } ${
              isDisabled 
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <div className="flex items-center">
              <span>{item.title}</span>
              {isDisabled && <span className="text-xs text-gray-400 ml-2">(관리자 전용)</span>}
            </div>
            {!isDisabled && (
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
            )}
          </button>
          {isExpanded && !isDisabled && (
            <div className="ml-4 space-y-0.5">
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    if (isDisabled) {
      return (
        <div
          key={item.title}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            level > 0 ? 'ml-2' : ''
          } text-gray-400 cursor-not-allowed`}
        >
          <span>{item.title}</span>
          <span className="text-xs text-gray-400 ml-2">(관리자 전용)</span>
        </div>
      );
    }

    return (
      <Link
        key={item.title}
        href={item.href!}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          level > 0 ? 'ml-2' : ''
        } ${
          isActive(item.href!)
            ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200'
            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
        }`}
      >
        <span>{item.title}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      {/* 로고 및 타이틀 */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200 flex-shrink-0 h-20">
        <div>
          <h2 className="text-lg font-bold text-gray-900">관리자</h2>
          <p className="text-xs text-gray-500">더모든 키즈</p>
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* 하단 정보 */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 mt-auto">
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 더모든 키즈</p>
          <p>관리자 v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
