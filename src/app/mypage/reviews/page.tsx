'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, onSnapshot, orderBy, query, where, Timestamp, doc, addDoc, serverTimestamp, getDoc, getDocs, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ReviewDoc {
  id: string;
  title: string;
  content: string;
  rating: number;
  createdAt?: Timestamp;
  status?: string;
  author?: string;
}

interface ReviewData {
  title?: string;
  content?: string;
  rating?: number;
  createdAt?: Timestamp;
  status?: string;
  author?: string;
  userId?: string;
}

interface TherapistReviewData {
  title?: string;
  content?: string;
  rating?: number;
  createdAt?: Timestamp;
  therapistName?: string;
}

interface UserDoc {
  interviewTokens?: number;
}

// 지원자 후기(therapist-reviews)도 같은 카드에 합쳐서 표시하기 위해 별도 상태로 가져와 병합합니다.

export default function MyReviewsPage() {
  const { currentUser, userData, loading } = useAuth();
  const [reviews, setReviews] = useState<ReviewDoc[]>([]);
  const [tokenInfo, setTokenInfo] = useState<{ base: number; bonus: number; total: number }>({ base: 0, bonus: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [therapistReviews, setTherapistReviews] = useState<ReviewDoc[]>([]);
  const [completedMatches, setCompletedMatches] = useState<Array<{ id: string; therapistId: string; matchedAt?: Timestamp }>>([]);
  const [therapistNameMap, setTherapistNameMap] = useState<Record<string, string>>({});
  const [activeChatTherapistIds, setActiveChatTherapistIds] = useState<Set<string>>(new Set());
  const [writeOpen, setWriteOpen] = useState(false);
  const [writeClosing, setWriteClosing] = useState(false);
  const [writeTarget, setWriteTarget] = useState<{ therapistId: string; therapistName: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // 치료사 계정 체크
  const isTherapist = userData?.userType === 'therapist';

  useEffect(() => {
    if (!currentUser) return;

    // 내 후기 실시간 구독 (승인 여부와 관계없이 내가 쓴 것)
    const q = query(
      collection(db, 'reviews'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const items: ReviewDoc[] = [];
      snap.forEach((d) => {
        const data = d.data() as ReviewData;
        items.push({
          id: d.id,
          title: data.title || '',
          content: data.content || '',
          rating: data.rating || 0,
          createdAt: data.createdAt,
          status: data.status,
          author: data.author
        });
      });
      setReviews(items);
      setIsLoading(false);
    }, () => setIsLoading(false));

    return () => unsub();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    // 현재 사용자 문서에서 interviewTokens 실시간 구독 후 합계 계산
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (snap) => {
      const data = (snap.data() as UserDoc) ?? {};
      const total = Number(data.interviewTokens || 0);
      const base = total > 0 ? 1 : 0; // 기본 제공 1회 가정
      const bonus = Math.max(0, total - base);
      setTokenInfo({ base, bonus, total });
    });
    return () => unsub();
  }, [currentUser]);

  // 내가 작성한 치료사 후기(therapist-reviews) 구독
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, 'therapist-reviews'),
      where('parentId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const items: ReviewDoc[] = [];
      snap.forEach((d) => {
        const data = d.data() as TherapistReviewData;
        items.push({
          id: d.id,
          title: data.title || `${data.therapistName || '치료사'} 후기`,
          content: data.content || '',
          rating: data.rating || 0,
          createdAt: data.createdAt,
          status: 'approved'
        });
      });
      setTherapistReviews(items);
    });
    return () => unsub();
  }, [currentUser]);

  // 완료된 매칭 구독 (parent 전용) - 정렬은 클라이언트에서 처리해 인덱스 의존 최소화
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, 'successful-matches'),
      where('parentId', '==', currentUser.uid)
    );
    const unsub = onSnapshot(q, async (snap) => {
      const list: Array<{ id: string; therapistId: string; matchedAt?: Timestamp }> = [];
      const needNames: string[] = [];
      snap.forEach((d) => {
        const data = d.data() as { therapistId: string; matchedAt?: Timestamp };
        list.push({ id: d.id, therapistId: data.therapistId, matchedAt: data.matchedAt });
        if (!therapistNameMap[data.therapistId]) needNames.push(data.therapistId);
      });

      // 치료사 이름 보강
      if (needNames.length > 0) {
        const entries = await Promise.all(needNames.map(async (tid) => {
          try {
            const u = await getDoc(doc(db, 'users', tid));
            const udata = (u.data() as { name?: string }) || {};
            return [tid, u.exists() ? (udata.name || '치료사') : '치료사'] as [string, string];
          } catch { return [tid, '치료사'] as [string, string]; }
        }));
        setTherapistNameMap((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
      }

      // 최근 순으로 정렬
      list.sort((a, b) => (b.matchedAt?.toMillis?.() || 0) - (a.matchedAt?.toMillis?.() || 0));
      setCompletedMatches(list);
    });
    return () => unsub();
  }, [currentUser, therapistNameMap]);

  // 내 활성 채팅 가져와서 뱃지용 세트 구성(인덱스 의존 최소화 - parentId 단일 조건)
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, 'chats'), where('parentId', '==', currentUser.uid)));
        const activeSet = new Set<string>();
        snap.forEach((d) => {
          const data = d.data() as { status?: string; therapistId?: string };
          if (data.status === 'active' && typeof data.therapistId === 'string') {
            activeSet.add(data.therapistId);
          }
        });
        setActiveChatTherapistIds(activeSet);
      } catch {}
    })();
  }, [currentUser]);

  const openWrite = (therapistId: string) => {
    // 치료사 계정 체크
    if (isTherapist) {
      window.confirm(
        '⚠️ 치료사 계정은 후기를 작성할 수 없습니다.\n\n후기는 학부모님들만 작성하실 수 있습니다.\n치료사분들은 후기를 받는 입장이십니다.'
      );
      return;
    }
    
    const name = therapistNameMap[therapistId] || '치료사';
    setWriteTarget({ therapistId, therapistName: name });
    setWriteClosing(false);
    setWriteOpen(true);
  };

  const submitTherapistReview = async (payload: { rating: number; content: string }) => {
    if (!currentUser || !writeTarget) return;
    try {
      setSubmitting(true);
      await addDoc(collection(db, 'therapist-reviews'), {
        parentId: currentUser.uid,
        therapistId: writeTarget.therapistId,
        therapistName: writeTarget.therapistName,
        rating: payload.rating,
        content: payload.content,
        createdAt: serverTimestamp()
      });

      // 치료사 프로필 평점/리뷰수 집계 업데이트 (트랜잭션)
      await runTransaction(db, async (tx) => {
        const profileRef = doc(db, 'therapistProfiles', writeTarget.therapistId);
        const snap = await tx.get(profileRef);
        if (!snap.exists()) {
          // 프로필 문서가 없으면 집계 스킵 (권한 충돌 방지)
          return;
        }
        const data = snap.data() as { reviewCount?: number; rating?: number };
        const prevCount = Number(data.reviewCount || 0);
        const prevRating = Number(data.rating || 0);
        const newCount = prevCount + 1;
        const newRatingRaw = (prevRating * prevCount + payload.rating) / newCount;
        const newRating = Math.round(newRatingRaw * 10) / 10; // 소수점 1자리 반올림
        tx.update(profileRef, { reviewCount: newCount, rating: newRating, updatedAt: serverTimestamp() });
      });
      alert('후기가 등록되었습니다. 감사합니다!');
      setWriteOpen(false);
      setWriteTarget(null);
    } catch (e) {
      console.error('후기 등록 실패:', e);
      alert('후기 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 상단 헤더 영역 */}
        <div className="mb-4">
          <button onClick={() => history.back()} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
            <span>◀</span>
            <span>마이페이지로 돌아가기</span>
          </button>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <h1 className="text-2xl font-bold text-gray-900">후기 및 인터뷰권 관리</h1>
          </div>
        </div>

        {/* 인터뷰권 카드 */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">보유 인터뷰권</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center justify-between"><span>이용권 기본 제공:</span><span className="font-semibold">{tokenInfo.base} 회</span></div>
            <div className="flex items-center justify-between"><span>후기 작성 보상:</span><span className="font-semibold">{tokenInfo.bonus} 회</span></div>
          </div>
          <div className="mt-4 border-t pt-4 flex items-center justify-between">
            <span className="text-gray-900 font-semibold">총 사용 가능</span>
            <span className="text-3xl font-bold text-blue-600">{tokenInfo.total} 회</span>
          </div>
          <div className="mt-3 text-[11px] text-gray-500 bg-gray-50 rounded-lg p-3 text-center">
            * 사용하지 않은 인터뷰권은 사라지지 않고 다음 이용권 구매 시 자동으로 합산됩니다.
          </div>
        </div>

        {/* 완료된 매칭 목록 (후기 작성 진입) */}
        {currentUser && (
          <div className="bg-white rounded-xl shadow-sm border mb-6">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">완료된 매칭 (후기 작성)</h2>
              <span className="text-sm text-gray-500">총 {completedMatches.length}건</span>
            </div>
            {completedMatches.length === 0 ? (
              <div className="p-6 text-center text-gray-500">완료된 매칭이 없습니다</div>
            ) : (
              <ul className="divide-y">
                {completedMatches.map((m) => (
                  <li key={m.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`font-medium text-gray-900 ${isTherapist ? 'cursor-not-allowed' : 'cursor-pointer hover:text-blue-600'}`}
                        onClick={() => !isTherapist && openWrite(m.therapistId)}
                      >
                        {therapistNameMap[m.therapistId] || '치료사'}
                      </div>
                      {activeChatTherapistIds.has(m.therapistId) && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">채팅중</span>
                      )}
                    </div>
                    <button 
                      onClick={() => openWrite(m.therapistId)} 
                      disabled={isTherapist}
                      className={`px-3 py-1.5 text-sm rounded-md ${
                        isTherapist 
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      title={isTherapist ? '치료사 계정은 후기를 작성할 수 없습니다' : ''}
                    >
                      후기 작성
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 내가 작성한 후기 */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="font-semibold text-gray-900">내가 작성한 후기 (총 {reviews.length}건)</h2>
          </div>
          {reviews.length + therapistReviews.length === 0 ? (
            <div className="p-6 text-center text-gray-500">작성한 후기가 없습니다</div>
          ) : (
            <ul className="divide-y">
              {[...reviews, ...therapistReviews].map((r) => (
                <li key={r.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="pr-3">
                      <div className="font-semibold text-gray-900 mb-1">{r.title || '후기'}</div>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
                        {'★'.repeat(r.rating || 0)}{'☆'.repeat(Math.max(0,5-(r.rating||0)))}
                      </div>
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed line-clamp-3">{r.content}</p>
                      <div className="text-xs text-gray-400">{r.createdAt ? r.createdAt.toDate().toLocaleDateString('ko-KR') : ''}</div>
                    </div>
                    <span className="ml-4 h-fit inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">인터뷰권 +1 증정</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 지원자 후기는 별도 섹션 없이 '내가 작성한 후기' 목록에 함께 포함 */}
      </div>

      {/* 후기 작성 모달 (단순화: 별점 + 내용, 치료사명 프리필) */}
      {writeOpen && writeTarget && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${writeClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div className={`bg-white rounded-lg p-8 max-w-4xl w-[85vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto ${writeClosing ? 'animate-scale-out' : 'animate-scale-in'}`}>
            <div className="text-center mb-8 relative">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">소중한 후기를 남겨주세요</h2>
              <p className="text-sm text-gray-600">다른 학부모님에게 큰 도움이 됩니다.</p>
              <button onClick={() => { if (!submitting) { setWriteClosing(true); setTimeout(() => { setWriteOpen(false); setWriteTarget(null); setWriteClosing(false); }, 300); } }} className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-600 transition-colors">
                <span className="text-2xl">×</span>
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600 text-sm">👤</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{writeTarget.therapistName} 치료사</div>
                <div className="text-sm text-gray-600">후기 대상 치료사</div>
              </div>
            </div>
            <TherapistReviewForm onSubmit={submitTherapistReview} submitting={submitting} />
          </div>
        </div>
      )}
    </div>
  );
}

function TherapistReviewForm({ onSubmit, submitting }: { onSubmit: (p: { rating: number; content: string }) => void; submitting: boolean; }) {
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).slice(0, Math.max(0, 3 - images.length));
      setImages((prev) => [...prev, ...newFiles]);
    }
  };
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || selectedTags.length === 0 || content.trim().length < 30) {
      alert('별점, 좋았던 점 선택, 30자 이상의 내용을 입력해 주세요.');
      return;
    }
    onSubmit({ rating, content });
  };

  return (
    <form onSubmit={handleSend} className="space-y-6">
      {/* 별점 - 중앙 큰 별 스타일 */}
      <div>
        <label className="block text-base font-medium text-gray-900 mb-4">수업은 만족스러우셨나요?</label>
        <div className="flex justify-center gap-2 mb-2">
          {[1,2,3,4,5].map(star => (
            <button key={star} type="button" onClick={() => setRating(star)} className={`text-3xl transition-all duration-200 hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-gray-400'}`}>★</button>
          ))}
        </div>
      </div>

      {/* 좋았던 점 태그 */}
      <div>
        <label className="block text-base font-medium text-gray-900 mb-4">어떤 점이 좋았나요? <span className="text-sm text-gray-500">(중복 선택 가능)</span></label>
        <div className="flex flex-wrap gap-2">
          {['친절해요','체계적이에요','시간 약속을 잘 지켜요','아이가 좋아해요','꼼꼼한 피드백','준비가 철저해요'].map(tag => {
            const active = selectedTags.includes(tag);
            return (
              <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${active ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}`}>{tag}</button>
            );
          })}
        </div>
      </div>

      {/* 안내 박스 */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-center">
        <p className="text-sm text-black">후기 2건 작성 시 <span className="text-blue-600 font-semibold">인터뷰권 1회</span>가 증정됩니다! <span className="font-extrabold">(회원당 최대 3회)</span></p>
        <p className="text-xs text-black mt-1">단, 후기는 최소 30자 이상 작성해주셔야 해요.</p>
      </div>

      {/* 상세 후기 */}
      <div>
        <label className="block text-base font-medium text-gray-900 mb-3">상세한 후기를 남겨주세요</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm transition-all duration-200" placeholder="수업을 통해 아이가 어떻게 변화했는지, 어떤 점이 특히 만족스러웠는지 등을 자세히 알려주세요." />
        <div className={`mt-1 text-xs ${content.trim().length < 30 ? 'text-red-500' : 'text-gray-500'}`}>최소 30자 이상 (현재 {content.trim().length}자)</div>
      </div>

      {/* 사진 첨부 (선택, 최대 3개) */}
      <div>
        <label className="block text-base font-medium text-gray-900 mb-3">사진 첨부 <span className="text-sm text-gray-500">(선택, 최대 3개)</span></label>
        {images.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-3">
            {images.map((file, index) => (
              <div key={index} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(file)} alt={`업로드된 이미지 ${index+1}`} className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100">×</button>
              </div>
            ))}
          </div>
        )}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
          <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" id="therapist-review-image-upload" />
          <label htmlFor="therapist-review-image-upload" className="cursor-pointer">
            <div className="text-gray-400 mb-2 text-2xl">📷</div>
            <div className="text-sm text-gray-600">클릭하여 이미지 업로드 ({images.length}개 선택됨)</div>
          </label>
        </div>
      </div>

      {/* 등록 버튼 */}
      <div className="pt-2">
        <button type="submit" disabled={submitting || rating === 0 || selectedTags.length === 0 || content.trim().length < 30} className={`w-full py-3 text-white text-lg font-medium rounded-lg transition-all duration-200 ${submitting || rating === 0 || selectedTags.length === 0 || content.trim().length < 30 ? 'bg-cyan-300 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-600 hover:scale-[1.02] active:scale-[0.98]'}`}>{submitting ? '등록 중…' : '후기 등록하기'}</button>
      </div>
    </form>
  );
}


