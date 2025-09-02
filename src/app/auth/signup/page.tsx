import React from 'react';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            모든별 키즈 회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            전문 치료사와 학부모를 위한 안전한 홈티칭 플랫폼
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border-2 border-blue-100">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
