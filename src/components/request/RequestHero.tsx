import Link from 'next/link';

export default function RequestHero() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            선생님께 요청하기
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            아이의 상황과 원하는 조건을 작성하면<br />
            조건에 맞는 전문 치료사들이 직접 지원해드립니다
          </p>
          
          {/* 주요 특징 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold mb-2">맞춤형 매칭</h3>
              <p className="text-sm opacity-90">조건에 맞는 선생님들만 지원</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-bold mb-2">다양한 선택</h3>
              <p className="text-sm opacity-90">여러 선생님 중 비교 선택</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-bold mb-2">상세 검토</h3>
              <p className="text-sm opacity-90">충분한 상담 후 결정</p>
            </div>
          </div>
          
          {/* 이용 안내 */}
          <div className="bg-yellow-400 text-gray-900 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold mb-2">💡 이용 안내</h3>
            <p className="text-sm">
              치료사 선생님들이 올린 요청글을 확인하고<br />
              직접 지원하여 매칭을 받아보세요
            </p>
          </div>
          
          {/* CTA 버튼 */}
          <div className="flex justify-center">
            <Link
              href="/pricing"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              이용권 구매하기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
