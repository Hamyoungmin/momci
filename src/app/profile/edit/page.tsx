'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface UserData {
  name: string;
  phone: string;
  userType: 'parent' | 'therapist';
  email: string;
}

export default function EditProfilePage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [userData, setUserData] = useState<UserData | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // 사용자 데이터 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          setFormData(prev => ({
            ...prev,
            name: data.name || '',
            phone: data.phone || ''
          }));
        }
      } catch (error) {
        console.error('사용자 데이터 불러오기 오류:', error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요.';
    } else if (!/^[0-9-]{10,13}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '올바른 연락처를 입력해주세요.';
    }

    // 비밀번호 변경 관련 검증
    if (formData.newPassword || formData.confirmNewPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
      }

      if (!formData.newPassword) {
        newErrors.newPassword = '새 비밀번호를 입력해주세요.';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
      }

      if (!formData.confirmNewPassword) {
        newErrors.confirmNewPassword = '새 비밀번호 확인을 입력해주세요.';
      } else if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = '새 비밀번호가 일치하지 않습니다.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !currentUser) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      // 기본 정보 업데이트
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        updatedAt: serverTimestamp()
      });

      // 비밀번호 변경 (입력된 경우에만)
      if (formData.currentPassword && formData.newPassword) {
        try {
          // 현재 비밀번호로 재인증
          const credential = EmailAuthProvider.credential(
            currentUser.email!,
            formData.currentPassword
          );
          await reauthenticateWithCredential(currentUser, credential);
          
          // 새 비밀번호로 변경
          await updatePassword(currentUser, formData.newPassword);
        } catch (passwordError: unknown) {
          console.error('비밀번호 변경 오류:', passwordError);
          if (passwordError && typeof passwordError === 'object' && 'code' in passwordError && passwordError.code === 'auth/wrong-password') {
            setErrors({ currentPassword: '현재 비밀번호가 올바르지 않습니다.' });
          } else {
            setErrors({ general: '비밀번호 변경에 실패했습니다.' });
          }
          setIsLoading(false);
          return;
        }
      }

      alert('회원정보가 성공적으로 수정되었습니다.');
      router.push('/mypage');
      
    } catch (error) {
      console.error('회원정보 수정 오류:', error);
      setErrors({ general: '회원정보 수정에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border-2 border-blue-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">사용자 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            회원정보 수정
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {userData?.userType === 'parent' ? '학부모' : '치료사'} 계정 정보를 수정하세요
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border-2 border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 계정 정보 섹션 */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">기본 정보</h3>
                <p className="text-sm text-gray-600">이름과 연락처를 수정할 수 있습니다</p>
              </div>

              {/* 이메일 (읽기 전용) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">이메일은 변경할 수 없습니다.</p>
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
            </div>

            {/* 비밀번호 변경 섹션 */}
            <div className="border-t border-gray-200 pt-6">
              <div className="text-center mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">비밀번호 변경</h3>
                <p className="text-sm text-gray-600">비밀번호를 변경하려면 아래 정보를 입력하세요 (선택사항)</p>
              </div>

              {/* 현재 비밀번호 */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  현재 비밀번호
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="현재 비밀번호를 입력하세요"
                />
                {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 새 비밀번호 */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    새 비밀번호
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="8자 이상 입력하세요"
                  />
                  {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                </div>

                {/* 새 비밀번호 확인 */}
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    새 비밀번호 확인
                  </label>
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.confirmNewPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="새 비밀번호를 다시 입력하세요"
                  />
                  {errors.confirmNewPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmNewPassword}</p>}
                </div>
              </div>
            </div>

            {/* 전체 오류 메시지 */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-4">
              <Link
                href="/mypage"
                className="flex-1 py-3 px-4 border border-gray-300 rounded-2xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-center"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 border border-transparent rounded-2xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </form>

          {/* 하단 링크 */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              계정을 삭제하고 싶으시다면{' '}
              <Link 
                href="/support" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                고객지원
              </Link>
              에 문의해주세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
