"use client";

import React, { useState } from "react";
import { Box, Container, Typography, IconButton, Stack } from "@mui/material";
import { Person } from "@mui/icons-material";
import UserMenu from "./serverinfo/UserMenu";

export const Header: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [easyMode, setEasyMode] = useState(true);

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleEasyModeChange = (checked: boolean) => {
    setEasyMode(checked);
  };

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderBottom: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      height={"60px"}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" alignItems="baseline" spacing={0.5}>
            <Typography
              variant="h5"
              sx={{ color: "#19B8D7", fontWeight: "bold" }}
            >
              ConoHa for GAME
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              by GMO
            </Typography>
          </Stack>
          <Box sx={{ position: "relative" }}>
            <IconButton
              sx={{ bgcolor: "#e3f2fd", color: "#19B8D7" }}
              onClick={handleUserMenuToggle}
            >
              <Person />
            </IconButton>
            <UserMenu
              isOpen={isUserMenuOpen}
              easyMode={easyMode}
              onEasyModeChange={handleEasyModeChange}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
