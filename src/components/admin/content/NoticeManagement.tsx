'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import NoticeTable from './NoticeTable';
import NoticeEditModal from './NoticeEditModal';

interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'important' | 'urgent';
  displayLocation: 'main' | 'mypage' | 'popup';
  isActive: boolean;
  startDate: string;
  endDate?: string;
  views?: number;
  createdAt: Date | Timestamp | null;
  updatedAt: Date | Timestamp | null;
  createdBy: string;
  priority?: number;
  targetAudience: 'all' | 'parents' | 'teachers';
}

export default function NoticeManagement() {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Firebase에서 실제 데이터 가져오기
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  // Firebase에서 공지사항 데이터 로드
  useEffect(() => {
    const noticesQuery = query(
      collection(db, 'notices'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(noticesQuery, (snapshot) => {
      const noticesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as Notice;
      });
      
      setNotices(noticesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNoticeSelect = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsCreating(false);
    setIsEditModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedNotice(null);
    setIsCreating(true);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedNotice(null);
    setIsCreating(false);
  };

  const handleSaveNotice = async (noticeData: Partial<Notice>) => {
    try {
      if (isCreating) {
        // 새 공지사항 작성
        const now = new Date();
        const dateString = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
        
        await addDoc(collection(db, 'notices'), {
          ...noticeData,
          views: 0,
          createdBy: 'admin',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          startDate: noticeData.startDate || dateString + ' 00:00'
        });
        alert('✅ 공지사항이 성공적으로 작성되었습니다!');
      } else if (selectedNotice) {
        // 공지사항 수정
        await updateDoc(doc(db, 'notices', selectedNotice.id), {
          ...noticeData,
          updatedAt: serverTimestamp()
        });
        alert('✅ 공지사항이 성공적으로 수정되었습니다!');
      }
      
      handleCloseModal();
    } catch (error: unknown) {
      console.error('공지사항 저장 오류:', error);
      
      let errorMessage = '공지사항 저장 중 오류가 발생했습니다.';
      
      const err = error as { message?: string; code?: string };
      if (err.message) {
        if (err.message.includes('사용자가 인증되지 않았습니다')) {
          errorMessage = '❌ 로그인이 필요합니다.\n페이지를 새로고침하고 다시 로그인해주세요.';
        } else if (err.code === 'permission-denied') {
          errorMessage = '❌ 권한이 없습니다.\n관리자 계정으로 로그인했는지 확인해주세요.';
        } else if (err.code === 'unauthenticated') {
          errorMessage = '❌ 인증이 만료되었습니다.\n페이지를 새로고침하고 다시 로그인해주세요.';
        } else if (err.message.includes('Network')) {
          errorMessage = '❌ 네트워크 오류입니다.\n인터넷 연결을 확인해주세요.';
        } else {
          errorMessage = `❌ 오류: ${err.message}`;
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    if (!confirm('정말 이 공지사항을 삭제하시겠습니까?')) return;
    
    try {
      await deleteDoc(doc(db, 'notices', noticeId));
      alert('✅ 공지사항이 삭제되었습니다.');
      handleCloseModal();
    } catch (error: unknown) {
      console.error('공지사항 삭제 오류:', error);
      alert('❌ 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const filteredNotices = notices.filter(notice => {
    if (typeFilter !== 'all' && notice.type !== typeFilter) return false;
    if (statusFilter === 'active' && !notice.isActive) return false;
    if (statusFilter === 'inactive' && notice.isActive) return false;
    return true;
  });

  const activeNotices = notices.filter(n => n.isActive);
  const urgentNotices = notices.filter(n => n.type === 'urgent' && n.isActive);
  const totalViews = notices.reduce((sum, n) => sum + (n.views || 0), 0);

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
            <p className="text-gray-600 mt-1">플랫폼 공지사항을 작성하고 관리합니다</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{activeNotices.length}</div>
              <div className="text-sm text-gray-500">활성 공지</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">{urgentNotices.length}</div>
              <div className="text-sm text-gray-500">긴급 공지</div>
            </div>
          </div>
        </div>
      </div>

      {/* 상태 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border-2 border-green-100 p-6 hover:border-green-200 transition-all duration-200 group">
          <div className="flex items-center">

            <div className="">
              <p className="text-sm font-medium text-gray-500">활성 공지</p>
              <p className="text-xl font-bold text-gray-900">{activeNotices.length}건</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-red-100 p-6 hover:border-red-200 transition-all duration-200 group">
          <div className="flex items-center">
            <div className="">
              <p className="text-sm font-medium text-gray-500">긴급 공지</p>
              <p className="text-xl font-bold text-gray-900">{urgentNotices.length}건</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-purple-100 p-6 hover:border-purple-200 transition-all duration-200 group">
          <div className="flex items-center">
            <div className="">
              <p className="text-sm font-medium text-gray-500">팝업 공지</p>
              <p className="text-xl font-bold text-gray-900">
                {notices.filter(n => n.displayLocation === 'popup' && n.isActive).length}건
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-orange-100 p-6 hover:border-orange-200 transition-all duration-200 group">
          <div className="flex items-center">
            <div className="">
              <p className="text-sm font-medium text-gray-500">총 조회수</p>
              <p className="text-xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-green-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">공지사항 필터 및 관리</h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* 유형 필터 */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-sm border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">전체 유형</option>
              <option value="general">일반</option>
              <option value="important">중요</option>
              <option value="urgent">긴급</option>
            </select>

            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>

            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
            >
              + 새 공지 작성
            </button>
          </div>
        </div>

        {/* 긴급 공지 알림 */}
        {urgentNotices.length > 0 && (
          <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-red-800">
                {urgentNotices.length}건의 긴급 공지가 활성화되어 있습니다.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 공지사항 목록 */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-green-100">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">공지사항 목록</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                총 {filteredNotices.length}건
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-3 text-gray-600">공지사항 데이터를 불러오는 중...</span>
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">공지사항이 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500">
                {notices.length === 0 ? '첫 번째 공지사항을 작성해보세요.' : '검색 조건에 맞는 공지사항이 없습니다.'}
              </p>
              {notices.length === 0 && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    새 공지사항 작성
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NoticeTable
              notices={filteredNotices}
              onNoticeSelect={handleNoticeSelect}
            />
          )}
        </div>
      </div>

      {/* 공지사항 편집 모달 */}
      <NoticeEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        notice={selectedNotice}
        isCreating={isCreating}
        onSave={handleSaveNotice}
        onDelete={handleDeleteNotice}
      />
    </div>
  );
}
