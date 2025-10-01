import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

// FFmpeg 경로 설정
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Firebase Admin 초기화
admin.initializeApp();

const storage = admin.storage();

/**
 * Storage에 비디오가 업로드되면 자동으로 웹 호환 MP4로 변환
 * 경로: /therapist-registrations/{userId}/{regId}/introVideo/{filename}
 */
export const convertVideoToWebFormat = functions
  .region('asia-northeast3') // 서울 리전
  .runWith({
    timeoutSeconds: 540, // 9분 (최대 변환 시간)
    memory: '2GB', // 비디오 처리에 충분한 메모리
  })
  .storage.object()
  .onFinalize(async (object: functions.storage.ObjectMetadata) => {
    const filePath = object.name;
    const contentType = object.contentType;

    // 비디오 파일만 처리
    if (!contentType || !contentType.startsWith('video/')) {
      console.log('Not a video file, skipping:', filePath);
      return null;
    }

    // 이미 변환된 파일은 재변환 방지
    if (filePath?.includes('_converted.mp4')) {
      console.log('Already converted file, skipping:', filePath);
      return null;
    }

    // introVideo 경로가 아니면 스킵
    if (!filePath?.includes('introVideo/')) {
      console.log('Not an introVideo, skipping:', filePath);
      return null;
    }

    const bucket = storage.bucket(object.bucket);
    const fileName = path.basename(filePath!);
    const fileDir = path.dirname(filePath!);
    
    // 임시 파일 경로
    const tempLocalFile = path.join(os.tmpdir(), fileName);
    const tempLocalConvertedFile = path.join(
      os.tmpdir(),
      `converted_${Date.now()}.mp4`
    );

    // 변환된 파일의 Storage 경로
    const convertedFileName = `${path.parse(fileName).name}_converted.mp4`;
    const convertedFilePath = path.join(fileDir, convertedFileName);

    try {
      console.log('Starting video conversion for:', filePath);

      // 1. 원본 파일 다운로드
      await bucket.file(filePath!).download({
        destination: tempLocalFile,
      });
      console.log('Downloaded original video to:', tempLocalFile);

      // 2. FFmpeg로 웹 호환 MP4로 변환
      await new Promise<void>((resolve, reject) => {
        ffmpeg(tempLocalFile)
          .videoCodec('libx264')
          .audioCodec('aac')
          .outputOptions([
            '-profile:v main',
            '-level 3.1',
            '-pix_fmt yuv420p',
            '-vf format=yuv420p,scale=trunc(iw/2)*2:trunc(ih/2)*2',
            '-crf 23',
            '-preset medium',
            '-tune film',
            '-b:a 128k',
            '-ar 48000',
            '-ac 2',
            '-movflags +faststart',
          ])
          .format('mp4')
          .on('start', (commandLine: string) => {
            console.log('FFmpeg command:', commandLine);
          })
          .on('progress', (progress: { percent?: number }) => {
            console.log(`Processing: ${progress.percent || 0}% done`);
          })
          .on('end', () => {
            console.log('FFmpeg conversion completed');
            resolve();
          })
          .on('error', (err: Error) => {
            console.error('FFmpeg error:', err);
            reject(err);
          })
          .save(tempLocalConvertedFile);
      });

      // 3. 변환된 파일 업로드
      await bucket.upload(tempLocalConvertedFile, {
        destination: convertedFilePath,
        metadata: {
          contentType: 'video/mp4',
          metadata: {
            originalFile: fileName,
            convertedAt: new Date().toISOString(),
          },
        },
      });
      console.log('Uploaded converted video to:', convertedFilePath);

      // 4. 변환된 파일을 공개로 설정 (필요시)
      await bucket.file(convertedFilePath).makePublic();
      console.log('Made converted file public');

      // 5. 원본 파일 삭제 (선택사항 - Storage 비용 절약)
      // await bucket.file(filePath!).delete();
      // console.log('Deleted original file:', filePath);

      return {
        success: true,
        originalFile: filePath,
        convertedFile: convertedFilePath,
      };
    } catch (error) {
      console.error('Error during video conversion:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Video conversion failed',
        error
      );
    } finally {
      // 임시 파일 정리
      try {
        if (fs.existsSync(tempLocalFile)) {
          fs.unlinkSync(tempLocalFile);
        }
        if (fs.existsSync(tempLocalConvertedFile)) {
          fs.unlinkSync(tempLocalConvertedFile);
        }
        console.log('Cleaned up temporary files');
      } catch (cleanupError) {
        console.error('Error cleaning up temporary files:', cleanupError);
      }
    }
  });

