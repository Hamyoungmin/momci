'use client';

import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  getDoc,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// FAQ 데이터 타입 정의
export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  isActive: boolean;
  views: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  tags?: string[]; // 태그 속성 추가 (선택사항)
}

// FAQ 카테고리 정의
export interface FAQCategory {
  id: string;
  title: string;
  faqs: FAQ[];
}

const FAQ_COLLECTION = 'faqs';

// FAQ 목록 조회
export async function getFAQs(): Promise<FAQ[]> {
  try {
    // 모든 FAQ를 가져온 후 클라이언트에서 필터링 (인덱스 오류 방지)
    const q = query(collection(db, FAQ_COLLECTION));
    
    const querySnapshot = await getDocs(q);
    const allFaqs: FAQ[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allFaqs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as FAQ);
    });
    
    // 클라이언트에서 필터링 및 정렬
    const activeFaqs = allFaqs
      .filter(faq => faq.isActive === true)
      .sort((a, b) => a.order - b.order);
    
    return activeFaqs;
  } catch (error) {
    console.error('FAQ 조회 오류:', error);
    return [];
  }
}

// 관리자용 전체 FAQ 목록 조회
export async function getAllFAQsForAdmin(): Promise<FAQ[]> {
  try {
    // 인덱스 없이 동작하도록 단순화
    const q = query(
      collection(db, FAQ_COLLECTION),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const faqs: FAQ[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      faqs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as FAQ);
    });
    
    return faqs;
  } catch (error) {
    console.error('관리자 FAQ 조회 오류:', error);
    return [];
  }
}

// FAQ 카테고리별 그룹화
export function groupFAQsByCategory(faqs: FAQ[]): FAQCategory[] {
  const categories: { [key: string]: FAQ[] } = {};
  
  faqs.forEach(faq => {
    if (!categories[faq.category]) {
      categories[faq.category] = [];
    }
    categories[faq.category].push(faq);
  });
  
  return Object.entries(categories).map(([categoryId, faqs]) => ({
    id: categoryId,
    title: getCategoryTitle(categoryId),
    faqs: faqs.sort((a, b) => a.order - b.order)
  }));
}

// 카테고리 제목 매핑
function getCategoryTitle(categoryId: string): string {
  const titles: { [key: string]: string } = {
    'common': '공통질문',
    'parent': '학부모 회원',
    'therapist': '치료사 회원',
    'payment': '결제 및 회원'
  };
  return titles[categoryId] || categoryId;
}

// 새 FAQ 추가
export async function addFAQ(faqData: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<string> {
  try {
    console.log('FAQ 추가 시도:', faqData);
    
    // Firebase 인증 상태 확인
    const user = auth.currentUser;
    console.log('현재 사용자:', user ? user.uid : '인증되지 않음');
    
    if (!user) {
      throw new Error('사용자가 인증되지 않았습니다. 로그인이 필요합니다.');
    }
    
    // 필수 필드 검증
    if (!faqData.category || !faqData.question || !faqData.answer) {
      throw new Error('필수 필드가 누락되었습니다 (category, question, answer)');
    }
    
    const docData = {
      ...faqData,
      views: 0,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };
    
    console.log('Firestore에 저장할 데이터:', docData);
    
    const docRef = await addDoc(collection(db, FAQ_COLLECTION), docData);
    console.log('FAQ 추가 성공, ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('FAQ 추가 오류 상세:', error);
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('오류 코드:', (error as any).code);
    }
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('오류 메시지:', (error as any).message);
    }
    throw error;
  }
}

