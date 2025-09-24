'use client';

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
  disableChat?: boolean;
  onChatStart: (therapistId: string) => void;
  onViewProfile: (therapistId: string) => void;
}

export default function TherapistApplicationCard({ 
  application, 
  disableChat = false,
  onChatStart,
  onViewProfile
}: TherapistApplicationCardProps) {
  // 이름에서 성만 추출하는 함수 (선생님 둘러보기와 동일)
  const getLastName = (fullName: string | undefined): string => {
    if (!fullName) return '익명';
    return fullName.charAt(0);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-blue-100 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200">
      <div className="flex items-start justify-between">
        {/* 왼쪽: 프로필 정보 */}
        <div className="flex items-start space-x-4 flex-1">
          {/* 프로필 이미지 */}
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
            {application.therapistProfileImage ? (
              <Image 
                src={application.therapistProfileImage} 
                alt={`${application.therapistName} 프로필`}
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="text-center">
                <span className="text-gray-500 text-xs font-medium block">프로필</span>
                <span className="text-gray-400 text-xs block">사진</span>
              </div>
            )}
          </div>
          
          {/* 치료사 정보 */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900">
                {/* 성 + 00 + 치료사 [년차 전문분야] 형태로 표시 */}
                {getLastName(application.therapistName)}00 치료사 <span className="text-gray-600">[{application.therapistExperience || 0}년차 {application.therapistSpecialty}]</span>
              </h3>
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center">
                {/* 별 5개 틀 항상 표시 */}
                <div className="flex items-center mr-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const rating = application.therapistRating || 0;
                    const filled = star <= Math.floor(rating);
                    const halfFilled = star === Math.ceil(rating) && rating % 1 !== 0;
                    
                    return (
                      <span
                        key={star}
                        className={`text-lg ${
                          filled 
                            ? 'text-orange-400' 
                            : halfFilled 
                            ? 'text-orange-300' 
                            : 'text-gray-300'
                        }`}
                      >
                        {filled ? '★' : halfFilled ? '☆' : '☆'}
                      </span>
                    );
                  })}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {application.therapistRating > 0 ? application.therapistRating.toFixed(1) : '0.0'}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  (후기 {application.therapistReviewCount || 0}개)
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                #{application.therapistSpecialty}
              </span>
              {application.therapistSpecialtyTags && application.therapistSpecialtyTags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-3 mb-3"></div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* 자격증 인증 - 항상 체크/연초록 배지로 표시 */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border-green-200 border`}>
                ✓ 자격증
              </span>
              
              {/* 경력 증명 - 항상 체크/연초록 배지로 표시 */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border-green-200 border`}>
                ✓ 경력증명
              </span>

              {/* 성범죄경력증명서 - 항상 체크/연초록 배지로 표시 */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border-green-200 border`}>
                ✓ 성범죄경력증명서
              </span>

              {/* 보험가입 - 기본 인증된 것으로 처리 */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${application.isVerified ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}>
                {application.isVerified ? '✓' : '×'} 보험가입
              </span>
              
              {/* 모든별 인증 */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${application.isVerified ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}>
                {application.isVerified ? '⭐' : '☆'} 모든별 인증
              </span>
            </div>
          </div>
        </div>

        {/* 오른쪽: 버튼들과 지원일 */}
        <div className="text-right">
          <button
            onClick={() => {
              if (disableChat) {
                alert('치료사는 1:1 채팅을 시작할 수 없습니다. 학부모의 채팅 요청을 기다려 주세요.');
                return;
              }
              onChatStart(application.applicantId);
            }}
            className={`${disableChat ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'} px-4 py-2 rounded-lg text-sm font-medium transition-colors mb-2 block w-full`}
            disabled={disableChat}
          >
            💬 1:1 채팅
          </button>
          <button
            onClick={() => onViewProfile(application.applicantId)}
            className="text-xs text-gray-500 hover:text-blue-600 mb-1 cursor-pointer transition-colors block text-right"
          >
            상세 프로필 보기 &gt;
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
    </div>
  );
}
