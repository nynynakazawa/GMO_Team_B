"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { styled } from "@mui/material/styles";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AddIcon from "@mui/icons-material/Add";
import { GameCard } from "./GameCard";
import { Game } from "../../../types/gameServerSetup";

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
  gridTemplateColumns: "repeat(6, 1fr)", // 6列固定
  gap: 20,
  marginTop: 20,
}));

const OthersButton = styled(Button)(({ theme }) => ({
  minHeight: 120,
  border: `2px dashed ${theme.palette.grey[400]}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "transparent",
  color: theme.palette.text.secondary,
  fontSize: "16px",
  fontWeight: 500,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.grey[50],
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
}));

const CustomGameDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
  },
}));

const CustomGameField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  "& .MuiInputBase-input": {
    fontSize: "16px",
    fontFamily: '"Noto Sans", sans-serif',
  },
}));

interface GameSelectionGridProps {
  games: Game[];
  selectedGame: string | null;
  onGameSelect: (gameId: string) => void;
  hasError?: boolean;
}

export const GameSelectionGrid: React.FC<GameSelectionGridProps> = ({
  games,
  selectedGame,
  onGameSelect,
  hasError = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOthers, setShowOthers] = useState(false);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customGameName, setCustomGameName] = useState("");

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MAX_DISPLAY = 18; // 6列 × 3行 = 18個
  const displayedGames = showOthers ? filteredGames : filteredGames.slice(0, MAX_DISPLAY - 1); // その他ボタン用に1つ減らす
  const hasMoreGames = filteredGames.length > MAX_DISPLAY - 1;

  const handleCustomGameSubmit = () => {
    if (customGameName.trim()) {
      onGameSelect(customGameName.trim());
      setCustomGameName("");
      setShowCustomDialog(false);
    }
  };

  if (selectedGame) {
    return (
      <SectionContainer>
        <Stack direction="row" spacing={3} alignItems={"center"}>
          <SectionTitle sx={{ color: hasError ? 'error.main' : 'primary.main' }}>
            ゲームを選択
          </SectionTitle>
          <Typography variant="body1" color="#19b8d7">
            {selectedGame}
          </Typography>
          {hasError && (
            <Typography variant="body2" color="error.main" sx={{ fontSize: '14px' }}>
              入力が必要です
            </Typography>
          )}
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
          <SectionTitle sx={{ color: hasError ? 'error.main' : 'primary.main' }}>
            ゲームを選択
          </SectionTitle>
          {hasError && (
            <Typography variant="body2" color="error.main" sx={{ fontSize: '14px' }}>
              入力が必要です
            </Typography>
          )}
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
        {displayedGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            selected={selectedGame === game.id}
            onClick={onGameSelect}
          />
        ))}
        
        {/* その他ボタン（検索中でない場合のみ表示） */}
        {!searchTerm && hasMoreGames && !showOthers && (
          <OthersButton
            onClick={() => setShowOthers(true)}
          >
            <Typography variant="body1">その他</Typography>
            <Typography variant="body2" color="textSecondary">
              +{filteredGames.length - (MAX_DISPLAY - 1)}個
            </Typography>
          </OthersButton>
        )}

        {/* カスタムゲーム作成ボタン */}
        {(searchTerm && filteredGames.length === 0) || showOthers ? (
          <OthersButton
            onClick={() => setShowCustomDialog(true)}
          >
            <AddIcon />
            <Typography variant="body1">カスタムゲーム</Typography>
            <Typography variant="body2" color="textSecondary">
              独自のゲーム名
            </Typography>
          </OthersButton>
        ) : null}
      </GamesGrid>

      {/* 「すべて表示」状態で戻るボタン */}
      {showOthers && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            variant="outlined"
            onClick={() => setShowOthers(false)}
            sx={{ minWidth: 120 }}
          >
            戻る
          </Button>
        </Box>
      )}

      {/* カスタムゲーム作成ダイアログ */}
      <CustomGameDialog
        open={showCustomDialog}
        onClose={() => {
          setShowCustomDialog(false);
          setCustomGameName("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>カスタムゲームを作成</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              お探しのゲームが見つからない場合は、ゲーム名を入力してください。
            </Typography>
            <CustomGameField
              autoFocus
              fullWidth
              label="ゲーム名"
              placeholder="例: Among Us"
              value={customGameName}
              onChange={(e) => setCustomGameName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCustomGameSubmit();
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setShowCustomDialog(false);
              setCustomGameName("");
            }}
          >
            キャンセル
          </Button>
          <Button 
            variant="contained"
            onClick={handleCustomGameSubmit}
            disabled={!customGameName.trim()}
          >
            作成
          </Button>
        </DialogActions>
      </CustomGameDialog>
    </SectionContainer>
  );
};
