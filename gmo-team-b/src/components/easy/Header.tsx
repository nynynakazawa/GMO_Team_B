"use client";
import Image from "next/image";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
  ClickAwayListener,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import UserMenu from "./UserMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuLabels } from "../../data/menuLabels";

interface HeaderProps {
  iconUrl: string;
}
export const Header: React.FC<HeaderProps> = ({ iconUrl }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [easyMode, setEasyMode] = useState(true);
  const pathname = usePathname();

  // localStorageからeasyModeの状態を読み込み、または現在のページに基づいて設定
  useEffect(() => {
    const savedEasyMode = localStorage.getItem("easyMode");
    if (savedEasyMode !== null) {
      setEasyMode(JSON.parse(savedEasyMode));
    } else {
      // 保存された状態がない場合、現在のページに基づいて設定
      const isEasyPage = pathname?.startsWith("/easy/") ?? true;
      setEasyMode(isEasyPage);
      localStorage.setItem("easyMode", JSON.stringify(isEasyPage));
    }
  }, [pathname]);

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleEasyModeChange = (checked: boolean) => {
    setEasyMode(checked);
    // localStorageにeasyModeの状態を保存
    localStorage.setItem("easyMode", JSON.stringify(checked));
  };
  const getPageTitle = () => {
    if (pathname === "/nomal/serverinfo") return menuLabels.myServer;
    if (pathname === "/account") return menuLabels.accountSettings;
    if (pathname === "/nomal/create") return menuLabels.createServer;
    return "";
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
          <Link
            href={easyMode ? "/easy/serverinfo" : "/nomal/serverinfo"}
            style={{ textDecoration: "none" }}
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
              {getPageTitle() && (
                <Typography variant="subtitle2" sx={{ color: "#888", ml: 1 }}>
                  {"　"}
                  {getPageTitle()}
                </Typography>
              )}
            </Stack>
          </Link>
          <Box sx={{ position: "relative" }}>
            <ClickAwayListener onClickAway={() => setIsUserMenuOpen(false)}>
              <Box>
                <IconButton
                  sx={{
                    bgcolor: "#e3f2fd",
                    color: "#19B8D7",
                    width: 60,
                    height: 60,
                    borderRadius: "50%", // 丸い背景にする（デフォルトでも丸だが明示）
                    padding: 0, // 余白を消してImageとぴったり合わせる
                  }}
                  onClick={handleUserMenuToggle}
                >
                  <Image
                    src={iconUrl || "/images/conohaIcon.png"}
                    alt="アイコン"
                    width={60}
                    height={60}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </IconButton>
                <UserMenu
                  isOpen={isUserMenuOpen}
                  easyMode={easyMode}
                  onEasyModeChange={handleEasyModeChange}
                  onClose={() => setIsUserMenuOpen(false)}
                />
              </Box>
            </ClickAwayListener>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
