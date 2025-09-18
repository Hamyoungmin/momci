'use client';

import { useState, useEffect } from 'react';
import SearchFilters from './SearchFilters';
import MemberTable, { TableRow } from './MemberTable';
import MemberDetailModal from './MemberDetailModal';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  isVerified: boolean; // 모든별 인증 상태
}

export default function TeacherMemberManagement() {
  const [selectedMember, setSelectedMember] = useState<TeacherMember | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [members, setMembers] = useState<TeacherMember[]>([]);
  // const [loading, setLoading] = useState(true);

  // 모든별 인증 상태 토글 함수
  const toggleVerification = async (memberId: string, currentStatus: boolean) => {
    try {
      const userRef = doc(db, 'users', memberId);
      await updateDoc(userRef, {
        isVerified: !currentStatus,
        verifiedAt: !currentStatus ? new Date() : null,
      });
      
      // 로컬 상태 업데이트
      setMembers(prev => prev.map(member => 
        member.id === memberId 
          ? { ...member, isVerified: !currentStatus }
          : member
      ));
      
      console.log(`사용자 ${memberId}의 모든별 인증 상태를 ${!currentStatus ? '활성화' : '비활성화'}했습니다.`);
      alert(`모든별 인증이 ${!currentStatus ? '부여' : '제거'}되었습니다.`);
      
    } catch (error) {
      console.error('모든별 인증 상태 업데이트 실패:', error);
      alert('모든별 인증 상태 업데이트에 실패했습니다.');
    }
  };

  useEffect(() => {
    // 실시간 치료사 회원 목록 구독
    const q = query(
      collection(db, 'users'),
      where('userType', 'in', ['therapist', 'teacher'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teacherMembers: TeacherMember[] = snapshot.docs.map((docSnap) => {
        const userData = docSnap.data() as Record<string, unknown>;

        const toDateString = (value: unknown): string => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (value && typeof (value as any).toDate === 'function') {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return new Date((value as any).toDate()).toLocaleDateString('ko-KR');
            }
            if (typeof value === 'number' || typeof value === 'string') {
              return new Date(value as number).toLocaleDateString('ko-KR');
            }
          } catch {
            /* ignore */
          }
          return '정보 없음';
        };

        return {
          id: docSnap.id,
          name: (userData.name as string) || '이름 없음',
          email: (userData.email as string) || '',
          phone: (userData.phone as string) || '연락처 없음',
          joinDate: toDateString(userData.createdAt),
          region: (userData.region as string) || '지역 미상',
          status: (userData.status as TeacherMember['status']) || 'active',
          profileStatus: (userData.profileStatus as TeacherMember['profileStatus']) || 'pending',
          specialties: (userData.specialties as string[]) || [],
          experience: (userData.experience as number) || 0,
          rating: (userData.rating as number) || 0,
          totalMatches: (userData.totalMatches as number) || 0,
          certificationBadge: (userData.certificationBadge as TeacherMember['certificationBadge']) || 'regular',
          lastActivity: toDateString((userData as Record<string, unknown>).lastLoginAt),
          isVerified: (userData.isVerified as boolean) || false,
          // extra fields for detail modal
          education: (userData.education as string) || '',
          certifications: (userData.certifications as string[]) || [],
        };
      });

      console.log(`${teacherMembers.length}명의 치료사 회원 데이터를 수신했습니다.`);
      setMembers(teacherMembers);
    }, (error) => {
      console.error('치료사 회원 실시간 로드 실패:', error);
    });

    return () => unsubscribe();
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

  // 모든별 인증 상태 표시 및 토글 버튼
  const getVerificationBadge = (member: TeacherMember) => {
    return (
      <div className="flex items-center space-x-2">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          member.isVerified 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {member.isVerified && <span className="mr-1">⭐</span>}
          {member.isVerified ? '모든별 인증' : '일반 회원'}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // 테이블 행 클릭 이벤트 방지
            toggleVerification(member.id, member.isVerified);
          }}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            member.isVerified
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {member.isVerified ? '제거' : '부여'}
        </button>
      </div>
    );
  };

  const columns = [
    { key: 'name', label: '이름' },
    { key: 'email', label: '이메일' },
    { key: 'phone', label: '연락처' },
    { key: 'region', label: '지역' },
    { 
      key: 'specialties', 
      label: '전문분야', 
      render: (value: unknown) => (
        <div className="flex flex-wrap gap-1">
          {(value as string[])?.slice(0, 2).map((specialty, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
              {specialty}
            </span>
          ))}
          {(value as string[])?.length > 2 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              +{(value as string[]).length - 2}
            </span>
          )}
        </div>
      )
    },
    { key: 'experience', label: '경력', render: (value: unknown) => `${value}년` },
    { 
      key: 'rating', 
      label: '평점', 
      render: (value: unknown) => (value as number) > 0 ? `${value}` : '-' 
    },
    { key: 'joinDate', label: '가입일' },
    { key: 'status', label: '상태', render: (value: unknown) => getStatusBadge(value as TeacherMember['status']) },
    { key: 'profileStatus', label: '프로필', render: (value: unknown) => getProfileStatusBadge(value as TeacherMember['profileStatus']) },
    { key: 'certificationBadge', label: '인증', render: (value: unknown) => getCertificationBadge(value as TeacherMember['certificationBadge']) },
    { 
      key: 'isVerified', 
      label: '모든별 인증', 
      render: (value: unknown, row: unknown) => getVerificationBadge(row as TeacherMember)
    },
    { key: 'totalMatches', label: '매칭수' },
    { key: 'lastActivity', label: '최근 활동' }
  ];

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">치료사 회원 관리</h1>
            <p className="text-gray-600 mt-1">등록된 치료사 회원들을 관리하고 승인 상태를 모니터링하세요</p>
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

          <h2 className="text-xl font-bold text-gray-900">검색 및 필터</h2>
        </div>
        <SearchFilters memberType="teacher" />
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">총 치료사</p>
            <p className="text-2xl font-bold text-blue-600">{members.length}명</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">승인 대기</p>
            <p className="text-2xl font-bold text-orange-600">
              {members.filter(m => m.profileStatus === 'pending').length}명
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">승인 완료</p>
            <p className="text-2xl font-bold text-green-600">
              {members.filter(m => m.profileStatus === 'approved').length}명
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">모든별 인증</p>
            <p className="text-2xl font-bold text-purple-600 flex items-center">
              <span className="mr-2">⭐</span>
              {members.filter(m => m.isVerified).length}명
            </p>
          </div>
        </div>
      </div>

      {/* 회원 목록 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">치료사 회원 목록</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white rounded-lg border border-purple-200 shadow-sm">
                <span className="text-sm font-semibold text-gray-700">총 </span>
                <span className="text-lg font-bold text-purple-600">{members.length}</span>
                <span className="text-sm font-semibold text-gray-700">명</span>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg">
                엑셀 다운로드
              </button>
            </div>
          </div>
        </div>
        
        <MemberTable
          columns={columns}
          data={members as unknown as TableRow[]}
          onRowClick={(row) => handleMemberSelect(row as unknown as TeacherMember)}
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
