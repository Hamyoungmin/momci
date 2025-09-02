import ProfileVerificationSystem from "@/components/admin/profile/ProfileVerificationSystem";

export default function ProfileVerificationPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">프로필 검증 시스템</h1>
        <p className="text-gray-600 mt-2">치료사 프로필 승인 요청을 검토하고 관리합니다</p>
      </div>
      
      <ProfileVerificationSystem />
    </div>
  );
}
