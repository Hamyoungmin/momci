'use client';

import { useState } from 'react';

interface MemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: any;
  memberType: 'parent' | 'teacher';
}

export default function MemberDetailModal({ isOpen, onClose, member, memberType }: MemberDetailModalProps) {
  const [activeTab, setActiveTab] = useState('basic');

  if (!isOpen || !member) return null;

  const tabs = [
    { id: 'basic', label: '기본 정보' },
    { id: 'activity', label: '활동 내역' },
    { id: 'payment', label: '결제 내역' },
    { id: 'action', label: '관리 작업' }
  ];

  const handleStatusChange = (newStatus: string) => {
    // 실제 구현 시 API 호출
    console.log('Status change:', newStatus);
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
              <h3 className="text-lg font-medium text-gray-900">
                {memberType === 'parent' ? '학부모' : '치료사'} 회원 상세 정보
              </h3>
              <p className="text-sm text-gray-600">{member.name}님의 정보</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
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
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="mt-6 max-h-96 overflow-y-auto">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이름</label>
                    <p className="mt-1 text-sm text-gray-900">{member.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이메일</label>
                    <p className="mt-1 text-sm text-gray-900">{member.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">연락처</label>
                    <p className="mt-1 text-sm text-gray-900">{member.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">지역</label>
                    <p className="mt-1 text-sm text-gray-900">{member.region}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">가입일</label>
                    <p className="mt-1 text-sm text-gray-900">{member.joinDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">최근 활동</label>
                    <p className="mt-1 text-sm text-gray-900">{member.lastActivity}</p>
                  </div>
                </div>

                {/* 치료사 전용 정보 */}
                {memberType === 'teacher' && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-base font-medium text-gray-900 mb-4">전문 정보</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">전문 분야</label>
                        <p className="mt-1 text-sm text-gray-900">언어치료, 놀이치료</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">경력</label>
                        <p className="mt-1 text-sm text-gray-900">7년</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">학력</label>
                        <p className="mt-1 text-sm text-gray-900">○○대학교 언어치료학과</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">자격증</label>
                        <p className="mt-1 text-sm text-gray-900">언어재활사 2급</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">활동 내역</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-900">매칭 완료</p>
                    <p className="text-sm text-gray-600">서울 강남구 언어치료 매칭</p>
                    <p className="text-xs text-gray-500">2024-01-20 14:30</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-900">채팅 시작</p>
                    <p className="text-sm text-gray-600">김○○ 치료사와 1:1 채팅</p>
                    <p className="text-xs text-gray-500">2024-01-19 10:15</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-900">요청글 작성</p>
                    <p className="text-sm text-gray-600">언어치료 선생님 구해요</p>
                    <p className="text-xs text-gray-500">2024-01-18 16:45</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">결제 내역</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {memberType === 'parent' ? '학부모 이용권' : '치료사 이용권'}
                        </p>
                        <p className="text-sm text-gray-600">월간 이용권</p>
                        <p className="text-xs text-gray-500">2024-01-15</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        완료
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">첫 수업료</p>
                        <p className="text-sm text-gray-600">65,000원</p>
                        <p className="text-xs text-gray-500">2024-01-20</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        정산 완료
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'action' && (
              <div className="space-y-6">
                <h4 className="text-base font-medium text-gray-900">관리 작업</h4>
                
                {/* 상태 변경 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회원 상태 변경
                  </label>
                  <select
                    value={member.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">정상</option>
                    <option value="suspended">정지</option>
                    <option value="withdrawn">탈퇴</option>
                  </select>
                </div>

                {/* 제재 사유 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제재 사유 (정지 시 필수)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="제재 사유를 입력하세요"
                  />
                </div>

                {/* 액션 버튼들 */}
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700">
                    계정 정지
                  </button>
                  <button className="w-full px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700">
                    경고 발송
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700">
                    비밀번호 초기화
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
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
