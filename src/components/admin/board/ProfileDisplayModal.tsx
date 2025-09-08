'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

interface ProfileDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherProfile;
  onProfileAction: (
    profileId: string, 
    action: 'show' | 'hide' | 'feature' | 'unfeature' | 'reorder' | 'edit',
    data?: { order?: number; reason?: string; profileData?: Partial<TeacherProfile> }
  ) => void;
}

export default function ProfileDisplayModal({ isOpen, onClose, profile, onProfileAction }: ProfileDisplayModalProps) {
  const [activeTab, setActiveTab] = useState('edit');
  const [actionType, setActionType] = useState<'show' | 'hide' | 'feature' | 'unfeature' | 'reorder' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [newOrder, setNewOrder] = useState(profile?.displayOrder || 1);
  
  // 편집용 상태 변수들
  const [editData, setEditData] = useState({
    teacherName: profile?.teacherName || '',
    experience: profile?.experience || '',
    specialties: profile?.specialties?.join(', ') || '',
    location: profile?.location || '',
    hourlyRate: profile?.hourlyRate || '',
    title: profile?.title || '',
    rating: profile?.rating || 4.5
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editReason, setEditReason] = useState('');

  if (!isOpen || !profile) return null;

  // 데이터 유효성 검사
  if (!profile.id) {
    return (
      <>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-[90vw] shadow-xl border-4 border-blue-500">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">데이터 로딩 중</h2>
              <p className="text-sm text-gray-500 mb-4">프로필 정보를 불러오고 있습니다...</p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const tabs = [
    { id: 'edit', label: '정보 편집' },
    { id: 'display', label: '노출 관리' },
    { id: 'quality', label: '품질 분석' },
    { id: 'preview', label: '프로필 미리보기' }
  ];

  const handleAction = () => {
    if (!actionType) return;
    
    const data: { order?: number; reason?: string } = { reason: actionReason };
    if (actionType === 'reorder') {
      data.order = newOrder;
    }
    
    onProfileAction(profile.id, actionType, data);
  };

  const handleEditSave = async () => {
    if (!editReason.trim()) {
      alert('편집 사유를 입력해주세요.');
      return;
    }

    try {
      // Firestore에 직접 업데이트
      const profileRef = doc(db, 'posts', profile.id);
      const updateData: Record<string, unknown> = {
        name: editData.teacherName,
        experience: parseInt(editData.experience.replace('년', '')) || 0,
        specialty: editData.specialties.split(',').map(s => s.trim()).filter(s => s)[0] || '기타',
        region: editData.location,
        price: editData.hourlyRate,
        title: editData.title,
        rating: editData.rating,
        updatedAt: new Date()
      };

      await updateDoc(profileRef, updateData);
      
      // 부모 컴포넌트에 알림
      onProfileAction(profile.id, 'edit', { 
        reason: editReason,
        profileData: {
          ...profile,
          teacherName: editData.teacherName,
          experience: editData.experience,
          specialties: editData.specialties.split(',').map(s => s.trim()).filter(s => s),
          location: editData.location,
          hourlyRate: editData.hourlyRate,
          title: editData.title,
          rating: editData.rating
        }
      });

      setIsEditing(false);
      setEditReason('');
      alert('프로필이 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('프로필 수정 오류:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    }
  };

  const resetEditData = () => {
    setEditData({
      teacherName: profile?.teacherName || '',
      experience: profile?.experience || '',
      specialties: profile?.specialties?.join(', ') || '',
      location: profile?.location || '',
      hourlyRate: profile?.hourlyRate || '',
      title: profile?.title || '',
      rating: profile?.rating || 4.5
    });
    setIsEditing(false);
    setEditReason('');
  };

  const qualityChecklist = [
    { item: '프로필 사진', score: profile.profileImage ? 100 : 0, status: profile.profileImage ? 'good' : 'bad' },
    { item: '제목 및 소개', score: profile.title ? 90 : 0, status: profile.title ? 'good' : 'bad' },
    { item: '전문분야 설정', score: profile.specialties.length >= 2 ? 100 : 50, status: profile.specialties.length >= 2 ? 'good' : 'warning' },
    { item: '경력 정보', score: profile.experience ? 95 : 0, status: profile.experience ? 'good' : 'bad' },
    { item: '후기 및 평점', score: profile.reviewCount > 10 ? 100 : profile.reviewCount > 0 ? 70 : 0, status: profile.reviewCount > 10 ? 'good' : profile.reviewCount > 0 ? 'warning' : 'bad' },
    { item: '지역 정보', score: profile.location ? 85 : 0, status: profile.location ? 'good' : 'bad' },
    { item: '요금 정보', score: profile.hourlyRate ? 80 : 0, status: profile.hourlyRate ? 'good' : 'bad' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return '✅';
      case 'warning': return '경고';
      case 'bad': return '❌';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'bad': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <>
      {/* 모달 */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-white rounded-lg p-8 max-w-6xl w-[95vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">프로필 노출 관리</h2>
              <p className="text-sm text-gray-500 mt-1">
                {profile.teacherName} 선생님 ({profile.teacherId})
                {profile.verified && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    ✓ 인증 선생님
                  </span>
                )}
                {profile.isFeatured && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    추천 프로필
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              type="button"
            >
              ✕
            </button>
          </div>

          {/* 기본 정보 */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">노출 순서:</span>
                <span className="font-bold ml-2 text-lg">#{profile.displayOrder}</span>
              </div>
              <div>
                <span className="text-gray-600">노출 상태:</span>
                <span className={`font-medium ml-2 ${profile.isVisible ? 'text-green-600' : 'text-red-600'}`}>
                  {profile.isVisible ? '노출 중' : '숨김'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">품질 점수:</span>
                <span className={`font-bold ml-2 ${
                  profile.qualityScore >= 90 ? 'text-green-600' :
                  profile.qualityScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {profile.qualityScore}점
                </span>
              </div>
              <div>
                <span className="text-gray-600">완성도:</span>
                <span className={`font-medium ml-2 ${
                  profile.profileCompleteness >= 95 ? 'text-green-600' :
                  profile.profileCompleteness >= 80 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {profile.profileCompleteness}%
                </span>
              </div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="mt-6 max-h-96 overflow-y-auto">
            {activeTab === 'edit' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-medium text-gray-900">프로필 정보 편집</h4>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      편집 모드
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleEditSave}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        저장
                      </button>
                      <button
                        onClick={resetEditData}
                        className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600"
                      >
                        취소
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.teacherName}
                        onChange={(e) => setEditData({...editData, teacherName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {profile.teacherName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      경력사항 <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.experience}
                        onChange={(e) => setEditData({...editData, experience: e.target.value})}
                        placeholder="예: 5년"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {profile.experience}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">전문분야</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.specialties}
                        onChange={(e) => setEditData({...editData, specialties: e.target.value})}
                        placeholder="예: 언어치료, 인지치료 (쉼표로 구분)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {profile.specialties.join(', ')}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.location}
                        onChange={(e) => setEditData({...editData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {profile.location}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">시간당 요금</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.hourlyRate}
                        onChange={(e) => setEditData({...editData, hourlyRate: e.target.value})}
                        placeholder="예: 50,000원"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {profile.hourlyRate}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData({...editData, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {profile.title}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">평점</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.rating}
                        onChange={(e) => setEditData({...editData, rating: parseFloat(e.target.value) || 0})}
                        min="0"
                        max="5"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {profile.rating} / 5.0
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        편집 사유 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={editReason}
                        onChange={(e) => setEditReason(e.target.value)}
                        rows={3}
                        placeholder="프로필을 편집하는 이유를 상세히 작성해주세요"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-yellow-900 mb-2">편집 안내</h5>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 경력사항은 숫자와 &quot;년&quot; 형태로 입력해주세요 (예: 5년)</li>
                      <li>• 전문분야는 쉼표로 구분하여 입력할 수 있습니다</li>
                      <li>• 모든 변경사항은 실시간으로 반영됩니다</li>
                      <li>• 편집 사유는 관리 로그에 기록됩니다</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'display' && (
              <div className="space-y-6">
                <h4 className="text-base font-medium text-gray-900">노출 설정 관리</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">작업 유형</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="action"
                          value={profile.isVisible ? 'hide' : 'show'}
                          checked={actionType === (profile.isVisible ? 'hide' : 'show')}
                          onChange={(e) => setActionType(e.target.value as 'show' | 'hide')}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">
                          {profile.isVisible ? '프로필 숨김' : '프로필 노출'}
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="action"
                          value={profile.isFeatured ? 'unfeature' : 'feature'}
                          checked={actionType === (profile.isFeatured ? 'unfeature' : 'feature')}
                          onChange={(e) => setActionType(e.target.value as 'feature' | 'unfeature')}
                          className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">
                          {profile.isFeatured ? '추천 해제' : '추천 프로필 설정'}
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="action"
                          value="reorder"
                          checked={actionType === 'reorder'}
                          onChange={(e) => setActionType(e.target.value as 'reorder')}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">노출 순서 변경</span>
                      </label>
                    </div>
                  </div>

                  {actionType === 'reorder' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        새로운 노출 순서
                      </label>
                      <input
                        type="number"
                        value={newOrder}
                        onChange={(e) => setNewOrder(Number(e.target.value))}
                        min={1}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">현재 순서: #{profile.displayOrder}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      작업 사유 (필수)
                    </label>
                    <textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      rows={3}
                      placeholder="작업 사유를 상세히 작성해주세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-blue-900 mb-2">참고사항</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 추천 프로필은 일반 프로필보다 상위에 노출됩니다</li>
                      <li>• 노출 순서가 낮을수록 먼저 보여집니다</li>
                      <li>• 품질 점수가 낮은 프로필은 노출을 제한할 수 있습니다</li>
                      <li>• 모든 변경사항은 즉시 반영됩니다</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleAction}
                    disabled={!actionType || !actionReason.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    변경사항 적용
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'quality' && (
              <div className="space-y-6">
                <h4 className="text-base font-medium text-gray-900">프로필 품질 분석</h4>
                
                {/* 품질 체크리스트 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-4">품질 체크리스트</h5>
                  <div className="space-y-3">
                    {qualityChecklist.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getStatusIcon(item.status)}</span>
                          <span className="text-sm text-gray-700">{item.item}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                            {item.score}점
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 개선 제안 */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-yellow-900 mb-3">개선 제안</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {profile.profileCompleteness < 100 && (
                      <li>• 프로필 완성도를 높여보세요 (현재 {profile.profileCompleteness}%)</li>
                    )}
                    {profile.reviewCount < 10 && (
                      <li>• 더 많은 후기를 받아 신뢰도를 높여보세요</li>
                    )}
                    {profile.specialties.length < 2 && (
                      <li>• 전문분야를 더 상세히 설정해보세요</li>
                    )}
                    {profile.qualityScore < 90 && (
                      <li>• 프로필 내용을 더욱 구체적으로 작성해보세요</li>
                    )}
                  </ul>
                </div>

                {/* 통계 정보 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h6 className="text-sm font-medium text-blue-900 mb-2">평점 & 후기</h6>
                    <div className="text-2xl font-bold text-blue-600">{profile.rating}</div>
                    <div className="text-sm text-blue-700">{profile.reviewCount}개 후기</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h6 className="text-sm font-medium text-green-900 mb-2">품질 점수</h6>
                    <div className="text-2xl font-bold text-green-600">{profile.qualityScore}점</div>
                    <div className="text-sm text-green-700">
                      {profile.qualityScore >= 90 ? '우수' :
                       profile.qualityScore >= 70 ? '보통' : '개선 필요'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="space-y-6">
                <h4 className="text-base font-medium text-gray-900">프로필 미리보기</h4>
                
                {/* 프로필 카드 미리보기 */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h5 className="text-lg font-medium text-gray-900">{profile.teacherName}</h5>
                        {profile.verified && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            ✓ 인증
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{profile.title}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {profile.specialties.map((specialty, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {specialty}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div>
                          <span className="font-medium">{profile.rating}</span>
                          <span className="ml-1">({profile.reviewCount})</span>
                        </div>
                        <div>{profile.location}</div>
                        <div className="font-medium">{profile.hourlyRate}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 노출 위치 시뮬레이션 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">노출 위치</h5>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center space-x-2 mb-1">
                      <span>노출 순서:</span>
                      <span className="font-bold">#{profile.displayOrder}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span>👀 노출 상태:</span>
                      <span className={profile.isVisible ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {profile.isVisible ? '노출 중' : '숨김'}
                      </span>
                    </div>
                    {profile.isFeatured && (
                      <div className="flex items-center space-x-2">
                        <span>추천 프로필:</span>
                        <span className="text-purple-600 font-medium">상단 우선 노출</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 개선 필요 사항 */}
                {profile.qualityScore < 80 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-red-900 mb-2">주의</h5>
                    <p className="text-sm text-red-700">
                      품질 점수가 {profile.qualityScore}점으로 낮습니다. 
                      프로필 개선을 요청하거나 노출을 제한하는 것을 고려해보세요.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
            <div className="text-sm text-gray-500">
              마지막 업데이트: {new Date(profile.lastUpdated).toLocaleString('ko-KR')}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
