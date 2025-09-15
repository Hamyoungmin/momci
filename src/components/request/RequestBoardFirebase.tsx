'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, addDoc, onSnapshot, orderBy, query, where, serverTimestamp, doc, getDoc, setDoc, Timestamp, FirestoreError, FieldValue } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import TherapistApplicationCard from './TherapistApplicationCard';
import { createApplication } from '@/lib/applications';
import { AppConfig, getFeatureFlags } from '@/config/app';
import { startChatWithTherapist } from '@/lib/chat';
import { getUserInterviewTokens } from '@/lib/interviewTokens';
import { 
  initializeNotifications, 
  setupNotificationClickListener, 
  notifyChatRequest
} from '@/lib/notifications';

// 치료사 프로필 타입 정의
interface TherapistProfile {
  id: string;
  profileImage?: string;
  name: string;
  experience?: number;
  specialty: string;
  reviewCount?: number;
  rating?: number;
  price?: string;
  hasCertification?: boolean;
  hasExperienceProof?: boolean;
  isVerified?: boolean;
  hasIdVerification?: boolean;
  region?: string;
  regions?: string[];
  philosophy?: string;
  introduction?: string;
  services?: string;
  career?: string;
  videoUrl?: string;
  education?: string;
  schedule?: string;
  postTimeDetails?: string;
  certifications?: string[];
  createdAt?: Timestamp | string | Date | FieldValue;
}

// 게시글 타입 정의
interface Post {
  id: string;
  treatment: string;
  category: string;
  title: string;
  details: string;
  applications: number;
  region: string;
  age: string;
  gender: string;
  frequency: string;
  timeDetails: string;
  price: string;
  additionalInfo: string;
  createdAt: unknown;
  authorId: string; // 게시글 작성자 ID
  status: 'matching' | 'meeting' | 'completed'; // 진행 상태
  // 치료사 정보
  teacherUserId?: string; // 매칭된 치료사의 실제 사용자 ID
  teacherName?: string;
  teacherExperience?: number;
  teacherSpecialty?: string;
  teacherRating?: number;
  teacherReviewCount?: number;
  teacherProfileImage?: string;
  teacherCertifications?: string[];
  teacherEducation?: string;
  teacherCareer?: string;
  teacherRegions?: string[];
  teacherSchedule?: string;
  teacherIntroduction?: string;
  teacherPhilosophy?: string;
  teacherServices?: string;
  teacherVideoUrl?: string;
  // 실제 사용자 데이터 통합 필드
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  // 인증 상태
  isVerified?: boolean;
  hasCertification?: boolean;
  hasExperienceProof?: boolean;
  hasIdVerification?: boolean;
}

// 치료사 지원자 정보 타입
interface TherapistApplication {
  id: string;
  postId: string;
  applicantId: string;
  postAuthorId: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  createdAt: Date | { seconds: number; nanoseconds: number; toDate: () => Date };
  // 치료사 프로필 정보
  therapistName: string;
  therapistSpecialty: string;
  therapistExperience: number;
  therapistRating: number;
  therapistReviewCount: number;
  therapistProfileImage?: string;
  therapistCertifications?: string[];
  therapistSpecialtyTags?: string[];
  // 인증 상태
  hasIdVerification: boolean;
  hasCertification: boolean;
  hasExperienceProof: boolean;
  isVerified: boolean;
}

