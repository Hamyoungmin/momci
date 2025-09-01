'use client';

interface RequestPost {
  id: string;
  parentId: string;
  parentName: string;
  title: string;
  content: string;
  childInfo: {
    age: string;
    gender: 'male' | 'female';
    condition: string;
  };
  treatmentTypes: string[];
  location: string;
  schedule: string;
  budget: string;
  status: 'recruiting' | 'matched' | 'closed';
  applicants: number;
  createdAt: string;
  updatedAt: string;
  views: number;
  premium: boolean;
  urgent: boolean;
}

interface RequestPostTableProps {
  posts: RequestPost[];
  onPostSelect: (post: RequestPost) => void;
}

export default function RequestPostTable({ posts, onPostSelect }: RequestPostTableProps) {
  const getStatusBadge = (status: RequestPost['status']) => {
    switch (status) {
      case 'recruiting':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">모집 중</span>;
      case 'matched':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">매칭 완료</span>;
      case 'closed':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">마감</span>;
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">요청글 목록</h2>
          <span className="text-sm text-gray-600">총 {posts.length}건</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                요청글 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학부모
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                아이 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                치료 종목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                위치 & 예산
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                지원자/조회수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성일
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr
                key={post.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  post.urgent ? 'bg-red-50' : post.premium ? 'bg-purple-50' : ''
                }`}
                onClick={() => onPostSelect(post)}
              >
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="flex items-start space-x-2">
                      <div className="font-medium text-gray-900 max-w-xs">
                        <div className="truncate" title={post.title}>
                          {post.title}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {post.urgent && (
                          <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                            급구
                          </span>
                        )}
                        {post.premium && (
                          <span className="px-1.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                            프리미엄
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 font-mono">{post.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="font-medium">{post.parentName}</div>
                  <div className="text-xs text-gray-500">{post.parentId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span>{post.childInfo.age}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        post.childInfo.gender === 'male' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-pink-100 text-pink-800'
                      }`}>
                        {post.childInfo.gender === 'male' ? '남아' : '여아'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">{post.childInfo.condition}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex flex-wrap gap-1">
                    {post.treatmentTypes.slice(0, 2).map((type, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {type}
                      </span>
                    ))}
                    {post.treatmentTypes.length > 2 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{post.treatmentTypes.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="font-medium text-xs">{post.location}</div>
                    <div className="text-xs text-gray-600">{post.budget}</div>
                    <div className="text-xs text-gray-500">{post.schedule}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(post.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-1">👥</span>
                      <span className="font-medium">{post.applicants}명</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-1">조회</span>
                      <span className="text-xs">{post.views}회</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    <div>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</div>
                    <div className="text-xs">{getTimeDifference(post.createdAt)}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 데이터가 없는 경우 */}
      {posts.length === 0 && (
        <div className="p-12 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">요청글 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
