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
  hasError?: boolean;
  selectedPeriod?: string | null;
}

export const PlanSelectionGrid: React.FC<PlanSelectionGridProps> = ({
  plans,
  selectedPlan,
  onPlanSelect,
  loading = false,
  error = null,
  hasError = false,
  selectedPeriod = null,
}) => {
  if (selectedPlan) {
    const selectedPlanData = plans.find(plan => plan.id === selectedPlan);
    return (
      <SectionContainer>
        <Stack direction="row" spacing={3} alignItems={"center"}>
          <SectionTitle sx={{ color: hasError ? 'error.main' : 'primary.main' }}>
            プランを選択
          </SectionTitle>
          <Typography variant="body1" color="#19b8d7">
            {selectedPlanData?.name || selectedPlan}
          </Typography>
          {hasError && (
            <Typography variant="body2" color="error.main" sx={{ fontSize: '14px' }}>
              入力が必要です
            </Typography>
          )}
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
        <Stack direction="row" alignItems="center" spacing={2}>
          <SectionTitle sx={{ color: hasError ? 'error.main' : 'primary.main' }}>
            プランを選択
          </SectionTitle>
          {hasError && (
            <Typography variant="body2" color="error.main" sx={{ fontSize: '14px' }}>
              入力が必要です
            </Typography>
          )}
        </Stack>
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </SectionContainer>
    );
  }

  if (error) {
    return (
      <SectionContainer>
        <Stack direction="row" alignItems="center" spacing={2}>
          <SectionTitle sx={{ color: hasError ? 'error.main' : 'primary.main' }}>
            プランを選択
          </SectionTitle>
          {hasError && (
            <Typography variant="body2" color="error.main" sx={{ fontSize: '14px' }}>
              入力が必要です
            </Typography>
          )}
        </Stack>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </SectionContainer>
    );
  }

  if (plans.length === 0) {
    return (
      <SectionContainer>
        <Stack direction="row" alignItems="center" spacing={2}>
          <SectionTitle sx={{ color: hasError ? 'error.main' : 'primary.main' }}>
            プランを選択
          </SectionTitle>
          {hasError && (
            <Typography variant="body2" color="error.main" sx={{ fontSize: '14px' }}>
              入力が必要です
            </Typography>
          )}
        </Stack>
        <Alert severity="info" sx={{ mt: 2 }}>
          利用可能なプランがありません
        </Alert>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <Stack direction="row" alignItems="center" spacing={2}>
        <SectionTitle sx={{ color: hasError ? 'error.main' : 'primary.main' }}>
          プランを選択
        </SectionTitle>
        {hasError && (
          <Typography variant="body2" color="error.main" sx={{ fontSize: '14px' }}>
            入力が必要です
          </Typography>
        )}
      </Stack>

      <PlansContainer>
        {plans.map((plan, index) => (
          <PlanCard
            key={`${plan.id}-${index}`}
            plan={plan}
            selected={selectedPlan === plan.id}
            onClick={onPlanSelect}
            selectedPeriod={selectedPeriod}
          />
        ))}
      </PlansContainer>
    </SectionContainer>
  );
};
