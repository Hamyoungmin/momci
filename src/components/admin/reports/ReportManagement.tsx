'use client';

import { useState, useEffect } from 'react';
import ReportStatusCards from './ReportStatusCards';
import ReportTable from './ReportTable';
import ReportDetailModal from './ReportDetailModal';

interface Report {
  id: string;
  type: 'direct_trade' | 'inappropriate_behavior' | 'false_profile' | 'service_complaint' | 'other';
  reporterId: string;
  reporterName: string;
  reporterType: 'parent' | 'teacher';
  reportedId: string;
  reportedName: string;
  reportedType: 'parent' | 'teacher';
  title: string;
  description: string;
  evidence: {
    type: 'chat' | 'screenshot' | 'document';
    url?: string;
    description: string;
  }[];
  status: 'pending' | 'investigating' | 'completed' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: {
    action: string;
    reason: string;
    penalty?: 'warning' | 'temporary_ban' | 'permanent_ban';
    reward?: 'subscription_1month';
    processedBy: string;
    processedAt: string;
  };
  relatedChatId?: string;
  relatedMatchingId?: string;
}

export default function ReportManagement() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Firebase에서 실제 데이터 가져오기
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Firebase에서 실제 신고 데이터 가져오기
    setLoading(false);
  }, []);

  const handleReportSelect = (report: Report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReport(null);
  };

  const handleReportAction = (
    reportId: string, 
    action: 'assign' | 'investigate' | 'complete' | 'dismiss',
    data: {
      assignee?: string;
      resolution?: {
        action: string;
        reason: string;
        penalty?: 'warning' | 'temporary_ban' | 'permanent_ban';
        reward?: 'subscription_1month';
      };
    }
  ) => {
    // 실제 구현 시 API 호출
    console.log('Report action:', { reportId, action, data });
    handleCloseModal();
  };

  const filteredReports = reports.filter(report => {
    if (statusFilter !== 'all' && report.status !== statusFilter) return false;
    if (typeFilter !== 'all' && report.type !== typeFilter) return false;
    if (priorityFilter !== 'all' && report.priority !== priorityFilter) return false;
    return true;
  });

  const urgentReports = reports.filter(r => r.priority === 'urgent' || 
    (r.type === 'direct_trade' && r.status === 'pending'));
  const pendingReports = reports.filter(r => r.status === 'pending');

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-100 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">신고 관리</h1>
              <p className="text-gray-600 mt-1">사용자 신고를 처리하고 관리합니다</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{urgentReports.length}</div>
              <div className="text-gray-500">긴급</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{pendingReports.length}</div>
              <div className="text-gray-500">대기 중</div>
            </div>
          </div>
        </div>
      </div>

      {/* 긴급 알림 */}
      {urgentReports.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-bold text-red-800 flex items-center">
                긴급 처리 필요
                <span className="ml-2 px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full animate-pulse">
                  {urgentReports.length}건
                </span>
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  긴급 신고가 대기 중입니다. 직거래 신고는 24시간 내 처리해야 합니다.
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setStatusFilter('pending');
                    setTypeFilter('direct_trade');
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
                >
                  긴급 신고 확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 상태 카드 */}
      <ReportStatusCards reports={reports} />

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-red-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">신고 필터 및 관리</h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">전체 상태</option>
              <option value="pending">접수</option>
              <option value="investigating">조사 중</option>
              <option value="completed">처리 완료</option>
              <option value="dismissed">기각</option>
            </select>

            {/* 유형 필터 */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-sm border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">전체 유형</option>
              <option value="direct_trade">직거래 신고</option>
              <option value="inappropriate_behavior">부적절한 행동</option>
              <option value="false_profile">허위 프로필</option>
              <option value="service_complaint">서비스 불만</option>
              <option value="other">기타</option>
            </select>

            {/* 우선순위 필터 */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-sm border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">전체 우선순위</option>
              <option value="urgent">긴급</option>
              <option value="high">높음</option>
              <option value="medium">보통</option>
              <option value="low">낮음</option>
            </select>

            <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105">
              신고 통계
            </button>
          </div>
        </div>
      </div>

      {/* 신고 목록 */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-red-100">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-red-100 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">신고 목록</h3>
              <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                총 {filteredReports.length}건
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <ReportTable
            reports={filteredReports}
            onReportSelect={handleReportSelect}
          />
        </div>
      </div>

      {/* 신고 상세 모달 */}
      {selectedReport && (
        <ReportDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          report={selectedReport}
          onReportAction={handleReportAction}
        />
      )}
    </div>
  );
}
