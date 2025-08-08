"use client";

import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Header } from "./easy/Header";
import { EasyProgressStepper } from "./easy/create/EasyProgressStepper";
import { GameSelectionGrid } from "./easy/create/GameSelectionGrid";
import { PeriodSelector } from "./easy/create/PeriodSelector";
import { PlanSelectionGrid } from "./easy/create/PlanSelectionGrid";
import { ServerConfigForm } from "./easy/create/ServerConfigForm";
import { GameServerSetupProps } from "../types/gameServerSetup";

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
}) => {
  return (
    <MainContainer>
      <Header iconUrl="/images/conohaIcon.png" />

      <ContentContainer>
        <EasyProgressStepper currentStep={currentStep} />

        <Stack spacing={4}>
          <GameSelectionGrid
            games={games}
            selectedGame={selectedGame}
            onGameSelect={onGameSelect}
          />

          <PeriodSelector
            periodOptions={periodOptions}
            selectedPeriod={selectedPeriod}
            onPeriodSelect={onPeriodSelect}
          />

          <PlanSelectionGrid
            plans={plans}
            selectedPlan={selectedPlan}
            onPlanSelect={onPlanSelect}
            loading={loading}
            error={error}
          />

          <ServerConfigForm
            serverName={serverName}
            password={password}
            onServerNameChange={onServerNameChange}
            onPasswordChange={onPasswordChange}
            onCreateServer={onCreateServer}
          />
        </Stack>
      </ContentContainer>
    </MainContainer>
  );
};
