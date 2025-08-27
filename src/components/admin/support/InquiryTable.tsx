'use client';

interface Inquiry {
  id: string;
  userId: string;
  userName: string;
  userType: 'parent' | 'teacher';
  userEmail: string;
  category: 'service' | 'payment' | 'technical' | 'account' | 'other';
  title: string;
  content: string;
  status: 'pending' | 'assigned' | 'answered' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  attachments: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
  tags: string[];
  responseTime?: number;
}

interface InquiryTableProps {
  inquiries: Inquiry[];
  onInquirySelect: (inquiry: Inquiry) => void;
}

export default function InquiryTable({ inquiries, onInquirySelect }: InquiryTableProps) {
  const getStatusBadge = (status: Inquiry['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">📨 접수</span>;
      case 'assigned':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">🔄 처리중</span>;
      case 'answered':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">✅ 답변완료</span>;
      case 'closed':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">🔒 종료</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getPriorityBadge = (priority: Inquiry['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">🚨 긴급</span>;
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">⚠️ 높음</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">📋 보통</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">✅ 낮음</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getCategoryBadge = (category: Inquiry['category']) => {
    switch (category) {
      case 'service':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">💬 서비스</span>;
      case 'payment':
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">💳 결제</span>;
      case 'technical':
        return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">🔧 기술</span>;
      case 'account':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">👤 계정</span>;
      case 'other':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">📝 기타</span>;
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

  const isOverdue = (inquiry: Inquiry) => {
    if (inquiry.status === 'answered' || inquiry.status === 'closed') return false;
    
    const now = new Date();
    const created = new Date(inquiry.createdAt);
    const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    
    // 긴급: 2시간, 높음: 4시간, 보통: 24시간, 낮음: 48시간
    const slaHours = {
      urgent: 2,
      high: 4,
      medium: 24,
      low: 48
    };
    
    return diffHours > slaHours[inquiry.priority];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">문의 목록</h2>
          <span className="text-sm text-gray-600">총 {inquiries.length}건</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                문의 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                고객 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리 & 우선순위
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                문의 내용
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                첨부파일
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
            {inquiries
              .sort((a, b) => {
                // 우선순위 -> 상태 -> 생성일 순으로 정렬
                const priorityOrder = { urgent: 1, high: 2, medium: 3, low: 4 };
                const statusOrder = { pending: 1, assigned: 2, answered: 3, closed: 4 };
                
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                if (statusOrder[a.status] !== statusOrder[b.status]) {
                  return statusOrder[a.status] - statusOrder[b.status];
                }
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              })
              .map((inquiry) => (
              <tr
                key={inquiry.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  inquiry.priority === 'urgent' ? 'bg-red-50' :
                  isOverdue(inquiry) ? 'bg-orange-50' : ''
                }`}
                onClick={() => onInquirySelect(inquiry)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {inquiry.id}
                  {inquiry.priority === 'urgent' && (
                    <div className="text-xs text-red-600 font-medium">🚨 긴급</div>
                  )}
                  {isOverdue(inquiry) && (
                    <div className="text-xs text-orange-600 font-medium">⏰ 지연</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="font-medium">{inquiry.userName}</div>
                    <div className="text-xs text-gray-500">{inquiry.userId}</div>
                    <div>{getUserTypeBadge(inquiry.userType)}</div>
                    <div className="text-xs text-gray-400">{inquiry.userEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="space-y-1">
                    {getCategoryBadge(inquiry.category)}
                    {getPriorityBadge(inquiry.priority)}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs">
                    <div className="font-medium truncate" title={inquiry.title}>
                      {inquiry.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate" title={inquiry.content}>
                      {inquiry.content}
                    </div>
                    {inquiry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {inquiry.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            #{tag}
                          </span>
                        ))}
                        {inquiry.tags.length > 2 && (
                          <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            +{inquiry.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {inquiry.attachments.length > 0 ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-600">📎</span>
                      <span className="text-xs">{inquiry.attachments.length}개</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">없음</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(inquiry.status)}
                  {inquiry.responseTime && (
                    <div className="text-xs text-gray-500 mt-1">
                      응답: {inquiry.responseTime}h
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {inquiry.assignedTo ? (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {inquiry.assignedTo}
                    </span>
                  ) : (
                    <span className="text-gray-400">미배정</span>
                  )}
                  {inquiry.answeredBy && (
                    <div className="text-xs text-green-600 mt-1">
                      답변: {inquiry.answeredBy}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="space-y-1">
                    <div>{new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</div>
                    <div className="text-xs">{getTimeDifference(inquiry.createdAt)}</div>
                    <div className="text-xs">
                      {new Date(inquiry.createdAt).toLocaleTimeString('ko-KR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 데이터가 없는 경우 */}
      {inquiries.length === 0 && (
        <div className="p-12 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500">문의 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
