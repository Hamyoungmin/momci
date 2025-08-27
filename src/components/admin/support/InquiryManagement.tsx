'use client';

import { useState } from 'react';
import InquiryStatusCards from './InquiryStatusCards';
import InquiryTable from './InquiryTable';
import InquiryDetailModal from './InquiryDetailModal';
import TemplateManagementModal from './TemplateManagementModal';

interface Inquiry {
  id: string;
  userId: string;
  userName: string;
  userType: 'parent' | 'teacher';
  userEmail: string;
  category: 'service' | 'payment' | 'technical' | 'account' | 'other';
  title: string;
  content: string;
  status: 'pending' | 'assigned' | 'answered' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  attachments: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
  tags: string[];
  responseTime?: number; // 답변까지 걸린 시간 (시간 단위)
}

export default function InquiryManagement() {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // 실제 고객 문의 데이터
  const [inquiries] = useState<Inquiry[]>([
    {
      id: 'INQ001',
      userId: 'P001',
      userName: '김민수',
      userType: 'parent',
      userEmail: 'minsu.kim@naver.com',
      category: 'payment',
      title: '이용권 결제 후 활성화가 안 됩니다',
      content: '안녕하세요. 어제 저녁 8시경에 우리은행 가상계좌로 9,900원을 입금했는데 아직도 이용권이 활성화되지 않았습니다. 계좌번호는 110-285-947362입니다. 확인 부탁드립니다. 급하게 요청글을 올려야 해서 빠른 처리 부탁드려요.',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-20 14:30',
      updatedAt: '2024-01-20 14:30',
      attachments: [
        {
          type: 'image',
          url: '/attachments/payment_receipt_kim.jpg',
          name: '우리은행_입금확인증_김민수.jpg'
        }
      ],
      tags: ['결제확인', '가상계좌', '이용권활성화', '우리은행']
    },
    {
      id: 'INQ002',
      userId: 'T002',
      userName: '이현주',
      userType: 'teacher',
      userEmail: 'hyunju.lee@therapy.co.kr',
      category: 'technical',
      title: '채팅방에서 파일 업로드가 안 됩니다',
      content: '안녕하세요. 학부모님과 채팅 중인데 아이의 평가지나 치료 계획서 같은 PDF 파일을 업로드하려고 하면 계속 실패합니다. 크롬 브라우저 최신 버전을 사용하고 있고, 파일 크기는 2MB 정도입니다. 다른 브라우저에서도 마찬가지 현상이 발생합니다. 해결 방법을 알려주세요.',
      status: 'assigned',
      priority: 'medium',
      createdAt: '2024-01-19 16:20',
      updatedAt: '2024-01-20 09:00',
      assignedTo: '기술팀A',
      attachments: [
        {
          type: 'image',
          url: '/attachments/file_upload_error.jpg',
          name: '파일업로드_오류화면.jpg'
        }
      ],
      tags: ['채팅오류', '파일업로드', '크롬브라우저', 'PDF']
    },
    {
      id: 'INQ003',
      userId: 'P002',
      userName: '이지은',
      userType: 'parent',
      userEmail: 'jieun.lee@gmail.com',
      category: 'service',
      title: '매칭된 치료사의 실제 경력이 의심스럽습니다',
      content: '안녕하세요. 감각통합치료사와 매칭되어 상담을 받았는데, 프로필에는 5년 경력이라고 되어 있었지만 실제로는 경험이 많이 부족해 보입니다. 기본적인 평가 도구도 잘 모르시는 것 같고, 아이의 상태에 대한 설명도 애매합니다. 혹시 경력을 허위로 기재한 건 아닌지 확인해주실 수 있나요? 아이의 치료가 중요한 문제라 신중하게 선택하고 싶습니다.',
      status: 'answered',
      priority: 'high',
      createdAt: '2024-01-18 11:45',
      updatedAt: '2024-01-19 15:30',
      assignedTo: '고객지원팀B',
      answer: '안녕하세요. 고객님의 문의에 대해 해당 치료사의 경력을 재검증했습니다. 제출된 경력증명서와 이전 근무지 확인 결과 5년 경력이 정확함을 재확인했습니다. 다만 고객님께서 느끼신 부분에 대해서는 치료사에게 피드백을 전달하고 추가 교육을 진행하도록 하겠습니다. 불편을 드려 죄송하며, 다른 치료사와의 매칭을 원하시면 언제든 말씀해주세요.',
      answeredBy: '고객지원팀B',
      answeredAt: '2024-01-19 15:30',
      attachments: [
        {
          type: 'document',
          url: '/attachments/career_verification_lee.pdf',
          name: '경력검증_결과보고서.pdf'
        }
      ],
      tags: ['경력검증', '감각통합치료', '치료사품질', '재검토'],
      responseTime: 28
    },
    {
      id: 'INQ004',
      userId: 'T005',
      userName: '최유진',
      userType: 'teacher',
      userEmail: 'yujin.choi@hanmail.net',
      category: 'account',
      title: '프로필 사진 업로드가 계속 실패합니다',
      content: '안녕하세요. 프로필 사진을 변경하려고 하는데 계속 업로드가 실패합니다. 사진 크기는 1MB 이하로 조정했고, JPG 형식입니다. "업로드 중 오류가 발생했습니다"라는 메시지만 계속 나옵니다. 브라우저 캐시도 삭제해봤는데 여전히 안 됩니다. 프로필 사진이 없으면 매칭에 불리할 것 같아 걱정입니다.',
      status: 'closed',
      priority: 'low',
      createdAt: '2024-01-16 13:20',
      updatedAt: '2024-01-17 10:45',
      assignedTo: '기술팀A',
      answer: '안녕하세요. 문제 확인 결과 서버의 임시 오류였습니다. 현재는 정상적으로 복구되어 프로필 사진 업로드가 가능합니다. 다시 시도해보시고, 혹시 계속 문제가 발생하면 바로 연락주세요. 불편을 드려 죄송합니다.',
      answeredBy: '기술팀A',
      answeredAt: '2024-01-17 10:45',
      attachments: [],
      tags: ['프로필사진', '업로드오류', '서버문제', '해결완료'],
      responseTime: 21
    },
    {
      id: 'INQ005',
      userId: 'P005',
      userName: '최현우',
      userType: 'parent',
      userEmail: 'hyunwoo.choi@hanmail.net',
      category: 'service',
      title: '첫 수업료 결제 후 연락처가 공개되지 않습니다',
      content: '안녕하세요. 언어치료사와 매칭이 되어서 2시간 전에 첫 수업료 70,000원을 결제했는데 아직도 연락처가 공개되지 않았습니다. 결제는 정상적으로 완료되었고 문자 확인도 받았습니다. 내일 첫 수업이 예정되어 있어서 오늘 중으로 연락을 드려야 하는데 걱정입니다. 빠른 확인 부탁드립니다.',
      status: 'pending',
      priority: 'urgent',
      createdAt: '2024-01-20 18:00',
      updatedAt: '2024-01-20 18:00',
      attachments: [
        {
          type: 'image',
          url: '/attachments/payment_confirmation_choi.jpg',
          name: '첫수업료_결제확인_최현우.jpg'
        }
      ],
      tags: ['첫수업료', '연락처공개', '매칭완료', '언어치료']
    },
    {
      id: 'INQ006',
      userId: 'T001',
      userName: '김서연',
      userType: 'teacher',
      userEmail: 'seoyeon.kim@therapist.com',
      category: 'payment',
      title: '정산 지연 문의드립니다',
      content: '안녕하세요. 지난주에 완료된 수업 3건에 대한 정산이 아직 되지 않았습니다. 보통 수업 완료 후 3일 이내에 정산이 되는 것으로 알고 있는데 벌써 일주일이 지났습니다. 수업 완료 확인도 모두 받았고, 학부모님들도 만족하신다고 하셨습니다. 정산 일정을 확인해주실 수 있을까요?',
      status: 'assigned',
      priority: 'medium',
      createdAt: '2024-01-19 10:15',
      updatedAt: '2024-01-19 14:30',
      assignedTo: '정산팀',
      attachments: [],
      tags: ['정산지연', '수업완료', '치료사정산', '일정확인'],
      responseTime: null
    }
  ]);

  const handleInquirySelect = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedInquiry(null);
  };

  const handleInquiryAction = (
    inquiryId: string,
    action: 'assign' | 'answer' | 'close',
    data: {
      assignee?: string;
      answer?: string;
      priority?: string;
    }
  ) => {
    // 실제 구현 시 API 호출
    console.log('Inquiry action:', { inquiryId, action, data });
    handleCloseModal();
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (statusFilter !== 'all' && inquiry.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && inquiry.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && inquiry.priority !== priorityFilter) return false;
    return true;
  });

  const pendingInquiries = inquiries.filter(i => i.status === 'pending');
  const urgentInquiries = inquiries.filter(i => i.priority === 'urgent');

  return (
    <div className="space-y-6">
      {/* 긴급 알림 */}
      {urgentInquiries.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                🚨 긴급 문의 {urgentInquiries.length}건
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>우선 처리가 필요한 긴급 문의가 있습니다. 즉시 확인해주세요.</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setPriorityFilter('urgent')}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                >
                  긴급 문의 확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 상태 카드 */}
      <InquiryStatusCards inquiries={inquiries} />

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">문의 관리</h2>
          <div className="flex items-center space-x-4">
            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 상태</option>
              <option value="pending">접수</option>
              <option value="assigned">배정</option>
              <option value="answered">답변 완료</option>
              <option value="closed">종료</option>
            </select>

            {/* 카테고리 필터 */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 유형</option>
              <option value="service">서비스 이용</option>
              <option value="payment">결제 관련</option>
              <option value="technical">기술 지원</option>
              <option value="account">계정 관련</option>
              <option value="other">기타</option>
            </select>

            {/* 우선순위 필터 */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 우선순위</option>
              <option value="urgent">긴급</option>
              <option value="high">높음</option>
              <option value="medium">보통</option>
              <option value="low">낮음</option>
            </select>

            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700"
            >
              답변 템플릿
            </button>

            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              문의 통계
            </button>
          </div>
        </div>

        {/* 처리 현황 알림 */}
        {pendingInquiries.length > 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">
                {pendingInquiries.length}건의 새로운 문의가 답변을 기다리고 있습니다.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 문의 테이블 */}
      <InquiryTable
        inquiries={filteredInquiries}
        onInquirySelect={handleInquirySelect}
      />

      {/* 문의 상세 모달 */}
      {selectedInquiry && (
        <InquiryDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          inquiry={selectedInquiry}
          onInquiryAction={handleInquiryAction}
        />
      )}

      {/* 템플릿 관리 모달 */}
      <TemplateManagementModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
    </div>
  );
}
