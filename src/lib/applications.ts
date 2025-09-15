import { collection, doc, getDoc, updateDoc, serverTimestamp, increment, runTransaction, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// 지원서 생성 (최대 2명 제한)
export async function createApplication(
  postId: string,
  applicantId: string,
  postAuthorId: string,
  message: string
): Promise<string> {
  try {
    console.log('지원서 생성 중...', {
      postId,
      applicantId,
      postAuthorId,
      messageLength: message.length
    });

    // 트랜잭션을 사용해서 안전하게 지원자 수 확인 및 지원서 생성
    const result = await runTransaction(db, async (transaction) => {
      // 1. 게시글 정보 확인
      const postRef = doc(db, 'posts', postId);
      const postDoc = await transaction.get(postRef);
      
      if (!postDoc.exists()) {
        throw new Error('게시글을 찾을 수 없습니다.');
      }
      
      const postData = postDoc.data();
      
      // applications 필드 안전하게 확인
      let currentApplications = 0;
      if (postData.applications !== undefined && postData.applications !== null) {
        if (typeof postData.applications === 'number') {
          currentApplications = postData.applications;
        } else if (typeof postData.applications === 'string') {
          currentApplications = parseInt(postData.applications, 10) || 0;
        }
      }
      
      console.log('🔍 서버 사이드 지원자 수 확인:', {
        rawValue: postData.applications,
        processedCount: currentApplications,
        rawType: typeof postData.applications,
        postId: postId
      });
      
      // 2. 지원자 수 제한 확인 (최대 2명)
      if (currentApplications >= 2) {
        throw new Error('이미 지원자가 2명입니다. 더 이상 지원할 수 없습니다.');
      }
      
      // 3. 중복 지원 확인 - 같은 게시글에는 한 번만 지원 가능
      const existingApplicationQuery = query(
        collection(db, 'applications'),
        where('postId', '==', postId),
        where('applicantId', '==', applicantId)
      );
      const existingApplications = await getDocs(existingApplicationQuery);
      
      if (!existingApplications.empty) {
        throw new Error('이미 이 게시글에 지원하셨습니다.');
      }
      
      // 4. 지원서 데이터 생성
      const applicationData = {
        postId,
        applicantId,
        postAuthorId,
        message,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      // 5. applications 컬렉션에 지원서 추가
      const applicationRef = doc(collection(db, 'applications'));
      transaction.set(applicationRef, applicationData);
      
      // 6. 게시글의 지원자 수 증가
      transaction.update(postRef, {
        applications: increment(1)
      });

      return applicationRef.id;
    });

    console.log('지원서 생성 완료:', result);
    return result;
    
  } catch (error) {
    console.error('지원서 생성 실패:', error);
    
    // 사용자에게 보여줄 구체적인 에러 메시지
    if (error instanceof Error) {
      if (error.message.includes('이미 지원자가 2명')) {
        throw new Error('죄송합니다. 이 게시글은 이미 지원자가 2명이어서 더 이상 지원할 수 없습니다.');
      } else if (error.message.includes('이미 이 게시글에 지원')) {
        throw new Error('이미 이 게시글에 지원하셨습니다. 다른 게시글에 지원해보세요.');
      } else if (error.message.includes('게시글을 찾을 수 없습니다')) {
        throw new Error('게시글을 찾을 수 없습니다. 새로고침 후 다시 시도해주세요.');
      }
    }
    
    throw new Error('지원서를 제출할 수 없습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 지원서 상태 업데이트
export async function updateApplicationStatus(
  applicationId: string,
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn'
): Promise<void> {
  try {
    const applicationRef = doc(db, 'applications', applicationId);
    await updateDoc(applicationRef, {
      status,
      updatedAt: serverTimestamp()
    });
    
    console.log('지원서 상태 업데이트 완료:', applicationId, status);
  } catch (error) {
    console.error('지원서 상태 업데이트 실패:', error);
    throw error;
  }
}

// 사용자 정보 조회 (지원서용)
export async function getApplicantInfo(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        name: userData.name || '익명',
        userType: userData.userType || 'therapist',
        email: userData.email || '',
        phone: userData.phone || '',
        // 치료사 추가 정보
        specialty: userData.specialty || '',
        experience: userData.experience || 0,
        region: userData.region || ''
      };
    }
    throw new Error('사용자 정보를 찾을 수 없습니다.');
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    throw error;
  }
}
