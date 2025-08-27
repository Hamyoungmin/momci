'use client';

import { useState } from 'react';
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

  // 임시 데이터
  const [profiles] = useState<ProfileSubmission[]>([
    {
      id: '1',
      teacherId: 'T001',
      teacherName: '김○○',
      email: 'teacher1@email.com',
      phone: '010-1111-2222',
      submitDate: '2024-01-20 14:30',
      status: 'pending',
      specialties: ['언어치료', '놀이치료'],
      experience: 7,
      education: '○○대학교 언어치료학과',
      certifications: ['언어재활사 2급', '놀이치료사 1급'],
      documents: {
        diploma: 'diploma_001.pdf',
        certificate: 'cert_001.pdf',
        career: 'career_001.pdf',
        license: 'license_001.pdf'
      },
      profilePhoto: 'profile_001.jpg',
      selfIntroduction: '안녕하세요. 7년 경력의 언어치료사입니다.',
      teachingPhilosophy: '아이들과 소통하며 개별 맞춤 치료를 진행합니다.',
      priority: 'high'
    },
    {
      id: '2',
      teacherId: 'T002',
      teacherName: '이○○',
      email: 'teacher2@email.com',
      phone: '010-2222-3333',
      submitDate: '2024-01-19 10:15',
      status: 'pending',
      specialties: ['감각통합치료'],
      experience: 3,
      education: '△△대학교 작업치료학과',
      certifications: ['작업치료사'],
      documents: {
        diploma: 'diploma_002.pdf',
        certificate: 'cert_002.pdf',
        career: 'career_002.pdf',
        license: 'license_002.pdf'
      },
      profilePhoto: 'profile_002.jpg',
      selfIntroduction: '감각통합치료 전문가입니다.',
      teachingPhilosophy: '감각 발달을 통한 통합적 접근을 합니다.',
      priority: 'medium'
    },
    {
      id: '3',
      teacherId: 'T003',
      teacherName: '박○○',
      email: 'teacher3@email.com',
      phone: '010-3333-4444',
      submitDate: '2024-01-18 16:45',
      status: 'hold',
      specialties: ['인지학습치료', 'ABA치료'],
      experience: 5,
      education: '□□대학교 특수교육학과',
      certifications: ['특수교육교사 2급', 'ABA 치료사'],
      documents: {
        diploma: 'diploma_003.pdf',
        certificate: 'cert_003.pdf',
        career: 'career_003.pdf',
        license: 'license_003.pdf'
      },
      profilePhoto: 'profile_003.jpg',
      selfIntroduction: 'ABA 치료와 인지학습 전문가입니다.',
      teachingPhilosophy: '행동분석을 통한 체계적 접근을 추구합니다.',
      priority: 'low'
    }
  ]);

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
    <div className="space-y-6">
      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⏳</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">검토 대기</p>
              <p className="text-lg font-semibold text-gray-900">
                {profiles.filter(p => p.status === 'pending').length}건
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✅</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">승인 완료</p>
              <p className="text-lg font-semibold text-gray-900">
                {profiles.filter(p => p.status === 'approved').length}건
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">❌</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">반려</p>
              <p className="text-lg font-semibold text-gray-900">
                {profiles.filter(p => p.status === 'rejected').length}건
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⏸️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">보류</p>
              <p className="text-lg font-semibold text-gray-900">
                {profiles.filter(p => p.status === 'hold').length}건
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 검토 대기열 */}
      <ProfileReviewQueue
        profiles={profiles}
        onProfileSelect={handleProfileSelect}
      />

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
