'use client';

import { useState } from 'react';
import { Report } from '@/lib/reports';
import { Timestamp } from 'firebase/firestore';

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report;
  onReportAction: (
    reportId: string, 
    action: 'assign' | 'investigate' | 'complete' | 'dismiss',
    data: {
      assignee?: string;
      resolution?: {
        action: string;
        reason: string;
        penalty?: 'warning' | 'temporary_ban' | 'permanent_ban';
        reward?: 'subscription_1month';
      };
    }
  ) => void;
}

export default function ReportDetailModal({ isOpen, onClose, report, onReportAction }: ReportDetailModalProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [actionType, setActionType] = useState<'assign' | 'investigate' | 'complete' | 'dismiss' | null>(null);
  const [assignee, setAssignee] = useState('');
  const [resolutionAction, setResolutionAction] = useState('');
  const [resolutionReason, setResolutionReason] = useState('');
  const [penalty, setPenalty] = useState<'warning' | 'temporary_ban' | 'permanent_ban' | ''>('');
  const [giveReward, setGiveReward] = useState(false);

  if (!isOpen) return null;

  const tabs = [
    { id: 'details', label: '신고 상세' },
    { id: 'evidence', label: '증거 자료' },
    { id: 'investigation', label: '조사 & 처리' }
  ];

  const handleAction = () => {
    if (!actionType) return;

    interface ActionData {
      assignee?: string;
      resolution?: {
        action: string;
        reason: string;
        penalty?: 'warning' | 'temporary_ban' | 'permanent_ban';
        reward?: 'subscription_1month';
      };
    }
    
    const data: ActionData = {};
    
    if (actionType === 'assign') {
      data.assignee = assignee;
    } else if (actionType === 'complete') {
      data.resolution = {
        action: resolutionAction,
        reason: resolutionReason,
        ...(penalty && { penalty }),
        ...(giveReward && { reward: 'subscription_1month' })
      };
    } else if (actionType === 'dismiss') {
      data.resolution = {
        action: 'dismissed',
        reason: resolutionReason
      };
    }

    onReportAction(report.id, actionType, data);
  };

  const getTypeDescription = (type: Report['type']) => {
    switch (type) {
      case 'direct_trade':
        return '플랫폼 외부에서의 직접 거래 유도 행위';
      case 'inappropriate_behavior':
        return '욕설, 협박, 성희롱 등 부적절한 언행';
      case 'false_profile':
        return '허위 자격증, 경력 등 거짓 정보 제공';
      case 'service_complaint':
        return '서비스 품질, 시스템 오류 등에 대한 불만';
      case 'other':
        return '기타 서비스 이용 관련 신고';
      default:
        return '알 수 없는 신고 유형';
    }
  };

  // Firestore Timestamp를 Date로 변환하는 헬퍼 함수
  const convertTimestamp = (timestamp: Timestamp | Date | { seconds: number } | string | null | undefined) => {
    if (!timestamp) return new Date();
    if (timestamp instanceof Date) return timestamp;
    if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate(); // Firestore Timestamp
    }
    if (typeof timestamp === 'object' && timestamp !== null && 'seconds' in timestamp) {
      return new Date(timestamp.seconds * 1000); // Timestamp object
    }
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      return new Date(timestamp); // 문자열이나 숫자인 경우
    }
    return new Date();
  };


  const isUrgent = report.priority === 'urgent' || 
                  (report.type === 'direct_trade' && report.status === 'pending');

  return (
    <>
      {/* 모달 */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-white rounded-lg p-8 max-w-6xl w-[95vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">신고 상세 처리</h2>
              <p className="text-sm text-gray-500 mt-1">
                신고 ID: {report.id}
                {isUrgent && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    긴급 처리
                  </span>
                )}
                {report.type === 'direct_trade' && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    🚫 직거래 신고
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              type="button"
            >
              ✕
            </button>
          </div>

          {/* 기본 정보 요약 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 block">신고 유형</span>
                <span className="font-medium text-gray-900">{getTypeDescription(report.type)}</span>
              </div>
              <div>
                <span className="text-gray-600 block">우선순위</span>
                <span className={`font-medium ${
                  report.priority === 'urgent' ? 'text-red-600' :
                  report.priority === 'high' ? 'text-orange-600' :
                  report.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {report.priority === 'urgent' ? '긴급' :
                   report.priority === 'high' ? '높음' :
                   report.priority === 'medium' ? '보통' : '낮음'}
                </span>
              </div>
              <div>
                <span className="text-gray-600 block">현재 상태</span>
                <span className="font-medium text-gray-900">
                  {report.status === 'pending' ? '접수 대기' :
                   report.status === 'investigating' ? '조사 중' :
                   report.status === 'completed' ? '처리완료' : 
                   report.status === 'dismissed' ? '기각' : '처리됨'}
                </span>
              </div>
              <div>
                <span className="text-gray-600 block">접수일</span>
                <span className="font-medium text-gray-900">
                  {convertTimestamp(report.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
            
            {/* 긴급 알림 */}
            {isUrgent && report.status === 'pending' && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium text-red-800">
                    {report.type === 'direct_trade' ? '직거래 신고 - 24시간 내 처리 필요' : '긴급 처리 필요'}
                  </span>
                </div>
              </div>
            )}
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
          <div className="mt-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* 신고자 정보 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-3">신고자 정보</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">이름:</span>
                      <span className="font-medium ml-2">{report.reporterName}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">ID:</span>
                      <span className="font-medium ml-2">{report.reporterId}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">유형:</span>
                      <span className="font-medium ml-2">
                        {report.reporterType === 'parent' ? '학부모' : '치료사'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 피신고자 정보 */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-900 mb-3">피신고자 정보</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-red-700">신고 대상:</span>
                      <span className="font-medium ml-2">{report.reportedName}</span>
                    </div>
                    <div>
                      <span className="text-red-700">신고 유형:</span>
                      <span className="font-medium ml-2">
                        {report.type === 'direct_trade' ? '직거래 신고' :
                         report.type === 'inappropriate_behavior' ? '부적절한 행동' :
                         report.type === 'false_profile' ? '허위 프로필' :
                         report.type === 'service_complaint' ? '서비스 불만' : '기타'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 신고 내용 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">신고 내용</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">제목:</span>
                      <h5 className="font-medium text-gray-900 mt-1">{report.title}</h5>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">상세 내용:</span>
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{report.description}</p>
                    </div>
                  </div>
                </div>

                {/* 관련 정보 */}
                {(report.relatedChatId || report.relatedMatchingId) && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-yellow-900 mb-3">관련 정보</h4>
                    <div className="space-y-2 text-sm">
                      {report.relatedChatId && (
                        <div>
                          <span className="text-yellow-700">관련 채팅방:</span>
                          <span className="font-medium ml-2">{report.relatedChatId}</span>
                          <button className="ml-2 text-blue-600 hover:text-blue-800 underline">
                            채팅 내역 보기
                          </button>
                        </div>
                      )}
                      {report.relatedMatchingId && (
                        <div>
                          <span className="text-yellow-700">관련 매칭:</span>
                          <span className="font-medium ml-2">{report.relatedMatchingId}</span>
                          <button className="ml-2 text-blue-600 hover:text-blue-800 underline">
                            매칭 정보 보기
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 신고 일시 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">신고 일시</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">접수일:</span>
                      <span className="font-medium ml-2">
                        {convertTimestamp(report.createdAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">수정일:</span>
                      <span className="font-medium ml-2">
                        {convertTimestamp(report.updatedAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'evidence' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">제출된 증거 자료</h4>
                
                <div className="space-y-4">
                  {report.evidence && report.evidence.length > 0 ? report.evidence.map((evidence, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">📎</span>
                            <span className="font-medium text-gray-900">
                              {evidence.filename || `첨부파일 ${index + 1}`}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {evidence.type || '파일'}
                            </span>
                          </div>
                          {evidence.url && (
                            <a 
                              href={evidence.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm inline-block"
                            >
                              파일 다운로드
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )) : null}
                </div>

                {(!report.evidence || report.evidence.length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">제출된 증거 자료가 없습니다.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'investigation' && (
              <div className="space-y-6">
                <h4 className="text-base font-medium text-gray-900">조사 및 처리</h4>
                
                {/* 현재 상태 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-900 mb-3">현재 상태</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">처리 상태:</span>
                      <span className="font-medium ml-2">
                        {report.status === 'pending' ? '접수 대기' :
                         report.status === 'investigating' ? '조사 진행 중' :
                         report.status === 'completed' ? '처리 완료' : 
                         report.status === 'dismissed' ? '기각됨' : '처리됨'}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">담당자:</span>
                      <span className="font-medium ml-2">
                        {report.assignedTo || '미배정'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 처리 완료된 경우 */}
                {report.resolution && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-green-900 mb-3">처리 결과</h5>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-green-700">처리 내용:</span>
                        <span className="font-medium ml-2">{report.resolution.action}</span>
                      </div>
                      <div>
                        <span className="text-green-700">처리 사유:</span>
                        <p className="text-green-800 mt-1">{report.resolution.reason}</p>
                      </div>
                      {report.resolution.penalty && (
                        <div>
                          <span className="text-green-700">처벌 조치:</span>
                          <span className="font-medium ml-2 text-red-600">
                            {report.resolution.penalty === 'warning' ? '경고' :
                             report.resolution.penalty === 'temporary_ban' ? '일시 정지' : '영구 정지'}
                          </span>
                        </div>
                      )}
                      {report.resolution.reward && (
                        <div>
                          <span className="text-green-700">신고자 포상:</span>
                          <span className="font-medium ml-2 text-blue-600">이용권 1개월 지급</span>
                        </div>
                      )}
                      <div>
                        <span className="text-green-700">처리자:</span>
                        <span className="font-medium ml-2">{report.resolution.processedBy}</span>
                      </div>
                      <div>
                        <span className="text-green-700">처리일:</span>
                        <span className="font-medium ml-2">
                          {convertTimestamp(report.resolution.processedAt).toLocaleString('ko-KR')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 처리 대기/진행 중인 경우 */}
                {(report.status === 'pending' || report.status === 'investigating') && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-4">처리 작업</h5>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">처리 유형</label>
                        <div className="space-y-2">
                          {report.status === 'pending' && (
                            <>
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
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="action"
                                  value="investigate"
                                  checked={actionType === 'investigate'}
                                  onChange={(e) => setActionType(e.target.value as 'investigate')}
                                  className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                                />
                                <span className="ml-2 text-sm text-gray-900">조사 시작</span>
                              </label>
                            </>
                          )}
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="action"
                              value="complete"
                              checked={actionType === 'complete'}
                              onChange={(e) => setActionType(e.target.value as 'complete')}
                              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm text-gray-900">처리 완료</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="action"
                              value="dismiss"
                              checked={actionType === 'dismiss'}
                              onChange={(e) => setActionType(e.target.value as 'dismiss')}
                              className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm text-gray-900">신고 기각</span>
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
                            <option value="관리자A">관리자A</option>
                            <option value="관리자B">관리자B</option>
                            <option value="관리자C">관리자C</option>
                          </select>
                        </div>
                      )}

                      {(actionType === 'complete' || actionType === 'dismiss') && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">처리 내용</label>
                            <input
                              type="text"
                              value={resolutionAction}
                              onChange={(e) => setResolutionAction(e.target.value)}
                              placeholder="예: 직거래 유도 확인, 계정 정지 처리"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">처리 사유</label>
                            <textarea
                              value={resolutionReason}
                              onChange={(e) => setResolutionReason(e.target.value)}
                              rows={3}
                              placeholder="상세한 처리 사유를 작성해주세요"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          {actionType === 'complete' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">처벌 조치</label>
                                <select
                                  value={penalty}
                                  onChange={(e) => setPenalty(e.target.value as 'warning' | 'temporary_ban' | 'permanent_ban' | '')}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">처벌 없음</option>
                                  <option value="warning">경고</option>
                                  <option value="temporary_ban">일시 정지</option>
                                  <option value="permanent_ban">영구 정지</option>
                                </select>
                              </div>

                              {report.type === 'direct_trade' && (
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={giveReward}
                                    onChange={(e) => setGiveReward(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <label className="ml-2 text-sm text-gray-900">
                                    신고자에게 포상금 지급 (이용권 1개월)
                                  </label>
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}

                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
                        >
                          취소
                        </button>
                        <button
                          onClick={handleAction}
                          disabled={!actionType || 
                            (actionType === 'assign' && !assignee) ||
                            ((actionType === 'complete' || actionType === 'dismiss') && !resolutionReason.trim())
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionType === 'assign' ? '담당자 배정' :
                           actionType === 'investigate' ? '조사 시작' :
                           actionType === 'complete' ? '처리 완료' :
                           actionType === 'dismiss' ? '신고 기각' : '작업 실행'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
            <div className="text-sm text-gray-500">
              마지막 업데이트: {convertTimestamp(report.updatedAt).toLocaleString('ko-KR')}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
