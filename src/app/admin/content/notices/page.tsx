import NoticeManagement from "@/components/admin/content/NoticeManagement";

export default function NoticesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">공지사항 관리</h1>
        <p className="text-gray-600 mt-2">플랫폼 공지사항을 작성하고 관리합니다</p>
      </div>
      
      <NoticeManagement />
    </div>
  );
}