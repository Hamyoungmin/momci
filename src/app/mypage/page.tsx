'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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

export default function MyPage() {
  const { currentUser, userData, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [chatsLoading, setChatsLoading] = useState(true);

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

          {/* 메뉴 섹션 */}
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
          </div>
        </div>

        {/* 나의 요청글 관리 섹션 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">나의 요청글 관리</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          {postsLoading ? (
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
                <div key={post.id} className="p-4">
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
          )}
        </div>

        {/* 진행중인 채팅 섹션 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">진행중인 채팅</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          {chatsLoading ? (
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
          )}
        </div>
        </div> {/* 컨텐츠 영역 - 연한 파란색 배경 끝 */}
      </div>
    </div>
  );
}
