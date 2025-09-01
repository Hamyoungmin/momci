'use client';

import { useState, useEffect } from 'react';
import SearchFilters from './SearchFilters';
import MemberTable from './MemberTable';
import MemberDetailModal from './MemberDetailModal';

interface ParentMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  region: string;
  status: 'active' | 'suspended' | 'withdrawn';
  subscriptionStatus: 'active' | 'expired' | 'none';
  totalMatches: number;
  lastActivity: string;
}

export default function ParentMemberManagement() {
  const [selectedMember, setSelectedMember] = useState<ParentMember | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [members, setMembers] = useState<ParentMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        // TODO: Firebase에서 실제 학부모 회원 데이터 조회
        // const membersData = await getParentMembers();
        setMembers([]);
      } catch (error) {
        console.error('학부모 회원 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleMemberSelect = (member: ParentMember) => {
    setSelectedMember(member);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMember(null);
  };

  const getStatusBadge = (status: ParentMember['status']) => {
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

  const getSubscriptionBadge = (status: ParentMember['subscriptionStatus']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">활성</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">만료</span>;
      case 'none':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">미구매</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">알 수 없음</span>;
    }
  };

  const columns = [
    { key: 'name', label: '이름' },
    { key: 'email', label: '이메일' },
    { key: 'phone', label: '연락처' },
    { key: 'region', label: '지역' },
    { key: 'joinDate', label: '가입일' },
    { key: 'status', label: '상태', render: (value: ParentMember['status']) => getStatusBadge(value) },
    { key: 'subscriptionStatus', label: '이용권', render: (value: ParentMember['subscriptionStatus']) => getSubscriptionBadge(value) },
    { key: 'totalMatches', label: '매칭수' },
    { key: 'lastActivity', label: '최근 활동' }
  ];

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">👨‍👩‍👧‍👦</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">학부모 회원 관리</h1>
              <p className="text-gray-600 mt-1">등록된 학부모 회원들을 관리하고 모니터링하세요</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{members.length}</div>
              <div className="text-sm text-gray-500">총 회원수</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{members.filter(m => m.status === 'active').length}</div>
              <div className="text-sm text-gray-500">활성 회원</div>
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
        <SearchFilters memberType="parent" />
      </div>

      {/* 회원 목록 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📋</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">학부모 회원 목록</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white rounded-lg border border-blue-200 shadow-sm">
                <span className="text-sm font-semibold text-gray-700">총 </span>
                <span className="text-lg font-bold text-blue-600">{members.length}</span>
                <span className="text-sm font-semibold text-gray-700">명</span>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
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
          memberType="parent"
        />
      )}
    </div>
  );
}
