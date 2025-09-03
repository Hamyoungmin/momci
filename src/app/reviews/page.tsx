import type { Metadata } from "next";
import ReviewsList from '@/components/reviews/ReviewsList';

export const metadata: Metadata = {
  title: "치료사 후기 - 모든별 키즈",
  description: "실제 이용하신 학부모님들의 생생한 후기를 확인해보세요. 검증된 치료사들의 전문성과 신뢰도를 후기를 통해 확인할 수 있습니다.",
};

export default function ReviewsPage() {
  return (
    <div>
      {/* 후기 목록만 표시 */}
      <ReviewsList />
    </div>
  );
}
