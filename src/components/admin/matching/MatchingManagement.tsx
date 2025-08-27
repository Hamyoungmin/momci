'use client';

import { useState } from 'react';
import MatchingStatusCards from './MatchingStatusCards';
import MatchingTable from './MatchingTable';
import MatchingDetailModal from './MatchingDetailModal';

interface Matching {
  id: string;
  requestId: string;
  parentId: string;
  parentName: string;
  teacherId: string;
  teacherName: string;
  childAge: string;
  treatmentType: string[];
  region: string;
  schedule: string;
  hourlyRate: number;
  chatStartDate: string;
  status: 'interview' | 'lesson_confirmed' | 'payment_pending' | 'payment_completed' | 'cancelled';
  lastActivity: string;
  notes?: string;
}

export default function MatchingManagement() {
  const [selectedMatching, setSelectedMatching] = useState<Matching | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // 임시 데이터
  const [matchings] = useState<Matching[]>([
    {
      id: 'M001',
      requestId: 'R001',
      parentId: 'P001',
      parentName: '김○○',
      teacherId: 'T001',
      teacherName: '이○○',
      childAge: '5세',
      treatmentType: ['언어치료'],
      region: '서울 강남구',
      schedule: '주 2회, 월수 14:00-15:00',
      hourlyRate: 65000,
      chatStartDate: '2024-01-20 10:30',
      status: 'interview',
      lastActivity: '2024-01-20 15:30',
      notes: '인터뷰 진행 중'
    },
    {
      id: 'M002',
      requestId: 'R002',
      parentId: 'P002',
      parentName: '박○○',
      teacherId: 'T002',
      teacherName: '정○○',
      childAge: '3세',
      treatmentType: ['놀이치료', '감각통합'],
      region: '서울 서초구',
      schedule: '주 1회, 토 10:00-11:00',
      hourlyRate: 70000,
      chatStartDate: '2024-01-19 14:20',
      status: 'lesson_confirmed',
      lastActivity: '2024-01-20 09:15',
      notes: '수업 확정, 결제 대기'
    },
    {
      id: 'M003',
      requestId: 'R003',
      parentId: 'P003',
      parentName: '최○○',
      teacherId: 'T003',
      teacherName: '김○○',
      childAge: '7세',
      treatmentType: ['인지학습치료'],
      region: '경기 성남시',
      schedule: '주 3회, 월화수 16:00-17:00',
      hourlyRate: 60000,
      chatStartDate: '2024-01-18 11:00',
      status: 'payment_completed',
      lastActivity: '2024-01-19 18:30',
      notes: '매칭 완료, 연락처 공개 완료'
    },
    {
      id: 'M004',
      requestId: 'R004',
      parentId: 'P004',
      parentName: '윤○○',
      teacherId: 'T004',
      teacherName: '장○○',
      childAge: '4세',
      treatmentType: ['작업치료'],
      region: '서울 송파구',
      schedule: '주 2회, 화목 15:00-16:00',
      hourlyRate: 75000,
      chatStartDate: '2024-01-17 16:45',
      status: 'cancelled',
      lastActivity: '2024-01-18 12:20',
      notes: '학부모 사정으로 취소'
    }
  ]);

  const handleMatchingSelect = (matching: Matching) => {
    setSelectedMatching(matching);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMatching(null);
  };

  const handleStatusChange = (matchingId: string, newStatus: Matching['status'], reason?: string) => {
    // 실제 구현 시 API 호출
    console.log('Status change:', { matchingId, newStatus, reason });
    handleCloseModal();
  };

  const filteredMatchings = matchings.filter(matching => {
    if (statusFilter === 'all') return true;
    return matching.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* 상태별 통계 카드 */}
      <MatchingStatusCards matchings={matchings} />

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">매칭 현황</h2>
          <div className="flex items-center space-x-4">
            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="interview">인터뷰 중</option>
              <option value="lesson_confirmed">수업 확정</option>
              <option value="payment_pending">결제 대기</option>
              <option value="payment_completed">매칭 완료</option>
              <option value="cancelled">취소</option>
            </select>

            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              엑셀 다운로드
            </button>
          </div>
        </div>
      </div>

      {/* 매칭 테이블 */}
      <MatchingTable
        matchings={filteredMatchings}
        onMatchingSelect={handleMatchingSelect}
      />

      {/* 상세 정보 모달 */}
      {selectedMatching && (
        <MatchingDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          matching={selectedMatching}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
