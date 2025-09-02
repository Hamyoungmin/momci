import type { Metadata } from "next";
import ParentPricingPlans from '@/components/pricing/ParentPricingPlans';

export const metadata: Metadata = {
  title: "학부모 이용권 구매 - 모든별 키즈",
  description: "모든별 키즈 학부모 이용권을 구매하고 전문 치료사와 안전하게 매칭받으세요. 합리적인 요금제를 확인하세요.",
};

export default function ParentPricingPage() {
  return (
    <div>
      {/* 학부모 이용권 플랜 */}
      <ParentPricingPlans />
    </div>
  );
}


