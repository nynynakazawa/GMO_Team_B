"use client";
import Image from 'next/image';

import React, { useState } from "react";
import { Box, Container, Typography, IconButton, Stack } from "@mui/material";
import { Person } from "@mui/icons-material";
import UserMenu from "../easy/serverinfo/UserMenu";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { menuLabels } from "../../data/menuLabels";

interface HeaderProps {
  iconUrl: string;
}
export const Header: React.FC<HeaderProps> = ({ iconUrl }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [easyMode, setEasyMode] = useState(true);

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleEasyModeChange = (checked: boolean) => {
    setEasyMode(checked);
  };
  const pathname = usePathname();
  const getPageTitle = () => {
    if (pathname === '/nomal/serverinfo') return menuLabels.myServer;
    if (pathname === '/account') return menuLabels.accountSettings;
    if (pathname === '/nomal/create') return menuLabels.createServer;
    return '';
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
          <Link href="/easy/serverinfo" style={{ textDecoration: "none" }}>
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
                {getPageTitle() && (
                <Typography variant="subtitle2" sx={{ color: '#888', ml: 1 }}>
                    {'　'}{getPageTitle()}
                </Typography>
              )}
            </Stack>
 
            
          </Link>
          <Box sx={{ position: "relative" }}>
<IconButton
  sx={{
    bgcolor: "#e3f2fd",
    color: "#19B8D7",
    width: 60,
    height: 60,
    borderRadius: '50%', // 丸い背景にする（デフォルトでも丸だが明示）
    padding: 0            // 余白を消してImageとぴったり合わせる
  }}
  onClick={handleUserMenuToggle}
>
  <Image
    src={iconUrl}
    alt="アイコン"
    width={60}
    height={60}
    style={{
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      objectFit: 'cover',
    }}
  />
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
