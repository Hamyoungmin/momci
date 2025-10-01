# Firebase Functions - 비디오 자동 변환

## 개요
사용자가 업로드한 비디오를 자동으로 웹 호환 MP4(H.264) 형식으로 변환하는 Firebase Cloud Functions입니다.

## 작동 방식
1. **사용자**: 원본 비디오 파일을 Storage에 업로드
2. **Firebase Functions**: Storage 트리거가 자동 실행
3. **서버**: FFmpeg로 웹 호환 MP4로 변환 (백그라운드)
4. **결과**: `{원본파일명}_converted.mp4` 파일이 같은 폴더에 생성
5. **사용자**: 변환된 파일로 비디오 재생

## 비용 모델
- ✅ **1회 업로드 = 1회 변환 비용**
- ✅ 시청 시: 변환 비용 없음 (Storage 다운로드 비용만)
- 💡 원본 파일 삭제 시 Storage 비용 절약 가능

## 설치 방법

### 1. Firebase Functions 패키지 설치
```bash
cd functions
npm install
```

### 2. Firebase CLI 설치 (없는 경우)
```bash
npm install -g firebase-tools
```

### 3. Firebase 로그인
```bash
firebase login
```

### 4. Firebase 프로젝트 연결 확인
```bash
firebase use
# 현재: momci-51882
```

### 5. Functions 배포
```bash
# functions 폴더에서 실행
firebase deploy --only functions
```

## 환경 설정

### Firebase 프로젝트 설정
- **프로젝트 ID**: `momci-51882`
- **리전**: `asia-northeast3` (서울)
- **메모리**: 2GB (비디오 처리용)
- **타임아웃**: 540초 (9분)

### 변환 설정
- **비디오 코덱**: libx264 (H.264)
- **오디오 코덱**: AAC
- **프로필**: main (최대 호환성)
- **픽셀 포맷**: yuv420p
- **CRF**: 23 (고품질)

## 모니터링

### Firebase Console에서 확인
1. Firebase Console → Functions 탭
2. 로그 확인: `firebase functions:log`
3. 실시간 로그: `firebase functions:log --only convertVideoToWebFormat`

### 로그 예시
```
Starting video conversion for: /therapist-registrations/{userId}/{regId}/introVideo/video.mov
Downloaded original video to: /tmp/video.mov
FFmpeg command: ...
Processing: 50% done
FFmpeg conversion completed
Uploaded converted video to: /therapist-registrations/{userId}/{regId}/introVideo/video_converted.mp4
Made converted file public
Cleaned up temporary files
```

## 비용 예상 (참고)

### Cloud Functions 비용
- **무료 할당량** (매월):
  - 호출 횟수: 2백만회
  - GB-초: 400,000
  - CPU-초: 200,000
  - 아웃바운드: 5GB

### 예상 비용 (무료 할당량 초과 시)
- 10초 비디오 변환: 약 20-30초 소요 (2GB 메모리)
- GB-초 계산: 2GB × 30초 = 60 GB-초
- 100개 비디오 변환: 6,000 GB-초 (무료 범위 내)

### Storage 비용
- 저장: $0.026/GB/월
- 다운로드: $0.12/GB
- 💡 원본 파일 삭제하면 저장 비용 50% 절약

## 문제 해결

### Functions 배포 실패
```bash
# TypeScript 빌드 확인
cd functions
npm run build

# 로그 확인
firebase functions:log
```

### 변환 실패
1. Firebase Console → Functions → convertVideoToWebFormat → 로그 확인
2. 원본 비디오 형식 확인 (MP4, MOV, AVI 등 지원)
3. 타임아웃 설정 확인 (큰 파일은 9분 이상 걸릴 수 있음)

### 변환된 파일이 보이지 않음
1. Storage Rules 확인 (읽기 권한)
2. 파일명 확인: `{원본파일명}_converted.mp4`
3. 클라이언트 코드에서 `_converted.mp4` 파일 URL 사용

## 추가 최적화

### 원본 파일 자동 삭제 (선택사항)
`functions/src/index.ts` 파일의 주석 제거:
```typescript
// 5. 원본 파일 삭제 (선택사항 - Storage 비용 절약)
await bucket.file(filePath!).delete();
console.log('Deleted original file:', filePath);
```

### 변환 품질 조정
CRF 값 변경 (낮을수록 고품질, 높을수록 저용량):
- CRF 18: 거의 무손실 (큰 파일)
- CRF 23: 고품질 (권장) ✅
- CRF 28: 중간 품질
- CRF 32: 낮은 품질 (작은 파일)

## 지원
문제가 있을 경우:
1. Firebase Console → Functions 로그 확인
2. `firebase functions:log` 명령어로 에러 확인
3. GitHub Issues 등록


