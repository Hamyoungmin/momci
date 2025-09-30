'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  subscriptionType: 'parent' | 'therapist' | 'none';
  expiryDate: Date | null;
  planName: string | null;
  remainingInterviews?: number;
  totalInterviews?: number;
}

interface UsageHistory {
  id: string;
  therapistName: string;
  action: 'chat_started' | 'chat_cancelled';
  date: Date;
  status: 'completed' | 'cancelled';
}


function SubscriptionManagementContent() {
  const { currentUser, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    hasActiveSubscription: false,
    subscriptionType: 'none',
    expiryDate: null,
    planName: null
  });
  const [remainingTokens, setRemainingTokens] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [usageHistory, setUsageHistory] = useState<UsageHistory[]>([]);

  // 사용자 타입 확인 및 접근 제한
  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }
      
      if (userData) {
        // 쿼리 파라미터로 전달된 타입과 사용자 타입이 일치하는지 확인
        const requestedType = searchParams.get('type') || userData.userType;
        
        if (userData.userType !== requestedType) {
          alert('해당 이용권 관리 페이지에 접근할 권한이 없습니다.');
          router.push('/mypage');
          return;
        }
        
        if (!['parent', 'therapist'].includes(userData.userType)) {
          alert('접근 권한이 없습니다.');
          router.push('/');
          return;
        }
      }
    }
  }, [currentUser, userData, authLoading, router, searchParams]);

  // 이용권 정보 및 설정 로딩 (실시간 감지)
  useEffect(() => {
    if (!currentUser || !userData || authLoading) return;

    let unsubscribeSubscription: (() => void) | null = null;
    let unsubscribeUsageHistory: (() => void) | null = null;

    const setupRealtimeData = async () => {
      try {
        // 1. 이용권 상태 실시간 감지
        unsubscribeSubscription = onSnapshot(
          doc(db, 'user-subscription-status', currentUser.uid),
          (subscriptionDoc) => {
            if (subscriptionDoc.exists()) {
              const data = subscriptionDoc.data();
              setSubscription({
                hasActiveSubscription: data.hasActiveSubscription || false,
                subscriptionType: data.subscriptionType || 'none',
                expiryDate: data.expiryDate ? data.expiryDate.toDate() : null,
                planName: data.planName || null,
                remainingInterviews: data.remainingInterviews || 0,
                totalInterviews: data.totalInterviews || 0
              });
            } else {
              // 이용권이 없는 기본 상태 (실제 구매 시에만 활성화)
              setSubscription({
                hasActiveSubscription: false,
                subscriptionType: 'none',
                expiryDate: null,
                planName: null,
                remainingInterviews: 0,
                totalInterviews: 0
              });
            }
          },
          (error) => {
            console.error('이용권 상태 실시간 감지 오류:', error);
            // 에러 발생 시 기본 상태로 설정
            setSubscription({
              hasActiveSubscription: false,
              subscriptionType: 'none',
              expiryDate: null,
              planName: null
            });
          }
        );

        // 1-2. 사용자 인터뷰권(토큰) 잔여 수 실시간 감지
        const unUser = onSnapshot(
          doc(db, 'users', currentUser.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              const data = userDoc.data() as { interviewTokens?: number };
              setRemainingTokens(data.interviewTokens ?? 0);
            } else {
              setRemainingTokens(0);
            }
          },
          () => setRemainingTokens(0)
        );
        // 구독 해제 시 함께 해제되도록 래핑
        const prevUnsub = unsubscribeSubscription;
        unsubscribeSubscription = () => {
          if (prevUnsub) {
            prevUnsub();
          }
          if (unUser) {
            unUser();
          }
        };

        // 2. 학부모용 사용 내역 실시간 감지
        if (userData.userType === 'parent') {
          try {
            const usageQuery = query(
              collection(db, 'subscription-usage-history'),
              where('userId', '==', currentUser.uid),
              orderBy('createdAt', 'desc'),
              limit(10)
            );

            unsubscribeUsageHistory = onSnapshot(usageQuery, (snapshot) => {
              const history: UsageHistory[] = [];
              snapshot.forEach((doc) => {
                const data = doc.data();
                history.push({
                  id: doc.id,
                  therapistName: data.therapistName || '알 수 없는 치료사',
                  action: data.action || 'chat_started',
                  date: data.createdAt ? data.createdAt.toDate() : new Date(),
                  status: data.status || 'completed'
                });
              });
              setUsageHistory(history);
            }, (error) => {
              console.error('사용 내역 실시간 감지 오류:', error);
              // 에러 시 빈 배열로 설정
              setUsageHistory([]);
            });
          } catch (error) {
            console.error('사용 내역 쿼리 설정 실패:', error);
            // 쿼리 실패 시 빈 배열로 설정
            setUsageHistory([]);
          }
        }

        // 3. 추가 설정이 필요한 경우 여기에 추가
      } catch (error) {
        console.error('데이터 설정 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    setupRealtimeData();

    // 클린업 함수
    return () => {
      if (unsubscribeSubscription) {
        unsubscribeSubscription();
      }
      if (unsubscribeUsageHistory) {
        unsubscribeUsageHistory();
      }
    };
  }, [authLoading, currentUser, userData]);

  const handlePurchase = (planType: '1month' | '3month') => {
    const targetPath = userData?.userType === 'parent' ? '/parent-payment' : '/teacher-payment';
    router.push(`${targetPath}?plan=${planType}`);
  };

  const handleExtend = () => {
    const targetPath = userData?.userType === 'parent' ? '/parent-payment' : '/teacher-payment';
    router.push(targetPath);
  };

  const handleMenuClick = (path: string) => {
    router.push(path);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">사용자 정보를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 접근 권한 체크
  if (!currentUser || !userData || !['parent', 'therapist'].includes(userData.userType)) {
    return null;
  }

  // 쿼리 파라미터와 사용자 타입 일치 여부 확인
  const requestedType = searchParams.get('type') || userData.userType;
  if (userData.userType !== requestedType) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">이용권 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const userTypeTitle = userData.userType === 'parent' ? '학부모님' : '치료사';

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-2xl mx-auto px-8">
        {/* 프로필 헤더 */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-lg font-bold">
                {userData?.name?.charAt(0) || currentUser.email?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-gray-900">
                {userData?.name || '김00'} {userTypeTitle}
              </h2>
              <p className="text-sm text-blue-500">
                {userData.userType === 'parent' ? '학부별 이용 학부모' : '전문별 이용 전문가'}
              </p>
            </div>
          </div>

          {/* 메뉴 섹션 */}
          <div className="space-y-1">
            {/* 이용권 관리 - 현재 페이지라서 활성화 표시 */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-blue-500 text-base">💳</span>
                <span className="text-base font-medium text-blue-600">이용권 관리</span>
              </div>
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>

            {/* 회원정보 수정 */}
            <div 
              onClick={() => handleMenuClick('/profile/edit')}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-gray-500 text-base">👤</span>
                <span className="text-base font-medium text-gray-900">회원정보 수정</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* 나의 이용권 현황 */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-900 mb-3 px-1">나의 이용권 현황</h2>
          
          {subscription.hasActiveSubscription ? (
            // 이용권 활성 상태
            <div className="bg-blue-500 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-bold mb-1">{subscription.planName || '1개월 이용권'}</h3>
                  <p className="text-blue-100 text-sm mb-1">
                    만료일: {subscription.expiryDate ? 
                      subscription.expiryDate.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }) : '2025.10.15'} {userData?.userType === 'parent' && subscription.expiryDate ? 
                        `(${Math.ceil((subscription.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}일 남음)` : 
                        '(예정)'}
                  </p>
                  {userData?.userType === 'parent' && (
                    <p className="text-blue-100 text-sm">
                      남은 인터뷰권: {remainingTokens}개
                    </p>
                  )}
                </div>
                <button 
                  onClick={handleExtend}
                  className="bg-white text-blue-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  이용권 연장하기
                </button>
              </div>
            </div>
          ) : (
            // 이용권 없음 상태
            <div className="bg-gray-100 rounded-xl p-5 text-gray-600 border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold mb-1 text-gray-800">이용권이 없습니다</h3>
                  <p className="text-gray-500 text-sm">
                    이용권을 구매하여 플랫폼을 이용해보세요
                  </p>
                </div>
                <button 
                  onClick={() => handlePurchase('3month')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  이용권 구매하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 안내 문구 - 이용권 만료/인터뷰권 정책 */}
        {userData?.userType === 'parent' && (
          <div className="mb-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <div className="text-yellow-500 pt-0.5">💡</div>
                <div>
                  <p className="mb-1">이용권 기간이 만료되어도 남은 인터뷰권은 사라지지 않습니다.</p>
                  <p><span className="text-blue-600 font-medium">단, 인터뷰권을 사용하시려면 이용권이 활성화된 상태여야 합니다.</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 이용권 사용 내역 - 학부모용만 표시 */}
        {userData?.userType === 'parent' && (
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-900 mb-3 px-1">이용권 사용 내역</h2>
            
            <div className="bg-white rounded-xl shadow-sm">
              {usageHistory.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-4xl text-gray-300 mb-2">📋</div>
                  <p className="text-gray-500">사용 내역이 없습니다</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {usageHistory.map((usage) => (
                    <div key={usage.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 mb-1">
                            {usage.therapistName} {usage.action === 'chat_started' ? '채팅 시작' : '채팅 취소'}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {usage.date.toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })} {usage.date.toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            usage.status === 'completed' 
                              ? 'bg-gray-100 text-gray-600' 
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {usage.status === 'completed' ? '사용 완료' : '취소 완료'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 이용권 구매 */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-900 mb-3 px-1">
            {userData?.userType === 'parent' ? '이용권 추가 구매' : '전문가 이용권 구매'}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* 1개월 이용권 */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-center">
                <div className="font-medium text-gray-900 text-sm mb-2">1개월 이용권</div>
                <div className="text-lg font-bold text-blue-500 mb-1">
                  {userData?.userType === 'parent' ? '9,900' : '19,900'}<span className="text-sm">원</span>
                </div>
                <div className="text-xs text-gray-400 mb-4">
                  {userData?.userType === 'parent' ? '2회 무료 인터뷰' : '프로필 노출 및 지원'}
                </div>
                <button 
                  onClick={() => handlePurchase('1month')}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                >
                  구매하기
                </button>
              </div>
            </div>

            {/* 3개월 이용권 */}
            <div className="bg-white border-2 border-blue-400 rounded-xl p-4 relative">
              {/* 추천 배지 */}
              <div className="absolute -top-2 left-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                추천
              </div>
              
              <div className="text-center">
                <div className="font-medium text-gray-900 text-sm mb-2">3개월 이용권</div>
                <div className="text-lg font-bold text-blue-500 mb-1">
                  {userData?.userType === 'parent' ? '24,900' : '49,900'}<span className="text-sm">원</span>
                  <span className="text-red-500 text-xs ml-1 line-through">
                    {userData?.userType === 'parent' ? '29,700원' : '59,700원'}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mb-4">
                  {userData?.userType === 'parent' ? '6회 무료 인터뷰' : '프로필 노출 및 지원'}
                </div>
                <button 
                  onClick={() => handlePurchase('3month')}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
                >
                  구매하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionManagementPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">페이지를 불러오는 중...</p>
        </div>
      </div>
    }>
      <SubscriptionManagementContent />
    </Suspense>
  );
}
