'use client';

import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword as fbCreateUser,
  signOut,
  signInWithEmailAndPassword as fbSignInWithEmail,
} from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import type { FirebaseError } from 'firebase/app';

// サインアップ（メール・パスワード）
export const signUpWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const cred = await fbCreateUser(auth, email, password);
    console.log('サインアップ成功:', cred.user);
    return cred.user;
  } catch (e) {
    const error = e as FirebaseError;
    console.error('サインアップエラー:', error.code, error.message);
    throw error;
  }
};

// Googleログイン（ポップアップ）
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('Googleログイン成功:', result.user);
    return result.user;
  } catch (e) {
    const error = e as FirebaseError;
    console.error('Googleログインエラー:', error.code, error.message);
    // 'auth/popup-closed-by-user', 'auth/cancelled-popup-request', 'auth/popup-blocked' などを適宜ハンドリング
    throw error;
  }
};

// ログアウト
export const logout = () => signOut(auth);

// ログイン（メール・パスワード）
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const cred = await fbSignInWithEmail(auth, email, password);
    console.log('ログイン成功:', cred.user);
    return cred.user;
  } catch (e) {
    const error = e as FirebaseError;
    console.error('ログインエラー:', error.code, error.message);
    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      throw new Error('メールアドレスまたはパスワードが違います');
    }
    throw error;
  }
};
