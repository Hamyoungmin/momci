'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
  const [profiles, setProfiles] = useState<TeacherProfile[]>([]);

  useEffect(() => {
    console.log('🔥 관리자 프로필 관리 - Firebase 실시간 치료사 프로필 데이터 로딩 시작');

    // posts 컬렉션에서 치료사 프로필 게시글만 실시간으로 가져오기 (선생님 둘러보기용)
    const profilesQuery = query(
      collection(db, 'posts'),
      where('type', '==', 'teacher-offer'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(profilesQuery, (snapshot) => {
      console.log('📥 관리자 실시간 치료사 프로필 데이터 업데이트:', snapshot.size, '개의 프로필');
      
      const profilesData: TeacherProfile[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log('👨‍⚕️ 게시글 데이터 (프로필용):', doc.id, data);

        // type이 'teacher-offer'인 경우만 처리 (이미 쿼리에서 필터링됨)
        // Firebase posts 데이터를 TeacherProfile 인터페이스에 맞게 변환
        const profile: TeacherProfile = {
          id: doc.id,
          teacherId: data.authorId || 'unknown',
          teacherName: data.name || data.authorName || '이름 없음',
          profileImage: data.profileImage || '/default-profile.jpg',
          title: data.specialty || `${data.experience || 0}년 경력 치료사`,
          experience: `${data.experience || 0}년`,
          specialties: data.specialty ? [data.specialty] : ['기타'],
          location: data.region || data.category || '정보 없음',
          rating: data.rating || 4.5,
          reviewCount: data.reviewCount || 0,
          hourlyRate: data.price || '협의',
          verified: data.isVerified === true || false,
          displayOrder: data.displayOrder || 0,
          isVisible: data.isVisible !== false,
          isFeatured: data.isFeatured === true,
          qualityScore: data.qualityScore || 
            (data.isVerified ? 85 : 75) + (data.experience ? data.experience * 2 : 0), // 기본 점수 계산
          lastUpdated: data.updatedAt ? 
            (data.updatedAt.toDate ? data.updatedAt.toDate().toISOString() : new Date(data.updatedAt).toISOString()) :
            (data.createdAt ? 
              (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : new Date(data.createdAt).toISOString()) :
              new Date().toISOString()),
          profileCompleteness: data.profileCompleteness || 
            (data.name && data.specialty && data.experience ? 90 : 70) // 기본 완성도 계산
        };

        profilesData.push(profile);
      });

      console.log('✅ 관리자 치료사 프로필 데이터 로딩 완료:', profilesData.length, '개');
      setProfiles(profilesData);
    }, (error) => {
      console.error('❌ 관리자 치료사 프로필 데이터 로딩 오류:', error);
    });

    return () => {
      console.log('🧹 관리자 치료사 프로필 구독 해제');
      unsubscribe();
    };
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
    action: 'show' | 'hide' | 'feature' | 'unfeature' | 'reorder' | 'edit',
    data?: { order?: number; reason?: string; profileData?: Partial<TeacherProfile> }
  ) => {
    console.log('Profile action:', { profileId, action, data });
    
    if (action === 'edit') {
      // 편집의 경우 ProfileDisplayModal에서 이미 Firestore 업데이트를 처리했으므로
      // 여기서는 로그만 남기고 모달은 닫지 않음 (사용자가 직접 닫을 수 있도록)
      console.log('✅ 프로필 편집 완료:', profileId, data?.profileData);
      return;
    }
    
    // 다른 액션들은 기존대로 모달을 닫음
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
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">프로필 노출 관리</h1>
            <p className="text-gray-600 mt-1">치료사 프로필의 노출 순서와 상태를 관리합니다</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{visibleProfiles.length}</div>
              <div className="text-sm text-gray-500">노출 중</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{featuredProfiles.length}</div>
              <div className="text-sm text-gray-500">추천</div>
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
      <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">필터 및 검색</h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* 노출 상태 필터 */}
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="px-4 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
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
              className="px-4 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
            >
              <option value="all">전체 분야</option>
              {specialtyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg">
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
      <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">프로필 목록</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white rounded-lg border border-emerald-200 shadow-sm">
                <span className="text-sm font-semibold text-gray-700">총 </span>
                <span className="text-lg font-bold text-emerald-600">{filteredProfiles.length}</span>
                <span className="text-sm font-semibold text-gray-700">개</span>
              </div>
            </div>
          </div>
        </div>
        <ProfileBoardTable
          profiles={filteredProfiles}
          onProfileSelect={handleProfileSelect}
        />
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
