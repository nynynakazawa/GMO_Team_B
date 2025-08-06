"use client";

import React from "react";
import { Box, Typography, Stack, Button, CircularProgress, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PlanCard } from "../PlanCard";
import { Plan } from "../../../types/gameServerSetup";

const SectionContainer = styled(Box)(() => ({
  marginBottom: 40,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "36px",
  fontWeight: 400,
  fontFamily: "Iceland",
  color: theme.palette.primary.main,
  marginBottom: 20,
}));

const PlansContainer = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: 20,
  marginTop: 20,
}));

const LoadingContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: 200,
}));

interface PlanSelectionGridProps {
  plans: Plan[];
  selectedPlan: string | null;
  onPlanSelect: (planId: string) => void;
  loading?: boolean;
  error?: string | null;
}

export const PlanSelectionGrid: React.FC<PlanSelectionGridProps> = ({
  plans,
  selectedPlan,
  onPlanSelect,
  loading = false,
  error = null,
}) => {
  if (selectedPlan) {
    const selectedPlanData = plans.find(plan => plan.id === selectedPlan);
    return (
      <SectionContainer>
        <Stack direction="row" spacing={3} alignItems={"center"}>
          <SectionTitle>プランを選択</SectionTitle>
          <Typography variant="body1" color="#19b8d7">
            {selectedPlanData?.name || selectedPlan}
          </Typography>
          <Button
            variant="outlined"
            sx={{ width: 100, height: 38, fontSize: 16 }}
            onClick={() => onPlanSelect("")} // 空文字でリセット
          >
            再選択
          </Button>
        </Stack>
      </SectionContainer>
    );
  }

  if (loading) {
    return (
      <SectionContainer>
        <SectionTitle>プランを選択</SectionTitle>
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </SectionContainer>
    );
  }

  if (error) {
    return (
      <SectionContainer>
        <SectionTitle>プランを選択</SectionTitle>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </SectionContainer>
    );
  }

  if (plans.length === 0) {
    return (
      <SectionContainer>
        <SectionTitle>プランを選択</SectionTitle>
        <Alert severity="info" sx={{ mt: 2 }}>
          利用可能なプランがありません
        </Alert>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionTitle>プランを選択</SectionTitle>

      <PlansContainer>
        {plans.map((plan, index) => (
          <PlanCard
            key={`${plan.id}-${index}`}
            plan={plan}
            selected={selectedPlan === plan.id}
            onClick={onPlanSelect}
          />
        ))}
      </PlansContainer>
    </SectionContainer>
  );
};
