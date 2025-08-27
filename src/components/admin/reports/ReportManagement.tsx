'use client';

import { useState } from 'react';
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

  // 임시 데이터
  const [reports] = useState<Report[]>([
    {
      id: 'RPT001',
      type: 'direct_trade',
      reporterId: 'P001',
      reporterName: '김○○',
      reporterType: 'parent',
      reportedId: 'T001',
      reportedName: '이○○',
      reportedType: 'teacher',
      title: '치료사가 직거래 유도함',
      description: '채팅 중에 플랫폼 외부에서 거래하자고 계좌번호까지 알려줬습니다. 스크린샷 첨부합니다.',
      evidence: [
        {
          type: 'screenshot',
          url: '/evidence/screenshot1.jpg',
          description: '채팅 스크린샷 - 계좌번호 공유'
        },
        {
          type: 'chat',
          description: '채팅 내역 전체'
        }
      ],
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-20 16:30',
      updatedAt: '2024-01-20 16:30',
      relatedChatId: 'CR002',
      relatedMatchingId: 'M002'
    },
    {
      id: 'RPT002',
      type: 'inappropriate_behavior',
      reporterId: 'T002',
      reporterName: '박○○',
      reporterType: 'teacher',
      reportedId: 'P002',
      reportedName: '정○○',
      reportedType: 'parent',
      title: '학부모의 부적절한 언행',
      description: '채팅에서 욕설과 협박성 발언을 했습니다.',
      evidence: [
        {
          type: 'chat',
          description: '욕설이 포함된 채팅 내역'
        }
      ],
      status: 'investigating',
      priority: 'medium',
      createdAt: '2024-01-19 14:20',
      updatedAt: '2024-01-20 09:15',
      assignedTo: '관리자A',
      relatedChatId: 'CR003'
    },
    {
      id: 'RPT003',
      type: 'false_profile',
      reporterId: 'P003',
      reporterName: '최○○',
      reporterType: 'parent',
      reportedId: 'T003',
      reportedName: '윤○○',
      reportedType: 'teacher',
      title: '허위 프로필 정보 신고',
      description: '자격증이 가짜인 것 같습니다. 확인 부탁드립니다.',
      evidence: [
        {
          type: 'document',
          url: '/evidence/license_check.pdf',
          description: '자격증 진위 확인 요청 자료'
        }
      ],
      status: 'completed',
      priority: 'medium',
      createdAt: '2024-01-18 11:00',
      updatedAt: '2024-01-19 18:30',
      assignedTo: '관리자B',
      resolution: {
        action: 'profile_warning',
        reason: '자격증 정보 불일치 확인됨',
        penalty: 'warning',
        processedBy: '관리자B',
        processedAt: '2024-01-19 18:30'
      }
    },
    {
      id: 'RPT004',
      type: 'direct_trade',
      reporterId: 'P004',
      reporterName: '장○○',
      reporterType: 'parent',
      reportedId: 'T004',
      reportedName: '강○○',
      reportedType: 'teacher',
      title: '직거래 제안 및 포상금 요청',
      description: '첫 수업 후 플랫폼 외부 거래를 제안했고, 신고 포상금을 신청합니다.',
      evidence: [
        {
          type: 'chat',
          description: '직거래 제안 채팅 내역'
        },
        {
          type: 'screenshot',
          url: '/evidence/screenshot2.jpg',
          description: '카카오톡 연락처 교환 증거'
        }
      ],
      status: 'completed',
      priority: 'high',
      createdAt: '2024-01-17 15:45',
      updatedAt: '2024-01-18 14:20',
      assignedTo: '관리자A',
      resolution: {
        action: 'account_suspended',
        reason: '직거래 유도 행위 확인',
        penalty: 'temporary_ban',
        reward: 'subscription_1month',
        processedBy: '관리자A',
        processedAt: '2024-01-18 14:20'
      }
    }
  ]);

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

  return (
    <div className="space-y-6">
      {/* 긴급 알림 */}
      {urgentReports.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                🚨 긴급: 즉시 처리 필요한 신고
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  <strong>{urgentReports.length}건</strong>의 긴급 신고가 대기 중입니다. 
                  직거래 신고는 24시간 내 처리해야 합니다.
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setStatusFilter('pending');
                    setTypeFilter('direct_trade');
                  }}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">신고 관리</h2>
          <div className="flex items-center space-x-4">
            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 우선순위</option>
              <option value="urgent">긴급</option>
              <option value="high">높음</option>
              <option value="medium">보통</option>
              <option value="low">낮음</option>
            </select>

            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              신고 통계
            </button>
          </div>
        </div>
      </div>

      {/* 신고 테이블 */}
      <ReportTable
        reports={filteredReports}
        onReportSelect={handleReportSelect}
      />

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
