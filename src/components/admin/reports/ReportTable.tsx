'use client';

import { Report } from '@/lib/reports';
import { Timestamp } from 'firebase/firestore';

interface ReportTableProps {
  reports: Report[];
  onReportSelect: (report: Report) => void;
}

export default function ReportTable({ reports, onReportSelect }: ReportTableProps) {
  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">접수</span>;
      case 'investigating':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">조사 중</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">완료</span>;
      case 'dismissed':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">기각</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getTypeBadge = (type: Report['type']) => {
    switch (type) {
      case 'direct_trade':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">직거래</span>;
      case 'inappropriate_behavior':
        return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">부적절행동</span>;
      case 'false_profile':
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">허위프로필</span>;
      case 'service_complaint':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">서비스불만</span>;
      case 'other':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">기타</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getPriorityBadge = (priority: Report['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">긴급</span>;
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">높음</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">보통</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">낮음</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getUserTypeBadge = (userType: 'parent' | 'teacher') => {
    switch (userType) {
      case 'parent':
        return <span className="px-2 py-1 text-xs font-medium bg-pink-100 text-pink-800 rounded-full">학부모</span>;
      case 'teacher':
        return <span className="px-2 py-1 text-xs font-medium bg-cyan-100 text-cyan-800 rounded-full">치료사</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const convertTimestamp = (timestamp: Timestamp | any) => {
    if (!timestamp) return new Date();
    if (timestamp.toDate) return timestamp.toDate();
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
    return new Date(timestamp);
  };

  const getTimeDifference = (timestamp: Timestamp | any) => {
    const now = new Date();
    const past = convertTimestamp(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `${diffDays}일 전`;
    if (diffHours > 0) return `${diffHours}시간 전`;
    return '방금 전';
  };

  const isUrgent = (report: Report) => {
    return report.priority === 'urgent' || 
           (report.type === 'direct_trade' && report.status === 'pending');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">신고 목록</h2>
          <span className="text-sm text-gray-600">총 {reports.length}건</span>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6 sm:w-1/5">
                신고 유형
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/6 sm:w-2/5">
                신고 내용
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6 sm:w-1/5">
                상태
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6 sm:w-1/5">
                접수일
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr
                key={report.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  isUrgent(report) ? 'bg-red-50 border-l-4 border-red-500' : ''
                }`}
                onClick={() => onReportSelect(report)}
              >
                {/* 신고 유형 */}
                <td className="px-4 py-4 text-sm">
                  <div className="space-y-2">
                    {getTypeBadge(report.type)}
                    {isUrgent(report) && (
                      <div className="flex items-center space-x-1">
                        <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full animate-pulse">
                          긴급
                        </span>
                      </div>
                    )}
                  </div>
                </td>

                {/* 신고 내용 */}
                <td className="px-4 py-4 text-sm">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900 truncate" title={report.title}>
                      {report.title}
                    </div>
                    <div className="text-xs text-gray-600 leading-tight" title={report.description} 
                         style={{
                           display: '-webkit-box',
                           WebkitLineClamp: 2,
                           WebkitBoxOrient: 'vertical',
                           overflow: 'hidden'
                         }}>
                      {report.description}
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
                      <span className="whitespace-nowrap">신고자: {report.reporterName}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="whitespace-nowrap">피신고자: {report.reportedName}</span>
                      {report.evidence.length > 0 && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="whitespace-nowrap">{report.evidence.length}개 첨부</span>
                        </>
                      )}
                    </div>
                  </div>
                </td>

                {/* 상태 */}
                <td className="px-4 py-4 text-sm">
                  <div className="space-y-2">
                    {getStatusBadge(report.status)}
                    {report.assignedTo && (
                      <div className="text-xs text-blue-600">
                        담당: {report.assignedTo}
                      </div>
                    )}
                    {report.resolution?.penalty && (
                      <div className="text-xs text-red-600">
                        처벌: {report.resolution.penalty === 'warning' ? '경고' :
                               report.resolution.penalty === 'temporary_ban' ? '정지' : '영구정지'}
                      </div>
                    )}
                  </div>
                </td>

                {/* 접수일 */}
                <td className="px-4 py-4 text-sm text-gray-500">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {convertTimestamp(report.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                    <div className="text-xs text-gray-400">
                      {getTimeDifference(report.createdAt)}
                    </div>
                    {isUrgent(report) && report.type === 'direct_trade' && (
                      <div className="text-xs text-red-600 font-medium">
                        24시간 내 처리
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 데이터가 없는 경우 */}
      {reports.length === 0 && (
        <div className="p-12 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">신고 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
