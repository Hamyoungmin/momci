'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { getUserData, UserData } from '@/lib/auth';
import { doc, onSnapshot } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
  logout: async () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userDocUnsub: (() => void) | null = null;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // 실시간 구독으로 역할/프로필 변경을 즉시 반영
        if (userDocUnsub) {
          userDocUnsub();
          userDocUnsub = null;
        }
        try {
          userDocUnsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
            if (snap.exists()) {
              setUserData(snap.data() as UserData);
            } else {
              // 문서가 없을 경우 1회성 조회로 보조
              void getUserData(user.uid).then((data) => setUserData(data));
            }
            setLoading(false);
          }, (err) => {
            console.warn('사용자 문서 실시간 구독 실패:', err);
            setLoading(false);
          });
        } catch (error) {
          console.warn('사용자 데이터 구독 설정 실패, 단건 조회로 대체:', error);
          try {
            const data = await getUserData(user.uid);
            setUserData(data);
          } catch {
            setUserData(null);
          }
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      if (userDocUnsub) userDocUnsub();
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setUserData(null);
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
