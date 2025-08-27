import InquiryManagement from "@/components/admin/support/InquiryManagement";

export default function InquiriesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">1:1 문의 관리</h1>
        <p className="text-gray-600 mt-2">고객 문의를 처리하고 답변을 관리합니다</p>
      </div>
      
      <InquiryManagement />
    </div>
  );
}
