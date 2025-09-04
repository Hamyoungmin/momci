'use client';

import { useState } from 'react';
import { createReport } from '@/lib/reports';

export default function ReportCenter() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 파일 처리 함수들
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // 큰 파일에 대한 경고
      const largeFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024); // 5MB 이상
      if (largeFiles.length > 0) {
        const fileNames = largeFiles.map(f => f.name).join(', ');
        const confirmed = confirm(
          `⚠️ 큰 파일이 감지되었습니다:\n${fileNames}\n\n` +
          `큰 파일은 업로드가 오래 걸리거나 실패할 수 있습니다.\n` +
          `그래도 추가하시겠습니까?\n\n` +
          `(신고는 파일 없이도 접수 가능합니다)`
        );
        if (!confirmed) {
          return;
        }
      }
      
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      
      // 큰 파일에 대한 경고 (드래그앤드롭)
      const largeFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024); // 5MB 이상
      if (largeFiles.length > 0) {
        const fileNames = largeFiles.map(f => f.name).join(', ');
        const confirmed = confirm(
          `⚠️ 큰 파일이 감지되었습니다:\n${fileNames}\n\n` +
          `큰 파일은 업로드가 오래 걸리거나 실패할 수 있습니다.\n` +
          `그래도 추가하시겠습니까?\n\n` +
          `(신고는 파일 없이도 접수 가능합니다)`
        );
        if (!confirmed) {
          return;
        }
      }
      
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher || !reportContent || !agreedToTerms) {
      alert('모든 필수 항목을 입력하고 동의해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 신고 데이터 생성
      const reportData = {
        type: 'direct_trade' as const,
        reportedName: selectedTeacher === 'direct_input' ? '직접 입력된 선생님' : selectedTeacher,
        description: reportContent,
        title: `직거래 신고 - ${selectedTeacher === 'direct_input' ? '직접 입력된 선생님' : selectedTeacher}`
      };

      // 신고 생성 (파일 포함)
      const reportId = await createReport(reportData, attachedFiles);

      let message = '✅ 신고가 성공적으로 접수되었습니다!\n신고 ID: ' + reportId + '\n\n검토 후 결과를 안내드리겠습니다.';
      if (attachedFiles.length > 0) {
        message += `\n\n📎 첨부파일 처리 결과:\n- 총 ${attachedFiles.length}개 파일 중 업로드를 시도했습니다.\n- 일부 파일이 네트워크 문제로 업로드되지 않을 수 있지만,\n- 신고는 정상적으로 접수되었습니다.`;
      }
      
      alert(message);
      
      // 폼 리셋
      setShowReportForm(false);
      setSelectedTeacher('');
      setReportContent('');
      setAgreedToTerms(false);
      setAttachedFiles([]);
    } catch (error) {
      console.error('신고 제출 실패:', error);
      alert('❌ 신고 접수에 실패했습니다.\n' + (error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.') + '\n\n다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showReportForm ? (
          <>
            {/* 메인 박스 */}
            <div className="bg-white border-4 border-blue-700 rounded-lg p-8">
              {/* 제목 */}
              <div className="text-center mb-20 mt-20">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">클린 캠페인: 직거래 신고 안내</h2>
                <p className="text-gray-600 text-center leading-relaxed text-lg">
                  <span className="text-blue-700 font-semibold">더모든 키즈는</span> 선생님과 학부모님 모두가 신뢰할 수 있는 투명한 거래 환경을 위해 노력합니다.
                </p>
              </div>

              {/* 경고 박스 */}
              <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-32">
                <h3 className="font-bold text-red-700 mb-3">
                  엄격히 금지됩니다!
                </h3>
                <p className="text-red-700 leading-relaxed">
                  플랫폼의 안전결제 시스템을 통하지 않은 외부 거래(현금, 계좌이체 등)는 
                  수업료 사기, 분쟁 등 다양한 위험에 노출될 수 있어 엄격히 금지됩니다.
                </p>
              </div>

              {/* 신고 안내 */}
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-black mb-6">
                  학부모님, 이런 경우 꼭 신고해 주세요!
                </h3>
                
                {/* 구분선 */}
                <div className="border-t border-gray-300 mb-6"></div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  만약 일부 치료사가 수수료 회피를 목적으로 직거래를 유도한다면, 
                  즉시 고객센터를 통해 신고해 주세요.
                </p>
              </div>

              {/* 혜택 박스 */}
              <div className="bg-green-100 p-6 rounded-xl mb-6">
                <div className="text-center">
                  <p className="text-green-800 text-sm font-bold mb-2">신고 내용이 사실로 확인될 경우,</p>
                  <p className="text-green-700 text-sm mb-3">제보해 주신 학부모님께 감사의 의미로</p>
                  <p className="text-xl leading-relaxed font-bold">
                    <span className="text-green-500">더모든 키즈 이용권 1개월권</span><span className="text-green-800">(무료 인터뷰 2회 포함)을 포상으로 지급해 드립니다.</span>
                  </p>
                </div>
              </div>

              {/* 하단 텍스트 */}
              <div className="text-center mb-24">
                <p className="text-gray-500">
                  여러분의 소중한 제보가 더 안전하고 신뢰도 높은 더모든 키즈를 만듭니다.
                </p>
              </div>

              {/* 버튼 */}
              <div className="text-center">
                <button
                  onClick={() => setShowReportForm(true)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  🔔 직거래 신고하러 가기
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 신고 폼 */}
            <div className="bg-white border-4 border-blue-700 rounded-lg p-8">
              <div className="text-center mb-20 mt-20">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">
                  직거래 신고센터
                </h2>
                <p className="text-gray-600">
                  클린 캠페인에 동참해 주셔서 감사합니다.
                </p>
                <p className="text-gray-600">
                  모든 내용은 안전하게 처리되며, 사실 확인 시 포상이 지급됩니다.
                </p>
              </div>

              {/* 신고자 정보 */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">👤 신고자 정보</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <p className="font-medium text-blue-800">익명 신고 가능</p>
                  </div>
                  <p className="text-sm text-blue-700">
                    로그인하지 않아도 신고하실 수 있습니다. 
                    신고자의 정보는 관리자만 확인할 수 있으며, 안전하게 보호됩니다.
                  </p>
                </div>
              </div>

              {/* 신고 폼 */}
              <form onSubmit={handleSubmitReport} className="space-y-6">
                {/* 신고 대상 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    신고 대상 선택 *
                  </label>
                  <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">선생님을 선택해주세요</option>
                    <option value="direct_input">직접 입력하기</option>
                  </select>
                  
                  {selectedTeacher === 'direct_input' && (
                    <input
                      type="text"
                      placeholder="신고 대상 치료사의 이름을 입력해주세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-2"
                      required
                    />
                  )}
                  
                  <p className="text-sm text-gray-500 mt-1">
                    ※ 최근에 1:1 채팅을 신청한 선생님 목록이 자동으로 표시됩니다.
                  </p>
                </div>

                {/* 신고 내용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    신고 내용 *
                  </label>
                  <textarea
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="직거래를 유도한 상황을 구체적으로 작성해주세요. ( 예: 언제, 어떤 방식으로 제안했는지 등 )"
                    required
                  />
                </div>

                {/* 증빙 자료 첨부 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📎 증빙 자료 첨부 (선택)
                  </label>
                  
                  {/* 파일 업로드 영역 */}
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-2">관련 대화 내용 스크린샷 등 증빙 자료들을 첨부해주세요.</p>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">파일을 여기에 드래그하거나</p>
                        <label className="inline-block cursor-pointer">
                          <input
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx,.txt"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <span className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            파일 선택
                          </span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">지원 형식: 이미지, PDF, 문서 파일</p>
                    </div>
                  </div>
                  
                  {/* 첨부된 파일 목록 */}
                  {attachedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">첨부된 파일 ({attachedFiles.length}개)</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {attachedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className="flex-shrink-0">
                                {file.type.startsWith('image/') ? (
                                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="flex-shrink-0 ml-2 text-red-400 hover:text-red-600 transition-colors"
                              title="파일 삭제"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">
                      ※ 카카오톡 대화, 문자 메세지 등을 캡처하여 첨부하시면 더 빠른 처리가 가능합니다.
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      💡 파일 없이도 신고 가능합니다. 네트워크가 느린 경우 파일을 제외하고 신고하세요.
                    </p>
                  </div>
                </div>

                {/* 허위신고 경고 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>⚠️ 주의:</strong> 허위 신고로 밝혀질 경우, 포상 지급이 취소될 뿐만 아니라 플랫폼 이용이 영구적으로 제한될 수 있습니다.
                  </p>
                </div>

                {/* 동의 체크박스 */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1"
                    required
                  />
                  <label htmlFor="agree" className="text-base font-bold text-gray-900">
                    위 내용을 모두 확인했으며, 사실에 근거하여 신고합니다. *
                  </label>
                </div>

                {/* 버튼 */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-top-transparent mr-2"></div>
                        제출 중...
                      </div>
                    ) : (
                      '신고 제출하기'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
