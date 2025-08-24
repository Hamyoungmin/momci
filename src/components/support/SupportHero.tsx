export default function SupportHero() {
  return (
    <section className="bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            고객센터
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto">
            더모든 키즈 이용 중 궁금한 점이나 문의사항이 있으시면<br />
            언제든지 연락주세요
          </p>
          
          {/* 주요 서비스 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="text-3xl mb-3">❓</div>
              <h3 className="font-bold mb-1 text-gray-900">FAQ</h3>
              <p className="text-sm text-gray-600">자주 묻는 질문</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-bold mb-1 text-gray-900">1:1 문의</h3>
              <p className="text-sm text-gray-600">개별 상담 지원</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold mb-1 text-gray-900">환불 규정</h3>
              <p className="text-sm text-gray-600">투명한 환불 정책</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="text-3xl mb-3">🚨</div>
              <h3 className="font-bold mb-1 text-gray-900">신고센터</h3>
              <p className="text-sm text-gray-600">안전한 거래 환경</p>
            </div>
          </div>
          
          {/* 운영시간 */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="font-bold mb-3 text-gray-900">📞 고객센터 운영시간</h3>
            <div className="text-sm text-gray-600">
              <p>평일: 오전 9시 - 오후 6시</p>
              <p>토요일: 오전 9시 - 오후 1시</p>
              <p>일요일 및 공휴일: 휴무</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
