// 🎯 앱 확장성 설정
export const AppConfig = {
  // 🚀 현재 단계: localStorage 우선 (빠르고 안정적)
  ENABLE_REALTIME_SYNC: false,
  
  // 📊 확장 임계점 (사용자 수)
  SCALABILITY: {
    CURRENT_STAGE: 'STARTUP',        // STARTUP | GROWTH | SCALE
    REALTIME_THRESHOLD: 10000,       // 실시간 동기화 활성화 기준
    CACHE_THRESHOLD: 50000,          // 캐싱 시스템 도입 기준
  },
  
  // ⚡ 성능 최적화
  PERFORMANCE: {
    DEBOUNCE_MS: 300,               // 상태 저장 디바운싱
    CACHE_TTL: 5 * 60 * 1000,       // 5분 캐시 유효시간
    MAX_RETRY: 3,                   // 재시도 횟수
  },
  
  // 🔧 개발 환경
  DEBUG: process.env.NODE_ENV === 'development',
  
  // 💰 비용 최적화
  COST_OPTIMIZATION: true,
} as const;

export type AppStage = 'STARTUP' | 'GROWTH' | 'SCALE';

// 🎚️ 단계별 기능 활성화
export const getFeatureFlags = (userCount: number = 0): Record<string, boolean> => {
  return {
    realtimeSync: AppConfig.ENABLE_REALTIME_SYNC && userCount > AppConfig.SCALABILITY.REALTIME_THRESHOLD,
    advancedCache: userCount > AppConfig.SCALABILITY.CACHE_THRESHOLD,
    costOptimization: AppConfig.COST_OPTIMIZATION,
    debugging: AppConfig.DEBUG,
  };
};
