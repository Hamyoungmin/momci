'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, where, limit, getDoc, setDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  joinDate: string;
  lastActivity: string;
  status: 'active' | 'suspended' | 'withdrawn';
  // optional fields for richer display
  subscriptionStatus?: 'active' | 'expired' | 'none';
  totalMatches?: number;
  // teacher-specific
  specialties?: string[];
  experience?: number;
  education?: string;
  certifications?: string[];
  profileStatus?: 'pending' | 'approved' | 'rejected' | 'hold';
  rating?: number;
  isVerified?: boolean;
}

interface MemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  memberType: 'parent' | 'teacher';
}

export default function MemberDetailModal({ isOpen, onClose, member, memberType }: MemberDetailModalProps) {
  const [activeTab, setActiveTab] = useState('basic');

  // 실시간 데이터 상태
  const [liveUser, setLiveUser] = useState<Record<string, unknown> | null>(null);
  const [subscription, setSubscription] = useState<Record<string, unknown> | null>(null);
  const [payments, setPayments] = useState<Array<Record<string, unknown>>>([]);
  const [granting, setGranting] = useState(false);
  const [saving, setSaving] = useState(false);

  // 편집 가능한 상태 값 (회원 상태)
  const [editStatus, setEditStatus] = useState(member.status);
  const [sanctionReason, setSanctionReason] = useState('');

  useEffect(() => {
    // 모달이 열릴 때마다 현재 회원 상태로 동기화
    setEditStatus(member.status);
    setSanctionReason('');
  }, [member.id, member.status, isOpen]);

  // 모달 열릴 때 해당 회원 데이터 실시간 구독
  useEffect(() => {
    if (!isOpen || !member?.id) return;

    // users 문서 구독
    const unUser = onSnapshot(doc(db, 'users', member.id), (snap) => {
      if (snap.exists()) setLiveUser(snap.data());
    }, () => {});

    // 구독 상태 구독
    const unSub = onSnapshot(doc(db, 'user-subscription-status', member.id), (snap) => {
      if (snap.exists()) setSubscription(snap.data());
      else setSubscription(null);
    }, () => {});

    // 결제 내역 구독 (최근 10개)
    const q = query(
      collection(db, 'payments'),
      where('userId', '==', member.id),
      limit(10)
    );
    const unPay = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // createdAt 기준 내림차순 정렬 (서버 인덱스 없이 클라이언트 정렬)
      list.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ta: any = (a as any).createdAt;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tb: any = (b as any).createdAt;
        const da = ta && typeof ta.toDate === 'function' ? ta.toDate().getTime() : 0;
        const dbt = tb && typeof tb.toDate === 'function' ? tb.toDate().getTime() : 0;
        return dbt - da;
      });
      setPayments(list);
    }, (err) => {
      console.error('결제 내역 구독 실패:', err);
      setPayments([]);
    });

    return () => {
      unUser();
      unSub();
      unPay();
    };
  }, [isOpen, member?.id]);

  // 관리자: 이용권 부여 (1개월 / 3개월)
  const grantSubscription = async (months: number) => {
    if (!member?.id) return;
    try {
      setGranting(true);
      const statusRef = doc(db, 'user-subscription-status', member.id);
      const statusSnap = await getDoc(statusRef);

      const now = new Date();
      // 기존 만료일이 미래면 거기서 연장, 아니면 오늘 기준
      let base = now;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const snapExpiry: any = statusSnap.exists() ? statusSnap.data().expiryDate : null;
      try {
        if (snapExpiry && typeof snapExpiry.toDate === 'function') {
          const d = snapExpiry.toDate() as Date;
          if (d.getTime() > now.getTime()) base = d;
        }
      } catch {/* ignore */}

      const newExpiry = new Date(base);
      newExpiry.setMonth(newExpiry.getMonth() + months);

      const payload = {
        userId: member.id,
        hasActiveSubscription: true,
        subscriptionType: (memberType === 'parent' ? 'parent' : 'therapist'),
        expiryDate: newExpiry,
        lastUpdated: serverTimestamp(),
      } as Record<string, unknown>;

      if (!statusSnap.exists()) {
        await setDoc(statusRef, payload);
      } else {
        await updateDoc(statusRef, payload);
      }

      // 결제 기록 생성 (관리자 수기 부여)
      // 금액 기록: 학부모/치료사 기본 정책 반영
      const amount = (memberType === 'parent')
        ? (months === 1 ? 9900 : months === 3 ? 24900 : 0)
        : (months === 1 ? 19900 : months === 3 ? 49900 : 0);
      await addDoc(collection(db, 'payments'), {
        userId: member.id,
        amount,
        type: 'subscription',
        createdAt: serverTimestamp(),
        note: `관리자 부여 ${months}개월 (${memberType === 'parent' ? '학부모' : '치료사'})`,
      });

      alert(`${months}개월 이용권을 부여했습니다.`);
    } catch (e) {
      console.error('이용권 부여 실패:', e);
      alert('이용권 부여 중 오류가 발생했습니다.');
    } finally {
      setGranting(false);
    }
  };

  // 저장 버튼: 변경사항 저장 후 모달 닫기
  const handleSaveAndClose = async () => {
    try {
      setSaving(true);
      // 상태 변경이 있을 때만 업데이트
      if (editStatus !== member.status) {
        await updateDoc(doc(db, 'users', member.id), {
          status: editStatus,
          // 선택 사항: 제재 사유 남기기 (감사 추적용 필드)
          lastAdminActionReason: sanctionReason || null,
          lastAdminActionAt: serverTimestamp()
        });
      }
      onClose();
    } catch (e) {
      console.error('저장 실패:', e);
      alert('저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !member) return null;

  const tabs = [
    { id: 'basic', label: '기본 정보' },
    { id: 'activity', label: '활동 내역' },
    { id: 'payment', label: '결제 내역' },
    { id: 'action', label: '관리 작업' }
  ];

  const handleStatusChange = (newStatus: string) => {
    // 실제 구현 시 API 호출
    console.log('Status change:', newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 배경 오버레이 (모달 아래) - 투명 처리 */}
        <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose}></div>

        {/* 모달 (오버레이 위) */}
        <div className="relative z-50 inline-block w-full max-w-6xl p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl border-2 border-blue-500 ring-4 ring-blue-100">
          {/* 헤더 */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {memberType === 'parent' ? '학부모' : '치료사'} 회원 상세 정보
              </h3>
              <p className="text-sm text-gray-600">{member.name}님의 정보</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="mt-6 max-h-96 overflow-y-auto">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이름</label>
                    <p className="mt-1 text-sm text-gray-900">{member.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이메일</label>
                    <p className="mt-1 text-sm text-gray-900">{member.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">연락처</label>
                    <p className="mt-1 text-sm text-gray-900">{member.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">지역</label>
                    <p className="mt-1 text-sm text-gray-900">{member.region}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">가입일</label>
                    <p className="mt-1 text-sm text-gray-900">{member.joinDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">최근 활동</label>
                    <p className="mt-1 text-sm text-gray-900">{member.lastActivity}</p>
                  </div>
                </div>

                {/* 치료사 전용 정보 */}
                {memberType === 'teacher' && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-base font-medium text-gray-900 mb-4">전문 정보</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">전문 분야</label>
                        <p className="mt-1 text-sm text-gray-900">{(member.specialties && member.specialties.length > 0) ? member.specialties.join(', ') : '정보 없음'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">경력</label>
                        <p className="mt-1 text-sm text-gray-900">{typeof member.experience === 'number' ? `${member.experience}년` : '-'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">학력</label>
                        <p className="mt-1 text-sm text-gray-900">{member.education || '-'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">자격증</label>
                        <p className="mt-1 text-sm text-gray-900">{(member.certifications && member.certifications.length > 0) ? member.certifications.join(', ') : '-'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">활동 내역</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-900">최근 로그인</p>
                    <p className="text-sm text-gray-600">{(() => {
                      const v = liveUser?.lastLoginAt as unknown;
                      try {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (v && typeof (v as any).toDate === 'function') return new Date((v as any).toDate()).toLocaleString('ko-KR');
                        if (typeof v === 'number' || typeof v === 'string') return new Date(v as number).toLocaleString('ko-KR');
                      } catch {}
                      return '기록 없음';
                    })()}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-900">남은 인터뷰권</p>
                    <p className="text-sm text-gray-600">{typeof (liveUser?.interviewTokens) === 'number' ? `${liveUser?.interviewTokens}개` : '정보 없음'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-900">이용권 만료일</p>
                    <p className="text-sm text-gray-600">{(() => {
                      const v = subscription?.expiryDate as unknown;
                      try {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (v && typeof (v as any).toDate === 'function') return new Date((v as any).toDate()).toLocaleDateString('ko-KR');
                        if (typeof v === 'number' || typeof v === 'string') return new Date(v as number).toLocaleDateString('ko-KR');
                      } catch {}
                      return '-';
                    })()}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">결제 내역</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => grantSubscription(1)}
                    disabled={granting}
                    className="px-3 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    1개월 이용권 부여
                  </button>
                  <button
                    onClick={() => grantSubscription(3)}
                    disabled={granting}
                    className="px-3 py-2 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    3개월 이용권 부여
                  </button>
                  <div className="text-sm text-gray-600 ml-2">
                    {subscription?.hasActiveSubscription === true ? '현재 활성화됨' : '비활성'}
                    {(() => {
                      const v = subscription?.expiryDate as unknown;
                      try {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (v && typeof (v as any).toDate === 'function') return ` · 만료 ${new Date((v as any).toDate()).toLocaleDateString('ko-KR')}`;
                        if (typeof v === 'number' || typeof v === 'string') return ` · 만료 ${new Date(v as number).toLocaleDateString('ko-KR')}`;
                      } catch {}
                      return '';
                    })()}
                  </div>
                </div>
                <div className="space-y-3">
                  {payments.length === 0 && (
                    <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-500">결제 내역이 없습니다.</div>
                  )}
                  {payments.map((p, idx) => (
                    <div key={String(p.id || idx)} className="p-3 bg-gray-50 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{String(p.type || '결제')}</p>
                          <p className="text-sm text-gray-600">{typeof p.amount === 'number' ? `${p.amount.toLocaleString()}원` : '-'}</p>
                          <p className="text-xs text-gray-500">{(() => {
                            const v = p.createdAt as unknown;
                            try {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              if (v && typeof (v as any).toDate === 'function') return new Date((v as any).toDate()).toLocaleString('ko-KR');
                              if (typeof v === 'number' || typeof v === 'string') return new Date(v as number).toLocaleString('ko-KR');
                            } catch {}
                            return '-';
                          })()}</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">완료</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'action' && (
              <div className="space-y-6">
                <h4 className="text-base font-medium text-gray-900">관리 작업</h4>
                
                {/* 상태 변경 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회원 상태 변경
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => { setEditStatus(e.target.value as typeof editStatus); handleStatusChange(e.target.value); }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">정상</option>
                    <option value="suspended">정지</option>
                    <option value="withdrawn">탈퇴</option>
                  </select>
                </div>

                {/* 제재 사유 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제재 사유 (정지 시 필수)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="제재 사유를 입력하세요"
                    value={sanctionReason}
                    onChange={(e) => setSanctionReason(e.target.value)}
                  />
                </div>

                {/* 액션 버튼들 */}
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700">
                    계정 정지
                  </button>
                  <button className="w-full px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700">
                    경고 발송
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700">
                    비밀번호 초기화
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              닫기
            </button>
            <button
              onClick={handleSaveAndClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
