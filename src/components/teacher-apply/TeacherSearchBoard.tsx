'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 치료사 타입 정의
interface Teacher {
  id: number;
  category: string;
  name: string;
  details: string;
  hourlyRate: string;
  status: string;
  applications: number;
  // 추가 필드들
  fullName?: string; // 성+이름 전체
  gender?: string; // 성별
  residence?: string; // 거주 지역
  treatmentRegion?: string; // 치료 지역
  experience?: string; // 경력
  specialty?: string; // 전문 분야
}

export default function TeacherSearchBoard() {
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('치료사등록');
  // const [selectedTab, setSelectedTab] = useState('서울');
  const [searchKeyword, setSearchKeyword] = useState('');
  // const [selectedTherapyTypes, setSelectedTherapyTypes] = useState<string[]>([]);
  const [selectedTherapyField, setSelectedTherapyField] = useState('');
  const [selectedDetailStatus, setSelectedDetailStatus] = useState('전체');
  const [selectedGender, setSelectedGender] = useState('');
  // const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [isPopupClosing, setIsPopupClosing] = useState(false);

  // 등록된 치료사 목록 상태
  const [registeredTeachers, setRegisteredTeachers] = useState<Teacher[]>([]);
  const registeredTeachersRef = useRef<Teacher[]>([]);

  // registeredTeachers가 변경될 때 ref 업데이트
  useEffect(() => {
    registeredTeachersRef.current = registeredTeachers;
  }, [registeredTeachers]);

  // localStorage에서 데이터 불러오기 및 실시간 동기화
  useEffect(() => {
    // 초기 데이터 로드
    const loadTeachers = () => {
    if (typeof window !== 'undefined') {
        try {
      const savedTeachers = localStorage.getItem('registeredTeachers');
      if (savedTeachers) {
          const parsedTeachers = JSON.parse(savedTeachers);
            // 데이터 유효성 검사
            if (Array.isArray(parsedTeachers)) {
          setRegisteredTeachers(parsedTeachers);
            } else {
              if (process.env.NODE_ENV === 'development') {
                console.warn('저장된 치료사 데이터 형식이 올바르지 않습니다.');
              }
              setRegisteredTeachers([]);
            }
          }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
          console.error('저장된 치료사 데이터를 불러오는데 실패했습니다:', error);
        }
            setRegisteredTeachers([]);
          }
      }
    };

    // 초기 로드
    loadTeachers();

    // localStorage 변경 감지 (다른 탭에서 변경될 때)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'registeredTeachers') {
        loadTeachers();
      }
    };

    // 같은 탭에서 localStorage 직접 변경 감지
    const handleLocalStorageUpdate = () => {
      loadTeachers();
    };

    // 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdate', handleLocalStorageUpdate);

    // 실시간 업데이트를 위한 주기적 동기화 (옵션)
    const interval = setInterval(() => {
      try {
        // 실제 서버와 연결될 때 여기서 API 호출
        // 현재는 localStorage 재확인으로 대체
        const currentData = localStorage.getItem('registeredTeachers');
        if (currentData) {
          const currentTeachers = JSON.parse(currentData);
          
          // 데이터 유효성 확인
          if (Array.isArray(currentTeachers)) {
            // 데이터 변경 확인 (간단한 비교)
            if (JSON.stringify(currentTeachers) !== JSON.stringify(registeredTeachersRef.current)) {
              setRegisteredTeachers(currentTeachers);
            }
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('주기적 동기화 중 에러 발생:', error);
        }
      }
    }, 5000); // 5초마다 확인

    // 정리 함수
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleLocalStorageUpdate);
      clearInterval(interval);
    };
  }, []); // 빈 dependency array로 변경하여 무한 루프 방지

  // localStorage에 데이터 저장하는 함수 (실시간 동기화 포함)
  const saveToLocalStorage = (teachers: Teacher[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('registeredTeachers', JSON.stringify(teachers));
        // 같은 탭에서 실시간 업데이트를 위한 이벤트 발생
        window.dispatchEvent(new Event('localStorageUpdate'));
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('치료사 데이터 저장에 실패했습니다:', error);
        }
      }
    }
  };

  // 파일 업로드 상태
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [educationFiles, setEducationFiles] = useState<File[]>([]);
  const [experienceFiles, setExperienceFiles] = useState<File[]>([]);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [bankBookFile, setBankBookFile] = useState<File | null>(null);
  const [academicFiles, setAcademicFiles] = useState<File[]>([]);
  const [careerFiles, setCareerFiles] = useState<File[]>([]);
  const [licenseFiles, setLicenseFiles] = useState<File[]>([]);

  // 등록 폼 데이터
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: '여성',
    phone: '',
    email: '',
    address: '',
    qualification: '',
    therapyActivity: '',
    mainSpecialty: '',
    educationCareer: '',
    certifications: '',
    experience: '',
    region: '',
    availableDays: [] as string[],
    availableTime: '',
    specialties: [] as string[],
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    hourlyRate: '',
    applicationSource: '',
    agreeTerms: false
  });

  // 팝업 닫기 함수 (애니메이션 포함)
  const closePopup = () => {
    setIsPopupClosing(true);
    setTimeout(() => {
      setShowRegistrationPopup(false);
      setIsPopupClosing(false);
    }, 300);
  };

  // 파일 업로드 핸들러
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setFiles: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    const files = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...files]);
  };

  const handleSingleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  // 파일 제거 핸들러
  const removeFile = (
    index: number,
    files: File[],
    setFiles: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  // 폼 데이터 핸들러
  const handleFormChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 치료사 등록 처리
  const handleTeacherRegistration = () => {
    // 필수 항목 검증
    if (!formData.name || !formData.phone || !formData.email || !formData.applicationSource || !formData.agreeTerms) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (!profileImage) {
      alert('프로필 사진을 업로드해주세요.');
      return;
    }

    if (academicFiles.length === 0) {
      alert('학력 증빙 서류를 업로드해주세요.');
      return;
    }

    if (careerFiles.length === 0) {
      alert('경력 증빙 서류를 업로드해주세요.');
      return;
    }

    if (licenseFiles.length === 0) {
      alert('자격증 사본을 업로드해주세요.');
      return;
    }

    if (educationFiles.length === 0) {
      alert('성범죄 경력 조회 증명서를 업로드해주세요.');
      return;
    }

    if (formData.availableDays.length === 0) {
      alert('치료 가능 요일을 선택해주세요.');
      return;
    }

    // 카테고리 매핑
    const getCategoryFromSpecialties = () => {
      const specialty = formData.specialties[0];
      if (['언어치료', '인지치료', '학습치료'].includes(specialty)) return '언어/인지치료';
      if (['놀이치료', '감각통합치료'].includes(specialty)) return '놀이/감각통합치료';
      if (['물리치료', '작업치료'].includes(specialty)) return '물리/작업치료';
      if (['ABA치료', '행동치료'].includes(specialty)) return 'ABA/행동치료';
      if (['미술치료', '음악치료'].includes(specialty)) return '미술/음악치료';
      return '기타';
    };

    // 새로운 치료사 생성 - 기존 치료사 중 가장 큰 ID + 1로 생성
    const nextId = registeredTeachers.length === 0 ? 1 : 
      Math.max(...registeredTeachers.filter(t => t && typeof t.id === 'number').map(t => t.id || 0)) + 1;
    
    // 제목 구성: 치료사 거주 지역/전문 분야/성별/치료 지역/경력/시간당 치료비
    const titleParts = [
      formData.address?.split(' ')[0] || '지역미정', // 거주 지역 (주소의 첫 부분)
      formData.specialties[0] || '전문분야미정', // 전문 분야
      formData.gender, // 성별
      formData.region || '치료지역미정', // 치료 지역
      formData.experience, // 경력
      `시간당 ${formData.hourlyRate || '협의'}` // 시간당 치료비
    ];
    
    const newTeacher: Teacher = {
      id: nextId,
      category: getCategoryFromSpecialties(),
      name: titleParts.join('/'), // 제목으로 표시될 내용
      details: `${formData.experience} 경력 / ${formData.specialties.join(', ')} 전문 / ${formData.region || '지역 협의'}`,
      hourlyRate: formatPrice(formData.hourlyRate) || '협의',
      status: '등록완료',
      applications: 0,
      // 추가 필드들
      fullName: formData.name, // 실제 이름
      gender: formData.gender,
      residence: formData.address?.split(' ')[0] || '지역미정',
      treatmentRegion: formData.region,
      experience: formData.experience,
      specialty: formData.specialties[0]
    };

    // 치료사 목록에 추가
    const updatedTeachers = [...registeredTeachers, newTeacher];
    setRegisteredTeachers(updatedTeachers);
    
    // localStorage에 저장
    saveToLocalStorage(updatedTeachers);

    // 폼 초기화
    setFormData({
      name: '',
      birthDate: '',
      gender: '여성',
      phone: '',
      email: '',
      address: '',
      qualification: '',
      therapyActivity: '',
      mainSpecialty: '',
      educationCareer: '',
      certifications: '',
      experience: '',
      region: '',
      availableDays: [],
      availableTime: '',
      specialties: [],
      bankName: '',
      accountHolder: '',
      accountNumber: '',
      hourlyRate: '',
      applicationSource: '',
      agreeTerms: false
    });

    // 파일 상태 초기화
    setProfileImage(null);
    setProfileImagePreview('');
    setEducationFiles([]);
    setExperienceFiles([]);
    setCertificateFiles([]);
    setBankBookFile(null);
    setAcademicFiles([]);
    setCareerFiles([]);
    setLicenseFiles([]);

    // 팝업 닫기
    closePopup();

    alert('치료사 등록이 완료되었습니다! 실시간으로 반영됩니다.');
  };

  const sidebarItems = ['치료사등록', '정식(경력)치료사 등록'];
  
  // 상세 상태 옵션
  const detailStatusOptions = ['전체', '등록완료', '검토중', '등록보류', '자격미달'];
  
  // 치료분야 옵션
  const therapyFieldOptions = [
    { value: '', label: '전체' },
    { value: 'speech', label: '언어치료사' },
    { value: 'play', label: '놀이치료사' },
    { value: 'sensory', label: '감각통합치료사' },
    { value: 'cognitive', label: '인지학습치료사' },
    { value: 'art', label: '미술치료사' },
    { value: 'physical', label: '물리치료사' },
    { value: 'occupational', label: '작업치료사' },
    { value: 'aba', label: 'ABA치료사' },
    { value: 'music', label: '음악치료사' },
    { value: 'special', label: '특수교육교사' },
    { value: 'psychologist', label: '임상심리사' },
    { value: 'social', label: '사회복지사' },
    { value: 'behavior', label: '행동치료사' },
    { value: 'etc', label: '기타' }
  ];
  // const therapyCheckboxes = [
  //   { id: 'speech', label: '언어치료사' },
  //   { id: 'play', label: '놀이치료사' },
  //   { id: 'sensory', label: '감각통합치료사' },
  //   { id: 'cognitive', label: '인지학습치료사' },
  //   { id: 'art', label: '미술치료사' },
  //   { id: 'physical', label: '물리치료사' },
  //   { id: 'occupational', label: '작업치료사' },
  //   { id: 'aba', label: 'ABA치료사' },
  //   { id: 'music', label: '음악치료사' },
  //   { id: 'special', label: '특수교육교사' },
  //   { id: 'psychologist', label: '임상심리사' },
  //   { id: 'social', label: '사회복지사' },
  //   { id: 'behavior', label: '행동치료사' },
  //   { id: 'etc', label: '기타' }
  // ];

  // 지역별 치료사 데이터 (현재 등록된 치료사 없음)
  const allRegionalTeachers: Record<string, Teacher[]> = {
    '서울': [],
    '인천/경기북부': [],
    '경기남부': [],
    '충청,강원,대전': [],
    '전라,경상,부산': []
  };

  // 현재 선택된 지역의 치료사 가져오기
  const getCurrentTeachers = () => {
    try {
      // 등록된 치료사가 배열인지 확인
      const teachersArray = Array.isArray(registeredTeachers) ? registeredTeachers : [];
      
    // 등록된 치료사를 등록 순으로 정렬 (id가 작을수록 먼저 등록)
      const sortedRegisteredTeachers = [...teachersArray]
        .filter(teacher => teacher && typeof teacher === 'object' && teacher.id)
        .sort((a, b) => (a.id || 0) - (b.id || 0));
    
    if (selectedSidebarItem === '치료사등록') {
      // 등록된 치료사만 보여줌 (등록 순)
      return sortedRegisteredTeachers;
    }
    return [...(allRegionalTeachers[selectedSidebarItem as keyof typeof allRegionalTeachers] || []), ...sortedRegisteredTeachers];
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Get teachers error:', error);
      }
      return [];
    }
  };

  // 필터링된 치료사 목록
  const filteredTeachers = getCurrentTeachers().filter(teacher => {
    try {
      // teacher 객체 유효성 검사
      if (!teacher || typeof teacher !== 'object') {
        return false;
      }

      // 상세 상태 필터
      if (selectedDetailStatus && selectedDetailStatus !== '전체' && teacher?.status !== selectedDetailStatus) {
        return false;
      }
      
      // 성별 필터
      if (selectedGender && teacher?.gender !== selectedGender) {
        return false;
      }
      
      // 검색어 필터
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const searchableText = [
          teacher?.name || '',
          teacher?.fullName || '',
          teacher?.residence || '',
          teacher?.treatmentRegion || '',
          teacher?.specialty || '',
          teacher?.details || ''
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(keyword)) {
          return false;
        }
      }
      
      // 치료분야 드롭다운 필터
      if (selectedTherapyField && selectedTherapyField !== '') {
        const therapyLabel = therapyFieldOptions.find(t => t.value === selectedTherapyField)?.label?.toLowerCase() || '';
        const teacherSpecialties = teacher?.specialty?.toLowerCase() || '';
        if (!teacherSpecialties.includes(therapyLabel.replace('치료사', '').replace('사', ''))) {
          return false;
        }
      }
      
      // 기존 치료분야 체크박스 필터 제거됨
      
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('필터링 중 에러 발생:', error, teacher);
      }
      return false;
    }
  });

  // const handleFilterSelect = () => {
  //   setShowFilterPopup(true);
  // };

  // const handleTherapyTypeChange = (therapyId: string) => {
  //   setSelectedTherapyTypes(prev => 
  //     prev.includes(therapyId) 
  //       ? prev.filter(id => id !== therapyId)
  //       : [...prev, therapyId]
  //   );
  // };


  // 치료 분야별 색깔 매핑
  const getTherapyFieldColor = (specialty: string) => {
    try {
      const field = (specialty || '').toString().toLowerCase();
      
      if (field.includes('언어')) return 'bg-blue-100 text-blue-800';
      if (field.includes('놀이')) return 'bg-purple-100 text-purple-800';
      if (field.includes('감각통합')) return 'bg-green-100 text-green-800';
      if (field.includes('인지') || field.includes('학습')) return 'bg-orange-100 text-orange-800';
      if (field.includes('미술')) return 'bg-pink-100 text-pink-800';
      if (field.includes('물리')) return 'bg-red-100 text-red-800';
      if (field.includes('작업')) return 'bg-indigo-100 text-indigo-800';
      if (field.includes('aba')) return 'bg-yellow-100 text-yellow-800';
      if (field.includes('음악')) return 'bg-teal-100 text-teal-800';
      if (field.includes('특수')) return 'bg-gray-100 text-gray-800';
      if (field.includes('임상심리')) return 'bg-emerald-100 text-emerald-800';
      if (field.includes('사회복지')) return 'bg-cyan-100 text-cyan-800';
      if (field.includes('행동')) return 'bg-amber-100 text-amber-800';
      
      return 'bg-slate-100 text-slate-800'; // 기타
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Therapy field color error:', error);
      }
      return 'bg-gray-100 text-gray-800';
    }
  };

  // 상태별 색깔 매핑
  const getStatusColor = (status: string) => {
    try {
      const statusStr = (status || '').toString();
      switch (statusStr) {
        case '등록완료':
          return 'bg-blue-100 text-blue-800';
        case '검토중':
          return 'bg-yellow-100 text-yellow-800';
        case '등록보류':
          return 'bg-red-100 text-red-800';
        case '자격미달':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Status color error:', error);
      }
      return 'bg-gray-100 text-gray-800';
    }
  };

  // 금액을 천 단위로 포맷팅하는 함수
  const formatPrice = (price: string) => {
    if (!price || price === '협의' || price === '미등록') return price;
    
    try {
      // 숫자만 추출
      const numericPrice = price.replace(/[^0-9]/g, '');
      if (!numericPrice) return price;
      
      // 천 단위 콤마 추가
      const formattedNumber = parseInt(numericPrice).toLocaleString();
      
      // 원이 포함되어 있지 않으면 추가
      return price.includes('원') ? formattedNumber + '원' : formattedNumber + '원';
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Price formatting error:', error);
      }
      return price;
    }
  };

  // 금액 입력 시 실시간 포맷팅
  const handlePriceInput = (value: string) => {
    try {
      // 숫자만 허용
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue) {
        // 천 단위 콤마 추가하고 '원' 단위 자동 추가
        const formattedValue = parseInt(numericValue).toLocaleString() + '원';
        return formattedValue;
      }
      return '';
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Price input formatting error:', error);
      }
      return value;
    }
  };

  // 검색 실행 (현재는 실시간 필터링이므로 특별한 동작 없음)
  const handleSearchSubmit = () => {
    // 검색 결과가 없을 때 알림
    if (filteredTeachers.length === 0) {
      alert('검색 조건에 맞는 치료사가 없습니다. 검색 조건을 변경해보세요.');
    }
  };

  // 선택된 지역에 따른 제목과 탭 변경
  const getRegionTitle = () => {
    if (selectedSidebarItem === '치료사등록') return '정식(경력)치료사 등록';
    if (selectedSidebarItem === '정식(경력)치료사 등록') return '정식(경력)치료사 등록';
    if (selectedSidebarItem === '예비(학생)치료사 등록') return '예비(학생)치료사 등록';
    return `${selectedSidebarItem}`;
  };

  const handleSidebarClick = (item: string) => {
    setSelectedSidebarItem(item);
  };

  // 브레드크럼 경로 생성
  const getBreadcrumbPath = () => {
    const basePath = [
      { label: '홈', href: '/' },
      { label: '치료사등록', href: '/teacher-apply' }
    ];
    
    if (selectedSidebarItem === '치료사등록') {
      basePath.push({ label: '정식(경력)치료사 등록', href: '#' });
    } else if (selectedSidebarItem !== '치료사등록') {
      basePath.push({ label: selectedSidebarItem, href: '#' });
    }
    
    return basePath;
  };

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="flex">
        {/* 사이드바 */}
        <div className="w-64 bg-white shadow-lg">
              <div className="p-4">
                {sidebarItems.map((item) => (
                  <div key={item} className={item === '치료사등록' ? 'mb-4' : 'mb-1'}>
                    <button
                      onClick={() => handleSidebarClick(item)}
                      className={`w-full transition-colors ${
                        item === '치료사등록'
                          ? 'bg-blue-500 text-white text-2xl font-bold rounded-lg h-[110px] flex items-center justify-center'
                          : selectedSidebarItem === item
                          ? 'bg-blue-50 text-blue-600 text-left px-4 py-3 rounded-lg font-medium text-lg'
                          : 'text-gray-700 hover:bg-gray-50 text-left px-4 py-3 rounded-lg font-medium text-lg'
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
          <div className="flex items-center justify-between mb-4">
            {/* 제목 */}
            <h1 className="text-2xl font-bold text-gray-900">{getRegionTitle()}</h1>
            
            {/* 브레드크럼 */}
            <div className="flex items-center text-sm text-gray-600">
              {getBreadcrumbPath().map((item, index) => (
                <div key={item.label} className="flex items-center">
                  {index > 0 && <span className="mx-2">&gt;</span>}
                  {item.href === '#' ? (
                    <span className="text-gray-900 font-medium">{item.label}</span>
                  ) : (
                    <Link href={item.href} className="hover:text-blue-600">{item.label}</Link>
                  )}
                </div>
              ))}
            </div>
          </div>



          {/* 메인 배너 - 치료사 등록 관련 페이지에서만 표시 */}
          {(selectedSidebarItem === '치료사등록' || selectedSidebarItem === '정식(경력)치료사 등록' || selectedSidebarItem === '예비(학생)치료사 등록') && (
            <div className="bg-white rounded-lg p-8 mb-4 border-4 border-blue-700">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedSidebarItem === '예비(학생)치료사 등록' 
                    ? '예비 치료사 등록' 
                    : '정식(경력) 치료사 등록'
                  }
                </h2>
                <p className="text-lg text-gray-600">
                  {selectedSidebarItem === '예비(학생)치료사 등록' 
                    ? '학생 신분으로 치료사 경험을 쌓아보세요!' 
                    : '이력을 등록하고 가치를 치료사로 활동해보세요!'
                  }
                </p>
              </div>
            </div>
          )}

          {/* 상세 검색 폼 - 항상 표시 */}
          {(
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm border-4 border-blue-700 mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">상세 검색</h3>
                
                {/* 상태, 분야, 성별, 검색을 한 줄로 균등하게 배치 */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                  <select
                      value={selectedDetailStatus}
                      onChange={(e) => setSelectedDetailStatus(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {detailStatusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">분야</label>
                  <select
                      value={selectedTherapyField}
                      onChange={(e) => setSelectedTherapyField(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {therapyFieldOptions.map((field) => (
                        <option key={field.value} value={field.value}>{field.label}</option>
                    ))}
                  </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                    <select
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">전체</option>
                      <option value="여성">여성</option>
                      <option value="남성">남성</option>
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">치료사 이름</label>
                  <input
                    type="text"
                    placeholder="검색어를 입력해주세요"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex-shrink-0 w-12">
                    <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                    <button 
                      onClick={handleSearchSubmit}
                      className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                      title="검색"
                    >
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white"
                      >
                        <path 
                          d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                  </button>
                  </div>
                </div>


                {/* 적용된 필터 표시 */}
                {(selectedDetailStatus !== '' && selectedDetailStatus !== '전체') || searchKeyword || selectedTherapyField || selectedGender ? (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-sm font-medium text-blue-800">적용된 필터:</span>
                        
                        {selectedDetailStatus && selectedDetailStatus !== '전체' && (
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedDetailStatus)}`}>
                            상태: {selectedDetailStatus}
                          </span>
                        )}
                        
                        {selectedTherapyField && (
                          <span className={`px-2 py-1 rounded-full text-xs ${getTherapyFieldColor(therapyFieldOptions.find(f => f?.value === selectedTherapyField)?.label || '')}`}>
                            분야: {therapyFieldOptions.find(f => f?.value === selectedTherapyField)?.label || '알 수 없음'}
                          </span>
                        )}
                        
                        {selectedGender && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            성별: {selectedGender}
                          </span>
                        )}
                        
                        {searchKeyword && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            검색어: {searchKeyword}
                          </span>
                        )}
                  </div>
                      
                      <div className="text-sm text-blue-600">
                        총 {filteredTeachers.length}명
                </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* 치료사등록 헤더 */}
              <div className="bg-white border-4 border-blue-700 rounded-t-lg p-4 border-b-0">
                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => setShowRegistrationPopup(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
                      >
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white text-blue-600 text-xs">＋</span>
                    치료사 등록
                      </button>
                    </div>
                  </div>

              {/* 치료사 테이블 */}
              <div className="bg-white border-4 border-blue-700 rounded-b-lg overflow-hidden border-t-0">
                <table className="w-full table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">신청자 정보</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">주요 분야</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">지역</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">경력</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">희망 치료비</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">상태</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">관리</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map((teacher, index) => (
                        <tr key={teacher?.id || `teacher-${index}`} className="hover:bg-gray-50">
                          <td className="px-4 py-4 w-32">
                            <div className="text-sm font-medium text-gray-900">
                              {teacher?.fullName || teacher?.name?.split('/')[0] || '이름 미등록'}
                            </div>
                            <div className="text-xs text-gray-500">
                              ({teacher?.gender || '성별 미등록'})
                            </div>
                          </td>
                          <td className="px-4 py-4 w-32">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getTherapyFieldColor(teacher?.specialty || '')}`}>
                              {teacher?.specialty || '미등록'}
                            </span>
                          </td>
                          <td className="px-4 py-4 w-28">
                            <div className="text-sm text-gray-900">
                              {teacher?.treatmentRegion || teacher?.residence || '지역 미등록'}
                            </div>
                          </td>
                          <td className="px-4 py-4 w-24">
                            <div className="text-sm text-gray-900">
                              {teacher?.experience || '미등록'}
                            </div>
                          </td>
                          <td className="px-4 py-4 w-28">
                            <div className="text-sm text-gray-900">
                              {formatPrice(teacher?.hourlyRate || '협의')}
                            </div>
                          </td>
                          <td className="px-4 py-4 w-20">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(teacher?.status || '미등록')}`}>
                              {teacher?.status || '미등록'}
                            </span>
                          </td>
                          <td className="px-4 py-4 w-24">
                            <button 
                              onClick={() => {
                                // 향후 상세보기 모달 구현
                                if (process.env.NODE_ENV === 'development') {
                                  console.log('상세보기:', teacher);
                                }
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              상세보기
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="text-6xl text-gray-300 mb-4">👩‍⚕️</div>
                            <div className="text-lg font-medium text-gray-500 mb-2">등록된 치료사가 없습니다</div>
                            <div className="text-sm text-gray-400">치료사 등록을 기다리고 있습니다</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 - 데이터가 있을 때만 표시 */}
              {filteredTeachers.length > 0 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                      이전
                    </button>
                    {[1, 2, 3, 4, 5].map((page) => (
                      <button
                        key={page}
                        className={`px-3 py-2 text-sm ${
                          page === 1
                            ? 'text-blue-600 font-bold'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                      다음
                    </button>
                  </div>
                </div>
              )}
            </>
          )}


        </div>
      </div>

      {/* 필터 팝업 제거됨 */}

      {/* 치료사 등록 팝업 */}
      {showRegistrationPopup && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4"
          style={{
            animation: isPopupClosing ? 'fadeOut 0.3s ease-out' : 'fadeIn 0.3s ease-out'
          }}
          onClick={closePopup}
        >
          <div 
            className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] min-h-[600px] overflow-hidden shadow-2xl flex flex-col"
            style={{
              animation: isPopupClosing ? 'slideOut 0.3s ease-out' : 'slideIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 팝업 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">모든별 키즈 전문가 프로필 등록</h3>
                <p className="text-sm text-gray-600 mt-2">검증된 전문 치료사로 등록하여 안정적인 수익과 전문성 향상의 기회를 얻으세요.</p>
              </div>
              <button 
                onClick={closePopup}
                className="text-gray-400 hover:text-gray-600 text-3xl font-light min-w-[40px] h-[40px] flex items-center justify-center"
              >
                ×
              </button>
            </div>
            
            {/* 팝업 내용 - 스크롤 가능 */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                
                {/* 기본 정보 섹션 */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <span className="text-blue-600 text-lg">👤</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">기본 정보</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 프로필 사진 */}
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">프로필 사진 *</label>
                      <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center mx-auto relative cursor-pointer hover:bg-gray-300 transition-colors">
                        {profileImagePreview ? (
                          <Image 
                            src={profileImagePreview} 
                            alt="프로필 미리보기" 
                            width={160}
                            height={160}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-gray-500 text-base text-center">사진 등록<br/>(필수)</span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      {profileImage && (
                        <p className="text-xs text-gray-600 mt-2 text-center">{profileImage.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {/* 이름 */}
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">이름 *</label>
                        <input 
                          type="text" 
                          placeholder="김민지"
                          value={formData.name}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      {/* 생년월일 */}
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">생년월일 *</label>
                        <input 
                          type="date" 
                          value={formData.birthDate}
                          onChange={(e) => handleFormChange('birthDate', e.target.value)}
                          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      {/* 성별 */}
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">성별 *</label>
                        <select 
                          value={formData.gender}
                          onChange={(e) => handleFormChange('gender', e.target.value)}
                          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>여성</option>
                          <option>남성</option>
                        </select>
                      </div>
                      
                      {/* 연락처 */}
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">연락처 *</label>
                        <input 
                          type="text" 
                          placeholder="010-1234-5678"
                          value={formData.phone}
                          onChange={(e) => handleFormChange('phone', e.target.value)}
                          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 이메일 */}
                  <div className="mt-4">
                    <label className="block text-base font-medium text-gray-700 mb-2">이메일(ID) *</label>
                    <input 
                      type="email" 
                      placeholder="partn@example.com"
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* 주소 */}
                  <div className="mt-4">
                    <label className="block text-base font-medium text-gray-700 mb-2">주소 *</label>
                    <input 
                      type="text" 
                      placeholder="주소를 입력하세요"
                      value={formData.address}
                      onChange={(e) => handleFormChange('address', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* 자격구분 */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">자격구분 *</label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input 
                          type="radio" 
                          name="qualification" 
                          value="보유"
                          checked={formData.qualification === '보유'}
                          onChange={(e) => handleFormChange('qualification', e.target.value)}
                          className="form-radio text-blue-600" 
                        />
                        <span className="ml-2 text-base">보유</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input 
                          type="radio" 
                          name="qualification" 
                          value="미보유"
                          checked={formData.qualification === '미보유'}
                          onChange={(e) => handleFormChange('qualification', e.target.value)}
                          className="form-radio text-blue-600" 
                        />
                        <span className="ml-2 text-base">미보유</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 프로필 정보 섹션 */}
                <div className="border-4 border-blue-700 rounded-lg p-4 bg-white">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <span className="text-blue-600 text-lg">📋</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">프로필 정보 (학부모 공개)</h4>
                  </div>
                  
                  {/* 치료 철학 및 강점 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">치료 철학 및 강점 *</label>
                    <textarea 
                      placeholder="본인이 어떤 가치관을 가지고 아이들을 대하는지, 다른 치료사와 차별화되는 자신만의 강점은 무엇인지 어필하는 공간입니다."
                      rows={4}
                      value={formData.therapyActivity}
                      onChange={(e) => handleFormChange('therapyActivity', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                  
                  {/* 주요 치료 경험 및 사례 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">주요 치료 경험 및 사례 *</label>
                    <textarea 
                      placeholder="비슷한 문제를 가진 아동을 성공적으로 치료했던 경험을 간략하게 소개하면 학부모에게 큰 신뢰를 줍니다.(개인정보 보호를 위해 익명으로 작성)"
                      rows={4}
                      value={formData.mainSpecialty}
                      onChange={(e) => handleFormChange('mainSpecialty', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* 학력/경력 및 자격증 섹션 */}
                <div className="border-4 border-blue-700 rounded-lg p-4 bg-white">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <span className="text-blue-600 text-lg">🎓</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">학력/경력 및 자격증</h4>
                  </div>

                  {/* 학력 및 경력 */}
                  <div className="mb-6">
                    <h5 className="text-base font-semibold text-gray-900 mb-2">학력 및 경력</h5>
                    <textarea
                      rows={6}
                      placeholder={`예시)
2011.03 ~ 2015.02 △△대학교 아동학과 졸업 (학사)
2015.03 ~ 2017.02 △△대학원 언어치료학과 졸업 (석사)
2019.03 ~ 2024.02 ○○○ 아동발달센터 / 선임 언어치료사`}
                      value={formData.educationCareer}
                      onChange={(e) => handleFormChange('educationCareer', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* 보유 자격증 */}
                  <div className="mb-4">
                    <h5 className="text-base font-semibold text-gray-900 mb-2">보유 자격증</h5>
                    <textarea
                      rows={4}
                      placeholder={`예시)
2017.02 1급 언어재활사 / 보건복지부
2019.08 놀이심리상담사 2급 / ○○○협회`}
                      value={formData.certifications}
                      onChange={(e) => handleFormChange('certifications', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* 경력 (추가) - 자격증과 치료비 사이 */}
                  <div className="mb-4">
                    <h5 className="text-base font-semibold text-gray-900 mb-2">경력</h5>
                    <select
                      value={formData.experience}
                      onChange={(e) => handleFormChange('experience', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {(() => {
                        const options: string[] = ['1년 미만'];
                        for (let year = 1; year <= 30; year += 1) {
                          options.push(`${year}년차`);
                        }
                        return options.map((label) => (
                          <option key={label} value={label}>{label}</option>
                        ));
                      })()}
                    </select>
                  </div>

                  {/* 희망 시간당 치료비 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">희망 시간당 치료비 *</label>
                    <input 
                      type="text" 
                      placeholder="예: 70,000원"
                      value={formData.hourlyRate}
                      onChange={(e) => {
                        const formattedValue = handlePriceInput(e.target.value);
                        handleFormChange('hourlyRate', formattedValue);
                      }}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* 희망 치료 지역 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">치료 지역 (최대 3개) </label>
                    <input 
                      type="text" 
                      placeholder="예: 서울 강남구, 서초구, 송파구"
                      value={formData.region}
                      onChange={(e) => handleFormChange('region', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* 치료 가능 요일 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">치료 가능 요일 *</label>
                    <div className="flex space-x-3">
                      {['월', '화', '수', '목', '금', '토', '일'].map(day => (
                        <label key={day} className="inline-flex items-center">
                          <input 
                            type="checkbox" 
                            checked={formData.availableDays.includes(day)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleFormChange('availableDays', [...formData.availableDays, day]);
                              } else {
                                handleFormChange('availableDays', formData.availableDays.filter(d => d !== day));
                              }
                            }}
                            className="form-checkbox text-blue-600 rounded" 
                          />
                          <span className="ml-1 text-base">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* 치료 가능 시간 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">치료 가능 시간 *</label>
                    <input 
                      type="text" 
                      placeholder="예: 평일 오후 4시 이후 / 주말 오전 전원 가능"
                      value={formData.availableTime}
                      onChange={(e) => handleFormChange('availableTime', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* 전문 분야 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">전문 분야 (중복 선택 가능)</label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        '언어치료', '놀이치료', '감각통합', '인지학습',
                        'ABA치료', '작업치료', '물리/운동치료', '미술치료',
                        '음악치료', '특수체육', '특수교사', '임상심리',
                        '모니터링'
                      ].map(field => (
                        <label key={field} className="inline-flex items-center">
                          <input 
                            type="checkbox" 
                            checked={formData.specialties.includes(field)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleFormChange('specialties', [...formData.specialties, field]);
                              } else {
                                handleFormChange('specialties', formData.specialties.filter(s => s !== field));
                              }
                            }}
                            className="form-checkbox text-blue-600 rounded" 
                          />
                          <span className="ml-2 text-base">{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 자격 검증 섹션 */}
                <div className="border-4 border-blue-700 rounded-lg p-4 bg-white">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <span className="text-blue-600 text-lg">🔍</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">자격 검증 (관리자 확인용)</h4>
                  </div>
                  
                  <p className="text-base text-gray-600 mb-4">
                    제출된 서류는 자격 검증을 위해서만 사용되며, 학부모에게 공개되지 않습니다.
                  </p>
                  
                  {/* 학력 증빙 서류 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">학력 증빙 서류(졸업증명서 등) *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, setAcademicFiles)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <p className="text-base text-gray-500">파일을 여기에 드래그하거나 클릭하며 업로드하세요.</p>
                    </div>
                    {academicFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {academicFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              onClick={() => removeFile(index, academicFiles, setAcademicFiles)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* 경력 증빙 서류 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">경력 증빙 서류 (경력증명서 등) *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, setCareerFiles)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <p className="text-base text-gray-500">파일을 여기에 드래그하거나 클릭하며 업로드하세요.</p>
                    </div>
                    {careerFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {careerFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              onClick={() => removeFile(index, careerFiles, setCareerFiles)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* 자격증 사본 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">자격증 사본 *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, setLicenseFiles)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <p className="text-base text-gray-500">파일을 여기에 드래그하거나 클릭하며 업로드하세요.</p>
                    </div>
                    {licenseFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {licenseFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              onClick={() => removeFile(index, licenseFiles, setLicenseFiles)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* 성범죄 경력 조회 증명서 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">성범죄 경력 조회 증명서 *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, setEducationFiles)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <p className="text-base text-gray-500">파일을 여기에 드래그하거나 클릭하며 업로드하세요.</p>
                    </div>
                    {educationFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {educationFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              onClick={() => removeFile(index, educationFiles, setEducationFiles)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* (선택) 기타 첨부파일 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">(선택) 기타 첨부파일</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, setExperienceFiles)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <p className="text-base text-gray-500">파일을 여기에 드래그하거나 클릭하며 업로드하세요.</p>
                    </div>
                    {experienceFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {experienceFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              onClick={() => removeFile(index, experienceFiles, setExperienceFiles)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* (선택) 1분 자기소개 영상 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">(선택) 1분 자기소개 영상</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, setCertificateFiles)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <p className="text-base text-gray-500">파일을 여기에 드래그하거나 클릭하며 업로드하세요.</p>
                    </div>
                    {certificateFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {certificateFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              onClick={() => removeFile(index, certificateFiles, setCertificateFiles)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 지원 경로 섹션 */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <span className="text-blue-600 text-lg">🔍</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">지원 경로</h4>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">경로를 선택해주세요. *</label>
                    <select 
                      value={formData.applicationSource}
                      onChange={(e) => handleFormChange('applicationSource', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">경로를 선택해주세요.</option>
                      <option value="인터넷 검색 (네이버, 구글 등)">인터넷 검색 (네이버, 구글 등)</option>
                      <option value="관련 구인/구직 사이트 (아이소리몰, 오티브레인 등)">관련 구인/구직 사이트 (아이소리몰, 오티브레인 등)</option>
                      <option value="온라인 커뮤니티 (발달/재활 관련 카페, 오픈채팅방 등)">온라인 커뮤니티 (발달/재활 관련 카페, 오픈채팅방 등)</option>
                      <option value="SNS (인스타그램, 블로그, 유튜브 등)">SNS (인스타그램, 블로그, 유튜브 등)</option>
                      <option value="지인 추천 / 소개">지인 추천 / 소개</option>
                      <option value="학교/협회 추천">학교/협회 추천</option>
                      <option value="병원 / 관련 기관 추천">병원 / 관련 기관 추천</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                </div>

                {/* 자신 정보 섹션 */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <span className="text-blue-600 text-lg">📄</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">계좌 정보 (관리자 확인용)</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* 은행명 */}
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">은행명 *</label>
                      <input 
                        type="text" 
                        placeholder="예: 국민은행"
                        value={formData.bankName}
                        onChange={(e) => handleFormChange('bankName', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {/* 예금주명 */}
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">예금주명 *</label>
                      <input 
                        type="text" 
                        placeholder="예: 홍길동"
                        value={formData.accountHolder}
                        onChange={(e) => handleFormChange('accountHolder', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  {/* 계좌번호 */}
                  <div className="mb-4">
                    <label className="block text-base font-medium text-gray-700 mb-2">계좌번호 *</label>
                    <input 
                      type="text" 
                      placeholder="- 없이 숫자만 입력"
                      value={formData.accountNumber}
                      onChange={(e) => handleFormChange('accountNumber', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* 통장 사본 업로드 */}
                  <div className="mb-4">
                    <label className="block text-base font-medium text-gray-700 mb-2">통장 사본 *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleSingleFileUpload(e, setBankBookFile)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <p className="text-base text-gray-500">통장 첫 페이지 사본을 업로드해주세요.</p>
                    </div>
                    {bankBookFile && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700">{bankBookFile.name}</span>
                          <button
                            onClick={() => setBankBookFile(null)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 최종 확인 및 동의 */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <span className="text-blue-600 text-lg">✓</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">최종 확인 및 동의</h4>
                  </div>
                  
                  <div className="space-y-3 text-base text-gray-700 mb-4">
                    <p>1. 본인이 제출하는 프로필의 모든 정보(학력, 경력, 자격증 등)는 사실이며, 허위 기재 사실이 없음을 확인합니다.</p>
                    <p>2. 매칭이 진행되는 학부모 회원에게 본인의 프로필 정보가 제공됨에 동의합니다.</p>
                    <p>3. 매칭 시 확정된 주당 수업 횟수만큼 첫 수업료가 매칭 성사 수수료로 발생하는 것에 동의합니다.</p>
                    <p>4. 본인은 &apos;모든별 키즈&apos;에 고용된 근로자가 아니며, 자신의 전문성과 판단에 따라 서비스를 제공하는 독립적인 전문가(프리랜서)로서 활동함에 동의합니다.</p>
                    <p>5. 플랫폼을 통하지 않은 외부 거래(직거래, 현금 결제 등)는 엄격히 금지되며, 위반 시 경고 없이 계정이 영구 정지될 수 있음에 동의합니다.</p>
                    <p>6. 학부모님과 공식적으로 확정된 스케줄을 사전 협의 없이 임의로 변경하거나 취소할 경우, 서비스 이용이 제한될 수 있음에 동의합니다.</p>
                    <p>7. 학부모님과의 첫 인터뷰는 상호 알아가는 과정으로, 별도의 비용 없이 진행하는 것을 원칙으로 합니다.</p>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <input 
                      type="checkbox" 
                      checked={formData.agreeTerms}
                      onChange={(e) => handleFormChange('agreeTerms', e.target.checked)}
                      className="form-checkbox text-blue-600 rounded mr-3" 
                    />
                    <span className="text-base text-gray-700">위 이용약관에 모두 동의합니다.</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 팝업 푸터 */}
            <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-center">
                <button 
                  onClick={handleTeacherRegistration}
                  className="px-10 py-3 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  프로필 등록 완료하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
