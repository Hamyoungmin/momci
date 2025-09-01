'use client';

import { useEffect } from 'react';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';

/**
 * 사용자 세션을 실시간으로 추적하는 훅
 * 페이지 진입/이탈시 Firestore에 세션 정보를 업데이트합니다.
 */
export function useUserSession() {
  const { currentUser } = useAuth();

  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window === 'undefined') return;
    if (!currentUser) return;

    const sessionId = `${currentUser.uid}_${Date.now()}`;
    const sessionRef = doc(db, 'userSessions', sessionId);

    // 세션 시작 기록
    const startSession = async () => {
      try {
        await setDoc(sessionRef, {
          userId: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || '익명',
          lastActivity: serverTimestamp(),
          isActive: true,
          sessionStart: serverTimestamp(),
          page: window.location.pathname,
          userAgent: navigator.userAgent,
        });
      } catch (error) {
        console.error('세션 시작 기록 실패:', error);
      }
    };

    // 활동 갱신 (5분마다)
    const updateActivity = async () => {
      if (!currentUser) return;
      
      try {
        await setDoc(sessionRef, {
          lastActivity: serverTimestamp(),
          page: window.location.pathname,
        }, { merge: true });
      } catch (error) {
        console.error('활동 갱신 실패:', error);
      }
    };

    // 세션 종료
    const endSession = async () => {
      try {
        await deleteDoc(sessionRef);
      } catch (error) {
        console.error('세션 종료 기록 실패:', error);
      }
    };

    // 세션 시작
    startSession();

    // 5분마다 활동 갱신
    const activityInterval = setInterval(updateActivity, 5 * 60 * 1000);

    // 페이지 변경 시 활동 갱신
    const handleRouteChange = () => {
      updateActivity();
    };

    // 브라우저 이벤트 리스너
    const handleBeforeUnload = () => {
      // 페이지 이탈 시 세션 종료 (동기적으로 처리)
      navigator.sendBeacon(`/api/end-session`, JSON.stringify({ sessionId }));
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 페이지가 숨겨졌을 때 (다른 탭으로 이동)
        updateActivity();
      } else {
        // 페이지가 다시 보일 때
        updateActivity();
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handleRouteChange);

    // 클린업
    return () => {
      clearInterval(activityInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handleRouteChange);
      
      // 컴포넌트 언마운트 시 세션 종료
      endSession();
    };
  }, [currentUser]);
}

/**
 * 개발 환경에서만 사용하는 더미 세션 훅
 */
export function useDummyUserSession() {
  // 개발 환경에서는 아무것도 하지 않음
  return;
}
