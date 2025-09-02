import ChatManagement from "@/components/admin/chat/ChatManagement";

export default function ChatManagementPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">채팅 관리 및 모니터링</h1>
        <p className="text-gray-600 mt-2">1:1 실시간 채팅을 모니터링하고 부정행위를 감지합니다</p>
      </div>
      
      <ChatManagement />
    </div>
  );
}
