'use client';

import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage, auth } from './firebase';

// 신고 타입 정의
export interface Report {
  id: string;
  type: 'direct_trade' | 'inappropriate_behavior' | 'false_profile' | 'service_complaint' | 'other';
  reporterId: string;
  reporterName: string;
  reporterType: 'parent' | 'teacher';
  reportedId?: string;
  reportedName?: string;
  reportedType?: 'parent' | 'teacher';
  title: string;
  description: string;
  evidence: {
    type: 'screenshot' | 'document' | 'chat';
    url: string;
    filename: string;
    description: string;
  }[];
  status: 'pending' | 'investigating' | 'completed' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  assignedTo?: string;
  resolution?: {
    action: string;
    reason: string;
    penalty?: 'warning' | 'temporary_ban' | 'permanent_ban';
    reward?: 'subscription_1month';
    processedBy: string;
    processedAt: Timestamp;
  };
  relatedChatId?: string;
  relatedMatchingId?: string;
}

// 파일 업로드 함수
export async function uploadReportEvidence(
  reportId: string,
  files: File[]
): Promise<{ url: string; filename: string; type: string }[]> {
  try {
    console.log('📁 파일 업로드 시작...', { reportId, fileCount: files.length });
    
    const uploadPromises = files.map(async (file, index) => {
      console.log(`📤 파일 ${index + 1}/${files.length} 업로드 중:`, file.name, `(${(file.size / 1024).toFixed(1)}KB)`);
      
      // 파일명 생성 (중복 방지)
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop() || '';
      const fileName = `evidence_${timestamp}_${index}.${fileExtension}`;
      
      // Storage 참조 생성
      const storageRef = ref(storage, `reports/${reportId}/evidence/${fileName}`);
      
      // 타임아웃과 함께 파일 업로드 (60초로 연장)
      const uploadPromise = uploadBytes(storageRef, file);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('파일 업로드 타임아웃 (60초)')), 60000)
      );
      
      const snapshot = await Promise.race([uploadPromise, timeoutPromise]) as any;
      console.log(`✅ 파일 ${index + 1} 업로드 완료:`, fileName);
      
      // 다운로드 URL 가져오기
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log(`🔗 파일 ${index + 1} URL 생성 완료`);
      
      // 파일 타입 결정
      let fileType: 'screenshot' | 'document' | 'chat' = 'document';
      if (file.type.startsWith('image/')) {
        fileType = 'screenshot';
      }
      
      return {
        url: downloadURL,
        filename: fileName,
        type: fileType
      };
    });

    console.log('⏳ 모든 파일 업로드 대기 중...');
    const uploadedFiles = await Promise.all(uploadPromises);
    console.log('🎉 모든 파일 업로드 완료!', uploadedFiles.length, '개');
    
    return uploadedFiles;
  } catch (error) {
    console.warn('⚠️ 파일 업로드 실패 (신고는 접수됨):', error);
    // 사용자에게는 더 친숙한 메시지로 에러 전달
    const friendlyMessage = error instanceof Error && error.message.includes('타임아웃') 
      ? '파일이 커서 업로드에 시간이 오래 걸립니다' 
      : '네트워크 문제로 파일 업로드에 실패했습니다';
    throw new Error(friendlyMessage);
  }
}

