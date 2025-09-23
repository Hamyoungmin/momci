'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTherapistVerificationMetrics, tryAutoVerifyTherapist } from '@/hooks/useTherapistVerificationMetrics';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface Post {
  id: string;
  treatment: string;
  region: string;
  age: string;
  gender: string;
  frequency: string;
  timeDetails: string;
  price: string;
  additionalInfo?: string;
  status: string;
  createdAt: Timestamp;
  applications: number;
}

interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Timestamp;
  status: string;
  otherParticipantName?: string;
  otherParticipantType?: string;
  postTitle?: string;
}

interface Application {
  id: string;
  postId: string;
  postTitle: string;
  postRegion: string;
  postAge: string;
  postGender: string;
  appliedAt: Timestamp;
  status: string;
}

interface ChatRequest {
  id: string;
  parentName: string;
  postTitle: string;
  requestedAt: Timestamp;
  status: string;
}

export default function MyPage() {
  const { currentUser, userData, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [chatsLoading, setChatsLoading] = useState(true);
  // 치료사가 지원한 게시글들
  const [appliedPosts, setAppliedPosts] = useState<Application[]>([]);
  const [appliedPostsLoading, setAppliedPostsLoading] = useState(true);
  // 새로운 채팅 요청들
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [chatRequestsLoading, setChatRequestsLoading] = useState(true);

  // 치료사 인증 메트릭 계산 (치료사 계정에서만 의미)
  const metrics = useTherapistVerificationMetrics(userData?.userType === 'therapist' ? currentUser?.uid : undefined);
  const matchesOK = metrics.totalMatches >= 3;
  const reviewsOK = metrics.reviewCount >= 2 && metrics.averageRating >= 4.5;
  const matchesWidth = Math.min(100, (metrics.totalMatches / 3) * 100);
  const ratingWidth = Math.min(100, (metrics.averageRating / 5) * 100);

  const renderVerificationCard = () => (
    <div className="mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-900 flex items-center">
            <span className="text-yellow-400 mr-2">⭐</span>
            모든별 인증 전문가가 되기
          </h3>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs" title="조건 충족 시 자동 등록">i</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <div className={`text-sm ${matchesOK ? 'text-gray-900' : 'text-gray-700'}`}>
                <span className={`${matchesOK ? 'text-blue-600' : 'text-gray-400'}`}>✓</span> 매칭 성공 3회 이상
              </div>
              <div className="text-sm font-medium text-gray-900">{metrics.totalMatches}회 / 3회</div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${matchesWidth}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className={`text-sm ${reviewsOK ? 'text-gray-900' : 'text-gray-700'}`}>
                <span className={`${reviewsOK ? 'text-blue-600' : 'text-gray-400'}`}>✓</span> 후기 평균 4.5점 이상 (최소 2개)
              </div>
              <div className="text-sm font-medium text-gray-900">{metrics.averageRating.toFixed(1)}점 / {metrics.reviewCount}개</div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${ratingWidth}%` }} />
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
            모든 조건을 달성하시면 &apos;모든별 인증 전문가&apos;로 즉시 자동 등록됩니다.
          </div>
        </div>

        {metrics.meetsCriteria && !(userData as { isVerified?: boolean } | null)?.isVerified && (
          <button
            onClick={() => currentUser && tryAutoVerifyTherapist(currentUser.uid)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg"
          >
            조건 달성! 인증 등록하기
          </button>
        )}
        {(userData as { isVerified?: boolean } | null)?.isVerified && (
          <div className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg p-2 text-center">
            ⭐ 이미 모든별 인증 전문가입니다
          </div>
        )}
      </div>
    </div>
  );

  // 조건 충족 시 자동 인증 반영 (한 번만 시도)
  useEffect(() => {
    if (!currentUser || userData?.userType !== 'therapist') return;
    const isVerified = (userData as { isVerified?: boolean } | null)?.isVerified;
    if (metrics.meetsCriteria && !isVerified) {
      tryAutoVerifyTherapist(currentUser.uid);
    }
  }, [metrics.meetsCriteria, currentUser, userData]);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/auth/login');
    }
  }, [currentUser, loading, router]);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  // 메뉴 클릭 핸들러
  const handleMenuClick = (path: string) => {
    // 이용권 관리 클릭 시 사용자 타입에 따라 적절한 페이지로 이동
    if (path === '/subscription-management' && userData) {
      if (userData.userType === 'parent') {
        router.push('/subscription-management?type=parent');
      } else if (userData.userType === 'therapist') {
        router.push('/subscription-management?type=therapist');
      } else {
        router.push('/subscription-management');
      }
    } else {
      router.push(path);
    }
  };

  // 내가 작성한 게시글 가져오기
  useEffect(() => {
    if (!currentUser) return;

    // orderBy 없이 간단한 쿼리 사용
      const postsQuery = query(
        collection(db, 'posts'),
        where('authorId', '==', currentUser.uid)
      );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const myPosts: Post[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        myPosts.push({
          id: doc.id,
          ...data
        } as Post);
      });

      // 클라이언트에서 정렬 (createdAt 기준)
      myPosts.sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.toDate() : new Date(0);
        const timeB = b.createdAt ? b.createdAt.toDate() : new Date(0);
        return timeB.getTime() - timeA.getTime();
      });

      setPosts(myPosts.slice(0, 3)); // 최대 3개만 표시
      setPostsLoading(false);
    }, (error) => {
      console.error('❌ 내 게시글 조회 오류:', error);
      // 에러가 발생해도 빈 배열로 설정하여 UI가 깨지지 않도록 함
      setPosts([]);
      setPostsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 치료사가 지원한 게시글 가져오기 (치료사만)
  useEffect(() => {
    if (!currentUser || !userData || userData.userType !== 'therapist') {
      setAppliedPostsLoading(false);
      return;
    }

    console.log('🎯 치료사가 지원한 게시글 가져오기 시작');
    
    const applicationsQuery = query(
      collection(db, 'applications'),
      where('therapistId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(applicationsQuery, async (snapshot) => {
      const applications: Application[] = [];
      
      for (const applicationDoc of snapshot.docs) {
        const applicationData = applicationDoc.data();
        
        // 해당 게시글 정보 가져오기
        try {
          const postDoc = await getDoc(doc(db, 'posts', applicationData.postId));
          if (postDoc.exists()) {
            const postData = postDoc.data();
            applications.push({
              id: applicationDoc.id,
              postId: applicationData.postId,
              postTitle: postData.title,
              postRegion: postData.region,
              postAge: postData.age,
              postGender: postData.gender,
              appliedAt: applicationData.createdAt,
              status: applicationData.status || 'pending'
            });
          }
        } catch (error) {
          console.error('게시글 정보 가져오기 오류:', error);
        }
      }
      
      // 지원 시간 기준으로 정렬
      applications.sort((a, b) => {
        const timeA = a.appliedAt ? a.appliedAt.toDate() : new Date(0);
        const timeB = b.appliedAt ? b.appliedAt.toDate() : new Date(0);
        return timeB.getTime() - timeA.getTime();
      });
      
      console.log('✅ 지원한 게시글 조회 완료:', applications.length, '개');
      setAppliedPosts(applications.slice(0, 3)); // 최대 3개만 표시
      setAppliedPostsLoading(false);
    }, (error) => {
      console.error('❌ 지원한 게시글 조회 오류:', error);
      setAppliedPosts([]);
      setAppliedPostsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, userData]);

  // 새로운 채팅 요청 가져오기 (치료사만)
  useEffect(() => {
    if (!currentUser || !userData || userData.userType !== 'therapist') {
      setChatRequestsLoading(false);
      return;
    }

    console.log('💬 새로운 채팅 요청 가져오기 시작');
    
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
      const requests: ChatRequest[] = [];
      
      for (const chatDoc of snapshot.docs) {
        const chatData = chatDoc.data();
        const otherParticipantId = chatData.participants?.find((id: string) => id !== currentUser.uid);
        
        // 상대방(학부모) 정보 가져오기
        if (otherParticipantId) {
          try {
            const userDoc = await getDoc(doc(db, 'users', otherParticipantId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              requests.push({
                id: chatDoc.id,
                parentName: userData.name || '익명',
                postTitle: chatData.postTitle || '게시글',
                requestedAt: chatData.createdAt || Timestamp.fromDate(new Date()),
                status: chatData.status
              });
            }
          } catch (error) {
            console.error('학부모 정보 가져오기 오류:', error);
          }
        }
      }
      
      // 요청 시간 기준으로 정렬
      requests.sort((a, b) => {
        const timeA = a.requestedAt ? a.requestedAt.toDate() : new Date(0);
        const timeB = b.requestedAt ? b.requestedAt.toDate() : new Date(0);
        return timeB.getTime() - timeA.getTime();
      });
      
      console.log('✅ 새로운 채팅 요청 조회 완료:', requests.length, '개');
      setChatRequests(requests.slice(0, 3)); // 최대 3개만 표시
      setChatRequestsLoading(false);
    }, (error) => {
      console.error('❌ 새로운 채팅 요청 조회 오류:', error);
      setChatRequests([]);
      setChatRequestsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, userData]);

  // 진행중인 채팅 가져오기
  useEffect(() => {
    if (!currentUser) return;

    // orderBy 없이 간단한 쿼리 사용
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
      const chatRooms: ChatRoom[] = [];
      
      for (const chatDoc of snapshot.docs) {
        const chatData = chatDoc.data();
        const otherParticipantId = chatData.participants?.find((id: string) => id !== currentUser.uid);
        
        // 상대방 정보 가져오기
        let otherParticipantName = '알 수 없음';
        let otherParticipantType = 'unknown';
        
        if (otherParticipantId) {
          try {
            const userDocRef = doc(db, 'users', otherParticipantId);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              otherParticipantName = userData.name || '이름 없음';
              otherParticipantType = userData.userType || 'unknown';
            }
          } catch (error) {
            console.error('상대방 정보 조회 오류:', error);
          }
        }

        chatRooms.push({
          id: chatDoc.id,
          participants: chatData.participants || [],
          lastMessage: chatData.lastMessage || '메시지가 없습니다',
          lastMessageTime: chatData.lastMessageTime || Timestamp.fromDate(new Date()),
          status: chatData.status || 'active',
          otherParticipantName,
          otherParticipantType,
          postTitle: chatData.postTitle || ''
        });
      }

      // 클라이언트에서 정렬 (lastMessageTime 기준)
      chatRooms.sort((a, b) => {
        const timeA = a.lastMessageTime ? a.lastMessageTime.toDate() : new Date(0);
        const timeB = b.lastMessageTime ? b.lastMessageTime.toDate() : new Date(0);
        return timeB.getTime() - timeA.getTime();
      });

      setChats(chatRooms.slice(0, 3)); // 최대 3개만 표시
      setChatsLoading(false);
    }, (error) => {
      console.error('❌ 채팅 목록 조회 오류:', error);
      // 에러가 발생해도 빈 배열로 설정하여 UI가 깨지지 않도록 함
      setChats([]);
      setChatsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 게시글 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'matching':
        return 'bg-blue-100 text-blue-800';
      case 'meeting':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '모집중';
      case 'matching':
        return '매칭중';
      case 'meeting':
        return '진행중';
      case 'completed':
        return '완료';
      default:
        return status;
    }
  };

  // 시간 포맷팅
  const formatTime = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate();
      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return date.toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
      } else if (diffDays === 1) {
        return '어제';
      } else if (diffDays < 7) {
        return `${diffDays}일 전`;
      } else {
        return date.toLocaleDateString('ko-KR', {
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (error) {
      console.error('시간 포맷팅 오류:', error);
      return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // 리디렉트 중
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 컨텐츠 영역 - 연한 파란색 배경 */}
        <div className="bg-blue-50 rounded-xl p-6">
          {/* 헤더 - 마이페이지 제목 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">📋 마이페이지</h1>
          </div>
          {/* 통합 프로필 및 메뉴 카드 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* 프로필 섹션 */}
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {userData?.name?.charAt(0) || currentUser.email?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {userData?.name || '함영민'} {userData?.userType === 'parent' ? '학부모님' : '선생님'}
              </h2>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              로그아웃
            </button>
          </div>

          {/* 모든별 인증 전문가가 되기 (치료사 전용) */}
          {/* 인증 카드(치료사 전용)는 프로필 카드 아래로 분리 렌더링합니다 */}

          
          <div className="space-y-4">
            {/* 이용권 관리 - 인증된 사용자만 표시 */}
            {userData && ['parent', 'therapist'].includes(userData.userType) && (
              <div 
                onClick={() => handleMenuClick('/subscription-management')}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">💳</span>
                  </div>
                  <span className="text-base font-medium text-gray-900">이용권 관리</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            )}

            {/* 회원정보 수정 */}
            <div 
              onClick={() => handleMenuClick('/profile/edit')}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <span className="text-base font-medium text-gray-900">회원정보 수정</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>

          {/* 후기 관리 (학부모 전용) */}
          {userData?.userType === 'parent' && (
            <div 
              onClick={() => handleMenuClick('/mypage/reviews')}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">⭐</span>
                </div>
                <span className="text-base font-medium text-gray-900">후기 관리</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          )}
          </div>
        </div>

        {userData?.userType === 'therapist' && renderVerificationCard()}

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {userData?.userType === 'therapist' ? '내가 지원한 곳' : '나의 요청글 관리'}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          {userData?.userType === 'therapist' ? (
            // 치료사용: 지원한 게시글
            appliedPostsLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">로딩 중...</p>
              </div>
            ) : appliedPosts.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-4xl text-gray-300 mb-2">🎯</div>
                <p className="text-gray-500">지원한 게시글이 없습니다</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {appliedPosts.map((application) => (
                  <div key={application.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{application.postTitle}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status === 'accepted' ? '승인됨' :
                         application.status === 'rejected' ? '거절됨' : '대기중'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {application.postRegion} • {application.postAge} • {application.postGender}
                    </div>
                    <div className="text-xs text-gray-400">
                      {application.appliedAt ? new Date(application.appliedAt.toDate()).toLocaleDateString() : '날짜 없음'}
                    </div>
                  </div>
                ))}
                <div className="p-4 text-center">
                  <button 
                    onClick={() => router.push('/mypage/applications')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    전체 지원 내역 보기
                  </button>
                </div>
              </div>
            )
          ) : (
            // 학부모용: 기존 게시글 관리
            postsLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">로딩 중...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-4xl text-gray-300 mb-2">📝</div>
                <p className="text-gray-500">작성한 게시글이 없습니다</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
                    onClick={() => router.push(`/request?postId=${post.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push(`/request?postId=${post.id}`); }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-gray-900 mb-1">
                          {post.age} {post.gender === '남' ? '남아' : '여아'}, {post.treatment} 홈티 구합니다.
                        </h3>
                        <p className="text-sm text-gray-500">
                          {post.createdAt?.toDate?.()?.toLocaleDateString('ko-KR')} | 지원자 {post.applications}명
                        </p>
                      </div>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {getStatusText(post.status)}
                      </span>
                    </div>
                  </div>
                ))}
                {posts.length > 0 && (
                  <div className="p-4">
                    <button 
                      onClick={() => handleMenuClick('/mypage/my-posts')}
                      className="w-full text-center text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      더보기
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* 사용자 타입에 따른 두 번째 섹션 제목 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {userData?.userType === 'therapist' ? '새로운 1:1 채팅 요청' : '진행중인 채팅'}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          {userData?.userType === 'therapist' ? (
            // 치료사용: 새로운 채팅 요청
            chatRequestsLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">로딩 중...</p>
              </div>
            ) : chatRequests.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-4xl text-gray-300 mb-2">💬</div>
                <p className="text-gray-500">새로운 채팅 요청이 없습니다</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {chatRequests.map((request) => (
                  <div 
                    key={request.id}
                    onClick={() => router.push(`/chat/${request.id}`)}
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-sm font-medium">
                          {request.parentName?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-base font-medium text-gray-900">
                            {request.parentName} 학부모님
                          </h3>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            새 요청
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {request.postTitle}
                        </p>
                        <div className="text-xs text-gray-400 mt-1">
                          {request.requestedAt ? new Date(request.requestedAt.toDate()).toLocaleDateString() : '날짜 없음'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-4 text-center">
                  <button 
                    onClick={() => router.push('/mypage/chat-requests')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    모든 채팅 요청 보기
                  </button>
                </div>
              </div>
            )
          ) : (
            // 학부모용: 기존 진행중인 채팅
            chatsLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">로딩 중...</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-4xl text-gray-300 mb-2">💬</div>
                <p className="text-gray-500">진행중인 채팅이 없습니다</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {chats.map((chat) => (
                  <div 
                    key={chat.id}
                    onClick={() => router.push(`/chat/${chat.id}`)}
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 text-sm font-medium">
                          {chat.otherParticipantName?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-base font-medium text-gray-900">
                            {chat.otherParticipantName} 치료사
                          </h3>
                          <span className="text-sm text-gray-500">
                            {formatTime(chat.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {chat.id.includes('completed') ? (
                          <span className="text-orange-500 text-sm font-medium">접수완료</span>
                        ) : (
                          <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                            1
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {chats.length > 0 && (
                  <div className="p-4">
                    <button 
                      onClick={() => handleMenuClick('/mypage/chat')}
                      className="w-full text-center text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      더보기
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
