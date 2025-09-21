'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

type ActiveKey = 'parent' | 'teacher' | 'program' | 'pricing';

interface GuideSidebarProps {
  active: ActiveKey;
}

export default function GuideSidebar({ active }: GuideSidebarProps) {
  const { currentUser, userData } = useAuth();

  const pricingHref = (() => {
    if (!currentUser || !userData) return '/pricing';
    return userData.userType === 'parent' ? '/parent-pricing' : '/teacher-pricing';
  })();

  // 사이드 항목: 크기는 키우고, 굵기는 과도하게 키우지 않음
  const itemBase = 'block w-full text-left px-4 py-3 rounded-2xl transition-colors font-medium text-lg';
  const inactive = 'text-gray-700 hover:bg-gray-50';
  const activeCls = 'bg-blue-50 text-blue-600';

  return (
    <div className="w-64 bg-white shadow-lg rounded-lg mr-8 h-fit">
      <div className="p-4">
        <div className="mb-6">
          <div className="w-full bg-blue-500 text-white text-2xl font-bold rounded-2xl h-[110px] flex items-center justify-center">
            이용안내
          </div>
        </div>
        <div className="space-y-1">
          <Link
            href="/parent-guide"
            className={`${itemBase} ${active === 'parent' ? activeCls : inactive}`}
          >
            학부모 이용안내
          </Link>
          <Link
            href="/teacher-guide"
            className={`${itemBase} ${active === 'teacher' ? activeCls : inactive}`}
          >
            선생님 이용안내
          </Link>
          <Link
            href="/program-guide"
            className={`${itemBase} ${active === 'program' ? activeCls : inactive}`}
          >
            프로그램 안내
          </Link>
          <Link
            href={pricingHref}
            className={`${itemBase} ${active === 'pricing' ? activeCls : inactive}`}
          >
            이용권 구매
          </Link>
        </div>
      </div>
    </div>
  );
}


