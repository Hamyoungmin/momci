export default function ContactInfo() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            문의 방법
          </h2>
          <p className="text-gray-600">
            다양한 방법으로 더모든 키즈에 문의하실 수 있습니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 전화 문의 */}
          <div className="bg-white border-2 border-blue-500 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">📞</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">전화 문의</h3>
            <div className="text-2xl font-bold text-blue-600 mb-4">
              1588-0000
            </div>
            <div className="text-gray-600 space-y-1">
              <p>평일: 오전 9시 - 오후 6시</p>
              <p>토요일: 오전 9시 - 오후 1시</p>
              <p>일요일 및 공휴일: 휴무</p>
            </div>
            <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full">
              전화걸기
            </button>
          </div>

          {/* 카카오톡 상담 */}
          <div className="bg-white border-2 border-blue-500 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">카카오톡 상담</h3>
            <div className="text-xl font-bold text-yellow-600 mb-4">
              @더모든키즈
            </div>
            <div className="text-gray-600 space-y-1">
              <p>평일: 오전 9시 - 오후 6시</p>
              <p>토요일: 오전 9시 - 오후 1시</p>
              <p>빠른 답변 제공</p>
            </div>
            <button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full">
              카카오톡 상담
            </button>
          </div>
        </div>

        {/* 이메일 문의 */}
        <div className="mt-8">
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-3">📧</span>
                  이메일 문의
                </h3>
                <p className="text-gray-600 mb-4">
                  복잡한 문의사항이나 상세한 설명이 필요한 경우 이메일로 문의주세요
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>일반문의:</strong> info@momkids.co.kr</p>
                  <p><strong>결제문의:</strong> payment@momkids.co.kr</p>
                  <p><strong>분쟁신고:</strong> report@momkids.co.kr</p>
                </div>
              </div>
              <div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-colors w-full">
                  이메일 문의하기
                </button>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  이메일 문의 시 24시간 내 답변드립니다
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 긴급 연락처 */}
        <div className="mt-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center">
              <span className="mr-3">🚨</span>
              긴급 상황 신고
            </h3>
            <p className="text-red-700 mb-4">
              안전사고, 분쟁, 직거래 유도 등 긴급한 상황이 발생했을 때는 즉시 연락주세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                긴급신고: 1588-0119
              </button>
              <button className="border border-red-500 text-red-500 hover:bg-red-50 px-6 py-3 rounded-lg font-medium transition-colors">
                온라인 신고센터
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
