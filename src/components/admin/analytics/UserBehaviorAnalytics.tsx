'use client';

interface PeakHour {
  label: string;
  users: number;
}

interface FeatureUsage {
  feature: string;
  usage: number;
  users: number;
}

interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

interface CategoryRating {
  category: string;
  rating: number;
}

interface UserBehaviorAnalyticsProps {
  period: string;
}

export default function UserBehaviorAnalytics({ period }: UserBehaviorAnalyticsProps) {
  // 실제 데이터 (Firebase에서 가져올 예정)
  const usagePatterns = {
    peakHours: [] as PeakHour[],
    featureUsage: [] as FeatureUsage[],
    retentionRate: {
      day1: 0,
      day7: 0,
      day30: 0,
      day90: 0
    }
  };

  const satisfactionStats = {
    averageRating: 0,
    ratingDistribution: [] as RatingDistribution[],
    repurchaseRate: 0,
    recommendationScore: 0,
    categoryRatings: [] as CategoryRating[]
  };

  const behaviorInsights: any[] = [];

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case '7d': return '최근 7일';
      case '30d': return '최근 30일';
      case '90d': return '최근 90일';
      case '1y': return '최근 1년';
      default: return '선택된 기간';
    }
  };

  const getMaxPeakHour = () => {
    return usagePatterns.peakHours.reduce((max, current) => 
      current.users > max.users ? current : max
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">사용자 행동 분석</h3>
        <span className="text-sm text-gray-600">{getPeriodLabel(period)} 기준</span>
      </div>

      {/* 이용 패턴 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 피크 타임 분석 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">⏰ 피크 타임 분석</h4>
          
          <div className="space-y-4">
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">
                  {getMaxPeakHour().label}
                </div>
                <div className="text-sm text-orange-700">
                  최대 동시 접속자: {getMaxPeakHour().users}명
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {usagePatterns.peakHours.map((hour, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{hour.label}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${(hour.users / getMaxPeakHour().users) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{hour.users}명</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 기능별 사용률 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">기능별 사용률</h4>
          
          <div className="space-y-3">
            {usagePatterns.featureUsage.map((feature, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{feature.feature}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${feature.usage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{feature.usage}%</span>
                  <span className="text-xs text-gray-500 w-16 text-right">({feature.users}명)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 사용자 유지율 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-base font-medium text-gray-900 mb-4">사용자 유지율 (Retention Rate)</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{usagePatterns.retentionRate.day1}%</div>
            <div className="text-sm text-green-700">1일 후</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{usagePatterns.retentionRate.day7}%</div>
            <div className="text-sm text-blue-700">1주 후</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{usagePatterns.retentionRate.day30}%</div>
            <div className="text-sm text-purple-700">1개월 후</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{usagePatterns.retentionRate.day90}%</div>
            <div className="text-sm text-orange-700">3개월 후</div>
          </div>
        </div>
      </div>

      {/* 만족도 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 전체 만족도 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">서비스 만족도</h4>
          
          <div className="space-y-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">{satisfactionStats.averageRating}/5.0</div>
              <div className="text-sm text-yellow-700">전체 평균 평점</div>
            </div>
            
            <div className="space-y-2">
              {satisfactionStats.ratingDistribution.map((rating, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{rating.rating}점</span>
                    <div className="flex">
                      {[...Array(rating.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xs">★</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${rating.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{rating.count}개</span>
                    <span className="text-xs text-gray-500 w-12 text-right">({rating.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 세부 만족도 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">카테고리별 만족도</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{satisfactionStats.repurchaseRate}%</div>
                <div className="text-sm text-green-700">재구매율</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{satisfactionStats.recommendationScore}/10</div>
                <div className="text-sm text-blue-700">추천 의향 (NPS)</div>
              </div>
            </div>
            
            <div className="space-y-3">
              {satisfactionStats.categoryRatings.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{category.category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(category.rating / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{category.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 행동 인사이트 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-base font-medium text-gray-900 mb-4">사용자 행동 인사이트</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {behaviorInsights.map((insight, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">{insight.title}</div>
              <div className="text-lg font-bold text-gray-900 mb-1">{insight.value}</div>
              <div className="text-xs text-gray-500 mb-2">{insight.insight}</div>
              <div className={`text-xs font-medium ${
                insight.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {insight.trend} 전월 대비
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 개선 제안 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-base font-medium text-blue-900 mb-4">개선 제안</h4>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <span className="font-bold text-blue-600">1.</span>
            <div>
              <div className="text-sm font-medium text-blue-900">피크 타임 서버 증설</div>
              <div className="text-sm text-blue-700">오후 3-4시 접속 집중으로 인한 성능 개선 필요</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="font-bold text-blue-600">2.</span>
            <div>
              <div className="text-sm font-medium text-blue-900">마이페이지 사용성 개선</div>
              <div className="text-sm text-blue-700">높은 사용률에 비해 체류 시간이 짧아 UI/UX 개선 검토</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="font-bold text-blue-600">3.</span>
            <div>
              <div className="text-sm font-medium text-blue-900">30일 유지율 향상 방안</div>
              <div className="text-sm text-blue-700">온보딩 개선 및 리텐션 마케팅 전략 필요</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
