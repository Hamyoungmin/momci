'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        // 로그인 성공
        console.log('로그인 성공:', result.user);
        
        // 사용자 타입에 따라 다른 페이지로 리디렉션
        if (result.userData?.userType === 'parent') {
          router.push('/request'); // 학부모는 요청 페이지로
        } else if (result.userData?.userType === 'therapist') {
          router.push('/browse'); // 치료사는 찾기 페이지로
        } else {
          router.push('/'); // 사용자 데이터가 없으면 홈으로
        }
      } else {
        // 로그인 실패
        setErrors({ general: result.error || '로그인에 실패했습니다.' });
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      setErrors({ general: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* 이메일 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          이메일
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
          placeholder="이메일을 입력하세요"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* 비밀번호 */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          비밀번호
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
          placeholder="비밀번호를 입력하세요"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      {/* 로그인 유지 & 비밀번호 찾기 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
            로그인 상태 유지
          </label>
        </div>
        
        <Link 
          href="/auth/forgot-password" 
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          비밀번호를 잊으셨나요?
        </Link>
      </div>

      {/* 일반 에러 메시지 */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </button>

      {/* 구분선 */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">또는</span>
        </div>
      </div>

      {/* 회원가입 링크 */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          아직 계정이 없으시나요?{' '}
          <Link 
            href="/auth/signup" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            회원가입
          </Link>
        </p>
      </div>

      {/* 추가 링크들 */}
      <div className="text-center space-y-2">
        <div className="text-sm">
          <Link 
            href="/teacher-guide" 
            className="text-gray-600 hover:text-gray-900 mr-4"
          >
            치료사 가이드
          </Link>
          <Link 
            href="/parent-guide" 
            className="text-gray-600 hover:text-gray-900"
          >
            학부모 가이드
          </Link>
        </div>
      </div>
    </form>
  );
}
