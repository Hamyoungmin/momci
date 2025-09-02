import SubscriptionPaymentManagement from "@/components/admin/payments/SubscriptionPaymentManagement";

export default function SubscriptionPaymentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">이용권 결제 관리</h1>
        <p className="text-gray-600 mt-2">학부모 및 치료사 이용권 결제 현황을 관리합니다</p>
      </div>
      
      <SubscriptionPaymentManagement />
    </div>
  );
}
