import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";

export const signUpWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("サインアップ成功:", user);
    return user;
  } catch (error) {
    console.error("サインアップエラー:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Googleログイン成功:", user);
    return user;
  } catch (error) {
    console.error("Googleログインエラー:", error);
    throw error;
  }
};

export const logout = () => {
  return signOut(auth);
};
