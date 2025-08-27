'use client';

interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'important' | 'urgent';
  displayLocation: 'main' | 'mypage' | 'popup';
  isActive: boolean;
  startDate: string;
  endDate?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  priority: number;
  targetAudience: 'all' | 'parents' | 'teachers';
}

interface NoticeTableProps {
  notices: Notice[];
  onNoticeSelect: (notice: Notice) => void;
}

export default function NoticeTable({ notices, onNoticeSelect }: NoticeTableProps) {
  const getTypeBadge = (type: Notice['type']) => {
    switch (type) {
      case 'general':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">일반</span>;
      case 'important':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">⭐ 중요</span>;
      case 'urgent':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">🚨 긴급</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getLocationBadge = (location: Notice['displayLocation']) => {
    switch (location) {
      case 'main':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">메인</span>;
      case 'mypage':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">마이페이지</span>;
      case 'popup':
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">팝업</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getAudienceBadge = (audience: Notice['targetAudience']) => {
    switch (audience) {
      case 'all':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">전체</span>;
      case 'parents':
        return <span className="px-2 py-1 text-xs font-medium bg-pink-100 text-pink-800 rounded-full">학부모</span>;
      case 'teachers':
        return <span className="px-2 py-1 text-xs font-medium bg-cyan-100 text-cyan-800 rounded-full">치료사</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const isExpired = (notice: Notice) => {
    if (!notice.endDate) return false;
    return new Date(notice.endDate) < new Date();
  };

  const isExpiringSoon = (notice: Notice) => {
    if (!notice.endDate) return false;
    const now = new Date();
    const end = new Date(notice.endDate);
    const diffMs = end.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays <= 3 && diffDays > 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">공지사항 목록</h2>
          <span className="text-sm text-gray-600">총 {notices.length}건</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                우선순위
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목 & 유형
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                노출 위치
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                대상
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                노출 기간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                조회수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성자/일시
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notices
              .sort((a, b) => {
                // 우선순위 -> 활성 상태 -> 생성일 순으로 정렬
                if (a.priority !== b.priority) return a.priority - b.priority;
                if (a.isActive !== b.isActive) return b.isActive ? 1 : -1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              })
              .map((notice) => (
              <tr
                key={notice.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notice.isActive ? 'bg-gray-50 opacity-75' : 
                  notice.type === 'urgent' ? 'bg-red-50' :
                  notice.type === 'important' ? 'bg-yellow-50' : ''
                } ${
                  isExpired(notice) ? 'bg-gray-100' : 
                  isExpiringSoon(notice) ? 'bg-orange-50' : ''
                }`}
                onClick={() => onNoticeSelect(notice)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">#{notice.priority}</span>
                    {notice.type === 'urgent' && (
                      <span className="text-red-500">🚨</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-2">
                    <div className="font-medium max-w-md">
                      <div className="truncate" title={notice.title}>
                        {notice.title}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTypeBadge(notice.type)}
                      <span className="text-xs text-blue-600 font-mono">{notice.id}</span>
                    </div>
                    {isExpiringSoon(notice) && (
                      <div className="text-xs text-orange-600 font-medium">
                        ⏰ 곧 만료
                      </div>
                    )}
                    {isExpired(notice) && (
                      <div className="text-xs text-red-600 font-medium">
                        ❌ 만료됨
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getLocationBadge(notice.displayLocation)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getAudienceBadge(notice.targetAudience)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {notice.isActive ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      ✅ 활성
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      ❌ 비활성
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="space-y-1">
                    <div>{new Date(notice.startDate).toLocaleDateString('ko-KR')}</div>
                    {notice.endDate && (
                      <div className="text-xs">
                        ~ {new Date(notice.endDate).toLocaleDateString('ko-KR')}
                      </div>
                    )}
                    {!notice.endDate && (
                      <div className="text-xs text-gray-400">무기한</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-1">👁️</span>
                    <span className="font-medium">{notice.views.toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="space-y-1">
                    <div className="font-medium">{notice.createdBy}</div>
                    <div className="text-xs">
                      {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                    <div className="text-xs">
                      {new Date(notice.createdAt).toLocaleTimeString('ko-KR', { 
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
      {notices.length === 0 && (
        <div className="p-12 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <p className="text-gray-500">공지사항이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
