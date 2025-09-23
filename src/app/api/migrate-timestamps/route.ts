// 마이그레이션 API는 요구하지 않으셔서 제거합니다.
export async function POST() {
  return new Response('Gone', { status: 410 });
}
