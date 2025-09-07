'use client';

import { useState } from 'react';

export default function SearchFilters() {
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedExperience, setSelectedExperience] = useState('전체');
  const [priceRange, setPriceRange] = useState([30000, 100000]);

  const regions = ['전체', '서울', '경기', '인천', '대전', '대구', '부산', '광주', '울산'];
  const categories = ['전체', '언어치료', '놀이치료', '감각통합치료', '작업치료', '물리치료', 'ABA치료', '미술치료', '음악치료'];
  const experiences = ['전체', '1-3년', '3-5년', '5-10년', '10년 이상'];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 rounded-2xl shadow-sm p-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 지역 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* 치료 분야 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">치료 분야</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* 경력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">경력</label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {experiences.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            {/* 검색 버튼 */}
            <div className="flex items-end">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors shadow-sm">
                검색
              </button>
            </div>
          </div>

          {/* 가격 범위 */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              시간당 수업료: {priceRange[0].toLocaleString()}원 - {priceRange[1].toLocaleString()}원
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">3만원</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="30000"
                  max="100000"
                  step="5000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-3 bg-gray-200 rounded-2xl appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((priceRange[1] - 30000) / 70000) * 100}%, #E5E7EB ${((priceRange[1] - 30000) / 70000) * 100}%, #E5E7EB 100%)`
                  }}
                />
              </div>
              <span className="text-sm text-gray-500">10만원</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
