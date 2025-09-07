'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomeMatchingWidget() {
  const [selectedRegion, setSelectedRegion] = useState('서울');

  const regions = [
    '서울',
    '인천/경기북부',
    '경기남부',
    '충청,강원,대전',
    '전라,경상,부산'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
      <div className="flex flex-col space-y-4">
        {/* 홈티매칭 버튼 */}
        <Link 
          href="/request" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors text-center shadow-md"
        >
          홈티매칭
        </Link>
        
        {/* 지역 선택 드롭다운들 */}
        <div className="space-y-3">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                region === selectedRegion 
                  ? 'bg-blue-100 text-blue-600 border border-blue-200' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-transparent'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