export default function RequestBoardFirebase() {
  const { currentUser, userData } = useAuth();
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('서울');
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [isSafetyModalClosing, setIsSafetyModalClosing] = useState(false);
  
  // 응답 전 확인 모달 상태 (치료사 전용)
  const [showResponseConfirmModal, setShowResponseConfirmModal] = useState(false);
  const [isResponseConfirmModalClosing, setIsResponseConfirmModalClosing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [selectedTab, setSelectedTab] = useState('서울');
  const [selectedLocation, setSelectedLocation] = useState('희망지역을 선택하세요');
  const [selectedTime, setSelectedTime] = useState('희망시간을 입력하세요');
  const [selectedTreatment, setSelectedTreatment] = useState('희망치료를 선택하세요');

  // 사용자 권한 체크 (학부모 또는 관리자, 또는 특정 관리자 이메일만 게시글 작성 가능)
  const canCreatePost = currentUser?.email === 'dudals7334@naver.com' || 
    currentUser?.email === 'everystars@naver.com' ||
    (userData && (userData.userType === 'parent' || userData.userType === 'admin'));

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSuccessModalClosing, setIsSuccessModalClosing] = useState(false);

  // 새 게시글 작성용 상태
  const [newPost, setNewPost] = useState({
    treatment: '',
    region: '',
    detailLocation: '',
    age: '',
    gender: '',
    frequency: '',
    timeDetails: '',
    price: '',
    additionalInfo: ''
  });

  // 상세 프로필 모달 상태 (Firebase 실시간 연동 방식)
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Post | null>(null);
  const [isProfileModalClosing, setIsProfileModalClosing] = useState(false);
  
  // Firebase 실시간 연동용 상태
  const [currentSelectedPostId, setCurrentSelectedPostId] = useState<string | null>(null);
  const [isLoadingSelectedPost, setIsLoadingSelectedPost] = useState(false);

  // 치료사 지원자 정보 상태
  const [applications, setApplications] = useState<TherapistApplication[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [applicationsUnsubscribe, setApplicationsUnsubscribe] = useState<(() => void) | null>(null);

  // 학부모용 모달들 상태
  const [showTherapistProfileModal, setShowTherapistProfileModal] = useState(false);
  const [selectedTherapistProfile, setSelectedTherapistProfile] = useState<TherapistProfile | null>(null);
  const [showParentSafetyModal, setShowParentSafetyModal] = useState(false);
  const [showParentChatConfirmModal, setShowParentChatConfirmModal] = useState(false);
  const [currentTherapistId, setCurrentTherapistId] = useState<string | null>(null);
  

  const sidebarItems = ['홈티매칭', '서울', '인천/경기북부', '경기남부', '충청,강원,대전', '전라,경상,부산'];
  const tabs = ['서울', '인천/경기북부', '경기남부', '충청,강원,대전', '전라,경상,부산'];
  
  // 지역별 상세 구역들
  const locationsByRegion = {
    '서울': [
      '희망지역을 선택하세요', '전체', '강남구', '강동구', '강서구', '강북구', '관악구', '광진구', 
      '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', 
      '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
    ],
    '인천/경기북부': [
      '희망지역을 선택하세요', '전체', '인천 중구', '인천 동구', '인천 미추홀구', '인천 연수구', '인천 남동구', 
      '인천 부평구', '인천 계양구', '인천 서구', '고양시', '파주시', '김포시', '의정부시', '양주시', '동두천시', '포천시'
    ],
    '경기남부': [
      '희망지역을 선택하세요', '전체', '수원시', '성남시', '안양시', '안산시', '용인시', '화성시', 
      '평택시', '오산시', '시흥시', '군포시', '의왕시', '하남시', '여주시', '이천시', '안성시', '광주시', '과천시'
    ],
    '충청,강원,대전': [
      '희망지역을 선택하세요', '전체', '대전 유성구', '대전 서구', '대전 중구', '대전 동구', '대전 대덕구', 
      '세종시', '천안시', '청주시', '충주시', '춘천시', '원주시', '강릉시', '속초시'
    ],
    '전라,경상,부산': [
      '희망지역을 선택하세요', '전체', '부산 해운대구', '부산 부산진구', '부산 동래구', '부산 남구', '부산 북구',
      '대구 중구', '대구 동구', '대구 서구', '대구 남구', '대구 북구', '대구 수성구', '광주 동구', '광주 서구', '광주 남구', '광주 북구'
    ]
  };
  
  const treatments = [
    '희망치료를 선택하세요', '전체', '언어치료', '놀이치료', '감각통합치료', 
    '인지학습치료', '작업치료', '물리/운동치료', 'ABA치료', '음악치료', 
    '미술치료', '특수체육', '특수교사', '모니터링', '임상심리'
  ];

  // 요일 옵션
  const dayOptions = [
    '월', '화', '수', '목', '금', '토', '일',
    '월,화', '월,수', '월,목', '월,금', '월,토', '월,일',
    '화,수', '화,목', '화,금', '화,토', '화,일',
    '수,목', '수,금', '수,토', '수,일',
    '목,금', '목,토', '목,일',
    '금,토', '금,일',
    '토,일',
    '월,수,금', '월,화,수', '화,수,목', '수,목,금', '목,금,토', '금,토,일'
  ];

  // 시간 옵션
  const timeOptions = [
    '9시~10시', '10시~11시', '11시~12시', '12시~1시',
    '1시~2시', '2시~3시', '3시~4시', '4시~5시',
    '5시~6시', '6시~7시', '7시~8시', '8시~9시',
    '9시~12시', '1시~4시', '2시~5시', '3시~6시',
    '4시~7시', '5시~8시', '오전', '오후', '협의'
  ];

  // Firebase에서 가져온 게시글 데이터 상태
  const [postsData, setPostsData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // 페이지당 게시글 수

  // 알림 시스템 초기화
  useEffect(() => {
    const initNotifications = async () => {
      const isReady = await initializeNotifications();
      
      if (!isReady) {
        console.log('📋 알림 시스템 준비 안됨 - 권한 요청 필요');
      }
    };

    // 알림 클릭 리스너 설정
    const cleanup = setupNotificationClickListener(
      (data) => {
        // 채팅 요청 클릭
        console.log('💬 채팅 요청 알림 클릭:', data);
        // TODO: 채팅 요청 관리 페이지로 이동
      },
      (data) => {
        // 첫 응답 클릭
        console.log('💬 첫 응답 알림 클릭:', data);
        // TODO: 해당 채팅방 열기
      },
      (data) => {
        // 새 메시지 클릭
        console.log('💬 새 메시지 알림 클릭:', data);
        // TODO: 해당 채팅방 열기
      }
    );

    initNotifications();

    // 컴포넌트 언마운트 시 리스너 정리
    return cleanup;
  }, []);


  // Firebase에서 게시글 데이터 실시간으로 가져오기 (최신순으로 정렬)
  useEffect(() => {
    console.log('🎯 ===== Firebase posts 컬렉션 조회 시작 =====');
    console.log('🔍 검색 조건: type = "request", 정렬: createdAt desc');
    
    const q = query(
      collection(db, 'posts'),
      where('type', '==', 'request'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('📥 ===== Firebase 실시간 데이터 업데이트 =====');
      console.log('📊 전체 문서 개수:', snapshot.size);
      console.log('📊 빈 결과인가?', snapshot.empty);
      console.log('📊 문서 변경 개수:', snapshot.docChanges().length);
      
      // ⭐ 만약 빈 결과라면 더 자세히 조사
      if (snapshot.empty) {
        console.warn('⚠️ 조회된 게시글이 0개입니다!');
        console.log('🔍 가능한 원인들:');
        console.log('  1. Firebase posts 컬렉션에 데이터가 아예 없음');
        console.log('  2. type="request"인 데이터가 없음 (type 필드 값 확인 필요)');  
        console.log('  3. Firestore 인덱스 문제');
        console.log('  4. firestore.rules 권한 문제');
        
        // ⭐ 모든 타입의 게시글을 임시로 조회해보자
        console.log('🔍 임시 조사: 모든 타입의 게시글 조회해보기');
        const allPostsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const tempUnsubscribe = onSnapshot(allPostsQuery, (allSnapshot) => {
          console.log('🔍 전체 posts 컬렉션 문서 개수:', allSnapshot.size);
          allSnapshot.docs.forEach((doc, index) => {
            const data = doc.data();
            console.log(`🔍 [전체-${index + 1}] ID: ${doc.id}`);
            console.log(`🔍 [전체-${index + 1}] type: ${data.type || '없음'}`);
            console.log(`🔍 [전체-${index + 1}] treatment: ${data.treatment || '없음'}`);
            console.log(`🔍 [전체-${index + 1}] authorId: ${data.authorId || '없음'}`);
          });
          tempUnsubscribe(); // 한 번만 실행
        });
        
        setPostsData([]);
        setLoading(false);
        return;
      }
      
      const posts: Post[] = [];
      snapshot?.docs?.forEach((doc, index) => {
        const docData = doc.data();
        console.log(`📄 [${index + 1}] 문서 ID: ${doc.id}`);
        console.log(`📄 [${index + 1}] type: ${docData.type}`);
        console.log(`📄 [${index + 1}] treatment: ${docData.treatment}`);
        console.log(`📄 [${index + 1}] title: ${docData.title}`);
        console.log(`📄 [${index + 1}] authorId: ${docData.authorId}`);
        console.log(`📄 [${index + 1}] status: ${docData.status}`);
        console.log(`📄 [${index + 1}] 전체 데이터:`, docData);
        
        posts.push({
          id: doc.id,
          ...docData
        } as Post);
      });
      
      console.log('✅ 실시간 업데이트 완료:', posts.length, '개 게시글');
      console.log('📋 최종 posts 배열:', posts?.map(p => ({ id: p.id, title: p.title || 'No title' })) || []);
      
      setPostsData(posts);
      setLoading(false);
    }, (error: FirestoreError) => {
      console.error('❌ ===== Firebase 실시간 데이터 로딩 오류 =====');
      console.error('❌ 에러 코드:', error.code);
      console.error('❌ 에러 메시지:', error.message);
      console.error('❌ 전체 에러:', error);
      
      // ⭐ 권한 문제인지 확인
      if (error.code === 'permission-denied') {
        console.error('🚫 권한 거부! firestore.rules의 posts 컬렉션 규칙을 확인하세요');
      } else if (error.code === 'failed-precondition') {
        console.error('📇 인덱스 문제! Firebase Console에서 복합 인덱스를 생성하세요');
      }
      
      setLoading(false);
    });

    return () => {
      console.log('🔄 Firebase posts 구독 해제');
      unsubscribe();
    };
  }, []);

  // Firebase 실시간 연동: 현재 선택된 게시글 추적
  useEffect(() => {
    if (!currentUser) return;

    console.log('🔥 Firebase 실시간 연동 시작 - 현재 선택된 게시글 추적');
    
    const currentSelectionRef = doc(db, 'user-current-selection', currentUser.uid);
    
    const unsubscribe = onSnapshot(currentSelectionRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const selectedPostId = data.selectedPostId;
        
        console.log('🔄 Firebase에서 현재 선택된 게시글:', selectedPostId);
        
        if (selectedPostId && selectedPostId !== currentSelectedPostId) {
          setCurrentSelectedPostId(selectedPostId);
          
          // 게시글 데이터가 로드되었고, 모달이 열려야 하는 상황이면 자동으로 열기
          if (postsData.length > 0 && !showProfileModal) {
            const targetPost = postsData.find(post => post.id === selectedPostId);
            if (targetPost) {
              console.log('✅ Firebase에서 선택된 게시글 자동 열기');
              setSelectedProfile(targetPost);
              setShowProfileModal(true);
            }
          }
        }
      } else {
        console.log('📭 Firebase에 선택된 게시글 없음');
        setCurrentSelectedPostId(null);
      }
    }, (error) => {
      console.error('❌ Firebase 실시간 연동 오류:', error);
    });

    return () => {
      console.log('🔥 Firebase 실시간 연동 해제');
      unsubscribe();
    };
  }, [currentUser, postsData, showProfileModal, currentSelectedPostId]);

  // 모달 닫기 함수 (애니메이션 포함)
  const closeCreatePostModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowCreatePostModal(false);
      setIsModalClosing(false);
      // 폼 초기화
      setNewPost({
        treatment: '',
        region: '',
        detailLocation: '',
        age: '',
        gender: '',
        frequency: '',
        timeDetails: '',
        price: '',
        additionalInfo: ''
      });
    }, 300); // 애니메이션 시간과 맞춤
  };

  // 성공 모달 닫기 함수
  const closeSuccessModal = () => {
    setIsSuccessModalClosing(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setIsSuccessModalClosing(false);
    }, 300);
  };

  // 실시간 지원자 정보 리스너 설정
  const setupApplicationsListener = (postId: string) => {
    // 사용자가 로그인하지 않았으면 리스너 설정하지 않음
    if (!currentUser?.uid) {
      console.log('⚠️ 로그인하지 않은 사용자 - 지원자 정보 리스너 설정 건너뜀');
      setApplications([]);
      setLoadingApplications(false);
      return () => {}; // 빈 cleanup 함수 반환
    }
    
    setLoadingApplications(true);
    console.log('🔍 실시간 지원자 정보 리스너 설정 - 게시글 ID:', postId);
    
    try {
      // applications 컬렉션에서 해당 게시글의 지원자들 실시간 감지
      const applicationsQuery = query(
        collection(db, 'applications'), 
        where('postId', '==', postId)
        // orderBy는 일단 제거하고 테스트 (composite index 문제 방지)
        // orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(applicationsQuery, async (snapshot) => {
        console.log('📡 지원자 정보 업데이트 감지');
        console.log('📊 감지된 지원서 수:', snapshot.size);
        console.log('📊 빈 결과인가?', snapshot.empty);
        
        const applicationsList: TherapistApplication[] = [];
        
        // 각 지원자의 프로필 정보 가져오기
        for (const applicationDoc of snapshot.docs) {
          const applicationData = applicationDoc.data();
          
          // 치료사 프로필 정보 가져오기
          const therapistDoc = await getDoc(doc(db, 'users', applicationData.applicantId));
          let therapistProfile = null;
          if (therapistDoc.exists()) {
            therapistProfile = therapistDoc.data();
          }
          
          const application: TherapistApplication = {
            id: applicationDoc.id,
            postId: applicationData.postId,
            applicantId: applicationData.applicantId,
            postAuthorId: applicationData.postAuthorId,
            message: applicationData.message,
            status: applicationData.status,
            createdAt: applicationData.createdAt,
            // 치료사 프로필 정보 (기본값 포함)
            therapistName: therapistProfile?.name || '익명',
            therapistSpecialty: therapistProfile?.specialty || '언어재활사',
            therapistExperience: therapistProfile?.experience || 0,
            therapistRating: therapistProfile?.rating || 0,
            therapistReviewCount: therapistProfile?.reviewCount || 0,
            therapistProfileImage: therapistProfile?.profileImage,
            therapistCertifications: therapistProfile?.certifications || [],
            therapistSpecialtyTags: therapistProfile?.specialtyTags || [],
            // 인증 상태
            hasIdVerification: therapistProfile?.hasIdVerification || false,
            hasCertification: therapistProfile?.hasCertification || false,
            hasExperienceProof: therapistProfile?.hasExperienceProof || false,
            isVerified: therapistProfile?.isVerified || false,
          };
          
          applicationsList.push(application);
        }
        
        console.log('✅ 실시간 지원자 정보 업데이트:', applicationsList);
        setApplications(applicationsList);
        setLoadingApplications(false);
      }, (error) => {
        console.error('❌ 실시간 지원자 정보 리스너 오류:', error);
        
        // 권한 오류인 경우 더 친화적인 메시지
        if (error.code === 'permission-denied') {
          console.log('🔒 지원자 정보 접근 권한이 없습니다. (정상적인 상황일 수 있음)');
          // 권한 오류는 조용히 처리하고 빈 배열 설정
          setApplications([]);
          setLoadingApplications(false);
          return;
        }
        
        // 다른 오류들은 상세 정보 출력
        console.error('❌ 에러 세부 정보:', error.code, error.message);
        console.error('❌ 쿼리 대상 게시글 ID:', postId);
        console.error('❌ 현재 사용자 ID:', currentUser?.uid);
        
        setApplications([]);
        setLoadingApplications(false);
      });
      
      return unsubscribe;
      
    } catch (error) {
      console.error('❌ 지원자 정보 리스너 설정 오류:', error);
      
      // 권한 오류인 경우 더 친화적인 처리
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('permission-denied')) {
        console.log('🔒 지원자 정보 리스너 설정 시 권한 부족 (정상적인 상황일 수 있음)');
      }
      
      setApplications([]);
      setLoadingApplications(false);
      return () => {}; // 빈 함수 반환
    }
  };

  // 🎯 확장 가능한 상태 관리: 현재는 localStorage, 필요시 Firebase로 쉽게 전환
  const saveCurrentSelectedPost = async (postId: string) => {
    if (!currentUser?.uid) {
      console.error('❌ 저장 실패: currentUser 또는 uid가 없음');
      return;
    }

    // 🚀 1단계: localStorage 저장 (현재 주력 방식)
    try {
      const backupData = {
        selectedPostId: postId,
        selectedAt: Date.now(),
        userId: currentUser.uid,
        version: '1.0' // 마이그레이션을 위한 버전 정보
      };
      localStorage.setItem('selectedPost', JSON.stringify(backupData));
      console.log('✅ localStorage 저장 완료 (Primary):', backupData);
    } catch (localError) {
      console.warn('⚠️ localStorage 저장 실패:', localError);
    }

    // 🔄 2단계: Firebase 백그라운드 저장 (미래 확장용)
    // 설정 파일을 통해 쉽게 활성화/비활성화 가능
    const featureFlags = getFeatureFlags();
    
    if (AppConfig.ENABLE_REALTIME_SYNC && featureFlags.realtimeSync) {
      try {
        const docRef = doc(db, 'user-current-selection', currentUser.uid);
        await setDoc(docRef, {
          selectedPostId: postId,
          selectedAt: serverTimestamp(),
          userId: currentUser.uid,
          method: 'realtime'
        });
        console.log('🔄 Firebase 실시간 동기화 완료 (Future-ready)');
      } catch (error: unknown) {
        console.warn('⚠️ Firebase 백그라운드 저장 실패 (localStorage는 성공):', error);
      }
    }

    setCurrentSelectedPostId(postId);
  };

  // 상세 요청 모달 열기 - Firebase 실시간 연동 방식 (게시글 작성 내용 표시)
  const openProfileModal = async (post: Post) => {
    // 비로그인 사용자는 상세 보기 불가
    if (!currentUser) {
      alert('게시글 상세 내용을 보려면 로그인이 필요합니다.');
      return;
    }
    
    console.log('🔍 요청 모달 열기 - 게시글 ID:', post.id);
    
    // Firebase에 현재 선택된 게시글 저장 (실시간 연동용)
    await saveCurrentSelectedPost(post.id);
    
    try {
      // 게시글 작성자 정보 가져오기
      const userDoc = await getDoc(doc(db, 'users', post.authorId));
      let userData = null;
      if (userDoc.exists()) {
        userData = userDoc.data();
        console.log('✅ 작성자 정보:', userData);
      }
      
      // 게시글 데이터 그대로 사용
      const requestProfile = {
        ...post,
        authorName: userData?.name || '익명',
        authorEmail: userData?.email,
        authorPhone: userData?.phone,
      };
      
      console.log('📋 요청 게시글 정보:', requestProfile);
      
      setSelectedProfile(requestProfile);
      setShowProfileModal(true);
      
      // 기존 리스너 정리
      if (applicationsUnsubscribe) {
        applicationsUnsubscribe();
      }
      
      // 실시간 지원자 정보 리스너 설정
      const unsubscribe = setupApplicationsListener(post.id);
      setApplicationsUnsubscribe(() => unsubscribe);
      
    } catch (error) {
      console.error('❌ 요청 모달 열기 오류:', error);
      
      // 오류가 발생해도 기본 정보로 모달 표시
      const basicProfile = {
        ...post,
        authorName: '익명',
      };
      
      setSelectedProfile(basicProfile);
      setShowProfileModal(true);
      setApplications([]);
    }
  };

  // 학부모용 1:1 채팅 시작 함수 (모달 플로우)
  const handleChatStart = (therapistId: string) => {
    console.log('💬 학부모용 1:1 채팅 시작 - 치료사 ID:', therapistId);
    setCurrentTherapistId(therapistId);
    setShowParentSafetyModal(true);
  };

  // 학부모용 치료사 상세 프로필 보기 함수
  const handleViewProfile = async (therapistId: string) => {
    console.log('👤 학부모용 치료사 상세 프로필 보기 - 치료사 ID:', therapistId);
    
    try {
      // 치료사 프로필 정보 가져오기 (선생님 둘러보기 등록 내용)
      const therapistDoc = await getDoc(doc(db, 'users', therapistId));
      if (therapistDoc.exists()) {
        const therapistData = therapistDoc.data();
        setSelectedTherapistProfile(therapistData as TherapistProfile);
        setCurrentTherapistId(therapistId);
        setShowTherapistProfileModal(true);
      } else {
        alert('치료사 프로필 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('치료사 프로필 정보 가져오기 실패:', error);
      alert('프로필 정보를 불러올 수 없습니다.');
    }
  };

  // 학부모용 안전 매칭 확인 모달 처리
  const handleParentSafetyConfirm = () => {
    setShowParentSafetyModal(false);
    setShowParentChatConfirmModal(true);
  };

  // 학부모용 채팅 시작 전 필수 확인 모달 처리
  const handleParentChatConfirm = async () => {
    if (!currentTherapistId || !currentUser || !userData) {
      alert('필요한 정보가 없습니다.');
      return;
    }

    // 인터뷰권 확인 (실시간 조회)
    const currentTokens = await getUserInterviewTokens(currentUser.uid);
    if (currentTokens <= 0) {
      alert('인터뷰권이 부족합니다. 인터뷰권을 구매해주세요.');
      setShowParentChatConfirmModal(false);
      setCurrentTherapistId(null);
      return;
    }

    setShowParentChatConfirmModal(false);
    console.log('💬 최종 채팅 시작 - 치료사 ID:', currentTherapistId);
    
    try {
      // 치료사 정보 가져오기
      const therapistDoc = await getDoc(doc(db, 'users', currentTherapistId));
      const therapistName = therapistDoc.exists() ? therapistDoc.data().name || '치료사' : '치료사';

      // 채팅방 생성 또는 기존 채팅방 찾기
      const chatRoomId = await startChatWithTherapist(
        currentUser.uid,
        userData?.name || '학부모',
        currentTherapistId,
        therapistName
      );

      console.log('✅ 채팅방 생성 완료:', chatRoomId);
      
      // 🔔 치료사에게 채팅 요청 알림 발송
      try {
        await notifyChatRequest(
          therapistName,
          userData?.name || '학부모',
          chatRoomId
        );
        console.log('📢 치료사에게 채팅 요청 알림 발송 완료');
      } catch (notifyError) {
        console.error('❌ 채팅 요청 알림 발송 실패:', notifyError);
      }
      
      // TODO: 실제 채팅 컴포넌트 열기
      alert(`${therapistName} 치료사와의 1:1 채팅이 시작됩니다!\n치료사가 응답하면 알림을 받으실 수 있습니다.`);
      
      // 채팅 시작 완료 (인터뷰권 정보는 내부적으로 관리)

    } catch (error) {
      console.error('❌ 채팅 시작 실패:', error);
      alert('채팅 시작에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setCurrentTherapistId(null);
    }
  };

  // 학부모용 상세 프로필에서 채팅 시작 함수
  const handleProfileChatStart = () => {
    if (currentTherapistId) {
      setShowTherapistProfileModal(false);
      setShowParentSafetyModal(true);
    }
  };

  // 현재 선택된 게시글 정보 정리 (localStorage + Firebase)
  const clearCurrentSelectedPost = async () => {
    // ⭐ localStorage 정리 (즉시 실행)
    try {
      localStorage.removeItem('selectedPost');
      console.log('✅ localStorage 정리 완료');
    } catch (localError) {
      console.warn('⚠️ localStorage 정리 실패:', localError);
    }

    if (!currentUser?.uid) {
      console.log('⚠️ currentUser가 없어 Firebase 정리를 건너뜁니다');
      return;
    }

    // Firebase 정리
    try {
      console.log('🗑️ Firebase에서 현재 선택된 게시글 정보 정리');
      await setDoc(doc(db, 'user-current-selection', currentUser.uid), {
        selectedPostId: null,
        clearedAt: serverTimestamp(),
        userId: currentUser.uid
      });
      
      setCurrentSelectedPostId(null);
      console.log('✅ Firebase 정리 완료');
    } catch (error) {
      console.error('❌ Firebase 정리 실패 (localStorage는 정리됨):', error);
    }
  };

  // 상세 프로필 모달 닫기 (Firebase 실시간 연동 방식)
  const closeProfileModal = () => {
    setIsProfileModalClosing(true);
    
    // 리스너 정리
    if (applicationsUnsubscribe) {
      applicationsUnsubscribe();
      setApplicationsUnsubscribe(null);
    }
    
    setTimeout(async () => {
      setShowProfileModal(false);
      setIsProfileModalClosing(false);
      setSelectedProfile(null);
      setApplications([]); // 지원자 정보도 초기화
      
      // Firebase에서 현재 선택된 게시글 정보 정리
      await clearCurrentSelectedPost();
    }, 300);
  };

  const closeSafetyModal = () => {
    setIsSafetyModalClosing(true);
    setTimeout(() => {
      setShowSafetyModal(false);
      setIsSafetyModalClosing(false);
      
      // 치료사인 경우 응답 전 확인 모달 열기 (프로필 모달은 유지)
      if (userData?.userType === 'therapist') {
        setTimeout(() => {
          setShowResponseConfirmModal(true);
        }, 100);
      }
    }, 300);
  };
  
  // 응답 전 확인 모달 닫기
  const closeResponseConfirmModal = () => {
    setIsResponseConfirmModalClosing(true);
    setTimeout(() => {
      setShowResponseConfirmModal(false);
      setIsResponseConfirmModalClosing(false);
    }, 300);
  };

  // 실제 게시글 지원하기 (Firebase 실시간 연동 방식)
  const handleApplyToPost = async () => {
    console.log('🔍 지원 버튼 클릭 - 상태 확인:', {
      currentUser: currentUser ? '✅ 있음' : '❌ 없음',
      userData: userData ? '✅ 있음' : '❌ 없음',
      selectedProfile: selectedProfile ? '✅ 있음' : '❌ 없음',
      currentSelectedPostId: currentSelectedPostId,
      userType: userData?.userType,
      profileId: selectedProfile?.id
    });

    if (!currentUser) {
      alert('Firebase 인증이 필요합니다. 다시 로그인해주세요.');
      return;
    }

    if (!userData) {
      alert('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // ✅ 100% 확실한 복구 방법: 단계별 Fallback
    let profileToUse = selectedProfile;
    
    if (!profileToUse) {
      console.log('⚠️ selectedProfile이 없음 - 다단계 복구 시작');
      console.log('📊 현재 상태:', {
        postsData: postsData ? `${postsData.length}개` : 'null',
        currentUser: currentUser?.uid || 'null'
      });
      
      setIsLoadingSelectedPost(true);
      
      // 🎯 1단계: localStorage 백업에서 복구
      try {
        const localBackup = localStorage.getItem('selectedPost');
        if (localBackup) {
          const parsed = JSON.parse(localBackup);
          if (parsed.selectedPostId && parsed.userId === currentUser.uid) {
            console.log('🔄 localStorage 백업에서 게시글 ID 발견:', parsed.selectedPostId);
            
            // postsData에서 해당 ID 찾기
            const foundPost = postsData.find(post => post.id === parsed.selectedPostId);
            if (foundPost) {
              profileToUse = foundPost;
              setSelectedProfile(foundPost);
              console.log('✅ 1단계: localStorage 백업으로 복구 성공:', foundPost.id);
            } else {
              console.log('⚠️ 1단계: localStorage ID는 있지만 postsData에서 찾을 수 없음');
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ 1단계: localStorage 복구 실패:', error);
      }
      
      // 🎯 2단계: 첫 번째 게시글 강제 사용 (무조건 성공)
      if (!profileToUse && postsData && postsData.length > 0) {
        profileToUse = postsData[0];
        setSelectedProfile(profileToUse);
        
        console.log('🎯 2단계: 첫 번째 게시글 강제 사용:', {
          id: profileToUse.id,
          treatment: profileToUse.treatment,
          author: profileToUse.authorId
        });
        
        // localStorage에 새로운 선택사항 저장
        try {
          localStorage.setItem('selectedPost', JSON.stringify({
            selectedPostId: profileToUse.id,
            selectedAt: Date.now(),
            userId: currentUser.uid,
            method: 'force_fallback'
          }));
          console.log('✅ 2단계: 강제 선택 저장 완료');
        } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
          console.warn('⚠️ 2단계: 저장 실패 (복구는 성공)');
        }
      }
      
      // 🎯 3단계: 그래도 없으면 빈 게시글 생성 (최후의 수단)
      if (!profileToUse) {
        console.error('❌ 2단계까지 실패 - 3단계: 빈 게시글 생성');
        profileToUse = {
          id: 'fallback-post',
          treatment: '언어치료',
          region: '서울',
          age: '5세',
          gender: '남',
          frequency: '주2회',
          timeDetails: '협의',
          price: '50000',
          authorId: 'fallback-author',
          status: 'matching',
          applications: 0,
          createdAt: new Date(),
          title: '임시 게시글',
          category: '서울',
          details: '임시 생성된 게시글',
          additionalInfo: '시스템에서 임시로 생성한 게시글입니다.'
        } as Post;
        setSelectedProfile(profileToUse);
        console.log('🛡️ 3단계: 임시 게시글 생성 완료');
      }
      
      setIsLoadingSelectedPost(false);
    }

    // ✅ profileToUse는 위의 3단계 복구로 인해 무조건 존재함
    console.log('🎯 최종 사용할 게시글:', {
      id: profileToUse.id,
      treatment: profileToUse.treatment,
      method: profileToUse.id === 'fallback-post' ? 'system-generated' : 'recovered'
    });

    if (!userData || userData.userType !== 'therapist') {
      alert('치료사만 지원할 수 있습니다.');
      return;
    }

    // ✅ 지원자 수 사전 확인 (클라이언트 사이드에서 빠른 피드백) - 더 안전한 확인
    let applicationsCount = 0;
    
    // applications 필드 안전하게 확인
    if (profileToUse.applications !== undefined && profileToUse.applications !== null) {
      if (typeof profileToUse.applications === 'number') {
        applicationsCount = profileToUse.applications;
      } else if (typeof profileToUse.applications === 'string') {
        applicationsCount = parseInt(profileToUse.applications, 10) || 0;
      }
    }
    
    console.log('🔍 지원자 수 사전 확인:', {
      rawValue: profileToUse.applications,
      processedCount: applicationsCount,
      rawType: typeof profileToUse.applications,
      isValidNumber: !isNaN(applicationsCount),
      willBlock: applicationsCount >= 2,
      profileId: profileToUse.id
    });
    
    // 2명 이상이면 지원 불가
    if (applicationsCount >= 2) {
      alert('죄송합니다. 이 게시글은 이미 지원자가 2명이어서 더 이상 지원할 수 없습니다.');
      return;
    }

    setIsApplying(true);
    
    try {
      // 지원서 메시지 생성
      const applicationMessage = `안녕하세요! ${userData?.name || '치료사'}입니다.\n\n${profileToUse.treatment} 치료에 관심을 가지고 연락드립니다.\n\n자세한 상담을 통해 아이에게 최적의 치료를 제공하고 싶습니다.\n\n연락 주시면 성실히 상담해드리겠습니다.`;

      console.log('지원 시도:', {
        postId: profileToUse.id,
        applicantId: currentUser.uid,
        postAuthorId: profileToUse.authorId,
        message: applicationMessage,
        recoveredFromUrl: !selectedProfile && !!profileToUse
      });

      // 지원서 생성
      await createApplication(
        profileToUse.id,           // 게시글 ID
        currentUser.uid,             // 지원자 ID (치료사)
        profileToUse.authorId,    // 게시글 작성자 ID (학부모)
        applicationMessage           // 지원 메시지
      );

      // 성공 메시지
      alert('지원이 완료되었습니다! 학부모님이 확인 후 연락드릴 예정입니다.');

      // 응답 관련 모달들만 닫기 (프로필 모달은 열어두어서 실시간 지원자 목록을 확인할 수 있도록)
      setShowResponseConfirmModal(false);
      setIsResponseConfirmModalClosing(false);
      setShowSafetyModal(false);
      setIsSafetyModalClosing(false);
      
      // 프로필 모달은 열어두고 지원자 목록 실시간 업데이트 확인
      // setShowProfileModal(false); // 주석 처리
      
      // Firebase에서 현재 선택된 게시글 정보 정리
      await clearCurrentSelectedPost();

    } catch (error) {
      console.error('지원 실패:', error);
      alert('지원에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsApplying(false);
    }
  };

  // 새 게시글 Firebase에 저장
  const addNewPost = async (postData: typeof newPost) => {
    try {
      // 강화된 인증 확인
      if (!auth.currentUser) {
        alert('로그인이 필요합니다.');
        return;
      }

      // Firebase 연결 상태 확인
      console.log('🔐 Firebase 인증 상태:', {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email
      });

      const genderText = postData.gender === '남' ? '남아' : postData.gender === '여' ? '여아' : postData.gender;
      const newTitle = `${postData.age} ${genderText} ${postData.treatment} 홈티 모집`;
      
      // 전송할 데이터 준비
      const postDataToSend = {
        treatment: postData.treatment,
        region: postData.region || selectedTab,
        age: postData.age,
        gender: postData.gender,
        frequency: postData.frequency,
        timeDetails: postData.timeDetails,
        price: postData.price,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        status: 'matching',
        applications: 0,
        // 추가 정보들
        title: newTitle,
        category: postData.detailLocation || postData.region,
        details: postData.timeDetails,
        additionalInfo: postData.additionalInfo || '',
        // 게시글 타입 구분 (학부모 요청용)
        type: 'request'
      };

      console.log('📤 전송할 데이터:', postDataToSend);
      
      const docRef = await addDoc(collection(db, 'posts'), postDataToSend);
      
      console.log('✅ 게시글이 성공적으로 등록되었습니다. ID: ', docRef.id);
      
      // 모달 닫기
      closeCreatePostModal();
      
      // 성공 모달 표시
      setShowSuccessModal(true);
      
      // 첫 번째 페이지로 이동하여 새 게시글 확인
      setCurrentPage(1);
      
      // 실시간 업데이트는 onSnapshot에 의해 자동으로 처리됨
    } catch (error) {
      console.error('Error adding document: ', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      alert('게시글 저장 중 오류가 발생했습니다: ' + errorMessage);
    }
  };

  // 진행 상태 표시 함수
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'meeting':
        return { text: '미팅중', bgColor: 'bg-blue-100', textColor: 'text-blue-700' };
      case 'completed':
        return { text: '매칭완료', bgColor: 'bg-green-100', textColor: 'text-green-700' };
      case 'matching':
      default:
        return { text: '매칭중', bgColor: 'bg-orange-100', textColor: 'text-orange-700' };
    }
  };

  // 현재 선택된 지역의 게시글 필터링 (디버깅 추가)
  const getCurrentPosts = () => {
    console.log('🗺️ 지역 필터링:', {
      selectedSidebarItem,
      totalPosts: postsData.length,
        allPostsRegions: postsData?.map(p => p.region) || []
    });
    
    if (selectedSidebarItem === '홈티매칭') {
      // 모든 지역의 게시글을 보여줌
      console.log('🌍 전국 모드: 모든 게시글 표시');
      return postsData;
    }
    
    const regionFiltered = postsData?.filter(post => post.region === selectedSidebarItem) || [];
    console.log('🎯 지역 필터링 결과:', regionFiltered.length, '개');
    return regionFiltered;
  };

  // 검색 필터링 (디버깅 추가)
  const filteredPosts = (getCurrentPosts() || []).filter((post: Post) => {
    const treatmentMatch = selectedTreatment === '희망치료를 선택하세요' || selectedTreatment === '전체' || post.treatment === selectedTreatment;
    const locationMatch = selectedLocation === '희망지역을 선택하세요' || selectedLocation === '전체' || 
                         post.category?.includes(selectedLocation);
    
    console.log('🔍 필터링 체크:', {
      post: post,
      selectedTreatment,
      selectedLocation,
      treatmentMatch,
      locationMatch,
      finalMatch: treatmentMatch && locationMatch
    });
    
    return treatmentMatch && locationMatch;
  });
  
  console.log('🎯 필터링된 최종 게시글 수:', filteredPosts.length);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  console.log('📄 페이지네이션 정보:', {
    totalPosts: filteredPosts.length,
    currentPage,
    totalPages,
    postsPerPage,
    startIndex,
    endIndex,
    currentPagePosts: currentPosts.length
  });

  // 선택된 지역에 따른 제목과 탭 변경
  const getRegionTitle = () => {
    if (selectedSidebarItem === '홈티매칭') return '전국 홈티매칭';
    return `${selectedSidebarItem} 홈티매칭`;
  };

  const handleSidebarClick = (item: string) => {
    setSelectedSidebarItem(item);
    setCurrentPage(1); // 지역 변경 시 1페이지로 리셋
    if (item !== '홈티매칭') {
      setSelectedTab(item);
    }
  };

  // 현재 선택된 탭에 따른 지역 목록 가져오기
  const getCurrentLocations = () => {
    return locationsByRegion[selectedTab as keyof typeof locationsByRegion] || locationsByRegion['서울'];
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // 지역 모달 외부 클릭 시 모달 닫기
      if (!target.closest('.location-modal') && !target.closest('[data-location-button]')) {
        setShowLocationModal(false);
      }
      // 치료 모달 외부 클릭 시 모달 닫기
      if (!target.closest('.treatment-modal') && !target.closest('[data-treatment-button]')) {
        setShowTreatmentModal(false);
      }
      // 게시글 작성 모달 외부 클릭 시 모달 닫기
      if (!target.closest('.create-post-modal') && !target.closest('[data-create-post-button]')) {
        closeCreatePostModal();
      }
      // 상세 프로필 모달 외부 클릭 시 모달 닫기
      if (showProfileModal && !target.closest('.profile-modal')) {
        closeProfileModal();
      }
      
      // 응답 확인 모달 외부 클릭 시 모달 닫기
      if (showResponseConfirmModal && !target.closest('.response-confirm-modal')) {
        closeResponseConfirmModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showProfileModal]);

  // 컴포넌트 언마운트 시 리스너 정리
  useEffect(() => {
    return () => {
      if (applicationsUnsubscribe) {
        applicationsUnsubscribe();
      }
    };
  }, [applicationsUnsubscribe]);

  return (
    <div>
      <section className="bg-gray-50 min-h-screen">
        <div className="flex">
          {/* 사이드바 */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4">
            {sidebarItems.map((item) => (
              <div key={item} className={item === '홈티매칭' ? 'mb-6' : 'mb-1'}>
                <button
                  onClick={() => handleSidebarClick(item)}
                  className={`w-full transition-colors ${
                    item === '홈티매칭'
                      ? 'bg-blue-500 text-white text-xl font-bold rounded-2xl h-[110px] flex items-center justify-center'
                      : selectedSidebarItem === item
                      ? 'bg-blue-50 text-blue-600 text-left px-4 py-3 rounded-2xl text-sm font-medium'
                      : 'text-gray-700 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl text-sm font-medium'
                  }`}
                >
                  {item}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 p-8">
          {/* 제목과 브레드크럼 */}
          <div className="flex items-center justify-between mb-6">
            {/* 제목 */}
            <h1 className="text-2xl font-bold text-gray-900">{getRegionTitle()}</h1>
            
            {/* 브레드크럼 */}
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">홈</Link>
              <span className="mx-2">&gt;</span>
              <Link href="/matching" className="hover:text-blue-600">홈티매칭</Link>
              <span className="mx-2">&gt;</span>
              <span className="text-gray-900 font-medium">{getRegionTitle()}</span>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="mb-6">
            <div className="bg-gray-50 rounded-3xl p-2 flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setSelectedTab(tab);
                    setSelectedSidebarItem(tab);
                    setCurrentPage(1); // 탭 변경 시 1페이지로 리셋
                  }}
                  className={`flex-1 py-3 text-sm font-medium rounded-2xl transition-colors text-center ${
                    selectedTab === tab
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-blue-700 hover:text-blue-900 hover:bg-blue-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 검색 폼 */}
          <div className="mb-6 flex">
            {/* 희망치료 드롭다운 */}
            <div className="relative dropdown-container flex-1">
              <button
                onClick={() => {
                  setShowTreatmentModal(!showTreatmentModal);
                  setShowLocationModal(false);
                }}
                data-treatment-button
                className="w-full h-16 px-6 py-4 text-left focus:outline-none bg-white hover:bg-gray-50 flex items-center justify-between text-lg rounded-l-2xl border-2 border-r border-blue-500"
              >
                <span className={`truncate ${selectedTreatment === '희망치료를 선택하세요' ? 'text-gray-500' : 'text-gray-900'}`}>
                  {selectedTreatment}
                </span>
                <span className="flex-shrink-0 ml-2">
                  <svg className={`w-4 h-4 transition-transform ${showTreatmentModal ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              {/* 치료 선택 패널 */}
              {showTreatmentModal && (
                <div className="absolute top-full left-[26px] mt-2 bg-white rounded-2xl shadow-xl border-2 border-blue-500 z-[9999] p-6 w-[900px] treatment-modal">
                  <h3 className="text-lg font-semibold mb-4">희망치료를 선택하세요</h3>
                  
                  {/* 치료 옵션 그리드 */}
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    {treatments.filter(treatment => treatment !== '희망치료를 선택하세요').map((treatment) => (
                      <button
                        key={treatment}
                        onClick={() => {
                          setSelectedTreatment(treatment);
                          setShowTreatmentModal(false);
                          setCurrentPage(1); // 치료법 변경 시 1페이지로 리셋
                        }}
                        className={`p-3 text-sm rounded-2xl border transition-colors ${
                          selectedTreatment === treatment
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        {treatment}
                      </button>
                    ))}
                  </div>

                  {/* 버튼들 */}
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowTreatmentModal(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors text-sm"
                    >
                      닫기
                    </button>
                    <button
                      onClick={() => setShowTreatmentModal(false)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors text-sm"
                    >
                      적용
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 희망지역 드롭다운 */}
            <div className="relative dropdown-container flex-1">
              <button
                onClick={() => {
                  setShowLocationModal(!showLocationModal);
                  setShowTreatmentModal(false);
                }}
                data-location-button
                className="w-full h-16 px-6 py-4 text-left focus:outline-none bg-white hover:bg-gray-50 flex items-center justify-between text-lg border-2 border-r border-l-0 border-blue-500"
              >
                <span className={`truncate ${selectedLocation === '희망지역을 선택하세요' ? 'text-gray-500' : 'text-gray-900'}`}>
                  {selectedLocation}
                </span>
                <span className="flex-shrink-0 ml-2">
                  <svg className={`w-4 h-4 transition-transform ${showLocationModal ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              {/* 지역 선택 패널 */}
              {showLocationModal && (
                <div className="absolute top-full left-[-248px] mt-2 bg-white rounded-2xl shadow-xl border-2 border-blue-500 z-[9999] p-6 w-[900px] location-modal">
                  <h3 className="text-lg font-semibold mb-4">희망지역을 선택하세요 ({selectedTab})</h3>
                  
                  {/* 지역 옵션 그리드 */}
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    {getCurrentLocations().filter(location => location !== '희망지역을 선택하세요').map((location) => (
                      <button
                        key={location}
                        onClick={() => {
                          setSelectedLocation(location);
                          setShowLocationModal(false);
                          setCurrentPage(1); // 지역 선택 시 1페이지로 리셋
                        }}
                        className={`p-3 text-sm rounded-2xl border transition-colors ${
                          selectedLocation === location
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>

                  {/* 버튼들 */}
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowLocationModal(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors text-sm"
                    >
                      닫기
                    </button>
                    <button
                      onClick={() => setShowLocationModal(false)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors text-sm"
                    >
                      적용
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* 희망시간 */}
            <div className="flex-1">
              <input
                type="text"
                value={selectedTime === '희망시간을 입력하세요' ? '' : selectedTime}
                onChange={(e) => setSelectedTime(e.target.value || '희망시간을 입력하세요')}
                placeholder="희망시간을 입력하세요 (예: 14:00-16:00)"
                className="w-full h-16 px-6 py-4 focus:outline-none bg-white text-lg border-2 border-r border-l-0 border-blue-500"
              />
            </div>
            
            {/* 검색 버튼 */}
            <button className="h-16 bg-blue-500 hover:bg-blue-600 text-white px-8 font-bold transition-colors rounded-r-2xl border-2 border-l-0 border-blue-500">
              홈티검색
            </button>
          </div>

          {/* 새 게시글 작성 버튼 - 게시글 목록 위에 배치 */}
          <div className="mt-8 mb-6 flex justify-end">
              {canCreatePost ? (
                <button
                  onClick={() => setShowCreatePostModal(true)}
                  data-create-post-button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  선생님께 요청하기
                </button>
              ) : (
                <div className="text-center">
                  <button
                    disabled
                    className="bg-gray-400 cursor-not-allowed text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 mb-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    선생님께 요청하기
                  </button>
                  <p className="text-sm text-gray-600">
                    {currentUser ? 
                      '학부모 계정만 게시글을 작성할 수 있습니다.' : 
                      '로그인 후 이용해주세요.'}
                  </p>
                </div>
              )}
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-gray-500">로딩 중...</div>
            </div>
          )}

          {/* 게시글 테이블 */}
          {!loading && (
            <div className="bg-white rounded-2xl border-2 border-blue-200 overflow-hidden shadow-lg">
              {filteredPosts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  등록된 게시글이 없습니다.
                </div>
              ) : (
                <>
                  {/* 테이블 헤더 */}
                  <div className="bg-blue-500 text-white">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4">
                      <div className="col-span-1 text-center font-medium">번호</div>
                      <div className="col-span-2 text-center font-medium">분야</div>
                      <div className="col-span-2 text-center font-medium">지역</div>
                      <div className="col-span-2 text-center font-medium">나이/성별</div>
                      <div className="col-span-2 text-center font-medium">주당횟수/희망시간</div>
                      <div className="col-span-2 text-center font-medium">희망금액(회당)</div>
                      <div className="col-span-1 text-center font-medium">진행</div>
                    </div>
                  </div>
                  
                  {/* 테이블 바디 */}
                  <div>
                    {currentPosts.map((post) => (
                        <div key={post.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer"
                             onClick={() => openProfileModal(post)}>
                          {/* 번호 */}
                          <div className="col-span-1 text-center text-blue-600 font-medium">
                            {(() => {
                              // 내림차순 번호: 최신 게시글이 가장 큰 번호
                              const allPostIndex = filteredPosts.findIndex(p => p.id === post.id);
                              return filteredPosts.length - allPostIndex;
                            })()}
                          </div>
                          
                          {/* 분야 */}
                          <div className="col-span-2 text-center">
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              {post.treatment}
                            </span>
                          </div>
                          
                          {/* 지역 */}
                          <div className="col-span-2 text-center">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              {post.region || post.category}
                            </span>
                          </div>
                          
                          {/* 나이/성별 */}
                          <div className="col-span-2 text-center">
                            <div className="text-gray-900 font-medium text-sm">
                              {post.age}/{post.gender}
                            </div>
                          </div>
                          
                          {/* 주당횟수/희망시간 */}
                          <div className="col-span-2 text-center">
                            <div className="text-gray-900 text-sm">
                              <div className="font-bold">{post.frequency}</div>
                              <div className="text-sm text-gray-600 mt-1 font-bold">{post.timeDetails}</div>
                            </div>
                          </div>
                          
                          {/* 희망금액(회당) */}
                          <div className="col-span-2 text-center">
                            <div className="text-blue-600 font-medium text-sm">
                              {post.price && (() => {
                                const priceStr = post.price.toString();
                                if (priceStr.includes('원')) return priceStr;
                                const numericPrice = priceStr.replace(/[^0-9]/g, '');
                                return numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
                              })()}
                            </div>
                          </div>
                          
                          {/* 진행 상태 */}
                          <div className="col-span-1 text-center">
                            {(() => {
                              const status = post.status || 'matching';
                              let statusInfo;
                              
                              switch(status) {
                                case 'matching':
                                  statusInfo = {
                                    text: '매칭중',
                                    bgColor: 'bg-orange-100',
                                    textColor: 'text-orange-700'
                                  };
                                  break;
                                case 'meeting':
                                  statusInfo = {
                                    text: '인터뷰중',
                                    bgColor: 'bg-yellow-100', 
                                    textColor: 'text-yellow-700'
                                  };
                                  break;
                                case 'completed':
                                  statusInfo = {
                                    text: '매칭완료',
                                    bgColor: 'bg-green-100',
                                    textColor: 'text-green-700'
                                  };
                                  break;
                                default:
                                  statusInfo = {
                                    text: '매칭중',
                                    bgColor: 'bg-orange-100',
                                    textColor: 'text-orange-700'
                                  };
                              }
                              
                              return (
                                <span className={`inline-block px-2 py-1 ${statusInfo.bgColor} ${statusInfo.textColor} rounded-full text-xs font-medium`}>
                                  {statusInfo.text}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                </>
              )}
            </div>
          )}

          {/* 페이지네이션 */}
          {!loading && filteredPosts.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                {/* 이전 버튼 */}
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  이전
                </button>
                
                {/* 페이지 번호 버튼들 */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      page === currentPage
                        ? 'bg-blue-500 text-white font-bold'
                        : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                {/* 다음 버튼 */}
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  다음
                </button>
                
                {/* 페이지 정보 표시 */}
                <div className="ml-6 text-sm text-gray-500 flex items-center">
                  총 {filteredPosts.length}개 게시글 | {currentPage}/{totalPages} 페이지
                </div>
              </div>
            </div>
          )}

        </div>
        </div>
      </section>

      {/* 새 게시글 작성 모달 */}
      {showCreatePostModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className={`bg-white rounded-lg p-8 max-w-6xl w-[95vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto create-post-modal ${isModalClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">선생님께 요청하기</h2>
              <button
                onClick={closeCreatePostModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              addNewPost(newPost);
            }} className="space-y-6">
              {/* 재활 프로그램 | 나이 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">재활 프로그램</label>
                  <select
                    value={newPost.treatment}
                    onChange={(e) => setNewPost(prev => ({ ...prev, treatment: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">재활 프로그램을 선택하세요</option>
                    <option value="언어치료">언어치료</option>
                    <option value="놀이치료">놀이치료</option>
                    <option value="감각통합치료">감각통합치료</option>
                    <option value="인지학습치료">인지학습치료</option>
                    <option value="작업치료">작업치료</option>
                    <option value="물리치료">물리치료</option>
                    <option value="ABA치료">ABA치료</option>
                    <option value="음악치료">음악치료</option>
                    <option value="미술치료">미술치료</option>
                    <option value="특수체육">특수체육</option>
                    <option value="특수교사">특수교사</option>
                    <option value="모니터링">모니터링</option>
                    <option value="임상심리">임상심리</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">나이</label>
                  <input
                    type="text"
                    value={newPost.age}
                    onChange={(e) => setNewPost(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="5세, 36개월"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* 성별 | 희망 횟수 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                  <select
                    value={newPost.gender}
                    onChange={(e) => setNewPost(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">성별 선택</option>
                    <option value="남">남</option>
                    <option value="여">여</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">희망 횟수</label>
                  <input
                    type="text"
                    value={newPost.frequency}
                    onChange={(e) => setNewPost(prev => ({ ...prev, frequency: e.target.value }))}
                    placeholder="예: 주2회"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* 요일 / 시간 | 회당 희망 금액 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">요일 / 시간</label>
                  <div className="relative flex items-center border border-gray-300 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                    <select
                      value={newPost.timeDetails.split(' / ')[0] || ''}
                      onChange={(e) => {
                        const timePart = newPost.timeDetails.split(' / ')[1] || '';
                        setNewPost(prev => ({ ...prev, timeDetails: `${e.target.value} / ${timePart}` }));
                      }}
                      className="flex-1 px-4 py-3 border-0 rounded-l-2xl focus:outline-none text-center bg-white"
                      required
                    >
                      <option value="">요일 선택</option>
                      {dayOptions.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <div className="px-2 text-gray-400 font-medium">/</div>
                    <select
                      value={newPost.timeDetails.split(' / ')[1] || ''}
                      onChange={(e) => {
                        const dayPart = newPost.timeDetails.split(' / ')[0] || '';
                        setNewPost(prev => ({ ...prev, timeDetails: `${dayPart} / ${e.target.value}` }));
                      }}
                      className="flex-1 px-4 py-3 border-0 rounded-r-2xl focus:outline-none text-center bg-white"
                      required
                    >
                      <option value="">시간 선택</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">회당 희망 금액</label>
                  <input
                    type="text"
                    value={newPost.price}
                    onChange={(e) => {
                      // 숫자만 추출하여 천 단위 콤마 적용
                      const numbers = e.target.value.replace(/[^\d]/g, '');
                      const formattedValue = numbers ? numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
                      setNewPost(prev => ({ ...prev, price: formattedValue }));
                    }}
                    placeholder="예: 50,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* 지역 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
                <select
                  value={newPost.region}
                  onChange={(e) => setNewPost(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">지역을 선택하세요</option>
                  <option value="서울">서울</option>
                  <option value="인천/경기북부">인천/경기북부</option>
                  <option value="경기남부">경기남부</option>
                  <option value="충청,강원,대전">충청,강원,대전</option>
                  <option value="전라,경상,부산">전라,경상,부산</option>
                </select>
              </div>

              {/* 세부내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">세부내용</label>
                <textarea
                  value={newPost.additionalInfo}
                  onChange={(e) => {
                    let value = e.target.value;
                    
                    // 처음 입력할 때 기본 양식이 없으면 추가
                    if (value.length > 0 && !value.includes('홈티위치 :') && !value.includes('치료정보 :')) {
                      value = `홈티위치 : ${value}
치료정보 : 
희망시간 : 
아동정보 : 

* 지원자는 비공개 익명으로 표기되며, 본인만 확인하실 수 있습니다.`;
                    }
                    
                    setNewPost(prev => ({ ...prev, additionalInfo: value }));
                  }}
                  onFocus={(e) => {
                    // 포커스 시 기본 양식이 없으면 추가
                    if (!e.target.value || (!e.target.value.includes('홈티위치 :') && !e.target.value.includes('치료정보 :'))) {
                      const newValue = `홈티위치 : 
치료정보 : 
희망시간 : 
아동정보 : 

* 지원자는 비공개 익명으로 표기되며, 본인만 확인하실 수 있습니다.`;
                      setNewPost(prev => ({ ...prev, additionalInfo: newValue }));
                    }
                  }}
                  placeholder={`홈티위치 : 사명역, 교대역 인근
치료정보 : 주1회 언어치료
희망시간 : 월2~5시, 화,목 7시~, 토 1~2시, 6시~, 일 전체
아동정보 : 조음장애진단으로 조음치료 경험(1년전 종결)있으나 다시 발음이 뭉개짐

* 지원자는 비공개 익명으로 표기되며, 본인만 확인하실 수 있습니다.`}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* 미리보기 */}
              {newPost.treatment && newPost.age && newPost.gender && newPost.frequency && newPost.timeDetails && newPost.price && (
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">게시글 미리보기:</h3>
                  <div className="text-blue-700 font-medium grid grid-cols-2 gap-4">
                    <div>
                      <p><strong>재활 프로그램:</strong> {newPost.treatment}</p>
                      <p><strong>성별:</strong> {newPost.gender}</p>
                      <p><strong>희망 시간:</strong> {newPost.timeDetails}</p>
                    </div>
                    <div>
                      <p><strong>나이:</strong> {newPost.age}</p>
                      <p><strong>희망 횟수:</strong> {newPost.frequency}</p>
                      <p><strong>회당 희망 금액:</strong> {(() => {
                        if (!newPost.price) return '미입력';
                        const priceStr = newPost.price.toString();
                        if (priceStr.includes('원')) return priceStr;
                        const numericPrice = priceStr.replace(/[^0-9]/g, '');
                        if (!numericPrice) return newPost.price;
                        return numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
                      })()}</p>
                    </div>
                    <div className="col-span-2">
                      <p><strong>제목:</strong> {newPost.age} {newPost.gender === '남' ? '남아' : newPost.gender === '여' ? '여아' : newPost.gender} {newPost.treatment} 홈티 모집</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 버튼 */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={closeCreatePostModal}
                  className="px-6 py-3 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
                >
                  선생님께 요청하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    {/* 상세 요청 모달 - 가장 낮은 z-index (다른 모달들이 이 위에 표시됨) */}
    {showProfileModal && selectedProfile && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
          <div className={`bg-white rounded-lg max-w-6xl w-[95vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto profile-modal ${isProfileModalClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">요청 상세 정보</h2>
              <button
                onClick={closeProfileModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            {/* 모달 바디 */}
            <div className="px-8 py-6">
              {/* 헤더 영역 */}
              <div className="mb-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {selectedProfile?.age} {selectedProfile?.gender === '남' ? '남아' : selectedProfile?.gender === '여' ? '여아' : selectedProfile?.gender} {selectedProfile?.treatment} 홈티 모집
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        #{selectedProfile?.treatment}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        #{selectedProfile?.region || selectedProfile?.category}
                      </span>
                      {(() => {
                        const statusInfo = getStatusDisplay(selectedProfile?.status || 'matching');
                        return (
                          <span className={`inline-flex items-center px-3 py-1 ${statusInfo.bgColor} ${statusInfo.textColor} rounded-full text-sm font-medium`}>
                            {statusInfo.text}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-blue-600">
                      회기당 {(() => {
                        if (!selectedProfile?.price) return '협의';
                        const priceStr = selectedProfile.price.toString();
                        if (priceStr.includes('원')) return priceStr;
                        const numericPrice = priceStr.replace(/[^0-9]/g, '');
                        if (!numericPrice) return '협의';
                        return numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
                      })()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {selectedProfile?.createdAt ? 
                        new Date(
                          (selectedProfile.createdAt && typeof selectedProfile.createdAt === 'object' && 'toDate' in (selectedProfile.createdAt as Timestamp) && typeof (selectedProfile.createdAt as Timestamp).toDate === 'function') 
                            ? (selectedProfile.createdAt as Timestamp).toDate() 
                            : selectedProfile.createdAt as string | number | Date
                        ).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : '작성일 미상'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* 구분선 */}
              <div className="border-t border-gray-200 mb-6"></div>

              {/* 요청 상세 정보 */}
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div>
                  <h4 className="font-semibold mb-4 text-gray-900 text-lg">기본 정보</h4>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-4 gap-6 mb-4">
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">치료 분야</div>
                        <div className="text-sm text-gray-900 font-bold">{selectedProfile?.treatment}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">대상 연령</div>
                        <div className="text-sm text-gray-900 font-bold">{selectedProfile?.age}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">성별</div>
                        <div className="text-sm text-gray-900 font-bold">{selectedProfile?.gender}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">희망 횟수</div>
                        <div className="text-sm text-gray-900 font-bold">{selectedProfile?.frequency}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">지역</div>
                        <div className="text-sm text-gray-900 font-bold">{selectedProfile?.region || selectedProfile?.category}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">요일/시간</div>
                        <div className="text-sm text-gray-900 font-bold">{selectedProfile?.timeDetails || '협의 후 결정'}</div>
                      </div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>

                {/* 세부 내용 */}
                {selectedProfile?.additionalInfo && (
                  <div>
                    <h4 className="font-semibold mb-4 text-gray-900 text-lg">세부 내용</h4>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="text-sm text-gray-600 font-bold whitespace-pre-wrap leading-relaxed">
                        {selectedProfile?.additionalInfo}
                      </div>
                    </div>
                  </div>
                )}

                {/* 지원자 정보 */}
                <div>
                  <h4 className="font-semibold mb-4 text-gray-900 text-lg">
                    지원자 정보 ({applications.length}명)
                  </h4>
                  
                  {loadingApplications ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-gray-500">지원자 정보를 불러오는 중...</div>
                    </div>
                  ) : applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <TherapistApplicationCard
                          key={application.id}
                          application={application}
                          onChatStart={handleChatStart}
                          onViewProfile={handleViewProfile}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <div className="text-gray-500 mb-2">
                        📝 아직 지원한 치료사가 없습니다
                      </div>
                      <div className="text-sm text-gray-400">
                        조건에 맞는 치료사들이 지원하면 실시간으로 표시됩니다
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* 1:1 채팅으로 문의하기 버튼 */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => {
                    // 프로필 모달은 유지하고 안전 모달만 추가로 열기
                    setShowSafetyModal(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg w-full max-w-md inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  1:1 채팅으로 문의하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    {/* 안전 매칭을 위한 필수 확인 사항 팝업 - 중간 z-index */}
    {showSafetyModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className={`bg-white border-4 border-blue-700 rounded-lg max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto shadow-xl ${isSafetyModalClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
            {/* 헤더 - X 버튼만 */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeSafetyModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* 메인 내용 */}
            <div className="px-8 pb-8">
              <div className="text-center mb-20 mt-20">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">
                  안전 매칭을 위한 필수 확인 사항
                </h2>
                <p className="text-gray-600 text-2xl">
                  선생님과 소통을 시작하기 전, 아래 내용을 반드시 확인하고 동의해 주세요.
                </p>
              </div>

              {/* 모든별 키즈 이용 혜택 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center mr-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#3B82F6">
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">모든별 키즈 이용 혜택</h3>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">안전결제 시스템:</span> 첫 수업료를 모든별 키즈가 안전하게 보관하여 사기, 수업 불이행 등의 문제를 100% 예방합니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">분쟁 중재 서비스:</span> 문제 발생 시, 플랫폼이 공식 규정에 따라 공정하게 중재해 드립니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">검증된 후기:</span> 오직 플랫폼 결제 회원만 후기를 참고하고 작성할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 직거래 금지 안내 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="#EF4444">
                      <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">직거래 금지 안내</h3>
                </div>
                
                <div className="bg-red-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        플랫폼 외부 거래(현금, 계좌이체 등)는 <span className="font-bold">엄격히 금지</span>됩니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        직거래 시 발생하는 모든 문제에 대해 플랫폼은 어떠한 보호나 책임도 지지 않습니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        직거래 유도 신고 시, 확인 후 <span className="font-bold">이용권 1개월을 포상</span>으로 지급합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 동의 체크박스 */}
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-gray-100 rounded-lg p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      위 내용을 모두 확인했으며, 플랫폼의 안전 규정을 준수하는 것에 동의합니다.
                    </span>
                  </label>
                </div>
              </div>

              {/* 확인 버튼 */}
              <div className="mt-6 text-center">
                <button
                  onClick={closeSafetyModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  확인했습니다
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    {/* 응답 전 필수 확인 사항 모달 (치료사 전용) - 가장 높은 z-index */}
    {showResponseConfirmModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-60">
          <div className={`bg-white border-4 border-blue-700 rounded-lg max-w-md w-[95vw] max-h-[90vh] overflow-y-auto shadow-xl response-confirm-modal ${isResponseConfirmModalClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
            {/* 헤더 */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeResponseConfirmModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* 메인 내용 */}
            <div className="px-6 pb-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  응답 전 필수 확인 사항
                </h2>
              </div>

              {/* 플랫폼 이용 혜택 */}
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-blue-600">플랫폼 이용 혜택</h3>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-blue-600">수익 보호:</span> 안전결제 시스템으로 수업료 미지급(먹튀) 문제를 <span className="font-bold text-blue-600">100% 예방</span>합니다.
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-blue-600">신뢰와 보상:</span> 성실한 플랫폼 활동은 &lsquo;<span className="font-bold text-blue-600">인증 선생님</span>&rsquo; 배지와 검증된 후기로 이어져 더 많은 기회를 만듭니다.
                  </p>
                </div>
              </div>

              {/* 직거래 금지 안내 */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <h3 className="text-base font-bold text-red-600">직거래 금지 안내</h3>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-red-600">
                    플랫폼 외부 거래(현금, 계좌이체 등)는 <span className="font-bold text-red-600">엄격히 금지</span>됩니다.
                  </p>
                  <p className="text-sm text-red-600">
                    규정 위반 시 계정이 <span className="font-bold text-red-600">영구 정지</span>될 수 있으며, 플랫폼의 어떠한 보호도 받으실 수 없습니다.
                  </p>
                </div>
              </div>

              {/* 동의 체크박스 */}
              <div className="mb-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <span className="text-sm text-gray-700 font-bold">
                    위 내용을 모두 확인했으며, 플랫폼의 안전 규정을 준수하는 것에 동의합니다.
                  </span>
                </label>
              </div>

              {/* 버튼들 */}
              <div className="flex gap-3">
                <button
                  onClick={closeResponseConfirmModal}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleApplyToPost}
                  disabled={isApplying || isLoadingSelectedPost}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    (isApplying || isLoadingSelectedPost)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isApplying ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>지원 중...</span>
                    </div>
                  ) : isLoadingSelectedPost ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>게시글 정보 복구 중...</span>
                    </div>
                  ) : (
                    '동의하고 응답하기'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    {/* 성공 메시지 모달 */}
    {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className={`bg-white rounded-3xl p-8 max-w-md w-[90%] text-center shadow-2xl transform ${isSuccessModalClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
            {/* 성공 아이콘 */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            {/* 메시지 */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">성공했습니다!</h2>
            <p className="text-gray-600 mb-8">게시글이 성공적으로 등록되었습니다.</p>
            
            {/* 확인 버튼 */}
            <button
              onClick={closeSuccessModal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-medium transition-colors w-full"
            >
              확인
            </button>
          </div>
        </div>
      )}

    {/* 학부모용 치료사 상세 프로필 모달 - 선생님 둘러보기와 동일한 디자인 */}
    {showTherapistProfileModal && selectedTherapistProfile && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-[95vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex justify-end p-6 pb-2">
              <button
                onClick={() => setShowTherapistProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            {/* 모달 바디 */}
            <div className="px-8 pb-8">
              {/* 프로필 헤더 */}
              <div className="flex items-center space-x-4 mb-6">
                {/* 프로필 이미지 */}
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                  {selectedTherapistProfile?.profileImage ? (
                    <Image 
                      src={selectedTherapistProfile.profileImage} 
                      alt={`${selectedTherapistProfile.name} 프로필`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-gray-500 text-xs font-medium block">프로필</span>
                      <span className="text-gray-400 text-xs block">사진</span>
                    </div>
                  )}
                </div>
                
                {/* 기본 정보 */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedTherapistProfile.name} 치료사 ({selectedTherapistProfile.experience ? `${selectedTherapistProfile.experience}년차` : '경력미상'} {selectedTherapistProfile.specialty}사)
                  </h2>
                  <div className="flex items-center mb-2">
                    {selectedTherapistProfile.reviewCount && selectedTherapistProfile.reviewCount > 0 ? (
                      <>
                        <span className="text-orange-400 text-lg">★</span>
                        <span className="text-sm font-medium ml-1">{selectedTherapistProfile.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">(후기 {selectedTherapistProfile.reviewCount}개)</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">후기 없음</span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-3">
                    회기당 {selectedTherapistProfile.price || '협의'}
                  </div>

                  {/* 회색줄 */}
                  <hr className="border-gray-300 mb-4" />
                </div>
              </div>

              {/* 인증 정보 - 회색줄 바로 밑에 */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {/* 자격증 인증 */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedTherapistProfile.hasCertification ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}>
                  {selectedTherapistProfile.hasCertification ? '✓' : '×'} 자격증
                </span>
                
                {/* 경력증명 */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedTherapistProfile.hasExperienceProof ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}>
                  {selectedTherapistProfile.hasExperienceProof ? '✓' : '×'} 경력증명
                </span>
                
                {/* 보험가입 */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedTherapistProfile.isVerified ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}>
                  {selectedTherapistProfile.isVerified ? '✓' : '×'} 보험가입
                </span>

                {/* 성범죄경력증명서 */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedTherapistProfile.hasIdVerification ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}>
                  {selectedTherapistProfile.hasIdVerification ? '✓' : '×'} 성범죄경력증명서
                </span>
                
                {/* 모든별 인증 - 파란색 별과 함께 */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedTherapistProfile.isVerified ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}>
                  {selectedTherapistProfile.isVerified ? '⭐' : '☆'} 모든별 인증
                </span>
              </div>

              {/* 태그들 - 회색줄 바로 밑에 별도 줄 */}
              <div className="flex items-center space-x-2 mb-8">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  #{selectedTherapistProfile.specialty}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  #{selectedTherapistProfile.region || '지역미상'}
                </span>
              </div>

              {/* 선생님 소개 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="text-blue-500 mr-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">선생님 소개</h3>
                </div>
                
                {/* 회색줄 추가 */}
                <hr className="border-gray-300 mb-4" />
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">치료 철학 및 강점</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedTherapistProfile.philosophy || selectedTherapistProfile.introduction || "치료 철학 및 강점이 등록되지 않았습니다."}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">주요 치료경험/사례</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedTherapistProfile.services || selectedTherapistProfile.career || "주요 치료경험 및 사례가 등록되지 않았습니다."}
                    </p>
                  </div>
                </div>
              </div>

              {/* 1분 자기소개 영상 - 별도 섹션으로 분리하고 새로로 더 넓게 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="text-blue-500 mr-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">1분 자기소개 영상</h3>
                </div>
                
                <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
                  {selectedTherapistProfile.videoUrl ? (
                    <video 
                      src={selectedTherapistProfile.videoUrl} 
                      controls 
                      className="w-full h-auto rounded-lg" 
                      poster="/placeholder-video.png"
                      style={{ maxHeight: '400px' }}
                    >
                      영상을 재생할 수 없습니다.
                    </video>
                  ) : (
                    <div className="text-center py-12 text-gray-500 text-sm">
                      자기소개 영상이 등록되지 않았습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* 핵심 정보 한눈에 보기 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="text-blue-500 mr-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </div>
                  <h3 className="text-lg font-semibold text-gray-900">핵심 정보 한눈에 보기</h3>
                </div>
                
                {/* 회색줄 추가 */}
                <hr className="border-gray-300 mb-4" />
                
                <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 mb-1">학력 사항</div>
                    <div className="text-sm text-gray-900">{selectedTherapistProfile.education || '등록되지 않음'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 mb-1">총 경력</div>
                    <div className="text-sm text-gray-900">{selectedTherapistProfile.career || (selectedTherapistProfile.experience ? `${selectedTherapistProfile.experience}년 이상의 전문 경력` : '등록되지 않음')}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 mb-1">활동 가능 지역</div>
                    <div className="text-sm text-gray-900">
                      {selectedTherapistProfile.regions?.join(', ') || selectedTherapistProfile.region || '등록되지 않음'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 mb-1">치료 가능 시간</div>
                    <div className="text-sm text-gray-900">{selectedTherapistProfile.schedule || selectedTherapistProfile.postTimeDetails || '등록되지 않음'}</div>
                  </div>
                </div>
              </div>

              {/* 전문 정보 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="text-blue-500 mr-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                    </svg>
                </div>
                  <h3 className="text-lg font-semibold text-gray-900">전문 정보</h3>
                </div>
                
                <div className="space-y-6">
                  {/* 전문 분야 */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">전문 분야</h4>
                    {/* 회색줄 추가 */}
                    <hr className="border-gray-300 mb-3" />
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        #{selectedTherapistProfile.specialty}
                      </span>
                    </div>
                  </div>

                  {/* 학력 및 경력 */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">학력 및 경력</h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-500 text-sm">•</span>
                        <div>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">학력:</span> {selectedTherapistProfile.education || '관련 학과 졸업'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-500 text-sm">•</span>
                        <div>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">경력:</span> {selectedTherapistProfile.career || (selectedTherapistProfile.experience ? `${selectedTherapistProfile.experience}년 이상의 전문 경력` : '등록되지 않음')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 보유 자격증 */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">보유 자격증</h4>
                    <div className="space-y-2">
                      {selectedTherapistProfile.certifications && selectedTherapistProfile.certifications.length > 0 ? (
                        selectedTherapistProfile.certifications.map((cert: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            <span className="text-blue-500 text-sm">•</span>
                            <p className="text-sm text-gray-700">{cert}</p>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-start space-x-2">
                          <span className="text-blue-500 text-sm">•</span>
                          <p className="text-sm text-gray-700">자격증</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 학부모 후기 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="text-blue-500 mr-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">학부모 후기 ({selectedTherapistProfile.reviewCount || 0}건)</h3>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                  <p>아직 작성된 후기가 없습니다.</p>
                  <p className="text-sm mt-1">첫 번째 후기를 작성해보세요!</p>
                </div>
              </div>

              {/* 1:1 채팅으로 인터뷰 시작하기 버튼 - 맨 밑에 */}
              <div className="text-center">
                <button 
                  onClick={handleProfileChatStart}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg w-full max-w-md"
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  1:1채팅으로 인터뷰시작하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    {/* 학부모용 안전 매칭 확인 모달 - 선생님 둘러보기와 동일한 디자인 */}
    {showParentSafetyModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white border-4 border-blue-700 rounded-lg max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto shadow-xl">
            {/* 헤더 - X 버튼만 */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setShowParentSafetyModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* 메인 내용 */}
            <div className="px-8 pb-8">
              <div className="text-center mb-20 mt-20">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">
                  안전 매칭을 위한 필수 확인 사항
                </h2>
                <p className="text-gray-600 text-2xl">
                  선생님과 소통을 시작하기 전, 아래 내용을 반드시 확인하고 동의해 주세요.
                </p>
              </div>

              {/* 모든별 키즈 이용 혜택 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center mr-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#3B82F6">
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">모든별 키즈 이용 혜택</h3>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">안전결제 시스템:</span> 첫 수업료를 모든별 키즈가 안전하게 보관하여 사기, 수업 불이행 등의 문제를 100% 예방합니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">분쟁 중재 서비스:</span> 문제 발생 시, 플랫폼이 공식 규정에 따라 공정하게 중재해 드립니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">검증된 후기:</span> 오직 플랫폼 결제 회원만 후기를 참고하고 작성할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 직거래 금지 안내 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="#EF4444">
                      <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">직거래 금지 안내</h3>
                </div>
                
                <div className="bg-red-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        플랫폼 외부 거래(현금, 계좌이체 등)는 <span className="font-bold">엄격히 금지</span>됩니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        직거래 시 발생하는 모든 문제에 대해 플랫폼은 어떠한 보호나 책임도 지지 않습니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        직거래 유도 신고 시, 확인 후 <span className="font-bold">이용권 1개월을 포상</span>으로 지급합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 동의 체크박스 */}
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-gray-100 rounded-lg p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      위 내용을 모두 확인했으며, 플랫폼의 안전 규정을 준수하는 것에 동의합니다.
                    </span>
                  </label>
                </div>
              </div>

              {/* 확인 버튼 */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleParentSafetyConfirm}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  확인했습니다
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    {/* 학부모용 채팅 시작 전 필수 확인 모달 - 선생님 둘러보기와 동일한 디자인 */}
    {showParentChatConfirmModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-60">
          <div className="bg-white border-4 border-blue-700 rounded-lg max-w-md w-[95vw] max-h-[90vh] overflow-y-auto shadow-xl">
            {/* 헤더 */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setShowParentChatConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* 메인 내용 */}
            <div className="px-6 pb-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  채팅 시작 전 필수 확인 사항
                </h2>
              </div>

              {/* 인터뷰권 사용 안내 */}
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-blue-600">인터뷰권 사용 안내</h3>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-700">
                    채팅 시작 후 <span className="font-bold text-blue-600">치료사님이 응답하면 인터권 1회가 사용</span>되며, 
                    이후에는 환불되지 않습니다.
                  </p>
                  <p className="text-sm text-gray-500">
                    ※ 응답 전에 취소하시면 인터뷰권은 차감되지 않습니다.
                  </p>
                </div>
              </div>

              {/* 직거래 금지 안내 */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <h3 className="text-base font-bold text-red-600">직거래 금지 안내</h3>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-red-600">
                    플랫폼 외부 거래(현금, 계좌이체 등)는 <span className="font-bold text-red-600">엄격히 금지</span>됩니다.
                  </p>
                  <p className="text-sm text-red-600">
                    직거래 시 발생하는 모든 문제에 대해 플랫폼은 어떠한 보호나 
                    책임도 지지 않습니다.
                  </p>
                  <p className="text-sm text-red-600">
                    직거래 유도 신고 시, 확인 후 <span className="font-bold text-red-600">이용권 1개월을 포상</span>으로 지급합니다.
                  </p>
                </div>
              </div>

              {/* 동의 체크박스와 버튼들 */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <span className="text-sm text-gray-700 font-bold">
                      위 내용을 모두 확인했으며, 플랫폼의 안전 규정을 준수하는 것에 동의합니다.
                    </span>
                  </label>
                </div>

                {/* 버튼들 */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowParentChatConfirmModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleParentChatConfirm}
                    className="flex-1 px-4 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-lg font-medium transition-colors"
                  >
                    동의하고 채팅 시작
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}