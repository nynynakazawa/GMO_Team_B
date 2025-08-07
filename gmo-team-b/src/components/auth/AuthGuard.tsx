"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // 認証状態の確認中は何もしない

    // 認証が必要なページで未認証の場合
    if (requireAuth && !isAuthenticated) {
      // 現在のパスをクエリパラメータとして保存
      const redirectPath = pathname && pathname !== '/' ? `?redirect=${encodeURIComponent(pathname)}` : '';
      router.push(`/${redirectPath}`);
      return;
    }

    // 認証済みでトップページにいる場合、リダイレクト先があれば移動
    if (isAuthenticated && pathname === '/') {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get('redirect');
      
      if (redirectPath) {
        router.push(redirectPath);
        return;
      }
      
      // リダイレクト先がない場合は、デフォルトでサーバー情報ページに移動
      router.push('/easy/serverinfo');
    }
  }, [isAuthenticated, loading, pathname, router, requireAuth]);

  // 認証状態確認中はローディング表示
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        <CircularProgress size={60} sx={{ color: '#19B8D7' }} />
      </Box>
    );
  }

  // 認証が必要なページで未認証の場合は何も表示しない（リダイレクト処理中）
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};