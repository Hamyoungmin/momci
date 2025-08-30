export default function ReviewStats() {
  const stats = [
    {
      category: '언어치료',
      rating: 4.9,
      count: 1247,
      color: 'bg-green-100 text-green-800'
    },
    {
      category: '놀이치료',
      rating: 4.8,
      count: 892,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      category: '감각통합치료',
      rating: 4.9,
      count: 756,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      category: 'ABA치료',
      rating: 4.8,
      count: 534,
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      category: '작업치료',
      rating: 4.7,
      count: 423,
      color: 'bg-pink-100 text-pink-800'
    },
    {
      category: '미술치료',
      rating: 4.6,
      count: 378,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      category: '물리치료',
      rating: 4.7,
      count: 312,
      color: 'bg-red-100 text-red-800'
    },
    {
      category: '특수교육',
      rating: 4.6,
      count: 245,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      category: '인지학습치료',
      rating: 4.5,
      count: 189,
      color: 'bg-teal-100 text-teal-800'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            분야별 후기 통계
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            각 치료 분야별로 실제 이용자들의 만족도를 확인해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white border-2 border-blue-500 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className={`${stat.color} px-3 py-1 rounded-full text-sm font-medium`}>
                  {stat.category}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="font-bold text-gray-900">{stat.rating}</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stat.count}개</div>
                <div className="text-gray-500 text-sm">후기</div>
              </div>
              
              {/* 별점 표시 */}
              <div className="mt-4 flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= Math.floor(stat.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
