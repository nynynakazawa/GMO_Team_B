"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const ProgressContainer = styled(Paper)(({ theme }) => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "32px",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  zIndex: 9999,
  minWidth: "400px",
  maxWidth: "600px",
}));

const Overlay = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 9998,
}));

const ProgressTitle = styled(Typography)(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 600,
  textAlign: "center",
  marginBottom: "24px",
  color: theme.palette.primary.main,
}));

const ProgressBarContainer = styled(Box)(() => ({
  marginBottom: "20px",
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: "12px",
  borderRadius: "6px",
  backgroundColor: "#e0e0e0",
  "& .MuiLinearProgress-bar": {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "6px",
    transition: "transform 0.3s ease-in-out",
    background: `linear-gradient(90deg, 
      ${theme.palette.primary.main} 0%, 
      ${theme.palette.primary.light} 50%, 
      ${theme.palette.primary.main} 100%)`,
    backgroundSize: "200% 100%",
    animation: "shimmer 2s infinite",
  },
  "@keyframes shimmer": {
    "0%": {
      backgroundPosition: "-200% 0",
    },
    "100%": {
      backgroundPosition: "200% 0",
    },
  },
}));

const StatusContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  marginTop: "16px",
}));

const StatusText = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 400,
  textAlign: "center",
  color: theme.palette.text.primary,
}));

const SuccessIcon = styled(CheckCircleIcon)(({ theme }) => ({
  color: theme.palette.success.main,
  fontSize: "24px",
}));

const ErrorIconStyled = styled(ErrorIcon)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: "24px",
}));

export interface ServerCreationProgressProps {
  isVisible: boolean;
  progress: number;
  currentStatus: string;
  isCompleted: boolean;
  isError: boolean;
  errorMessage?: string;
}

const getProgressMessage = (status: string): string => {
  const statusMessages: { [key: string]: string } = {
    'initializing': '初期化しています...',
    'authenticating': 'ConoHaに認証中...',
    'fetching_flavors': '利用可能なプランを確認中...',
    'fetching_images': 'OSイメージを準備中...',
    'creating_volume': 'ストレージを作成中...',
    'waiting_volume': 'ストレージの準備を待機中...',
    'creating_server': 'VPSサーバーを作成中...',
    'completed': 'サーバー作成が完了しました！',
    'error': 'エラーが発生しました'
  };

  return statusMessages[status] || status;
};

export const ServerCreationProgress: React.FC<ServerCreationProgressProps> = ({
  isVisible,
  progress,
  currentStatus,
  isCompleted,
  isError,
  errorMessage,
}) => {
  console.log('ServerCreationProgress props:', { isVisible, progress, currentStatus, isCompleted, isError });
  
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [microProgress, setMicroProgress] = useState(0);
  
  // メインの進捗に追従するアニメーション
  useEffect(() => {
    if (isCompleted || isError) {
      setAnimatedProgress(progress);
      return;
    }
    
    const targetProgress = progress;
    const currentProgress = animatedProgress;
    const difference = targetProgress - currentProgress;
    
    if (difference > 0) {
      const steps = Math.max(10, Math.abs(difference));
      const increment = difference / steps;
      const stepDuration = 100; // 100ms per step
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const newProgress = currentProgress + (increment * step);
        
        if (step >= steps || newProgress >= targetProgress) {
          setAnimatedProgress(targetProgress);
          clearInterval(timer);
        } else {
          setAnimatedProgress(newProgress);
        }
      }, stepDuration);
      
      return () => clearInterval(timer);
    }
  }, [progress, isCompleted, isError, animatedProgress]);
  
  // 微細な進捗アニメーション（ジリジリ感を演出）
  useEffect(() => {
    if (isCompleted || isError || animatedProgress >= 95) {
      return;
    }
    
    const microTimer = setInterval(() => {
      setMicroProgress(prev => {
        // 現在の進捗に応じて微細な進捗を追加
        const maxMicroProgress = Math.min(3, 95 - animatedProgress); // 最大3%の微細進捗
        const increment = Math.random() * 0.5 + 0.1; // 0.1-0.6%のランダム増分
        
        const newMicroProgress = Math.min(prev + increment, maxMicroProgress);
        return newMicroProgress;
      });
    }, 200 + Math.random() * 300); // 200-500msの間隔でランダム
    
    return () => clearInterval(microTimer);
  }, [animatedProgress, isCompleted, isError]);
  
  // 進捗が更新されたら微細進捗をリセット
  useEffect(() => {
    setMicroProgress(0);
  }, [progress]);
  
  if (!isVisible) return null;
  
  const displayProgress = Math.min(100, animatedProgress + microProgress);

  return (
    <>
      <Overlay />
      <ProgressContainer>
        <ProgressTitle>
          {isCompleted ? "サーバー作成完了！" : isError ? "エラーが発生しました" : "サーバー作成中..."}
        </ProgressTitle>
        
        <ProgressBarContainer>
          <StyledLinearProgress 
            variant="determinate" 
            value={isError ? 0 : displayProgress} 
          />
        </ProgressBarContainer>
        
        <StatusContainer>
          {isCompleted && <SuccessIcon />}
          {isError && <ErrorIconStyled />}
          <StatusText>
            {isError && errorMessage 
              ? errorMessage 
              : getProgressMessage(currentStatus)
            }
          </StatusText>
        </StatusContainer>
        
        {isCompleted && (
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center', 
              marginTop: 2, 
              color: 'text.secondary' 
            }}
          >
            ページから離れないでください
          </Typography>
        )}
      </ProgressContainer>
    </>
  );
};