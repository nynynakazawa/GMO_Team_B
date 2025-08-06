"use client"


import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import ProgressLineIcon from '../icons/ProgressLineIcon';


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
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 20,
}));

const StepContent = styled(Box)<{ active: boolean; completed: boolean }>(
  ({ theme, active, completed }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    opacity: active || completed ? 1 : 0.6,
    transform: active ? "scale(1.05)" : "scale(1)",
    transition: "all 0.3s ease",
  })
);

const StepTitle = styled(Typography)<{ active: boolean; completed: boolean }>(
  ({ theme, active, completed }) => ({
    color:
      active || completed
        ? theme.palette.primary.main
        : theme.palette.text.secondary,
    fontFamily: "Iceland",
    fontSize: "24px",
    fontWeight: 400,
    textAlign: "center",
    WebkitTextStroke: active || completed ? "1px #000000" : "none",
    marginBottom: theme.spacing(2),
    transition: "all 0.3s ease",
  })
);

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

const GameSelectionImage = styled("img")<{
  active: boolean;
  completed: boolean;
}>(({ active, completed }) => ({
  width: 122,
  height: 110,
  borderRadius: 10,
  opacity: active || completed ? 1 : 0.5,
  filter: active || completed ? "none" : "grayscale(100%)",
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
    width: 114,
    height: 209,
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
  width: "80%",
  height: 8,
  backgroundColor: theme.palette.grey[300],
  borderRadius: 4,
  position: "relative",
  overflow: "hidden",
}));




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
    subtitle: "サーバーを追加",
    buttonText: "追加",
  },
  {
    id: 2,
    title: "Step2",
    subtitle: "ゲームを選択",
    image: "/images/game-selection.png",
  },
  {
    id: 3,
    title: "Step3",
    subtitle: "プランを選択",
    image: "/images/plan-card.png",
  },
  {
    id: 4,
    title: "Step4",
    subtitle: "完了!!",
    image: "/images/character-mascot.png",
  },
];

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
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
        return (
          <CharacterMascot
            src={step.image}
            alt={step.subtitle}
            active={active}
            completed={completed}
          />
        );
      } else if (step.id === 3) {
        return (
          <PlanCard
            src={step.image}
            alt={step.subtitle}
            active={active}
            completed={completed}
          />
        );
      } else {
        return (
          <GameSelectionImage
            src={step.image}
            alt={step.subtitle}
            active={active}
            completed={completed}
          />
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
            <StepContent key={step.id} active={active} completed={completed}>
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
                <StepNumber
                  active={active}
                  completed={completed}
                  style={{ left: `${position}%` }}
                >
                  {step.id}
                </StepNumber>
              </Box>
            );
          })}
        </ProgressLine>
      </ProgressLineContainer>
    </ProgressContainer>
  );
};