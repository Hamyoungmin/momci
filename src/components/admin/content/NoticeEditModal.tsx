'use client';

import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

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

interface NoticeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: Notice | null;
  isCreating: boolean;
  onSave: (noticeData: Partial<Notice>) => void;
  onDelete: (noticeId: string) => void;
}

export default function NoticeEditModal({ 
  isOpen, 
  onClose, 
  notice, 
  isCreating, 
  onSave, 
  onDelete 
}: NoticeEditModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'general' | 'important' | 'urgent'>('general');
  const [displayLocation, setDisplayLocation] = useState<'main' | 'mypage' | 'popup'>('main');
  const [targetAudience, setTargetAudience] = useState<'all' | 'parents' | 'teachers'>('all');
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState(1);
  const [hasEndDate, setHasEndDate] = useState(false);

  useEffect(() => {
    if (notice && !isCreating) {
      setTitle(notice.title);
      setContent(notice.content);
      setType(notice.type);
      setDisplayLocation(notice.displayLocation);
      setTargetAudience(notice.targetAudience);
      setIsActive(notice.isActive);
      setStartDate(notice.startDate.split(' ')[0]);
              setPriority(notice.priority || 1);
      
      if (notice.endDate) {
        setEndDate(notice.endDate.split(' ')[0]);
        setHasEndDate(true);
      } else {
        setEndDate('');
        setHasEndDate(false);
      }
    } else if (isCreating) {
      // 새 공지 작성 시 초기값
      setTitle('');
      setContent('');
      setType('general');
      setDisplayLocation('main');
      setTargetAudience('all');
      setIsActive(true);
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setPriority(1);
      setHasEndDate(false);
    }
  }, [notice, isCreating]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const noticeData: Partial<Notice> = {
      title: title.trim(),
      content: content.trim(),
      type,
      displayLocation,
      targetAudience,
      isActive,
      startDate: startDate + ' 00:00',
      priority,
      ...(hasEndDate && endDate && { endDate: endDate + ' 23:59' })
    };

    onSave(noticeData);
  };

  const handleDelete = () => {
    if (!notice) return;
    
    if (confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
      onDelete(notice.id);
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-white rounded-lg p-8 max-w-6xl w-[95vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isCreating ? '새 공지사항 작성' : '공지사항 수정'}
              </h2>
              {!isCreating && notice && (
                <p className="text-sm text-gray-500 mt-1">
                  ID: {notice.id} • 조회수: {notice.views?.toLocaleString() || 0}회
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              type="button"
            >
              ✕
            </button>
          </div>

          {/* 폼 내용 */}
          <form onSubmit={(e) => {e.preventDefault(); handleSave();}} className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="공지사항 제목을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  공지 유형 *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'general' | 'important' | 'urgent')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">일반</option>
                  <option value="important">중요</option>
                  <option value="urgent">긴급</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  노출 위치 *
                </label>
                <select
                  value={displayLocation}
                  onChange={(e) => setDisplayLocation(e.target.value as 'main' | 'mypage' | 'popup')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="main">메인 페이지</option>
                  <option value="mypage">마이 페이지</option>
                  <option value="popup">팝업</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  대상 *
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as 'all' | 'parents' | 'teachers')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체</option>
                  <option value="parents">학부모</option>
                  <option value="teachers">치료사</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  우선순위 *
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 (최고)</option>
                  <option value={2}>2 (높음)</option>
                  <option value={3}>3 (보통)</option>
                  <option value={4}>4 (낮음)</option>
                  <option value={5}>5 (최저)</option>
                </select>
              </div>
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="공지사항 내용을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 노출 기간 */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">노출 기간 설정</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시작일 *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={hasEndDate}
                      onChange={(e) => setHasEndDate(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      종료일 설정
                    </label>
                  </div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={!hasEndDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                  {!hasEndDate && (
                    <p className="text-xs text-gray-500 mt-1">무기한 노출</p>
                  )}
                </div>
              </div>
            </div>

            {/* 활성 상태 */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                공지사항 활성화
              </label>
            </div>

            {/* 미리보기 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">미리보기</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    type === 'urgent' ? 'bg-red-100 text-red-800' :
                    type === 'important' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {type === 'urgent' ? '긴급' :
                     type === 'important' ? '중요' : '일반'}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    displayLocation === 'popup' ? 'bg-purple-100 text-purple-800' :
                    displayLocation === 'mypage' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {displayLocation === 'popup' ? '팝업' :
                     displayLocation === 'mypage' ? '마이페이지' : '메인'}
                  </span>
                </div>
                <h5 className="font-medium text-gray-900">{title || '제목을 입력하세요'}</h5>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {content || '내용을 입력하세요'}
                </p>
              </div>
            </div>

            {/* 버튼들 */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <div>
                {!isCreating && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-md transition-colors"
                  >
                    삭제
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {isCreating ? '작성 완료' : '수정 완료'}
                </button>
              </div>
            </div>
          </form>
        </div>
    </div>
  );
}
