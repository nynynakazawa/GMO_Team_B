"use client";

import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

// createページのパターンに合わせたstyled components
const MainContainer = styled(Box)(() => ({
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  overflowX: "hidden",
  width: "100%",
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: "0 24px 24px 24px",
  maxWidth: 1400,
  margin: "0 auto",
  width: "100%",
  [theme.breakpoints.down('md')]: {
    padding: "0 16px 20px 16px",
  },
  [theme.breakpoints.down('sm')]: {
    padding: "0 8px 16px 8px",
  },
}));

const FormStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  [theme.breakpoints.down('sm')]: {
    width: "100%",
  },
}));

interface AuthenticationPageProps {
  onLogin?: (email: string, password: string) => void;
  onNavigateToSignup?: () => void;
  onNavigateToLogin?: () => void;
  onForgotPassword?: () => void;
}

export const AuthenticationPage: React.FC<AuthenticationPageProps> = ({
  onLogin,
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
    <MainContainer>
      <ContentContainer>
        <FormStack spacing={{ xs: 2, md: 3 }} sx={{ mt: { xs: 1, md: 2 } }}>
          {currentView === 'login' ? (
            <LoginForm
              onLogin={handleLogin}
              onForgotPassword={handleForgotPassword}
              onCreateAccount={handleCreateAccount}
            />
          ) : (
            <SignupForm
              onLogin={handleLogin}
              onExistingAccount={handleExistingAccount}
            />
          )}
        </FormStack>
      </ContentContainer>
    </MainContainer>
  );
};