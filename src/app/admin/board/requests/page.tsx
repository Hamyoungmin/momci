import RequestBoardManagement from "@/components/admin/board/RequestBoardManagement";

export default function RequestBoardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">선생님께 요청하기 게시판 관리</h1>
        <p className="text-gray-600 mt-2">학부모 요청글과 치료사 지원 현황을 관리합니다</p>
      </div>
      
      <RequestBoardManagement />
    </div>
  );
}
