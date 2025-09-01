'use client';

interface FAQ {
  id: string;
  category: 'general' | 'payment' | 'matching' | 'technical' | 'other';
  question: string;
  answer: string;
  isActive: boolean;
  views: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
}

interface FAQTableProps {
  faqs: FAQ[];
  onFAQSelect: (faq: FAQ) => void;
}

export default function FAQTable({ faqs, onFAQSelect }: FAQTableProps) {
  const getCategoryBadge = (category: FAQ['category']) => {
    switch (category) {
      case 'general':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">일반 이용</span>;
      case 'payment':
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">결제 관련</span>;
      case 'matching':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">매칭 관련</span>;
      case 'technical':
        return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">기술 지원</span>;
      case 'other':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">기타</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getPopularityLevel = (views: number) => {
    if (views >= 1000) return { level: 'high', icon: 'H', color: 'text-red-600' };
    if (views >= 500) return { level: 'medium', icon: 'M', color: 'text-orange-600' };
    if (views >= 100) return { level: 'low', icon: '👀', color: 'text-blue-600' };
    return { level: 'none', icon: 'L', color: 'text-gray-600' };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">FAQ 목록</h2>
          <span className="text-sm text-gray-600">총 {faqs.length}개</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                순서
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                질문
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                답변 미리보기
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                태그
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                조회수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수정일
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {faqs
              .sort((a, b) => {
                // 활성 상태 -> 카테고리별 순서 -> 전체 순서로 정렬
                if (a.isActive !== b.isActive) return b.isActive ? 1 : -1;
                if (a.category !== b.category) return a.category.localeCompare(b.category);
                return a.order - b.order;
              })
              .map((faq) => {
                const popularity = getPopularityLevel(faq.views);
                return (
                  <tr
                    key={faq.id}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      !faq.isActive ? 'bg-gray-50 opacity-75' : ''
                    }`}
                    onClick={() => onFAQSelect(faq)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">#{faq.order}</span>
                        {popularity.level === 'high' && (
                          <span className={popularity.color}>{popularity.icon}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCategoryBadge(faq.category)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="font-medium max-w-md">
                          <div className="truncate" title={faq.question}>
                            {faq.question}
                          </div>
                        </div>
                        <div className="text-xs text-blue-600 font-mono">{faq.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs">
                        <div className="truncate" title={faq.answer}>
                          {faq.answer}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {faq.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {faq.tags.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{faq.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <span className={`${popularity.color} text-lg`}>{popularity.icon}</span>
                        <span className="font-medium">{faq.views.toLocaleString()}</span>
                      </div>
                      {popularity.level === 'high' && (
                        <div className="text-xs text-red-600 mt-1">인기 FAQ</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {faq.isActive ? (
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
                        <div>{new Date(faq.updatedAt).toLocaleDateString('ko-KR')}</div>
                        <div className="text-xs">
                          {new Date(faq.updatedAt).toLocaleTimeString('ko-KR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <div className="text-xs text-gray-400">{faq.createdBy}</div>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* 데이터가 없는 경우 */}
      {faqs.length === 0 && (
        <div className="p-12 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">FAQ가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
