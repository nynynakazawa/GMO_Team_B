"use client";

import React, { useState } from 'react';
import { Box, Stack, Container } from '@mui/material';
import { AuthHeader } from './AuthHeader';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthenticationPageProps {
  onLogin?: (email: string, password: string) => void;
  onSignup?: (email: string, password: string) => void;
  onNavigateToSignup?: () => void;
  onNavigateToLogin?: () => void;
  onForgotPassword?: () => void;
}

export const AuthenticationPage: React.FC<AuthenticationPageProps> = ({
  onLogin,
  onSignup,
  onNavigateToSignup,
  onNavigateToLogin,
  onForgotPassword
}) => {
  const [currentView, setCurrentView] = useState<'login' | 'signup'>('login');

  const handleLogin = (email: string, password: string) => {
    console.log('Login attempt:', { email, password });
    if (onLogin) {
      onLogin(email, password);
    }
  };

  const handleSignup = (email: string, password: string) => {
    console.log('Signup attempt:', { email, password });
    if (onSignup) {
      onSignup(email, password);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  const handleCreateAccount = () => {
    console.log('Create account clicked');
    setCurrentView('signup');
    if (onNavigateToSignup) {
      onNavigateToSignup();
    }
  };

  const handleExistingAccount = () => {
    console.log('Existing account clicked');
    setCurrentView('login');
    if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px'
      }}
    >
      <AuthHeader />
      <Container component="main" maxWidth="md">
        <Stack spacing={3} sx={{ mt: 4, alignItems: 'center' }}>
          {currentView === 'login' ? (
            <LoginForm
              onLogin={handleLogin}
              onForgotPassword={handleForgotPassword}
              onCreateAccount={handleCreateAccount}
            />
          ) : (
            <SignupForm
              onSignup={handleSignup}
              onExistingAccount={handleExistingAccount}
            />
          )}
        </Stack>
      </Container>
    </Box>
  );
};