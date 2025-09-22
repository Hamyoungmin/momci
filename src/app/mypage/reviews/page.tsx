'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, onSnapshot, orderBy, query, where, Timestamp, doc } from 'firebase/firestore';
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
  const { currentUser, loading } = useAuth();
  const [reviews, setReviews] = useState<ReviewDoc[]>([]);
  const [tokenInfo, setTokenInfo] = useState<{ base: number; bonus: number; total: number }>({ base: 0, bonus: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [therapistReviews, setTherapistReviews] = useState<ReviewDoc[]>([]);

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
    </div>
  );
}


