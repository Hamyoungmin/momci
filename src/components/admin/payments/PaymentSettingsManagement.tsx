'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminCard from '../shared/AdminCard';
import AdminButton from '../shared/AdminButton';

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

const defaultParentSettings: PaymentSettings = {
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

const defaultTeacherSettings: PaymentSettings = {
  plans: {
    oneMonth: {
      price: 19900,
      name: '1개월 이용권',
      benefits: '프로필 노출 권한'
    },
    threeMonth: {
      price: 49900,
      originalPrice: 59700,
      name: '3개월 이용권',
      benefits: '프로필 노출 권한',
      discount: '16% 할인'
    }
  },
  bankInfo: {
    bankName: '모든별은행',
    accountNumber: '123-456-789012',
    accountHolder: '모든일 주식회사'
  },
  messages: {
    depositInstruction: "입금자명은 반드시 '김0삼' 전문가 성함으로 입금해주세요.",
    paymentNotice: '입금 확인은 즉시 자동으로 처리되며, 궁금한 점은 이용 문의를 통해주실 수 있습니다.'
  }
};

export default function PaymentSettingsManagement() {
  const [parentSettings, setParentSettings] = useState<PaymentSettings>(defaultParentSettings);
  const [teacherSettings, setTeacherSettings] = useState<PaymentSettings>(defaultTeacherSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'parent' | 'teacher'>('parent');

  useEffect(() => {
    let unsubParent: (() => void) | null = null;
    let unsubTeacher: (() => void) | null = null;
    (async () => {
      setLoading(true);
      try {
        const parentRef = doc(db, 'system_settings', 'payment_config');
        const teacherRef = doc(db, 'system_settings', 'teacher_payment_config');

        // 존재하지 않으면 기본값으로 초기화
        const [pSnap, tSnap] = await Promise.all([getDoc(parentRef), getDoc(teacherRef)]);
        if (!pSnap.exists()) await setDoc(parentRef, defaultParentSettings);
        if (!tSnap.exists()) await setDoc(teacherRef, defaultTeacherSettings);

        unsubParent = onSnapshot(parentRef, (snap) => {
          if (snap.exists()) setParentSettings(snap.data() as PaymentSettings);
        });
        unsubTeacher = onSnapshot(teacherRef, (snap) => {
          if (snap.exists()) setTeacherSettings(snap.data() as PaymentSettings);
        });
      } catch (e) {
        console.error('설정 구독 실패:', e);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (unsubParent) unsubParent();
      if (unsubTeacher) unsubTeacher();
    };
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      // 학부모 설정과 치료사 설정을 각각 저장
      await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateDoc(doc(db, 'system_settings', 'payment_config'), parentSettings as Record<string, any>),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any  
        updateDoc(doc(db, 'system_settings', 'teacher_payment_config'), teacherSettings as Record<string, any>)
      ]);
      setSuccessMessage('설정이 성공적으로 저장되었습니다!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('설정 저장 실패:', error);
      alert('설정 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const updateParentSetting = (path: string, value: string | number) => {
    setParentSettings(prevSettings => {
      const newSettings = { ...prevSettings };
      const keys = path.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const updateTeacherSetting = (path: string, value: string | number) => {
    setTeacherSettings(prevSettings => {
      const newSettings = { ...prevSettings };
      const keys = path.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentSettings = activeTab === 'parent' ? parentSettings : teacherSettings;
  const updateCurrentSetting = activeTab === 'parent' ? updateParentSetting : updateTeacherSetting;

  return (
    <div className="space-y-8">
      {/* 성공 메시지 */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <span className="ml-2 text-green-800">{successMessage}</span>
          </div>
        </div>
      )}

      {/* 탭 메뉴 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('parent')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'parent'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            학부모용 설정
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'teacher'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            치료사용 설정
          </button>
        </div>

        {/* 탭 내용 */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {activeTab === 'parent' ? '학부모용 결제 설정' : '치료사용 결제 설정'}
          </h2>
          <p className="text-gray-600 mt-1">
            {activeTab === 'parent' 
              ? '학부모가 사용할 이용권 가격과 정보를 설정합니다'
              : '치료사가 사용할 이용권 가격과 정보를 설정합니다'
            }
          </p>
        </div>
      </div>

      {/* 이용권 가격 설정 */}
      <AdminCard 
        title="이용권 가격 설정" 
        subtitle={`${activeTab === 'parent' ? '학부모' : '치료사'}용 이용권 가격을 설정합니다`}
      >
        <div className="space-y-6">
          {/* 1개월 이용권 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">1개월 이용권</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이용권명
                </label>
                <input
                  type="text"
                  value={currentSettings.plans.oneMonth.name}
                  onChange={(e) => updateCurrentSetting('plans.oneMonth.name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  가격 (원)
                </label>
                <input
                  type="number"
                  value={currentSettings.plans.oneMonth.price}
                  onChange={(e) => updateCurrentSetting('plans.oneMonth.price', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  혜택 설명
                </label>
                <input
                  type="text"
                  value={currentSettings.plans.oneMonth.benefits}
                  onChange={(e) => updateCurrentSetting('plans.oneMonth.benefits', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={activeTab === 'parent' ? "예: 2회 무료 인터뷰" : "예: 프로필 노출 권한"}
                />
              </div>
            </div>
          </div>

          {/* 3개월 이용권 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">3개월 이용권</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이용권명
                </label>
                <input
                  type="text"
                  value={currentSettings.plans.threeMonth.name}
                  onChange={(e) => updateCurrentSetting('plans.threeMonth.name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  할인 가격 (원)
                </label>
                <input
                  type="number"
                  value={currentSettings.plans.threeMonth.price}
                  onChange={(e) => updateCurrentSetting('plans.threeMonth.price', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  정가 (원)
                </label>
                <input
                  type="number"
                  value={currentSettings.plans.threeMonth.originalPrice}
                  onChange={(e) => updateCurrentSetting('plans.threeMonth.originalPrice', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  할인 표시
                </label>
                <input
                  type="text"
                  value={currentSettings.plans.threeMonth.discount}
                  onChange={(e) => updateCurrentSetting('plans.threeMonth.discount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 16% 할인"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  혜택 설명
                </label>
                <input
                  type="text"
                  value={currentSettings.plans.threeMonth.benefits}
                  onChange={(e) => updateCurrentSetting('plans.threeMonth.benefits', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={activeTab === 'parent' ? "예: 6회 무료 인터뷰" : "예: 프로필 노출 권한"}
                />
              </div>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* 계좌 정보 설정 */}
      <AdminCard 
        title="입금 계좌 정보" 
        subtitle={`${activeTab === 'parent' ? '학부모' : '치료사'}가 입금할 계좌 정보를 설정합니다`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              은행명
            </label>
            <input
              type="text"
              value={currentSettings.bankInfo.bankName}
              onChange={(e) => updateCurrentSetting('bankInfo.bankName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계좌번호
            </label>
            <input
              type="text"
              value={currentSettings.bankInfo.accountNumber}
              onChange={(e) => updateCurrentSetting('bankInfo.accountNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              예금주
            </label>
            <input
              type="text"
              value={currentSettings.bankInfo.accountHolder}
              onChange={(e) => updateCurrentSetting('bankInfo.accountHolder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </AdminCard>

      {/* 안내 메시지 설정 */}
      <AdminCard 
        title="안내 메시지" 
        subtitle={`${activeTab === 'parent' ? '학부모' : '치료사'} 결제 페이지에 표시될 안내 메시지를 설정합니다`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              입금자명 안내 메시지
            </label>
            <input
              type="text"
              value={currentSettings.messages.depositInstruction}
              onChange={(e) => updateCurrentSetting('messages.depositInstruction', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={activeTab === 'parent' ? "예: 입금자명은 반드시 '김0맘' 학부모님 성함으로..." : "예: 입금자명은 반드시 '김0삼' 전문가 성함으로..."}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              결제 완료 안내 메시지
            </label>
            <input
              type="text"
              value={currentSettings.messages.paymentNotice}
              onChange={(e) => updateCurrentSetting('messages.paymentNotice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="결제 완료 후 처리 과정 안내"
            />
          </div>
        </div>
      </AdminCard>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <AdminButton
          onClick={handleSave}
          loading={saving}
          disabled={saving}
          variant="primary"
          size="lg"
        >
          {saving ? '저장 중...' : '설정 저장'}
        </AdminButton>
      </div>
    </div>
  );
}
