'use client';

import { useState } from 'react';

interface ProfileSubmission {
  id: string;
  teacherId: string;
  teacherName: string;
  email: string;
  phone: string;
  submitDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'hold';
  specialties: string[];
  experience: number;
  education: string;
  certifications: string[];
  documents: {
    diploma: string;
    certificate: string;
    career: string;
    license: string;
  };
  profilePhoto: string;
  selfIntroduction: string;
  teachingPhilosophy: string;
  priority: 'high' | 'medium' | 'low';
}

interface ProfileDetailReviewProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileSubmission;
  onAction: (profileId: string, action: 'approve' | 'reject' | 'hold', reason?: string) => void;
}

export default function ProfileDetailReview({ isOpen, onClose, profile, onAction }: ProfileDetailReviewProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'hold' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [checklist, setChecklist] = useState({
    profilePhoto: false,
    education: false,
    certifications: false,
    experience: false,
    introduction: false,
    philosophy: false
  });

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: '프로필 정보' },
    { id: 'documents', label: '제출 서류' },
    { id: 'checklist', label: '검증 체크리스트' },
    { id: 'action', label: '승인/반려' }
  ];

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };

  const handleAction = () => {
    if (actionType) {
      onAction(profile.id, actionType, actionReason);
    }
  };

  const allChecked = Object.values(checklist).every(Boolean);

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
              <h3 className="text-lg font-medium text-gray-900">프로필 상세 검토</h3>
              <p className="text-sm text-gray-600">{profile.teacherName}님의 프로필</p>
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
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">기본 정보</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">이름</label>
                      <p className="mt-1 text-sm text-gray-900">{profile.teacherName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">이메일</label>
                      <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">연락처</label>
                      <p className="mt-1 text-sm text-gray-900">{profile.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">경력</label>
                      <p className="mt-1 text-sm text-gray-900">{profile.experience}년</p>
                    </div>
                  </div>
                </div>

                {/* 전문 정보 */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">전문 정보</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">학력</label>
                      <p className="mt-1 text-sm text-gray-900">{profile.education}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">전문 분야</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {profile.specialties.map((specialty, index) => (
                          <span key={index} className="px-2 py-1 text-sm bg-purple-100 text-purple-800 rounded">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">자격증</label>
                      <div className="mt-1 space-y-1">
                        {profile.certifications.map((cert, index) => (
                          <p key={index} className="text-sm text-gray-900">• {cert}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 소개 */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">자기소개 및 치료 철학</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">자기소개</label>
                      <p className="mt-1 text-sm text-gray-900 p-3 bg-gray-50 rounded">{profile.selfIntroduction}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">치료 철학</label>
                      <p className="mt-1 text-sm text-gray-900 p-3 bg-gray-50 rounded">{profile.teachingPhilosophy}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">제출 서류</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">학력 증명서</h5>
                    <p className="text-sm text-gray-600 mb-2">{profile.documents.diploma}</p>
                    <button className="text-sm text-blue-600 hover:text-blue-800">파일 보기</button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">자격증 사본</h5>
                    <p className="text-sm text-gray-600 mb-2">{profile.documents.certificate}</p>
                    <button className="text-sm text-blue-600 hover:text-blue-800">파일 보기</button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">경력 증명서</h5>
                    <p className="text-sm text-gray-600 mb-2">{profile.documents.career}</p>
                    <button className="text-sm text-blue-600 hover:text-blue-800">파일 보기</button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">면허증</h5>
                    <p className="text-sm text-gray-600 mb-2">{profile.documents.license}</p>
                    <button className="text-sm text-blue-600 hover:text-blue-800">파일 보기</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'checklist' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">검증 체크리스트</h4>
                <div className="space-y-3">
                  {Object.entries(checklist).map(([key, checked]) => {
                    const labels: Record<string, string> = {
                      profilePhoto: '프로필 사진 적절성',
                      education: '학력 증명서 진위',
                      certifications: '자격증 유효성',
                      experience: '경력 정보 확인',
                      introduction: '자기소개 내용 검토',
                      philosophy: '치료 철학 적절성'
                    };
                    
                    return (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => handleChecklistChange(key, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">{labels[key]}</span>
                      </label>
                    );
                  })}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <svg className={`w-5 h-5 ${allChecked ? 'text-green-500' : 'text-yellow-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {allChecked ? '모든 항목 검증 완료' : `${Object.values(checklist).filter(Boolean).length}/${Object.keys(checklist).length} 항목 완료`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'action' && (
              <div className="space-y-6">
                <h4 className="text-base font-medium text-gray-900">승인/반려 처리</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">처리 유형</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="approve"
                        checked={actionType === 'approve'}
                        onChange={(e) => setActionType(e.target.value as 'approve')}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-900">승인</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="reject"
                        checked={actionType === 'reject'}
                        onChange={(e) => setActionType(e.target.value as 'reject')}
                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-900">반려</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="hold"
                        checked={actionType === 'hold'}
                        onChange={(e) => setActionType(e.target.value as 'hold')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-900">보류</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사유 (반려/보류 시 필수)
                  </label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="처리 사유를 입력하세요"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-yellow-800">주의사항</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        처리 후에는 해당 치료사에게 자동으로 알림이 전송됩니다. 신중하게 검토 후 처리해주세요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              닫기
            </button>
            
            {activeTab === 'action' && (
              <button
                onClick={handleAction}
                disabled={!actionType || (actionType !== 'approve' && !actionReason.trim())}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                처리 완료
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
