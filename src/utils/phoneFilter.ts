// 전화번호 필터링 시스템
// 다양한 형태의 전화번호 표현을 감지하고 차단합니다

// 전화번호 패턴들
const PHONE_PATTERNS = [
  // 1. 일반 전화번호 패턴
  /0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}/g, // 010-1234-5678, 02-123-4567 등
  /\d{3}[-\s]?\d{3,4}[-\s]?\d{4}/g,    // 010-1234-5678
  
  // 2. 숫자만 있는 패턴 (10~11자리)
  /\b0\d{9,10}\b/g,                     // 01012345678
  
  // 3. 한글로 된 전화번호 패턴 (공일영, 일이삼사 등)
  /[공영일이삼사오육칠팔구][공영일이삼사오육칠팔구\s\-]{8,}/g,
  
  // 4. 숫자와 한글이 섞인 패턴
  /[0-9공영일이삼사오육칠팔구]{10,}/g,
  
  // 5. 특수문자로 구분된 패턴
  /\d{2,3}[.\-_\s]?\d{3,4}[.\-_\s]?\d{4}/g,
  
  // 6. 괄호가 있는 패턴
  /\(\d{2,3}\)\s?\d{3,4}[-\s]?\d{4}/g, // (010) 1234-5678
];

// 한글 숫자 변환 맵
const KOREAN_TO_NUMBER: { [key: string]: string } = {
  '공': '0', '영': '0', '일': '1', '이': '2', '삼': '3', '사': '4',
  '오': '5', '육': '6', '칠': '7', '팔': '8', '구': '9'
};

// 전화번호 의심 키워드들
const PHONE_KEYWORDS = [
  '전화', '연락', '번호', '핸드폰', '휴대폰', '폰번', '폰', 'tel', 'phone',
  '연락처', '문의', '콜', 'call', '통화', '카톡', '카카오톡', '톡', '메신저'
];

/**
 * 한글 숫자를 아라비아 숫자로 변환
 */
export function convertKoreanToNumber(text: string): string {
  let converted = text;
  Object.entries(KOREAN_TO_NUMBER).forEach(([korean, number]) => {
    converted = converted.replace(new RegExp(korean, 'g'), number);
  });
  return converted;
}

/**
 * 전화번호 패턴 감지
 */
export function detectPhonePattern(message: string): boolean {
  const normalizedMessage = message.replace(/\s+/g, ' ').toLowerCase();
  
  // 1. 직접적인 패턴 매칭
  for (const pattern of PHONE_PATTERNS) {
    if (pattern.test(normalizedMessage)) {
      console.log('🚫 전화번호 패턴 감지:', pattern);
      return true;
    }
  }
  
  // 2. 한글 숫자를 변환 후 패턴 매칭
  const convertedMessage = convertKoreanToNumber(normalizedMessage);
  if (convertedMessage !== normalizedMessage) {
    for (const pattern of PHONE_PATTERNS) {
      if (pattern.test(convertedMessage)) {
        console.log('🚫 한글 전화번호 패턴 감지:', pattern);
        return true;
      }
    }
  }
  
  // 3. 키워드와 숫자 조합 감지
  const hasPhoneKeyword = PHONE_KEYWORDS.some(keyword => 
    normalizedMessage.includes(keyword)
  );
  
  if (hasPhoneKeyword) {
    // 키워드가 있으면서 10자리 이상의 숫자가 있는지 확인
    const numbers = normalizedMessage.replace(/[^\d]/g, '');
    if (numbers.length >= 10) {
      console.log('🚫 전화번호 키워드 + 숫자 조합 감지');
      return true;
    }
  }
  
  return false;
}

/**
 * 전화번호 필터링 결과 타입
 */
export interface PhoneFilterResult {
  isBlocked: boolean;
  reason: string;
  suggestions: string[];
}

/**
 * 메시지 전화번호 필터링 (메인 함수)
 */
export function filterPhoneNumber(message: string): PhoneFilterResult {
  console.log('🔍 전화번호 필터링 검사:', message);
  
  if (!message.trim()) {
    return {
      isBlocked: false,
      reason: '',
      suggestions: []
    };
  }
  
  const isPhoneDetected = detectPhonePattern(message);
  
  if (isPhoneDetected) {
    return {
      isBlocked: true,
      reason: '전화번호 교환이 감지되었습니다',
      suggestions: [
        '💬 채팅으로 먼저 소통해보세요',
        '🔒 안전한 플랫폼 내 거래를 이용해주세요',
        '📞 필요시 플랫폼의 중개 통화 기능을 사용하세요'
      ]
    };
  }
  
  return {
    isBlocked: false,
    reason: '',
    suggestions: []
  };
}

/**
 * 전화번호 패턴 테스트 케이스들
 */
export const TEST_CASES = [
  // 차단되어야 하는 케이스들
  '010-1234-5678',
  '010 1234 5678',
  '01012345678',
  '공일영-일이삼사-오육칠팔',
  '공1영 일2삼4 오67팔',
  '02-123-4567',
  '(010) 1234-5678',
  '연락처: 010.1234.5678',
  '폰번 공일영일이삼사오육칠팔',
  
  // 차단되지 않아야 하는 케이스들
  '안녕하세요',
  '치료 문의드립니다',
  '언제 시작할까요?',
  '123456', // 6자리는 전화번호가 아님
  '날짜: 2024년 1월 1일'
];
