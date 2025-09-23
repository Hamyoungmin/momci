/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, where, limit, getDoc, setDoc, updateDoc, addDoc, serverTimestamp, orderBy, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

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
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');

  // 실시간 데이터 상태
  const [liveUser, setLiveUser] = useState<Record<string, unknown> | null>(null);
  const [subscription, setSubscription] = useState<Record<string, unknown> | null>(null);
  const [payments, setPayments] = useState<Array<Record<string, unknown>>>([]);
  const [agreements, setAgreements] = useState<Record<string, unknown> | null>(null);
  const [chatRooms, setChatRooms] = useState<Array<Record<string, unknown>>>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<Record<string, unknown>>>([]);
  const [subscriptions, setSubscriptions] = useState<Array<Record<string, unknown>>>([]);
  const [posts, setPosts] = useState<Array<Record<string, unknown>>>([]);
  const [postStatusUpdating, setPostStatusUpdating] = useState<string | null>(null);
  const [postStatusDraft, setPostStatusDraft] = useState<Record<string, string>>({});
  const [matchTherapistDraft, setMatchTherapistDraft] = useState<Record<string, string>>({});
  const [postsLoading, setPostsLoading] = useState(false);
  const [teacherProfileSummary, setTeacherProfileSummary] = useState<Record<string, unknown> | null>(null);
  const [parentPostStats, setParentPostStats] = useState<{ count: number; latest?: Date } | null>(null);
  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  const [grantBadgeLoading, setGrantBadgeLoading] = useState(false);
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

    // 약관 동의 내역 구독
    const unAgree = onSnapshot(doc(db, 'terms-agreements', member.id), (snap) => {
      if (snap.exists()) setAgreements(snap.data());
      else setAgreements(null);
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

    // 구독 기록 구독 (최근 20개)
    const subQ = query(
      collection(db, 'user-subscriptions'),
      where('userId', '==', member.id),
      orderBy('purchaseDate', 'desc'),
      limit(20)
    );
    const unSubHist = onSnapshot(subQ, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSubscriptions(list);
    }, (err) => {
      console.error('구독 기록 구독 실패:', err);
      setSubscriptions([]);
    });

    // 치료사 프로필 요약
    let unTeacher: (() => void) | undefined;
    if (memberType === 'teacher') {
      const profQ = query(collection(db, 'therapistProfiles'), where('userId', '==', member.id), limit(1));
      unTeacher = onSnapshot(profQ, (snap) => {
        if (!snap.empty) setTeacherProfileSummary({ id: snap.docs[0].id, ...snap.docs[0].data() });
        else setTeacherProfileSummary(null);
      }, () => setTeacherProfileSummary(null));
    }

    // 학부모 게시글 통계(최근 작성일 + 개수 표본)
    let unParentPosts: (() => void) | undefined;
    if (memberType === 'parent') {
      const pQ = query(collection(db, 'posts'), where('authorId', '==', member.id), orderBy('createdAt', 'desc'), limit(50));
      unParentPosts = onSnapshot(pQ, (snap) => {
        const count = snap.size;
        let latest: Date | undefined;
        if (!snap.empty) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const v: any = snap.docs[0].data().createdAt;
          try { if (v && typeof v.toDate === 'function') latest = v.toDate() as Date; } catch {}
        }
        setParentPostStats({ count, latest });
      }, () => setParentPostStats(null));
    }

    // 해당 회원이 참여한 채팅방 목록 구독 (최근 30개)
    const chatQ = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', member.id),
      limit(30)
    );
    const unChats = onSnapshot(chatQ, (snap) => {
      const rooms = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // lastMessageTime 기준 내림차순 정렬을 클라이언트에서 수행 (인덱스 불필요)
      rooms.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ta: any = (a as any).lastMessageTime;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tb: any = (b as any).lastMessageTime;
        const da = ta && typeof ta.toDate === 'function' ? ta.toDate().getTime() : 0;
        const dbt = tb && typeof tb.toDate === 'function' ? tb.toDate().getTime() : 0;
        return dbt - da;
      });
      setChatRooms(rooms);
      // 선택이 없으면 첫 채팅방 자동 선택
      if (!selectedChatId && rooms.length > 0) setSelectedChatId(String(rooms[0].id));
    }, (err) => {
      console.error('채팅방 구독 실패:', err);
      setChatRooms([]);
    });

    return () => {
      unUser();
      unSub();
      unAgree();
      unPay();
      unSubHist();
      if (unTeacher) unTeacher();
      if (unParentPosts) unParentPosts();
      unChats();
    };
  }, [isOpen, member?.id, memberType, selectedChatId]);

  // 선택된 채팅방 메시지 구독
  useEffect(() => {
    if (!isOpen || !selectedChatId) {
      setChatMessages([]);
      return;
    }
    const unMsgs = onSnapshot(
      query(
        collection(db, 'chats', selectedChatId, 'messages'),
        orderBy('timestamp', 'desc'),
        limit(100)
      ),
      (snap) => {
        const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // 시간 오름차순으로 표시
        msgs.sort((a, b) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ta: any = (a as any).timestamp;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tb: any = (b as any).timestamp;
          const da = ta && typeof ta.toDate === 'function' ? ta.toDate().getTime() : 0;
          const dbt = tb && typeof tb.toDate === 'function' ? tb.toDate().getTime() : 0;
          return da - dbt;
        });
        setChatMessages(msgs);
      },
      (err) => {
        console.error('메시지 구독 실패:', err);
        setChatMessages([]);
      }
    );
    return () => unMsgs();
  }, [isOpen, selectedChatId]);

  // 게시글 탭 데이터 로드
  useEffect(() => {
    if (!isOpen || activeTab !== 'posts' || !member?.id) return;
    setPostsLoading(true);
    const pQ = query(collection(db, 'posts'), where('authorId', '==', member.id), orderBy('createdAt', 'desc'), limit(50));
    const un = onSnapshot(pQ, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(list);
      setPostsLoading(false);
    }, (err) => {
      console.error('게시글 로드 실패:', err);
      setPosts([]);
      setPostsLoading(false);
    });
    return () => un();
  }, [isOpen, activeTab, member?.id]);

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
    { id: 'agreements', label: '동의 내역' },
    { id: 'chat', label: '채팅' },
    { id: 'posts', label: '게시글' },
    { id: 'action', label: '관리 작업' }
  ];

  const handleStatusChange = (newStatus: string) => {
    // 실제 구현 시 API 호출
    console.log('Status change:', newStatus);
  };

  return (
    <>
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
                    <p className="mt-1 text-sm text-gray-900">{String((liveUser?.name as string) || member.name || '')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이메일</label>
                    <p className="mt-1 text-sm text-gray-900">{String((liveUser?.email as string) || member.email || '')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">연락처</label>
                    <p className="mt-1 text-sm text-gray-900">{String((liveUser?.phone as string) || member.phone || '')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">지역</label>
                    <p className="mt-1 text-sm text-gray-900">{String((liveUser?.region as string) || member.region || '')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">가입일</label>
                    <p className="mt-1 text-sm text-gray-900">{(() => {
                      const v = (liveUser?.createdAt as unknown);
                      try {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (v && typeof (v as any).toDate === 'function') return new Date((v as any).toDate()).toLocaleDateString('ko-KR');
                        if (typeof v === 'number' || typeof v === 'string') return new Date(v as number).toLocaleDateString('ko-KR');
                      } catch {}
                    return member.joinDate;})()}</p>
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
                {/* 요약 섹션 */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">요약</h4>
                  {memberType === 'teacher' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">프로필 상태</label>
                        <p className="mt-1 text-sm text-gray-900">{String((teacherProfileSummary as any)?.status || '정보 없음')}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">평점/후기수</label>
                        <p className="mt-1 text-sm text-gray-900">{(() => { const r = (teacherProfileSummary as any)?.rating; const c = (teacherProfileSummary as any)?.reviewCount; return (r!=null? r: '-') + ' / ' + (c!=null? c: '-'); })()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">최근 갱신</label>
                        <p className="mt-1 text-sm text-gray-900">{(() => { const v: any = (teacherProfileSummary as any)?.updatedAt; try { if (v && typeof v.toDate==='function') return new Date(v.toDate()).toLocaleString('ko-KR'); } catch {} return '-'; })()}</p>
                      </div>
                    </div>
                  )}
                  {memberType === 'parent' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">게시글 수(최근 50내)</label>
                        <p className="mt-1 text-sm text-gray-900">{parentPostStats?.count ?? 0}건</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">최근 작성일</label>
                        <p className="mt-1 text-sm text-gray-900">{parentPostStats?.latest ? parentPostStats.latest.toLocaleString('ko-KR') : '-'}</p>
                      </div>
                    </div>
                  )}
                </div>
                {memberType === 'teacher' && (
                  <div className="border-t border-gray-200 pt-6 space-y-3">
                    <h4 className="text-base font-medium text-gray-900">치료사 인증/배지</h4>
                    <div className="text-xs text-gray-600">모든별 인증 배지를 부여/회수합니다.</div>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={grantBadgeLoading}
                        onClick={async () => {
                          try {
                            setGrantBadgeLoading(true);
                            await updateDoc(doc(db, 'users', member.id), { isVerified: true, certificationBadge: 'certified', verifiedAt: serverTimestamp() });
                            const profQ = query(collection(db, 'therapistProfiles'), where('userId', '==', member.id), limit(1));
                            const unsub = onSnapshot(profQ, async (snap) => {
                              try {
                                if (!snap.empty) {
                                  await updateDoc(snap.docs[0].ref, { isVerified: true, certificationBadge: 'certified', verificationDate: serverTimestamp(), updatedAt: serverTimestamp() });
                                }
                              } finally {
                                unsub();
                              }
                            });
                            await addDoc(collection(db, 'admin-logs'), { adminId: currentUser?.uid || 'unknown', action: 'grant_badge', targetId: member.id, targetType: 'therapist', timestamp: serverTimestamp(), details: 'certificationBadge=certified' });
                            alert('모든별 인증 배지를 부여했습니다.');
                          } catch (e) {
                            console.error('배지 부여 실패:', e);
                            alert('배지 부여 중 오류가 발생했습니다.');
                          } finally {
                            setGrantBadgeLoading(false);
                          }
                        }}
                        className="px-3 py-2 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                      >
                        모든별 인증 부여
                      </button>
                      <button
                        disabled={grantBadgeLoading}
                        onClick={async () => {
                          try {
                            setGrantBadgeLoading(true);
                            await updateDoc(doc(db, 'users', member.id), { isVerified: false, certificationBadge: null, verifiedAt: null });
                            const profQ = query(collection(db, 'therapistProfiles'), where('userId', '==', member.id), limit(1));
                            const unsub = onSnapshot(profQ, async (snap) => {
                              try {
                                if (!snap.empty) {
                                  await updateDoc(snap.docs[0].ref, { isVerified: false, certificationBadge: null, verificationDate: null, updatedAt: serverTimestamp() });
                                }
                              } finally {
                                unsub();
                              }
                            });
                            await addDoc(collection(db, 'admin-logs'), { adminId: currentUser?.uid || 'unknown', action: 'revoke_badge', targetId: member.id, targetType: 'therapist', timestamp: serverTimestamp(), details: 'certificationBadge=null' });
                            alert('모든별 인증 배지를 회수했습니다.');
                          } catch (e) {
                            console.error('배지 회수 실패:', e);
                            alert('배지 회수 중 오류가 발생했습니다.');
                          } finally {
                            setGrantBadgeLoading(false);
                          }
                        }}
                        className="px-3 py-2 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        배지 회수
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">게시글</h4>
                {postsLoading && <div className="text-sm text-gray-500">불러오는 중...</div>}
                {!postsLoading && posts.length === 0 && (
                  <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-500">게시글이 없습니다.</div>
                )}
                <div className="divide-y rounded-md border">
                  {posts.map((post) => {
                    const pid = String(post.id);
                    const curStatus = String((post as any).status || 'active');
                    const draft = postStatusDraft[pid] ?? curStatus;
                    return (
                      <div key={pid} className="p-3 flex items-start justify-between">
                        <div className="pr-3">
                          <div className="text-sm font-medium text-gray-900">{String((post as any).title || `${(post as any).treatment || ''} ${(post as any).region || ''} ${(post as any).age || ''} ${(post as any).gender || ''} ${(post as any).frequency || ''}`)}</div>
                          <div className="text-xs text-gray-600 mt-1">상태: {curStatus} · {(() => { const v = (post as any).createdAt as any; try { if (v && typeof v.toDate==='function') return new Date(v.toDate()).toLocaleString('ko-KR'); } catch {} return ''; })()}</div>
                          <div className="mt-2 flex items-center gap-2">
                            <select
                              value={draft}
                              onChange={(e) => setPostStatusDraft((s) => ({ ...s, [pid]: e.target.value }))}
                              className="px-2 py-1 text-xs border rounded"
                            >
                              <option value="active">모집중</option>
                              <option value="meeting">인터뷰 중</option>
                              <option value="matching">매칭 진행</option>
                              <option value="completed">매칭 완료</option>
                            </select>
                            <button
                              onClick={async () => {
                                try {
                                  setPostStatusUpdating(pid);
                                  await updateDoc(doc(db, 'posts', pid), { status: draft, updatedAt: serverTimestamp() });
                                  await addDoc(collection(db, 'admin-logs'), { adminId: currentUser?.uid || 'unknown', action: 'update_post_status', targetId: pid, targetType: 'post', timestamp: serverTimestamp(), details: `status=${draft}` });
                                } catch (e) {
                                  console.error('상태 변경 실패:', e);
                                  alert('상태 변경 중 오류가 발생했습니다.');
                                } finally {
                                  setPostStatusUpdating(null);
                                }
                              }}
                              disabled={postStatusUpdating === pid}
                              className="px-2 py-1 text-xs bg-blue-600 text-white rounded disabled:opacity-50"
                            >
                              적용
                            </button>
                            <input
                              value={matchTherapistDraft[pid] || ''}
                              onChange={(e) => setMatchTherapistDraft((s) => ({ ...s, [pid]: e.target.value }))}
                              placeholder="치료사ID(매칭 완료 기록용)"
                              className="ml-2 px-2 py-1 text-xs border rounded w-48"
                            />
                            <button
                              onClick={async () => {
                                const therapistId = (matchTherapistDraft[pid] || '').trim();
                                if (!therapistId) { alert('치료사 ID를 입력하세요.'); return; }
                                try {
                                  // 성공 매칭 문서를 parentId_therapistId 고정 ID로 저장하여 규칙에서 참조 가능하게 함
                                  const fixedId = `${member.id}_${therapistId}`;
                                  await setDoc(doc(db, 'successful-matches', fixedId), { postId: pid, parentId: member.id, therapistId, applicationId: fixedId, matchedAt: serverTimestamp(), status: 'completed' });
                                  await updateDoc(doc(db, 'posts', pid), { status: 'completed', updatedAt: serverTimestamp() });
                                  await addDoc(collection(db, 'admin-logs'), { adminId: currentUser?.uid || 'unknown', action: 'mark_match_completed', targetId: pid, targetType: 'post', timestamp: serverTimestamp(), details: `therapistId=${therapistId}` });
                                  alert('매칭 완료로 기록했습니다.');
                                } catch (e) {
                                  console.error('매칭 완료 기록 실패:', e);
                                  alert('매칭 완료 처리 중 오류가 발생했습니다.');
                                }
                              }}
                              className="px-2 py-1 text-xs bg-emerald-600 text-white rounded"
                            >
                              매칭 완료 기록
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              const ok = confirm('이 게시글을 삭제하시겠습니까?');
                              if (!ok) return;
                              try {
                                await deleteDoc(doc(db, 'posts', pid));
                                await addDoc(collection(db, 'admin-logs'), { adminId: currentUser?.uid || 'unknown', action: 'delete_post', targetId: pid, targetType: 'post', timestamp: serverTimestamp(), details: `authorId=${member.id}` });
                              } catch (e) {
                                console.error('게시글 삭제 실패:', e);
                                alert('삭제 중 오류가 발생했습니다.');
                              }
                            }}
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
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

                {/* 구독 기록 */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-base font-medium text-gray-900 mb-2">구독 기록</h4>
                  {subscriptions.length === 0 && (
                    <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-500">구독 기록이 없습니다.</div>
                  )}
                  <div className="space-y-2">
                    {subscriptions.map((s, i) => (
                      <div key={String(s.id || i)} className="p-3 bg-gray-50 rounded-md text-sm">
                        <div className="flex justify-between">
                          <div className="font-medium text-gray-900">{String((s as any).subscriptionType || '-')}</div>
                          <div className="text-gray-600">{String((s as any).status || '-')}</div>
                        </div>
                        <div className="text-gray-600 mt-1">
                          {(() => { const v = (s as any).purchaseDate as any; try { if (v && typeof v.toDate==='function') return '구매: ' + new Date(v.toDate()).toLocaleString('ko-KR'); } catch {} return ''; })()}
                          {(() => { const v = (s as any).expiryDate as any; try { if (v && typeof v.toDate==='function') return ' · 만료: ' + new Date(v.toDate()).toLocaleDateString('ko-KR'); } catch {} return ''; })()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 이벤트 무료권 지급 */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-base font-medium text-gray-900 mb-2">이벤트 무료권 지급</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => grantSubscription(1)}
                      disabled={granting}
                      className="px-3 py-2 text-xs font-semibold rounded-md bg-slate-600 text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                      1개월 무료권 지급(0원)
                    </button>
                    <button
                      onClick={() => grantSubscription(3)}
                      disabled={granting}
                      className="px-3 py-2 text-xs font-semibold rounded-md bg-slate-700 text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      3개월 무료권 지급(0원)
                    </button>
                    <span className="text-xs text-gray-600">기존 만료일 이후로 연장됩니다.</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'agreements' && (
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">약관/개인정보 동의 내역</h4>
                {agreements ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">동의 버전</label>
                      <p className="mt-1 text-sm text-gray-900">{String((agreements as any).termsVersion || '-')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">동의 일시</label>
                      <p className="mt-1 text-sm text-gray-900">{(() => {
                        const v = (agreements as any).agreedAt as unknown;
                        try {
                          if (v && typeof (v as any).toDate === 'function') return new Date((v as any).toDate()).toLocaleString('ko-KR');
                          if (typeof v === 'number' || typeof v === 'string') return new Date(v as number).toLocaleString('ko-KR');
                        } catch {}
                        return '-';
                      })()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">IP 주소</label>
                      <p className="mt-1 text-sm text-gray-900">{String((agreements as any).ipAddress || '-')}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-500">동의 내역이 없습니다.</div>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 border rounded-md overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b text-sm font-medium text-gray-700">대화 목록</div>
                  <div className="max-h-80 overflow-y-auto divide-y">
                    {chatRooms.length === 0 && (
                      <div className="p-3 text-sm text-gray-500">대화가 없습니다.</div>
                    )}
                    {chatRooms.map((room) => (
                      <button
                        key={String(room.id)}
                        onClick={() => setSelectedChatId(String(room.id))}
                        className={`w-full text-left p-3 hover:bg-gray-50 ${selectedChatId === String(room.id) ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">{String((room as any).parentName || '-')}
                            <span className="mx-1 text-gray-400">·</span>
                            {String((room as any).therapistName || '-')}
                          </div>
                          <span className="text-[11px] text-gray-500">{(() => {
                            const v = (room as any).lastMessageTime as unknown;
                            try {
                              if (v && typeof (v as any).toDate === 'function') return new Date((v as any).toDate()).toLocaleDateString('ko-KR');
                            } catch {}
                            return '';
                          })()}</span>
                        </div>
                        <div className="text-xs text-gray-600 truncate">{String((room as any).lastMessage || '')}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 border rounded-md overflow-hidden flex flex-col">
                  <div className="p-3 bg-gray-50 border-b text-sm font-medium text-gray-700">메시지</div>
                  <div className="flex-1 max-h-80 overflow-y-auto p-3 space-y-2">
                    {chatMessages.length === 0 && (
                      <div className="text-sm text-gray-500">메시지가 없습니다.</div>
                    )}
                    {chatMessages.map((m) => (
                      <div key={String(m.id)} className="text-sm">
                        <div className="text-gray-500 mb-0.5">
                          <span className="font-medium text-gray-800">{String((m as any).senderName || '-')}</span>
                          <span className="ml-2 text-[11px]">{(() => {
                            const v = (m as any).timestamp as unknown;
                            try {
                              if (v && typeof (v as any).toDate === 'function') return new Date((v as any).toDate()).toLocaleString('ko-KR');
                            } catch {}
                            return '';
                          })()}</span>
                        </div>
                        <div className="text-gray-900 whitespace-pre-wrap break-words">{String((m as any).message || '')}</div>
                      </div>
                    ))}
                  </div>
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
                  <button onClick={() => setConfirmSuspend(true)} className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700">계정 정지</button>
                  <button onClick={() => setConfirmWithdraw(true)} className="w-full px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700">탈퇴 처리</button>
                </div>

                {/* 이전 위치의 인증/배지 UI는 기본 정보 탭으로 이동했습니다. */}
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
      {/* 정지 확인 모달 */}
      {confirmSuspend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold text-gray-900">계정을 정지하시겠습니까?</h4>
            <p className="mt-2 text-sm text-gray-600">사유가 있다면 입력해주세요. 이 작업은 즉시 적용됩니다.</p>
            <div className="mt-3">
              <textarea rows={3} value={sanctionReason} onChange={(e) => setSanctionReason(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="정지 사유"/>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmSuspend(false)} className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700">취소</button>
              <button onClick={async () => {
                try {
                  await updateDoc(doc(db, 'users', member.id), { status: 'suspended', lastAdminActionReason: sanctionReason || null, lastAdminActionAt: serverTimestamp() });
                  await addDoc(collection(db, 'admin-logs'), { adminId: currentUser?.uid || 'unknown', action: 'suspend_user', targetId: member.id, targetType: memberType, timestamp: serverTimestamp(), details: sanctionReason || '' });
                  setConfirmSuspend(false);
                  alert('정지 처리되었습니다.');
                } catch (e) {
                  console.error('정지 처리 실패:', e);
                  alert('정지 처리 중 오류가 발생했습니다.');
                }
              }} className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700">정지</button>
            </div>
          </div>
        </div>
      )}
      {/* 탈퇴 확인 모달 */}
      {confirmWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold text-gray-900">해당 회원을 탈퇴 처리할까요?</h4>
            <p className="mt-2 text-sm text-gray-600">탈퇴 상태로 전환되며 접근이 제한됩니다.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmWithdraw(false)} className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700">취소</button>
              <button onClick={async () => {
                try {
                  await updateDoc(doc(db, 'users', member.id), { status: 'withdrawn', lastAdminActionAt: serverTimestamp() });
                  await addDoc(collection(db, 'admin-logs'), { adminId: currentUser?.uid || 'unknown', action: 'withdraw_user', targetId: member.id, targetType: memberType, timestamp: serverTimestamp(), details: '' });
                  setConfirmWithdraw(false);
                  alert('탈퇴 처리되었습니다.');
                } catch (e) {
                  console.error('탈퇴 처리 실패:', e);
                  alert('탈퇴 처리 중 오류가 발생했습니다.');
                }
              }} className="px-4 py-2 text-sm rounded-md bg-gray-700 text-white hover:bg-gray-800">탈퇴</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
