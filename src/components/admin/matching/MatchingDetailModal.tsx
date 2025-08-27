'use client';

import { useState } from 'react';

interface Matching {
  id: string;
  requestId: string;
  parentId: string;
  parentName: string;
  teacherId: string;
  teacherName: string;
  childAge: string;
  treatmentType: string[];
  region: string;
  schedule: string;
  hourlyRate: number;
  chatStartDate: string;
  status: 'interview' | 'lesson_confirmed' | 'payment_pending' | 'payment_completed' | 'cancelled';
  lastActivity: string;
  notes?: string;
}

interface MatchingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  matching: Matching;
  onStatusChange: (matchingId: string, newStatus: Matching['status'], reason?: string) => void;
}

export default function MatchingDetailModal({ isOpen, onClose, matching, onStatusChange }: MatchingDetailModalProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [newStatus, setNewStatus] = useState<Matching['status']>(matching.status);
  const [statusChangeReason, setStatusChangeReason] = useState('');

  if (!isOpen) return null;

  const tabs = [
    { id: 'details', label: '매칭 상세' },
    { id: 'chat', label: '채팅 내역' },
    { id: 'payment', label: '결제 정보' },
    { id: 'management', label: '상태 관리' }
  ];

  const getStatusText = (status: Matching['status']) => {
    switch (status) {
      case 'interview': return '인터뷰 중';
      case 'lesson_confirmed': return '수업 확정';
      case 'payment_pending': return '결제 대기';
      case 'payment_completed': return '매칭 완료';
      case 'cancelled': return '취소';
      default: return '알 수 없음';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const handleStatusSubmit = () => {
    onStatusChange(matching.id, newStatus, statusChangeReason);
  };

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
              <h3 className="text-lg font-medium text-gray-900">매칭 상세 정보</h3>
              <p className="text-sm text-gray-600">매칭 ID: {matching.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 탭 네비게이션 */}
          <div className="mt-4">
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
                {/* 기본 정보 */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">기본 정보</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">요청 ID</label>
                      <p className="mt-1 text-sm text-gray-900">{matching.requestId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">현재 상태</label>
                      <p className="mt-1 text-sm text-gray-900">{getStatusText(matching.status)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">채팅 시작일</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(matching.chatStartDate).toLocaleString('ko-KR')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">최근 활동</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(matching.lastActivity).toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 학부모 정보 */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">학부모 정보</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">이름</label>
                      <p className="mt-1 text-sm text-gray-900">{matching.parentName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">회원 ID</label>
                      <p className="mt-1 text-sm text-gray-900">{matching.parentId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">아이 나이</label>
                      <p className="mt-1 text-sm text-gray-900">{matching.childAge}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">지역</label>
                      <p className="mt-1 text-sm text-gray-900">{matching.region}</p>
                    </div>
                  </div>
                </div>

                {/* 치료사 정보 */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">치료사 정보</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">이름</label>
                      <p className="mt-1 text-sm text-gray-900">{matching.teacherName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">회원 ID</label>
                      <p className="mt-1 text-sm text-gray-900">{matching.teacherId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">시간당 요금</label>
                      <p className="mt-1 text-sm text-gray-900">{formatCurrency(matching.hourlyRate)}</p>
                    </div>
                  </div>
                </div>

                {/* 수업 정보 */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">수업 정보</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">치료 종목</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {matching.treatmentType.map((type, index) => (
                          <span key={index} className="px-2 py-1 text-sm bg-purple-100 text-purple-800 rounded">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">수업 일정</label>
                      <p className="mt-1 text-sm text-gray-900">{matching.schedule}</p>
                    </div>
                    {matching.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">메모</label>
                        <p className="mt-1 text-sm text-gray-900 p-3 bg-gray-50 rounded">{matching.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">채팅 내역</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">최근 채팅 메시지</p>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-gray-900">{matching.parentName}</span>
                        <span className="text-xs text-gray-500">2024-01-20 15:30</span>
                      </div>
                      <p className="text-sm text-gray-700">안녕하세요. 수업 일정 조정이 가능한지 문의드립니다.</p>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-gray-900">{matching.teacherName}</span>
                        <span className="text-xs text-gray-500">2024-01-20 15:25</span>
                      </div>
                      <p className="text-sm text-gray-700">네, 가능합니다. 어떤 시간대를 원하시나요?</p>
                    </div>
                  </div>
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
                    전체 채팅 보기
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">결제 정보</h4>
                {matching.status === 'payment_completed' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-green-800">결제 완료</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-green-700">첫 수업료: {formatCurrency(matching.hourlyRate)}</p>
                      <p className="text-sm text-green-700">결제일: 2024-01-20 16:30</p>
                      <p className="text-sm text-green-700">결제 방식: 가상계좌</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-yellow-800">결제 대기 중</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-2">
                      첫 수업료 {formatCurrency(matching.hourlyRate)} 결제 진행 중입니다.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'management' && (
              <div className="space-y-6">
                <h4 className="text-base font-medium text-gray-900">상태 관리</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    매칭 상태 변경
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Matching['status'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="interview">인터뷰 중</option>
                    <option value="lesson_confirmed">수업 확정</option>
                    <option value="payment_pending">결제 대기</option>
                    <option value="payment_completed">매칭 완료</option>
                    <option value="cancelled">취소</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    변경 사유
                  </label>
                  <textarea
                    value={statusChangeReason}
                    onChange={(e) => setStatusChangeReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="상태 변경 사유를 입력하세요"
                  />
                </div>

                {matching.status === 'lesson_confirmed' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-blue-800 mb-2">입금 확인 및 매칭 완료</h5>
                    <p className="text-sm text-blue-700 mb-3">
                      첫 수업료 입금이 확인되면 아래 버튼을 클릭하여 매칭을 완료하세요.
                    </p>
                    <button
                      onClick={() => {
                        setNewStatus('payment_completed');
                        setStatusChangeReason('입금 확인 및 연락처 공개 완료');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                    >
                      입금 확인 및 매칭 완료
                    </button>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleStatusSubmit}
                    disabled={newStatus === matching.status && !statusChangeReason.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    상태 변경 적용
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
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
