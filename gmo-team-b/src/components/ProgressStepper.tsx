"use client"

import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import ProgressLineIcon from './icons/ProgressLineIcon';

const ProgressContainer = styled(Box)(({ theme }) => ({
  border: `2px solid ${theme.palette.grey[400]}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  minHeight: 324
}));

const StepContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20
}));

const StepContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1
}));

const StepTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontFamily: 'Iceland',
  fontSize: '24px',
  fontWeight: 400,
  textAlign: 'center',
  WebkitTextStroke: '1px #000000',
  marginBottom: theme.spacing(2)
}));

const AddButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5, 3),
  fontSize: '16px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}));

const GameSelectionImage = styled('img')(() => ({
  width: 122,
  height: 110,
  borderRadius: 10
}));

const PlanCard = styled('img')(() => ({
  width: 127,
  height: 101,
  borderRadius: 10
}));

const CharacterMascot = styled('img')(() => ({
  width: 114,
  height: 209
}));

const ProgressLineContainer = styled(Box)(() => ({
  marginTop: 20,
  display: 'flex',
  justifyContent: 'center'
}));

interface ProgressStepperProps {
  currentStep: number;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep }) => {
  return (
    <ProgressContainer>
      <StepContainer>
        <StepContent>
          <StepTitle>
            Step1<br />
            サーバーを追加
          </StepTitle>
          <AddButton startIcon={<AddIcon />}>
            追加
          </AddButton>
        </StepContent>

        <StepContent>
          <StepTitle>
            Step2<br />
            ゲームを選択
          </StepTitle>
          <GameSelectionImage 
            src="/images/game-selection.png" 
            alt="Game Selection"
          />
        </StepContent>

        <StepContent>
          <StepTitle>
            Step3<br />
            プランを選択
          </StepTitle>
          <PlanCard 
            src="/images/plan-card.png" 
            alt="Plan Card"
          />
        </StepContent>

        <StepContent>
          <StepTitle>
            Step4<br />
            完了!!
          </StepTitle>
          <CharacterMascot 
            src="/images/character-mascot.png" 
            alt="Character Mascot"
          />
        </StepContent>
      </StepContainer>

      <ProgressLineContainer>
        <ProgressLineIcon width={896} height={29} />
      </ProgressLineContainer>
    </ProgressContainer>
  );
};