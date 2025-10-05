'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SubscriptionGuardButton from '@/components/common/SubscriptionGuardButton';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';

// 치료사 타입 정의
interface Teacher {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviewCount: number;
  experience: string;
  hourlyRate: number;
  profileImage?: string;
  specialties: string[];
  location: string;
  introduction: string;
  education: string;
  certificates: string[];
  isOnline: boolean;
  responseTime: string;
  availability: string;
  createdAt: Date | string | number;
  certified?: boolean;
  insured?: boolean;
}

export default function TeacherProfiles() {
  const { currentUser, userData } = useAuth();
  const isParent = userData?.userType === 'parent';
  const sub = useSubscriptionStatus(currentUser?.uid);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 이름에서 성만 추출하는 함수
  // 이름을 마스킹하는 함수: (성)0(마지막글자) 형식
  const getLastName = (fullName: string | undefined): string => {
    if (!fullName) return '익명';
    if (fullName.length === 1) return fullName; // 1글자면 그대로
    if (fullName.length === 2) return fullName.charAt(0) + '0' + fullName.charAt(1); // 2글자: 첫+0+마지막
    // 3글자 이상: 첫글자 + 0 + 마지막글자
    return fullName.charAt(0) + '0' + fullName.charAt(fullName.length - 1);
  };

  // 선생님에게 요청하기 모달 상태
  const [showRequestModal, setShowRequestModal] = useState(false);
  // const [isModalClosing, setIsModalClosing] = useState(false); // 삭제 예정 상태 보존 (사용 안 함)
  
  // 프로필 등록 확인 팝업 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirmModalClosing, setIsConfirmModalClosing] = useState(false);
  // const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // 새 게시글 작성용 상태
  // const [newPost, setNewPost] = useState({
  //   treatment: '',
  //   region: '',
  //   detailLocation: '',
  //   age: '',
  //   gender: '',
  //   frequency: '',
  //   timeDetails: '',
  //   price: '',
  //   additionalInfo: ''
  // });

  // Firebase에서 치료사 데이터 실시간으로 가져오기
  useEffect(() => {
    console.log('🔍 Firebase에서 치료사 프로필 데이터 가져오기 시작...');
    
    // 임시로 status 조건 제거해서 모든 치료사 프로필 가져오기 (테스트용)
    const q = query(
      collection(db, 'therapistProfiles'),
      // where('status', '==', 'approved'), // 임시 주석
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      console.log('📥 치료사 프로필 스냅샷 받음:', snapshot.size, '개의 문서');
      
      const teacherProfiles: Teacher[] = [];
      for (const d of snapshot.docs) {
        const data = d.data();
        console.log('📄 치료사 데이터:', { id: d.id, ...data });

        // 🔒 구독 활성 여부 확인: user-subscription-status에서 활성/만료일 확인
        let showProfile = true;
        try {
          const subSnap = await getDoc(doc(db, 'user-subscription-status', d.id));
          if (subSnap.exists()) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const subData: any = subSnap.data();
            const expiryMs = subData?.expiryDate && typeof subData.expiryDate.toDate === 'function' ? subData.expiryDate.toDate().getTime() : 0;
            const active = !!subData?.hasActiveSubscription && expiryMs > Date.now();
            showProfile = active;
          } else {
            showProfile = false;
          }
        } catch {
          showProfile = false;
        }

        if (!showProfile) continue; // 미활성 치료사는 노출 제외

        teacherProfiles.push({
          id: d.id,
          name: data.name || '치료사',
          title: `${data.experience || '0'}년차 ${data.specialty || '치료사'}`,
          rating: data.rating || 4.8,
          reviewCount: data.reviewCount || 0,
          experience: data.experience || '0년',
          hourlyRate: data.hourlyRate || 65000,
          profileImage: data.profileImage,
          specialties: data.specialties || [data.specialty || '치료'],
          location: data.location || '서울',
          introduction: data.introduction || '전문적인 치료 서비스를 제공합니다.',
          education: data.education || '관련 학과 졸업',
          certificates: data.certificates || ['자격증'],
          isOnline: data.isOnline || true,
          responseTime: data.responseTime || '평균 2시간 이내',
          availability: data.availability || '평일/주말 상담 가능',
          createdAt: data.createdAt,
          certified: data.isVerified === true, // ✅ 명시적으로 true인 경우만 인증 표시
          insured: data.insured === true || data.hasInsurance === true
        });
      }
      
      console.log('✅ 최종 치료사 프로필 배열:', teacherProfiles);
      
            // Firebase에서 가져온 실제 데이터만 사용
      setTeachers(teacherProfiles);
      setLoading(false);
    }, (error) => {
      console.error('❌ 치료사 프로필 가져오기 오류:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 요청 모달 제거됨: 안전하게 닫기만 처리
  const closeRequestModal = () => {
      setShowRequestModal(false);
  };

  // 프로필 등록 확인 팝업 열기
  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };

  // 프로필 등록 확인 팝업 닫기
  const closeConfirmModal = () => {
    setIsConfirmModalClosing(true);
    setTimeout(() => {
      setShowConfirmModal(false);
      setIsConfirmModalClosing(false);
    }, 300);
  };

  // 프로필 등록 확인 후 즉시 목록에 노출(두 번째 팝업 제거)
  const handleConfirmRegister = async () => {
    try {
      // 어떤 경우에도 작성 폼 모달은 열지 않도록 방지
      setShowRequestModal(false);
    closeConfirmModal();
      if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 승인된 치료사 프로필 문서를 공개로 전환
      const profileRef = doc(db, 'therapistProfiles', currentUser.uid);
      const snap = await getDoc(profileRef);
      if (!snap.exists()) {
        alert('승인된 프로필이 없습니다. 관리자 승인 후 등록할 수 있습니다.');
        return;
      }

      await setDoc(
        profileRef,
        {
          isPublished: true,
          publishedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // 알림 및 완료 처리
      alert('프로필이 목록에 등록되었습니다!');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('프로필 등록 실패:', e);
      alert('프로필 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 선생님에게 요청하기 모달 제거 (둘러보기에서 사용 안 함)
  const openRequestModal = () => {
    alert('요청 작성 기능은 현재 페이지에서 제공되지 않습니다.');
  };

  // 요청 작성 기능 제거됨

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // 요청 모달 외부 클릭 시 모달 닫기
      if (showRequestModal && !target.closest('.request-modal')) {
        closeRequestModal();
      }
      
      // 확인 팝업 외부 클릭 시 팝업 닫기
      if (showConfirmModal && !target.closest('.confirm-modal')) {
        closeConfirmModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRequestModal, showConfirmModal]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">검증된 전문 치료사</h2>
            <p className="text-gray-600 mt-1">
              {loading ? '치료사 정보를 불러오는 중...' : `총 ${teachers.length}명의 선생님이 등록되어 있습니다`}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {isParent && (
              <>
            {/* 새 게시글 작성 버튼 (학부모 전용, 구독 가드) */}
            <SubscriptionGuardButton
              requiredType="parent"
              onClick={openConfirmModal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                새 게시글 작성
              </span>
            </SubscriptionGuardButton>
            {/* 안내 문구: 가드 버튼이 비활성 상태일 때 버튼 바로 아래에 표시 */}
            {(!sub.hasActiveSubscription || sub.subscriptionType !== 'parent') && (
              <p className="text-xs text-gray-500 mt-2 text-right">이용권이 없을 때는 이용권을 구매후 사용해주세요.</p>
                )}
              </>
            )}
        </div>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500">치료사 정보를 불러오는 중...</div>
          </div>
        )}

        {/* 치료사 목록 */}
        {!loading && (
        <div className="space-y-6">
            {teachers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
                등록된 치료사가 없습니다.
              </div>
            ) : (
              teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-6">
              {/* 게시글 카드 스타일로 변경 */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* 제목 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {getLastName(teacher.name)} 치료사 <span className="text-gray-600">[{teacher.experience || 0}년차 {teacher.specialties[0]}]</span>
                  </h3>
                  
                  {/* 메타 정보 */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span>경력: {teacher.experience}</span>
                    <span>•</span>
                    <span>📍 {teacher.location}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      {teacher.reviewCount > 0 ? (
                        <>
                          <span className="text-orange-400 mr-1">★</span>
                          {teacher.rating} ({teacher.reviewCount}개 후기)
                        </>
                      ) : (
                        <span className="text-gray-500">후기 없음</span>
                      )}
                    </span>
                    {/* 보험가입 / 인증 배지 영역: 보험가입 오른쪽에 파란 별 */}
                    {teacher.insured && (
                      <span className="flex items-center">
                        <span className="px-2 py-0.5 rounded-full border text-xs bg-white text-gray-700 border-gray-300">보험가입</span>
                        {teacher.certified && (
                          <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[11px]">★</span>
                        )}
                      </span>
                    )}
                    {!teacher.insured && teacher.certified && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[11px]">★</span>
                    )}
                  </div>
                  
                  {/* 내용 */}
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {teacher.introduction}
                  </p>
                  
                  {/* 태그들 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {teacher.specialties.slice(0, 3).map((specialty, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        #{specialty}
                      </span>
                    ))}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                      #{teacher.location}
                    </span>
                  </div>
                  
                  {/* 가격 */}
                  <div className="text-xl font-bold text-blue-600 mb-4">
                    회기당 {teacher.hourlyRate.toLocaleString()}원
                  </div>
                  
                  {/* 하단 정보 */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                      <span>{teacher.responseTime}</span>
                      <span>•</span>
                      <span>{teacher.availability}</span>
                    </div>
                    </div>
                  </div>
                  
                {/* 오른쪽: 버튼들 */}
                  <div className="flex flex-col items-end space-y-3 ml-6">
                    {isParent && (
                    <SubscriptionGuardButton
                      requiredType="parent"
                      onClick={openRequestModal}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors shadow-sm"
                      inactiveHint="이용권 구매 시 이용 가능합니다."
                    >
                      선생님께 요청하기
                    </SubscriptionGuardButton>
                    )}
                    
                  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors shadow-sm">
                    1:1 채팅
                  </button>
                  
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">
                        상세 프로필 보기 &gt;
                    </div>
                  </div>
                </div>
              </div>
            </div>
                ))
              )}
        </div>
        )}

        {/* 페이지네이션 */}
        {!loading && teachers.length > 0 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50">
              이전
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded-lg ${
                  page === 1
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50">
              다음
            </button>
          </div>
        </div>
        )}
      </div>

      {/* 요청 작성 모달 제거됨 */}

      {/* 프로필 등록 확인 팝업 */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className={`bg-white rounded-2xl p-10 max-w-lg w-[90%] text-center shadow-2xl transform confirm-modal ${isConfirmModalClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
            {/* 로켓 아이콘 */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg width="56" height="56" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(45)">
                  {/* 로켓 본체 */}
                  <ellipse cx="16" cy="14" rx="4" ry="8" fill="#3B82F6"/>
                  {/* 로켓 머리 (뾰족한 부분) */}
                  <path d="M16 6l-2 4h4l-2-4z" fill="#1E40AF"/>
                  {/* 로켓 날개 */}
                  <path d="M12 18l-3 2v3l3-2z" fill="#3B82F6"/>
                  <path d="M20 18l3 2v3l-3-2z" fill="#3B82F6"/>
                  {/* 로켓 창문 */}
                  <circle cx="16" cy="12" r="1.5" fill="white"/>
                </svg>
              </div>
            </div>
            
            {/* 제목 */}
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
              프로필을 목록에 등록하시겠습니까?
            </h2>
            
            {/* 설명 */}
            <div className="text-center text-sm text-gray-600 mb-8 leading-relaxed space-y-1">
              <div>등록된 프로필은 &apos;선생님 둘러보기&apos; 목록에 노출되어 학부모님들이 볼 수 있게 됩니다.</div>
              <div>
                이후 <span className="text-blue-600 font-semibold">&apos;프로필 끌어올림&apos;</span> 기능을 이용해 내 프로필을 목록 상단으로 올려 더 많은 기회를 만들어보세요!
              </div>
              <div className="text-xs text-blue-500">(프로필 끌어올림은 24시간에 한 번만 가능합니다.)</div>
            </div>
            
            {/* 버튼들 */}
            <div className="flex gap-3">
              <button
                onClick={closeConfirmModal}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmRegister}
                className="flex-1 px-6 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                네, 등록합니다
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
