import type { Metadata } from "next";
import RegisterGuide from '@/components/register/RegisterGuide';

export const metadata: Metadata = {
  title: "치료사 등록 - 더모든 키즈",
  description: "더모든 키즈에서 전문 치료사로 활동하세요. 검증된 플랫폼에서 안정적인 수입과 성장 기회를 얻을 수 있습니다.",
};

export default function RegisterTeacherPage() {
  return (
    <div>
      {/* 등록 가이드 */}
      <RegisterGuide />
    </div>
  );
}
