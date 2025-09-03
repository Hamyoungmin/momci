'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  isNew: boolean;
  isImportant: boolean;
  createdAt: any;
  updatedAt: any;
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isImportant: false
  });

  // Firebase에서 공지사항 데이터 가져오기
  useEffect(() => {
    const noticesQuery = query(
      collection(db, 'notices'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(noticesQuery, (snapshot) => {
      const noticesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Notice[];
      
      setNotices(noticesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 모달 열기
  const openModal = (notice?: Notice) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        content: notice.content,
        isImportant: notice.isImportant
      });
    } else {
      setEditingNotice(null);
      setFormData({
        title: '',
        content: '',
        isImportant: false
      });
    }
    setShowModal(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
    setEditingNotice(null);
    setFormData({
      title: '',
      content: '',
      isImportant: false
    });
  };

  // 공지사항 저장
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const now = new Date();
      const dateString = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
      
      if (editingNotice) {
        // 수정
        await updateDoc(doc(db, 'notices', editingNotice.id), {
          title: formData.title,
          content: formData.content,
          isImportant: formData.isImportant,
          updatedAt: serverTimestamp()
        });
        alert('공지사항이 수정되었습니다.');
      } else {
        // 새로 작성
        await addDoc(collection(db, 'notices'), {
          title: formData.title,
          content: formData.content,
          date: dateString,
          isNew: true,
          isImportant: formData.isImportant,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        alert('공지사항이 작성되었습니다.');
      }
      
      closeModal();
    } catch (error) {
      console.error('공지사항 저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 공지사항 삭제
  const handleDelete = async (noticeId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await deleteDoc(doc(db, 'notices', noticeId));
      alert('공지사항이 삭제되었습니다.');
    } catch (error) {
      console.error('공지사항 삭제 실패:', error);
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
          <p className="text-gray-600 mt-1">공지사항을 작성하고 관리하세요</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          새 공지사항 작성
        </button>
      </div>

      {/* 공지사항 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            전체 공지사항 ({notices.length}건)
          </h2>
        </div>
        
        {notices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">작성된 공지사항이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notices.map((notice) => (
              <div key={notice.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {notice.isImportant && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          중요
                        </span>
                      )}
                      {notice.isNew && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          새글
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {notice.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                      {notice.content}
                    </p>
                    <div className="text-sm text-gray-500">
                      작성일: {notice.date} | 
                      {notice.updatedAt && notice.updatedAt !== notice.createdAt && 
                        ` 수정일: ${notice.updatedAt.toLocaleDateString()}`
                      }
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => openModal(notice)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 작성/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingNotice ? '공지사항 수정' : '새 공지사항 작성'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="공지사항 제목을 입력하세요"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* 중요 공지 체크박스 */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isImportant"
                  checked={formData.isImportant}
                  onChange={(e) => setFormData({...formData, isImportant: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isImportant" className="ml-2 block text-sm text-gray-900">
                  중요 공지사항으로 설정
                </label>
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용 *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="공지사항 내용을 입력하세요"
                  rows={10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  required
                />
              </div>

              {/* 버튼 */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  {editingNotice ? '수정하기' : '작성하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}