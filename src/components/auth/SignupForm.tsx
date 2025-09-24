'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp, UserType } from '@/lib/auth';

export default function SignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  
  const [formData, setFormData] = useState({
    // 공통 정보
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    
    // 약관 동의
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    if (!userType) {
      setErrors({ userType: '회원 유형을 선택해주세요.' });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.phone) {
      newErrors.phone = '연락처를 입력해주세요.';
    } else if (!/^[0-9-]{10,13}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '올바른 연락처를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요.';
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보처리방침에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      if (!userType) {
        setErrors({ general: '회원 유형을 선택해주세요.' });
        setIsLoading(false);
        return;
      }

      const result = await signUp(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        userType: userType,
        agreeTerms: formData.agreeTerms,
        agreePrivacy: formData.agreePrivacy,
        agreeMarketing: formData.agreeMarketing
      });
      
      if (result.success) {
        // 회원가입 성공 → 바로 홈으로 이동하여 역할 기반 UI가 즉시 반영되도록 함
        console.log('회원가입 성공:', result.user);
        alert('회원가입이 완료되었습니다!');
        router.push('/');
      } else {
        // 회원가입 실패
        setErrors({ general: result.error || '회원가입에 실패했습니다.' });
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      setErrors({ general: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">회원 유형 선택</h3>
        <p className="text-sm text-gray-600">이용하실 서비스에 맞는 회원 유형을 선택해주세요</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* 학부모 선택 */}
        <div 
          className={`relative cursor-pointer rounded-2xl border-2 p-6 hover:bg-gray-50 transition-colors ${
            userType === 'parent' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
          }`}
          onClick={() => setUserType('parent')}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <input
                type="radio"
                name="userType"
                value="parent"
                checked={userType === 'parent'}
                onChange={() => setUserType('parent')}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3">
              <div className="text-lg font-medium text-gray-900">👨‍👩‍👧‍👦 학부모</div>
              <div className="text-sm text-gray-600 mt-1">
                • 치료가 필요한 아이를 위해 전문 치료사를 찾고 있어요<br/>
                • 요청글을 작성하여 치료사의 지원을 받을 수 있어요<br/>
                • 월 9,900원의 이용권으로 모든 서비스 이용 가능<br/>
                • 무료 1:1 채팅 2회 제공
              </div>
            </div>
          </div>
        </div>

        {/* 치료사 선택 */}
        <div 
          className={`relative cursor-pointer rounded-2xl border-2 p-6 hover:bg-gray-50 transition-colors ${
            userType === 'therapist' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
          }`}
          onClick={() => setUserType('therapist')}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <input
                type="radio"
                name="userType"
                value="therapist"
                checked={userType === 'therapist'}
                onChange={() => setUserType('therapist')}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3">
              <div className="text-lg font-medium text-gray-900">👩‍⚕️ 치료사</div>
              <div className="text-sm text-gray-600 mt-1">
                • 언어치료, 놀이치료, 감각통합치료 등 전문 치료사예요<br/>
                • 학부모 요청글에 지원하거나 프로필을 등록할 수 있어요<br/>
                • 월 19,900원의 이용권으로 활동 시작<br/>
                • 프로필 승인 후 매칭 활동 가능
              </div>
            </div>
          </div>
        </div>
      </div>

      {errors.userType && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{errors.userType}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleNext}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        다음 단계
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">기본 정보 입력</h3>
        <p className="text-sm text-gray-600">회원가입을 위한 기본 정보를 입력해주세요</p>
      </div>

      {/* 이메일 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          이메일 *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="example@email.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* 비밀번호 */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          비밀번호 *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="8자 이상 입력하세요"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          비밀번호 확인 *
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="비밀번호를 다시 입력하세요"
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 이름 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            이름 *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="홍길동"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* 연락처 */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            연락처 *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="010-1234-5678"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-2xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          이전
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 py-3 px-4 border border-transparent rounded-2xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          다음 단계
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">약관 동의</h3>
        <p className="text-sm text-gray-600">서비스 이용을 위한 약관에 동의해주세요</p>
      </div>

      <div className="space-y-4">
        {/* 이용약관 동의 */}
        <div className="flex items-start">
          <input
            id="agreeTerms"
            name="agreeTerms"
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
          />
          <div className="ml-3">
            <label htmlFor="agreeTerms" className="text-sm font-medium text-gray-900">
              [필수] 이용약관 동의
            </label>
            <p className="text-xs text-gray-600 mt-1">
              모든별 키즈 서비스 이용을 위한 약관입니다.{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">자세히 보기</Link>
            </p>
          </div>
        </div>
        {errors.agreeTerms && <p className="text-sm text-red-600 ml-7">{errors.agreeTerms}</p>}

        {/* 개인정보처리방침 동의 */}
        <div className="flex items-start">
          <input
            id="agreePrivacy"
            name="agreePrivacy"
            type="checkbox"
            checked={formData.agreePrivacy}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
          />
          <div className="ml-3">
            <label htmlFor="agreePrivacy" className="text-sm font-medium text-gray-900">
              [필수] 개인정보처리방침 동의
            </label>
            <p className="text-xs text-gray-600 mt-1">
              개인정보 수집 및 이용에 관한 동의입니다.{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">자세히 보기</Link>
            </p>
          </div>
        </div>
        {errors.agreePrivacy && <p className="text-sm text-red-600 ml-7">{errors.agreePrivacy}</p>}

        {/* 마케팅 정보 수신 동의 */}
        <div className="flex items-start">
          <input
            id="agreeMarketing"
            name="agreeMarketing"
            type="checkbox"
            checked={formData.agreeMarketing}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
          />
          <div className="ml-3">
            <label htmlFor="agreeMarketing" className="text-sm font-medium text-gray-900">
              [선택] 마케팅 정보 수신 동의
            </label>
            <p className="text-xs text-gray-600 mt-1">
              이벤트, 혜택 등 유용한 정보를 받아보시려면 동의해주세요.
            </p>
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-2xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          이전
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-4 border border-transparent rounded-2xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '가입 중...' : '회원가입 완료'}
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      {/* 진행 단계 표시 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              <div className="ml-2 text-sm font-medium text-gray-900">
                {step === 1 && '회원 유형'}
                {step === 2 && '기본 정보'}
                {step === 3 && '약관 동의'}
              </div>
              {step < 3 && (
                <div className={`w-12 h-1 mx-4 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 단계별 내용 */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      {/* 하단 링크 */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          이미 계정이 있으시나요?{' '}
          <Link 
            href="/auth/login" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            로그인
          </Link>
        </p>
      </div>
    </form>
  );
}
