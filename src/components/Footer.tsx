import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 정보 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">더</span>
              </div>
              <span className="text-xl font-bold">더모든 키즈</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              더모든 키즈는 전문 치료사와 학부모를 안전하게 연결하는<br />
              홈티칭 매칭 플랫폼입니다.<br />
              아이에게 꼭 필요한 가장 효과적인 도움을 제공합니다.
            </p>
            <div className="text-sm text-gray-400">
              <p>대표번호: 1588-0000</p>
              <p>이메일: help@momci.co.kr</p>
              <p>운영시간: 평일 09:00 - 18:00</p>
            </div>
          </div>

          {/* 서비스 메뉴 */}
          <div>
            <h3 className="font-semibold mb-4">서비스</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  이용안내
                </Link>
              </li>
              <li>
                <Link href="/matching" className="hover:text-white transition-colors">
                  홈티매칭
                </Link>
              </li>
              <li>
                <Link href="/request" className="hover:text-white transition-colors">
                  선생님께 요청하기
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  선생님 둘러보기
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  이용권 구매
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h3 className="font-semibold mb-4">고객지원</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  고객센터
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  치료사 후기
                </Link>
              </li>
              <li>
                <Link href="/register-teacher" className="hover:text-white transition-colors">
                  치료사 등록
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  환불 규정
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 구분선 및 정책 링크 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4 md:mb-0">
              <Link href="/terms" className="hover:text-white transition-colors">
                이용약관
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors font-semibold">
                개인정보처리방침
              </Link>
              <Link href="/youth-protection" className="hover:text-white transition-colors">
                청소년 보호정책
              </Link>
              <Link href="/marketing" className="hover:text-white transition-colors">
                마케팅 동의
              </Link>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 더모든 키즈. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
