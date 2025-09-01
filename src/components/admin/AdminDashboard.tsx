'use client';

import { useState, useEffect } from 'react';
import StatsCards from './dashboard/StatsCards';
import AlertCenter from './dashboard/AlertCenter';
import RecentActivities from './dashboard/RecentActivities';
import QuickActions from './dashboard/QuickActions';

export default function AdminDashboard() {
  return (
    <div className="space-y-6 pb-24">
      {/* 통계 카드 영역 */}
      <StatsCards />

      {/* 긴급 알림 센터 */}
      <AlertCenter />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 활동 */}
        <RecentActivities />

        {/* 빠른 작업 */}
        <QuickActions />
      </div>
    </div>
  );
}
