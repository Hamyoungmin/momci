'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
        price: parseInt(price, 10),
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
    if (!paymentData || !currentUser) return;
    
    // 필수 정보 확인: 이니시스 v2는 구매자 이름이 필수
    const buyerName = userData?.name || currentUser.displayName || '';
    
    // 디버깅: 사용자 정보 확인
    console.log('🔍 결제 정보 디버깅:', {
      userData: userData,
      currentUser: {
        email: currentUser.email,
        displayName: currentUser.displayName,
        uid: currentUser.uid
      },
      buyerName: buyerName,
      phone: userData?.phone
    });
    
    if (!buyerName) {
      alert('결제를 위해서는 사용자 이름이 필요합니다. 프로필을 먼저 설정해주세요.');
      return;
    }

    setIsProcessing(true);
    try {
      // 1) 서버에서 주문 생성
      const prepareRes = await fetch('/api/payments/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.uid,
          amount: paymentData.price,
          name: paymentData.planName,
          planType: paymentData.planType,
          userType: paymentData.userType,
        }),
      });
      if (!prepareRes.ok) throw new Error('주문 생성 실패');
      const { merchantUid, amount, name } = await prepareRes.json();

      // 2) PortOne v2 Bridge 호출
      if (typeof window !== 'undefined' && !(window as unknown as { PortOne?: unknown }).PortOne) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.portone.io/v2/browser-sdk.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load PortOne v2 SDK'));
          document.head.appendChild(script);
        });
      }

      const PortOne = (window as unknown as { PortOne: { requestPayment: (args: Record<string, unknown>) => Promise<{ code?: string; message?: string; paymentId?: string }> } }).PortOne;
      const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID as string;
      const channelKey = process.env.NEXT_PUBLIC_KG_INICIS_CHANNEL_KEY as string;
      if (!storeId || !channelKey) {
        throw new Error('결제 설정이 누락되었습니다. (storeId/channelKey)');
      }

      // 구매자 정보 준비 (KG이니시스 v2 요구사항)
      // customer 객체 대신 최상위 레벨에 구매자 정보 추가
      const paymentParams: Record<string, unknown> = {
        storeId,
        channelKey,
        paymentId: merchantUid,
        orderName: name,
        totalAmount: amount,
        currency: 'KRW',
        payMethod: 'CARD',
      };

      // 구매자 정보 추가 (여러 방식 시도)
      const customerData = {
        name: buyerName,
        email: currentUser.email || undefined,
        phoneNumber: userData?.phone || undefined,
      };

      // 방법 1: customer 객체로
      paymentParams.customer = customerData;
      
      // 방법 2: 최상위 레벨에도 추가 (이니시스 요구사항일 가능성)
      paymentParams.customerName = buyerName;
      if (currentUser.email) paymentParams.customerEmail = currentUser.email;
      if (userData?.phone) paymentParams.customerPhoneNumber = userData.phone;

      console.log('📦 PortOne.requestPayment 호출 파라미터:', paymentParams);

      const bridgeResult = await PortOne.requestPayment(paymentParams);

      if (!bridgeResult || bridgeResult.code !== 'OK') {
        const msg = bridgeResult?.message || '결제 실패';
        throw new Error(msg);
      }

      // 3) 서버 검증 (v2: paymentId 사용)
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: bridgeResult.paymentId, merchant_uid: merchantUid }),
      });
      if (!verifyRes.ok) throw new Error('결제 검증 실패');

      alert('결제가 완료되었습니다!');
      const redirectPath = paymentData.userType === 'parent' 
        ? '/subscription-management?type=parent'
        : '/subscription-management?type=therapist';
      router.push(redirectPath);
    } catch (e) {
      console.error(e);
      alert((e as Error).message || '결제 중 오류가 발생했습니다.');
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
                  <span className="font-medium text-blue-900">신용/체크카드</span>
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
                '결제하기'
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
