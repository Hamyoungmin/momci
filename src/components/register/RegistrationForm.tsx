'use client';

import { useState } from 'react';

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const therapyFields = [
    '언어치료', '놀이치료', '감각통합치료', '작업치료', '물리치료',
    '인지학습치료', '음악치료', '미술치료', 'ABA치료', '특수교육',
    '발음교정', '영어교육', '기타', '임상심리', '사회성치료'
  ];

  const banks = [
    'KB국민은행', '신한은행', '우리은행', '하나은행', 'NH농협은행',
    '기업은행', '부산은행', '대구은행', '경남은행', '광주은행',
    '전북은행', '제주은행', '케이뱅크', '카카오뱅크', '토스뱅크'
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">📋 기본 정보</h3>
            
            {/* 프로필 사진 */}
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">📷</span>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
                사진 등록 (필수)
              </button>
            </div>

            {/* 기본 정보 폼 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">생년월일 *</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">성별 *</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                  <option>여성</option>
                  <option>남성</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
                <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일(ID) *</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">주소 *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">📝 프로필 정보 (학부모 공개)</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">치료 철학 및 강점</label>
              <textarea 
                rows={4} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="본인의 마음가짐과 가치관을 가지고 아이들을 대하는지, 다른 치료사와 차별화되는 자신만의 강점은 무엇인지 어필하는 공간입니다."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">수업 계획 및 경험/사례</label>
              <textarea 
                rows={4} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="이전의 경험을 바탕으로 어떻게 수업하시는지 성공적인 경험의 간단하고 수업방식 특징을 학부모가 신뢰할 수 있도록 구체적으로 작성해주세요."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">출강지역 *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">희망 치료비 (1회기) *</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="65000" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">희망 활동 장소 (최대 3개 선택)</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="서울 강남구, 서초구, 송파구" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">치료 가능 요일</label>
              <div className="flex flex-wrap gap-2">
                {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                  <label key={day} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">치료 가능 시간</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="평일 오후 4시 이후 / 주말 오전 명절 가능" />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">🎯 전문 분야 및 자격 검증</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">전문 분야 선택 (중복 선택 가능)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {therapyFields.map((field) => (
                  <label key={field} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{field}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-800 mb-3">📋 자격 검증 (관리자 확인용)</h4>
              <p className="text-sm text-blue-700 mb-4">
                자격 서류는 인증을 위해서만 사용하며, 학부모님께 공개되지 않습니다.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">학력 증명 서류 (졸업증명서 등)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-gray-500">파일을 드래그하거나 클릭하여 업로드</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">경력 증명 서류 (경력증명서 등)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-gray-500">파일을 드래그하거나 클릭하여 업로드</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">자격증 사본</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-gray-500">파일을 드래그하거나 클릭하여 업로드</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">💰 정산 정보 및 최종 완료</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">국가면허 자격 증명 첨부하기</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500">파일을 드래그하거나 클릭하여 업로드</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">기타 첨부자료</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500">파일을 드래그하거나 클릭하여 업로드</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">1분 자기소개 영상</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500">동영상 파일을 업로드해주세요 (선택사항)</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-bold text-green-800 mb-4">📊 정산 정보 (관리자 확인용)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">은행명 *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                    <option>은행을 선택하세요</option>
                    {banks.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">예금주명 *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">계좌번호 *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">지원 경로</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option>지원 경로를 선택하세요</option>
                <option>검색엔진</option>
                <option>지인 추천</option>
                <option>SNS</option>
                <option>온라인 광고</option>
                <option>기타</option>
              </select>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-gray-800 mb-4">ℹ️ 최종 확인 및 동의</h4>
              <div className="space-y-3 text-sm text-gray-700">
                <p>1. 회원이 희망하는 조건에 맞는 안내하며, 전체 사항을 통한 사용자 활용 기본 사항에 동의를 확인합니다.</p>
                <p>2. 회원이 플랫폼의 정책을 인정하고 문제가 발생할 과정을 인지합니다.</p>
                <p>3. 회원 또는 사용자가 등록한 정보가 사실이 아닐 시 있음을 부인하며 정확한 주의 확인합니다.</p>
                <p>4. 회원은 가치를 가능한 서비스 안에서 실행이, 제재의 업체등 된 분의 제재 시 다음을 따라는 억지에 간접적으로 최우 경형을 컴업합니다.</p>
                <p>5. 활동수를 통하여 신의 정보 사현리에 의하여, 오고 설정 신의 가격을 금유하고, 회고 님 넘을 시정 함정 거를 습원등을 통명하다.</p>
                <p>6. 활동수부니 정내료를 놓닌 시점등에서 바로 활용 점닌을 정제를 소요하는 활동을 수급합니다.</p>
                <p>7. 활동수업회 등 번닌는 를을 정진에는 성향을, 정당한 어려움이 없어야 업회는 가를 활동 총에 된다.</p>
              </div>
              
              <div className="mt-6">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" />
                  <span className="font-medium">위 이용약관에 모두 동의합니다.</span>
                </label>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 진행 바 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  i + 1 <= currentStep 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-600">
              {currentStep} / {totalSteps} 단계
            </span>
          </div>
        </div>

        {/* 폼 내용 */}
        <div className="bg-white border-2 border-blue-500 rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              더모든 키즈 전문가 프로필 등록
            </h2>
            <p className="text-gray-600">
              전문성과 신뢰성을 가치로 존재하는 곳, 더모든 키즈에 오신 것을 환영합니다.
            </p>
          </div>
          {renderStepContent()}
          
          {/* 네비게이션 버튼 */}
          <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              이전 단계
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                다음 단계
              </button>
            ) : (
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg">
                프로필 등록 완료하기
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
