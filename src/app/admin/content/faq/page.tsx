import FAQManagement from "@/components/admin/content/FAQManagement";

export default function FAQPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">FAQ 관리</h1>
        <p className="text-gray-600 mt-2">자주 묻는 질문과 답변을 관리합니다</p>
      </div>
      
      <FAQManagement />
    </div>
  );
}
