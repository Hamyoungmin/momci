'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, setDoc, updateDoc, increment, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentData {
  planType: '1month' | '3month';
  planName: string;
  price: number;
  benefits: string;
  userType: 'parent' | 'therapist';
}


function PaymentCheckoutContent() {
  const { currentUser, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const paymentMethod = 'bank'; // 무통장입금만 지원
  const [isProcessing, setIsProcessing] = useState(false);

  // URL 파라미터에서 결제 정보 가져오기
  useEffect(() => {
    const planType = searchParams.get('plan') as '1month' | '3month';
    const planName = searchParams.get('planName');
    const price = searchParams.get('price');
    const benefits = searchParams.get('benefits');
    const userType = searchParams.get('userType') as 'parent' | 'therapist';

    if (planType && planName && price && benefits && userType) {
      setPaymentData({
        planType,
        planName,
        price: parseInt(price),
        benefits,
        userType
      });
    } else {
      // 파라미터가 없으면 이전 페이지로 돌아가기
      router.back();
    }
  }, [searchParams, router]);

  // 결제 데이터가 로드되면 loading 완료
  useEffect(() => {
    if (paymentData) {
      setLoading(false);
    }
  }, [paymentData]);

  // 접근 권한 확인
  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }
      
      if (userData && paymentData && userData.userType !== paymentData.userType) {
        alert('접근 권한이 없습니다.');
        router.push('/');
        return;
      }
    }
  }, [currentUser, userData, authLoading, paymentData, router]);

  const handlePaymentComplete = async () => {
    if (!paymentData || !currentUser || !userData) return;
    
    setIsProcessing(true);
    
    try {
      // 결제 완료 시 이용권 상태 업데이트
      const planDuration = paymentData.planType === '3month' ? 90 : 30; // 일 수
      const expiryDate = new Date(Date.now() + planDuration * 24 * 60 * 60 * 1000);
      
      const totalInterviews = paymentData.userType === 'parent' 
        ? (paymentData.planType === '3month' ? 6 : 2)
        : 0; // 치료사는 인터뷰 횟수 없음
      
      await setDoc(doc(db, 'user-subscription-status', currentUser.uid), {
        userId: currentUser.uid,
        hasActiveSubscription: true,
        subscriptionType: paymentData.userType,
        expiryDate: Timestamp.fromDate(expiryDate),
        planName: paymentData.planName,
        lastUpdated: Timestamp.now(),
        purchaseDate: Timestamp.now(),
        amount: paymentData.price,
        remainingInterviews: totalInterviews,
        totalInterviews: totalInterviews,
        paymentMethod: paymentMethod
      });

      // 학부모 구매 시 인터뷰권 부여 (1개월=2회, 3개월=6회)
      if (paymentData.userType === 'parent' && totalInterviews > 0) {
        try {
          await updateDoc(doc(db, 'users', currentUser.uid), {
            interviewTokens: increment(totalInterviews),
            lastTokenAdded: Timestamp.now()
          });
        } catch (e) {
          console.warn('인터뷰권 부여 실패(관리자 확인 필요):', e);
        }
      }

      alert('결제가 완료되었습니다! 이용권이 활성화되었습니다.');
      
      // 결제 완료 후 이동할 페이지
      const redirectPath = paymentData.userType === 'parent' 
        ? '/subscription-management?type=parent'
        : '/subscription-management?type=therapist';
      
      router.push(redirectPath);
      
    } catch (error) {
      console.error('결제 처리 실패:', error);
      alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading || loading || !paymentData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">결제 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !userData) {
    return null;
  }

  const userTypeTitle = paymentData.userType === 'parent' ? '학부모' : '치료사';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">결제하기</h1>
          <p className="text-gray-600">{userTypeTitle} 이용권 결제를 완료해주세요</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* 주문 정보 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">주문 정보</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{paymentData.planName}</h3>
                  <p className="text-gray-600">{paymentData.benefits}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {paymentData.price.toLocaleString()}원
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">총 결제 금액</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {paymentData.price.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 결제 방법 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">결제 방법</h2>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="font-medium text-blue-900">무통장입금</span>
                </div>
              </div>
            </div>
          </div>


          {/* 결제 버튼 */}
          <div className="space-y-4">
            <button 
              onClick={handlePaymentComplete}
              disabled={isProcessing}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                isProcessing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 transform hover:scale-105'
              } text-white shadow-lg`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>결제 처리 중...</span>
                </div>
              ) : (
                '입금 완료 확인'
              )}
            </button>
            
            <button 
              onClick={() => router.back()}
              className="w-full py-3 px-6 rounded-xl font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              이전으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">결제 페이지를 불러오는 중...</p>
        </div>
      </div>
    }>
      <PaymentCheckoutContent />
    </Suspense>
  );
}
