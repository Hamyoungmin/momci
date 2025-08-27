'use client';

import { useState } from 'react';
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

  // 임시 데이터
  const [members] = useState<ParentMember[]>([
    {
      id: '1',
      name: '김○○',
      email: 'parent1@email.com',
      phone: '010-1234-5678',
      joinDate: '2024-01-15',
      region: '서울 강남구',
      status: 'active',
      subscriptionStatus: 'active',
      totalMatches: 3,
      lastActivity: '2024-01-20 14:30'
    },
    {
      id: '2',
      name: '이○○',
      email: 'parent2@email.com',
      phone: '010-2345-6789',
      joinDate: '2024-01-10',
      region: '서울 서초구',
      status: 'active',
      subscriptionStatus: 'expired',
      totalMatches: 1,
      lastActivity: '2024-01-19 10:15'
    },
    {
      id: '3',
      name: '박○○',
      email: 'parent3@email.com',
      phone: '010-3456-7890',
      joinDate: '2024-01-08',
      region: '경기 성남시',
      status: 'suspended',
      subscriptionStatus: 'none',
      totalMatches: 0,
      lastActivity: '2024-01-18 16:45'
    }
  ]);

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
    <div className="space-y-6">
      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">검색 및 필터</h2>
        <SearchFilters memberType="parent" />
      </div>

      {/* 회원 목록 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">학부모 회원 목록</h2>
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
          memberType="parent"
        />
      )}
    </div>
  );
}