// FAQ 수정
export async function updateFAQ(faqId: string, faqData: Partial<FAQ>): Promise<void> {
  try {
    const docRef = doc(db, FAQ_COLLECTION, faqId);
    await updateDoc(docRef, {
      ...faqData,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error('FAQ 수정 오류:', error);
    throw error;
  }
}

// FAQ 삭제
export async function deleteFAQ(faqId: string): Promise<void> {
  try {
    const docRef = doc(db, FAQ_COLLECTION, faqId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('FAQ 삭제 오류:', error);
    throw error;
  }
}

// FAQ 조회수 증가
export async function incrementFAQViews(faqId: string): Promise<void> {
  try {
    const docRef = doc(db, FAQ_COLLECTION, faqId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentViews = docSnap.data().views || 0;
      await updateDoc(docRef, {
        views: currentViews + 1,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    }
  } catch (error) {
    console.error('FAQ 조회수 증가 오류:', error);
  }
}

// 실시간 FAQ 목록 구독
export function subscribeFAQs(callback: (faqs: FAQ[]) => void): () => void {
  const q = query(
    collection(db, FAQ_COLLECTION),
    where('isActive', '==', true),
    orderBy('category', 'asc'),
    orderBy('order', 'asc')
  );
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const faqs: FAQ[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      faqs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as FAQ);
    });
    callback(faqs);
  });
  
  return unsubscribe;
}

// 기본 FAQ 데이터 초기화 (한 번만 실행)
export async function initializeFAQs(): Promise<void> {
  try {
    // 기존 FAQ가 있는지 확인
    const existingFAQs = await getAllFAQsForAdmin();
    if (existingFAQs.length > 0) {
      console.log('FAQ 데이터가 이미 존재합니다.');
      return;
    }

    // 기본 FAQ 데이터
    const defaultFAQs = [
      // 공통질문 카테고리
      {
        category: 'common',
        question: '모든별 키즈는 어떤 서비스인가요?',
        answer: '모든별 키즈는 발달이 늦거나 특별한 치료가 필요한 아이들과 전문 홈티 선생님을 안전하게 연결해주는 서비스입니다. 언어치료, 감각통합, 놀이치료, 행동치료 등 다양한 분야의 검증된 전문가들이 아이의 집으로 직접 방문하여 1:1 맞춤형 치료를 제공합니다.',
        isActive: true,
        order: 1,
        createdBy: 'admin'
      },
      {
        category: 'common',
        question: '치료 분야는 어떤 것들이 있나요?',
        answer: '언어치료(발음교정, 언어발달지연), 감각통합치료(감각처리문제, 운동발달), 놀이치료(사회성, 정서발달), 행동치료(ADHD, 자폐스펙트럼), ABA치료, 학습치료 등 다양한 분야를 지원합니다. 아이의 개별 특성에 맞는 전문적인 치료를 받으실 수 있습니다.',
        isActive: true,
        order: 2,
        createdBy: 'admin'
      },
      {
        category: 'common',
        question: '어떤 연령대의 아이들이 이용할 수 있나요?',
        answer: '만 2세부터 초등학생까지 이용 가능합니다. 영유아기 조기개입부터 학령기 아동까지 각 발달단계에 맞는 맞춤형 치료 프로그램을 제공합니다.',
        isActive: true,
        order: 3,
        createdBy: 'admin'
      },
      {
        category: 'common',
        question: '선생님은 어떻게 찾나요?',
        answer: '두 가지 방법이 있습니다.\n\n1. 선생님께 요청하기: 치료종류, 지역, 연령, 성별, 빈도, 희망시간을 입력하면 자동으로 \'치료종류 지역 연령 성별 빈도 홈티\' 형식의 게시글이 생성되고, 관심있는 선생님들이 지원해주십니다.\n\n2. 선생님 둘러보기: 등록된 선생님들의 프로필을 직접 보고 원하시는 분을 선택할 수 있습니다.',
        isActive: true,
        order: 4,
        createdBy: 'admin'
      },
      {
        category: 'common',
        question: '매칭은 어떻게 진행되나요?',
        answer: '게시글 작성 또는 선생님 선택 → 관심 선생님과 채팅 상담(최대 2명 무료) → 선생님 결정 후 첫 수업료 결제 → 수업 진행 순으로 매칭됩니다. 보통 1-3일 내에 매칭이 완료됩니다.',
        isActive: true,
        order: 5,
        createdBy: 'admin'
      },
      
      // 학부모 회원 카테고리
      {
        category: 'parent',
        question: '후기는 어떻게 작성하나요?',
        answer: '수업 완료 후 마이페이지에서 후기를 작성하실 수 있습니다. 솔직한 후기는 다른 학부모님들에게 큰 도움이 됩니다. 후기 작성 시 적립금 혜택도 제공됩니다.',
        isActive: true,
        order: 1,
        createdBy: 'admin'
      },
      {
        category: 'parent',
        question: '선생님과 문제가 생기면 어떻게 해야 하나요?',
        answer: '수업 중 문제가 발생하면 즉시 고객센터로 연락주세요. 전담 상담사가 상황을 파악하고 해결방안을 제시해드립니다. 필요시 새로운 선생님을 매칭해드립니다.',
        isActive: true,
        order: 2,
        createdBy: 'admin'
      },
      {
        category: 'parent',
        question: '선생님 변경이 가능한가요?',
        answer: '네, 언제든 가능합니다. 아이와 선생님의 궁합이 맞지 않거나 다른 사유로 변경을 원하시면 고객센터로 연락주시기 바랍니다. 추가 비용 없이 새로운 선생님을 매칭해드립니다.',
        isActive: true,
        order: 3,
        createdBy: 'admin'
      },
      {
        category: 'parent',
        question: '응급상황이 발생하면 어떻게 하나요?',
        answer: '수업 중 응급상황 발생 시 119에 신고 후 고객센터로 즉시 연락주세요. 24시간 응급 상황 대응팀이 운영되며, 필요시 보험처리 등의 후속조치를 도와드립니다.',
        isActive: true,
        order: 4,
        createdBy: 'admin'
      },

      // 결제 및 회원 카테고리
      {
        category: 'payment',
        question: '이용료는 얼마인가요?',
        answer: '학부모 이용권: 월 9,900원 (VAT 포함)\n선생님 이용권: 월 19,900원 (VAT 포함)\n\n이용권 구매 시 혜택:\n• 무료 1:1 채팅 상담 2회\n• 안전결제 시스템 이용\n• 24시간 고객지원 서비스\n• 분쟁조정 서비스',
        isActive: true,
        order: 1,
        createdBy: 'admin'
      },
      {
        category: 'payment',
        question: '수업료는 어떻게 결제하나요?',
        answer: '첫 수업료는 플랫폼을 통해 안전결제로 진행됩니다. 수업 완료 확인 후 선생님께 전달되며, 이후 수업료는 선생님과 직접 정산하시면 됩니다. 카드, 계좌이체, 가상계좌 등 다양한 결제수단을 지원합니다.',
        isActive: true,
        order: 2,
        createdBy: 'admin'
      },
      {
        category: 'payment',
        question: '환불은 언제까지 가능한가요?',
        answer: '• 이용권: 구매 후 7일 이내 미사용 시 100% 환불\n• 첫 수업료: 수업 24시간 전 취소 시 100% 환불\n• 수업 당일 취소: 50% 환불\n• 선생님 사정으로 인한 취소: 100% 환불\n\n환불 신청은 고객센터를 통해 접수하실 수 있습니다.',
        isActive: true,
        order: 3,
        createdBy: 'admin'
      },
      {
        category: 'payment',
        question: '수업료 분쟁이 생기면 어떻게 하나요?',
        answer: '수업료 관련 분쟁 발생 시 고객센터에서 중재서비스를 제공합니다. 양측의 의견을 듣고 공정한 해결방안을 제시해드리며, 필요시 부분환불이나 재매칭 등의 조치를 취합니다.',
        isActive: true,
        order: 4,
        createdBy: 'admin'
      },
      {
        category: 'payment',
        question: '추가 비용이 있나요?',
        answer: '기본적으로 이용권과 수업료 외 추가 비용은 없습니다. 단, 3번째 선생님부터는 직거래 방지를 위해 보증금 10,000원이 필요하며, 정상 매칭 완료 시 전액 환불됩니다.',
        isActive: true,
        order: 5,
        createdBy: 'admin'
      },

      // 치료사 회원 카테고리
      {
        category: 'therapist',
        question: '선생님들의 신원은 어떻게 확인하나요?',
        answer: '모든 선생님은 다음 검증 과정을 거칩니다:\n• 관련 자격증 원본 확인\n• 신분증 및 주민등록등본 확인\n• 범죄경력조회서 (아동학대 이력 포함)\n• 경력증명서 및 추천서\n• 화상 면접 및 전문성 평가',
        isActive: true,
        order: 1,
        createdBy: 'admin'
      },
      {
        category: 'therapist',
        question: '개인정보는 어떻게 보호되나요?',
        answer: '철저한 개인정보 보호정책을 운영합니다:\n• 매칭 확정 전까지 연락처 비공개\n• 개인정보는 암호화하여 안전 보관\n• 개인정보보호법 완전 준수\n• 불필요한 정보 수집 금지\n• 정기적인 보안점검 실시',
        isActive: true,
        order: 2,
        createdBy: 'admin'
      },
      {
        category: 'therapist',
        question: '아이 안전은 어떻게 보장되나요?',
        answer: '다각도 안전관리 시스템을 운영합니다:\n• 선생님 범죄경력 사전 확인\n• 수업 중 학부모 재택 권장\n• 이상징후 발견 시 즉시 신고 시스템\n• 정기적인 만족도 조사\n• 24시간 응급상황 대응체계',
        isActive: true,
        order: 3,
        createdBy: 'admin'
      }
    ];

    // 각 FAQ를 Firestore에 추가
    const promises = defaultFAQs.map(faq => addFAQ(faq));
    await Promise.all(promises);
    
    console.log('기본 FAQ 데이터 초기화 완료');
  } catch (error) {
    console.error('FAQ 초기화 오류:', error);
    throw error;
  }
}
