import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata: Metadata = {
  title: "관리자 페이지 - 더모든 키즈",
  description: "더모든 키즈 관리자 전용 페이지",
};

// TODO: 실제 구현 시 사용자 인증 상태 확인 로직 추가
function checkAdminAuth(): boolean {
  // 임시로 true 반환 (개발 단계에서만)
  // 실제로는 JWT 토큰이나 세션에서 isAdmin 확인
  return true;
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 관리자 권한 확인
  const isAdmin = checkAdminAuth();
  
  if (!isAdmin) {
    redirect("/"); // 권한이 없으면 홈페이지로 리다이렉트
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 관리자 전용 헤더 */}
      <AdminHeader />
      
      <div className="flex">
        {/* 사이드바 */}
        <AdminSidebar />
        
        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
