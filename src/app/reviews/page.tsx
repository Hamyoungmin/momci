import type { Metadata } from "next";
import ReviewsHero from '@/components/reviews/ReviewsHero';
import ReviewsList from '@/components/reviews/ReviewsList';
import ReviewStats from '@/components/reviews/ReviewStats';
import Statistics from '@/components/sections/Statistics';

export const metadata: Metadata = {
  title: "치료사 후기 - 더모든 키즈",
  description: "실제 이용하신 학부모님들의 생생한 후기를 확인해보세요. 검증된 치료사들의 전문성과 신뢰도를 후기를 통해 확인할 수 있습니다.",
};

export default function ReviewsPage() {
  return (
    <div>
      {/* 히어로 섹션 */}
      <ReviewsHero />
      
      {/* 후기 통계 */}
      <ReviewStats />
      
      {/* 플랫폼 통계 */}
      <Statistics />
      
      {/* 후기 목록 */}
      <ReviewsList />
    </div>
  );
}
