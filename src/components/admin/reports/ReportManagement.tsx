'use client';

import { useState, useEffect } from 'react';
import ReportStatusCards from './ReportStatusCards';
import ReportTable from './ReportTable';
import ReportDetailModal from './ReportDetailModal';
import { getAllReports, updateReportStatus, resolveReport, Report } from '@/lib/reports';

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
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const fetchedReports = await getAllReports();
      setReports(fetchedReports);
    } catch (error) {
      console.error('신고 목록 로딩 실패:', error);
      // TODO: 에러 처리 (토스트나 에러 메시지 표시)
    } finally {
      setLoading(false);
    }
  };

  const handleReportSelect = (report: Report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReport(null);
  };

  const handleReportAction = async (
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
    try {
      switch (action) {
        case 'assign':
          if (data.assignee) {
            await updateReportStatus(reportId, 'investigating', data.assignee);
          }
          break;
        case 'investigate':
          await updateReportStatus(reportId, 'investigating');
          break;
        case 'complete':
          if (data.resolution) {
            await resolveReport(reportId, data.resolution);
          }
          break;
        case 'dismiss':
          await updateReportStatus(reportId, 'dismissed');
          break;
      }
      
      // 데이터 새로고침
      await loadReports();
      handleCloseModal();
    } catch (error) {
      console.error('신고 처리 실패:', error);
      alert('처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border-2 border-red-100 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-top-transparent mb-4"></div>
            <p className="text-gray-600 text-lg">신고 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-xl border-2 border-red-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">신고 관리</h1>
            <p className="text-gray-600 mt-1">사용자 신고를 처리하고 관리합니다</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">{urgentReports.length}</div>
              <div className="text-sm text-gray-500">긴급 신고</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{pendingReports.length}</div>
              <div className="text-sm text-gray-500">처리 대기</div>
            </div>
          </div>
        </div>
      </div>


      {/* 상태 카드 */}
      <ReportStatusCards reports={reports} />

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl border-2 border-red-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-gray-900">검색 및 필터</h2>
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

            <button 
              onClick={loadReports}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors mr-2"
            >
              새로고침
            </button>
            <button className="px-6 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors">
              신고 통계
            </button>
          </div>
        </div>
      </div>

      {/* 신고 목록 */}
      <div className="bg-white rounded-xl border-2 border-red-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">신고 목록</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-red-50 rounded-lg border border-red-200 shadow-sm">
                <span className="text-sm font-semibold text-gray-700">총 </span>
                <span className="text-lg font-bold text-red-600">{filteredReports.length}</span>
                <span className="text-sm font-semibold text-gray-700">건</span>
              </div>
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
