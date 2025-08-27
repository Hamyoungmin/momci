import RefundManagement from "@/components/admin/payments/RefundManagement";

export default function RefundsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">환불 관리</h1>
        <p className="text-gray-600 mt-2">이용권 및 첫 수업료 환불 요청을 처리합니다</p>
      </div>
      
      <RefundManagement />
    </div>
  );
}
