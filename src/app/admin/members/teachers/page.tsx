import TeacherMemberManagement from "@/components/admin/members/TeacherMemberManagement";

export default function TeacherMembersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">치료사 회원 관리</h1>
        <p className="text-gray-600 mt-2">치료사 회원 정보를 조회하고 관리합니다</p>
      </div>
      
      <TeacherMemberManagement />
    </div>
  );
}
