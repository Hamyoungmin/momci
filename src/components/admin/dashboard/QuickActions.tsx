'use client';

import Link from 'next/link';
import { useState } from 'react';
import { initializeStatistics } from '@/lib/statistics';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

export default function QuickActions() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initMessage, setInitMessage] = useState<string | null>(null);

  const handleInitializeStats = async () => {
    if (confirm('통계 데이터를 초기화하시겠습니까?\n이미 데이터가 있는 경우 초기화되지 않습니다.')) {
      try {
        setIsInitializing(true);
        setInitMessage(null);
        await initializeStatistics();
        setInitMessage('통계 데이터가 성공적으로 초기화되었습니다.');
      } catch (error) {
        console.error('통계 초기화 실패:', error);
        setInitMessage('통계 데이터 초기화에 실패했습니다.');
      } finally {
        setIsInitializing(false);
        // 3초 후 메시지 제거
        setTimeout(() => setInitMessage(null), 3000);
      }
    }
  };


  const quickActions: QuickAction[] = [
    {
      title: '프로필 승인',
      description: '대기 중인 치료사 프로필 검토',
      href: '/admin/profile-verification',
      icon: 'P',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: '신고 처리',
      description: '직거래 신고 내용 확인',
      href: '/admin/reports',
      icon: 'R',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: '입금 확인',
      description: '미확인 입금 건 처리',
      href: '/admin/payments/subscriptions',
      icon: '$',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: '고객 지원',
      description: '1:1 문의 답변',
      href: '/admin/support',
      icon: 'S',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: '공지사항 작성',
      description: '새로운 공지사항 등록',
      href: '/admin/content/notices',
      icon: 'N',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: '매칭 관리',
      description: '진행 중인 매칭 상태 확인',
      href: '/admin/matching',
      icon: 'M',
      color: 'bg-cyan-500 hover:bg-cyan-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">빠른 작업</h2>
          <p className="text-sm text-gray-500">자주 사용하는 기능</p>
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


      {/* 통계 초기화 버튼 */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={handleInitializeStats}
          disabled={isInitializing}
          className="w-full p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isInitializing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>통계 데이터 초기화 중...</span>
            </div>
          ) : (
            '통계 데이터 초기화'
          )}
        </button>
        {initMessage && (
          <div className={`mt-2 p-2 rounded-lg text-center text-sm ${
            initMessage.includes('성공') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {initMessage}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">오늘 처리한 작업</span>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">0</span>
            <span className="text-sm text-gray-600">건</span>
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{width: '0%'}}></div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">오늘 처리한 작업이 없습니다</p>
      </div>
    </div>
  );
}
