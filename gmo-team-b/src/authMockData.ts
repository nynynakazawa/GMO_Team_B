// Mock data for authentication page
import { auth } from './firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Data passed as props to the root component
export const mockRootProps = {
  onLogin: (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('User signed in:', user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login error:', errorCode, errorMessage);
      });
  },
  onNavigateToSignup: () => {
    console.log('Navigate to signup');
  },
  onNavigateToLogin: () => {
    console.log('Navigate to login');
  },
  onForgotPassword: () => {
    console.log('Forgot password');
  }
};