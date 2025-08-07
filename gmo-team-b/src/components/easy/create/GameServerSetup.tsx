"use client";

import React from "react";
import { Box, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Header } from "../Header";
import { EasyProgressStepper } from "./EasyProgressStepper";
import { GameSelectionGrid } from "./GameSelectionGrid";
import { PeriodSelector } from "./PeriodSelector";
import { PlanSelectionGrid } from "./PlanSelectionGrid";
import { ServerConfigForm } from "./ServerConfigForm";
import { GameServerSetupProps } from "../../../types/gameServerSetup";

const MainContainer = styled(Box)(() => ({
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
}));

const ContentContainer = styled(Box)(() => ({
  padding: "0 20px 40px 20px",
  maxWidth: 1400,
  margin: "0 auto",
}));

export const GameServerSetup: React.FC<GameServerSetupProps> = ({
  currentStep,
  selectedGame,
  selectedPeriod,
  selectedPlan,
  serverName,
  password,
  games,
  plans,
  periodOptions,
  onGameSelect,
  onPeriodSelect,
  onPlanSelect,
  onServerNameChange,
  onPasswordChange,
  onCreateServer,
  loading = false,
  error = null,
  validationErrors,
}) => {
  return (
    <MainContainer>
      <Header />

      <ContentContainer>
        <EasyProgressStepper currentStep={currentStep} />

        <Stack spacing={4}>
          <GameSelectionGrid
            games={games}
            selectedGame={selectedGame}
            onGameSelect={onGameSelect}
            hasError={validationErrors?.game || false}
          />

          <PeriodSelector
            periodOptions={periodOptions}
            selectedPeriod={selectedPeriod}
            onPeriodSelect={onPeriodSelect}
            hasError={validationErrors?.period || false}
          />

          <PlanSelectionGrid
            plans={plans}
            selectedPlan={selectedPlan}
            onPlanSelect={onPlanSelect}
            loading={loading}
            error={error}
            hasError={validationErrors?.plan || false}
            selectedPeriod={selectedPeriod}
          />

          <ServerConfigForm
            serverName={serverName}
            password={password}
            onServerNameChange={onServerNameChange}
            onPasswordChange={onPasswordChange}
            onCreateServer={onCreateServer}
            validationErrors={validationErrors}
          />
        </Stack>
      </ContentContainer>
    </MainContainer>
  );
};
