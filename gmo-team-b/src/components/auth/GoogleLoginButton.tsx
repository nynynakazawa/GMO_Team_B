// GoogleLoginButton.tsx
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/firebase";

const GoogleLoginButton = () => {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("ログイン成功:", user);
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  };

  return <button onClick={handleLogin}>Googleでログイン</button>;
};

export default GoogleLoginButton;
