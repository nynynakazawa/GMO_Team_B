// src/firebase/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage';

// Firebase構成情報（.envから読み込み）
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// ✅ 複数回 initializeApp を防ぐために getApps() を確認
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()


// クライアント限定で Analytics 初期化（オプション）
if (typeof window !== 'undefined') {
  try {
    getAnalytics(app)
  } catch (err) {
    console.log('Analytics 初期化スキップ:', err)
  }
}

const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const storage = getStorage(app);

export { auth, provider, storage };
