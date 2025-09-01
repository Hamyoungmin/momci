'use client';

import { useState, useEffect } from 'react';
import OperationalStats from './OperationalStats';
import UserBehaviorAnalytics from './UserBehaviorAnalytics';
import RevenueAnalytics from './RevenueAnalytics';
import PeriodSelector from './PeriodSelector';

interface OverviewStats {
  totalMembers: number;
  memberGrowth: string;
  monthlyMatches: number;
  matchSuccessRate: number;
  monthlyRevenue: string;
  revenueGrowth: string;
  avgResponseTime: string;
  slaStatus: string;
}

interface RealTimeData {
  newSignups: number;
  matchRequests: number;
  inquiries: number;
  activeUsers: number;
  activeParents: number;
  activeTeachers: number;
  processedReports: number;
  answeredInquiries: number;
}

export default function AnalyticsOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('operational');
  
  // Firebase에서 실제 데이터 가져오기
  const [overviewStats, setOverviewStats] = useState<OverviewStats>({
    totalMembers: 0,
    memberGrowth: '0%',
    monthlyMatches: 0,
    matchSuccessRate: 0,
    monthlyRevenue: '₩0',
    revenueGrowth: '0%',
    avgResponseTime: '0시간',
    slaStatus: '대기 중'
  });
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    newSignups: 0,
    matchRequests: 0,
    inquiries: 0,
    activeUsers: 0,
    activeParents: 0,
    activeTeachers: 0,
    processedReports: 0,
    answeredInquiries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Firebase에서 실제 분석 데이터 가져오기
    setLoading(false);
  }, [selectedPeriod]);

  const tabs = [
    { id: 'operational', label: '운영 통계' },
    { id: 'behavior', label: '사용자 행동' },
    { id: 'revenue', label: '매출 분석' }
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-100 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">분석 대시보드</h1>
              <p className="text-gray-600 mt-1">플랫폼 운영 지표와 사용자 행동을 분석합니다</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{overviewStats.totalMembers.toLocaleString()}</div>
              <div className="text-gray-500">총 회원</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{overviewStats.monthlyMatches}</div>
              <div className="text-gray-500">이달 매칭</div>
            </div>
          </div>
        </div>
      </div>

      {/* 상단 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">총 회원수</p>
              <p className="text-3xl font-bold">{overviewStats.totalMembers.toLocaleString()}명</p>
              <p className="text-blue-200 text-sm flex items-center">
                전월 대비 {overviewStats.memberGrowth}
              </p>
            </div>
            <div className="p-3 bg-blue-400 bg-opacity-30 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">이번 달 매칭</p>
              <p className="text-3xl font-bold">{overviewStats.monthlyMatches}건</p>
              <p className="text-green-200 text-sm flex items-center">
                성공률 {overviewStats.matchSuccessRate}%
              </p>
            </div>
            <div className="p-3 bg-green-400 bg-opacity-30 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">이번 달 매출</p>
              <p className="text-3xl font-bold">{overviewStats.monthlyRevenue}</p>
              <p className="text-purple-200 text-sm flex items-center">
                전월 대비 {overviewStats.revenueGrowth}
              </p>
            </div>
            <div className="p-3 bg-purple-400 bg-opacity-30 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">평균 응답시간</p>
              <p className="text-3xl font-bold">{overviewStats.avgResponseTime}</p>
              <p className="text-orange-200 text-sm flex items-center">
                {overviewStats.slaStatus}
              </p>
            </div>
            <div className="p-3 bg-orange-400 bg-opacity-30 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 기간 선택 및 탭 */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-indigo-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">상세 분석</h2>
            </div>
            <div className="flex items-center space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-bold text-blue-800 flex items-center">
              실시간 업데이트
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full animate-pulse">
                LIVE
              </span>
            </h3>
            <div className="mt-3 text-sm text-blue-700 space-y-2">
              <div className="flex items-center space-x-4">
                <span>• 지난 1시간: 신규 가입 <strong>{realTimeData.newSignups}명</strong>, 매칭 요청 <strong>{realTimeData.matchRequests}건</strong>, 문의 접수 <strong>{realTimeData.inquiries}건</strong></span>
              </div>
              <div className="flex items-center space-x-4">
                <span>• 현재 활성 사용자: <strong>{realTimeData.activeUsers}명</strong> (학부모 <strong>{realTimeData.activeParents}명</strong>, 치료사 <strong>{realTimeData.activeTeachers}명</strong>)</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>• 오늘 처리된 업무: 신고 처리 <strong>{realTimeData.processedReports}건</strong>, 문의 답변 <strong>{realTimeData.answeredInquiries}건</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
