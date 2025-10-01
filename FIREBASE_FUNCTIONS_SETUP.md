# 🚀 Firebase Functions 비디오 변환 설치 가이드

## ✅ 완료된 작업

1. ✅ Firebase Functions 프로젝트 구조 생성 (`functions/` 폴더)
2. ✅ 비디오 자동 변환 Function 작성 (`convertVideoToWebFormat`)
3. ✅ 클라이언트 코드 수정 (FFmpeg 제거, 서버 변환으로 전환)
4. ✅ `firebase.json` 설정 완료

## 📋 다음 단계 (실행 필요)

### 1️⃣ Firebase Functions 패키지 설치

```bash
cd functions
npm install
```

**설치되는 패키지:**
- `firebase-functions`: Cloud Functions SDK
- `firebase-admin`: Firebase Admin SDK
- `fluent-ffmpeg`: FFmpeg 래퍼
- `@ffmpeg-installer/ffmpeg`: FFmpeg 바이너리
- `@google-cloud/storage`: Storage 관리

### 2️⃣ Firebase Blaze 플랜 확인

Firebase Functions를 사용하려면 **Blaze (종량제) 플랜**이 필요합니다.

**확인 방법:**
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택: `momci-51882`
3. 좌측 하단 ⚙️ → "사용량 및 결제" → "세부정보"
4. 현재 플랜 확인

**무료 할당량 (매월):**
- 함수 호출: 2백만회
- GB-초: 400,000
- CPU-초: 200,000
- 아웃바운드 네트워크: 5GB

→ 대부분의 경우 무료 범위 내에서 사용 가능! 💰

### 3️⃣ Firebase CLI 설치 및 로그인

```bash
# Firebase CLI 설치 (전역)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 확인
firebase use
# 출력: momci-51882 (current)
```

### 4️⃣ Functions 빌드 테스트

```bash
cd functions
npm run build
```

**성공 시:** `lib/` 폴더에 JavaScript 파일 생성됨

### 5️⃣ Functions 배포

```bash
# 루트 디렉토리에서 실행
firebase deploy --only functions

# 또는 특정 함수만 배포
firebase deploy --only functions:convertVideoToWebFormat
```

**배포 진행 과정:**
1. TypeScript → JavaScript 컴파일
2. 코드 업로드
3. 서울 리전(asia-northeast3)에 배포
4. 완료 메시지 및 Function URL 표시

**예상 배포 시간:** 2-5분

### 6️⃣ 배포 확인

```bash
# Functions 목록 확인
firebase functions:list

# 실시간 로그 확인
firebase functions:log --only convertVideoToWebFormat
```

**Firebase Console에서 확인:**
1. Firebase Console → Functions 탭
2. `convertVideoToWebFormat` 함수 확인
3. 리전: asia-northeast3
4. 상태: 활성

## 🎯 작동 방식

### 📤 사용자 측 (클라이언트)
```
1. 사용자가 비디오 파일 선택
2. 원본 파일을 Storage에 업로드
   예: /therapist-registrations/{userId}/{regId}/introVideo/video.mov
3. 업로드 완료 (즉시 반환)
```

### ⚙️ 서버 측 (Firebase Functions)
```
1. Storage 트리거 자동 실행
2. FFmpeg로 웹 호환 MP4로 변환 (백그라운드)
   - 비디오: H.264
   - 오디오: AAC
   - 최적화: faststart
3. 변환 완료 파일 저장
   예: /therapist-registrations/{userId}/{regId}/introVideo/video_converted.mp4
4. 파일 공개 설정
```

### 👀 재생 시
```
1. 클라이언트가 _converted.mp4 파일 URL 요청
2. 웹 호환 형식으로 모든 브라우저에서 재생 가능 ✅
```

## 💰 비용 FAQ

### Q: 한 번 업로드할 때마다 비용이 발생하나요?
**A:** 네, **업로드 시 1회만** 변환 비용이 발생합니다.

### Q: 시청할 때마다 비용이 발생하나요?
**A:** 아니요! 시청 시에는 **변환 비용 없고** Storage 다운로드 비용만 발생합니다.

### Q: 무료 범위 내에서 얼마나 사용 가능한가요?
**A:** 
- 10초 비디오: 약 30초 변환 시간
- 무료 할당량: 400,000 GB-초
- 예상: **월 6,000개 이상** 비디오 변환 가능 (2GB 메모리 기준)

### Q: 원본 파일을 삭제하면 어떻게 되나요?
**A:** Storage 비용이 **50% 절약**됩니다! (원본 + 변환본 → 변환본만)
- 원본 자동 삭제는 `functions/src/index.ts`의 주석 제거로 활성화 가능

## 🧪 테스트 방법

### 1. 비디오 업로드 테스트
1. 웹사이트에서 치료사 등록
2. 자기소개 비디오 업로드
3. Firebase Console → Storage 확인
   - 원본 파일: `video.mov`
   - 변환 파일 (1-2분 후): `video_converted.mp4`

### 2. 로그 확인
```bash
firebase functions:log --only convertVideoToWebFormat
```

**성공 로그 예시:**
```
Starting video conversion for: /therapist-registrations/.../video.mov
Downloaded original video to: /tmp/video.mov
Processing: 50% done
FFmpeg conversion completed
Uploaded converted video to: .../video_converted.mp4
```

### 3. 재생 테스트
1. 상세 보기 모달에서 비디오 확인
2. 모든 브라우저에서 정상 재생 확인 ✅

## 🔧 문제 해결

### 배포 오류: "Firebase CLI 버전이 낮음"
```bash
npm install -g firebase-tools@latest
```

### 배포 오류: "권한 없음"
```bash
firebase login --reauth
```

### 함수 실행 오류: "FFmpeg not found"
→ `@ffmpeg-installer/ffmpeg` 패키지가 자동으로 FFmpeg 바이너리 제공
→ 배포 시 자동 포함됨

### 변환 시간이 너무 오래 걸림
1. 타임아웃 설정 확인: 현재 540초 (9분)
2. 큰 파일(>100MB)의 경우 정상적으로 시간 소요
3. 필요시 메모리 증가: `memory: '4GB'`

## 📞 지원

문제가 있을 경우:
1. `firebase functions:log` 로그 확인
2. Firebase Console → Functions 대시보드 확인
3. `functions/README.md` 참고

## ✨ 다음 최적화 (선택사항)

### 1. 원본 파일 자동 삭제
`functions/src/index.ts` (95줄 근처) 주석 제거:
```typescript
await bucket.file(filePath!).delete();
```

### 2. 변환 알림 (Firestore 업데이트)
변환 완료 시 Firestore에 상태 저장:
```typescript
await adminDb.collection('therapist-registrations').doc(regId).update({
  videoConversionStatus: 'completed',
  convertedVideoUrl: convertedFileUrl
});
```

### 3. 썸네일 생성
변환과 함께 비디오 썸네일 이미지 생성

---

**준비 완료!** 🎉 이제 위 단계를 실행하세요!

