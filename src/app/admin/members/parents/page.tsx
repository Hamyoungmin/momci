import ParentMemberManagement from "@/components/admin/members/ParentMemberManagement";

export default function ParentMembersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">학부모 회원 관리</h1>
        <p className="text-gray-600 mt-2">학부모 회원 정보를 조회하고 관리합니다</p>
      </div>
      
      <ParentMemberManagement />
    </div>
  );
}
