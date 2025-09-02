import type { Metadata } from "next";
import MatchingHero from '@/components/matching/MatchingHero';
import MatchingMethods from '@/components/matching/MatchingMethods';
import MatchingProcess from '@/components/matching/MatchingProcess';
import SuccessStories from '@/components/matching/SuccessStories';
import Programs from '@/components/sections/Programs';

export const metadata: Metadata = {
  title: "홈티매칭 - 모든별 키즈",
  description: "모든별 키즈에서 아이에게 맞는 전문 치료사를 찾아보세요. 두 가지 매칭 방식으로 최적의 선생님을 만날 수 있습니다.",
};

export default function MatchingPage() {
  return (
    <div>
      {/* 히어로 섹션 */}
      <MatchingHero />
      
      {/* 치료 프로그램 소개 */}
      <Programs />
      
      {/* 매칭 방법 */}
      <MatchingMethods />
      
      {/* 매칭 프로세스 */}
      <MatchingProcess />
      
      {/* 성공 사례 */}
      <SuccessStories />
    </div>
  );
}
