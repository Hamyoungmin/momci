'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentSettings {
  plans: {
    oneMonth: {
      price: number;
      name: string;
      benefits: string;
    };
    threeMonth: {
      price: number;
      originalPrice: number;
      name: string;
      benefits: string;
      discount: string;
    };
  };
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  messages: {
    depositInstruction: string;
    paymentNotice: string;
  };
}

const defaultSettings: PaymentSettings = {
  plans: {
    oneMonth: {
      price: 9900,
      name: '1개월 이용권',
      benefits: '2회 무료 인터뷰'
    },
    threeMonth: {
      price: 24900,
      originalPrice: 29700,
      name: '3개월 이용권',
      benefits: '6회 무료 인터뷰',
      discount: '16% 할인'
    }
  },
  bankInfo: {
    bankName: '모든별은행',
    accountNumber: '123-456-789012',
    accountHolder: '모든일 주식회사'
  },
  messages: {
    depositInstruction: "입금자명은 반드시 '김0맘' 학부모님 성함으로 입금해주세요.",
    paymentNotice: '입금 확인은 즉시 자동으로 처리되며, 완료 후 바로 이용권을 사용하실 수 있습니다.'
  }
};

export default function ParentPaymentPage() {
  const { currentUser, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('3month'); // 기본으로 3개월 선택
  const [settings, setSettings] = useState<PaymentSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // 사용자 타입 확인 및 접근 제한
  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        // 비로그인 사용자는 로그인 페이지로
        router.push('/auth/login');
        return;
      }
      
      if (userData && userData.userType !== 'parent') {
        // 학부모가 아닌 경우
        if (userData.userType === 'therapist') {
          // 치료사는 치료사용 결제 페이지로 (나중에 구현 예정)
          alert('치료사 계정입니다. 치료사용 이용권 페이지로 이동합니다.');
          router.push('/teacher-pricing');
        } else {
          // 기타 사용자는 메인으로
          alert('접근 권한이 없습니다.');
          router.push('/');
        }
        return;
      }
    }
  }, [currentUser, userData, authLoading, router]);

  // Firebase에서 설정 정보 가져오기 (학부모용 설정)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'system_settings', 'payment_config'));
        
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data() as PaymentSettings);
        } else {
          // Firebase에 초기 설정 자동 생성
          await setDoc(doc(db, 'system_settings', 'payment_config'), defaultSettings);
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('학부모 결제 설정 로딩 실패:', error);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    // 인증된 사용자이고 학부모인 경우에만 설정 로딩
    if (!authLoading && currentUser && userData && userData.userType === 'parent') {
      fetchSettings();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, currentUser, userData]);

  // 설정 기반으로 plans 객체 생성
  const plans = {
    '1month': {
      name: settings.plans.oneMonth.name,
      duration: settings.plans.oneMonth.benefits,
      price: settings.plans.oneMonth.price,
      originalPrice: null
    },
    '3month': {
      name: settings.plans.threeMonth.name,
      duration: settings.plans.threeMonth.benefits,
      discount: settings.plans.threeMonth.discount,
      price: settings.plans.threeMonth.price,
      originalPrice: settings.plans.threeMonth.originalPrice
    }
  };

  const selectedPlanData = plans[selectedPlan as keyof typeof plans];

  const handlePaymentComplete = async () => {
    try {
      // 결제 완료 시 이용권 상태 업데이트 (시연용)
      const planDuration = selectedPlan === '3month' ? 90 : 30; // 일 수
      const expiryDate = new Date(Date.now() + planDuration * 24 * 60 * 60 * 1000);
      const planName = selectedPlan === '3month' ? '3개월 이용권' : '1개월 이용권';
      
      const totalInterviews = selectedPlan === '3month' ? 6 : 2;
      
      await setDoc(doc(db, 'user-subscription-status', currentUser!.uid), {
        userId: currentUser!.uid,
        hasActiveSubscription: true,
        subscriptionType: 'parent',
        expiryDate: Timestamp.fromDate(expiryDate),
        planName: planName,
        lastUpdated: Timestamp.now(),
        purchaseDate: Timestamp.now(),
        amount: selectedPlanData.price,
        remainingInterviews: totalInterviews,
        totalInterviews: totalInterviews
      });

      alert('결제 신청이 완료되었습니다. 입금 확인 후 이용권이 활성화됩니다.');
      router.push('/subscription-management?type=parent');
    } catch (error) {
      console.error('이용권 상태 업데이트 실패:', error);
      alert('결제 신청은 완료되었지만, 일시적인 오류가 발생했습니다.');
      router.push('/mypage');
    }
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

  // 학부모가 아닌 경우 렌더링하지 않음 (리디렉트 처리 중)
  if (!currentUser || !userData || userData.userType !== 'parent') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">결제 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">학부모 이용권 결제</h1>
          <p className="text-gray-600">학부모는 이용권을 선택하고 결제를 완료를 처음부터 시작해주세요.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* 1. 이용권 선택 */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">1. 이용권 선택</h2>
            
            <div className="space-y-3">
              {/* 1개월 이용권 */}
              <div 
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedPlan === '1month' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan('1month')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === '1month' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {selectedPlan === '1month' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{plans['1month'].name}</div>
                      <div className="text-sm text-gray-500">{plans['1month'].duration}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {plans['1month'].price.toLocaleString()}원
                    </div>
                  </div>
                </div>
              </div>

              {/* 3개월 이용권 */}
              <div 
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all relative ${
                  selectedPlan === '3month' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan('3month')}
              >
                {/* 추천 배지 */}
                <div className="absolute -top-2 left-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  추천
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === '3month' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {selectedPlan === '3month' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{plans['3month'].name}</div>
                      <div className="text-sm text-gray-500">
                        {plans['3month'].duration} + <span className="text-red-500">{plans['3month'].discount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {plans['3month'].price.toLocaleString()}원
                    </div>
                    <div className="text-sm text-gray-400 line-through">
                      {plans['3month'].originalPrice?.toLocaleString()}원
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 최종 결제 정보 */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">2. 최종 결제 정보</h2>
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{selectedPlanData.name}</span>
                  <span className="font-medium">{selectedPlanData.price.toLocaleString()}원</span>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">최종 결제 금액</span>
                  <span className="text-xl font-bold text-blue-600">
                    {selectedPlanData.price.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 입금 계좌 안내 */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">3. 입금 계좌 안내</h2>
            
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">은행명</div>
                <div className="text-lg font-bold text-gray-900">{settings.bankInfo.bankName}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">계좌번호</div>
                <div className="text-xl font-bold text-gray-900">{settings.bankInfo.accountNumber}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">예금주</div>
                <div className="text-lg font-bold text-gray-900">{settings.bankInfo.accountHolder}</div>
              </div>
            </div>
          </div>

          {/* 안내사항 */}
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div className="text-sm text-yellow-800">
                  <strong>{settings.messages.depositInstruction}</strong>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 text-center">
              {settings.messages.paymentNotice}
            </p>
          </div>

          {/* 결제 버튼 */}
          <button 
            onClick={handlePaymentComplete}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
          >
            결제 신청 및 완료
          </button>
        </div>
      </div>
    </div>
  );
}
