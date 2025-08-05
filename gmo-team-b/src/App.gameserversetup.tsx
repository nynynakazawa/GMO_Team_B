"use client"

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { GameServerSetup } from './components/GameServerSetup';
import { mockRootProps } from './data/gameServerSetupMockData';
import theme from './theme/theme';

const createEmotionCache = () => {
  return createCache({
    key: "mui",
    prepend: true,
  });
};

const emotionCache = createEmotionCache();

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [serverName, setServerName] = useState('');

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    setCurrentStep(2);
  };

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    setCurrentStep(3);
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setCurrentStep(4);
  };

  const handleServerNameChange = (name: string) => {
    setServerName(name);
  };

  const handleCreateServer = () => {
    console.log('Creating server:', {
      game: selectedGame,
      period: selectedPeriod,
      plan: selectedPlan,
      serverName
    });
    // Handle server creation logic here
  };

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <GameServerSetup
          currentStep={currentStep}
          selectedGame={selectedGame}
          selectedPeriod={selectedPeriod}
          selectedPlan={selectedPlan}
          serverName={serverName}
          games={mockRootProps.games}
          plans={mockRootProps.plans}
          periodOptions={mockRootProps.periodOptions}
          onGameSelect={handleGameSelect}
          onPeriodSelect={handlePeriodSelect}
          onPlanSelect={handlePlanSelect}
          onServerNameChange={handleServerNameChange}
          onCreateServer={handleCreateServer}
        />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;