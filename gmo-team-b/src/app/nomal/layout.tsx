"use client";

import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import SidebarNavigation from '../../components/nomal/SidebarNavigation';

export default function NormalLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      <SidebarNavigation />
      <main style={{ 
        flex: 1,
        width: isMobile ? '100%' : 'auto'
      }}>
        {children}
      </main>
    </div>
  );
}