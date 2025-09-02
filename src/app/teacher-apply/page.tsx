import type { Metadata } from "next";
import TeacherSearchBoard from '@/components/teacher-apply/TeacherSearchBoard';

export const metadata: Metadata = {
  title: "가치를 찾으신 치료사 등록 - 모든별 키즈",
  description: "이력을 등록하고 가치를 치료사들을 활동하신나요? 여러 학부모의 요청을 살펴보세요!",
};

export default function TeacherApplyPage() {
  return (
    <div>
      {/* 치료사 검색 게시판 */}
      <TeacherSearchBoard />
    </div>
  );
}