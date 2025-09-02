import type { Metadata } from "next";
import TeacherPricingPlans from '@/components/pricing/TeacherPricingPlans';

export const metadata: Metadata = {
  title: "선생님 이용권 구매 - 모든별 키즈",
  description: "모든별 키즈 선생님 이용권을 구매하고 학생들과 안전하게 매칭받으세요. 합리적인 요금제를 확인하세요.",
};

export default function TeacherPricingPage() {
  return (
    <div>
      {/* 선생님 이용권 플랜 */}
      <TeacherPricingPlans />
    </div>
  );
}
