"use client";

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { AuthenticationPage } from './components/AuthenticationPage';
import { mockRootProps } from './authMockData';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthenticationPage {...mockRootProps} />
    </ThemeProvider>
  );
};

export default App;