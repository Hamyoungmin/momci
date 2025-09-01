'use client';

import { useState } from 'react';

interface RequestPost {
  id: string;
  parentId: string;
  parentName: string;
  title: string;
  content: string;
  childInfo: {
    age: string;
    gender: 'male' | 'female';
    condition: string;
  };
  treatmentTypes: string[];
  location: string;
  schedule: string;
  budget: string;
  status: 'recruiting' | 'matched' | 'closed';
  applicants: number;
  createdAt: string;
  updatedAt: string;
  views: number;
  premium: boolean;
  urgent: boolean;
}

interface TeacherApplicant {
  id: string;
  name: string;
  profile: {
    experience: string;
    specialties: string[];
    rating: number;
    reviews: number;
  };
  appliedAt: string;
  status: 'pending' | 'selected' | 'rejected';
}

interface RequestPostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: RequestPost;
  onPostAction: (postId: string, action: 'hide' | 'show' | 'delete' | 'close', reason?: string) => void;
}

export default function RequestPostDetailModal({ isOpen, onClose, post, onPostAction }: RequestPostDetailModalProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [actionType, setActionType] = useState<'hide' | 'show' | 'delete' | 'close' | null>(null);
  const [actionReason, setActionReason] = useState('');

  // 실제 데이터 (Firebase에서 가져올 예정)
  const [applicants] = useState<TeacherApplicant[]>([]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'details', label: '게시글 상세' },
    { id: 'applicants', label: `지원자 (${applicants.length})` },
    { id: 'actions', label: '관리 작업' }
  ];

  const handleAction = () => {
    if (actionType && actionReason.trim()) {
      onPostAction(post.id, actionType, actionReason);
    }
  };

  const getApplicantStatusBadge = (status: TeacherApplicant['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">대기</span>;
      case 'selected':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">선택</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">거절</span>;
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
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* 헤더 */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">요청글 상세 관리</h3>
              <p className="text-sm text-gray-600">ID: {post.id}</p>
            </div>
            <div className="flex items-center space-x-4">
              {post.urgent && (
                <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                  급구
                </span>
              )}
              {post.premium && (
                <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
                  프리미엄
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">작성자:</span>
                <span className="font-medium ml-2">{post.parentName} ({post.parentId})</span>
              </div>
              <div>
                <span className="text-gray-600">상태:</span>
                <span className="font-medium ml-2">
                  {post.status === 'recruiting' ? '모집 중' :
                   post.status === 'matched' ? '매칭 완료' : '마감'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">조회수:</span>
                <span className="font-medium ml-2">{post.views}회</span>
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
                {/* 게시글 제목 및 내용 */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-3">{post.title}</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{post.content}</p>
                  </div>
                </div>

                {/* 아이 정보 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-900 mb-3">아이 정보</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">나이:</span>
                      <span className="font-medium ml-2">{post.childInfo.age}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">성별:</span>
                      <span className="font-medium ml-2">
                        {post.childInfo.gender === 'male' ? '남아' : '여아'}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">상태:</span>
                      <span className="font-medium ml-2">{post.childInfo.condition}</span>
                    </div>
                  </div>
                </div>

                {/* 치료 정보 */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-green-900 mb-3">치료 요청 정보</h5>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-green-700">치료 종목:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {post.treatmentTypes.map((type, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-green-700">지역:</span>
                        <span className="font-medium ml-2">{post.location}</span>
                      </div>
                      <div>
                        <span className="text-sm text-green-700">예산:</span>
                        <span className="font-medium ml-2">{post.budget}</span>
                      </div>
                      <div>
                        <span className="text-sm text-green-700">스케줄:</span>
                        <span className="font-medium ml-2">{post.schedule}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 게시 정보 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">게시 정보</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">작성일:</span>
                      <span className="font-medium ml-2">
                        {new Date(post.createdAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">수정일:</span>
                      <span className="font-medium ml-2">
                        {new Date(post.updatedAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'applicants' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">지원한 치료사 목록</h4>
                
                <div className="space-y-3">
                  {applicants.map((applicant) => (
                    <div key={applicant.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h5 className="font-medium text-gray-900">{applicant.name}</h5>
                            <span className="text-sm text-gray-500">({applicant.id})</span>
                            {getApplicantStatusBadge(applicant.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">경력:</span>
                              <span className="font-medium ml-2">{applicant.profile.experience}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">평점:</span>
                              <span className="font-medium ml-2">
                                {applicant.profile.rating} ({applicant.profile.reviews}개 후기)
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">전문 분야:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {applicant.profile.specialties.map((specialty, index) => (
                                <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-2 text-xs text-gray-500">
                            지원일: {new Date(applicant.appliedAt).toLocaleString('ko-KR')}
                          </div>
                        </div>
                        
                        <div className="ml-4 flex flex-col space-y-2">
                          <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                            프로필 보기
                          </button>
                          {applicant.status === 'pending' && (
                            <>
                              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                                선택
                              </button>
                              <button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                                거절
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {applicants.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">아직 지원한 치료사가 없습니다.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="space-y-6">
                <h4 className="text-base font-medium text-gray-900">관리 작업</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">작업 유형</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="action"
                          value="hide"
                          checked={actionType === 'hide'}
                          onChange={(e) => setActionType(e.target.value as 'hide')}
                          className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">게시글 숨김</span>
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
                        <span className="ml-2 text-sm text-gray-900">게시글 마감</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="action"
                          value="delete"
                          checked={actionType === 'delete'}
                          onChange={(e) => setActionType(e.target.value as 'delete')}
                          className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">게시글 삭제</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      작업 사유 (필수)
                    </label>
                    <textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      rows={4}
                      placeholder="작업 사유를 상세히 작성해주세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-yellow-900 mb-2">주의사항</h5>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 게시글 숨김: 일시적으로 목록에서 제거됩니다</li>
                      <li>• 게시글 마감: 더 이상 지원을 받지 않습니다</li>
                      <li>• 게시글 삭제: 완전히 삭제되며 복구할 수 없습니다</li>
                      <li>• 모든 작업은 작성자에게 알림이 발송됩니다</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleAction}
                    disabled={!actionType || !actionReason.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    작업 실행
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
            <div className="text-sm text-gray-500">
              마지막 업데이트: {new Date(post.updatedAt).toLocaleString('ko-KR')}
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
