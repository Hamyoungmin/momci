'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, addDoc, serverTimestamp, onSnapshot, orderBy, query, updateDoc, doc, where, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '@/lib/firebase';
import { addReviewBonusTokens } from '@/lib/interviewTokens';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export default function ReviewsList() {
  const [selectedCategory] = useState('전체');
  const [firebaseReviews, setFirebaseReviews] = useState<Review[]>([]);

  interface Review {
    id: string;
    title: string;
    content: string;
    rating: number;
    author: string;
    date: string;
    category?: string;
    imageUrls?: string[];
    userId?: string;
    createdAt?: Timestamp;
  }
  const [loading, setLoading] = useState(true);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<'parent' | 'therapist' | 'admin' | 'unknown'>('unknown');
  const [currentSlide, setCurrentSlide] = useState(0);

  // 사용자 인증 상태 관리
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // 사용자 역할 조회
      (async () => {
        try {
          if (user) {
            const userSnap = await getDoc(doc(db, 'users', user.uid));
            const role = (userSnap.exists() ? (userSnap.data() as { userType?: string }).userType : undefined) as 'parent' | 'therapist' | 'admin' | undefined;
            setCurrentUserRole(role || 'unknown');
          } else {
            setCurrentUserRole('unknown');
          }
        } catch {
          setCurrentUserRole('unknown');
        }
      })();
    });

    return () => unsubscribe();
  }, []);

  // Firebase에서 실시간 후기 데이터 가져오기
  useEffect(() => {
    console.log('🔥 실시간 후기 데이터 로딩 시작');
    
    const reviewsQuery = query(
      collection(db, 'reviews'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
      const reviewsData: Review[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'approved') { // 승인된 후기만 표시
          const review: Review = {
            id: doc.id,
            title: data.title || '',
            content: data.content || '',
            rating: data.rating || 0,
            author: data.author || '익명',
            date: data.createdAt 
              ? new Date(data.createdAt.toDate()).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit', 
                  day: '2-digit'
                }).replace(/\. /g, '.').slice(0, -1)
              : new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).replace(/\. /g, '.').slice(0, -1),
            category: data.category || '기타',
            imageUrls: data.imageUrls || [],
            userId: data.userId,
            createdAt: data.createdAt
          };
          reviewsData.push(review);
        }
      });

      console.log('✅ Firebase 후기 데이터 로딩 완료:', reviewsData.length, '개');
      setFirebaseReviews(reviewsData);
      setLoading(false);
    }, (error) => {
      console.error('❌ Firebase 후기 데이터 로딩 오류:', error);
      setLoading(false);
    });

    return () => {
      console.log('🧹 Firebase 후기 구독 해제');
      unsubscribe();
    };
  }, []);

  // 더미 데이터 추가 (첫 번째 이미지 스타일 확인용)
  const dummyReviews = useMemo(() => [
    {
      id: "dummy-1",
      title: "놀기만 하는 아이, 선생님께서 놀이를 치료로 바뀌니깐 차근차근 치료받고 있습니다^^",
      content: "아이가 자연스럽게 놀면서 치료를 받을 수 있어서 좋았습니다. 처음에는 치료를 받는 것을 싫어했는데, 놀이를 통해 접근하니 아이가 즐거워하면서 치료를 받더라고요. 선생님께서 아이의 상태를 정확히 파악하시고 적절한 놀이를 통해 치료해 주셔서 정말 감사합니다.",
      rating: 5,
      author: "신대방역 임**님",
      date: "2025.01.20",
      category: "놀이치료"
    },
    {
      id: "dummy-2",
      title: "선생님들을 보고 선택할 수 있어서 좋았습니다!",
      content: "직접 선생님의 이력과 경력을 보고 선택할 수 있다는 점이 정말 좋았습니다. 우리 아이에게 맞는 선생님을 직접 고를 수 있어서 더욱 신뢰가 갔고, 실제로도 아이가 선생님을 좋아해서 치료 효과도 좋았습니다.",
      rating: 5,
      author: "가람마을 임**님",
      date: "2025.01.18",
      category: "언어치료"
    },
    {
      id: "dummy-3",
      title: "좋은 선생님께서 서서 컨설팅도-",
      content: "선생님께서 아이의 상태를 정확히 진단해 주시고, 앞으로의 치료 방향에 대해서도 자세히 설명해 주셔서 정말 도움이 되었습니다. 부모로서 궁금했던 점들도 친절하게 답변해 주시고, 가정에서 할 수 있는 활동들도 알려주셔서 감사했습니다.",
      rating: 5,
      author: "방화동 구**님",
      date: "2025.01.15"
    },
    {
      id: "dummy-4",
      title: "전문적인 치료로 아이가 많이 좋아졌어요",
      content: "선생님의 전문성이 정말 뛰어나시더라고요. 체계적이고 과학적인 접근으로 우리 아이의 문제를 정확히 파악하고 치료해 주셨습니다.",
      rating: 5,
      author: "강남구 김**님",
      date: "2025.01.12"
    },
    {
      id: "dummy-5",
      title: "아이가 치료를 즐거워해요",
      content: "처음에는 치료를 싫어했던 아이가 이제는 선생님 만나는 날을 기다립니다. 재미있게 치료받으면서 실력도 늘고 있어요.",
      rating: 5,
      author: "서초구 박**님",
      date: "2025.01.10"
    },
    {
      id: "dummy-6",
      title: "세심한 케어에 감동받았습니다",
      content: "아이 하나하나의 특성을 잘 파악하시고 맞춤형 치료를 해주셔서 정말 감사했습니다. 부모 상담도 꼼꼼히 해주세요.",
      rating: 5,
      author: "송파구 이**님",
      date: "2025.01.08"
    },
    {
      id: "dummy-7",
      title: "체계적인 프로그램으로 효과가 확실해요",
      content: "다른 치료센터와는 달리 정말 체계적이고 과학적인 접근방법으로 치료를 진행해주셔서 눈에 띄는 효과를 볼 수 있었습니다. 매번 상세한 피드백도 주셔서 아이의 발전과정을 명확히 알 수 있어요.",
      rating: 5,
      author: "노원구 최**님",
      date: "2025.01.06"
    },
    {
      id: "dummy-8",
      title: "선생님의 전문성이 정말 뛰어나세요",
      content: "오랜 경험과 전문지식을 바탕으로 우리 아이의 문제점을 정확히 파악하고 해결책을 제시해주셨습니다. 아이도 선생님을 정말 좋아하고 신뢰하는 모습이 보여서 안심이 됩니다.",
      rating: 5,
      author: "강서구 정**님",
      date: "2025.01.04"
    },
    {
      id: 9,
      title: "믿고 맡길 수 있는 전문가입니다",
      content: "처음에는 반신반의했는데, 몇 개월 지나니 아이가 정말 많이 변했어요. 사회성도 늘고 자신감도 생겼습니다. 꾸준히 치료받으면서 더 좋은 결과를 기대하고 있어요.",
      rating: 4,
      author: "양천구 한**님",
      date: "2025.01.02"
    }
  ], []);

  // 더미 데이터와 Firebase 데이터 합치기
  const allReviews = useMemo(() => {
    // 더미 데이터에 category가 없는 경우 기본값 추가
    const processedDummyReviews = dummyReviews.map(review => ({
      ...review,
      category: review.category || '기타'
    }));
    
    // 더미 데이터 먼저, 그 다음 Firebase 데이터 (최신순)
    return [...processedDummyReviews, ...firebaseReviews];
  }, [dummyReviews, firebaseReviews]);

  // 후기 작성 모달 열기/닫기
  const openWriteModal = () => {
    if (currentUserRole === 'therapist') {
      // 회색 모달 표시
      window.confirm(
        '⚠️ 치료사 계정은 후기를 작성할 수 없습니다.\n\n후기는 학부모님들만 작성하실 수 있습니다.\n치료사분들은 후기를 받는 입장이십니다.'
      );
      return;
    }
    setShowWriteModal(true);
    setIsModalClosing(false);
  };

  const closeWriteModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowWriteModal(false);
      setIsModalClosing(false);
    }, 300);
  };

  // 이미지 업로드 함수
  const uploadImages = async (files: File[], reviewId: string): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${Date.now()}_${index}_${file.name}`;
      const storageRef = ref(storage, `reviews/${reviewId}/attachments/${fileName}`);
      
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch (error) {
        console.error(`이미지 업로드 실패 (${file.name}):`, error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  };

  // 후기 작성 제출 - 바로 승인됨
  const handleSubmitReview = async (reviewData: ReviewFormData) => {
    try {
      // 디버깅: 전송할 데이터 확인
      console.log('🔍 사용자 인증 상태:', currentUser);
      console.log('🔍 전송할 후기 데이터:', reviewData);
      
      if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
      }
      if (currentUserRole === 'therapist') {
        alert('치료사 계정은 후기를 작성할 수 없습니다.');
        return;
      }

      // 작성자명 생성
      const authorName = currentUser?.displayName || 
                        (currentUser?.email ? currentUser.email.split('@')[0] + '00님' : '') || 
                        '익명 사용자';

      const reviewDoc = {
        title: reviewData.selectedTags.length > 0 
          ? `${reviewData.selectedTags.join(', ')} - 만족스러운 치료 경험`
          : '만족스러운 치료 경험',
        content: reviewData.content || '',
        category: reviewData.selectedTags[0] || '기타',
        rating: reviewData.rating || 0,
        selectedTags: reviewData.selectedTags || [],
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        author: authorName,
        helpfulCount: 0,
        status: 'approved',
        imageUrls: []
      };

      console.log('🔍 Firestore에 전송할 문서:', reviewDoc);

      // 1. 먼저 후기 문서를 생성
      const docRef = await addDoc(collection(db, 'reviews'), reviewDoc);

      // 2. 이미지가 있다면 업로드
      if (reviewData.images && reviewData.images.length > 0) {
        try {
          console.log('🖼️ 이미지 업로드 시작:', reviewData.images.length, '개');
          const imageUrls = await uploadImages(reviewData.images, docRef.id);
          
          // 3. 이미지 URL들을 후기 문서에 업데이트
          await updateDoc(doc(db, 'reviews', docRef.id), {
            imageUrls: imageUrls
          });
          
          console.log('✅ 이미지 업로드 및 URL 업데이트 완료');
        } catch (imageError) {
          console.error('❌ 이미지 업로드 실패:', imageError);
          // 이미지 업로드가 실패해도 후기는 저장됨
          alert('이미지 업로드에 실패했지만 후기는 정상적으로 등록되었습니다.');
        }
      } else {
        console.log('📝 이미지 없이 후기만 등록');
      }
      
      // 3. 보상 지급 조건 확인 및 인터뷰권 지급 (2건 작성당 +1, 최대 3회)
      try {
        if (currentUser) {
          await giveReviewBonusIfEligible(currentUser.uid);
        }
      } catch (bonusError) {
        console.error('보상 지급 로직 수행 중 오류:', bonusError);
      }

      alert('후기가 성공적으로 작성되었습니다!');
      closeWriteModal();
      
      // 슬라이더를 첫 번째 페이지로 이동 (새 후기가 더미데이터 다음에 나타남)
      setCurrentSlide(0);
    } catch (error: unknown) {
      console.error('❌ 후기 작성 실패 - 상세 에러:', error);
      
      let errorMessage = '후기 작성에 실패했습니다.';
      
      if (error && typeof error === 'object' && 'code' in error) {
        console.error('❌ 에러 코드:', error.code);
        
        if (error.code === 'permission-denied') {
          errorMessage = '권한이 없습니다. 로그인을 확인해주세요.';
        } else if (error.code === 'invalid-argument') {
          errorMessage = '입력 데이터에 문제가 있습니다.';
        }
      }
      
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        console.error('❌ 에러 메시지:', error.message);
        if (!errorMessage.includes('권한') && !errorMessage.includes('입력 데이터')) {
          errorMessage = `에러: ${error.message}`;
        }
      }
      
      alert(errorMessage + '\n\n개발자도구 콘솔에서 상세 에러를 확인해주세요.');
    }
  };

  // 보상 지급 로직: 2건 작성 시 +1, 회원당 최대 3회
  const giveReviewBonusIfEligible = async (userId: string) => {
    // 총 작성한 일반 후기 개수 조회
    const q = query(collection(db, 'reviews'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const totalReviews = snap.size;

    // 현재까지 보상 지급 횟수 조회/초기화
    const bonusRef = doc(db, 'review-bonus', userId);
    const bonusSnap = await getDoc(bonusRef);
    const awardedCount = bonusSnap.exists() ? (bonusSnap.data().awardedCount || 0) : 0;

    const eligibleAwards = Math.min(3, Math.floor(totalReviews / 2)) - awardedCount;
    if (eligibleAwards > 0) {
      // 규칙상 +1 단위로 안전 지급
      let success = 0;
      for (let i = 0; i < eligibleAwards; i++) {
        const ok = await addReviewBonusTokens(userId, 1);
        if (ok) success++;
      }
      if (success > 0) {
        // 지급 횟수 갱신
        if (bonusSnap.exists()) {
          await updateDoc(bonusRef, { awardedCount: awardedCount + success, updatedAt: serverTimestamp() });
        } else {
          await setDoc(bonusRef, { awardedCount: success, updatedAt: serverTimestamp() });
        }
        if (success === 1) {
          alert('인터뷰권 1회가 지급되었습니다!');
        } else {
          alert(`인터뷰권 ${success}회가 지급되었습니다!`);
        }
      }
    }
  };

  const filteredReviews = selectedCategory === '전체' 
    ? allReviews 
    : allReviews.filter(review => review.category === selectedCategory);

  // 슬라이더 관련 함수 - 하나씩 넘어가기
  const visibleItems = 3; // 화면에 보이는 개수는 3개
  const maxSlide = Math.max(0, filteredReviews.length - visibleItems); // 마지막 후기까지 갈 수 있도록
  
  const nextSlide = () => {
    if (currentSlide < maxSlide) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // currentSlide가 초기화되었는지 확인
  const effectiveCurrentSlide = Math.max(0, Math.min(currentSlide, maxSlide));


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <>
      {/* CSS 애니메이션 정의 */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* 팝업 애니메이션 */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes scaleOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-fade-out {
          animation: fadeOut 0.3s ease-in forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-scale-out {
          animation: scaleOut 0.3s ease-in forwards;
        }
      `}</style>
      
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 - 첫 번째 이미지 스타일 */}
        <div className="text-center mb-32 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">실시간 모든별 키즈!</h2>
          
          {/* 후기 작성하기 버튼 - 제목 아래쪽에 배치 */}
          <div className="absolute top-20 right-0">
            <button
              onClick={openWriteModal}
              disabled={currentUserRole === 'therapist'}
              className={`px-6 py-3 rounded-2xl font-medium transition-colors flex items-center gap-2 shadow-lg ${
                currentUserRole === 'therapist'
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              title={currentUserRole === 'therapist' ? '치료사 계정은 후기를 작성할 수 없습니다' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              후기 작성하기
            </button>
          </div>
        </div>

        {/* 후기 슬라이더 - 첫 번째 이미지 스타일 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">후기를 불러오는 중...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <span className="text-6xl mb-4 block">📝</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">아직 작성된 후기가 없습니다</h3>
            <p className="text-gray-600 mb-6">
              첫 번째 후기를 작성해보세요! 다른 학부모님들에게 큰 도움이 됩니다.
            </p>
            <button
              onClick={openWriteModal}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentUserRole === 'therapist' 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              disabled={currentUserRole === 'therapist'}
              title={currentUserRole === 'therapist' ? '치료사 계정은 후기를 작성할 수 없습니다' : ''}
            >
              후기 작성하기
            </button>
        </div>
        ) : (
          <div className="relative">
            {/* 슬라이더 컨테이너 - 개별 후기 처리 */}
            <div className="relative overflow-hidden px-8">
              <div 
                className="flex transition-transform duration-500 ease-in-out gap-6"
                style={{ 
                  transform: `translateX(calc(-${effectiveCurrentSlide * 33.333333}% - ${effectiveCurrentSlide * 1.5}rem))`,
                }}
              >
                {filteredReviews.map((review, index) => (
                  <div 
                    key={review.id}
                    className="flex-shrink-0 w-full md:w-1/3"
                    style={{
                      minWidth: 'calc(33.333333% - 1rem)'
                    }}
                  >
                    <div 
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm transform transition-all duration-300 hover:scale-105 hover:shadow-md h-full"
                      style={{
                        animationDelay: `${(index % visibleItems) * 100}ms`,
                        animation: index >= currentSlide && index < currentSlide + visibleItems ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                      }}
                    >
                             {/* 제목 */}
                      <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">
                {review.title}
              </h3>
              
                      {/* 내용 미리보기 */}
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-4">
                {review.content}
              </p>
              
                      {/* 별점 - 이름 위로 이동 */}
                      <div className="flex items-center mb-2">
                        {renderStars(review.rating || 5)}
                      </div>
              
                      {/* 작성자 정보 */}
                      <div className="text-sm text-gray-500">
                        <div className="font-medium">{review.author}</div>
                  <div>{review.date}</div>
                </div>
                    </div>
                </div>
                ))}
              </div>
            </div>

            {/* 네비게이션 화살표 */}
            {filteredReviews.length > visibleItems && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-3 shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 z-10"
                  disabled={effectiveCurrentSlide === 0}
                >
                  <svg className="w-6 h-6 text-gray-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-3 shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 z-10"
                  disabled={effectiveCurrentSlide >= maxSlide}
                >
                  <svg className="w-6 h-6 text-gray-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* 페이지 인디케이터 - 6개만 표시 */}
            {filteredReviews.length > visibleItems && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: 6 }, (_, index) => {
                  const isVisible = index >= effectiveCurrentSlide && index < effectiveCurrentSlide + visibleItems;
                  const isCurrent = index === effectiveCurrentSlide;
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 transform hover:scale-125 ${
                        isCurrent
                          ? 'bg-blue-500 scale-125 shadow-md' 
                          : isVisible 
                            ? 'bg-blue-300'
                            : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
        </div>

        {/* 후기 작성 모달 */}
      {showWriteModal && (
        <ReviewWriteModal 
          isOpen={showWriteModal}
          isClosing={isModalClosing}
          onClose={closeWriteModal}
          onSubmit={handleSubmitReview}
          currentUser={currentUser}
        />
      )}
      </section>
    </>
  );
}

// 후기 작성 모달 컴포넌트
interface ReviewFormData {
  content: string;
  rating: number;
  selectedTags: string[];
  images?: File[];
}

function ReviewWriteModal({ isOpen, isClosing, onClose, onSubmit, currentUser }: {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewFormData) => void;
  currentUser: User | null;
}) {
  const [formData, setFormData] = useState<ReviewFormData>({
    content: '',
    rating: 0,
    selectedTags: [],
    images: []
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files); // 제한 없이 모든 파일 허용
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newFiles]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content || formData.rating === 0 || formData.selectedTags.length === 0) {
      alert('필수 항목을 모두 입력해주세요.\n* 별점 평가\n* 어떤 점이 좋았는지 선택\n* 상세한 후기 내용\n\n※ 사진 첨부는 선택사항입니다.');
      return;
    }
    if (formData.content.trim().length < 30) {
      alert('후기는 최소 30자 이상 작성해 주세요.');
      return;
    }
    
    // 사진은 선택사항임을 명시
    console.log('📝 후기 제출:', {
      content: formData.content,
      rating: formData.rating,
      selectedTags: formData.selectedTags,
      hasImages: formData.images && formData.images.length > 0
    });
    
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className={`bg-white rounded-lg p-8 max-w-4xl w-[85vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}>
        {/* 헤더 */}
        <div className="text-center mb-8 relative">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">소중한 후기를 남겨주세요</h2>
          <p className="text-sm text-gray-600">다른 학부모님에게 큰 도움이 됩니다.</p>
          
          {/* 닫기 버튼 */}
          <button 
            onClick={onClose}
            className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* 사용자 정보 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
            <span className="text-gray-600 text-sm">👤</span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {currentUser && currentUser.email ? (currentUser.email.split('@')[0] + '00') : '사용자00'} 치료사
            </div>
            <div className="text-sm text-gray-600">언어치료 / 2025.08.04 ~ 2025.09.04</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 만족도 별점 */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-4">수업은 만족스러우셨나요?</label>
            <div className="flex justify-center gap-2 mb-2">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    console.log(`별점 클릭: ${star}점`);
                    setFormData(prev => ({...prev, rating: star}));
                  }}
                  className={`text-3xl transition-all duration-200 hover:scale-110 cursor-pointer select-none ${
                    star <= formData.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* 좋았던 점 태그 */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-4">어떤 점이 좋았나요? <span className="text-sm text-gray-500">(중복 선택 가능)</span></label>
            <div className="flex flex-wrap gap-2">
              {['친절해요', '체계적이에요', '시간 약속을 잘 지켜요', '아이가 좋아해요', '꼼꼼한 피드백', '준비가 철저해요'].map(tag => {
                const isSelected = formData.selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        // 선택 해제
                        setFormData({
                          ...formData, 
                          selectedTags: formData.selectedTags.filter(t => t !== tag)
                        });
                      } else {
                        // 선택 추가
                        setFormData({
                          ...formData, 
                          selectedTags: [...formData.selectedTags, tag]
                        });
                      }
                    }}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105 ${
                      isSelected
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 보상 안내 문구 (연한 파란색 박스 + 중앙 정렬) */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-sm text-black">
              후기 2건 작성 시 <span className="text-blue-600 font-semibold">인터뷰권 1회</span>가 증정됩니다! <span className="font-extrabold">(회원당 최대 3회)</span>
            </p>
            <p className="text-xs text-black mt-1">단, 후기는 최소 30자 이상 작성해주셔야 해요.</p>
          </div>

          {/* 상세 후기 */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">상세한 후기를 남겨주세요</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="수업을 통해 아이가 어떻게 변화했는지, 어떤 점이 특히 만족스러웠는지 등을 자세히 알려주세요."
              rows={6}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm transition-all duration-200"
              required
            />
            <div className={`mt-1 text-xs ${formData.content.trim().length < 30 ? 'text-red-500' : 'text-gray-500'}`}>
              최소 30자 이상 (현재 {formData.content.trim().length}자)
            </div>
          </div>

          {/* 사진 첨부 */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">사진 첨부 <span className="text-sm text-gray-500">(선택, 최대 3개)</span></label>
            
            {/* 업로드된 이미지 미리보기 */}
            {formData.images && formData.images.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-3">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`업로드된 이미지 ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 파일 업로드 영역 */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-all duration-200 hover:bg-gray-50">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="text-gray-400 mb-2 text-2xl">
                  📷
                </div>
                <div className="text-sm text-gray-600">
                  클릭하여 이미지 업로드 ({formData.images?.length || 0}개 선택됨)
                </div>
              </label>
            </div>
          </div>

          {/* 등록 버튼 */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={formData.rating === 0 || formData.selectedTags.length === 0 || formData.content.trim().length < 30}
              className={`w-full py-4 text-white text-lg font-medium rounded-lg transition-all duration-200 ${
                formData.rating === 0 || formData.selectedTags.length === 0 || formData.content.trim().length < 30
                  ? 'bg-cyan-300 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-600 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              후기 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
