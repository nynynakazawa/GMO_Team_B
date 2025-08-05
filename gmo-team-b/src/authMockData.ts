// Mock data for authentication page

// Data passed as props to the root component
export const mockRootProps = {
  onLogin: (email: string, password: string) => {
    console.log('Mock login:', { email, password });
  },
  onSignup: (email: string, password: string) => {
    console.log('Mock signup:', { email, password });
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