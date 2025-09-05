'use client';

import { useState, useEffect } from 'react';
import ProfileBoardTable from './ProfileBoardTable';
import ProfileDisplayModal from './ProfileDisplayModal';

interface TeacherProfile {
  id: string;
  teacherId: string;
  teacherName: string;
  profileImage: string;
  title: string;
  experience: string;
  specialties: string[];
  location: string;
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  verified: boolean;
  displayOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
  qualityScore: number;
  lastUpdated: string;
  profileCompleteness: number;
}

export default function ProfileBoardManagement() {
  const [selectedProfile, setSelectedProfile] = useState<TeacherProfile | null>(null);
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  
  // Firebase에서 실제 데이터 가져오기
  const [profiles] = useState<TeacherProfile[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Firebase에서 실제 치료사 프로필 데이터 가져오기
    // setProfiles(profilesData);
    // setLoading(false);
  }, []);

  const handleProfileSelect = (profile: TeacherProfile) => {
    setSelectedProfile(profile);
    setIsDisplayModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDisplayModalOpen(false);
    setSelectedProfile(null);
  };

  const handleProfileAction = (
    profileId: string, 
    action: 'show' | 'hide' | 'feature' | 'unfeature' | 'reorder',
    data?: { order?: number; reason?: string }
  ) => {
    // 실제 구현 시 API 호출
    console.log('Profile action:', { profileId, action, data });
    handleCloseModal();
  };

  const filteredProfiles = profiles.filter(profile => {
    if (visibilityFilter === 'visible' && !profile.isVisible) return false;
    if (visibilityFilter === 'hidden' && profile.isVisible) return false;
    if (visibilityFilter === 'featured' && !profile.isFeatured) return false;
    if (specialtyFilter !== 'all' && !profile.specialties.includes(specialtyFilter)) return false;
    return true;
  });

  const specialtyTypes = ['언어치료', '감각통합치료', '놀이치료', '인지학습치료', '미술치료', '음악치료'];


  const visibleProfiles = profiles.filter(p => p.isVisible);
  const featuredProfiles = profiles.filter(p => p.isFeatured);
  const verifiedProfiles = profiles.filter(p => p.verified);
  const avgQualityScore = profiles.length > 0 ? Math.round(profiles.reduce((sum, p) => sum + p.qualityScore, 0) / profiles.length) : 0;

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-100 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">프로필 노출 관리</h1>
              <p className="text-gray-600 mt-1">치료사 프로필의 노출 순서와 상태를 관리합니다</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-violet-600">{visibleProfiles.length}</div>
              <div className="text-gray-500">노출 중</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{featuredProfiles.length}</div>
              <div className="text-gray-500">추천</div>
            </div>
          </div>
        </div>
      </div>

      {/* 상태 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border-2 border-green-100 p-6 hover:border-green-200 transition-all duration-200 group">
          <div>
            <p className="text-sm font-medium text-gray-500">노출 중</p>
            <p className="text-xl font-bold text-gray-900">{visibleProfiles.length}개</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-purple-100 p-6 hover:border-purple-200 transition-all duration-200 group">
          <div>
            <p className="text-sm font-medium text-gray-500">추천 프로필</p>
            <p className="text-xl font-bold text-gray-900">{featuredProfiles.length}개</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-blue-100 p-6 hover:border-blue-200 transition-all duration-200 group">
          <div>
            <p className="text-sm font-medium text-gray-500">인증 선생님</p>
            <p className="text-xl font-bold text-gray-900">{verifiedProfiles.length}명</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-yellow-100 p-6 hover:border-yellow-200 transition-all duration-200 group">
          <div>
            <p className="text-sm font-medium text-gray-500">평균 품질점수</p>
            <p className="text-xl font-bold text-gray-900">{avgQualityScore}점</p>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-violet-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">프로필 필터 및 관리</h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* 노출 상태 필터 */}
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="px-3 py-2 text-sm border-2 border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="all">전체</option>
              <option value="visible">노출 중</option>
              <option value="hidden">숨김</option>
              <option value="featured">추천</option>
            </select>

            {/* 전문분야 필터 */}
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="px-3 py-2 text-sm border-2 border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="all">전체 분야</option>
              {specialtyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
              노출 순서 일괄 수정
            </button>
          </div>
        </div>

        {/* 품질 관리 알림 */}
        {profiles.filter(p => p.qualityScore < 80).length > 0 && (
          <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-yellow-800">
                품질 점수가 낮은 프로필 {profiles.filter(p => p.qualityScore < 80).length}개가 있습니다. 
                개선 요청을 검토해보세요.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 프로필 목록 */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-violet-100">
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4 border-b border-violet-100 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">프로필 목록</h3>
              <span className="px-3 py-1 bg-violet-100 text-violet-700 text-sm font-semibold rounded-full">
                총 {filteredProfiles.length}개
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <ProfileBoardTable
            profiles={filteredProfiles}
            onProfileSelect={handleProfileSelect}
          />
        </div>
      </div>

      {/* 프로필 노출 관리 모달 */}
      {selectedProfile && (
        <ProfileDisplayModal
          isOpen={isDisplayModalOpen}
          onClose={handleCloseModal}
          profile={selectedProfile}
          onProfileAction={handleProfileAction}
        />
      )}
    </div>
  );
}
