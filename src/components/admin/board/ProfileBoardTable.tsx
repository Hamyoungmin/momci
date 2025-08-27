'use client';

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

interface ProfileBoardTableProps {
  profiles: TeacherProfile[];
  onProfileSelect: (profile: TeacherProfile) => void;
}

export default function ProfileBoardTable({ profiles, onProfileSelect }: ProfileBoardTableProps) {
  const getQualityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 95) return 'text-green-600';
    if (completeness >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">치료사 프로필 목록</h2>
          <span className="text-sm text-gray-600">총 {profiles.length}개</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                노출 순서
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                치료사 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                전문 분야
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                평점 & 후기
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                품질 점수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                완성도
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                마지막 수정
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {profiles
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((profile) => (
              <tr
                key={profile.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  !profile.isVisible ? 'bg-gray-50 opacity-75' : 
                  profile.isFeatured ? 'bg-purple-50' : ''
                }`}
                onClick={() => onProfileSelect(profile)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">#{profile.displayOrder}</span>
                    {profile.isFeatured && (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        ⭐ 추천
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-xs">👩‍⚕️</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="font-medium">{profile.teacherName}</div>
                        {profile.verified && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            ✓ 인증
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{profile.teacherId}</div>
                      <div className="text-xs text-gray-600 max-w-xs truncate" title={profile.title}>
                        {profile.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {profile.location} • 경력 {profile.experience}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex flex-wrap gap-1">
                    {profile.specialties.slice(0, 2).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {specialty}
                      </span>
                    ))}
                    {profile.specialties.length > 2 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{profile.specialties.length - 2}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {profile.hourlyRate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-medium">{profile.rating}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {profile.reviewCount}개 후기
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQualityScoreColor(profile.qualityScore)}`}>
                    {profile.qualityScore}점
                  </div>
                  {profile.qualityScore < 80 && (
                    <div className="text-xs text-red-600 mt-1">
                      ⚠️ 개선 필요
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <span className={`font-medium ${getCompletenessColor(profile.profileCompleteness)}`}>
                      {profile.profileCompleteness}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className={`h-1.5 rounded-full ${
                        profile.profileCompleteness >= 95 ? 'bg-green-600' :
                        profile.profileCompleteness >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${profile.profileCompleteness}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="space-y-1">
                    <div>
                      {profile.isVisible ? (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          ✅ 노출 중
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          👁️‍🗨️ 숨김
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    <div>{new Date(profile.lastUpdated).toLocaleDateString('ko-KR')}</div>
                    <div className="text-xs">
                      {new Date(profile.lastUpdated).toLocaleTimeString('ko-KR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 데이터가 없는 경우 */}
      {profiles.length === 0 && (
        <div className="p-12 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-gray-500">프로필 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
