import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// 사용자 유형
export type UserType = 'parent' | 'therapist';

// 사용자 데이터 인터페이스
export interface UserData {
  uid: string;
  email: string;
  name: string;
  phone: string;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
}

// 회원가입
export const signUp = async (
  email: string, 
  password: string, 
  userData: {
    name: string;
    phone: string;
    userType: UserType;
    agreeTerms: boolean;
    agreePrivacy: boolean;
    agreeMarketing: boolean;
  }
) => {
  try {
    // Firebase 인증으로 계정 생성
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 사용자 프로필 업데이트
    await updateProfile(user, {
      displayName: userData.name
    });

    // Firestore에 사용자 정보 저장 (에러 처리 추가)
    const userDocData: UserData = {
      uid: user.uid,
      email: user.email!,
      name: userData.name,
      phone: userData.phone,
      userType: userData.userType,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: user.emailVerified,
      agreeTerms: userData.agreeTerms,
      agreePrivacy: userData.agreePrivacy,
      agreeMarketing: userData.agreeMarketing
    };

    try {
      await setDoc(doc(db, 'users', user.uid), userDocData);
      console.log('사용자 데이터 Firestore에 저장 완료');
    } catch (firestoreError) {
      console.warn('Firestore 저장 실패:', firestoreError);
      // Firestore 실패해도 회원가입은 성공으로 처리
    }

    return { 
      success: true, 
      user: user,
      userData: userDocData 
    };
  } catch (error: any) {
    console.error('회원가입 오류:', error);
    return { 
      success: false, 
      error: getAuthErrorMessage(error.code) 
    };
  }
};

// 로그인
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestore에서 사용자 정보 가져오기
    let userData = null;
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        userData = userDoc.data() as UserData;
        console.log('사용자 데이터 Firestore에서 조회 완료');
      }
    } catch (firestoreError) {
      console.warn('Firestore 조회 실패:', firestoreError);
      // Firestore 실패해도 로그인은 성공으로 처리
    }

    return { 
      success: true, 
      user: user,
      userData: userData 
    };
  } catch (error: any) {
    console.error('로그인 오류 상세:', error);
    console.error('에러 코드:', error.code);
    console.error('에러 메시지:', error.message);
    return { 
      success: false, 
      error: getAuthErrorMessage(error.code) 
    };
  }
};

// 로그아웃
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('로그아웃 오류:', error);
    return { 
      success: false, 
      error: '로그아웃 중 오류가 발생했습니다.' 
    };
  }
};

// 비밀번호 재설정 이메일 전송
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { 
      success: true, 
      message: '비밀번호 재설정 이메일이 전송되었습니다.' 
    };
  } catch (error: any) {
    console.error('비밀번호 재설정 오류:', error);
    return { 
      success: false, 
      error: getAuthErrorMessage(error.code) 
    };
  }
};

// Firestore에서 사용자 데이터 가져오기
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('사용자 데이터 조회 오류:', error);
    return null;
  }
};

// Firebase 에러 메시지 한국어 변환
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return '등록되지 않은 이메일입니다.';
    case 'auth/wrong-password':
      return '비밀번호가 올바르지 않습니다.';
    case 'auth/email-already-in-use':
      return '이미 사용 중인 이메일입니다.';
    case 'auth/weak-password':
      return '비밀번호가 너무 약합니다. 6자 이상 입력해주세요.';
    case 'auth/invalid-email':
      return '올바르지 않은 이메일 형식입니다.';
    case 'auth/user-disabled':
      return '비활성화된 계정입니다.';
    case 'auth/too-many-requests':
      return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';
    case 'auth/network-request-failed':
      return '네트워크 연결을 확인해주세요.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
};
