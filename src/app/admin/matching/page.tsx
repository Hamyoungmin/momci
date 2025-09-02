import MatchingManagement from "@/components/admin/matching/MatchingManagement";

export default function MatchingManagementPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">매칭 관리</h1>
        <p className="text-gray-600 mt-2">진행 중인 매칭과 완료된 매칭을 관리합니다</p>
      </div>
      
      <MatchingManagement />
    </div>
  );
}
