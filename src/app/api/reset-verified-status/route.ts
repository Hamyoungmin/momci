import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

/**
 * ✅ 모든 치료사의 isVerified를 초기화하고, 실제 조건 충족자만 다시 인증
 * 조건: 매칭 3회 이상 AND 후기 2개 이상 AND 평균 별점 4.5 이상
 */
export async function POST() {
  try {
    console.log('🔄 isVerified 상태 재설정 시작...');
    
    // 1. 모든 치료사 users 문서 가져오기
    const usersSnapshot = await adminDb.collection('users').where('userType', '==', 'therapist').get();
    
    let totalUsers = 0;
    let verified = 0;
    let unverified = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      totalUsers++;
      const userId = userDoc.id;
      const userData = userDoc.data();
      
      // 조건 검증
      const totalMatches = userData?.totalMatches || 0;
      const reviewCount = userData?.reviewCount || 0;
      const rating = userData?.rating || 0;
      
      const meetsCondition = totalMatches >= 3 && reviewCount >= 2 && rating >= 4.5;
      
      // users 컬렉션 업데이트
      await adminDb.collection('users').doc(userId).update({
        isVerified: meetsCondition,
        certificationBadge: meetsCondition ? 'certified' : 'regular',
        verifiedAt: meetsCondition ? new Date() : null,
        updatedAt: new Date()
      });
      
      // therapistProfiles 컬렉션 업데이트
      const profilesSnapshot = await adminDb.collection('therapistProfiles').where('userId', '==', userId).get();
      for (const profileDoc of profilesSnapshot.docs) {
        await profileDoc.ref.update({
          isVerified: meetsCondition,
          verifiedAt: meetsCondition ? new Date() : null,
          updatedAt: new Date()
        });
      }
      
      // therapist-registrations-feed 컬렉션 업데이트
      const feedSnapshot = await adminDb.collection('therapist-registrations-feed').where('userId', '==', userId).get();
      for (const feedDoc of feedSnapshot.docs) {
        await feedDoc.ref.update({
          isVerified: meetsCondition,
          verifiedAt: meetsCondition ? new Date() : null,
          updatedAt: new Date()
        });
      }
      
      if (meetsCondition) {
        verified++;
        console.log(`✅ 인증 부여: ${userData.name} (매칭 ${totalMatches}, 후기 ${reviewCount}, 별점 ${rating})`);
      } else {
        unverified++;
        console.log(`❌ 인증 제거: ${userData.name} (매칭 ${totalMatches}, 후기 ${reviewCount}, 별점 ${rating})`);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `재설정 완료: 총 ${totalUsers}명 중 ${verified}명 인증, ${unverified}명 미인증`,
      totalUsers,
      verified,
      unverified
    });
    
  } catch (error) {
    console.error('❌ 재설정 실패:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
