"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Stack, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { GameCard } from "./GameCard";
import { Game } from "../types/gameServerSetup";

const SectionContainer = styled(Box)(() => ({
  marginBottom: 40,
}));

const SectionHeader = styled(Stack)(() => ({
  alignItems: "center",
  justifyContent: "space-between",
  // marginBottom: 20,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "36px",
  fontWeight: 400,
  fontFamily: "Iceland",
  color: theme.palette.primary.main,
}));

const HelpIconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 1,
  "& .MuiSvgIcon-root": {
    fontSize: "24px",
    color: theme.palette.secondary.main,
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    "& fieldset": {
      borderColor: theme.palette.grey[300],
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "24px",
    fontFamily: '"Noto Sans", sans-serif',
    color: theme.palette.secondary.main,
    padding: "12px 16px",
  },
}));

const GamesGrid = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: 20,
  marginTop: 20,
}));

interface GameSelectionGridProps {
  games: Game[];
  selectedGame: string | null;
  onGameSelect: (gameId: string) => void;
}

export const GameSelectionGrid: React.FC<GameSelectionGridProps> = ({
  games,
  selectedGame,
  onGameSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedGame) {
    return (
      <SectionContainer>
        <Stack direction="row" spacing={3} alignItems={"center"}>
          <SectionTitle>ゲームを選択</SectionTitle>
          <Typography variant="body1" color="#19b8d7">
            {selectedGame}
          </Typography>
          <Button
            variant="outlined"
            sx={{ width: 100, height: 38, fontSize: 16 }}
            onClick={() => onGameSelect("")} // 空文字でリセット
          >
            再選択
          </Button>
        </Stack>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader direction="row">
        <Stack direction="row" alignItems="center" spacing={2}>
          <SectionTitle>ゲームを選択</SectionTitle>
          <HelpIconContainer>
            <HelpOutlineIcon />
            <Typography variant="body2" color="secondary">
              ヘルプ
            </Typography>
          </HelpIconContainer>
        </Stack>

        <SearchField
          placeholder="ゲームを検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
      </SectionHeader>

      <GamesGrid>
        {filteredGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            selected={selectedGame === game.id}
            onClick={onGameSelect}
          />
        ))}
      </GamesGrid>
    </SectionContainer>
  );
};
