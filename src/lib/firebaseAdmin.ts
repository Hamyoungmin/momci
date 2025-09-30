import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Admin 초기화 (서비스 계정 최소 권한 사용 권장)
// 환경변수 두 가지 방식을 지원: 단일 JSON(FIREBASE_ADMIN_CREDENTIALS) 또는 분리형
function sanitizePrivateKey(key: string): string {
  let sanitized = key.trim();
  // Remove accidental surrounding quotes (common in env UIs)
  if ((sanitized.startsWith('"') && sanitized.endsWith('"')) || (sanitized.startsWith("'") && sanitized.endsWith("'"))) {
    sanitized = sanitized.slice(1, -1);
  }
  // Normalize newlines for different inputs: "\\n", "\\r\\n", actual CRLF
  sanitized = sanitized.replace(/\\r\\n/g, '\n');
  sanitized = sanitized.replace(/\\n/g, '\n');
  sanitized = sanitized.replace(/\r\n/g, '\n');
  return sanitized;
}

function createAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const credentialsJson = process.env.FIREBASE_ADMIN_CREDENTIALS;

  let projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  let clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    if (credentialsJson) {
      try {
        const parsed = JSON.parse(credentialsJson);
        projectId = projectId || parsed.project_id;
        clientEmail = clientEmail || parsed.client_email;
        privateKey = privateKey || parsed.private_key;
      } catch {
        throw new Error('Invalid FIREBASE_ADMIN_CREDENTIALS JSON');
      }
    }
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin credentials');
  }

  // Normalize key format for various deployment envs
  privateKey = sanitizePrivateKey(privateKey);

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    projectId,
  });
}

const adminApp = createAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);


