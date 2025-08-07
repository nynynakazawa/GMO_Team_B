// src/firebase/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from "firebase/firestore";

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

const db = getFirestore(app);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

// Googleでサインイン
export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (e: any) {
    if (e.code === 'auth/popup-closed-by-user') {
      // 何もしない or ユーザーに「キャンセルされました」と表示
      return;
    }
    // それ以外のエラーは通常通り処理
    alert('Googleログインに失敗しました');
  }
}

export { auth, provider, db }
