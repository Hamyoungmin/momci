import type { Metadata } from "next";
import RequestBoard from '@/components/request/RequestBoard';

export const metadata: Metadata = {
  title: "선생님께 요청하기 - 더모든 키즈",
  description: "원하는 조건을 작성하여 치료사들의 지원을 받으세요. 맞춤형 매칭으로 아이에게 최적의 선생님을 찾을 수 있습니다.",
};

export default function RequestPage() {
  return (
    <div>
      {/* 요청 게시판 */}
      <RequestBoard />
    </div>
  );
}
