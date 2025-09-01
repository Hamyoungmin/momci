'use client';

import { useState, useEffect } from 'react';
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

  const [matchings, setMatchings] = useState<Matching[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchings = async () => {
      try {
        setLoading(true);
        // TODO: Firebase에서 실제 매칭 데이터 조회
        // const matchingsData = await getMatchings();
        setMatchings([]);
      } catch (error) {
        console.error('매칭 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchings();
  }, []);

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
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">

            <div>
              <h1 className="text-2xl font-bold text-gray-900">매칭 관리</h1>
              <p className="text-gray-600 mt-1">학부모와 치료사의 매칭 과정을 관리하고 진행 상황을 추적하세요</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-600">{matchings.filter(m => m.status === 'interview' || m.status === 'lesson_confirmed').length}</div>
              <div className="text-sm text-gray-500">진행 중</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{matchings.filter(m => m.status === 'payment_completed').length}</div>
              <div className="text-sm text-gray-500">매칭 완료</div>
            </div>
          </div>
        </div>
      </div>

      {/* 상태별 통계 카드 */}
      <MatchingStatusCards matchings={matchings} />

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">매칭 현황</h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
            >
              <option value="all">전체</option>
              <option value="interview">인터뷰 중</option>
              <option value="lesson_confirmed">수업 확정</option>
              <option value="payment_pending">결제 대기</option>
              <option value="payment_completed">매칭 완료</option>
              <option value="cancelled">취소</option>
            </select>

            <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-semibold rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg">
              엑셀 다운로드
            </button>
          </div>
        </div>
      </div>

      {/* 매칭 테이블 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">

              <h2 className="text-xl font-bold text-gray-900">매칭 목록</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white rounded-lg border border-cyan-200 shadow-sm">
                <span className="text-sm font-semibold text-gray-700">총 </span>
                <span className="text-lg font-bold text-cyan-600">{filteredMatchings.length}</span>
                <span className="text-sm font-semibold text-gray-700">건</span>
              </div>
            </div>
          </div>
        </div>
        <MatchingTable
          matchings={filteredMatchings}
          onMatchingSelect={handleMatchingSelect}
        />
      </div>

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
