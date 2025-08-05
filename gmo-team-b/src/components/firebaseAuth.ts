import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";

export const signUpWithEmailAndPassword = async (email: string, password: string) => {
  const auth = getAuth();
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
