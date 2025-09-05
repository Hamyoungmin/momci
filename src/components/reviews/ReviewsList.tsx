'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function ReviewsList() {
  const [selectedCategory] = useState('전체');
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const categories = ['전체', '언어치료', '놀이치료', '감각통합치료', '작업치료', 'ABA치료', '미술치료', '음악치료'];

  // 사용자 인증 상태 관리
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 더미 데이터 추가 (첫 번째 이미지 스타일 확인용)
  const dummyReviews = [
    {
      id: 1,
      title: "놀기만 하는 아이, 선생님께서 놀이를 치료로 바뀌니깐 차근차근 치료받고 있습니다^^",
      content: "아이가 자연스럽게 놀면서 치료를 받을 수 있어서 좋았습니다. 처음에는 치료를 받는 것을 싫어했는데, 놀이를 통해 접근하니 아이가 즐거워하면서 치료를 받더라고요. 선생님께서 아이의 상태를 정확히 파악하시고 적절한 놀이를 통해 치료해 주셔서 정말 감사합니다.",
      rating: 5,
      author: "신대방역 임**님",
      date: "2025.01.20"
    },
    {
      id: 2,
      title: "선생님들을 보고 선택할 수 있어서 좋았습니다!",
      content: "직접 선생님의 이력과 경력을 보고 선택할 수 있다는 점이 정말 좋았습니다. 우리 아이에게 맞는 선생님을 직접 고를 수 있어서 더욱 신뢰가 갔고, 실제로도 아이가 선생님을 좋아해서 치료 효과도 좋았습니다.",
      rating: 5,
      author: "가람마을 임**님",
      date: "2025.01.18"
    },
    {
      id: 3,
      title: "좋은 선생님께서 서서 컨설팅도-",
      content: "선생님께서 아이의 상태를 정확히 진단해 주시고, 앞으로의 치료 방향에 대해서도 자세히 설명해 주셔서 정말 도움이 되었습니다. 부모로서 궁금했던 점들도 친절하게 답변해 주시고, 가정에서 할 수 있는 활동들도 알려주셔서 감사했습니다.",
      rating: 5,
      author: "방화동 구**님",
      date: "2025.01.15"
    },
    {
      id: 4,
      title: "전문적인 치료로 아이가 많이 좋아졌어요",
      content: "선생님의 전문성이 정말 뛰어나시더라고요. 체계적이고 과학적인 접근으로 우리 아이의 문제를 정확히 파악하고 치료해 주셨습니다.",
      rating: 5,
      author: "강남구 김**님",
      date: "2025.01.12"
    },
    {
      id: 5,
      title: "아이가 치료를 즐거워해요",
      content: "처음에는 치료를 싫어했던 아이가 이제는 선생님 만나는 날을 기다립니다. 재미있게 치료받으면서 실력도 늘고 있어요.",
      rating: 5,
      author: "서초구 박**님",
      date: "2025.01.10"
    },
    {
      id: 6,
      title: "세심한 케어에 감동받았습니다",
      content: "아이 하나하나의 특성을 잘 파악하시고 맞춤형 치료를 해주셔서 정말 감사했습니다. 부모 상담도 꼼꼼히 해주세요.",
      rating: 5,
      author: "송파구 이**님",
      date: "2025.01.08"
    },
    {
      id: 7,
      title: "체계적인 프로그램으로 효과가 확실해요",
      content: "다른 치료센터와는 달리 정말 체계적이고 과학적인 접근방법으로 치료를 진행해주셔서 눈에 띄는 효과를 볼 수 있었습니다. 매번 상세한 피드백도 주셔서 아이의 발전과정을 명확히 알 수 있어요.",
      rating: 5,
      author: "노원구 최**님",
      date: "2025.01.06"
    },
    {
      id: 8,
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
  ];

  // Firebase에서 실제 후기 데이터 가져오기 (임시 비활성화)
  useEffect(() => {
    // 더미 데이터로 설정
    setReviews(dummyReviews);
    setLoading(false);
    
    // 실제 Firebase 연동 (나중에 활성화)
    /*
    const reviewsQuery = query(
      collection(db, 'reviews'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setReviews(reviewsData);
      setLoading(false);
    });

    return () => unsubscribe();
    */
  }, []);

  // 후기 작성 모달 열기/닫기
  const openWriteModal = () => {
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

  // 후기 작성 제출 - 바로 승인됨
  const handleSubmitReview = async (reviewData: any) => {
    try {
      await addDoc(collection(db, 'reviews'), {
        ...reviewData,
        createdAt: serverTimestamp(),
        userId: user?.uid,
        userEmail: user?.email,
        helpfulCount: 0,
        status: 'approved' // 바로 승인 상태로 게시
      });
      
      alert('후기가 성공적으로 작성되었습니다!');
      closeWriteModal();
    } catch (error) {
      console.error('후기 작성 실패:', error);
      alert('후기 작성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const filteredReviews = selectedCategory === '전체' 
    ? reviews 
    : reviews.filter(review => review.category === selectedCategory);

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

  const getVisibleReviews = () => {
    return filteredReviews.slice(effectiveCurrentSlide, effectiveCurrentSlide + visibleItems);
  };

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
      `}</style>
      
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 - 첫 번째 이미지 스타일 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">실시간 모든별 키즈!</h2>
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
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
            categories={categories.filter(cat => cat !== '전체')}
          />
        )}
      </section>
    </>
  );
}

// 후기 작성 모달 컴포넌트
function ReviewWriteModal({ isOpen, isClosing, onClose, onSubmit, categories }: {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  categories: string[];
}) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    therapist: '',
    rating: 5,
    author: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.category) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className={`bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">후기 작성하기</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 카테고리 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              치료 종류 *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">치료 종류를 선택하세요</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* 별점 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              만족도 *
            </label>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  className={`text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ⭐
                </button>
              ))}
              <span className="text-sm text-gray-600 ml-2">({formData.rating}점)</span>
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              후기 제목 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="후기 제목을 입력하세요"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* 치료사 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              담당 치료사 (선택)
            </label>
            <input
              type="text"
              value={formData.therapist}
              onChange={(e) => setFormData({...formData, therapist: e.target.value})}
              placeholder="담당 치료사 이름"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 작성자 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              작성자명 (선택)
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              placeholder="작성자명 (미입력시 익명)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              후기 내용 *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="치료 경험에 대해 자세히 작성해주세요. 다른 학부모님들에게 도움이 되는 솔직한 후기를 남겨주시면 감사하겠습니다."
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              후기 작성
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
