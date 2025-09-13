'use client';

import PaymentSettingsManagement from "@/components/admin/payments/PaymentSettingsManagement";

export default function PaymentSettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">결제 설정 관리</h1>
        <p className="text-gray-600 mt-2">이용권 가격 및 계좌 정보를 관리합니다</p>
      </div>
      
      <PaymentSettingsManagement />
    </div>
  );
}
