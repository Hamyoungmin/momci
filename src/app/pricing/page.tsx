import type { Metadata } from "next";
import PricingHero from '@/components/pricing/PricingHero';
import PricingPlans from '@/components/pricing/PricingPlans';
import ComparisonTable from '@/components/pricing/ComparisonTable';
import PricingFAQ from '@/components/pricing/PricingFAQ';

export const metadata: Metadata = {
  title: "이용권 구매 - 더모든 키즈",
  description: "더모든 키즈 이용권을 구매하고 전문 치료사와 안전하게 매칭받으세요. 학부모와 치료사를 위한 합리적인 요금제를 확인하세요.",
};

export default function PricingPage() {
  return (
    <div>
      {/* 히어로 섹션 */}
      <PricingHero />
      
      {/* 요금제 플랜 */}
      <PricingPlans />
      
      {/* 비교 테이블 */}
      <ComparisonTable />
      
      {/* FAQ */}
      <PricingFAQ />
    </div>
  );
}
