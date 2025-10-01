'use client';

import React, { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TherapistRegistrationDetailModal({ isOpen, onClose, data, onBump, canBump, isBumping, onEdit }: { isOpen: boolean; onClose: () => void; data: any; onBump?: () => void; canBump?: boolean; isBumping?: boolean; onEdit?: (updatedData: any) => Promise<void> }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
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

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">치료사 프로필 상세</h3>
            <p className="text-sm text-gray-600 mt-1">등록한 프로필 정보를 확인하세요.</p>
          </div>
          <div className="flex items-center gap-2">
            {canBump && onBump && (
              <button
                onClick={onBump}
                disabled={isBumping}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M20 16v4H4v-4" />
                </svg>
                프로필 끌어올림
              </button>
            )}
            {canBump && onEdit && (
              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                수정
              </button>
            )}
            <button onClick={onClose} className="text-gray-500 text-2xl leading-none">×</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 기본 정보 */}
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3"><span className="text-blue-600 text-lg">👤</span></div>
              <h4 className="text-lg font-bold text-gray-900">기본 정보</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1 flex items-center justify-center">
                {data.profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={String(data.profilePhoto)}
                    alt="프로필 사진"
                    className="w-40 h-40 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm text-center">사진</span>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  <input value={fv(data.fullName || data.name, '')} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">생년월일</label>
                  <input value={fv(data.birthDate, '')} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                  <input value={fv(data.gender, '')} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                  <input value={fv(data.phone, '')} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이메일(ID)</label>
                  <input value={fv(data.email, '')} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                  <input value={fv(data.residence || data.address, '')} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">자격구분</label>
                  <input value={fv(data.qualification, '')} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
              </div>
            </div>
          </div>

          {/* 프로필 정보(공개) */}
          <div className="border-4 border-blue-700 rounded-lg p-4 bg-white">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3"><span className="text-blue-600 text-lg">📋</span></div>
              <h4 className="text-lg font-bold text-gray-900">프로필 정보 (학부모 공개)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="md:col-span-2">
                <div className="text-gray-500 mb-1">전문 분야 (중복 선택 가능)</div>
                <div className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 min-h-[40px]">
                  {(() => {
                    const specialtiesArray = Array.isArray(data.specialties) 
                      ? data.specialties 
                      : (data.specialty ? [data.specialty] : []);
                    return specialtiesArray.length > 0 ? specialtiesArray.join(', ') : '없음';
                  })()}
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">치료 지역</div>
                <input value={fv(data.treatmentRegion || data.region, '')} disabled className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
              </div>
              <div>
                <div className="text-gray-500 mb-1">경력</div>
                <input value={fv(data.experience, '')} disabled className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
              </div>
              <div className="md:col-span-2">
                <div className="text-gray-500 mb-1">희망 치료비</div>
                <input value={formatPrice(data.hourlyRate)} disabled className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
              </div>
              <div className="md:col-span-2">
                <div className="text-gray-500 mb-1">치료 철학 및 강점</div>
                <textarea value={fv(data.therapyActivity, '')} disabled rows={4} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 resize-none" />
              </div>
              <div className="md:col-span-2">
                <div className="text-gray-500 mb-1">주요 치료 경험 및 사례</div>
                <textarea value={fv(data.mainSpecialty, '')} disabled rows={4} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 resize-none" />
              </div>
            </div>
          </div>

          {/* 학력/경력 및 자격증 */}
          <div className="border-4 border-blue-700 rounded-lg p-4 bg-white">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3"><span className="text-blue-600 text-lg">🎓</span></div>
              <h4 className="text-lg font-bold text-gray-900">학력/경력 및 자격증</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="md:col-span-1">
                <div className="text-gray-500 mb-1">학력 및 경력</div>
                <textarea value={fv(data.educationCareer, '')} disabled rows={6} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 resize-none" />
              </div>
              <div className="md:col-span-1">
                <div className="text-gray-500 mb-1">보유 자격증</div>
                <textarea value={fv(data.certifications, '')} disabled rows={6} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 resize-none" />
              </div>
            </div>
          </div>

          {/* 자격 검증 섹션 (관리자 확인용) */}
          <div className="border-4 border-blue-700 rounded-lg p-4 bg-white">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3"><span className="text-blue-600 text-lg">🔍</span></div>
              <h4 className="text-lg font-bold text-gray-900">자격 검증 (관리자 확인용)</h4>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              제출된 서류는 자격 검증을 위해서만 사용되며, 학부모에게 공개되지 않습니다.
            </p>
            
            {(() => {
              const docs = (data.documents as Record<string, unknown>) || {};
              const diploma = Array.isArray(docs.diploma) ? docs.diploma : [];
              const career = Array.isArray(docs.career) ? docs.career : [];
              const license = Array.isArray(docs.license) ? docs.license : [];
              const crimeCheck = Array.isArray(docs.crimeCheck) ? docs.crimeCheck : [];
              const additional = Array.isArray(docs.additional) ? docs.additional : [];
              const introVideo = Array.isArray(docs.introVideo) ? docs.introVideo : [];

              return (
                <div className="space-y-4">
                  {/* 학력 증빙 서류 */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">학력 증빙 서류(졸업증명서 등)</div>
                    {diploma.length > 0 ? (
                      <div className="space-y-1">
                        {diploma.map((url: unknown, index: number) => (
                          <div key={index} className="flex items-center bg-blue-50 p-2 rounded">
                            <a href={String(url)} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex-1 truncate">
                              학력증명서 {index + 1}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 bg-gray-50 p-2 rounded">제출된 파일 없음</div>
                    )}
                  </div>

                  {/* 경력 증빙 서류 */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">경력 증빙 서류 (경력증명서 등)</div>
                    {career.length > 0 ? (
                      <div className="space-y-1">
                        {career.map((url: unknown, index: number) => (
                          <div key={index} className="flex items-center bg-blue-50 p-2 rounded">
                            <a href={String(url)} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex-1 truncate">
                              경력증명서 {index + 1}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 bg-gray-50 p-2 rounded">제출된 파일 없음</div>
                    )}
                  </div>

                  {/* 자격증 사본 */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">자격증 사본</div>
                    {license.length > 0 ? (
                      <div className="space-y-1">
                        {license.map((url: unknown, index: number) => (
                          <div key={index} className="flex items-center bg-blue-50 p-2 rounded">
                            <a href={String(url)} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex-1 truncate">
                              자격증 {index + 1}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 bg-gray-50 p-2 rounded">제출된 파일 없음</div>
                    )}
                  </div>

                  {/* 성범죄 경력 조회 증명서 */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">성범죄 경력 조회 증명서</div>
                    {crimeCheck.length > 0 ? (
                      <div className="space-y-1">
                        {crimeCheck.map((url: unknown, index: number) => (
                          <div key={index} className="flex items-center bg-blue-50 p-2 rounded">
                            <a href={String(url)} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex-1 truncate">
                              증명서 {index + 1}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 bg-gray-50 p-2 rounded">제출된 파일 없음</div>
                    )}
                  </div>

                  {/* 기타 첨부파일 */}
                  {additional.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">(선택) 기타 첨부파일</div>
                      <div className="space-y-1">
                        {additional.map((url: unknown, index: number) => (
                          <div key={index} className="flex items-center bg-blue-50 p-2 rounded">
                            <a href={String(url)} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex-1 truncate">
                              첨부파일 {index + 1}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 자기소개 영상 */}
                  {introVideo.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">(선택) 1분 자기소개 영상</div>
                      <div className="space-y-3">
                        {introVideo.map((url: unknown, index: number) => (
                          <VideoPlayer key={index} url={String(url)} index={index} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* 희망 시간/요일 */}
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3"><span className="text-blue-600 text-lg">🗓️</span></div>
              <h4 className="text-lg font-bold text-gray-900">희망 시간/요일</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">치료 가능 요일</div>
                <input value={fv(Array.isArray(data.availableDays) ? data.availableDays.join(', ') : '', '')} disabled className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
              </div>
              <div>
                <div className="text-gray-500 mb-1">치료 가능 시간</div>
                <input value={fv(data.availableTime, '')} disabled className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
              </div>
            </div>
          </div>

          {/* 지원 경로 섹션 */}
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3"><span className="text-blue-600 text-lg">🔍</span></div>
              <h4 className="text-lg font-bold text-gray-900">지원 경로</h4>
            </div>
            <div className="text-sm">
              <div className="text-gray-500 mb-1">경로를 선택해주세요.</div>
              <input value={fv(data.applicationSource, '')} disabled className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
            </div>
          </div>

          {/* 계좌 정보 (관리자 확인용) */}
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3"><span className="text-blue-600 text-lg">📄</span></div>
              <h4 className="text-lg font-bold text-gray-900">계좌 정보 (관리자 확인용)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">은행명</div>
                <input value={fv(data.bankName, '')} disabled className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
              </div>
              <div>
                <div className="text-gray-500 mb-1">예금주명</div>
                <input value={fv(data.accountHolder, '')} disabled className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
              </div>
              <div className="md:col-span-2">
                <div className="text-gray-500 mb-1">계좌번호</div>
                <input value={fv(data.accountNumber, '')} disabled className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
              </div>
              <div className="md:col-span-2">
                <div className="text-gray-500 mb-1">통장 사본</div>
                {(() => {
                  const docs = (data.documents as Record<string, unknown>) || {};
                  const bankbook = Array.isArray(docs.bankbook) ? docs.bankbook : [];
                  
                  return bankbook.length > 0 ? (
                    <div className="space-y-1">
                      {bankbook.map((url: unknown, index: number) => (
                        <div key={index} className="flex items-center bg-blue-50 p-2 rounded">
                          <a href={String(url)} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex-1 truncate">
                            통장 사본 {index + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 bg-gray-50 p-2 rounded">제출된 파일 없음</div>
                  );
                })()}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 간편 수정 모달 */}
      {showEditModal && <QuickEditModal data={data} onClose={() => setShowEditModal(false)} onSave={async (updatedData) => {
        if (onEdit) {
          setIsEditing(true);
          try {
            await onEdit(updatedData);
            setShowEditModal(false);
            alert('수정이 완료되었습니다!');
          } catch (error) {
            console.error('수정 실패:', error);
            alert('수정에 실패했습니다.');
          } finally {
            setIsEditing(false);
          }
        }
      }} isEditing={isEditing} />}
    </div>
  );
}

// 간편 수정 모달 컴포넌트
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function QuickEditModal({ data, onClose, onSave, isEditing }: { data: any; onClose: () => void; onSave: (updatedData: any) => void; isEditing: boolean }) {
  const [hourlyRate, setHourlyRate] = useState(String(data.hourlyRate || ''));
  const [treatmentRegion, setTreatmentRegion] = useState(String(data.treatmentRegion || data.region || ''));
  const [availableDays, setAvailableDays] = useState<string[]>(Array.isArray(data.availableDays) ? data.availableDays : []);
  const [availableTime, setAvailableTime] = useState(String(data.availableTime || ''));

  const daysList = ['월', '화', '수', '목', '금', '토', '일'];

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter(d => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hourlyRate.trim() || !treatmentRegion.trim() || availableDays.length === 0 || !availableTime.trim()) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    onSave({
      hourlyRate: hourlyRate.trim(),
      treatmentRegion: treatmentRegion.trim(),
      region: treatmentRegion.trim(), // 양쪽 필드 모두 업데이트
      availableDays,
      availableTime: availableTime.trim()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-green-50 p-4 border-b border-green-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">프로필 간편 수정</h3>
            <p className="text-sm text-gray-600 mt-1">핵심 정보만 빠르게 수정하세요</p>
          </div>
          <button onClick={onClose} className="text-gray-500 text-2xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">💡 간편 수정 안내</p>
            <p>이 수정사항은 <strong>즉시 반영</strong>되며, 별도의 심사 없이 학부모님들에게 바로 공개됩니다.</p>
          </div>

          {/* 희망 치료비 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              희망 치료비 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="예: 60000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">숫자만 입력해주세요. (예: 60000)</p>
          </div>

          {/* 치료 지역 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              치료 지역 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={treatmentRegion}
              onChange={(e) => setTreatmentRegion(e.target.value)}
              placeholder="예: 서울시 강남구"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* 치료 가능 요일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              치료 가능 요일 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {daysList.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    availableDays.includes(day)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">선택된 요일: {availableDays.length > 0 ? availableDays.join(', ') : '없음'}</p>
          </div>

          {/* 치료 가능 시간 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              치료 가능 시간 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              placeholder="예: 오후 2시 ~ 6시"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              disabled={isEditing}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isEditing}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium"
            >
              {isEditing ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 비디오 플레이어 컴포넌트 (모든 비디오 포맷 지원)
function VideoPlayer({ url, index }: { url: string; index: number }) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const error = video.error;
    
    console.error('=== 비디오 재생 오류 상세 정보 ===');
    console.error('비디오 URL:', url);
    console.error('에러 코드:', error?.code);
    console.error('에러 메시지:', error?.message);
    
    let msg = '영상을 재생할 수 없습니다. ';
    
    if (error) {
      switch (error.code) {
        case 1: // MEDIA_ERR_ABORTED
          msg += '비디오 로딩이 중단되었습니다.';
          break;
        case 2: // MEDIA_ERR_NETWORK
          msg += '네트워크 오류가 발생했습니다.';
          break;
        case 3: // MEDIA_ERR_DECODE
          msg += '비디오 디코딩에 실패했습니다. 파일이 손상되었거나 지원되지 않는 코덱입니다.';
          break;
        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
          msg += '비디오 형식이 지원되지 않습니다. MP4(H.264) 형식으로 변환해주세요.';
          break;
        default:
          msg += '알 수 없는 오류가 발생했습니다.';
      }
    }
    
    setHasError(true);
    setErrorMessage(msg);
  };

  const handleCanPlay = () => {
    console.log('✅ 비디오 재생 가능:', url);
    setHasError(false);
  };

  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden">
      <div className="relative">
        {hasError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-4xl mb-3">⚠️</div>
            <p className="text-red-700 font-semibold mb-2">영상 재생 오류</p>
            <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
            <p className="text-xs text-gray-600">
              💡 해결방법:<br/>
              • 파일을 MP4 형식으로 변환 후 다시 업로드<br/>
              • 무료 변환 도구: HandBrake, CloudConvert 등
            </p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              원본 파일 다운로드
            </a>
          </div>
        ) : (
          <video 
            controls 
            playsInline
            preload="metadata"
            crossOrigin="anonymous"
            controlsList="nodownload"
            className="w-full h-auto rounded-lg bg-black" 
            style={{ maxHeight: '500px', minHeight: '250px' }}
            onError={handleError}
            onCanPlay={handleCanPlay}
            onLoadedMetadata={() => console.log('비디오 메타데이터 로드 완료:', url)}
          >
            <source src={url} type="video/mp4" />
            <source src={url} type="video/webm" />
            <source src={url} type="video/ogg" />
            <source src={url} type="video/quicktime" />
            <source src={url} type="video/x-m4v" />
            <source src={url} />
            <p className="p-8 text-center text-white">
              귀하의 브라우저는 비디오 태그를 지원하지 않습니다.<br/>
              <a href={url} className="text-blue-400 underline">여기</a>를 클릭하여 비디오를 다운로드하세요.
            </p>
          </video>
        )}
      </div>
      <div className="text-xs text-gray-500 text-center py-2 bg-blue-50">
        자기소개 영상 {index + 1}
      </div>
    </div>
  );
}

