'use client';

import { useState, useEffect } from 'react';
import ProfileReviewQueue from './ProfileReviewQueue';
import ProfileDetailReview from './ProfileDetailReview';

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

export default function ProfileVerificationSystem() {
  const [selectedProfile, setSelectedProfile] = useState<ProfileSubmission | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const [profiles, setProfiles] = useState<ProfileSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        // TODO: Firebase에서 실제 프로필 검증 데이터 조회
        // const profilesData = await getProfileSubmissions();
        setProfiles([]);
      } catch (error) {
        console.error('프로필 검증 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleProfileSelect = (profile: ProfileSubmission) => {
    setSelectedProfile(profile);
    setIsDetailViewOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailViewOpen(false);
    setSelectedProfile(null);
  };

  const handleProfileAction = (profileId: string, action: 'approve' | 'reject' | 'hold', reason?: string) => {
    // 실제 구현 시 API 호출
    console.log('Profile action:', { profileId, action, reason });
    setIsDetailViewOpen(false);
    setSelectedProfile(null);
  };

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">🔍</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">프로필 검증 시스템</h1>
              <p className="text-gray-600 mt-1">치료사 프로필을 검토하고 승인 상태를 관리하세요</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{profiles.filter(p => p.status === 'pending').length}</div>
              <div className="text-sm text-gray-500">검토 대기</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{profiles.filter(p => p.status === 'approved').length}</div>
              <div className="text-sm text-gray-500">승인 완료</div>
            </div>
          </div>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">검토 대기</p>
              <div className="flex items-baseline space-x-1">
                <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                  {profiles.filter(p => p.status === 'pending').length}
                </p>
                <span className="text-sm font-medium text-gray-600">건</span>
              </div>
              {profiles.filter(p => p.status === 'pending').length > 0 && (
                <div className="mt-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse inline-block mr-2"></div>
                  <span className="text-xs text-orange-600 font-medium">처리 필요</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">승인 완료</p>
              <div className="flex items-baseline space-x-1">
                <p className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                  {profiles.filter(p => p.status === 'approved').length}
                </p>
                <span className="text-sm font-medium text-gray-600">건</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">❌</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">반려</p>
              <div className="flex items-baseline space-x-1">
                <p className="text-2xl font-bold text-red-600 group-hover:text-red-700 transition-colors">
                  {profiles.filter(p => p.status === 'rejected').length}
                </p>
                <span className="text-sm font-medium text-gray-600">건</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">⏸️</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">보류</p>
              <div className="flex items-baseline space-x-1">
                <p className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                  {profiles.filter(p => p.status === 'hold').length}
                </p>
                <span className="text-sm font-medium text-gray-600">건</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 검토 대기열 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 text-lg">📋</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">프로필 검토 대기열</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white rounded-lg border border-indigo-200 shadow-sm">
                <span className="text-sm font-semibold text-gray-700">총 </span>
                <span className="text-lg font-bold text-indigo-600">{profiles.length}</span>
                <span className="text-sm font-semibold text-gray-700">건</span>
              </div>
            </div>
          </div>
        </div>
        <ProfileReviewQueue
          profiles={profiles}
          onProfileSelect={handleProfileSelect}
        />
      </div>

      {/* 상세 검토 모달 */}
      {selectedProfile && (
        <ProfileDetailReview
          isOpen={isDetailViewOpen}
          onClose={handleCloseDetail}
          profile={selectedProfile}
          onAction={handleProfileAction}
        />
      )}
    </div>
  );
}
