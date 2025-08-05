"use client";

import React from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Plan } from "../types/gameServerSetup";
import { formatPrice, formatDiscount } from "../data/stringFormatters";

const PlanCardContainer = styled(Box)<{
  selected: boolean;
  featured?: boolean;
}>(({ theme, selected, featured }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: selected
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  border: featured
    ? `3px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.grey[300]}`,
  cursor: "pointer",
  transition: "all 0.2s ease",
  minHeight: 200,
  minWidth: 180,
  position: "relative",
  "&:hover": {
    backgroundColor: selected
      ? theme.palette.primary.main
      : theme.palette.grey[100],
    transform: "translateY(-2px)",
    boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.15)",
  },
}));

const PlanCapacity = styled(Typography)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    fontSize: "24px",
    fontWeight: 700,
    fontFamily: '"Noto Sans", sans-serif',
    color: selected
      ? theme.palette.primary.contrastText
      : theme.palette.primary.main,
    textAlign: "center",
    marginBottom: theme.spacing(1),
  })
);

const PlanPrice = styled(Typography)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    fontSize: "20px",
    fontWeight: 600,
    fontFamily: '"Noto Sans", sans-serif',
    color: selected
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing(0.5),
  })
);

const OriginalPrice = styled(Typography)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    fontSize: "14px",
    fontWeight: 400,
    fontFamily: '"Noto Sans", sans-serif',
    color: selected
      ? theme.palette.primary.contrastText
      : theme.palette.text.secondary,
    textAlign: "center",
    textDecoration: "line-through",
    marginBottom: theme.spacing(1),
  })
);

const DiscountChip = styled(Chip)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: selected
      ? theme.palette.primary.contrastText
      : theme.palette.primary.main,
    color: selected
      ? theme.palette.primary.main
      : theme.palette.primary.contrastText,
    fontSize: "12px",
    fontWeight: "bold",
    height: 24,
  })
);

const SpecItem = styled(Typography)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    fontSize: "12px",
    fontWeight: 400,
    fontFamily: '"Noto Sans", sans-serif',
    color: selected
      ? theme.palette.primary.contrastText
      : theme.palette.text.secondary,
    textAlign: "center",
    lineHeight: 1.4,
  })
);

const SpecsContainer = styled(Stack)(() => ({
  width: "100%",
  spacing: 0.5,
}));

interface PlanCardProps {
  plan: Plan;
  selected: boolean;
  onClick: (planId: string) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  selected,
  onClick,
}) => {
  return (
    <PlanCardContainer
      selected={selected}
      featured={plan.featured}
      onClick={() => onClick(plan.id)}
    >
      <PlanCapacity selected={selected}>{plan.capacity}</PlanCapacity>

      <PlanPrice selected={selected}>
        {formatPrice(plan.monthlyPrice)}
      </PlanPrice>

      <Stack direction={"row"}>
        {plan.originalPrice > plan.monthlyPrice && (
          <OriginalPrice selected={selected}>
            {formatPrice(plan.originalPrice)}
          </OriginalPrice>
        )}
        {plan.discount > 0 && (
          <DiscountChip
            selected={selected}
            label={formatDiscount(plan.discount)}
            size="small"
          />
        )}
      </Stack>

      <SpecsContainer spacing={0.5}>
        <SpecItem selected={selected}>CPU {plan.cpuCores}</SpecItem>
        <SpecItem selected={selected}>SSD {plan.storageCapacity}</SpecItem>
      </SpecsContainer>
    </PlanCardContainer>
  );
};
