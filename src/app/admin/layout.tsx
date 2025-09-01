'use client';

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useUserSession } from "@/hooks/useUserSession";

// 관리자 이메일 목록 (환경변수로 관리 권장)
const ADMIN_EMAILS = ['dudals7334@naver.com'];

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
  
  // 사용자 세션 추적 활성화
  useUserSession();

  useEffect(() => {
    if (currentUser?.email) {
      const adminStatus = checkAdminAuth(currentUser.email);
      setIsAdmin(adminStatus);
    }
  }, [currentUser]);

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

  // 현재는 아무나 접근 가능하되, 관리자 권한에 따라 UI를 다르게 표시
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
            {/* 관리자가 아닌 경우 알림 표시 */}
            {!isAdmin && currentUser && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>읽기 전용 모드:</strong> 관리자 권한이 없어 일부 기능이 제한됩니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
