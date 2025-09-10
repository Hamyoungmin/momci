'use client';

import { useState, useEffect } from 'react';
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
  const [selectedPriceRange, setSelectedPriceRange] = useState('치료비');
  const [selectedStatus, setSelectedStatus] = useState('상태');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTherapyTypes, setSelectedTherapyTypes] = useState<string[]>([]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [isPopupClosing, setIsPopupClosing] = useState(false);

  // 등록된 치료사 목록 상태
  const [registeredTeachers, setRegisteredTeachers] = useState<Teacher[]>([]);

  // localStorage에서 데이터 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTeachers = localStorage.getItem('registeredTeachers');
      if (savedTeachers) {
        try {
          const parsedTeachers = JSON.parse(savedTeachers);
          setRegisteredTeachers(parsedTeachers);
        } catch (error) {
          console.error('저장된 치료사 데이터를 불러오는데 실패했습니다:', error);
        }
      }
    }
  }, []);

  // localStorage에 데이터 저장하는 함수
  const saveToLocalStorage = (teachers: Teacher[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('registeredTeachers', JSON.stringify(teachers));
      } catch (error) {
        console.error('치료사 데이터 저장에 실패했습니다:', error);
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
    const nextId = registeredTeachers.length === 0 ? 1 : Math.max(...registeredTeachers.map(t => t.id)) + 1;
    
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
      hourlyRate: formData.hourlyRate || '협의',
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

    // 팝업 닫기
    closePopup();

    alert('치료사 등록이 완료되었습니다!');
  };

  const sidebarItems = ['치료사등록', '정식(경력)치료사 등록'];
  const priceRanges = ['치료비', '5만원 이하', '5-6만원', '6-7만원', '7-8만원', '8만원 이상'];
  const statusOptions = ['상태', '등록완료', '추천중', '검토중', '보류'];
  const therapyCheckboxes = [
    { id: 'speech', label: '언어치료사' },
    { id: 'play', label: '놀이치료사' },
    { id: 'sensory', label: '감각통합치료사' },
    { id: 'cognitive', label: '인지학습치료사' },
    { id: 'art', label: '미술치료사' },
    { id: 'physical', label: '물리치료사' },
    { id: 'occupational', label: '작업치료사' },
    { id: 'aba', label: 'ABA치료사' },
    { id: 'music', label: '음악치료사' },
    { id: 'special', label: '특수교육교사' },
    { id: 'psychologist', label: '임상심리사' },
    { id: 'social', label: '사회복지사' },
    { id: 'behavior', label: '행동치료사' },
    { id: 'etc', label: '기타' }
  ];

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
    // 등록된 치료사를 등록 순으로 정렬 (id가 작을수록 먼저 등록)
    const sortedRegisteredTeachers = [...registeredTeachers].sort((a, b) => a.id - b.id);
    
    if (selectedSidebarItem === '치료사등록') {
      // 등록된 치료사만 보여줌 (등록 순)
      return sortedRegisteredTeachers;
    }
    return [...(allRegionalTeachers[selectedSidebarItem as keyof typeof allRegionalTeachers] || []), ...sortedRegisteredTeachers];
  };

  const filteredTeachers = getCurrentTeachers();

  // const handleFilterSelect = () => {
  //   setShowFilterPopup(true);
  // };

  const handleTherapyTypeChange = (therapyId: string) => {
    setSelectedTherapyTypes(prev => 
      prev.includes(therapyId) 
        ? prev.filter(id => id !== therapyId)
        : [...prev, therapyId]
    );
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
                      ? 'bg-blue-500 text-white text-lg font-bold rounded-lg h-[110px] flex items-center justify-center'
                      : selectedSidebarItem === item
                      ? 'bg-blue-50 text-blue-600 text-left px-4 py-3 rounded-lg text-sm font-medium'
                      : 'text-gray-700 hover:bg-gray-50 text-left px-4 py-3 rounded-lg text-sm font-medium'
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
            <div className="bg-gray-100 rounded-lg p-8 mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedSidebarItem === '예비(학생)치료사 등록' 
                    ? '예비 치료사 등록' 
                    : '가치를 찾으신 치료사 등록'
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

          {/* 검색 폼 - 항상 표시 */}
          {(
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
                <div className="flex gap-4 mb-4">
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {priceRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    placeholder="검색어를 입력해주세요"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                    검색
                  </button>
                </div>

                {/* 치료분야 체크박스 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">치료분야</h3>
                  <div className="grid grid-cols-5 gap-4">
                    {therapyCheckboxes.map((therapy) => (
                      <label key={therapy.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTherapyTypes.includes(therapy.id)}
                          onChange={() => handleTherapyTypeChange(therapy.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{therapy.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 치료사등록 헤더 */}
                                <div className="bg-white border border-gray-200 rounded-t-lg p-4 border-b-0">
                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => setShowRegistrationPopup(true)}
                        className="bg-white hover:bg-gray-50 text-black border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        치료사등록
                      </button>
                    </div>
                  </div>

              {/* 치료사 테이블 */}
              <div className="bg-white border border-gray-200 rounded-b-lg overflow-hidden border-t-0">
                <table className="w-full table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">번호</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/3">제목</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">치료사</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">상태</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map((teacher, index) => (
                        <tr key={teacher.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-16">
                            {filteredTeachers.length - index}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap w-2/3">
                            <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                              {teacher.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-24">
                            {teacher.fullName || teacher.name.split(' ')[0] || '이름 미등록'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap w-20">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              teacher.status === '등록완료' 
                                ? 'bg-green-100 text-green-800' 
                                : teacher.status === '심사중'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {teacher.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
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

      {/* 필터 팝업 (향후 확장용) */}
      {showFilterPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">상세 필터</h3>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">경력</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>전체</option>
                  <option>1-3년</option>
                  <option>3-5년</option>
                  <option>5년 이상</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">자격증</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>전체</option>
                  <option>언어재활사</option>
                  <option>놀이치료사</option>
                  <option>작업치료사</option>
                  <option>물리치료사</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowFilterPopup(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}

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
                <h3 className="text-2xl font-bold text-gray-900">모든별 키즈 전문가 프로필 등록</h3>
                <p className="text-base text-gray-600 mt-2">검증된 전문 치료사로 등록하여 안정적인 수익과 전문성 향상의 기회를 얻으세요.</p>
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
                    <h4 className="text-xl font-bold text-gray-900">기본 정보</h4>
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
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <span className="text-blue-600 text-lg">📋</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">프로필 정보 (학부모 공개)</h4>
                  </div>
                  
                  {/* 치료 철학 및 강점 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">치료 철학 및 강점 *</label>
                    <p className="text-sm text-gray-500 mb-3">
                      어떤 치료 분야에서 어떤 활동을 해왔는지, 어떤 경험과 성과를 가지고 계신지 자세히 작성해주세요. 
                      학부모님께 공개되는 내용입니다.
                    </p>
                    <textarea 
                      placeholder="예: 서울대학교병원 재활의학과에서 5년간 언어치료사로 근무하며 아동 언어발달 지연 전문 치료를 담당했습니다. 총 200명 이상의 아동을 담당하며 평균 80% 이상의 개선율을 보였습니다."
                      rows={4}
                      value={formData.therapyActivity}
                      onChange={(e) => handleFormChange('therapyActivity', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* 주요 치료 경험 및 사례 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">주요 치료 경험 및 사례 *</label>
                    <p className="text-sm text-gray-500 mb-3">
                      보유하신 전문 분야와 특화된 치료 기법, 주요 경력사항을 작성해주세요. 
                      (예: 병원명, 근무기간, 담당 업무, 보유 자격증 등)
                    </p>
                    <textarea 
                      placeholder="예: 언어재활사 1급, 놀이치료사 자격증 보유. 발음교정, 언어발달지연, 자폐스펙트럼 아동 전문. 연세의료원 소아재활의학과 (2019-2024), 삼성서울병원 언어치료실 (2017-2019) 근무 경력."
                      rows={4}
                      value={formData.mainSpecialty}
                      onChange={(e) => handleFormChange('mainSpecialty', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 경력 및 전문분야 섹션 */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  {/* 경력 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">🎯 경력 *</label>
                    <select 
                      value={formData.experience}
                      onChange={(e) => handleFormChange('experience', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">경력을 선택해주세요</option>
                      <option>1년 미만</option>
                      <option>1년</option>
                      <option>2년</option>
                      <option>3년</option>
                      <option>4년</option>
                      <option>5년</option>
                      <option>6년</option>
                      <option>7년</option>
                      <option>8년</option>
                      <option>9년</option>
                      <option>10년</option>
                      <option>11년</option>
                      <option>12년</option>
                      <option>13년</option>
                      <option>14년</option>
                      <option>15년</option>
                      <option>16년</option>
                      <option>17년</option>
                      <option>18년</option>
                      <option>19년</option>
                      <option>20년</option>
                      <option>21년</option>
                      <option>22년</option>
                      <option>23년</option>
                      <option>24년</option>
                      <option>25년</option>
                      <option>26년</option>
                      <option>27년</option>
                      <option>28년</option>
                      <option>29년</option>
                      <option>30년</option>
                    </select>
                  </div>

                  {/* 희망 시간당 치료비 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">희망 시간당 치료비 *</label>
                    <input 
                      type="text" 
                      placeholder="예: 7만원"
                      value={formData.hourlyRate}
                      onChange={(e) => handleFormChange('hourlyRate', e.target.value)}
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
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <span className="text-blue-600 text-lg">🔍</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">자격 검증 (관리자 확인용)</h4>
                  </div>
                  
                  <p className="text-base text-gray-600 mb-4">
                    업로드하신 서류들은 관리자 검토 용도로만 사용되며, 학부모님께 공개되지 않습니다.
                  </p>
                  
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
                    <h4 className="text-xl font-bold text-gray-900">지원 경로</h4>
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
                    <h4 className="text-xl font-bold text-gray-900">계좌 정보 (관리자 확인용)</h4>
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
                    <h4 className="text-xl font-bold text-gray-900">최종 확인 및 동의</h4>
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
