'use client';

import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TherapistRegistrationDetailModal({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data: any }) {
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
          <button onClick={onClose} className="text-gray-500 text-2xl leading-none">×</button>
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
                <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm text-center">사진</span>
                </div>
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
              <div>
                <div className="text-gray-500 mb-1">전문 분야</div>
                <input value={fv(data.specialty || (data.specialties && data.specialties[0]), '')} disabled className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
              </div>
              <div>
                <div className="text-gray-500 mb-1">치료 지역</div>
                <input value={fv(data.treatmentRegion || data.region, '')} disabled className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
              </div>
              <div>
                <div className="text-gray-500 mb-1">경력</div>
                <input value={fv(data.experience, '')} disabled className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
              </div>
              <div>
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

          {/* 계좌 정보 */}
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3"><span className="text-blue-600 text-lg">📄</span></div>
              <h4 className="text-lg font-bold text-gray-900">계좌 정보</h4>
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
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


