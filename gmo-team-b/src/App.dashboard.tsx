import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Dashboard } from './components/easy/Dashboard';
import { mockRootProps } from './data/dashboardMockData';
import theme from './theme/theme';

const createEmotionCache = () => {
  return createCache({
    key: "mui",
    prepend: true,
  });
};

const emotionCache = createEmotionCache();

const App: React.FC = () => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dashboard {...mockRootProps} />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;