import type { Metadata } from "next";
import BrowseBoard from '@/components/browse/BrowseBoard';

export const metadata: Metadata = {
  title: "선생님 둘러보기 - 모든별 키즈",
  description: "검증된 전문 치료사들의 프로필을 확인하고 직접 연락해보세요. 다양한 분야의 전문가들이 기다리고 있습니다.",
};

export default function BrowsePage() {
  return (
    <div>
      {/* 선생님 둘러보기 보드 - 페이지는 항상 노출, 버튼 단위 가드만 적용 */}
      <BrowseBoard />
    </div>
  );
}
