'use client';

import { useState, useEffect } from 'react';

interface FAQ {
  id: string;
  category: 'general' | 'payment' | 'matching' | 'technical' | 'other';
  question: string;
  answer: string;
  isActive: boolean;
  views: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
}

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
  const [category, setCategory] = useState<'general' | 'payment' | 'matching' | 'technical' | 'other'>('general');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (faq && !isCreating) {
      setCategory(faq.category);
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setIsActive(faq.isActive);
      setOrder(faq.order);
      setTags(faq.tags);
    } else if (isCreating) {
      // 새 FAQ 작성 시 초기값
      setCategory('general');
      setQuestion('');
      setAnswer('');
      setIsActive(true);
      setOrder(1);
      setTags([]);
    }
  }, [faq, isCreating]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) {
      alert('질문과 답변을 입력해주세요.');
      return;
    }

    const faqData: Partial<FAQ> = {
      category,
      question: question.trim(),
      answer: answer.trim(),
      isActive,
      order,
      tags,
      ...(isCreating && { 
        id: 'FAQ' + Date.now().toString().slice(-3),
        views: 0
      })
    };

    onSave(faqData);
  };

  const handleDelete = () => {
    if (!faq) return;
    
    if (confirm('정말 이 FAQ를 삭제하시겠습니까?')) {
      onDelete(faq.id);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 배경 오버레이 */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* 모달 */}
        <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* 헤더 */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {isCreating ? '새 FAQ 작성' : 'FAQ 수정'}
              </h3>
              {!isCreating && faq && (
                <p className="text-sm text-gray-600">ID: {faq.id} | 조회수: {faq.views.toLocaleString()}</p>
              )}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 폼 내용 */}
          <div className="mt-6 space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">일반 이용 문의</option>
                  <option value="payment">결제 관련</option>
                  <option value="matching">매칭 관련</option>
                  <option value="technical">기술 지원</option>
                  <option value="other">기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  순서 *
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  min={1}
                  max={99}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">숫자가 낮을수록 먼저 표시됩니다</p>
              </div>
            </div>

            {/* 질문 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                질문 *
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="자주 묻는 질문을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 답변 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                답변 *
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                placeholder="상세한 답변을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 태그 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="태그를 입력하고 Enter를 누르세요"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    추가
                  </button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
                FAQ 활성화
              </label>
            </div>

            {/* 미리보기 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">미리보기</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    category === 'general' ? 'bg-blue-100 text-blue-800' :
                    category === 'payment' ? 'bg-purple-100 text-purple-800' :
                    category === 'matching' ? 'bg-green-100 text-green-800' :
                    category === 'technical' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {category === 'general' ? '💬 일반 이용' :
                     category === 'payment' ? '💳 결제 관련' :
                     category === 'matching' ? '🤝 매칭 관련' :
                     category === 'technical' ? '🔧 기술 지원' : '📝 기타'}
                  </span>
                  <span className="text-xs text-gray-500">순서: #{order}</span>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    {question || '질문을 입력하세요'}
                  </h5>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {answer || '답변을 입력하세요'}
                  </p>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 푸터 */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
            <div>
              {!isCreating && faq && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  삭제
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {isCreating ? '작성 완료' : '수정 완료'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
