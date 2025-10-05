import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

/**
 * therapist-registrations-feed의 isVerified를 users 컬렉션 기준으로 동기화
 */
export async function POST() {
  try {
    // 1. 모든 therapist-registrations-feed 문서 가져오기
    const feedSnapshot = await adminDb.collection('therapist-registrations-feed').get();
    
    let updated = 0;
    let skipped = 0;
    
    for (const feedDoc of feedSnapshot.docs) {
      const feedData = feedDoc.data();
      const userId = feedData.userId || feedData.authorId;
      
      if (!userId) {
        console.log(`⚠️ userId 없음: ${feedDoc.id}`);
        skipped++;
        continue;
      }
      
      // 2. users 컬렉션에서 실제 isVerified 값 가져오기
      const userDoc = await adminDb.collection('users').doc(userId).get();
      const userData = userDoc.data();
      const actualIsVerified = userData?.isVerified === true;
      
      // 3. feed의 isVerified가 실제 값과 다르면 업데이트
      if (feedData.isVerified !== actualIsVerified) {
        await adminDb.collection('therapist-registrations-feed').doc(feedDoc.id).update({
          isVerified: actualIsVerified,
          updatedAt: new Date()
        });
        
        console.log(`✅ 업데이트: ${feedData.name || feedDoc.id} - isVerified: ${feedData.isVerified} → ${actualIsVerified}`);
        updated++;
      } else {
        skipped++;
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `동기화 완료: ${updated}개 업데이트, ${skipped}개 스킵`,
      updated,
      skipped,
      total: feedSnapshot.docs.length
    });
    
  } catch (error) {
    console.error('❌ 동기화 실패:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
