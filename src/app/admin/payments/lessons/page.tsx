import LessonPaymentManagement from "@/components/admin/payments/LessonPaymentManagement";

export default function LessonPaymentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">첫 수업료 관리</h1>
        <p className="text-gray-600 mt-2">안전결제 시스템을 통한 첫 수업료 결제 및 정산을 관리합니다</p>
      </div>
      
      <LessonPaymentManagement />
    </div>
  );
}
