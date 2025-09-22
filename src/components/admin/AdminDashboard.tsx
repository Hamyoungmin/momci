'use client';

import React from 'react';
import StatsCards from './dashboard/StatsCards';
import AlertCenter from './dashboard/AlertCenter';

export default function AdminDashboard() {
  return (
    <div className="space-y-6 pb-24">
      {/* 통계 카드 영역 */}
      <StatsCards />

      {/* 긴급 알림 센터 */}
      <AlertCenter />
    </div>
  );
}
