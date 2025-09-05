'use client';

import { Report } from '@/lib/reports';
import { Timestamp } from 'firebase/firestore';

interface ReportStatusCardsProps {
  reports: Report[];
}

export default function ReportStatusCards({ reports }: ReportStatusCardsProps) {
  const convertTimestamp = (timestamp: Timestamp | any) => {
    if (!timestamp) return new Date();
    if (timestamp.toDate) return timestamp.toDate();
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
    return new Date(timestamp);
  };

  // 오늘 신고 건수
  const todayReports = reports.filter(r => {
    const today = new Date().toDateString();
    const reportDate = convertTimestamp(r.createdAt).toDateString();
    return today === reportDate;
  });

  // 직거래 신고 통계
  const directTradeReports = reports.filter(r => r.type === 'direct_trade');
  const directTradeProcessed = directTradeReports.filter(r => r.status === 'completed').length;

  // 포상금 지급 건수
  const rewardGiven = reports.filter(r => 
    r.resolution?.reward === 'subscription_1month'
  ).length;

  // 처벌 조치 건수
  const penaltiesGiven = reports.filter(r => r.resolution?.penalty).length;

  const statusCards = [
    {
      title: '접수 대기',
      count: reports.filter(r => r.status === 'pending').length,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: '조사 중',
      count: reports.filter(r => r.status === 'investigating').length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: '처리 완료',
      count: reports.filter(r => r.status === 'completed').length,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: '긴급 신고',
      count: reports.filter(r => r.priority === 'urgent' || 
        (r.type === 'direct_trade' && r.status === 'pending')).length,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: '직거래 신고',
      count: directTradeReports.length,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: '오늘 신고',
      count: todayReports.length,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: '포상금 지급',
      count: rewardGiven,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      title: '처벌 조치',
      count: penaltiesGiven,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3">
      {statusCards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-lg border ${card.borderColor} p-4 hover:shadow-md transition-all duration-200 min-w-0`}
        >
          <div className="text-center">
            <div className={`text-2xl font-bold ${card.color} mb-2`}>
              {card.count}
            </div>
            <p className={`text-xs font-medium ${card.color} truncate`}>
              {card.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
