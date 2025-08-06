"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Game } from "../types/gameServerSetup";

const GameCardContainer = styled(Box)<{
  selected: boolean;
  featured?: boolean;
}>(({ theme, selected, featured }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: selected
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  border: featured
    ? `3px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.grey[300]}`,
  cursor: "pointer",
  transition: "all 0.2s ease",
  minHeight: 120,
  "&:hover": {
    backgroundColor: selected
      ? theme.palette.primary.main
      : theme.palette.grey[100],
    transform: "translateY(-2px)",
    boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.15)",
  },
}));

const GameIconContainer = styled(Box)(() => ({
  width: 60,
  height: 60,
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 8,
  backgroundColor: "rgba(0, 0, 0, 0.05)",
}));

const GameIcon = styled("img")(() => ({
  width: 60,
  height: 60,
  borderRadius: 8,
  objectFit: "cover",
}));

const GameName = styled(Typography)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    fontSize: "14px",
    fontWeight: 400,
    fontFamily: '"Noto Sans", sans-serif',
    color: selected
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
    textAlign: "center",
    lineHeight: 1.2,
  })
);

interface GameCardProps {
  game: Game;
  selected: boolean;
  onClick: (gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  selected,
  onClick,
}) => {
  const renderIcon = () => {
    if (typeof game.icon === 'string') {
      // 文字列の場合は画像として表示
      return <GameIcon src={game.icon} alt={game.name} />;
    } else {
      // MUIアイコンコンポーネントの場合
      const IconComponent = game.icon;
      return (
        <GameIconContainer>
          <IconComponent 
            sx={{ 
              fontSize: 48, 
              color: selected ? '#fff' : '#19b8d7' 
            }} 
          />
        </GameIconContainer>
      );
    }
  };

  return (
    <GameCardContainer
      selected={selected}
      onClick={() => onClick(game.id)}
      sx={{ position: "relative" }}
    >
      {renderIcon()}
      <GameName selected={selected}>{game.name}</GameName>
    </GameCardContainer>
  );
};
