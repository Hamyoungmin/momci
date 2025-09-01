'use client';

import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  type: 'member' | 'matching' | 'payment' | 'report';
  title: string;
  description: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  icon: string;
}

export default function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        // TODO: Firebase에서 실제 활동 데이터 조회
        // const activitiesData = await getRecentActivities();
        
        // 임시로 빈 배열로 시작
        setActivities([]);
      } catch (error) {
        console.error('활동 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'pending':
        return '대기중';
      case 'failed':
        return '실패';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">📊</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">최근 활동</h2>
            <p className="text-sm text-gray-500">실시간 업데이트</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors text-sm">
          전체 보기 →
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          // 로딩 상태
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          // 빈 상태
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">📊</span>
            </div>
            <p className="text-gray-500 font-medium">최근 활동이 없습니다</p>
            <p className="text-gray-400 text-sm mt-1">새로운 활동이 있으면 여기에 표시됩니다</p>
          </div>
        ) : (
          activities.map((activity) => (
          <div key={activity.id} className="group flex items-start space-x-4 p-4 hover:bg-blue-50 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <span className="text-xl">{activity.icon}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                  {activity.title}
                </p>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)} shadow-sm`}
                >
                  {getStatusText(activity.status)}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{activity.description}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500 font-medium">{activity.time}</p>
                <div className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  자세히 보기 →
                </div>
              </div>
            </div>
          </div>
        ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
          더 많은 활동 보기
        </button>
      </div>
    </div>
  );
}
