'use client';

import { useState } from 'react';
import OperationalStats from './OperationalStats';
import UserBehaviorAnalytics from './UserBehaviorAnalytics';
import RevenueAnalytics from './RevenueAnalytics';
import PeriodSelector from './PeriodSelector';

export default function AnalyticsOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('operational');

  const tabs = [
    { id: 'operational', label: '운영 통계', icon: '📊' },
    { id: 'behavior', label: '사용자 행동', icon: '👥' },
    { id: 'revenue', label: '매출 분석', icon: '💰' }
  ];

  return (
    <div className="space-y-6">
      {/* 상단 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">총 회원수</p>
              <p className="text-2xl font-bold">2,847명</p>
              <p className="text-blue-100 text-xs">전월 대비 +12.5%</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">이번 달 매칭</p>
              <p className="text-2xl font-bold">156건</p>
              <p className="text-green-100 text-xs">성공률 87.3%</p>
            </div>
            <div className="text-3xl">🤝</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">이번 달 매출</p>
              <p className="text-2xl font-bold">₩4.2M</p>
              <p className="text-purple-100 text-xs">전월 대비 +8.7%</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">평균 응답시간</p>
              <p className="text-2xl font-bold">2.4시간</p>
              <p className="text-orange-100 text-xs">SLA 목표 달성</p>
            </div>
            <div className="text-3xl">⏱️</div>
          </div>
        </div>
      </div>

      {/* 기간 선택 및 탭 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>

        {/* 탭 컨텐츠 */}
        <div className="mt-6">
          {activeTab === 'operational' && (
            <OperationalStats period={selectedPeriod} />
          )}
          {activeTab === 'behavior' && (
            <UserBehaviorAnalytics period={selectedPeriod} />
          )}
          {activeTab === 'revenue' && (
            <RevenueAnalytics period={selectedPeriod} />
          )}
        </div>
      </div>

      {/* 실시간 알림 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              📊 실시간 업데이트
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                • 지난 1시간: 신규 가입 3명, 매칭 요청 2건, 문의 접수 1건<br/>
                • 현재 활성 사용자: 127명 (학부모 89명, 치료사 38명)<br/>
                • 오늘 처리된 업무: 신고 처리 2건, 문의 답변 8건
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
