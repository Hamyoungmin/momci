'use client';

import { useState } from 'react';

interface SearchFiltersProps {
  memberType: 'parent' | 'teacher';
}

export default function SearchFilters({ memberType }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const handleSearch = () => {
    // 실제 구현 시 검색 로직 추가
    console.log('Search:', { searchTerm, statusFilter, regionFilter, dateFilter });
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setRegionFilter('all');
    setDateFilter('all');
  };

  return (
    <div className="space-y-4">
      {/* 검색어 입력 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            검색어
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="이름, 이메일, 연락처"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상태
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">전체</option>
            <option value="active">정상</option>
            <option value="suspended">정지</option>
            <option value="withdrawn">탈퇴</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            지역
          </label>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">전체</option>
            <option value="seoul">서울</option>
            <option value="gyeonggi">경기</option>
            <option value="incheon">인천</option>
            <option value="busan">부산</option>
            <option value="daegu">대구</option>
            <option value="gwangju">광주</option>
            <option value="daejeon">대전</option>
            <option value="ulsan">울산</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            가입일
          </label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">전체</option>
            <option value="today">오늘</option>
            <option value="week">최근 7일</option>
            <option value="month">최근 30일</option>
            <option value="3months">최근 3개월</option>
            <option value="year">최근 1년</option>
          </select>
        </div>
      </div>

      {/* 치료사 전용 필터 */}
      {memberType === 'teacher' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              프로필 승인 상태
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">전체</option>
              <option value="pending">승인 대기</option>
              <option value="approved">승인</option>
              <option value="rejected">반려</option>
              <option value="hold">보류</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전문 분야
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">전체</option>
              <option value="speech">언어치료</option>
              <option value="play">놀이치료</option>
              <option value="sensory">감각통합치료</option>
              <option value="occupational">작업치료</option>
              <option value="physical">물리치료</option>
              <option value="cognitive">인지학습치료</option>
              <option value="aba">ABA치료</option>
              <option value="art">미술치료</option>
              <option value="music">음악치료</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              인증 배지
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">전체</option>
              <option value="certified">인증 선생님</option>
              <option value="regular">일반</option>
            </select>
          </div>
        </div>
      )}

      {/* 학부모 전용 필터 */}
      {memberType === 'parent' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이용권 상태
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">전체</option>
              <option value="active">활성</option>
              <option value="expired">만료</option>
              <option value="none">미구매</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              매칭 횟수
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">전체</option>
              <option value="none">0회</option>
              <option value="1-2">1-2회</option>
              <option value="3-5">3-5회</option>
              <option value="6+">6회 이상</option>
            </select>
          </div>
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          검색
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
