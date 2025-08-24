import type { Metadata } from "next";
import BrowseHero from '@/components/browse/BrowseHero';
import TeacherProfiles from '@/components/browse/TeacherProfiles';
import SearchFilters from '@/components/browse/SearchFilters';

export const metadata: Metadata = {
  title: "선생님 둘러보기 - 더모든 키즈",
  description: "검증된 전문 치료사들의 프로필을 확인하고 직접 연락해보세요. 다양한 분야의 전문가들이 기다리고 있습니다.",
};

export default function BrowsePage() {
  return (
    <div>
      {/* 히어로 섹션 */}
      <BrowseHero />
      
      {/* 검색 필터 */}
      <SearchFilters />
      
      {/* 치료사 프로필 목록 */}
      <TeacherProfiles />
    </div>
  );
}
