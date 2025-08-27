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
  priority: 'high' | 'medium' | 'low';
}

interface ProfileReviewQueueProps {
  profiles: ProfileSubmission[];
  onProfileSelect: (profile: ProfileSubmission) => void;
}

export default function ProfileReviewQueue({ profiles, onProfileSelect }: ProfileReviewQueueProps) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('submitDate');

  const getStatusBadge = (status: ProfileSubmission['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">검토 대기</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">승인</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">반려</span>;
      case 'hold':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">보류</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getPriorityBadge = (priority: ProfileSubmission['priority']) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">긴급</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-600 rounded-full">보통</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">낮음</span>;
      default:
        return null;
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    if (filter === 'all') return true;
    return profile.status === filter;
  });

  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    if (sortBy === 'submitDate') {
      return new Date(b.submitDate).getTime() - new Date(a.submitDate).getTime();
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">프로필 검토 대기열</h2>
          <div className="flex items-center space-x-4">
            {/* 필터 */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="pending">검토 대기</option>
              <option value="approved">승인</option>
              <option value="rejected">반려</option>
              <option value="hold">보류</option>
            </select>

            {/* 정렬 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="submitDate">제출일순</option>
              <option value="priority">우선순위순</option>
            </select>

            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              일괄 처리
            </button>
          </div>
        </div>
      </div>

      {/* 프로필 목록 */}
      <div className="divide-y divide-gray-200">
        {sortedProfiles.map((profile) => (
          <div
            key={profile.id}
            className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onProfileSelect(profile)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900">{profile.teacherName}</h3>
                  {getPriorityBadge(profile.priority)}
                  {getStatusBadge(profile.status)}
                </div>
                
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">이메일:</span> {profile.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">연락처:</span> {profile.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">경력:</span> {profile.experience}년
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">전문 분야:</span>
                    <div className="flex flex-wrap gap-1">
                      {profile.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    제출일: {new Date(profile.submitDate).toLocaleString('ko-KR')}
                  </p>
                  <div className="flex space-x-2">
                    {profile.status === 'pending' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // 빠른 승인 로직
                          }}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          빠른 승인
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // 빠른 반려 로직
                          }}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          빠른 반려
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="ml-4 flex-shrink-0">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 데이터가 없는 경우 */}
      {sortedProfiles.length === 0 && (
        <div className="p-12 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">검토할 프로필이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
