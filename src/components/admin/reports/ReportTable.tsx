'use client';

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
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">🚫 직거래</span>;
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
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">✅ 낮음</span>;
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

  const getTimeDifference = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                신고 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                유형 & 우선순위
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                신고자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                피신고자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                신고 내용
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                증거자료
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                담당자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                접수일
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr
                key={report.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  isUrgent(report) ? 'bg-red-50' : ''
                }`}
                onClick={() => onReportSelect(report)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {report.id}
                  {isUrgent(report) && (
                    <div className="text-xs text-red-600 font-medium">긴급</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="space-y-1">
                    {getTypeBadge(report.type)}
                    {getPriorityBadge(report.priority)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="font-medium">{report.reporterName}</div>
                    <div className="text-xs text-gray-500">{report.reporterId}</div>
                    <div>{getUserTypeBadge(report.reporterType)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="font-medium">{report.reportedName}</div>
                    <div className="text-xs text-gray-500">{report.reportedId}</div>
                    <div>{getUserTypeBadge(report.reportedType)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs">
                    <div className="font-medium truncate" title={report.title}>
                      {report.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate" title={report.description}>
                      {report.description}
                    </div>
                    {(report.relatedChatId || report.relatedMatchingId) && (
                      <div className="text-xs text-blue-600 mt-1">
                        {report.relatedChatId && `채팅: ${report.relatedChatId}`}
                        {report.relatedMatchingId && ` 매칭: ${report.relatedMatchingId}`}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600">
                      총 {report.evidence.length}개
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {report.evidence.slice(0, 2).map((evidence, index) => (
                        <span
                          key={index}
                          className={`px-1.5 py-0.5 text-xs rounded ${
                            evidence.type === 'chat' ? 'bg-blue-100 text-blue-700' :
                            evidence.type === 'screenshot' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {evidence.type === 'chat' ? '채팅' :
                           evidence.type === 'screenshot' ? '스크린샷' : '파일'}
                        </span>
                      ))}
                      {report.evidence.length > 2 && (
                        <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                          +{report.evidence.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(report.status)}
                  {report.resolution?.penalty && (
                    <div className="text-xs text-red-600 mt-1">
                      처벌: {report.resolution.penalty === 'warning' ? '경고' :
                             report.resolution.penalty === 'temporary_ban' ? '정지' : '영구정지'}
                    </div>
                  )}
                  {report.resolution?.reward && (
                    <div className="text-xs text-green-600 mt-1">
                      포상: 이용권 1개월
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.assignedTo ? (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {report.assignedTo}
                    </span>
                  ) : (
                    <span className="text-gray-400">미배정</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    <div>{new Date(report.createdAt).toLocaleDateString('ko-KR')}</div>
                    <div className="text-xs">{getTimeDifference(report.createdAt)}</div>
                    {isUrgent(report) && report.type === 'direct_trade' && (
                      <div className="text-xs text-red-600">
                        ⏰ 24h 내 처리
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
