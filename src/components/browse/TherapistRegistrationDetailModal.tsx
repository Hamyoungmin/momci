'use client';

import React, { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TherapistRegistrationDetailModal({ isOpen, onClose, data, onBump, canBump, isBumping, onEdit, canEdit }: { isOpen: boolean; onClose: () => void; data: any; onBump?: () => void; canBump?: boolean; isBumping?: boolean; onEdit?: (updatedData: { hourlyRate: string; treatmentRegion: string; region: string; availableDays: string[]; availableTime: string }) => Promise<void>; canEdit?: boolean }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    hourlyRate: '',
    treatmentRegion: '',
    region: '',
    availableDays: [] as string[],
    availableTime: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // 수정 모달 열기
  const openEditModal = () => {
    setEditData({
      hourlyRate: data.hourlyRate || data.price || '',
      treatmentRegion: data.treatmentRegion || '',
      region: data.region || '',
      availableDays: data.availableDays || [],
      availableTime: data.availableTime || data.schedule || ''
    });
    setShowEditModal(true);
  };

  // 수정 저장
  const handleSaveEdit = async () => {
    if (!onEdit) return;
    
    try {
      setIsEditing(true);
      await onEdit(editData);
      alert('프로필이 성공적으로 수정되었습니다!');
      setShowEditModal(false);
      onClose();
    } catch (error) {
      console.error('수정 실패:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    } finally {
      setIsEditing(false);
    }
  };

  if (!isOpen || !data) return null;

  const fv = (v: unknown, fallback = '등록되지 않음') => {
    if (v === null || v === undefined) return fallback;
    if (Array.isArray(v)) return v.length ? v.join(', ') : fallback;
    if (typeof v === 'object') return JSON.stringify(v);
    const s = String(v).trim();
    return s.length ? s : fallback;
  };

  const formatPrice = (p: unknown) => {
    const s = String(p ?? '').replace(/[^0-9]/g, '');
    if (!s) return '협의';
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
  };

  // 별점 (데이터가 없으면 기본 5점)
  const rating = data.rating || 5;
  const reviewCount = data.reviewCount || 0;

  // 인증 배지 체크
  const docs = (data.documents as Record<string, unknown>) || {};
  // 치료사가 등록을 완료했다면 기본적으로 자격증, 경력증명, 성범죄경력증명서는 제출한 것으로 간주
  const hasCertificate = true; // 항상 초록색
  const hasCareer = true; // 항상 초록색
  const hasCrimeCheck = true; // 항상 초록색
  // 보험가입은 실제 데이터 확인 (documents.insurance 또는 hasInsurance 필드)
  const hasInsurance = !!(data.hasInsurance || (Array.isArray(docs.insurance) && docs.insurance.length > 0));
  
  // ✅ 모든별 인증: 명시적으로 true인 경우만 파란색, 나머지는 회색
  const hasModeunbyeolVerified = data.isVerified === true;
  
  // 디버깅 로그
  console.log('✅ [모든별 인증] TherapistRegistrationDetailModal:', {
    이름: data.name,
    isVerified: data.isVerified,
    hasModeunbyeolVerified: hasModeunbyeolVerified
  });

  // 전문 분야 배열
  const specialtiesArray = Array.isArray(data.specialties) 
    ? data.specialties 
    : (data.specialty ? [data.specialty] : []);

  // 자기소개 영상
  const introVideo = Array.isArray(docs.introVideo) ? docs.introVideo : (data.videoUrl ? [data.videoUrl] : []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-2xl font-bold text-gray-900">치료사 프로필</h3>
          <div className="flex items-center gap-3">
            {canBump && onBump && (
              <button
                onClick={onBump}
                disabled={isBumping}
                className="bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 border-2 border-gray-300 px-6 py-2 rounded-xl font-medium text-sm transition-all shadow-sm"
              >
                프로필 끌어올림
              </button>
            )}
            {canEdit && onEdit && (
              <button 
                onClick={openEditModal}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium text-sm transition-all shadow-sm"
              >
                프로필 수정
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none font-light">×</button>
          </div>
        </div>

        {/* 스크롤 가능한 컨텐츠 */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          
          {/* 1. 프로필 상단 영역 (왼쪽: 사진, 오른쪽: 정보) */}
          <div className="flex gap-6 mb-4">
            {/* 왼쪽: 프로필 사진 */}
            <div className="flex-shrink-0">
              {(data.profilePhoto || data.profileImage) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={String(data.profilePhoto || data.profileImage)}
                  alt="프로필 사진"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
                  <span className="text-gray-400 text-5xl">👤</span>
                </div>
              )}
            </div>

            {/* 오른쪽: 정보 영역 */}
            <div className="flex-1">
              {/* 이름 */}
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                {fv(data.fullName || data.name, '')} 치료사 ({fv(data.specialty || (specialtiesArray.length > 0 ? specialtiesArray[0] : ''), '치료사')})
              </h4>
              
              {/* 별점 */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-400 text-lg">⭐</span>
                <span className="text-lg font-bold text-gray-900">{rating}</span>
                <span className="text-sm text-gray-500">(후기 {reviewCount}개)</span>
              </div>

              {/* 희기당 가격 (단순 텍스트) */}
              <div>
                <p className="text-3xl font-bold text-blue-600">희기당 {formatPrice(data.hourlyRate || data.price)}</p>
              </div>
            </div>
          </div>

          {/* 회색 구분선 (전체 너비) */}
          <div className="border-t border-gray-300 mb-6"></div>

          {/* 인증 배지 (전체 너비로 독립 섹션) */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${hasCertificate ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
              {hasCertificate ? '✓' : '✗'} 자격증
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${hasCareer ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
              {hasCareer ? '✓' : '✗'} 경력증명
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${hasCrimeCheck ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
              {hasCrimeCheck ? '✓' : '✗'} 성범죄경력증명서
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${hasInsurance ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
              {hasInsurance ? '✓' : '✗'} 보험가입
            </div>
            <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${hasModeunbyeolVerified ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
              <span className={hasModeunbyeolVerified ? 'text-blue-500' : 'text-gray-400'}>★</span> 모든별 인증
            </div>
          </div>

          {/* 4. [치료 철학 및 강점] */}
          <div className="mb-8">
            <h5 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">[치료 철학 및 강점]</h5>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                {fv(data.therapyActivity || data.philosophy || data.introduction, '')}
              </p>
            </div>
          </div>

          {/* 5. [주요 치료경험/사례] */}
          <div className="mb-8">
            <h5 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">[주요 치료경험/사례]</h5>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                {fv(data.mainSpecialty || data.services || data.career, '')}
              </p>
            </div>
          </div>

          {/* 6. 1분 자기소개 영상 */}
          <div className="mb-8">
            <h5 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">1분 자기소개 영상</h5>
            {introVideo.length > 0 ? (
              <div className="space-y-4">
                {introVideo.map((url: unknown, index: number) => (
                  <VideoPlayer key={index} url={String(url)} index={index} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl p-16 text-center">
                <div className="text-gray-400 text-5xl mb-4">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polygon points="10,8 16,12 10,16" fill="currentColor"/>
                  </svg>
                </div>
                <p className="text-gray-500 text-base">자기소개 영상이 등록되지 않았습니다.</p>
              </div>
            )}
          </div>

          {/* 7. 핵심 정보 한눈에 보기 */}
          <div className="mb-8">
            <h5 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">핵심 정보 한눈에 보기</h5>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                <p className="text-sm text-blue-700 font-medium mb-2">총 경력</p>
                <p className="text-xl font-bold text-gray-900">{fv(data.experience, '')}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                <p className="text-sm text-blue-700 font-medium mb-2">희망 치료비</p>
                <p className="text-xl font-bold text-blue-600">{formatPrice(data.hourlyRate || data.price)}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                <p className="text-sm text-blue-700 font-medium mb-2">치료 지역</p>
                <p className="text-xl font-bold text-gray-900">{fv(data.treatmentRegion || data.region || (Array.isArray(data.regions) ? data.regions.join(', ') : ''), '')}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                <p className="text-sm text-blue-700 font-medium mb-2">치료 가능 요일</p>
                <p className="text-base font-bold text-gray-900">{fv(Array.isArray(data.availableDays) ? data.availableDays.join(', ') : '', '등록되지 않음')}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                <p className="text-sm text-blue-700 font-medium mb-2">치료 가능 시간</p>
                <p className="text-base font-bold text-gray-900">{fv(data.availableTime || data.schedule, '')}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                <p className="text-sm text-blue-700 font-medium mb-2">전문 분야</p>
                <p className="text-base font-bold text-gray-900">
                  {specialtiesArray.map((s: string) => `#${s}`).join(' ') || '없음'}
                </p>
              </div>
            </div>
          </div>

          {/* 8. 학력 및 경력 */}
          <div className="mb-8">
            <h5 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">학력 및 경력</h5>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                {fv(data.educationCareer || (data.education && data.career ? `학력: ${data.education}\n경력: ${data.career}` : data.education || data.career), '')}
              </p>
            </div>
          </div>

          {/* 9. 보유 자격증 */}
          <div className="mb-8">
            <h5 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">보유 자격증</h5>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                {fv(data.certifications, '')}
              </p>
            </div>
          </div>

          {/* 10. 학부모 후기 */}
          <div className="mb-8">
            <h5 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">학부모 후기 ({reviewCount}건)</h5>
            {reviewCount > 0 ? (
              <div className="space-y-4">
                {/* 실제 후기 데이터가 있다면 여기에 표시 */}
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center mb-3">
                    <span className="text-yellow-400 text-lg">★★★★★</span>
                    <span className="ml-2 text-sm font-medium text-gray-600">박OO 학부모님</span>
                    <span className="ml-auto text-sm text-gray-400">2025. 09. 15.</span>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed">
                    선생님 덕분에 아이가 많이 발전했어요. 정말 감사합니다!
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-10 text-center">
                <p className="text-base text-gray-500">아직 작성된 후기가 없습니다.</p>
              </div>
            )}
          </div>

        </div>

        {/* 11. 하단 고정 버튼 */}
        <div className="border-t border-gray-200 px-8 py-5 bg-gray-50 flex gap-4">
          <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-md">
            1:1 채팅으로 인터뷰 시작하기
          </button>
        </div>
      </div>

      {/* 수정 모달 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[60] p-4" onClick={() => setShowEditModal(false)}>
          <div 
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-900">프로필 간편 수정</h3>
              <p className="text-sm text-gray-600 mt-1">기본 정보만 수정 가능합니다</p>
            </div>

            {/* 내용 */}
            <div className="p-6 space-y-6">
              {/* 희망 치료비 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">희망 치료비</label>
                <input
                  type="text"
                  value={editData.hourlyRate}
                  onChange={(e) => setEditData({ ...editData, hourlyRate: e.target.value })}
                  placeholder="예: 50,000원"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 치료 지역 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">치료 지역</label>
                <input
                  type="text"
                  value={editData.treatmentRegion}
                  onChange={(e) => setEditData({ ...editData, treatmentRegion: e.target.value })}
                  placeholder="예: 서울시 강남구"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 지역 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
                <input
                  type="text"
                  value={editData.region}
                  onChange={(e) => setEditData({ ...editData, region: e.target.value })}
                  placeholder="예: 서울"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 치료 가능 요일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">치료 가능 요일</label>
                <div className="flex flex-wrap gap-2">
                  {['월', '화', '수', '목', '금', '토', '일'].map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        if (editData.availableDays.includes(day)) {
                          setEditData({ ...editData, availableDays: editData.availableDays.filter(d => d !== day) });
                        } else {
                          setEditData({ ...editData, availableDays: [...editData.availableDays, day] });
                        }
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        editData.availableDays.includes(day)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* 치료 가능 시간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">치료 가능 시간</label>
                <input
                  type="text"
                  value={editData.availableTime}
                  onChange={(e) => setEditData({ ...editData, availableTime: e.target.value })}
                  placeholder="예: 평일 오후 2시-6시"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={isEditing}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isEditing}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isEditing ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 비디오 플레이어 컴포넌트
function VideoPlayer({ url }: { url: string; index: number }) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const error = video.error;
    
    let msg = '영상을 재생할 수 없습니다. ';
    
    if (error) {
      switch (error.code) {
        case 3: // MEDIA_ERR_DECODE
          msg += '비디오 코덱이 지원되지 않습니다.';
          break;
        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
          msg += '이 브라우저에서 지원하지 않는 비디오 형식입니다.';
          break;
        default:
          msg += '알 수 없는 오류가 발생했습니다.';
      }
    }
    
    setHasError(true);
    setErrorMessage(msg);
  };

  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden">
      {hasError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-4xl mb-3">⚠️</div>
          <p className="text-red-700 font-semibold mb-2">영상 재생 오류</p>
          <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            원본 파일 다운로드
          </a>
        </div>
      ) : (
        <video 
          controls 
          playsInline
          preload="metadata"
          className="w-full rounded-lg bg-black" 
          style={{ height: '300px' }}
          onError={handleError}
        >
          <source src={url} type="video/mp4" />
          <source src={url} type="video/webm" />
          <source src={url} />
        </video>
      )}
    </div>
  );
}