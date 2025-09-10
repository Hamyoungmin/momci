'use client';

import { useState } from 'react';
import Image from 'next/image';

// 치료사 지원자 정보 타입
interface TherapistApplication {
  id: string;
  postId: string;
  applicantId: string;
  postAuthorId: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  createdAt: Date | { seconds: number; nanoseconds: number; toDate: () => Date };
  // 치료사 프로필 정보
  therapistName: string;
  therapistSpecialty: string;
  therapistExperience: number;
  therapistRating: number;
  therapistReviewCount: number;
  therapistProfileImage?: string;
  therapistCertifications?: string[];
  therapistSpecialtyTags?: string[];
  // 인증 상태
  hasIdVerification: boolean;
  hasCertification: boolean;
  hasExperienceProof: boolean;
  isVerified: boolean;
}

interface TherapistApplicationCardProps {
  application: TherapistApplication;
  onChatStart: (therapistId: string) => void;
}

export default function TherapistApplicationCard({ 
  application, 
  onChatStart 
}: TherapistApplicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 인증 뱃지 컴포넌트
  const VerificationBadge = ({ type, isActive }: { type: string; isActive: boolean }) => {
    const getBadgeInfo = (type: string) => {
      switch (type) {
        case 'certification':
          return { label: '자격증', icon: '📋' };
        case 'experience':
          return { label: '경력확인', icon: '💼' };
        case 'id':
          return { label: '신원확인', icon: '🆔' };
        case 'verified':
          return { label: '모든별 인증', icon: '⭐' };
        default:
          return { label: type, icon: '✓' };
      }
    };

    const { label, icon } = getBadgeInfo(type);
    
    return (
      <span 
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-400'
        }`}
      >
        <span className="mr-1">{icon}</span>
        {label}
      </span>
    );
  };

  // 별점 렌더링
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">☆</span>
      );
    }

    return stars;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* 치료사 기본 정보 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* 프로필 이미지 */}
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            {application.therapistProfileImage ? (
              <Image 
                src={application.therapistProfileImage} 
                alt={application.therapistName}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-600 text-lg font-medium">
                {application.therapistName[0]}
              </span>
            )}
          </div>

          <div>
            {/* 이름과 전문분야 */}
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {application.therapistName} 치료사
              <span className="text-sm text-gray-600 font-normal ml-2">
                [{application.therapistExperience}년차 {application.therapistSpecialty}]
              </span>
            </h3>

            {/* 별점과 후기 수 */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                {renderStars(application.therapistRating)}
              </div>
              <span className="text-sm font-medium text-gray-900">
                {application.therapistRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                (후기 {application.therapistReviewCount}개)
              </span>
            </div>

            {/* 전문분야 태그 */}
            {application.therapistSpecialtyTags && application.therapistSpecialtyTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {application.therapistSpecialtyTags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 인증 뱃지들 */}
            <div className="flex flex-wrap gap-2">
              <VerificationBadge type="certification" isActive={application.hasCertification} />
              <VerificationBadge type="experience" isActive={application.hasExperienceProof} />
              <VerificationBadge type="id" isActive={application.hasIdVerification} />
              <VerificationBadge type="verified" isActive={application.isVerified} />
            </div>
          </div>
        </div>

        {/* 1:1 채팅 버튼 */}
        <div className="flex flex-col items-end">
          <button
            onClick={() => onChatStart(application.applicantId)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mb-2"
          >
            💬 1:1 채팅
          </button>
          <div className="text-xs text-gray-500">
            {application.createdAt ? 
              new Date(
                typeof application.createdAt === 'object' && 'toDate' in application.createdAt 
                  ? application.createdAt.toDate() 
                  : application.createdAt
              ).toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric'
              }) + ' 지원'
              : '지원일 미상'
            }
          </div>
        </div>
      </div>

      {/* 지원 메시지 (토글 가능) */}
      {application.message && (
        <div className="border-t border-gray-100 pt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span className="mr-1">💬</span>
            지원 메시지 
            <span className="ml-1">
              {isExpanded ? '접기' : '보기'}
            </span>
            <svg 
              className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExpanded && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {application.message}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
