'use client';

import { useState } from 'react';
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

  // 임시 데이터
  const [profiles] = useState<TeacherProfile[]>([
    {
      id: 'TP001',
      teacherId: 'T001',
      teacherName: '이○○',
      profileImage: '/images/teacher1.jpg',
      title: '7년 경력의 언어치료 전문가',
      experience: '7년',
      specialties: ['언어치료', '인지학습치료'],
      location: '서울 강남구',
      rating: 4.9,
      reviewCount: 31,
      hourlyRate: '6-8만원',
      verified: true,
      displayOrder: 1,
      isVisible: true,
      isFeatured: true,
      qualityScore: 95,
      lastUpdated: '2024-01-20 10:30',
      profileCompleteness: 100
    },
    {
      id: 'TP002',
      teacherId: 'T002',
      teacherName: '김○○',
      profileImage: '/images/teacher2.jpg',
      title: '아이들과 함께하는 감각통합 전문가',
      experience: '5년',
      specialties: ['감각통합치료', '놀이치료'],
      location: '경기 성남시',
      rating: 4.8,
      reviewCount: 23,
      hourlyRate: '5-7만원',
      verified: true,
      displayOrder: 2,
      isVisible: true,
      isFeatured: false,
      qualityScore: 88,
      lastUpdated: '2024-01-19 15:20',
      profileCompleteness: 95
    },
    {
      id: 'TP003',
      teacherId: 'T003',
      teacherName: '박○○',
      profileImage: '/images/teacher3.jpg',
      title: '미술치료로 마음을 열어주는 선생님',
      experience: '4년',
      specialties: ['미술치료', '놀이치료'],
      location: '서울 마포구',
      rating: 4.7,
      reviewCount: 18,
      hourlyRate: '5-6만원',
      verified: false,
      displayOrder: 3,
      isVisible: false,
      isFeatured: false,
      qualityScore: 72,
      lastUpdated: '2024-01-18 09:45',
      profileCompleteness: 80
    },
    {
      id: 'TP004',
      teacherId: 'T004',
      teacherName: '정○○',
      profileImage: '/images/teacher4.jpg',
      title: '10년 경력의 베테랑 언어치료사',
      experience: '10년',
      specialties: ['언어치료'],
      location: '부산 해운대구',
      rating: 4.9,
      reviewCount: 45,
      hourlyRate: '7-9만원',
      verified: true,
      displayOrder: 4,
      isVisible: true,
      isFeatured: true,
      qualityScore: 98,
      lastUpdated: '2024-01-20 14:15',
      profileCompleteness: 100
    }
  ]);

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

  const getQualityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* 상태 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">👁️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">노출 중</p>
              <p className="text-lg font-semibold text-gray-900">
                {profiles.filter(p => p.isVisible).length}개
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⭐</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">추천 프로필</p>
              <p className="text-lg font-semibold text-gray-900">
                {profiles.filter(p => p.isFeatured).length}개
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✅</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">인증 선생님</p>
              <p className="text-lg font-semibold text-gray-900">
                {profiles.filter(p => p.verified).length}명
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📊</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">평균 품질점수</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.round(profiles.reduce((sum, p) => sum + p.qualityScore, 0) / profiles.length)}점
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">프로필 노출 관리</h2>
          <div className="flex items-center space-x-4">
            {/* 노출 상태 필터 */}
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 분야</option>
              {specialtyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              노출 순서 일괄 수정
            </button>
          </div>
        </div>

        {/* 품질 관리 알림 */}
        {profiles.filter(p => p.qualityScore < 80).length > 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">
                품질 점수가 낮은 프로필 {profiles.filter(p => p.qualityScore < 80).length}개가 있습니다. 
                개선 요청을 검토해보세요.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 프로필 테이블 */}
      <ProfileBoardTable
        profiles={filteredProfiles}
        onProfileSelect={handleProfileSelect}
      />

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
