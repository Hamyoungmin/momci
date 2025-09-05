'use client';

import { useState } from 'react';

interface ChatRoom {
  id: string;
  matchingId: string;
  parentId: string;
  parentName: string;
  teacherId: string;
  teacherName: string;
  startDate: string;
  lastMessageDate: string;
  messageCount: number;
  status: 'active' | 'ended' | 'suspended';
  suspiciousActivity: boolean;
  directTradeDetected: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  lastMessage?: {
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
  };
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'parent' | 'teacher';
  content: string;
  timestamp: string;
  flagged: boolean;
  flagReason?: string;
}

interface ChatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatRoom: ChatRoom;
  onChatAction: (chatRoomId: string, action: 'suspend' | 'resume' | 'end', reason?: string) => void;
}

export default function ChatDetailModal({ isOpen, onClose, chatRoom, onChatAction }: ChatDetailModalProps) {
  const [activeTab, setActiveTab] = useState('messages');
  const [actionType, setActionType] = useState<'suspend' | 'resume' | 'end' | null>(null);
  const [actionReason, setActionReason] = useState('');

  // 실제 데이터 (Firebase에서 가져올 예정)
  const [messages] = useState<ChatMessage[]>([]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'messages', label: '채팅 메시지' },
    { id: 'analysis', label: '위험 분석' },
    { id: 'actions', label: '관리 작업' }
  ];

  const handleAction = () => {
    if (actionType && actionReason.trim()) {
      onChatAction(chatRoom.id, actionType, actionReason);
    }
  };

  const getMessageStyle = (message: ChatMessage) => {
    if (message.flagged) {
      return 'bg-red-50 border-l-4 border-red-400';
    }
    return message.senderType === 'parent' ? 'bg-blue-50' : 'bg-green-50';
  };

  const maskSensitiveInfo = (content: string) => {
    return content
      .replace(/\d{3}-\d{4}-\d{4}/g, '010-****-****')
      .replace(/\d{3}-\d{3}-\d{6}/g, '***-***-******')
      .replace(/\d{6}-\d{2}-\d{6}/g, '******-**-******');
  };

  const detectedKeywords = [
    { keyword: '직접 거래', count: 1, risk: 'high' },
    { keyword: '계좌번호', count: 1, risk: 'high' },
    { keyword: '전화번호', count: 1, risk: 'medium' },
    { keyword: '수수료 없이', count: 1, risk: 'medium' }
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
              <h3 className="text-lg font-medium text-gray-900">채팅방 상세 정보</h3>
              <p className="text-sm text-gray-600">
                {chatRoom.parentName} ↔ {chatRoom.teacherName} (ID: {chatRoom.id})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {chatRoom.directTradeDetected && (
                <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                  직거래 감지
                </span>
              )}
              {chatRoom.suspiciousActivity && (
                <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  의심 활동
                </span>
              )}
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
                <span className="text-gray-600">매칭 ID:</span>
                <span className="font-medium ml-2">{chatRoom.matchingId}</span>
              </div>
              <div>
                <span className="text-gray-600">시작일:</span>
                <span className="font-medium ml-2">{new Date(chatRoom.startDate).toLocaleDateString('ko-KR')}</span>
              </div>
              <div>
                <span className="text-gray-600">메시지 수:</span>
                <span className="font-medium ml-2">{chatRoom.messageCount}개</span>
              </div>
              <div>
                <span className="text-gray-600">위험도:</span>
                <span className={`font-medium ml-2 ${
                  chatRoom.riskLevel === 'high' ? 'text-red-600' :
                  chatRoom.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {chatRoom.riskLevel === 'high' ? '고위험' :
                   chatRoom.riskLevel === 'medium' ? '중위험' : '저위험'}
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
            {activeTab === 'messages' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-medium text-gray-900">채팅 메시지</h4>
                  <span className="text-sm text-gray-500">총 {messages.length}개 메시지</span>
                </div>
                
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${getMessageStyle(message)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {message.senderName}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              message.senderType === 'parent' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {message.senderType === 'parent' ? '학부모' : '치료사'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleString('ko-KR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {message.flagged ? maskSensitiveInfo(message.content) : message.content}
                          </p>
                          {message.flagged && (
                            <div className="mt-2 p-2 bg-red-100 rounded border-l-2 border-red-400">
                              <span className="text-xs text-red-700 font-medium">
                                위험 감지: {message.flagReason}
                              </span>
                            </div>
                          )}
                        </div>
                        {message.flagged && (
                          <div className="ml-4">
                            <span className="text-red-500">위험</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <h4 className="text-base font-medium text-gray-900">위험 분석 결과</h4>
                
                {/* 감지된 키워드 */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-red-900 mb-3">감지된 위험 키워드</h5>
                  <div className="space-y-2">
                    {detectedKeywords.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-red-700">&ldquo;{item.keyword}&rdquo;</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-red-600">{item.count}회</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.risk === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.risk === 'high' ? '고위험' : '중위험'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI 분석 결과 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-900 mb-3">AI 분석 요약</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 직거래 유도 시도 감지: 치료사가 플랫폼 외 거래 제안</li>
                    <li>• 개인정보 공유: 계좌번호 및 전화번호 교환</li>
                    <li>• 위험도 평가: 높음 (즉시 조치 필요)</li>
                    <li>• 권장 조치: 채팅방 정지 및 경고 발송</li>
                  </ul>
                </div>

                {/* 유사 사례 */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-yellow-900 mb-3">유사 사례 참고</h5>
                  <p className="text-sm text-yellow-700">
                    지난 30일간 유사한 패턴의 직거래 시도가 12건 감지되었습니다. 
                    모든 사례에서 즉시 정지 조치를 취했으며, 재발 방지를 위한 사용자 교육을 실시했습니다.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="space-y-6">
                <h4 className="text-base font-medium text-gray-900">관리 작업</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">조치 유형</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="action"
                          value="suspend"
                          checked={actionType === 'suspend'}
                          onChange={(e) => setActionType(e.target.value as 'suspend')}
                          className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">채팅방 정지</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="action"
                          value="end"
                          checked={actionType === 'end'}
                          onChange={(e) => setActionType(e.target.value as 'end')}
                          className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">채팅방 종료</span>
                      </label>
                      {chatRoom.status === 'suspended' && (
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="action"
                            value="resume"
                            checked={actionType === 'resume'}
                            onChange={(e) => setActionType(e.target.value as 'resume')}
                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                          />
                          <span className="ml-2 text-sm text-gray-900">정지 해제</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      조치 사유 (필수)
                    </label>
                    <textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      rows={4}
                      placeholder="조치 사유를 상세히 작성해주세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-yellow-900 mb-2">주의사항</h5>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 조치 후 양측 사용자에게 자동으로 알림이 발송됩니다</li>
                      <li>• 정지된 채팅방은 더 이상 메시지를 주고받을 수 없습니다</li>
                      <li>• 모든 조치는 기록되며 추후 검토 시 참고됩니다</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleAction}
                    disabled={!actionType || !actionReason.trim()}
                    className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    조치 실행
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
            <div className="text-sm text-gray-500">
              마지막 업데이트: {new Date().toLocaleString('ko-KR')}
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
