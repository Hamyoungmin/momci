'use client';

import { useState } from 'react';

interface Template {
  id: string;
  title: string;
  category: 'service' | 'payment' | 'technical' | 'account' | 'other';
  content: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface TemplateManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateManagementModal({ isOpen, onClose }: TemplateManagementModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'service' | 'payment' | 'technical' | 'account' | 'other'>('service');
  const [content, setContent] = useState('');

  // 임시 데이터
  const [templates] = useState<Template[]>([
    {
      id: 'TPL001',
      title: '이용권 결제 확인',
      category: 'payment',
      content: '안녕하세요. 고객님의 이용권 결제 문의에 대해 확인해드렸습니다.\n\n입금 내역을 확인한 결과, 정상적으로 결제가 완료되었으며 이용권이 활성화되었습니다.\n\n추가 문의사항이 있으시면 언제든 연락해주세요.\n\n감사합니다.',
      isActive: true,
      usageCount: 25,
      createdAt: '2024-01-10 10:00',
      updatedAt: '2024-01-15 14:30',
      createdBy: '고객지원팀A'
    },
    {
      id: 'TPL002',
      title: '기술 오류 해결 완료',
      category: 'technical',
      content: '안녕하세요. 기술적 문제로 불편을 드려 죄송합니다.\n\n해당 문제는 임시 서버 오류로 인한 것으로 확인되었으며, 현재 정상적으로 복구되었습니다.\n\n향후 동일한 문제가 발생하시면 즉시 연락해주시기 바랍니다.\n\n이용에 불편을 드려 죄송합니다.',
      isActive: true,
      usageCount: 18,
      createdAt: '2024-01-12 09:30',
      updatedAt: '2024-01-18 16:20',
      createdBy: '기술팀A'
    },
    {
      id: 'TPL003',
      title: '매칭 프로세스 안내',
      category: 'service',
      content: '안녕하세요. 매칭 프로세스에 대해 안내드리겠습니다.\n\n1) 학부모 요청글 작성\n2) 치료사 지원\n3) 1:1 채팅 진행\n4) 첫 수업료 결제\n5) 연락처 공개 및 매칭 완료\n\n자세한 내용은 이용 가이드를 참고해주세요.\n\n감사합니다.',
      isActive: true,
      usageCount: 42,
      createdAt: '2024-01-08 14:00',
      updatedAt: '2024-01-20 11:45',
      createdBy: '고객지원팀B'
    },
    {
      id: 'TPL004',
      title: '계정 정보 수정 안내',
      category: 'account',
      content: '안녕하세요. 계정 정보 수정 방법을 안내드리겠습니다.\n\n마이페이지 > 프로필 설정에서 개인정보를 수정하실 수 있습니다.\n\n프로필 사진, 자기소개, 전문분야 등을 업데이트해주세요.\n\n문의사항이 있으시면 언제든 연락해주세요.\n\n감사합니다.',
      isActive: true,
      usageCount: 12,
      createdAt: '2024-01-15 11:20',
      updatedAt: '2024-01-15 11:20',
      createdBy: '고객지원팀A'
    },
    {
      id: 'TPL005',
      title: '환불 처리 안내',
      category: 'payment',
      content: '안녕하세요. 환불 요청에 대해 안내드리겠습니다.\n\n환불 정책에 따라 검토한 결과, 환불 조건에 해당하여 처리해드렸습니다.\n\n환불 금액은 3-5 영업일 내에 원 결제 수단으로 처리됩니다.\n\n추가 문의사항이 있으시면 연락해주세요.\n\n감사합니다.',
      isActive: false,
      usageCount: 8,
      createdAt: '2024-01-05 16:00',
      updatedAt: '2024-01-19 13:30',
      createdBy: '고객지원팀B'
    }
  ]);

  if (!isOpen) return null;

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setTitle(template.title);
    setCategory(template.category);
    setContent(template.content);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setTitle('');
    setCategory('service');
    setContent('');
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleSave = () => {
    // 실제 구현 시 API 호출
    console.log('Save template:', { title, category, content, isCreating });
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedTemplate(null);
  };

  const getCategoryBadge = (category: Template['category']) => {
    switch (category) {
      case 'service':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">💬 서비스</span>;
      case 'payment':
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">💳 결제</span>;
      case 'technical':
        return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">🔧 기술</span>;
      case 'account':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">👤 계정</span>;
      case 'other':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">📝 기타</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 배경 오버레이 */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* 모달 */}
        <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* 헤더 */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">답변 템플릿 관리</h3>
              <p className="text-sm text-gray-600">자주 사용하는 답변을 템플릿으로 관리하세요</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                + 새 템플릿
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 컨텐츠 */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 템플릿 목록 */}
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-4">템플릿 목록</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!template.isActive ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h5 className="font-medium text-gray-900">{template.title}</h5>
                          {getCategoryBadge(template.category)}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {template.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>사용: {template.usageCount}회</span>
                          <span>{new Date(template.updatedAt).toLocaleDateString('ko-KR')}</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        {template.isActive ? (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            활성
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                            비활성
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 템플릿 편집 */}
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-4">
                {isCreating ? '새 템플릿 작성' : isEditing ? '템플릿 편집' : '템플릿 미리보기'}
              </h4>
              
              {selectedTemplate || isCreating ? (
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      {/* 편집 모드 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          템플릿 제목
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="템플릿 제목을 입력하세요"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          카테고리
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="service">서비스 이용</option>
                          <option value="payment">결제 관련</option>
                          <option value="technical">기술 지원</option>
                          <option value="account">계정 관련</option>
                          <option value="other">기타</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          템플릿 내용
                        </label>
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows={12}
                          placeholder="템플릿 내용을 입력하세요"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={handleSave}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                        >
                          {isCreating ? '템플릿 생성' : '수정 완료'}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300"
                        >
                          취소
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* 미리보기 모드 */}
                      {selectedTemplate && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <h5 className="font-medium text-gray-900">{selectedTemplate.title}</h5>
                            {getCategoryBadge(selectedTemplate.category)}
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">
                            {selectedTemplate.content}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>사용 횟수: {selectedTemplate.usageCount}회</span>
                            <span>작성자: {selectedTemplate.createdBy}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setIsEditing(true)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              편집
                            </button>
                            <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">
                              복사
                            </button>
                            <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                              삭제
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">템플릿을 선택하여 미리보기나 편집해보세요</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
