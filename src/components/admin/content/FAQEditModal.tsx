'use client';

import { useState, useEffect } from 'react';
import { FAQ } from '@/lib/faq';

interface FAQEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq: FAQ | null;
  isCreating: boolean;
  onSave: (faqData: Partial<FAQ>) => void;
  onDelete: (faqId: string) => void;
}

export default function FAQEditModal({ 
  isOpen, 
  onClose, 
  faq, 
  isCreating, 
  onSave, 
  onDelete 
}: FAQEditModalProps) {
  // 기본 상태
  const [formData, setFormData] = useState({
    category: 'common',
    question: '',
    answer: '',
    isActive: true,
    order: 1
  });

  // 닫기 애니메이션을 위한 상태
  const [isClosing, setIsClosing] = useState(false);

  // 모달이 열릴 때 데이터 초기화
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false); // 열릴 때 닫기 상태 리셋
      if (faq && !isCreating) {
        setFormData({
          category: faq.category,
          question: faq.question,
          answer: faq.answer,
          isActive: faq.isActive,
          order: faq.order
        });
      } else if (isCreating) {
        setFormData({
          category: 'common',
          question: '',
          answer: '',
          isActive: true,
          order: 1
        });
      }
    }
  }, [isOpen, faq, isCreating]);

  // 애니메이션과 함께 닫기
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 250); // 애니메이션 시간과 맞춤
  };

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  // 저장 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('질문과 답변을 모두 입력해주세요.');
      return;
    }

    const faqData: Partial<FAQ> = {
      category: formData.category,
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      isActive: formData.isActive,
      order: formData.order,
      ...(isCreating && { 
        views: 0,
        createdBy: 'admin'
      })
    };

    onSave(faqData);
  };

  // 삭제 핸들러
  const handleDelete = () => {
    if (!faq || isCreating) return;
    
    if (window.confirm('정말 이 FAQ를 삭제하시겠습니까?')) {
      onDelete(faq.id);
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 카테고리 이름 매핑
  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'common': '공통질문',
      'parent': '학부모 회원',
      'therapist': '치료사 회원',
      'payment': '결제 및 회원'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className={`bg-white rounded-lg p-8 max-w-6xl w-[95vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto ${isClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isCreating ? '새 FAQ 작성' : 'FAQ 수정'}
              </h2>
              {!isCreating && faq && (
                <p className="text-sm text-gray-500 mt-1">
                  ID: {faq.id} • 조회수: {faq.views?.toLocaleString() || 0}회
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              type="button"
            >
              ✕
            </button>
          </div>

          {/* 폼 내용 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 카테고리 & 순서 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="common">공통질문</option>
                  <option value="parent">학부모 회원</option>
                  <option value="therapist">치료사 회원</option>
                  <option value="payment">결제 및 회원</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  순서
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* 질문 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                질문 *
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                placeholder="자주 묻는 질문을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 답변 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                답변 *
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) => handleInputChange('answer', e.target.value)}
                placeholder="질문에 대한 답변을 입력하세요"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 활성 상태 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                활성화 (체크 해제 시 사용자에게 보이지 않습니다)
              </label>
            </div>

            {/* 미리보기 */}
            {formData.question && formData.answer && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="text-sm font-medium text-gray-900 mb-2">미리보기</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {getCategoryName(formData.category)}
                    </span>
                    <span className="text-xs text-gray-500">순서: {formData.order}</span>
                    {formData.isActive ? (
                      <span className="text-xs text-green-600">활성</span>
                    ) : (
                      <span className="text-xs text-red-600">비활성</span>
                    )}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Q. {formData.question}</p>
                    <p className="text-gray-600 mt-1">A. {formData.answer}</p>
                  </div>
                </div>
              </div>
            )}

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
                  onClick={handleClose}
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