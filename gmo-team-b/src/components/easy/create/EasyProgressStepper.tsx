"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SettingsIcon from "@mui/icons-material/Settings";

const ProgressContainer = styled(Box)(({ theme }) => ({
  border: `2px solid ${theme.palette.grey[400]}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  minHeight: 324,
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
}));

const StepContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  marginBottom: 20,
}));

const StepContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== "completed",
})<{ completed: boolean }>(({ theme, completed }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  flex: 1,
  // ここで completed を使う場合はコメントアウトを外してね
  // opacity: completed ? 1 : 0.6,
  transition: "all 0.3s ease",
}));

const StepTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "completed",
})<{ active: boolean; completed: boolean }>(({ theme, active, completed }) => ({
  color:
    active || completed
      ? theme.palette.primary.main
      : theme.palette.text.secondary,
  fontFamily: "Iceland",
  fontSize: "24px",
  fontWeight: 400,
  textAlign: "center",
  marginBottom: theme.spacing(2),
  transition: "all 0.3s ease",
}));

const ActionButton = styled(Button)<{ active: boolean }>(
  ({ theme, active }) => ({
    backgroundColor: active
      ? theme.palette.primary.main
      : theme.palette.grey[300],
    color: active
      ? theme.palette.primary.contrastText
      : theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.5, 3),
    fontSize: "16px",
    textTransform: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: active
        ? theme.palette.primary.dark
        : theme.palette.grey[400],
    },
    "&:disabled": {
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.text.disabled,
    },
  })
);

const IconContainer = styled(Box)<{
  active: boolean;
  completed: boolean;
}>(({ active, completed }) => ({
  width: 122,
  height: 110,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: active || completed ? "rgba(25, 184, 215, 0.1)" : "rgba(0, 0, 0, 0.05)",
  opacity: active || completed ? 1 : 0.5,
  transition: "all 0.3s ease",
}));

const PlanCard = styled("img")<{ active: boolean; completed: boolean }>(
  ({ active, completed }) => ({
    width: 127,
    height: 101,
    borderRadius: 10,
    opacity: active || completed ? 1 : 0.5,
    filter: active || completed ? "none" : "grayscale(100%)",
    transition: "all 0.3s ease",
  })
);

const CharacterMascot = styled("img")<{ active: boolean; completed: boolean }>(
  ({ active, completed }) => ({
    height: 150,
    opacity: active || completed ? 1 : 0.5,
    filter: active || completed ? "none" : "grayscale(100%)",
    transition: "all 0.3s ease",
  })
);

const ProgressLineContainer = styled(Box)(() => ({
  marginTop: 20,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const ProgressLine = styled(Box)(({ theme }) => ({
  width: "75%",
  height: 8,
  backgroundColor: theme.palette.grey[300],
  borderRadius: 4,
  position: "relative",
  overflow: "visible",
}));

const ProgressFill = styled(Box)<{ progress: number }>(
  ({ theme, progress }) => ({
    width: `${progress}%`,
    height: "100%",
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
    transition: "width 0.5s ease",
  })
);

const ProgressDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "completed",
})<{ active: boolean; completed: boolean }>(({ theme, active, completed }) => ({
  width: 16,
  height: 16,
  borderRadius: "50%",
  backgroundColor: completed
    ? theme.palette.primary.main
    : active
    ? theme.palette.primary.light
    : theme.palette.grey[300],
  border:
    active && !completed ? `2px solid ${theme.palette.primary.main}` : "none",
  position: "absolute",
  top: "50%",
  transform: "translate(-50%, -75%)",
  transition: "all 0.3s ease",
  zIndex: 1,
}));

interface Step {
  id: number;
  title: string;
  subtitle: string;
  image?: string;
  action?: () => void;
  buttonText?: string;
  completed?: boolean;
}

interface ProgressStepperProps {
  currentStep?: number;
  steps?: Step[];
  autoProgress?: boolean;
  autoProgressDelay?: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
}

const defaultSteps: Step[] = [
  {
    id: 1,
    title: "Step1",
    subtitle: "ゲームを選択",
    image: "/images/game-selection.png",
  },
  {
    id: 2,
    title: "Step2",
    subtitle: "期間を選択",
    image: "/images/server-card.png",
  },
  {
    id: 3,
    title: "Step3",
    subtitle: "プランを設定",
    image: "/images/set-term.jpg",
  },
  {
    id: 4,
    title: "Step4",
    subtitle: "サーバー作成",
    image: "/images/conoha_image1.png",
  },
];

export const EasyProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep: externalCurrentStep,
  steps = defaultSteps,
  autoProgress = false,
  autoProgressDelay = 2000,
  onStepChange,
  onComplete,
}) => {
  const [internalCurrentStep, setInternalCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Use external step if provided, otherwise use internal state
  const currentStep =
    externalCurrentStep !== undefined
      ? externalCurrentStep
      : internalCurrentStep;

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  // Auto progress functionality
  useEffect(() => {
    if (autoProgress && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const nextStep = currentStep + 1;
        setInternalCurrentStep(nextStep);
        setCompletedSteps((prev) => [...prev, currentStep]);
        onStepChange?.(nextStep);

        if (nextStep === steps.length) {
          onComplete?.();
        }
      }, autoProgressDelay);

      return () => clearTimeout(timer);
    }
  }, [
    autoProgress,
    currentStep,
    steps.length,
    autoProgressDelay,
    onStepChange,
    onComplete,
  ]);

  const handleStepAction = (step: Step) => {
    if (step.action) {
      step.action();
    } else if (externalCurrentStep === undefined) {
      // Only allow manual progression if not controlled externally
      const nextStep = Math.min(currentStep + 1, steps.length);
      setInternalCurrentStep(nextStep);
      setCompletedSteps((prev) => [...prev, currentStep]);
      onStepChange?.(nextStep);

      if (nextStep === steps.length) {
        onComplete?.();
      }
    }
  };

  const isStepActive = (stepId: number) => stepId === currentStep;
  const isStepCompleted = (stepId: number) =>
    completedSteps.includes(stepId) || stepId < currentStep;

  const renderStepContent = (step: Step) => {
    const active = isStepActive(step.id);
    const completed = isStepCompleted(step.id);

    if (step.buttonText && step.id === 1) {
      return (
        <ActionButton
          active={active}
          startIcon={<AddIcon />}
          onClick={() => handleStepAction(step)}
          disabled={completed}
        >
          {completed ? "完了" : step.buttonText}
        </ActionButton>
      );
    }

    if (step.image) {
      if (step.id === 4) {
        // サーバー作成の画像は変更しない
        return (
          <CharacterMascot
            src={step.image}
            alt={step.subtitle}
            active={active}
            completed={completed}
          />
        );
      } else if (step.id === 3) {
        // プラン設定はMUIアイコン
        return (
          <IconContainer active={active} completed={completed}>
            <SettingsIcon 
              sx={{ 
                fontSize: 60, 
                color: active || completed ? '#19b8d7' : '#666' 
              }} 
            />
          </IconContainer>
        );
      } else if (step.id === 1) {
        // ゲーム選択はMUIアイコン
        return (
          <IconContainer active={active} completed={completed}>
            <SportsEsportsIcon 
              sx={{ 
                fontSize: 60, 
                color: active || completed ? '#19b8d7' : '#666' 
              }} 
            />
          </IconContainer>
        );
      } else if (step.id === 2) {
        // 期間選択はMUIアイコン
        return (
          <IconContainer active={active} completed={completed}>
            <ScheduleIcon 
              sx={{ 
                fontSize: 60, 
                color: active || completed ? '#19b8d7' : '#666' 
              }} 
            />
          </IconContainer>
        );
      }
    }

    return null;
  };

  return (
    <ProgressContainer>
      <StepContainer>
        {steps.map((step) => {
          const active = isStepActive(step.id);
          const completed = isStepCompleted(step.id);

          return (
            <StepContent key={step.id} completed={completed}>
              <StepTitle active={true} completed={completed}>
                {step.title}
                <br />
                {step.subtitle}
              </StepTitle>
              {renderStepContent(step)}
            </StepContent>
          );
        })}
      </StepContainer>

      <ProgressLineContainer>
        <ProgressLine>
          <ProgressFill progress={progress} />
          {steps.map((step, index) => {
            const active = isStepActive(step.id);
            const completed = isStepCompleted(step.id);
            const position = (index / (steps.length - 1)) * 100;

            return (
              <Box key={step.id} sx={{ position: "relative" }}>
                <ProgressDot
                  active={active}
                  completed={completed}
                  style={{ left: `${position}%` }}
                />
              </Box>
            );
          })}
        </ProgressLine>
      </ProgressLineContainer>
    </ProgressContainer>
  );
};