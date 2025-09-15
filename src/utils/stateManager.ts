// 🎯 확장 가능한 상태 관리 유틸리티
import { AppConfig } from '@/config/app';

export interface StoredPostSelection {
  selectedPostId: string;
  selectedAt: number;
  userId: string;
  version: string;
  method?: 'localStorage' | 'firebase' | 'realtime';
}

// 🚀 현재: localStorage 기반
export const savePostSelection = (data: Omit<StoredPostSelection, 'version'>) => {
  try {
    const storageData: StoredPostSelection = {
      ...data,
      version: '1.0',
      method: 'localStorage'
    };
    
    localStorage.setItem('selectedPost', JSON.stringify(storageData));
    
    if (AppConfig.DEBUG) {
      console.log('💾 Post selection saved:', storageData);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to save post selection:', error);
    return false;
  }
};

// 🔄 확장성: Firebase 동기화 추가 시 사용
export const syncPostSelection = async (data: StoredPostSelection) => {
  // 미래 구현용 - Firebase Realtime Database 동기화
  if (AppConfig.ENABLE_REALTIME_SYNC) {
    // TODO: Firebase 실시간 동기화 구현
    console.log('🔄 Firebase sync would happen here:', data);
  }
};

// StoredPostSelection 타입 가드 함수
function isStoredPostSelection(obj: unknown): obj is StoredPostSelection {
  if (!obj || typeof obj !== 'object') return false;
  
  const data = obj as Record<string, unknown>;
  return (
    typeof data.selectedPostId === 'string' &&
    typeof data.selectedAt === 'number' &&
    typeof data.userId === 'string' &&
    typeof data.version === 'string'
  );
}

// 🎚️ 마이그레이션: 버전 업그레이드 시 자동 변환
export const migrateStorageFormat = (oldData: unknown): StoredPostSelection | null => {
  try {
    // 타입 가드: 객체인지 확인
    if (oldData && typeof oldData === 'object' && oldData !== null) {
      const data = oldData as Record<string, unknown>;
      
      // v1.0 이전 형태 감지 및 변환
      if (!('version' in data)) {
        return {
          selectedPostId: (data.selectedPostId as string) || (data.id as string) || '',
          selectedAt: (data.selectedAt as number) || Date.now(),
          userId: (data.userId as string) || '',
          version: '1.0',
          method: 'localStorage'
        };
      }
      
      // 이미 새 형태인지 확인 후 반환
      if (isStoredPostSelection(data)) {
        return data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return null;
  }
};

// 📊 확장성 모니터링
export const getStorageHealth = () => {
  try {
    const usage = JSON.stringify(localStorage).length;
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    
    return {
      usage,
      maxSize,
      percentage: (usage / maxSize) * 100,
      isHealthy: usage < maxSize * 0.8 // 80% 이하면 건강
    };
  } catch (error) {
    return { 
      isHealthy: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
