import AnalyticsOverview from "@/components/admin/analytics/AnalyticsOverview";

export default function AnalyticsOverviewPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">통계 및 분석</h1>
        <p className="text-gray-600 mt-2">플랫폼 운영 현황과 사용자 행동을 분석합니다</p>
      </div>
      
      <AnalyticsOverview />
    </div>
  );
}
