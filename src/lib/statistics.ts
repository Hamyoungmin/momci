import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

// 통계 데이터 타입 정의
export interface SiteStatistics {
  totalMatches: number;
  totalTeachers: number;
  parentSatisfaction: number;
  lastUpdated: string;
}

// 통계 데이터 기본값
const DEFAULT_STATS: SiteStatistics = {
  totalMatches: 1275,
  totalTeachers: 3026,
  parentSatisfaction: 98,
  lastUpdated: new Date().toISOString()
};

// 통계 문서 ID (사이트 전체 통계)
const STATS_DOC_ID = 'site-stats';

/**
 * 통계 데이터 초기화 (처음 실행할 때만)
 */
export async function initializeStatistics(): Promise<void> {
  try {
    const statsRef = doc(db, 'statistics', STATS_DOC_ID);
    const statsSnapshot = await getDoc(statsRef);
    
    // 문서가 존재하지 않으면 초기값으로 생성
    if (!statsSnapshot.exists()) {
      await setDoc(statsRef, DEFAULT_STATS);
      console.log('통계 데이터 초기화 완료');
    }
  } catch (error) {
    console.error('통계 데이터 초기화 실패:', error);
    throw error;
  }
}

/**
 * 현재 통계 데이터 조회
 */
export async function getStatistics(): Promise<SiteStatistics> {
  try {
    const statsRef = doc(db, 'statistics', STATS_DOC_ID);
    const statsSnapshot = await getDoc(statsRef);
    
    if (statsSnapshot.exists()) {
      return statsSnapshot.data() as SiteStatistics;
    } else {
      // 문서가 없으면 기본값 반환 (인증 없는 사용자를 위해)
      console.warn('통계 문서가 없습니다. 기본값을 사용합니다.');
      return DEFAULT_STATS;
    }
  } catch (error) {
    console.error('통계 데이터 조회 실패:', error);
    // 에러 발생 시 기본값 반환
    return DEFAULT_STATS;
  }
}

/**
 * 매칭 건수 증가 (매칭 승인 시 호출)
 * 
 * 중요: 누적 매칭 건수는 한번 증가하면 취소되어도 감소하지 않습니다.
 * 이는 "플랫폼에서 성사된 총 매칭 수"를 나타내기 때문입니다.
 */
export async function incrementMatchCount(): Promise<void> {
  try {
    const statsRef = doc(db, 'statistics', STATS_DOC_ID);
    
    // 문서가 존재하는지 확인
    const statsSnapshot = await getDoc(statsRef);
    if (!statsSnapshot.exists()) {
      await initializeStatistics();
    }
    
    // 매칭 건수 1 증가 (취소되어도 감소하지 않음)
    await updateDoc(statsRef, {
      totalMatches: increment(1),
      lastUpdated: new Date().toISOString()
    });
    
    console.log('누적 매칭 건수가 1 증가했습니다 (취소되어도 감소하지 않습니다)');
  } catch (error) {
    console.error('매칭 건수 증가 실패:', error);
    throw error;
  }
}

/**
 * 선생님 수 증가 (새 선생님 등록 시 호출)
 */
export async function incrementTeacherCount(): Promise<void> {
  try {
    const statsRef = doc(db, 'statistics', STATS_DOC_ID);
    
    // 문서가 존재하는지 확인
    const statsSnapshot = await getDoc(statsRef);
    if (!statsSnapshot.exists()) {
      await initializeStatistics();
    }
    
    // 선생님 수 1 증가
    await updateDoc(statsRef, {
      totalTeachers: increment(1),
      lastUpdated: new Date().toISOString()
    });
    
    console.log('등록 전문 치료사 수가 1 증가했습니다');
  } catch (error) {
    console.error('선생님 수 증가 실패:', error);
    throw error;
  }
}

/**
 * 학부모 만족도 업데이트
 */
export async function updateParentSatisfaction(newSatisfaction: number): Promise<void> {
  try {
    const statsRef = doc(db, 'statistics', STATS_DOC_ID);
    
    // 문서가 존재하는지 확인
    const statsSnapshot = await getDoc(statsRef);
    if (!statsSnapshot.exists()) {
      await initializeStatistics();
    }
    
    // 만족도 업데이트
    await updateDoc(statsRef, {
      parentSatisfaction: newSatisfaction,
      lastUpdated: new Date().toISOString()
    });
    
    console.log(`학부모 만족도가 ${newSatisfaction}%로 업데이트되었습니다`);
  } catch (error) {
    console.error('학부모 만족도 업데이트 실패:', error);
    throw error;
  }
}

/**
 * 통계 데이터 직접 설정 (관리자용)
 */
export async function setStatistics(stats: Partial<SiteStatistics>): Promise<void> {
  try {
    const statsRef = doc(db, 'statistics', STATS_DOC_ID);
    
    // 현재 데이터와 병합하여 업데이트
    await updateDoc(statsRef, {
      ...stats,
      lastUpdated: new Date().toISOString()
    });
    
    console.log('통계 데이터 업데이트 완료:', stats);
  } catch (error) {
    console.error('통계 데이터 설정 실패:', error);
    throw error;
  }
}
