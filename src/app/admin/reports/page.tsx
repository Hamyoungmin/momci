import ReportManagement from "@/components/admin/reports/ReportManagement";

export default function ReportsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">신고 관리</h1>
        <p className="text-gray-600 mt-2">직거래 신고 및 기타 민원을 처리합니다</p>
      </div>
      
      <ReportManagement />
    </div>
  );
}
