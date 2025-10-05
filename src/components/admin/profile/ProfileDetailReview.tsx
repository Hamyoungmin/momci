'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
    diploma: string | string[];
    certificate: string | string[];
    career: string | string[];
    license: string | string[];
    bankbook?: string | string[];
    crimeCheck?: string | string[];
    additional?: string | string[];
    introVideo?: string | string[];
  };
  profilePhoto: string;
  selfIntroduction: string;
  teachingPhilosophy: string;
  priority: 'high' | 'medium' | 'low';
}

interface ProfileDetailReviewProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileSubmission;
  onAction: (profileId: string, action: 'approve' | 'reject' | 'hold', reason?: string) => Promise<void> | void;
}

export default function ProfileDetailReview({ isOpen, onClose, profile, onAction }: ProfileDetailReviewProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'hold' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reg, setReg] = useState<Record<string, unknown> | null>(null);
  const [feed, setFeed] = useState<Record<string, unknown> | null>(null);
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [tprofile, setTprofile] = useState<Record<string, unknown> | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isOpen || !profile?.id) return;
    const ref = doc(db, 'therapist-registrations', profile.id);
    const un = onSnapshot(ref, (snap) => {
      if (snap.exists()) setReg(snap.data() as Record<string, unknown>);
    });
    // 공개 피드 보조 소스(일부 필드 누락 보완)
    const feedRef = doc(db, 'therapist-registrations-feed', profile.id);
    const unFeed = onSnapshot(feedRef, (snap) => {
      if (snap.exists()) setFeed(snap.data() as Record<string, unknown>);
    });
    // 사용자 문서(전화/이메일 등 보완)
    if (profile.teacherId) {
      getDoc(doc(db, 'users', profile.teacherId)).then((snap) => {
        if (snap.exists()) setUser(snap.data() as Record<string, unknown>);
      }).catch(() => {});
      getDoc(doc(db, 'therapistProfiles', profile.teacherId)).then((snap) => {
        if (snap.exists()) setTprofile(snap.data() as Record<string, unknown>);
      }).catch(() => {});
    }
    return () => { un(); unFeed(); };
  }, [isOpen, profile?.id, profile?.teacherId]);
  const [checklist, setChecklist] = useState({
    profilePhoto: false,
    education: false,
    certifications: false,
    experience: false,
    introduction: false,
    philosophy: false
  });

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: '프로필 정보' },
    { id: 'documents', label: '제출 서류' },
    { id: 'checklist', label: '검증 체크리스트' },
    { id: 'action', label: '승인/반려' }
  ];

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };

  const handleAction = async () => {
    if (!actionType || submitting) return;
    try {
      setSubmitting(true);
      await onAction(profile.id, actionType, actionReason);
      setSubmitting(false);
      onClose();
    } catch {
      setSubmitting(false);
    }
  };

  const allChecked = Object.values(checklist).every(Boolean);

  const toStr = (v: unknown): string => {
    // 문자열
    if (typeof v === 'string') return v;
    // 숫자
    if (typeof v === 'number') return String(v);
    // 타임스탬프(Firestore)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (v && typeof (v as any).toDate === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = (v as any).toDate();
      return new Date(d).toISOString().slice(0, 10); // YYYY-MM-DD
    }
    // 배열
    if (Array.isArray(v)) return (v as Array<unknown>).join(', ');
    return '';
  };

  const fv = (...vals: Array<unknown>) => {
    for (const v of vals) {
      const s = toStr(v);
      if (s && s.trim().length > 0) return s;
    }
    return '';
  };

  // 파일 렌더링 유틸
  const renderFiles = (value: unknown) => {
    const urls: string[] = Array.isArray(value)
      ? (value as string[])
      : (typeof value === 'string' && value) ? [value as string] : [];
    if (urls.length === 0) return <span className="text-sm text-gray-500">-</span>;
    return (
      <div className="flex flex-wrap gap-3">
        {urls.map((url, idx) => {
          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
          const isVideo = /\.(mp4|webm|mov|qt)$/i.test(url);
          return (
            <div key={idx} className="border rounded p-2 bg-gray-50">
              {isImage ? (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`evidence-${idx}`} className="w-32 h-32 object-cover" />
                </a>
              ) : isVideo ? (
                <video src={url} controls className="w-64 max-h-40" />
              ) : (
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline break-all">{url}</a>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 배경 오버레이 */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 z-40" onClick={onClose}></div>

        {/* 모달 */}
        <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative z-50">
          {/* 헤더 */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">프로필 상세 검토</h3>
              <p className="text-sm text-gray-600">{profile.teacherName}님의 프로필</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>수정</span>
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="mt-4">
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
          <div className="mt-6 max-h-[70vh] overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* 기본 정보 - 상세 페이지 디자인 차용 */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3"><span className="text-blue-600 text-lg">👤</span></div>
                    <h4 className="text-base font-bold text-gray-900">기본 정보</h4>
                    <span className="ml-auto inline-flex px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                      {profile.status === 'approved' ? '승인' : profile.status === 'rejected' ? '반려' : profile.status === 'hold' ? '보류' : '대기'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 flex items-center justify-center">
                      {fv(reg?.profilePhoto) ? (
                        <div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={fv(reg?.profilePhoto)} alt="프로필 사진" className="w-28 h-28 rounded-full object-cover border" />
                        </div>
                      ) : (
                        <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm">사진</div>
                      )}
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                      <input disabled value={(reg?.name as string) || profile.teacherName || ''} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
                      <input disabled value={fv(reg?.birthDate, feed?.birthDate, user?.birthDate, tprofile?.birthDate)} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                      <input disabled value={((reg?.gender as string) || '') as string} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                      <input disabled value={fv(reg?.phone, feed?.phone, user?.phone, tprofile?.phone, profile.phone)} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">이메일(ID)</label>
                      <input disabled value={fv(reg?.email, feed?.email, user?.email, tprofile?.email, profile.email)} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                      <input disabled value={fv(reg?.address, feed?.address, user?.address, tprofile?.address)} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                  </div>
                </div>

                {/* 프로필 정보 */}
                <div className="border-4 border-blue-700 rounded-lg p-4 bg-white">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3"><span className="text-blue-600 text-lg">📋</span></div>
                    <h4 className="text-base font-bold text-gray-900">프로필 정보</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                      <div className="text-gray-500 mb-1">전문 분야</div>
                      <input disabled value={(((reg?.specialties as string[])?.[0]) || (reg?.specialty as string) || '') as string} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">치료 지역</div>
                      <input disabled value={((reg?.region as string) || '') as string} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">경력</div>
                      <input disabled value={((reg?.experience as string) || String(profile.experience) || '') as string} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">희망 치료비</div>
                      <input disabled value={((reg?.hourlyRate as string) || '') as string} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-gray-500 mb-1">치료 철학 및 강점</div>
                      <textarea disabled rows={4} value={((reg?.therapyActivity as string) || '') as string} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 resize-none" />
                      </div>
                    <div className="md:col-span-2">
                      <div className="text-gray-500 mb-1">주요 치료 경험 및 사례</div>
                      <textarea disabled rows={4} value={((reg?.mainSpecialty as string) || '') as string} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 resize-none" />
                    </div>
                  </div>
                </div>

                {/* 학력/경력 및 자격증 */}
                <div className="border-4 border-blue-700 rounded-lg p-4 bg-white">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3"><span className="text-blue-600 text-lg">🎓</span></div>
                    <h4 className="text-base font-bold text-gray-900">학력/경력 및 자격증</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="md:col-span-1">
                      <div className="text-gray-500 mb-1">학력 및 경력</div>
                      <textarea disabled rows={6} value={fv(reg?.educationCareer, feed?.educationCareer)} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 resize-none" />
                    </div>
                    <div className="md:col-span-1">
                      <div className="text-gray-500 mb-1">보유 자격증</div>
                      <textarea disabled rows={6} value={fv(reg?.certifications, feed?.certifications)} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 resize-none" />
                    </div>
                  </div>
                </div>

                {/* 희망 시간/요일 & 계좌 */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3"><span className="text-blue-600 text-lg">🗓️</span></div>
                    <h4 className="text-base font-bold text-gray-900">희망 시간/요일 & 계좌</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">치료 가능 요일</div>
                      <input disabled value={Array.isArray(reg?.availableDays) ? ((reg?.availableDays as string[]).join(', ')) : ''} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                <div>
                      <div className="text-gray-500 mb-1">치료 가능 시간</div>
                      <input disabled value={((reg?.availableTime as string) || '') as string} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">은행명</div>
                      <input disabled value={fv(reg?.bankName)} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">예금주명</div>
                      <input disabled value={fv(reg?.accountHolder)} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-gray-500 mb-1">계좌번호</div>
                      <input disabled value={fv(reg?.accountNumber)} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">제출 서류</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">학력 증명서</h5>
                    {renderFiles(((reg as Record<string, unknown>)?.documents as Record<string, unknown> | undefined)?.diploma)}
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">자격증 사본</h5>
                    {renderFiles(((reg as Record<string, unknown>)?.documents as Record<string, unknown> | undefined)?.license)}
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">경력 증명서</h5>
                    {renderFiles(((reg as Record<string, unknown>)?.documents as Record<string, unknown> | undefined)?.career)}
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">성범죄 경력 조회 증명서</h5>
                    {renderFiles(((reg as Record<string, unknown>)?.documents as Record<string, unknown> | undefined)?.crimeCheck)}
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">기타 첨부파일</h5>
                    {renderFiles(((reg as Record<string, unknown>)?.documents as Record<string, unknown> | undefined)?.additional)}
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">1분 자기소개 영상</h5>
                    {renderFiles(((reg as Record<string, unknown>)?.documents as Record<string, unknown> | undefined)?.introVideo)}
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">통장 사본</h5>
                    {renderFiles(((reg as Record<string, unknown>)?.documents as Record<string, unknown> | undefined)?.bankbook)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'checklist' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">검증 체크리스트</h4>
                <div className="space-y-3">
                  {Object.entries(checklist).map(([key, checked]) => {
                    const labels: Record<string, string> = {
                      profilePhoto: '프로필 사진 적절성',
                      education: '학력 증명서 진위',
                      certifications: '자격증 유효성',
                      experience: '경력 정보 확인',
                      introduction: '자기소개 내용 검토',
                      philosophy: '치료 철학 적절성'
                    };
                    
                    return (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => handleChecklistChange(key, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">{labels[key]}</span>
                      </label>
                    );
                  })}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <svg className={`w-5 h-5 ${allChecked ? 'text-green-500' : 'text-yellow-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {allChecked ? '모든 항목 검증 완료' : `${Object.values(checklist).filter(Boolean).length}/${Object.keys(checklist).length} 항목 완료`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'action' && (
              <div className="space-y-6">
                <h4 className="text-base font-medium text-gray-900">승인/반려 처리</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">처리 유형</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="approve"
                        checked={actionType === 'approve'}
                        onChange={(e) => setActionType(e.target.value as 'approve')}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-900">승인</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="reject"
                        checked={actionType === 'reject'}
                        onChange={(e) => setActionType(e.target.value as 'reject')}
                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-900">반려</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="hold"
                        checked={actionType === 'hold'}
                        onChange={(e) => setActionType(e.target.value as 'hold')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-900">보류</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사유 (반려/보류 시 필수)
                  </label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="처리 사유를 입력하세요"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-yellow-800">주의사항</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        처리 후에는 해당 치료사에게 자동으로 알림이 전송됩니다. 신중하게 검토 후 처리해주세요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              닫기
            </button>
            
            {activeTab === 'action' && (
              <button
                onClick={handleAction}
                disabled={!actionType || (actionType !== 'approve' && !actionReason.trim())}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '처리 중...' : '처리 완료'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 수정 모달 */}
      {showEditModal && reg && (
        <AdminProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          profileId={profile.id}
          teacherId={profile.teacherId}
          data={reg}
          onSuccess={() => {
            setShowEditModal(false);
            alert('프로필이 성공적으로 수정되었습니다.');
          }}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
}

// 관리자용 프로필 수정 모달
interface AdminProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  teacherId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  onSuccess: () => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

function AdminProfileEditModal({ isOpen, onClose, profileId, teacherId, data, onSuccess, isEditing, setIsEditing }: AdminProfileEditModalProps) {
  const [formData, setFormData] = useState({
    name: data?.name || '',
    birthDate: data?.birthDate || '',
    gender: data?.gender || '',
    phone: data?.phone || '',
    email: data?.email || '',
    address: data?.address || '',
    specialties: Array.isArray(data?.specialties) ? data.specialties[0] : (data?.specialty || ''),
    region: data?.region || '',
    experience: data?.experience || '',
    hourlyRate: data?.hourlyRate || '',
    therapyActivity: data?.therapyActivity || '',
    mainSpecialty: data?.mainSpecialty || '',
    educationCareer: data?.educationCareer || '',
    certifications: data?.certifications || '',
    availableDays: Array.isArray(data?.availableDays) ? data.availableDays : [],
    availableTime: data?.availableTime || '',
    bankName: data?.bankName || '',
    accountHolder: data?.accountHolder || '',
    accountNumber: data?.accountNumber || ''
  });

  const daysList = ['월', '화', '수', '목', '금', '토', '일'];

  const toggleDay = (day: string) => {
    if (formData.availableDays.includes(day)) {
      setFormData({ ...formData, availableDays: formData.availableDays.filter((d: string) => d !== day) });
    } else {
      setFormData({ ...formData, availableDays: [...formData.availableDays, day] });
    }
  };

  const handleSave = async () => {
    try {
      setIsEditing(true);
      
      // therapist-registrations 업데이트
      const regRef = doc(db, 'therapist-registrations', profileId);
      await updateDoc(regRef, {
        name: formData.name,
        birthDate: formData.birthDate,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        specialties: [formData.specialties],
        specialty: formData.specialties,
        region: formData.region,
        experience: formData.experience,
        hourlyRate: formData.hourlyRate,
        therapyActivity: formData.therapyActivity,
        mainSpecialty: formData.mainSpecialty,
        educationCareer: formData.educationCareer,
        certifications: formData.certifications,
        availableDays: formData.availableDays,
        availableTime: formData.availableTime,
        bankName: formData.bankName,
        accountHolder: formData.accountHolder,
        accountNumber: formData.accountNumber,
        updatedAt: serverTimestamp()
      });

      // therapist-registrations-feed 업데이트
      const feedRef = doc(db, 'therapist-registrations-feed', profileId);
      await updateDoc(feedRef, {
        name: formData.name,
        gender: formData.gender,
        region: formData.region,
        specialty: formData.specialties,
        experience: formData.experience,
        hourlyRate: formData.hourlyRate,
        therapyActivity: formData.therapyActivity,
        mainSpecialty: formData.mainSpecialty,
        educationCareer: formData.educationCareer,
        certifications: formData.certifications,
        availableDays: formData.availableDays,
        availableTime: formData.availableTime,
        updatedAt: serverTimestamp()
      }).catch(() => {});

      // users 업데이트
      const userRef = doc(db, 'users', teacherId);
      await updateDoc(userRef, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        updatedAt: serverTimestamp()
      }).catch(() => {});

      onSuccess();
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsEditing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative z-50">
          {/* 헤더 */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 bg-green-50 -m-6 mb-6 p-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">프로필 수정</h3>
              <p className="text-sm text-gray-600 mt-1">치료사 정보를 수정합니다</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto space-y-6">
            {/* 기본 정보 */}
            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="text-base font-bold text-gray-900 mb-4">기본 정보</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
                  <input
                    type="text"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    placeholder="YYYY-MM-DD"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">선택</option>
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">연락처 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* 프로필 정보 */}
            <div className="border-4 border-blue-700 rounded-lg p-4 bg-white">
              <h4 className="text-base font-bold text-gray-900 mb-4">프로필 정보</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">전문 분야 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    placeholder="예: 언어치료사"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">치료 지역 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="예: 서울시 강남구"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">경력 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="예: 5년"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">희망 치료비 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    placeholder="예: 60000"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">치료 철학 및 강점</label>
                  <textarea
                    rows={4}
                    value={formData.therapyActivity}
                    onChange={(e) => setFormData({ ...formData, therapyActivity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">주요 치료 경험 및 사례</label>
                  <textarea
                    rows={4}
                    value={formData.mainSpecialty}
                    onChange={(e) => setFormData({ ...formData, mainSpecialty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 학력/경력 및 자격증 */}
            <div className="border-4 border-blue-700 rounded-lg p-4 bg-white">
              <h4 className="text-base font-bold text-gray-900 mb-4">학력/경력 및 자격증</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">학력 및 경력</label>
                  <textarea
                    rows={6}
                    value={formData.educationCareer}
                    onChange={(e) => setFormData({ ...formData, educationCareer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">보유 자격증</label>
                  <textarea
                    rows={6}
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 희망 시간/요일 & 계좌 */}
            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="text-base font-bold text-gray-900 mb-4">희망 시간/요일 & 계좌</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">치료 가능 요일 <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {daysList.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.availableDays.includes(day)
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">선택된 요일: {formData.availableDays.length > 0 ? formData.availableDays.join(', ') : '없음'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">치료 가능 시간 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.availableTime}
                    onChange={(e) => setFormData({ ...formData, availableTime: e.target.value })}
                    placeholder="예: 오후 2시 ~ 6시"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">은행명</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">예금주명</label>
                    <input
                      type="text"
                      value={formData.accountHolder}
                      onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">계좌번호</label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 푸터 */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={onClose}
              disabled={isEditing}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isEditing || !formData.name || !formData.phone}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
