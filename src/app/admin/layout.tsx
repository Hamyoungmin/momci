'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useUserSession } from "@/hooks/useUserSession";

// 관리자 이메일 목록 (환경변수로 관리 권장)
const ADMIN_EMAILS = ['dudals7334@naver.com', 'everystars@naver.com'];

// 관리자 권한 확인 함수
function checkAdminAuth(userEmail: string | null): boolean {
  if (!userEmail) return false;
  return ADMIN_EMAILS.includes(userEmail);
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentUser, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  
  // 사용자 세션 추적 활성화
  useUserSession();

  useEffect(() => {
    if (currentUser?.email) {
      const adminStatus = checkAdminAuth(currentUser.email);
      setIsAdmin(adminStatus);
    }
  }, [currentUser]);

  // 비관리자/비로그인 접근 차단
  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.replace("/");
      } else if (!isAdmin) {
        router.replace("/");
      }
    }
  }, [loading, currentUser, isAdmin, router]);

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 비관리자이거나 비로그인 상태에서는 렌더 차단
  if (!loading && (!currentUser || !isAdmin)) {
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* 사이드바 */}
      <AdminSidebar isAdmin={isAdmin} />
      
      {/* 메인 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 관리자 전용 헤더 */}
        <AdminHeader isAdmin={isAdmin} />
        
        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 p-6 pb-20 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
