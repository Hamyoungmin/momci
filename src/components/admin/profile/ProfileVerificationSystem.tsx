'use client';

import { useState, useEffect } from 'react';
import ProfileReviewQueue from './ProfileReviewQueue';
import ProfileDetailReview from './ProfileDetailReview';
import { incrementTeacherCount } from '@/lib/statistics';
import { collection, onSnapshot, query, orderBy, updateDoc, doc, serverTimestamp, getDoc, setDoc, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileSubmission {
  id: string;
  teacherId: string;
  teacherName: string;
  email: string;
  phone: string;
  submitDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'hold';
  specialties: string[];
  experience: number;
  education: string;
  certifications: string[];
  documents: {
    diploma: string;
    certificate: string;
    career: string;
    license: string;
  };
  profilePhoto: string;
  selfIntroduction: string;
  teachingPhilosophy: string;
  priority: 'high' | 'medium' | 'low';
}

export default function ProfileVerificationSystem() {
  const { currentUser } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState<ProfileSubmission | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const [profiles, setProfiles] = useState<ProfileSubmission[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실시간: 치료사 신청서(therapist-registrations) 대기열 구독
    // pending/hold/approved/rejected 모두 표시하되 기본 정렬은 최근 수정일 내림차순
    const q = query(
      collection(db, 'therapist-registrations'),
      // 상태별 필터가 필요하면 where('status', '==', 'pending')로 축소 가능
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ProfileSubmission[] = snapshot.docs.map((d) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = d.data();

        // 경험 필드는 신청서에서 문자열 라벨일 수 있으므로 숫자로 최대한 변환 (실패 시 0)
        const normalizeExperience = (value: unknown): number => {
          if (typeof value === 'number') return value;
          if (typeof value === 'string') {
            const matched = value.match(/\d+/);
            return matched ? Number(matched[0]) : 0;
          }
          return 0;
        };

        const toIsoString = (value: unknown): string => {
          try {
            // Firestore Timestamp 호환
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (value && typeof (value as any).toDate === 'function') {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return new Date((value as any).toDate()).toISOString();
            }
            if (typeof value === 'number' || typeof value === 'string') {
              return new Date(value as number).toISOString();
            }
          } catch {
            /* ignore */
          }
          return new Date().toISOString();
        };

        const mapped: ProfileSubmission = {
          id: d.id,
          teacherId: data.userId || '',
          teacherName: data.name || data.teacherName || '이름 없음',
          email: data.email || '',
          phone: data.phone || '',
          submitDate: toIsoString(data.createdAt),
          status: (data.status as ProfileSubmission['status']) || 'pending',
          specialties: Array.isArray(data.specialties) ? data.specialties : [],
          experience: normalizeExperience(data.experience),
          education: data.education || '',
          certifications: Array.isArray(data.certifications) ? data.certifications : [],
          documents: {
            diploma: data.documents?.diploma || '',
            certificate: data.documents?.certificate || '',
            career: data.documents?.career || '',
            license: data.documents?.license || ''
          },
          profilePhoto: data.profilePhoto || '',
          selfIntroduction: data.selfIntroduction || data.introduction || '',
          teachingPhilosophy: data.teachingPhilosophy || data.philosophy || '',
          priority: (data.priority as ProfileSubmission['priority']) || 'medium'
        };

        return mapped;
      });

      setProfiles(list);
    }, (error) => {
      console.error('프로필 검증 대기열 구독 실패:', error);
      setProfiles([]);
    });

    return () => unsubscribe();
  }, []);

  const handleProfileSelect = (profile: ProfileSubmission) => {
    setSelectedProfile(profile);
    setIsDetailViewOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailViewOpen(false);
    setSelectedProfile(null);
  };

  const handleProfileAction = async (profileId: string, action: 'approve' | 'reject' | 'hold', reason?: string) => {
    try {
      console.log('Profile action:', { profileId, action, reason });
      const statusMap: Record<'approve' | 'reject' | 'hold', 'approved' | 'rejected' | 'hold'> = {
        approve: 'approved',
        reject: 'rejected',
        hold: 'hold'
      };
      const newStatus = statusMap[action];
      
      // 치료사 프로필이 승인될 때 치료사 카운트 증가
      if (action === 'approve') {
        try {
          await incrementTeacherCount();
          console.log('치료사 프로필 승인으로 치료사 수가 증가했습니다.');
        } catch (statsError) {
          console.warn('치료사 카운트 증가 실패:', statsError);
        }
      }
      
      // Firestore: 신청서 상태 업데이트 (관리자 전용 필드 포함)
      const regRef = doc(db, 'therapist-registrations', profileId);
      await updateDoc(regRef, {
        status: newStatus,
        reviewedAt: serverTimestamp(),
        reviewerId: currentUser?.uid || null,
        reviewReason: reason || null,
        updatedAt: serverTimestamp()
      }).catch((e) => { console.error('[권한체크] therapist-registrations update 실패:', profileId, e); throw e; });

      // Firestore: 해당 사용자 프로필 상태 동기화(users/{uid}.profileStatus)
      // 신청서 문서 아이디 == 사용자 아이디가 아닐 수 있으므로, 목록에서 매핑된 profile을 찾아 teacherId를 사용
      const target = profiles.find((p) => p.id === profileId);
      if (target?.teacherId) {
        const userRef = doc(db, 'users', target.teacherId);
        await updateDoc(userRef, {
          profileStatus: newStatus,
          profileReviewedAt: serverTimestamp(),
          profileReviewerId: currentUser?.uid || null
        }).catch((e) => { console.error('[권한체크] users update 실패:', target.teacherId, e); throw e; });

        // Firestore: therapistProfiles 업서트/상태 갱신
        const profileRef = doc(db, 'therapistProfiles', target.teacherId);
        if (action === 'approve') {
          // 신청서 원본을 불러와 가능한 한 동일 필드로 반영
          const regSnap = await getDoc(regRef);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const regData: any = regSnap.exists() ? regSnap.data() : {};

          await setDoc(profileRef, {
            userId: target.teacherId,
            name: target.teacherName,
            email: target.email || regData.email || '',
            phone: target.phone || regData.phone || '',
            specialties: target.specialties || regData.specialties || [],
            education: target.education || regData.education || '',
            experience: target.experience ?? 0,
            profileImage: regData.profilePhoto || '',
            introduction: target.selfIntroduction || regData.selfIntroduction || '',
            philosophy: target.teachingPhilosophy || regData.teachingPhilosophy || '',
            status: 'approved',
            isPublished: regData.isPublished === true ? true : false, // 최초 승인 시 기본 false, 기존값 유지
            createdAt: regData.createdAt || serverTimestamp(),
            updatedAt: serverTimestamp(),
          }, { merge: true }).catch((e) => { console.error('[권한체크] therapistProfiles upsert 실패:', target.teacherId, e); throw e; });

          // 공개 피드 상태/요약 갱신(치료사 전체 가시용)
          try {
            await setDoc(doc(db, 'therapist-registrations-feed', profileId), {
              userId: target.teacherId,
              name: target.teacherName || regData.name || '',
              gender: regData.gender || '',
              region: regData.region || '',
              specialty: (target.specialties && target.specialties[0]) || (Array.isArray(regData.specialties) ? regData.specialties[0] : ''),
              experience: regData.experience || 0,
              hourlyRate: regData.hourlyRate || '',
              // 상세 공개 필드(민감 제외)
              therapyActivity: regData.therapyActivity || '',
              mainSpecialty: regData.mainSpecialty || '',
              educationCareer: regData.educationCareer || '',
              certifications: regData.certifications || '',
              availableDays: regData.availableDays || [],
              availableTime: regData.availableTime || '',
              status: newStatus,
              updatedAt: serverTimestamp()
            }, { merge: true }).catch((e) => { console.error('[권한체크] registrations-feed upsert 실패:', profileId, e); throw e; });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('피드 갱신 실패(무시 가능):', e);
          }

          // 둘러보기 카드 자동 갱신: 이미 존재하는 teacher-offer 게시글만 최신 신청서 값으로 덮어쓰기 (없으면 건너뜀)
          try {
            const existingQ = query(
              collection(db, 'posts'),
              where('authorId', '==', target.teacherId),
              where('type', '==', 'teacher-offer'),
              limit(1)
            );
            const existingSnap = await getDocs(existingQ);
            if (!existingSnap.empty) {
              // 카드 요약 필드 구성: 신청서 우선, 없으면 프로필 보강
              const region = regData.treatmentRegion || regData.region || '';
              const treatment = Array.isArray(regData.specialties) && regData.specialties.length > 0
                ? regData.specialties[0]
                : (regData.specialty || '치료사');
              const price = regData.hourlyRate || '';
              const timeDetails = regData.availableTime || '';
              const additionalInfo = regData.therapyActivity || regData.mainSpecialty || '';
              const title = (target.teacherName || regData.name || '치료사');

              await updateDoc(existingSnap.docs[0].ref, {
                treatment,
                region: region || '',
                timeDetails: String(timeDetails || ''),
                price: String(price || ''),
                additionalInfo: String(additionalInfo || ''),
                title: String(title || ''),
                category: region || '',
                updatedAt: serverTimestamp(),
              });
            }
          } catch (e) {
            console.warn('둘러보기 카드 자동 갱신 실패(무시 가능):', e);
          }
        } else {
          // 반려/보류: 상태만 갱신, 문서가 없으면 생성하지 않음
          await updateDoc(profileRef, {
            status: newStatus,
            updatedAt: serverTimestamp(),
          }).catch(() => {
            // 문서 없을 수 있음: 무시
          });

          // 공개 피드 상태만 동기화
          try {
            await setDoc(doc(db, 'therapist-registrations-feed', profileId), {
              status: newStatus,
              updatedAt: serverTimestamp()
            }, { merge: true });
          } catch {}
        }
      }
      
      setIsDetailViewOpen(false);
      setSelectedProfile(null);
    } catch (error) {
      console.error('프로필 액션 처리 실패:', error);
      // 에러 처리 (토스트 메시지 등)
    }
  };

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">프로필 검증 시스템</h1>
            <p className="text-gray-600 mt-1">치료사 프로필을 검토하고 승인 상태를 관리하세요</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{profiles.filter(p => p.status === 'pending').length}</div>
              <div className="text-sm text-gray-500">검토 대기</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{profiles.filter(p => p.status === 'approved').length}</div>
              <div className="text-sm text-gray-500">승인 완료</div>
            </div>
          </div>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">검토 대기</p>
            <div className="flex items-baseline space-x-1">
              <p className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                {profiles.filter(p => p.status === 'pending').length}
              </p>
              <span className="text-sm font-medium text-gray-600">건</span>
            </div>
            {profiles.filter(p => p.status === 'pending').length > 0 && (
              <div className="mt-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse inline-block mr-2"></div>
                <span className="text-xs text-orange-600 font-medium">처리 필요</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">승인 완료</p>
            <div className="flex items-baseline space-x-1">
              <p className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                {profiles.filter(p => p.status === 'approved').length}
              </p>
              <span className="text-sm font-medium text-gray-600">건</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">반려</p>
            <div className="flex items-baseline space-x-1">
              <p className="text-2xl font-bold text-red-600 group-hover:text-red-700 transition-colors">
                {profiles.filter(p => p.status === 'rejected').length}
              </p>
              <span className="text-sm font-medium text-gray-600">건</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">보류</p>
            <div className="flex items-baseline space-x-1">
              <p className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                {profiles.filter(p => p.status === 'hold').length}
              </p>
              <span className="text-sm font-medium text-gray-600">건</span>
            </div>
          </div>
        </div>
      </div>

      {/* 검토 대기열 */}
      <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">프로필 검토 대기열</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white rounded-lg border border-indigo-200 shadow-sm">
                <span className="text-sm font-semibold text-gray-700">총 </span>
                <span className="text-lg font-bold text-indigo-600">{profiles.length}</span>
                <span className="text-sm font-semibold text-gray-700">건</span>
              </div>
            </div>
          </div>
        </div>
        <ProfileReviewQueue
          profiles={profiles}
          onProfileSelect={handleProfileSelect}
        />
      </div>

      {/* 상세 검토 모달 */}
      {selectedProfile && (
        <ProfileDetailReview
          isOpen={isDetailViewOpen}
          onClose={handleCloseDetail}
          profile={selectedProfile}
          onAction={handleProfileAction}
        />
      )}
    </div>
  );
}
