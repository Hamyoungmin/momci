'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface Alert {
  type: 'urgent' | 'warning' | 'info';
  title: string;
  count: number;
  href: string;
  icon: string;
}

export default function AlertCenter() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubs: (() => void)[] = [];
    try {
      const qProfile = query(collection(db, 'profileSubmissions'), where('status', '==', 'pending'));
      const qReports = query(collection(db, 'reports'), where('status', '==', 'pending'));
      const qPayments = query(collection(db, 'payment-confirmations'), where('status', '==', 'pending'));
      const qInquiries = query(collection(db, 'inquiries'), where('status', '==', 'pending'));

      const counts = { profile: 0, reports: 0, payments: 0, inquiries: 0 };
      const emit = () => setAlerts([
        { type: 'urgent', title: '미승인 프로필', count: counts.profile, href: '/admin/profile-verification', icon: 'P' },
        { type: 'urgent', title: '직거래 신고', count: counts.reports, href: '/admin/reports', icon: 'R' },
        { type: 'warning', title: '미확인 입금', count: counts.payments, href: '/admin/payments/subscriptions', icon: '$' },
        { type: 'info', title: '답변 대기 문의', count: counts.inquiries, href: '/admin/support/inquiries', icon: 'Q' }
      ]);

      unsubs.push(onSnapshot(qProfile, (snap) => { counts.profile = snap.size; emit(); }));
      unsubs.push(onSnapshot(qReports, (snap) => { counts.reports = snap.size; emit(); }));
      unsubs.push(onSnapshot(qPayments, (snap) => { counts.payments = snap.size; emit(); }));
      unsubs.push(onSnapshot(qInquiries, (snap) => { counts.inquiries = snap.size; emit(); }));
    } catch (e) {
      console.error('긴급 알림 실시간 초기화 실패:', e);
    }
    return () => unsubs.forEach(u => u());
  }, []);

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';
    }
  };


  return (
    <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">긴급 알림 센터</h2>
          <p className="text-sm text-gray-500">실시간 모니터링 중</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-600">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {alerts.map((alert, index) => (
          <Link
            key={index}
            href={alert.href}
            className={`group block p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {alert.icon}
                </div>
                <div>
                  <p className="font-semibold group-hover:font-bold transition-all">{alert.title}</p>
                  <p className="text-xs opacity-70 font-medium">처리 필요</p>
                </div>
              </div>
              <div className="relative">
                <span className="text-sm font-bold">
                  {alert.count}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* 하단 요약 */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            총 <span className="font-semibold text-gray-900">{alerts.reduce((sum, alert) => sum + alert.count, 0)}건</span>의 알림이 있습니다
          </span>
          <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            전체 알림 보기 →
          </button>
        </div>
      </div>
    </div>
  );
}
