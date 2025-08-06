"use client"

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { Box, Typography, Button, Stack, Switch, FormControlLabel, Slider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ProgressStepper } from './components/easy/ProgressStepper';
import theme from './theme/theme';

const createEmotionCache = () => {
  return createCache({
    key: "mui",
    prepend: true,
  });
};

const emotionCache = createEmotionCache();

const DemoContainer = styled(Box)(() => ({
  padding: '20px',
  backgroundColor: '#f5f5f5',
  minHeight: '100vh'
}));

const ControlPanel = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
}));

const DemoSection = styled(Box)(() => ({
  marginBottom: 40
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main
}));

const App: React.FC = () => {
  const [controlledStep, setControlledStep] = useState(1);
  const [autoProgress, setAutoProgress] = useState(false);
  const [autoProgressDelay, setAutoProgressDelay] = useState(2000);

  const handleStepChange = (step: number) => {
    console.log('Step changed to:', step);
  };

  const handleComplete = () => {
    console.log('Progress completed!');
  };

  const customSteps = [
    {
      id: 1,
      title: 'カスタム1',
      subtitle: 'カスタムステップ1',
      buttonText: '開始'
    },
    {
      id: 2,
      title: 'カスタム2',
      subtitle: 'カスタムステップ2',
      image: '/images/game-icon.png'
    },
    {
      id: 3,
      title: 'カスタム3',
      subtitle: 'カスタムステップ3',
      image: '/images/plan-card.png'
    }
  ];

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <DemoContainer>
          <Typography variant="h1" sx={{ mb: 4, textAlign: 'center' }}>
            ProgressStepper デモ
          </Typography>

          <ControlPanel>
            <Typography variant="h6" sx={{ mb: 2 }}>
              コントロールパネル
            </Typography>
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoProgress}
                    onChange={(e) => setAutoProgress(e.target.checked)}
                  />
                }
                label="自動進行"
              />
              
              <Box>
                <Typography gutterBottom>
                  自動進行の遅延時間: {autoProgressDelay}ms
                </Typography>
                <Slider
                  value={autoProgressDelay}
                  onChange={(_, value) => setAutoProgressDelay(value as number)}
                  min={500}
                  max={5000}
                  step={500}
                  disabled={!autoProgress}
                />
              </Box>

              <Box>
                <Typography gutterBottom>
                  手動制御ステップ: {controlledStep}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button 
                    onClick={() => setControlledStep(Math.max(1, controlledStep - 1))}
                    disabled={controlledStep <= 1}
                  >
                    前へ
                  </Button>
                  <Button 
                    onClick={() => setControlledStep(Math.min(4, controlledStep + 1))}
                    disabled={controlledStep >= 4}
                  >
                    次へ
                  </Button>
                  <Button onClick={() => setControlledStep(1)}>
                    リセット
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </ControlPanel>

          <DemoSection>
            <SectionTitle>1. デフォルトのProgressStepper（内部状態管理）</SectionTitle>
            <ProgressStepper 
              onStepChange={handleStepChange}
              onComplete={handleComplete}
            />
          </DemoSection>

          <DemoSection>
            <SectionTitle>2. 外部制御のProgressStepper</SectionTitle>
            <ProgressStepper 
              currentStep={controlledStep}
              onStepChange={handleStepChange}
              onComplete={handleComplete}
            />
          </DemoSection>

          <DemoSection>
            <SectionTitle>3. 自動進行のProgressStepper</SectionTitle>
            <ProgressStepper 
              autoProgress={autoProgress}
              autoProgressDelay={autoProgressDelay}
              onStepChange={handleStepChange}
              onComplete={handleComplete}
            />
          </DemoSection>

          <DemoSection>
            <SectionTitle>4. カスタムステップのProgressStepper</SectionTitle>
            <ProgressStepper 
              steps={customSteps}
              onStepChange={handleStepChange}
              onComplete={handleComplete}
            />
          </DemoSection>
        </DemoContainer>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;