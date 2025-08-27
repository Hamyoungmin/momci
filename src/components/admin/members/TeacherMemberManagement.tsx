'use client';

import { useState } from 'react';
import SearchFilters from './SearchFilters';
import MemberTable from './MemberTable';
import MemberDetailModal from './MemberDetailModal';

interface TeacherMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  region: string;
  status: 'active' | 'suspended' | 'withdrawn';
  profileStatus: 'pending' | 'approved' | 'rejected' | 'hold';
  specialties: string[];
  experience: number;
  rating: number;
  totalMatches: number;
  certificationBadge: 'certified' | 'regular';
  lastActivity: string;
}

export default function TeacherMemberManagement() {
  const [selectedMember, setSelectedMember] = useState<TeacherMember | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // 임시 데이터
  const [members] = useState<TeacherMember[]>([
    {
      id: '1',
      name: '김○○',
      email: 'teacher1@email.com',
      phone: '010-1111-2222',
      joinDate: '2024-01-10',
      region: '서울 강남구',
      status: 'active',
      profileStatus: 'approved',
      specialties: ['언어치료', '놀이치료'],
      experience: 7,
      rating: 4.8,
      totalMatches: 15,
      certificationBadge: 'certified',
      lastActivity: '2024-01-20 15:30'
    },
    {
      id: '2',
      name: '이○○',
      email: 'teacher2@email.com',
      phone: '010-2222-3333',
      joinDate: '2024-01-12',
      region: '서울 서초구',
      status: 'active',
      profileStatus: 'pending',
      specialties: ['감각통합치료'],
      experience: 3,
      rating: 0,
      totalMatches: 0,
      certificationBadge: 'regular',
      lastActivity: '2024-01-19 12:15'
    },
    {
      id: '3',
      name: '박○○',
      email: 'teacher3@email.com',
      phone: '010-3333-4444',
      joinDate: '2024-01-08',
      region: '경기 성남시',
      status: 'suspended',
      profileStatus: 'rejected',
      specialties: ['작업치료', '물리치료'],
      experience: 5,
      rating: 4.2,
      totalMatches: 8,
      certificationBadge: 'regular',
      lastActivity: '2024-01-18 09:45'
    }
  ]);

  const handleMemberSelect = (member: TeacherMember) => {
    setSelectedMember(member);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMember(null);
  };

  const getStatusBadge = (status: TeacherMember['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">정상</span>;
      case 'suspended':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">정지</span>;
      case 'withdrawn':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">탈퇴</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getProfileStatusBadge = (status: TeacherMember['profileStatus']) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">승인</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">대기</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">반려</span>;
      case 'hold':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">보류</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const getCertificationBadge = (badge: TeacherMember['certificationBadge']) => {
    switch (badge) {
      case 'certified':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">인증 선생님</span>;
      case 'regular':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">일반</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const columns = [
    { key: 'name', label: '이름' },
    { key: 'email', label: '이메일' },
    { key: 'phone', label: '연락처' },
    { key: 'region', label: '지역' },
    { 
      key: 'specialties', 
      label: '전문분야', 
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((specialty, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
              {specialty}
            </span>
          ))}
          {value.length > 2 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              +{value.length - 2}
            </span>
          )}
        </div>
      )
    },
    { key: 'experience', label: '경력', render: (value: number) => `${value}년` },
    { 
      key: 'rating', 
      label: '평점', 
      render: (value: number) => value > 0 ? `⭐ ${value}` : '-' 
    },
    { key: 'joinDate', label: '가입일' },
    { key: 'status', label: '상태', render: (value: TeacherMember['status']) => getStatusBadge(value) },
    { key: 'profileStatus', label: '프로필', render: (value: TeacherMember['profileStatus']) => getProfileStatusBadge(value) },
    { key: 'certificationBadge', label: '인증', render: (value: TeacherMember['certificationBadge']) => getCertificationBadge(value) },
    { key: 'totalMatches', label: '매칭수' },
    { key: 'lastActivity', label: '최근 활동' }
  ];

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">검색 및 필터</h2>
        <SearchFilters memberType="teacher" />
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">👩‍⚕️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">총 치료사</p>
              <p className="text-lg font-semibold text-gray-900">{members.length}명</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⏳</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">승인 대기</p>
              <p className="text-lg font-semibold text-gray-900">
                {members.filter(m => m.profileStatus === 'pending').length}명
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✅</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">승인 완료</p>
              <p className="text-lg font-semibold text-gray-900">
                {members.filter(m => m.profileStatus === 'approved').length}명
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🏆</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">인증 치료사</p>
              <p className="text-lg font-semibold text-gray-900">
                {members.filter(m => m.certificationBadge === 'certified').length}명
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 회원 목록 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">치료사 회원 목록</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">총 {members.length}명</span>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                엑셀 다운로드
              </button>
            </div>
          </div>
        </div>
        
        <MemberTable
          columns={columns}
          data={members}
          onRowClick={handleMemberSelect}
        />
      </div>

      {/* 상세 정보 모달 */}
      {selectedMember && (
        <MemberDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          member={selectedMember}
          memberType="teacher"
        />
      )}
    </div>
  );
}
