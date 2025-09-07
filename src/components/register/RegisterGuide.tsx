export default function RegisterGuide() {
  // 대괄호와 중괄호로 감싸진 텍스트를 파란색으로 변환하는 함수
  const formatTextWithBlueHighlight = (text: string) => {
    // \\n을 실제 줄바꿈 문자로 변환
    const formattedText = text.replace(/\\n/g, '\n');
    const parts = formattedText.split(/(\[.*?\]|\{.*?\})/);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-blue-600 font-semibold">
            {part}
          </span>
        );
      } else if (part.startsWith('{') && part.endsWith('}')) {
        return (
          <span key={index} className="text-blue-600 font-semibold">
            {part.replace(/[{}]/g, '')}
          </span>
        );
      }
      return part;
    });
  };
  const steps = [
    {
      step: "01",
      title: "프로필 등록 및 검증",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#E3F2FD" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="14,2 14,8 20,8" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="16" y1="13" x2="8" y2="13" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="16" y1="17" x2="8" y2="17" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="10,9 9,9 8,9" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      descriptions: [
        "[치료사 회원]으로 가입 후 프로필(학력/경력/자격증)과 관련 서류를 제출하면,\\n관리자 검토 후 [등록완료] 처리됩니다.",
        "( ※ 서류 누락 시 [등록보류], 임상 경력 1년 미만 시 [자격미달] 처리될 수 있으니 유의 바랍니다.)"
      ]
    },
    {
      step: "02", 
      title: "매칭 활동 시작",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8" fill="#E3F2FD" stroke="#1976D2" strokeWidth="2"/>
          <path d="m21 21-4.35-4.35" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      descriptions: [
        "[선생님 요청하기]에서 학부모님의 요청글에 직접 지원하거나,",
        "[선생님 둘러보기]에 등록된 프로필을 보고 학부모님의 제안을 받습니다."
      ]
    },
    {
      step: "03",
      title: "인터뷰 및 수업 확정", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#E3F2FD" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="10" r="1" fill="#1976D2"/>
          <circle cx="12" cy="10" r="1" fill="#1976D2"/>
          <circle cx="15" cy="10" r="1" fill="#1976D2"/>
        </svg>
      ),
      descriptions: [
        "연결된 학부모님과 {1:1 실시간 채팅}으로 인터뷰를 조율합니다.",
        "수업이 확정되면 학부모님이 첫 수업료를 결제하고, 이후 연락처가 공개됩니다."
      ]
    },
    {
      step: "04",
      title: "투명한 수익 구조",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" fill="#E3F2FD" stroke="#1976D2" strokeWidth="2"/>
          <path d="m12 1 3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z" fill="#E3F2FD" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ), 
      descriptions: [
        "첫 매칭 수수료를 제외한 {모든 수업료는 100% 선생님의 수익}입니다.",
        "플랫폼 내에서 안전하게 활동하고 {'인증 선생님'}으로 성장하세요.",
        "( ※ 외부 직거래는 금지되며, 더모든 키즈의 선생님은 독립적인 전문가(프리랜서)로 활동합니다.)"
      ]
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 메인 등록 안내 박스 */}
        <div className="bg-white border-4 border-blue-700 rounded-lg p-8">
          {/* 제목 */}
          <div className="text-center mb-20 mt-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              더모든 키즈 치료사 등록안내
            </h2>
          </div>

          {/* 등록 단계 - 세로 레이아웃 */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-6">
                {/* 스텝 아이콘 */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                
                {/* 내용 */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.step} {step.title}
                  </h3>
                  <div className="space-y-2">
                    {step.descriptions.map((desc, descIndex) => (
                      <div key={descIndex} className="flex items-start space-x-2">
                        <span className="text-gray-700 text-lg leading-none">●</span>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                          {formatTextWithBlueHighlight(desc)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
