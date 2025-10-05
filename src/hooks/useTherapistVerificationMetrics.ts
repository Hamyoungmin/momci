import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TherapistVerificationMetrics {
  totalMatches: number;
  reviewCount: number;
  averageRating: number;
  meetsCriteria: boolean;
  loading: boolean;
  error?: string;
}

/**
 * 치료사 인증 조건 계산 훅
 * 조건: 매칭 성공 3회 이상 AND 후기 2개 이상 AND 평균 별점 4.5 이상
 * - 성공 매칭: successful-matches 컬렉션에서 therapistId == uid
 * - 후기: therapist-reviews 컬렉션에서 therapistId == uid
 * 또한 계산된 요약값을 users 및 therapistProfiles 문서에 동기화하여
 * 보안 규칙 기반 자동 인증이 가능하도록 합니다.
 */
export function useTherapistVerificationMetrics(userId: string | undefined) {
  const [state, setState] = useState<TherapistVerificationMetrics>({
    totalMatches: 0,
    reviewCount: 0,
    averageRating: 0,
    meetsCriteria: false,
    loading: !!userId,
  });

  useEffect(() => {
    if (!userId) return;
    const uid = userId as string; // 위 가드로 보장됨

    // 실시간 스냅샷 구독
    let cancelled = false;

    const matchesQ = query(
      collection(db, 'successful-matches'),
      where('therapistId', '==', uid)
    );

    const reviewsQ = query(
      collection(db, 'therapist-reviews'),
      where('therapistId', '==', uid)
    );

    let totalMatches = 0;
    let reviewCount = 0;
    let averageRating = 0;

    async function syncSummaries() {
      const meets = totalMatches >= 3 && reviewCount >= 2 && averageRating >= 4.5;
      if (cancelled) return;
      setState({ totalMatches, reviewCount, averageRating, meetsCriteria: meets, loading: false });

      // 요약값 동기화 (실패해도 무시)
      try {
        await updateDoc(doc(db, 'users', uid), {
          totalMatches,
          reviewCount,
          rating: averageRating,
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn('users 동기화 실패(무시 가능):', e);
      }

      try {
        const profilesQ = query(
          collection(db, 'therapistProfiles'),
          where('userId', '==', uid),
          limit(1)
        );
        const profilesSnap = await getDocs(profilesQ);
        if (!profilesSnap.empty) {
          const profRef = profilesSnap.docs[0].ref;
          await updateDoc(profRef, {
            reviewCount,
            rating: averageRating,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (e) {
        console.warn('therapistProfiles 동기화 실패(무시 가능):', e);
      }
    }

    const unsubMatches = onSnapshot(matchesQ, (snap) => {
      totalMatches = snap.size || 0;
      syncSummaries();
    }, (err) => {
      console.warn('successful-matches 구독 실패:', err);
      setState((s) => ({ ...s, loading: false, error: '매칭 데이터 구독 실패' }));
    });

    const unsubReviews = onSnapshot(reviewsQ, (snap) => {
      reviewCount = snap.size || 0;
      let sum = 0;
      snap.forEach((d) => { sum += ((d.data()?.rating as number) || 0); });
      averageRating = reviewCount > 0 ? Number((sum / reviewCount).toFixed(1)) : 0;
      syncSummaries();
    }, (err) => {
      console.warn('therapist-reviews 구독 실패:', err);
      setState((s) => ({ ...s, loading: false, error: '후기 데이터 구독 실패' }));
    });

    return () => {
      cancelled = true;
      unsubMatches();
      unsubReviews();
    };
  }, [userId]);

  return state;
}

/**
 * 조건 충족 시 자동 인증 부여 시도
 * 규칙: users 문서에 isVerified/certificationBadge/verifiedAt, therapistProfiles에도 isVerified 반영
 * ✅ 조건 검증: 매칭 3회 이상 AND 후기 2개 이상 AND 평균 별점 4.5 이상
 */
export async function tryAutoVerifyTherapist(userId: string) {
  try {
    // ✅ 1. 먼저 실제 조건을 충족하는지 검증
    const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', userId), limit(1)));
    if (userDoc.empty) {
      console.warn('❌ 사용자를 찾을 수 없습니다.');
      return;
    }
    
    const userData = userDoc.docs[0].data();
    const totalMatches = userData?.totalMatches || 0;
    const reviewCount = userData?.reviewCount || 0;
    const rating = userData?.rating || 0;
    
    // ✅ 조건 미충족 시 중단
    if (totalMatches < 3 || reviewCount < 2 || rating < 4.5) {
      console.log(`❌ 자동 인증 조건 미충족: 매칭 ${totalMatches}/3, 후기 ${reviewCount}/2, 별점 ${rating}/4.5`);
      return;
    }
    
    console.log(`✅ 자동 인증 조건 충족! 매칭 ${totalMatches}, 후기 ${reviewCount}, 별점 ${rating}`);
    
    // ✅ 2. 조건 충족 시에만 users 문서 업데이트
    await updateDoc(doc(db, 'users', userId), {
      isVerified: true,
      certificationBadge: 'certified',
      verifiedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    console.log('✅ users 컬렉션 인증 완료');
  } catch (e) {
    console.warn('users 자동 인증 반영 실패:', e);
  }

  try {
    // ✅ 3. therapistProfiles 대표 문서에도 반영
    const profilesQ = query(
      collection(db, 'therapistProfiles'),
      where('userId', '==', userId),
      limit(1)
    );
    const snap = await getDocs(profilesQ);
    if (!snap.empty) {
      await updateDoc(snap.docs[0].ref, {
        isVerified: true,
        verifiedAt: serverTimestamp(),
      });
      console.log('✅ therapistProfiles 컬렉션 인증 완료');
    }
  } catch (e) {
    console.warn('therapistProfiles 자동 인증 반영 실패:', e);
  }
}