// 신고 데이터 저장 함수
export async function createReport(
  reportData: {
    type: 'direct_trade' | 'inappropriate_behavior' | 'false_profile' | 'service_complaint' | 'other';
    reportedName: string;
    description: string;
    title: string;
  },
  files: File[]
): Promise<string> {
  // 디버깅: 인증 상태 확인
  console.log('🔍 인증 상태:', {
    isAuthenticated: !!auth.currentUser,
    uid: auth.currentUser?.uid,
    email: auth.currentUser?.email,
    displayName: auth.currentUser?.displayName
  });

  // 인증된 사용자와 익명 사용자 모두 지원
  const reporterId = auth.currentUser?.uid || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const reporterName = auth.currentUser?.displayName || 
                      auth.currentUser?.email?.split('@')[0] || 
                      '익명 신고자';
  
  const newReportData = {
    type: reportData.type,
    reporterId: reporterId,
    reporterName: reporterName,
    reporterType: 'parent' as const, // 현재는 학부모만 신고 가능하도록 가정
    reportedName: reportData.reportedName,
    title: reportData.title,
    description: reportData.description,
    evidence: [] as any[], // 나중에 파일 업로드 후 업데이트
    status: 'pending' as const,
    priority: reportData.type === 'direct_trade' ? 'urgent' as const : 'medium' as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    // 익명 신고 여부 표시
    isAnonymous: !auth.currentUser
  };

  try {
    console.log('📤 전송할 데이터:', newReportData);
    console.log('🗂️ 필드 리스트:', Object.keys(newReportData));

    // 먼저 신고 문서 생성
    const reportRef = collection(db, 'reports');

    console.log('🚀 Firestore에 데이터 전송 시작...');
    const docRef = await addDoc(reportRef, newReportData);
    console.log('✅ 문서 생성 성공! ID:', docRef.id);
    const reportId = docRef.id;

    // 파일이 있으면 업로드 (실패해도 신고는 접수됨)
    let evidenceFiles: { url: string; filename: string; type: string }[] = [];
    let fileUploadError = null;
    
    if (files.length > 0) {
      try {
        console.log('📎 첨부파일 처리 시작...', files.length, '개');
        evidenceFiles = await uploadReportEvidence(reportId, files);
        console.log('✅ 모든 첨부파일 처리 완료');
      } catch (error) {
        console.info('📎 파일 업로드 건너뜀 (신고는 접수됨):', error instanceof Error ? error.message : error);
        fileUploadError = error;
        // 파일 업로드 실패해도 신고는 계속 진행
      }
    }

    // 신고 문서에 증빙 파일 정보 업데이트
    if (evidenceFiles.length > 0) {
      try {
        const evidence = evidenceFiles.map(file => ({
          type: file.type,
          url: file.url,
          filename: file.filename,
          description: `첨부파일: ${file.filename}`
        }));

        console.log('📋 증빙 파일 정보 업데이트 중...');
        await updateDoc(doc(db, 'reports', reportId), {
          evidence: evidence,
          updatedAt: serverTimestamp()
        });
        console.log('✅ 증빙 파일 정보 업데이트 완료');
      } catch (updateError) {
        console.info('📋 파일 정보 업데이트 건너뜀:', updateError instanceof Error ? updateError.message : updateError);
        // 파일 정보 업데이트 실패해도 신고는 이미 접수됨
      }
    }

    // 성공 정보 반환
    const result = {
      reportId,
      fileUploadError: fileUploadError ? fileUploadError.message : null,
      filesUploaded: evidenceFiles.length,
      totalFiles: files.length
    };
    
    console.log('🎉 신고 접수 완료!', result);
    return reportId;
  } catch (error) {
    console.error('신고 생성 실패:', error);
    console.error('신고 데이터:', newReportData);
    
    // 에러 유형에 따른 상세 메시지
    let errorMessage = '신고 접수에 실패했습니다.';
    
    if (error instanceof Error) {
      console.error('에러 메시지:', error.message);
      console.error('에러 스택:', error.stack);
      
      if (error.message.includes('permission-denied')) {
        errorMessage = '신고 접수 권한이 없습니다. Firestore 규칙을 확인해주세요.';
      } else if (error.message.includes('network') || error.message.includes('failed to fetch')) {
        errorMessage = '네트워크 연결을 확인하고 다시 시도해주세요.';
      } else if (error.message.includes('quota')) {
        errorMessage = '일일 신고 한도를 초과했습니다. 내일 다시 시도해주세요.';
      } else if (error.message.includes('not-found')) {
        errorMessage = 'Firebase 컬렉션을 찾을 수 없습니다. 설정을 확인해주세요.';
      } else {
        // 모든 환경에서 상세 에러 표시 (디버깅을 위해)
        errorMessage += `\n\n🔧 기술적 세부사항: ${error.message}`;
      }
    }
    
    // Firebase 에러 코드 확인
    if ((error as any)?.code) {
      console.error('Firebase 에러 코드:', (error as any).code);
      errorMessage += `\n에러 코드: ${(error as any).code}`;
    }
    
    throw new Error(errorMessage);
  }
}

// 모든 신고 데이터 가져오기 (관리자용)
export async function getAllReports(): Promise<Report[]> {
  try {
    const reportsRef = collection(db, 'reports');
    const q = query(reportsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const reports: Report[] = [];
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      } as Report);
    });

    return reports;
  } catch (error) {
    console.error('신고 목록 가져오기 실패:', error);
    throw new Error('신고 목록을 가져오는데 실패했습니다.');
  }
}

// 특정 상태의 신고 가져오기
export async function getReportsByStatus(status: string): Promise<Report[]> {
  try {
    const reportsRef = collection(db, 'reports');
    const q = query(
      reportsRef, 
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const reports: Report[] = [];
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      } as Report);
    });

    return reports;
  } catch (error) {
    console.error('신고 목록 가져오기 실패:', error);
    throw new Error('신고 목록을 가져오는데 실패했습니다.');
  }
}

// 특정 타입의 신고 가져오기
export async function getReportsByType(type: string): Promise<Report[]> {
  try {
    const reportsRef = collection(db, 'reports');
    const q = query(
      reportsRef, 
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const reports: Report[] = [];
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      } as Report);
    });

    return reports;
  } catch (error) {
    console.error('신고 목록 가져오기 실패:', error);
    throw new Error('신고 목록을 가져오는데 실패했습니다.');
  }
}

// 신고 상태 업데이트 (관리자용)
export async function updateReportStatus(
  reportId: string,
  status: 'pending' | 'investigating' | 'completed' | 'dismissed',
  assignedTo?: string
): Promise<void> {
  try {
    const reportRef = doc(db, 'reports', reportId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    };

    if (assignedTo) {
      updateData.assignedTo = assignedTo;
    }

    await updateDoc(reportRef, updateData);
  } catch (error) {
    console.error('신고 상태 업데이트 실패:', error);
    throw new Error('신고 상태 업데이트에 실패했습니다.');
  }
}

// 신고 처리 완료 (관리자용)
export async function resolveReport(
  reportId: string,
  resolution: {
    action: string;
    reason: string;
    penalty?: 'warning' | 'temporary_ban' | 'permanent_ban';
    reward?: 'subscription_1month';
  }
): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const reportRef = doc(db, 'reports', reportId);
    await updateDoc(reportRef, {
      status: 'completed',
      resolution: {
        ...resolution,
        processedBy: auth.currentUser.uid,
        processedAt: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('신고 처리 실패:', error);
    throw new Error('신고 처리에 실패했습니다.');
  }
}
