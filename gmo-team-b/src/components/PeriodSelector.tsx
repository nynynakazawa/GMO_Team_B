"use client";

import React from "react";
import { Box, Typography, Select, MenuItem, FormControl } from "@mui/material";
import { styled } from "@mui/material/styles";
import DropdownArrowIcon from "./icons/DropdownArrowIcon";
import { PeriodOption } from "../types/gameServerSetup";

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

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 300,
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `2px solid ${theme.palette.grey[300]}`,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    "& fieldset": {
      border: "none",
    },
  },
  "& .MuiSelect-select": {
    fontSize: "18px",
    fontFamily: '"Noto Sans", sans-serif',
    padding: "12px 16px",
  },
}));

const StyledSelect = styled(Select)(() => ({
  "& .MuiSelect-icon": {
    display: "none",
  },
}));

const CustomDropdownIcon = styled(Box)(() => ({
  position: "absolute",
  right: 16,
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
}));

interface PeriodSelectorProps {
  periodOptions: PeriodOption[];
  selectedPeriod: string | null;
  onPeriodSelect: (period: string) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  periodOptions,
  selectedPeriod,
  onPeriodSelect,
}) => {
  return (
    <SectionContainer>
      <SectionTitle>期間を選択</SectionTitle>

      <Box sx={{ position: "relative", display: "inline-block" }}>
        <StyledFormControl>
          <StyledSelect
            value={selectedPeriod || ""}
            onChange={(e) => onPeriodSelect(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              期間を選択してください
            </MenuItem>
            {periodOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </StyledSelect>
        </StyledFormControl>
        <CustomDropdownIcon>
          <DropdownArrowIcon width={36} height={33} color="#d9d9d9" />
        </CustomDropdownIcon>
      </Box>
    </SectionContainer>
  );
};
