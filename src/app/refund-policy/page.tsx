import React from 'react';
import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 메인 환불규정 섹션 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-4 border-blue-700 rounded-lg p-16">
            <div className="text-center mb-24 mt-20">
              <h2 className="text-4xl font-bold text-gray-900">더모든 키즈 환불 규정</h2>
            </div>

            {/* 1. 기간제 이용권 */}
            <div className="mb-20">
              <h3 className="text-3xl font-bold text-black mb-6">1. 기간제 이용권</h3>
              
              <div className="border border-gray-300 rounded-lg p-6">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-green-600 mb-3">전액 환불</h4>
                  <p className="text-gray-700 leading-relaxed">
                    결제 후 7일 이내, 플랫폼 서비스를 전혀 이용하지 않은 경우 결제 수수료를 제외한 전액이 환불됩니다. (월 9,900원 이용권 기준)
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-yellow-600 mb-3">부분 환불</h4>
                  <p className="text-gray-700 leading-relaxed">
                    서비스 이용 개시 후에는 실제 이용일수(일할계산)와 위약금 10%를 공제한 금액이 환불됩니다. 단, 환불 신청일로부터 3-5 영업일 소요됩니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. 첫 수업료 */}
            <div className="mb-10">
              <h3 className="text-3xl font-bold text-black mb-6">2. 첫 수업료</h3>
              
              <div className="border border-gray-300 rounded-lg p-6">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-green-600 mb-3">전액 환불</h4>
                  <p className="text-gray-700 leading-relaxed">
                    수업 시작 24시간 전까지 취소 시 안전결제로 예치된 첫 수업료 전액이 환불됩니다. (평균 5-8만원)
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-bold text-yellow-600 mb-3">부분 환불</h4>
                  <p className="text-gray-700 leading-relaxed">
                    수업 진행 중 상호 합의 하에 중단하는 경우, 진행된 수업 회차를 제외한 나머지 금액에서 위약금(수업료 1회분)을 공제하고 환불됩니다.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-red-600 mb-3">환불 불가</h4>
                  <p className="text-gray-700 leading-relaxed">
                    계약된 총 수업 회차의 50% 이상 진행된 경우, 학부모 단방면 사유로 인한 중도 해지 시에는 환불이 불가능합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 안내사항 */}
            <div className="mt-[90px] mb-[30px] text-center">
              <p className="text-gray-600 text-sm">
                ※ 모든 환불은 고객센터(1588-0000)를 통해 신청하실 수 있으며, 환불 처리는 영업일 기준 3-5일 소요됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}