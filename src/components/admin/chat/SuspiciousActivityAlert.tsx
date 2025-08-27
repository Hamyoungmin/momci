'use client';

interface SuspiciousActivityAlertProps {
  suspiciousCount: number;
  directTradeCount: number;
  onViewDetails: () => void;
}

export default function SuspiciousActivityAlert({ 
  suspiciousCount, 
  directTradeCount, 
  onViewDetails 
}: SuspiciousActivityAlertProps) {
  if (suspiciousCount === 0 && directTradeCount === 0) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            🚨 긴급: 의심스러운 활동 감지
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="space-y-1">
              {directTradeCount > 0 && (
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  <strong>{directTradeCount}건</strong>의 직거래 유도 시도가 감지되었습니다.
                </li>
              )}
              {suspiciousCount > 0 && (
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  <strong>{suspiciousCount}건</strong>의 의심스러운 활동이 감지되었습니다.
                </li>
              )}
            </ul>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={onViewDetails}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
            >
              상세 보기
            </button>
            <button className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200">
              알림 설정
            </button>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <div className="animate-pulse">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
