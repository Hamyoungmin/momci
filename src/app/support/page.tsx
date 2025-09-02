import type { Metadata } from "next";
import SupportHero from '@/components/support/SupportHero';
import FAQ from '@/components/support/FAQ';
import ContactInfo from '@/components/support/ContactInfo';
import RefundPolicy from '@/components/support/RefundPolicy';
import ReportCenter from '@/components/support/ReportCenter';

export const metadata: Metadata = {
  title: "고객센터 - 모든별 키즈",
  description: "모든별 키즈 이용 중 궁금한 점이나 문의사항이 있으시면 언제든지 연락주세요. FAQ, 환불규정, 직거래 신고 등 다양한 지원 서비스를 제공합니다.",
};

export default function SupportPage() {
  return (
    <div>
      {/* 히어로 섹션 */}
      <SupportHero />
      
      {/* FAQ */}
      <FAQ />
      
      {/* 문의 정보 */}
      <ContactInfo />
      
      {/* 환불 규정 */}
      <RefundPolicy />
      
      {/* 직거래 신고 센터 */}
      <ReportCenter />
    </div>
  );
}
