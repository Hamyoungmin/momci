'use client';

import { useState } from 'react';

interface Inquiry {
  id: string;
  userId: string;
  userName: string;
  userType: 'parent' | 'teacher';
  userEmail: string;
  category: 'service' | 'payment' | 'technical' | 'account' | 'other';
  title: string;
  content: string;
  status: 'pending' | 'assigned' | 'answered' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  attachments: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
  tags: string[];
  responseTime?: number;
}

interface InquiryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: Inquiry;
  onInquiryAction: (
    inquiryId: string,
    action: 'assign' | 'answer' | 'close',
    data: {
      assignee?: string;
      answer?: string;
      priority?: string;
    }
  ) => void;
}

export default function InquiryDetailModal({ isOpen, onClose, inquiry, onInquiryAction }: InquiryDetailModalProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [actionType, setActionType] = useState<'assign' | 'answer' | 'close' | null>(null);
  const [assignee, setAssignee] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPriority, setNewPriority] = useState(inquiry.priority);

  if (!isOpen) return null;

  const tabs = [
    { id: 'details', label: '문의 상세' },
    { id: 'attachments', label: `첨부파일 (${inquiry.attachments.length})` },
    { id: 'actions', label: '처리 작업' }
  ];

  const handleAction = () => {
    if (!actionType) return;

    const data: any = {};
    if (actionType === 'assign') {
      data.assignee = assignee;
    } else if (actionType === 'answer') {
      data.answer = answer;
    }
    data.priority = newPriority;

    onInquiryAction(inquiry.id, actionType, data);
  };

  const getSLAStatus = () => {
    const now = new Date();
    const created = new Date(inquiry.createdAt);
    const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    
    const slaHours = {
      urgent: 2,
      high: 4,
      medium: 24,
      low: 48
    };
    
    const targetHours = slaHours[inquiry.priority];
    const remainingHours = targetHours - diffHours;
    
    if (remainingHours <= 0) {
      return { status: 'overdue', message: `${Math.abs(remainingHours).toFixed(1)}시간 지연`, color: 'text-red-600' };
    } else if (remainingHours <= targetHours * 0.2) {
      return { status: 'urgent', message: `${remainingHours.toFixed(1)}시간 남음`, color: 'text-orange-600' };
    }
    return { status: 'normal', message: `${remainingHours.toFixed(1)}시간 남음`, color: 'text-green-600' };
  };

  const slaStatus = getSLAStatus();

  // 답변 템플릿
  const templates = [
    {
      category: 'payment',
      title: '이용권 결제 확인',
      content: '안녕하세요. 고객님의 이용권 결제 문의에 대해 확인해드렸습니다.\n\n입금 내역을 확인한 결과, 정상적으로 결제가 완료되었으며 이용권이 활성화되었습니다.\n\n추가 문의사항이 있으시면 언제든 연락해주세요.\n\n감사합니다.'
    },
    {
      category: 'technical',
      title: '기술 오류 안내',
      content: '안녕하세요. 기술적 문제로 불편을 드려 죄송합니다.\n\n해당 문제는 서버 오류로 인한 것으로 확인되었으며, 현재 정상적으로 복구되었습니다.\n\n향후 동일한 문제가 발생하시면 즉시 연락해주시기 바랍니다.\n\n이용에 불편을 드려 죄송합니다.'
    },
    {
      category: 'service',
      title: '서비스 이용 안내',
      content: '안녕하세요. 서비스 이용 관련 문의해주셔서 감사합니다.\n\n문의해주신 내용에 대해 상세히 안내드리겠습니다.\n\n추가 궁금한 사항이 있으시면 언제든 문의해주세요.\n\n감사합니다.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 배경 오버레이 */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* 모달 */}
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* 헤더 */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">문의 상세 처리</h3>
              <p className="text-sm text-gray-600">문의 ID: {inquiry.id}</p>
            </div>
            <div className="flex items-center space-x-4">
              {inquiry.priority === 'urgent' && (
                <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                  긴급 문의
                </span>
              )}
              <span className={`text-sm font-medium ${slaStatus.color}`}>
                SLA: {slaStatus.message}
              </span>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">고객:</span>
                <span className="font-medium ml-2">
                  {inquiry.userName} ({inquiry.userType === 'parent' ? '학부모' : '치료사'})
                </span>
              </div>
              <div>
                <span className="text-gray-600">카테고리:</span>
                <span className="font-medium ml-2">
                  {inquiry.category === 'service' ? '서비스 이용' :
                   inquiry.category === 'payment' ? '결제 관련' :
                   inquiry.category === 'technical' ? '기술 지원' :
                   inquiry.category === 'account' ? '계정 관련' : '기타'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">상태:</span>
                <span className="font-medium ml-2">
                  {inquiry.status === 'pending' ? '접수' :
                   inquiry.status === 'assigned' ? '배정' :
                   inquiry.status === 'answered' ? '답변완료' : '종료'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">우선순위:</span>
                <span className={`font-medium ml-2 ${
                  inquiry.priority === 'urgent' ? 'text-red-600' :
                  inquiry.priority === 'high' ? 'text-orange-600' :
                  inquiry.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {inquiry.priority === 'urgent' ? '긴급' :
                   inquiry.priority === 'high' ? '높음' :
                   inquiry.priority === 'medium' ? '보통' : '낮음'}
                </span>
              </div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="mt-6 max-h-96 overflow-y-auto">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* 고객 정보 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-3">고객 정보</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">이름:</span>
                      <span className="font-medium ml-2">{inquiry.userName}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">회원 ID:</span>
                      <span className="font-medium ml-2">{inquiry.userId}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">이메일:</span>
                      <span className="font-medium ml-2">{inquiry.userEmail}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">회원 유형:</span>
                      <span className="font-medium ml-2">
                        {inquiry.userType === 'parent' ? '학부모' : '치료사'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 문의 내용 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">문의 내용</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">제목:</span>
                      <h5 className="font-medium text-gray-900 mt-1">{inquiry.title}</h5>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">상세 내용:</span>
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap p-3 bg-white rounded border">
                        {inquiry.content}
                      </p>
                    </div>
                    {inquiry.tags.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">태그:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {inquiry.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 처리 내역 */}
                {(inquiry.assignedTo || inquiry.answer) && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-900 mb-3">처리 내역</h4>
                    <div className="space-y-3 text-sm">
                      {inquiry.assignedTo && (
                        <div>
                          <span className="text-green-700">담당자:</span>
                          <span className="font-medium ml-2">{inquiry.assignedTo}</span>
                        </div>
                      )}
                      {inquiry.answer && (
                        <>
                          <div>
                            <span className="text-green-700">답변 내용:</span>
                            <p className="text-green-800 mt-1 p-3 bg-white rounded border whitespace-pre-wrap">
                              {inquiry.answer}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-green-700">답변자:</span>
                              <span className="font-medium ml-2">{inquiry.answeredBy}</span>
                            </div>
                            <div>
                              <span className="text-green-700">답변일:</span>
                              <span className="font-medium ml-2">
                                {inquiry.answeredAt && new Date(inquiry.answeredAt).toLocaleString('ko-KR')}
                              </span>
                            </div>
                          </div>
                          {inquiry.responseTime && (
                            <div>
                              <span className="text-green-700">응답 시간:</span>
                              <span className="font-medium ml-2">{inquiry.responseTime}시간</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* 접수 정보 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">접수 정보</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">접수일:</span>
                      <span className="font-medium ml-2">
                        {new Date(inquiry.createdAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">최근 수정:</span>
                      <span className="font-medium ml-2">
                        {new Date(inquiry.updatedAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attachments' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">첨부파일</h4>
                
                {inquiry.attachments.length > 0 ? (
                  <div className="space-y-3">
                    {inquiry.attachments.map((attachment, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">
                              {attachment.type === 'image' ? '이미지' : '파일'}
                            </span>
                            <div>
                              <div className="font-medium text-gray-900">{attachment.name}</div>
                              <div className="text-sm text-gray-500">
                                {attachment.type === 'image' ? '이미지 파일' : '문서 파일'}
                              </div>
                            </div>
                          </div>
                          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                            다운로드
                          </button>
                        </div>
                        {attachment.type === 'image' && (
                          <div className="mt-3">
                            <img 
                              src={attachment.url} 
                              alt={attachment.name}
                              className="max-w-full h-auto rounded border"
                              style={{ maxHeight: '300px' }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <p className="text-gray-500">첨부된 파일이 없습니다.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="space-y-6">
                <h4 className="text-base font-medium text-gray-900">문의 처리</h4>
                
                {/* 우선순위 변경 */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-yellow-900 mb-3">우선순위 조정</h5>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">낮음</option>
                    <option value="medium">보통</option>
                    <option value="high">높음</option>
                    <option value="urgent">긴급</option>
                  </select>
                </div>

                {/* 처리 액션 */}
                {(inquiry.status === 'pending' || inquiry.status === 'assigned') && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-4">처리 작업</h5>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">처리 유형</label>
                        <div className="space-y-2">
                          {inquiry.status === 'pending' && (
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="action"
                                value="assign"
                                checked={actionType === 'assign'}
                                onChange={(e) => setActionType(e.target.value as 'assign')}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-900">담당자 배정</span>
                            </label>
                          )}
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="action"
                              value="answer"
                              checked={actionType === 'answer'}
                              onChange={(e) => setActionType(e.target.value as 'answer')}
                              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm text-gray-900">답변 작성</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="action"
                              value="close"
                              checked={actionType === 'close'}
                              onChange={(e) => setActionType(e.target.value as 'close')}
                              className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                            />
                            <span className="ml-2 text-sm text-gray-900">문의 종료</span>
                          </label>
                        </div>
                      </div>

                      {actionType === 'assign' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">담당자</label>
                          <select
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">담당자 선택</option>
                            <option value="고객지원팀A">고객지원팀A</option>
                            <option value="고객지원팀B">고객지원팀B</option>
                            <option value="기술팀A">기술팀A</option>
                            <option value="기술팀B">기술팀B</option>
                          </select>
                        </div>
                      )}

                      {actionType === 'answer' && (
                        <>
                          {/* 답변 템플릿 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">답변 템플릿</label>
                            <div className="space-y-2">
                              {templates
                                .filter(t => t.category === inquiry.category)
                                .map((template, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => setAnswer(template.content)}
                                  className="block w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                                >
                                  {template.title}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">답변 내용</label>
                            <textarea
                              value={answer}
                              onChange={(e) => setAnswer(e.target.value)}
                              rows={8}
                              placeholder="고객에게 보낼 답변을 작성해주세요"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </>
                      )}

                      <button
                        onClick={handleAction}
                        disabled={!actionType || 
                          (actionType === 'assign' && !assignee) ||
                          (actionType === 'answer' && !answer.trim())
                        }
                        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionType === 'assign' ? '담당자 배정' :
                         actionType === 'answer' ? '답변 전송' :
                         actionType === 'close' ? '문의 종료' : '작업 실행'}
                      </button>
                    </div>
                  </div>
                )}

                {/* 완료된 문의 */}
                {(inquiry.status === 'answered' || inquiry.status === 'closed') && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-green-900 mb-2">처리 완료</h5>
                    <p className="text-sm text-green-700">
                      이 문의는 이미 처리가 완료되었습니다.
                      {inquiry.status === 'answered' && ' 추가 조치가 필요한 경우 문의를 다시 열 수 있습니다.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
            <div className="text-sm text-gray-500">
              마지막 업데이트: {new Date(inquiry.updatedAt).toLocaleString('ko-KR')}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
