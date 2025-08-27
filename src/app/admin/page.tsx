import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-2">더모든 키즈 플랫폼 운영 현황을 확인하세요</p>
      </div>
      
      <AdminDashboard />
    </div>
  );
}
