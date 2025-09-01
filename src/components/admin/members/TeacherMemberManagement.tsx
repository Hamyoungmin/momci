'use client';

import { useState, useEffect } from 'react';
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

  const [members, setMembers] = useState<TeacherMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        // TODO: Firebase에서 실제 치료사 회원 데이터 조회
        // const membersData = await getTeacherMembers();
        setMembers([]);
      } catch (error) {
        console.error('치료사 회원 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

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
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">👩‍⚕️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">치료사 회원 관리</h1>
              <p className="text-gray-600 mt-1">등록된 치료사 회원들을 관리하고 승인 상태를 모니터링하세요</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{members.length}</div>
              <div className="text-sm text-gray-500">총 치료사</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{members.filter(m => m.profileStatus === 'approved').length}</div>
              <div className="text-sm text-gray-500">승인 완료</div>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-lg">🔍</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">검색 및 필터</h2>
        </div>
        <SearchFilters memberType="teacher" />
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">👩‍⚕️</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">총 치료사</p>
              <p className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">{members.length}명</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">승인 대기</p>
              <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                {members.filter(m => m.profileStatus === 'pending').length}명
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">승인 완료</p>
              <p className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                {members.filter(m => m.profileStatus === 'approved').length}명
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">🏆</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">인증 치료사</p>
              <p className="text-2xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                {members.filter(m => m.certificationBadge === 'certified').length}명
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 회원 목록 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">📋</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">치료사 회원 목록</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white rounded-lg border border-purple-200 shadow-sm">
                <span className="text-sm font-semibold text-gray-700">총 </span>
                <span className="text-lg font-bold text-purple-600">{members.length}</span>
                <span className="text-sm font-semibold text-gray-700">명</span>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg">
                📊 엑셀 다운로드
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
