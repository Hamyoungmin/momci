import type { Metadata } from "next";
import GuideHero from '@/components/guide/GuideHero';
import HowItWorks from '@/components/guide/HowItWorks';
import SafetyFeatures from '@/components/guide/SafetyFeatures';
import PricingInfo from '@/components/guide/PricingInfo';
import FAQ from '@/components/guide/FAQ';
import ServiceProcess from '@/components/sections/ServiceProcess';

export const metadata: Metadata = {
  title: "이용안내 - 더모든 키즈",
  description: "더모든 키즈 플랫폼 이용 방법과 안전한 매칭 프로세스를 확인하세요.",
};

export default function GuidePage() {
  return (
    <div>
      {/* 히어로 섹션 */}
      <GuideHero />
      
      {/* 서비스 프로세스 */}
      <ServiceProcess />
      
      {/* 이용 방법 */}
      <HowItWorks />
      
      {/* 안전 기능 */}
      <SafetyFeatures />
      
      {/* 요금 정보 */}
      <PricingInfo />
      
      {/* FAQ */}
      <FAQ />
    </div>
  );
}
