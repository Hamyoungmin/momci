'use client';

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
  const activities: Activity[] = [
    {
      id: '1',
      type: 'member',
      title: '새로운 치료사 가입',
      description: '김○○ 언어치료사가 프로필을 등록했습니다.',
      time: '5분 전',
      status: 'pending',
      icon: '👩‍⚕️'
    },
    {
      id: '2',
      type: 'matching',
      title: '매칭 완료',
      description: '서울 강남구 언어치료 매칭이 성공했습니다.',
      time: '12분 전',
      status: 'completed',
      icon: '🤝'
    },
    {
      id: '3',
      type: 'payment',
      title: '이용권 결제',
      description: '학부모 이용권 결제가 완료되었습니다.',
      time: '18분 전',
      status: 'completed',
      icon: '💳'
    },
    {
      id: '4',
      type: 'report',
      title: '직거래 신고 접수',
      description: '치료사의 직거래 유도 신고가 접수되었습니다.',
      time: '25분 전',
      status: 'pending',
      icon: '🚨'
    },
    {
      id: '5',
      type: 'member',
      title: '학부모 회원가입',
      description: '새로운 학부모가 회원가입을 완료했습니다.',
      time: '32분 전',
      status: 'completed',
      icon: '👨‍👩‍👧‍👦'
    }
  ];

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
        {activities.map((activity) => (
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
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
          더 많은 활동 보기
        </button>
      </div>
    </div>
  );
}
