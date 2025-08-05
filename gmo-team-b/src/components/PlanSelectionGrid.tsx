"use client";

import React from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PlanCard } from "./PlanCard";
import { Plan } from "../types/gameServerSetup";

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

interface PlanSelectionGridProps {
  plans: Plan[];
  selectedPlan: string | null;
  onPlanSelect: (planId: string) => void;
}

export const PlanSelectionGrid: React.FC<PlanSelectionGridProps> = ({
  plans,
  selectedPlan,
  onPlanSelect,
}) => {
  if (selectedPlan) {
    return (
      <SectionContainer>
        <Stack direction="row" spacing={3} alignItems={"center"}>
          <SectionTitle>期間を選択</SectionTitle>
          <Typography variant="body1" color="#19b8d7">
            {selectedPlan}
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
