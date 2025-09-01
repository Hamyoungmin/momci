'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AdminStats {
  urgentReports: number;
  pendingTasks: number;
  activeUsers: number;
  loading: boolean;
}

export function useAdminStats(): AdminStats {
  const [stats, setStats] = useState<AdminStats>({
    urgentReports: 0,
    pendingTasks: 0,
    activeUsers: 0,
    loading: true,
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];
    let loadingTimeout: NodeJS.Timeout;

    const initializeStats = async () => {
      try {
        // 활성 사용자 수 (최근 5분 이내 활동)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const activeUsersQuery = query(
          collection(db, 'userSessions'),
          where('lastActivity', '>=', fiveMinutesAgo),
          where('isActive', '==', true)
        );

        // 활성 사용자 수 실시간 감시
        const unsubActiveUsers = onSnapshot(
          activeUsersQuery,
          (snapshot) => {
            setStats(prev => ({
              ...prev,
              activeUsers: snapshot.size,
              loading: false
            }));
            setHasError(false);
          },
          (error) => {
            console.error('활성 사용자 데이터 로딩 실패:', error);
            // 오류 발생 시 폴백 데이터 사용
            setStats(prev => ({
              ...prev,
              activeUsers: 1, // 현재 사용자 자신만 카운트
              loading: false
            }));
            setHasError(true);
          }
        );
        unsubscribers.push(unsubActiveUsers);

        // 다른 컬렉션들은 존재할 때만 쿼리 (선택적)
        try {
          // 긴급 신고 수 (컬렉션이 없을 수 있음)
          const urgentReportsQuery = query(
            collection(db, 'reports'),
            where('status', '==', 'pending'),
            where('priority', '==', 'urgent')
          );

          const unsubUrgentReports = onSnapshot(
            urgentReportsQuery,
            (snapshot) => {
              setStats(prev => ({
                ...prev,
                urgentReports: snapshot.size
              }));
            },
            (error) => {
              console.warn('긴급 신고 데이터 사용 불가:', error.message);
              // 컬렉션이 없어도 계속 진행
            }
          );
          unsubscribers.push(unsubUrgentReports);
        } catch (error) {
          console.warn('reports 컬렉션 사용 불가:', error);
        }

        // 처리 대기 건수 (여러 컬렉션에서 수집)
        const collectionNames = ['profileSubmissions', 'inquiries', 'payments', 'reports'];
        let totalPending = 0;
        let completedQueries = 0;

        collectionNames.forEach(collectionName => {
          try {
            const pendingQuery = query(
              collection(db, collectionName),
              where('status', '==', 'pending')
            );

            const unsubPending = onSnapshot(
              pendingQuery,
              (snapshot) => {
                totalPending += snapshot.size;
                completedQueries++;
                
                // 모든 컬렉션 확인 완료 시 업데이트
                if (completedQueries === collectionNames.length) {
                  setStats(prev => ({
                    ...prev,
                    pendingTasks: totalPending
                  }));
                  totalPending = 0;
                  completedQueries = 0;
                }
              },
              (error) => {
                console.warn(`${collectionName} 컬렉션 사용 불가:`, error.message);
                completedQueries++;
                // 오류가 나도 계속 진행
                if (completedQueries === collectionNames.length) {
                  totalPending = 0;
                  completedQueries = 0;
                }
              }
            );
            unsubscribers.push(unsubPending);
          } catch (error) {
            console.warn(`${collectionName} 컬렉션 초기화 실패:`, error);
            completedQueries++;
          }
        });

      } catch (error) {
        console.error('Firebase 연결 실패:', error);
        // 완전한 오류 시 폴백 데이터 사용
        setStats({
          urgentReports: 0,
          pendingTasks: 0,
          activeUsers: 1,
          loading: false
        });
        setHasError(true);
      }

      // 로딩 타임아웃 (3초 후 강제 완료)
      loadingTimeout = setTimeout(() => {
        setStats(prev => ({
          ...prev,
          loading: false
        }));
      }, 3000);
    };

    initializeStats();

    // 클린업
    return () => {
      unsubscribers.forEach(unsub => unsub());
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, []);

  return stats;
}

// 백업용 가짜 데이터 (Firebase 오류 시)
export function useFallbackAdminStats(): AdminStats {
  const [stats] = useState<AdminStats>({
    urgentReports: 0,
    pendingTasks: 0,
    activeUsers: 1, // 현재 관리자 자신
    loading: false,
  });

  return stats;
}
