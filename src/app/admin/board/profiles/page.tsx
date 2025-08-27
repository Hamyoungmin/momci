import ProfileBoardManagement from "@/components/admin/board/ProfileBoardManagement";

export default function ProfileBoardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">선생님 둘러보기 게시판 관리</h1>
        <p className="text-gray-600 mt-2">치료사 프로필 노출 순서와 품질을 관리합니다</p>
      </div>
      
      <ProfileBoardManagement />
    </div>
  );
}
