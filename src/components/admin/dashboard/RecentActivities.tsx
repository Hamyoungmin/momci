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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">최근 활동</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          전체 보기
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg">{activity.icon}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}
                >
                  {getStatusText(activity.status)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium">
          더 많은 활동 보기
        </button>
      </div>
    </div>
  );
}
