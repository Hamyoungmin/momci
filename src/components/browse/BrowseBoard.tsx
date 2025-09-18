'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, onSnapshot, orderBy, query, where, limit, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { startChatWithTherapist } from '@/lib/chat';
import OneOnOneChat from '@/components/chat/OneOnOneChat';

// 치료사 타입 정의
interface Teacher {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviewCount: number;
  profileImage?: string;
  certifications?: string[];
  education?: string;
  career?: string;
  regions?: string[];
  schedule?: string;
  introduction?: string;
  philosophy?: string;
  services?: string;
  videoUrl?: string;
  price: string;
  region: string;
  category: string;
  createdAt: unknown;
  // 실제 사용자 데이터 통합 필드
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  authorId?: string; // 게시글 작성자 ID
  // 게시글의 실제 데이터 필드
  postAge?: string;
  postGender?: string;
  postFrequency?: string;
  postTimeDetails?: string;
  postAdditionalInfo?: string;
  // 인증 상태
  isVerified?: boolean;
  hasCertification?: boolean;
  hasExperienceProof?: boolean;
  hasIdVerification?: boolean;
}

export default function BrowseBoard() {
  const { currentUser, userData } = useAuth();
  
  // 이름에서 성만 추출하는 함수
  const getLastName = (fullName: string | undefined): string => {
    if (!fullName) return '익명';
    // 한글 이름인 경우 첫 글자가 성
    return fullName.charAt(0);
  };
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('서울');
  const [selectedTab, setSelectedTab] = useState('서울');
  const [selectedLocation, setSelectedLocation] = useState('희망지역을 선택하세요');
  const [selectedTime, setSelectedTime] = useState('희망시간을 입력하세요');
  const [selectedTreatment, setSelectedTreatment] = useState('희망치료를 선택하세요');

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSuccessModalClosing, setIsSuccessModalClosing] = useState(false);
  
  // 프로필 등록 확인 팝업 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirmModalClosing, setIsConfirmModalClosing] = useState(false);
  
  // 상세 프로필 모달 상태
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Teacher | null>(null);
  const [isProfileModalClosing, setIsProfileModalClosing] = useState(false);
  
  // 1:1 채팅 모달 상태 (안전 매칭 모달은 사용 중지)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSafetyModalClosing, setIsSafetyModalClosing] = useState(false);
  
  // 채팅 시작 전 확인 모달 상태 (학부모 전용)
  const [showChatConfirmModal, setShowChatConfirmModal] = useState(false);
  const [isChatConfirmModalClosing, setIsChatConfirmModalClosing] = useState(false);
  
  // 1:1 채팅 상태
  const [showChat, setShowChat] = useState(false);
  const [chatRoomId, setChatRoomId] = useState('');
  const [chatOtherUserId, setChatOtherUserId] = useState('');
  const [chatOtherUserName, setChatOtherUserName] = useState('');
  const [chatOtherUserType, setChatOtherUserType] = useState<'parent' | 'therapist'>('therapist');
  const [isStartingChat, setIsStartingChat] = useState(false);

  // 사용자 권한 체크 (치료사 또는 관리자, 또는 특정 관리자 이메일만 게시글 작성 가능)
  const canCreatePost = currentUser?.email === 'dudals7334@naver.com' || 
    currentUser?.email === 'everystars@naver.com' ||
    (userData && (userData.userType === 'therapist' || userData.userType === 'admin'));

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

  // Firebase에서 가져온 치료사 데이터 상태
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 5; // 페이지당 치료사 수

  // Firebase에서 치료사 게시글 데이터와 실제 프로필 정보 실시간으로 가져오기
  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('type', 'in', ['teacher-offer', 'teacher-request']),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      console.log('📥 실시간 데이터 업데이트:', snapshot.size, '개의 문서');
      
      if (snapshot.empty) {
        setTeachersData([]);
        setLoading(false);
        return;
      }

      try {
        // 모든 게시글의 실제 사용자 데이터를 병렬로 가져오기
        const teachersPromises = snapshot.docs.map(async (postDoc) => {
          const docData = postDoc.data();
          console.log('🔍 게시글 처리 중:', postDoc.id, 'authorId:', docData.authorId);

          // 실제 게시글 데이터를 기반으로 Teacher 객체 생성
          const teacher: Teacher = {
            id: postDoc.id,
            // 게시글 제목을 그대로 사용 (실제 사용자가 작성한 제목)
            name: docData.title || `${docData.age || ''} / ${docData.gender || ''} ${docData.treatment || '치료사'}`,
            specialty: docData.treatment || '재활치료',
            experience: 0, // 프로필에서 업데이트됨
            rating: 0.0, // 실제 후기 기반으로 계산됨
            reviewCount: 0, // 실제 후기 수로 업데이트됨
            profileImage: '', // 프로필에서 업데이트됨
            certifications: [], // 프로필에서 업데이트됨
            education: '정보 없음', // 프로필에서 업데이트됨
            career: '정보 없음', // 프로필에서 업데이트됨
            regions: [docData.region],
            // 실제 사용자가 입력한 시간 정보
            schedule: docData.timeDetails || '협의 후 결정',
            // 실제 사용자가 작성한 세부내용을 소개로 사용
            introduction: docData.additionalInfo || `${docData.treatment || '치료'} 서비스를 제공합니다. ${docData.timeDetails ? `시간: ${docData.timeDetails}` : ''}`,
            // 게시글 정보를 종합한 철학
            philosophy: docData.additionalInfo || `${docData.region}에서 ${docData.treatment} 서비스를 제공합니다. ${docData.frequency ? `주당 ${docData.frequency}` : ''}`,
            services: docData.treatment || '',
            videoUrl: '',
            // 실제 사용자가 입력한 가격
            price: docData.price || '협의',
            region: docData.region || '서울',
            category: docData.category || docData.region,
            createdAt: docData.createdAt,
            authorId: docData.authorId,
            // 게시글의 실제 데이터를 추가 필드로 저장
            postAge: docData.age,
            postGender: docData.gender,
            postFrequency: docData.frequency,
            postTimeDetails: docData.timeDetails,
            postAdditionalInfo: docData.additionalInfo,
            // 인증 상태 기본값 (프로필에서 업데이트됨)
            isVerified: false,
            hasCertification: false,
            hasExperienceProof: false,
            hasIdVerification: false,
          };

          // authorId가 있는 경우에만 실제 데이터 가져오기
          if (docData.authorId) {
            try {
              // 1. 기본 사용자 정보 가져오기
              const userDocRef = doc(db, 'users', docData.authorId);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                const userData = userDoc.data() as { 
                  name?: string; 
                  email?: string; 
                  phone?: string; 
                  userType?: string;
                  videoUrl?: string;
                  isVerified?: boolean;
                  hasCertification?: boolean;
                  hasExperienceProof?: boolean;
                  hasIdVerification?: boolean;
                };
                teacher.name = userData.name || teacher.name;
                teacher.userName = userData.name;
                teacher.userEmail = userData.email;
                teacher.userPhone = userData.phone;
                teacher.videoUrl = userData.videoUrl || teacher.videoUrl; // 자기소개 영상
                // 인증 상태는 users 컬렉션에서 가져올 수도 있음
                teacher.isVerified = userData.isVerified || teacher.isVerified;
                teacher.hasCertification = userData.hasCertification || teacher.hasCertification;
                teacher.hasExperienceProof = userData.hasExperienceProof || teacher.hasExperienceProof;
                teacher.hasIdVerification = userData.hasIdVerification || teacher.hasIdVerification;
                console.log('✅ 사용자 기본 정보 적용:', userData.name);
              }

              // 2. 치료사 프로필 정보 가져오기
              const profilesQuery = query(
                collection(db, 'therapistProfiles'),
                where('userId', '==', docData.authorId),
                limit(1)
              );

              const profileSnapshot = await new Promise<{ empty: boolean; docs: { data: () => unknown }[]; }>((resolve, reject) => {
                const unsubscribeProfile = onSnapshot(profilesQuery, resolve, reject);
                setTimeout(() => {
                  unsubscribeProfile();
                  resolve({ empty: true, docs: [] });
                }, 2000); // 2초 타임아웃
              });

              if (!profileSnapshot.empty && profileSnapshot.docs.length > 0) {
                const profileData = profileSnapshot.docs[0].data() as {
                  name?: string;
                  specialties?: string[];
                  experience?: number;
                  rating?: number;
                  reviewCount?: number;
                  profileImage?: string;
                  education?: string;
                  career?: string;
                  introduction?: string;
                  philosophy?: string;
                  certifications?: string[];
                  schedule?: string;
                  status?: string;
                  videoUrl?: string;
                  isVerified?: boolean;
                  hasCertification?: boolean;
                  hasExperienceProof?: boolean;
                  hasIdVerification?: boolean;
                } | null;
                console.log('✅ 치료사 프로필 정보 적용:', profileData?.name);
                
                // 프로필 데이터로 업데이트
                teacher.name = profileData?.name || teacher.name;
                teacher.specialty = profileData?.specialties?.[0] || teacher.specialty;
                teacher.experience = profileData?.experience || 0;
                // rating은 실제 후기에서 계산하므로 프로필 데이터 사용하지 않음
                teacher.reviewCount = profileData?.reviewCount || 0;
                teacher.profileImage = profileData?.profileImage || '';
                teacher.education = profileData?.education || '정보 없음';
                teacher.career = profileData?.career || '정보 없음';
                teacher.introduction = profileData?.introduction || teacher.introduction;
                teacher.philosophy = profileData?.philosophy || teacher.philosophy;
                teacher.certifications = profileData?.certifications || [];
                teacher.schedule = profileData?.schedule || teacher.schedule;
                teacher.videoUrl = profileData?.videoUrl || ''; // 자기소개 영상 URL
                
                // 인증 상태 업데이트 - 실제 프로필 데이터 기반 + 관리자 승인 상태
                teacher.isVerified = profileData?.isVerified || false; // 모든별 인증
                teacher.hasCertification = profileData?.hasCertification || (profileData?.certifications && profileData.certifications.length > 0) || false;
                teacher.hasExperienceProof = profileData?.hasExperienceProof || !!profileData?.career;
                teacher.hasIdVerification = profileData?.hasIdVerification || !!profileData?.status;
              }

              // 3. 실제 후기 수와 평균 별점 계산
              const reviewsQuery = query(
                collection(db, 'therapist-reviews'),
                where('therapistId', '==', docData.authorId)
              );

              const reviewsSnapshot = await new Promise<{ docs: { data: () => { rating?: number } }[]; size: number }>((resolve) => {
                const unsubscribeReviews = onSnapshot(
                  reviewsQuery, 
                  (snapshot) => {
                    unsubscribeReviews();
                    resolve({ docs: snapshot.docs, size: snapshot.size });
                  }, 
                  () => {
                    resolve({ docs: [], size: 0 });
                  }
                );
                setTimeout(() => {
                  unsubscribeReviews();
                  resolve({ docs: [], size: 0 });
                }, 1000); // 1초 타임아웃
              });

              teacher.reviewCount = reviewsSnapshot.size || 0;
              
              // 실제 후기가 있으면 평균 별점 계산, 없으면 0.0
              if (reviewsSnapshot.size > 0) {
                const ratings = reviewsSnapshot.docs.map((doc) => doc.data()?.rating || 0);
                const totalRating = ratings.reduce((sum: number, rating: number) => sum + rating, 0);
                teacher.rating = Math.round((totalRating / ratings.length) * 10) / 10; // 소수점 첫째자리까지
              } else {
                teacher.rating = 0.0; // 후기가 없으면 0.0점
              }
              
              console.log('✅ 후기 정보 업데이트:', {
                count: teacher.reviewCount,
                averageRating: teacher.rating
              });

            } catch (error) {
              console.error('❌ 실제 데이터 가져오기 오류 (authorId:', docData.authorId, '):', error);
            }
          }

          return teacher;
        });

        // 모든 Promise 완료 대기
        const teachers = await Promise.all(teachersPromises);
        
        console.log('✅ 실시간 업데이트 완료:', teachers.length, '개 치료사 (실제 데이터 연동)');
        setTeachersData(teachers);
        setLoading(false);

      } catch (error) {
        console.error('❌ 전체 데이터 처리 오류:', error);
        setTeachersData([]);
        setLoading(false);
      }
    }, (error) => {
      console.error('❌ 실시간 데이터 로딩 오류:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // 게시글 작성 모달 외부 클릭 시 모달 닫기
      if (!target.closest('.create-post-modal') && !target.closest('[data-create-post-button]')) {
        if (showCreatePostModal) closeCreatePostModal();
      }
      
      // 상세 프로필 모달 외부 클릭 시 모달 닫기
      if (showProfileModal && !target.closest('.profile-modal')) {
        closeProfileModal();
      }
      
      // 확인 팝업 외부 클릭 시 팝업 닫기
      if (showConfirmModal && !target.closest('.confirm-modal')) {
        closeConfirmModal();
      }
      
      // 채팅 확인 모달 외부 클릭 시 모달 닫기
      if (showChatConfirmModal && !target.closest('.chat-confirm-modal')) {
        closeChatConfirmModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCreatePostModal, showProfileModal, showConfirmModal, showChatConfirmModal]);

  // 현재 선택된 지역의 치료사 필터링
  const getCurrentTeachers = () => {
    if (selectedSidebarItem === '홈티매칭') {
      return teachersData;
    }
    
    return teachersData.filter(teacher => teacher.region === selectedSidebarItem);
  };

  // 검색 필터링
  const filteredTeachers = getCurrentTeachers().filter((teacher: Teacher) => {
    const treatmentMatch = selectedTreatment === '희망치료를 선택하세요' || selectedTreatment === '전체' || teacher.specialty === selectedTreatment;
    const locationMatch = selectedLocation === '희망지역을 선택하세요' || selectedLocation === '전체' || 
                         teacher.category?.includes(selectedLocation);
    
    return treatmentMatch && locationMatch;
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);
  const startIndex = (currentPage - 1) * teachersPerPage;
  const endIndex = startIndex + teachersPerPage;
  const currentTeachers = filteredTeachers.slice(startIndex, endIndex);

  // 선택된 지역에 따른 제목과 탭 변경
  const getRegionTitle = () => {
    if (selectedSidebarItem === '홈티매칭') return '전국 홈티매칭';
    return `${selectedSidebarItem} 홈티매칭`;
  };


  // 현재 선택된 탭에 따른 지역 목록 가져오기
  const getCurrentLocations = () => {
    return locationsByRegion[selectedTab as keyof typeof locationsByRegion] || locationsByRegion['서울'];
  };

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

  // 프로필 등록 확인 후 작성 모달 열기
  const handleConfirmRegister = () => {
    closeConfirmModal();
    // 확인 팝업이 닫힌 후 프로필 작성 모달 열기
    setTimeout(() => {
      setShowCreatePostModal(true);
    }, 300);
  };

  // 상세 프로필 모달 열기 - 실제 사용자 데이터 가져오기 (로그인 체크 추가)
  const openProfileModal = async (teacher: Teacher) => {
    // 비로그인 사용자는 상세 보기 불가
    if (!currentUser) {
      alert('치료사 상세 프로필을 보려면 로그인이 필요합니다.');
      return;
    }
    
    console.log('🔍 프로필 모달 열기 - 게시글 작성자 ID:', teacher.authorId);
    
    // authorId가 없으면 기본 정보로 표시
    if (!teacher.authorId) {
      console.log('❌ 게시글 작성자 ID가 없습니다');
      setSelectedProfile({
        ...teacher,
        isVerified: false,
        hasCertification: false,
        hasExperienceProof: false,
        hasIdVerification: false,
      });
      setShowProfileModal(true);
      return;
    }
    
    try {
      // 1. 게시글 작성자의 기본 사용자 정보 가져오기
      const userDoc = await getDoc(doc(db, 'users', teacher.authorId));
      let userData = null;
      if (userDoc.exists()) {
        userData = userDoc.data();
        console.log('✅ 사용자 기본 정보:', userData);
      } else {
        console.log('❌ 사용자 정보를 찾을 수 없습니다');
      }

      // 2. 치료사 프로필 정보 가져오기
      const profilesQuery = query(
        collection(db, 'therapistProfiles'),
        where('userId', '==', teacher.authorId),
        limit(1)
      );
      
      const profileSnapshot: { empty: boolean; docs: { data: () => unknown }[]; } = await new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(profilesQuery, resolve, reject);
        // 타임아웃 설정
        setTimeout(() => {
          unsubscribe();
          resolve({ empty: true, docs: [] });
        }, 3000);
      });
      
      let profileData: {
        name?: string;
        specialties?: string[];
        experience?: number;
        rating?: number;
        reviewCount?: number;
        profileImage?: string;
        education?: string;
        career?: string;
        introduction?: string;
        philosophy?: string;
        certifications?: string[];
        schedule?: string;
        status?: string;
      } | null = null;
      if (!profileSnapshot.empty && profileSnapshot.docs.length > 0) {
        profileData = profileSnapshot.docs[0].data() as {
          name?: string;
          specialties?: string[];
          experience?: number;
          rating?: number;
          reviewCount?: number;
          profileImage?: string;
          education?: string;
          career?: string;
          introduction?: string;
          philosophy?: string;
          certifications?: string[];
          schedule?: string;
          status?: string;
        };
        console.log('✅ 치료사 프로필 데이터:', profileData);
      } else {
        console.log('❌ 치료사 프로필을 찾을 수 없습니다');
      }
      
      // 3. 모든 데이터를 통합하여 selectedProfile 설정
      const combinedProfile = {
        ...teacher,
        // 기본 사용자 정보로 업데이트
        name: userData?.name || profileData?.name || teacher.name,
        userName: userData?.name,
        userEmail: userData?.email,
        userPhone: userData?.phone,
        
        // 치료사 프로필 정보로 업데이트
        experience: profileData?.experience || teacher.experience,
        specialty: profileData?.specialties?.[0] || teacher.specialty,
        rating: profileData?.rating || teacher.rating,
        reviewCount: profileData?.reviewCount || teacher.reviewCount,
        profileImage: profileData?.profileImage || teacher.profileImage,
        education: profileData?.education || teacher.education,
        career: profileData?.career || teacher.career,
        introduction: profileData?.introduction || teacher.introduction,
        philosophy: profileData?.philosophy || teacher.philosophy,
        certifications: profileData?.certifications || teacher.certifications || [],
        schedule: profileData?.schedule || teacher.schedule,
        
        // 게시글의 실제 데이터 보존 (이미 teacher에서 스프레드되지만 명시적으로 추가)
        postAge: teacher.postAge,
        postGender: teacher.postGender,
        postFrequency: teacher.postFrequency,
        postTimeDetails: teacher.postTimeDetails,
        postAdditionalInfo: teacher.postAdditionalInfo,
        
        // 인증 상태 업데이트
        isVerified: profileData?.status === 'approved',
        hasCertification: profileData?.certifications && profileData.certifications.length > 0,
        hasExperienceProof: !!profileData?.career,
        hasIdVerification: !!profileData?.status,
      };
      
      console.log('📋 최종 통합 프로필:', combinedProfile);
      
      setSelectedProfile(combinedProfile);
      setShowProfileModal(true);
      
    } catch (error) {
      console.error('❌ 프로필 모달 열기 오류:', error);
      
      // 오류가 발생해도 기본 정보로 모달 표시
      const basicProfile = {
        ...teacher,
        userName: '이름 없음',
        introduction: '정보를 불러올 수 없습니다.',
        education: '정보 없음',
        career: '정보 없음',
        certifications: [],
        isVerified: false,
        hasCertification: false,
        hasExperienceProof: false,
        hasIdVerification: false,
      };
      
      setSelectedProfile(basicProfile);
      setShowProfileModal(true);
    }
  };

  // 상세 프로필 모달 닫기
  const closeProfileModal = () => {
    setIsProfileModalClosing(true);
    setTimeout(() => {
      setShowProfileModal(false);
      setIsProfileModalClosing(false);
      setSelectedProfile(null);
    }, 300);
  };

  // 안전 모달은 사용하지 않고 바로 확인 모달로 이동
  const openChatFlow = () => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (userData?.userType === 'parent') {
      setShowChatConfirmModal(true);
    } else {
      alert('학부모만 채팅을 시작할 수 있습니다.');
    }
  };
  
  // 채팅 확인 모달 닫기 (취소)
  const closeChatConfirmModal = () => {
    setIsChatConfirmModalClosing(true);
    setTimeout(() => {
      setShowChatConfirmModal(false);
      setIsChatConfirmModalClosing(false);
    }, 300);
  };

  // 실제 채팅 시작 (동의하고 채팅 시작 버튼)
  const handleStartChat = async () => {
    if (!currentUser || !userData || !selectedProfile) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (userData.userType !== 'parent') {
      alert('학부모만 채팅을 시작할 수 있습니다.');
      return;
    }

    setIsStartingChat(true);
    
    try {
      // 치료사 정보 설정
      const therapistId = selectedProfile.authorId || selectedProfile.id;
      const therapistName = selectedProfile.name || selectedProfile.userName || '치료사';

      console.log('채팅 시작 시도:', {
        currentUserId: currentUser.uid,
        currentUserName: userData.name,
        therapistId,
        therapistName
      });

      // 채팅방 생성 또는 기존 채팅방 찾기
      const roomId = await startChatWithTherapist(
        currentUser.uid,
        userData.name || '학부모',
        therapistId,
        therapistName
      );

      // 채팅 상태 설정
      setChatRoomId(roomId);
      setChatOtherUserId(therapistId);
      setChatOtherUserName(therapistName);
      setChatOtherUserType('therapist');

      // 모달들 닫고 채팅창 열기
      setShowChatConfirmModal(false);
      setIsChatConfirmModalClosing(false);
      setShowProfileModal(false);
      setIsProfileModalClosing(false);
      
      setTimeout(() => {
        setShowChat(true);
      }, 100);

    } catch (error) {
      console.error('채팅 시작 실패:', error);
      alert('채팅을 시작할 수 없습니다. 다시 시도해주세요.');
    } finally {
      setIsStartingChat(false);
    }
  };

  // 채팅창 닫기
  const handleCloseChat = () => {
    setShowChat(false);
    setChatRoomId('');
    setChatOtherUserId('');
    setChatOtherUserName('');
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
      const newTitle = `${postData.age} ${genderText} ${postData.treatment} 홈티`;
      
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
        status: 'active',
        applications: 0,
        // 추가 정보들
        title: newTitle,
        category: postData.detailLocation || postData.region,
        details: postData.timeDetails,
        additionalInfo: postData.additionalInfo || '',
        // 게시글 타입 구분 (치료사 홍보용)
        type: 'teacher-offer'
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
      
    } catch (error) {
      console.error('Error adding document: ', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      alert('게시글 저장 중 오류가 발생했습니다: ' + errorMessage);
    }
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.location-modal') && !target.closest('[data-location-button]')) {
        setShowLocationModal(false);
      }
      if (!target.closest('.treatment-modal') && !target.closest('[data-treatment-button]')) {
        setShowTreatmentModal(false);
      }
      // 게시글 작성 모달 외부 클릭 시 모달 닫기
      if (!target.closest('.create-post-modal') && !target.closest('[data-create-post-button]')) {
        closeCreatePostModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="flex max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 사이드바 */}
        <div className="w-64 bg-white shadow-lg rounded-lg mr-8 h-fit">
          <div className="p-4">
            <div className="mb-6">
              <button className="w-full bg-blue-500 text-white text-xl font-bold rounded-2xl h-[110px] flex items-center justify-center">
                홈티매칭
              </button>
            </div>
            <div className="space-y-1">
              <Link href="/request" className="block w-full text-gray-700 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors">
                선생님께 요청하기
              </Link>
              <div className="w-full bg-blue-50 text-blue-600 text-left px-4 py-3 rounded-2xl text-sm font-medium">
                선생님 둘러보기
              </div>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1">
          {/* 제목과 브레드크럼 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{getRegionTitle()}</h1>
            
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">홈</Link>
              <span className="mx-2">&gt;</span>
              <Link href="/browse" className="hover:text-blue-600">홈티매칭</Link>
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
                    setCurrentPage(1);
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
                  
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    {treatments.filter(treatment => treatment !== '희망치료를 선택하세요').map((treatment) => (
                      <button
                        key={treatment}
                        onClick={() => {
                          setSelectedTreatment(treatment);
                          setShowTreatmentModal(false);
                          setCurrentPage(1);
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

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowTreatmentModal(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors text-sm"
                    >
                      닫기
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
                  
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    {getCurrentLocations().filter(location => location !== '희망지역을 선택하세요').map((location) => (
                      <button
                        key={location}
                        onClick={() => {
                          setSelectedLocation(location);
                          setShowLocationModal(false);
                          setCurrentPage(1);
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

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowLocationModal(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors text-sm"
                    >
                      닫기
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

          {/* 새 게시글 작성 버튼 */}
          <div className="mb-6 flex justify-end">
            {canCreatePost ? (
              <button
                onClick={openConfirmModal}
                data-create-post-button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                내 프로필 등록하기
              </button>
            ) : (
              <div className="flex flex-col items-center">
                <button
                  disabled
                  className="bg-gray-400 cursor-not-allowed text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 mb-2 ml-12"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  내 프로필 등록하기
                </button>
                <p className="text-sm text-gray-600 text-center">
                  {currentUser ? 
                    '치료사 계정만 게시글을 작성할 수 있습니다.' : 
                    '로그인 후 이용해주세요.'
                  }
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

          {/* 치료사 카드 */}
          {!loading && (
            <div className="space-y-4">
              {filteredTeachers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
                  등록된 선생님이 없습니다.
                </div>
              ) : (
                currentTeachers.map((teacher) => (
                  <div key={teacher.id} className="bg-white rounded-2xl border-2 border-blue-100 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200">
                    <div className="flex items-start justify-between">
                      {/* 왼쪽: 프로필 정보 */}
                      <div className="flex items-start space-x-4 flex-1">
                        {/* 프로필 이미지 */}
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                          {teacher.profileImage ? (
                            <Image 
                              src={teacher.profileImage} 
                              alt={`${teacher.name} 프로필`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <div className="text-center">
                              <span className="text-gray-500 text-xs font-medium block">프로필</span>
                              <span className="text-gray-400 text-xs block">사진</span>
                            </div>
                          )}
                        </div>
                        
                        {/* 치료사 정보 */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">
                              {/* 성 + 00 + 치료사 [년차 전문분야] 형태로 표시 */}
                              {getLastName(teacher.userName || teacher.name)}00 치료사 <span className="text-gray-600">[{teacher.experience || 0}년차 {teacher.specialty}]</span>
                            </h3>
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center">
                              {teacher.reviewCount > 0 ? (
                                <>
                                  <span className="text-orange-400 text-lg">★</span>
                                  <span className="text-sm font-medium ml-1">{teacher.rating}</span>
                                  <span className="text-xs text-gray-500 ml-1">(후기 {teacher.reviewCount}개)</span>
                                </>
                              ) : (
                                <span className="text-xs text-gray-500">후기 없음</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              #{teacher.specialty}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              #{teacher.region}
                            </span>
                            {teacher.postFrequency && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                {teacher.postFrequency}
                              </span>
                            )}
                          </div>
                          
                          <div className="text-xl font-bold text-blue-600 mb-4">
                            회기당 {(() => {
                              if (!teacher.price) return '협의';
                              const priceStr = teacher.price.toString();
                              if (priceStr.includes('원')) return priceStr;
                              const numericPrice = priceStr.replace(/[^0-9]/g, '');
                              if (!numericPrice) return '협의';
                              return numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
                            })()}
                          </div>

                          
                          <div className="border-t border-gray-200 pt-3 mb-3"></div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            {/* 자격증 인증 - 실제 데이터 반영 */}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${teacher.hasCertification ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}>
                              {teacher.hasCertification ? '✓' : '×'} 자격증
                            </span>
                            
                            {/* 경력증명 - 실제 데이터 반영 */}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${teacher.hasExperienceProof ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}>
                              {teacher.hasExperienceProof ? '✓' : '×'} 경력증명
                            </span>
                            
                            {/* 신분증확인서 - 실제 데이터 반영 */}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${teacher.hasIdVerification ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}>
                              {teacher.hasIdVerification ? '✓' : '×'} 신분증확인서
                            </span>
                            
                            {/* 모든별 인증 - 파란색 별과 함께 맨 뒤에 표시 */}
                            {teacher.isVerified && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                <span className="text-blue-500 mr-1">⭐</span> 모든별 인증
                              </span>
                            )}
                            
                            {/* 보험가입 - 추후 구현 */}
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              보험가입
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 오른쪽: 채팅 버튼 */}
                      <div className="flex flex-col items-end space-y-3 ml-6">
                        <button 
                          onClick={openChatFlow}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors shadow-sm"
                        >
                          1:1 채팅
                        </button>
                        
                        <div className="text-right">
                          <button 
                            onClick={() => openProfileModal(teacher)}
                            className="text-xs text-gray-500 hover:text-blue-600 mb-1 cursor-pointer transition-colors"
                          >
                            상세 프로필 보기 &gt;
                          </button>
                        
                          <div className="text-xs text-gray-400">
                            {teacher.createdAt ? 
                              new Date(
                                (teacher.createdAt && typeof teacher.createdAt === 'object' && 'toDate' in teacher.createdAt && typeof teacher.createdAt.toDate === 'function') 
                                  ? teacher.createdAt.toDate() 
                                  : teacher.createdAt as string | number
                              ).toLocaleDateString('ko-KR', {
                                month: 'long',
                                day: 'numeric'
                                }) : '등록일 미상'
                            }
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
          {!loading && filteredTeachers.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
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
              </div>
              
              <div className="ml-6 text-sm text-gray-500 flex items-center">
                총 {filteredTeachers.length}명의 선생님 | {currentPage}/{totalPages} 페이지
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 새 게시글 작성 모달 */}
      {showCreatePostModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className={`bg-white rounded-lg p-8 max-w-6xl w-[95vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto create-post-modal ${isModalClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">선생님 둘러보기</h2>
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
                    <input
                      type="text"
                      value={newPost.timeDetails.split(' / ')[0] || ''}
                      onChange={(e) => {
                        const timePart = newPost.timeDetails.split(' / ')[1] || '';
                        setNewPost(prev => ({ ...prev, timeDetails: `${e.target.value} / ${timePart}` }));
                      }}
                      placeholder="월,수"
                      className="flex-1 px-4 py-3 border-0 rounded-l-2xl focus:outline-none text-center"
                      required
                    />
                    <div className="px-2 text-gray-400 font-medium">/</div>
                    <input
                      type="text"
                      value={newPost.timeDetails.split(' / ')[1] || ''}
                      onChange={(e) => {
                        const dayPart = newPost.timeDetails.split(' / ')[0] || '';
                        setNewPost(prev => ({ ...prev, timeDetails: `${dayPart} / ${e.target.value}` }));
                      }}
                      placeholder="5시~6시"
                      className="flex-1 px-4 py-3 border-0 rounded-r-2xl focus:outline-none text-center"
                      required
                    />
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
                  onChange={(e) => setNewPost(prev => ({ ...prev, additionalInfo: e.target.value }))}
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
                      <p><strong>제목:</strong> {newPost.age} {newPost.gender === '남' ? '남아' : newPost.gender === '여' ? '여아' : newPost.gender} {newPost.treatment} 홈티</p>
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
                  홈티지원하기
                </button>
              </div>
            </form>
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

      {/* 상세 프로필 모달 */}
      {showProfileModal && selectedProfile && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className={`bg-white rounded-lg max-w-6xl w-[95vw] shadow-xl border-4 border-blue-500 max-h-[90vh] overflow-y-auto profile-modal ${isProfileModalClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
            {/* 모달 헤더 */}
            <div className="flex justify-end p-6 pb-2">
              <button
                onClick={closeProfileModal}
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
                  {selectedProfile?.profileImage ? (
                    <Image 
                      src={selectedProfile.profileImage} 
                      alt={`${selectedProfile.name} 프로필`}
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
                    {selectedProfile.name} 치료사 ({selectedProfile.experience ? `${selectedProfile.experience}년차` : '경력미상'} {selectedProfile.specialty}사)
                  </h2>
                  <div className="flex items-center mb-2">
                    {selectedProfile.reviewCount && selectedProfile.reviewCount > 0 ? (
                      <>
                        <span className="text-orange-400 text-lg">★</span>
                        <span className="text-sm font-medium ml-1">{selectedProfile.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">(후기 {selectedProfile.reviewCount}개)</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">후기 없음</span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-3">
                    회기당 {(() => {
                      if (!selectedProfile.price) return '협의';
                      const priceStr = selectedProfile.price.toString();
                      if (priceStr.includes('원')) return priceStr;
                      const numericPrice = priceStr.replace(/[^0-9]/g, '');
                      if (!numericPrice) return '협의';
                      return numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
                    })()}
                  </div>

                  {/* 회색줄 */}
                  <hr className="border-gray-300 mb-4" />
                </div>
              </div>

              {/* 인증 정보 - 회색줄 바로 밑에 */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {/* 자격증 인증 */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedProfile.hasCertification ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}>
                  {selectedProfile.hasCertification ? '✓' : '×'} 자격증
                </span>
                
                {/* 경력증명 */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedProfile.hasExperienceProof ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}>
                  {selectedProfile.hasExperienceProof ? '✓' : '×'} 경력증명
                </span>
                
                {/* 신분증확인서 */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedProfile.hasIdVerification ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'} border`}>
                  {selectedProfile.hasIdVerification ? '✓' : '×'} 신분증확인서
                </span>
                
                {/* 모든별 인증 - 파란색 별과 함께 */}
                {selectedProfile.isVerified && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                    <span className="text-blue-500 mr-1">⭐</span> 모든별 인증
                  </span>
                )}
              </div>

              {/* 태그들 - 회색줄 바로 밑에 별도 줄 */}
              <div className="flex items-center space-x-2 mb-8">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  #{selectedProfile.specialty}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  #{selectedProfile.region}
                </span>
                {selectedProfile.postFrequency && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    #{selectedProfile.postFrequency}
                  </span>
                )}
                {selectedProfile.postAge && selectedProfile.postGender && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                    #{selectedProfile.postAge}/{selectedProfile.postGender}
                  </span>
                )}
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
                      {selectedProfile.philosophy || selectedProfile.introduction || "치료 철학 및 강점이 등록되지 않았습니다."}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">주요 치료경험/사례</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedProfile.services || selectedProfile.career || "주요 치료경험 및 사례가 등록되지 않았습니다."}
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
                  {selectedProfile.videoUrl ? (
                    <video 
                      src={selectedProfile.videoUrl} 
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
                    <div className="text-sm text-gray-900">{selectedProfile.education || '등록되지 않음'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 mb-1">총 경력</div>
                    <div className="text-sm text-gray-900">{selectedProfile.career || (selectedProfile.experience ? `${selectedProfile.experience}년 이상의 전문 경력` : '등록되지 않음')}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 mb-1">활동 가능 지역</div>
                    <div className="text-sm text-gray-900">
                      {selectedProfile.regions?.join(', ') || selectedProfile.region || '등록되지 않음'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 mb-1">치료 가능 시간</div>
                    <div className="text-sm text-gray-900">{selectedProfile.schedule || selectedProfile.postTimeDetails || '등록되지 않음'}</div>
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
                        #{selectedProfile.specialty}
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
                            <span className="font-medium">학력:</span> {selectedProfile.education || '관련 학과 졸업'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-500 text-sm">•</span>
                        <div>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">경력:</span> {selectedProfile.career || (selectedProfile.experience ? `${selectedProfile.experience}년 이상의 전문 경력` : '등록되지 않음')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 보유 자격증 */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">보유 자격증</h4>
                    <div className="space-y-2">
                      {selectedProfile.certifications && selectedProfile.certifications.length > 0 ? (
                        selectedProfile.certifications.map((cert, index) => (
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
                  <h3 className="text-lg font-semibold text-gray-900">학부모 후기 ({selectedProfile.reviewCount || 0}건)</h3>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                  <p>아직 작성된 후기가 없습니다.</p>
                  <p className="text-sm mt-1">첫 번째 후기를 작성해보세요!</p>
                </div>
              </div>

              {/* 1:1 채팅 버튼 */}
              <div className="text-center">
                <button 
                  onClick={() => {
                    closeProfileModal();
                    setShowSafetyModal(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg w-full max-w-md"
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  1:1 채팅으로 인터뷰 시작하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 첫 번째(안전 매칭) 모달은 비활성화됨 */}

      {/* 채팅 시작 전 확인 모달 (학부모 전용) */}
      {showChatConfirmModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className={`bg-white border-4 border-blue-700 rounded-lg max-w-md w-[95vw] max-h-[90vh] overflow-y-auto shadow-xl chat-confirm-modal ${isChatConfirmModalClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
            {/* 헤더 */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeChatConfirmModal}
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
                  onClick={closeChatConfirmModal}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleStartChat}
                  disabled={isStartingChat}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isStartingChat
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isStartingChat ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>채팅방 생성 중...</span>
                    </div>
                  ) : (
                    '동의하고 채팅 시작'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 프로필 등록 확인 팝업 */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className={`bg-white rounded-2xl p-8 max-w-md w-[90%] text-center shadow-2xl transform confirm-modal ${isConfirmModalClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
            {/* 로켓 아이콘 */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(45)">
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              프로필을 목록에 등록하시겠습니까?
            </h2>
            
            {/* 설명 */}
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              [확인] 버튼을 누르시면, 회원님의 프로필이 ** &apos;내 프로필 등록하기&apos; 목록에 자동으로 노출** 되어 학부모님들이 볼 수 있게 됩니다.
            </p>
            
            {/* 버튼들 */}
            <div className="flex gap-3">
              <button
                onClick={closeConfirmModal}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmRegister}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                네, 등록합니다
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1:1 채팅창 */}
      {showChat && (
        <OneOnOneChat
          chatRoomId={chatRoomId}
          otherUserId={chatOtherUserId}
          otherUserName={chatOtherUserName}
          otherUserType={chatOtherUserType}
          onClose={handleCloseChat}
        />
      )}

    </section>
  );
}
