import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const signInWithGoogle = async () => {
  const auth = getAuth();
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
