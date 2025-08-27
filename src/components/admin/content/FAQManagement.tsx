'use client';

import { useState } from 'react';
import FAQTable from './FAQTable';
import FAQEditModal from './FAQEditModal';

interface FAQ {
  id: string;
  category: 'general' | 'payment' | 'matching' | 'technical' | 'other';
  question: string;
  answer: string;
  isActive: boolean;
  views: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
}

export default function FAQManagement() {
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // 실제 FAQ 데이터
  const [faqs] = useState<FAQ[]>([
    {
      id: 'FAQ001',
      category: 'general',
      question: '더모든 키즈는 어떤 서비스인가요?',
      answer: '더모든 키즈는 발달치료가 필요한 아이들과 전문 치료사를 안전하게 연결해주는 매칭 플랫폼입니다.\n\n제공하는 치료 분야:\n• 언어치료 (발음교정, 언어발달지연)\n• 감각통합치료 (감각과민, 소근육발달)\n• 놀이치료 (사회성발달, 정서적 어려움)\n• 인지학습치료 (주의집중력, 학습능력)\n• 미술치료 (정서표현, 창의성 발달)\n• 물리치료 (대근육발달, 운동능력)\n\n모든 치료사는 관련 자격증과 경력을 검증받은 전문가들입니다.',
      isActive: true,
      views: 2347,
      order: 1,
      createdAt: '2024-01-10 10:00',
      updatedAt: '2024-01-15 14:30',
      createdBy: '관리자',
      tags: ['서비스소개', '매칭플랫폼', '발달치료', '전문가']
    },
    {
      id: 'FAQ002',
      category: 'payment',
      question: '이용권 가격과 결제 방법이 궁금합니다.',
      answer: '이용권 가격은 다음과 같습니다:\n\n👨‍👩‍👧‍👦 학부모: 월 9,900원\n👩‍⚕️ 치료사: 월 19,900원\n\n결제 방법:\n• 가상계좌 입금 (무통장 입금)\n• 입금 확인 후 즉시 이용권 활성화\n• 6개월 이용권 구매 시 1개월 무료 혜택\n\n이용권이 있어야 요청글 작성(학부모) 및 지원(치료사)이 가능합니다.\n환불은 이용 시작 전에만 가능하며, 자세한 환불 정책은 이용약관을 확인해주세요.',
      isActive: true,
      views: 1593,
      order: 1,
      createdAt: '2024-01-12 14:20',
      updatedAt: '2024-01-18 09:15',
      createdBy: '관리자',
      tags: ['이용권', '결제', '가격', '환불']
    },
    {
      id: 'FAQ003',
      category: 'matching',
      question: '매칭 과정이 어떻게 진행되나요?',
      answer: '매칭은 다음 단계로 진행됩니다:\n\n1️⃣ 요청글 작성 (학부모)\n• 아이 상태, 치료 희망 분야, 예산, 일정 작성\n\n2️⃣ 치료사 지원\n• 관심 있는 치료사들이 지원서 제출\n\n3️⃣ 1:1 채팅 상담\n• 학부모가 원하는 치료사와 상세 상담\n• 아이 상태, 치료 계획, 일정 등 논의\n\n4️⃣ 첫 수업료 결제\n• 안전결제 시스템으로 첫 회차 수업료 결제\n\n5️⃣ 연락처 공개 및 매칭 완료\n• 결제 확인 후 양측 연락처 자동 공개\n• 직접 연락하여 수업 진행\n\n평균 매칭 소요 시간: 2-3일',
      isActive: true,
      views: 1284,
      order: 2,
      createdAt: '2024-01-14 11:30',
      updatedAt: '2024-01-19 16:45',
      createdBy: '관리자',
      tags: ['매칭프로세스', '진행단계', '수업료', '연락처']
    },
    {
      id: 'FAQ004',
      category: 'payment',
      question: '안전결제 시스템은 무엇인가요?',
      answer: '안전결제는 학부모와 치료사 모두를 보호하는 에스크로(중간지급) 시스템입니다.\n\n💡 작동 원리:\n1. 학부모가 첫 수업료를 플랫폼에 결제\n2. 플랫폼이 수업료를 임시 보관\n3. 연락처 공개 후 수업 진행\n4. 수업 완료 후 치료사에게 정산 (수수료 15% 제외)\n\n🔒 안전한 이유:\n• 수업 전 미리 결제로 신뢰성 확보\n• 만족하지 않을 경우 전액 환불 가능\n• 직거래 사기 위험 방지\n• 분쟁 발생 시 플랫폼에서 중재\n\n⚠️ 주의사항:\n직거래(플랫폼 외부 거래)는 안전을 위해 금지되며, 적발 시 계정 정지 처분을 받습니다.',
      isActive: true,
      views: 967,
      order: 2,
      createdAt: '2024-01-16 09:45',
      updatedAt: '2024-01-20 13:20',
      createdBy: '관리자',
      tags: ['안전결제', '에스크로', '수수료', '환불', '직거래금지']
    },
    {
      id: 'FAQ005',
      category: 'technical',
      question: '채팅이 안 되거나 메시지가 안 보내져요.',
      answer: '채팅 문제 해결 방법:\n\n🔧 기본 해결 방법:\n1. 브라우저 새로고침 (Ctrl+F5)\n2. 브라우저 캐시 및 쿠키 삭제\n3. 다른 브라우저에서 시도\n4. 인터넷 연결 상태 확인\n\n📱 앱 사용 시:\n1. 앱 완전 종료 후 재실행\n2. 앱 업데이트 확인\n3. 기기 재시작\n\n💻 권장 환경:\n• Chrome, Firefox, Safari 최신 버전\n• 인터넷 속도: 최소 1Mbps 이상\n\n위 방법으로도 해결되지 않으면 고객센터(support@momci.kr)로 문의해주세요.\n문의 시 사용 기기, 브라우저 정보를 함께 알려주시면 더 빠른 해결이 가능합니다.',
      isActive: true,
      views: 734,
      order: 5,
      createdAt: '2024-01-18 15:20',
      updatedAt: '2024-01-18 15:20',
      createdBy: '관리자',
      tags: ['채팅오류', '기술지원', '브라우저', '앱문제']
    },
    {
      id: 'FAQ006',
      category: 'matching',
      question: '직거래는 왜 금지되나요? 수수료가 아까워요.',
      answer: '직거래 금지는 모든 이용자의 안전을 위한 정책입니다.\n\n⚠️ 직거래의 위험성:\n• 사기 피해 위험 (선입금 후 잠적)\n• 분쟁 발생 시 해결 방법 없음\n• 치료사 신원 확인 불가\n• 수업 품질 보장 불가\n• 환불 불가능\n\n🛡️ 플랫폼 이용의 장점:\n• 치료사 신원 및 자격 검증\n• 안전결제 시스템으로 사기 방지\n• 분쟁 발생 시 플랫폼에서 중재\n• 불만족 시 환불 가능\n• 후기 시스템으로 품질 관리\n\n수수료는 이런 안전 시스템 운영을 위한 최소한의 비용입니다.\n\n⛔ 처벌 규정:\n직거래 유도 시 계정 영구 정지 처분됩니다.',
      isActive: true,
      views: 456,
      order: 6,
      createdAt: '2024-01-08 13:15',
      updatedAt: '2024-01-20 10:30',
      createdBy: '관리자',
      tags: ['직거래금지', '수수료', '안전성', '정책위반']
    },
    {
      id: 'FAQ007',
      category: 'general',
      question: '치료사는 어떻게 검증하나요?',
      answer: '모든 치료사는 엄격한 검증 과정을 거칩니다:\n\n📋 필수 검증 항목:\n• 관련 학과 졸업증명서 (학사 이상)\n• 국가 자격증 (언어재활사, 작업치료사 등)\n• 경력증명서 및 추천서\n• 신원조회 및 범죄경력 확인\n• 아동학대 관련 이력 조회\n\n✅ 검증 프로세스:\n1. 서류 제출 및 1차 검토\n2. 자격증 발급기관 직접 확인\n3. 이전 근무지 경력 확인\n4. 면접 또는 화상 상담\n5. 최종 승인 및 배지 부여\n\n🏆 인증 등급:\n• 신규 치료사: 기본 인증\n• 경력 3년 이상: 경력 인증\n• 석사 이상 + 5년 경력: 전문가 인증\n\n검증 완료까지 평균 3-5일 소요됩니다.',
      isActive: true,
      views: 623,
      order: 3,
      createdAt: '2024-01-11 16:40',
      updatedAt: '2024-01-17 14:25',
      createdBy: '관리자',
      tags: ['치료사검증', '자격증', '신원조회', '인증등급']
    }
  ]);

  const handleFAQSelect = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsCreating(false);
    setIsEditModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedFAQ(null);
    setIsCreating(true);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedFAQ(null);
    setIsCreating(false);
  };

  const handleSaveFAQ = (faqData: Partial<FAQ>) => {
    // 실제 구현 시 API 호출
    console.log('Save FAQ:', faqData);
    handleCloseModal();
  };

  const handleDeleteFAQ = (faqId: string) => {
    // 실제 구현 시 API 호출
    console.log('Delete FAQ:', faqId);
    handleCloseModal();
  };

  const filteredFAQs = faqs.filter(faq => {
    if (categoryFilter !== 'all' && faq.category !== categoryFilter) return false;
    if (statusFilter === 'active' && !faq.isActive) return false;
    if (statusFilter === 'inactive' && faq.isActive) return false;
    return true;
  });

  const activeFAQs = faqs.filter(f => f.isActive);
  const totalViews = faqs.reduce((sum, f) => sum + f.views, 0);

  return (
    <div className="space-y-6">
      {/* 상태 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">❓</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">활성 FAQ</p>
              <p className="text-lg font-semibold text-gray-900">{activeFAQs.length}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">💬</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">일반 문의</p>
              <p className="text-lg font-semibold text-gray-900">
                {faqs.filter(f => f.category === 'general').length}개
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">💳</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">결제 관련</p>
              <p className="text-lg font-semibold text-gray-900">
                {faqs.filter(f => f.category === 'payment').length}개
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">👁️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">총 조회수</p>
              <p className="text-lg font-semibold text-gray-900">{totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">FAQ 관리</h2>
          <div className="flex items-center space-x-4">
            {/* 카테고리 필터 */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 카테고리</option>
              <option value="general">일반 이용</option>
              <option value="payment">결제 관련</option>
              <option value="matching">매칭 관련</option>
              <option value="technical">기술 지원</option>
              <option value="other">기타</option>
            </select>

            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>

            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              + 새 FAQ 작성
            </button>
          </div>
        </div>

        {/* 인기 FAQ 알림 */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-blue-800">
                가장 많이 조회된 FAQ: "{faqs.sort((a, b) => b.views - a.views)[0]?.question}"
              </span>
            </div>
            <span className="text-sm text-blue-600">
              {faqs.sort((a, b) => b.views - a.views)[0]?.views.toLocaleString()}회 조회
            </span>
          </div>
        </div>
      </div>

      {/* FAQ 테이블 */}
      <FAQTable
        faqs={filteredFAQs}
        onFAQSelect={handleFAQSelect}
      />

      {/* FAQ 편집 모달 */}
      <FAQEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        faq={selectedFAQ}
        isCreating={isCreating}
        onSave={handleSaveFAQ}
        onDelete={handleDeleteFAQ}
      />
    </div>
  );
}
