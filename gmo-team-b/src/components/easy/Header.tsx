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
  iconUrl?: string;
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
    if (pathname === "/normal/serverinfo"||
    pathname === "/easy/serverinfo") return menuLabels.myServer;
    if (pathname === "/account") return menuLabels.accountSettings;
    if (pathname === "/normal/create"||
    pathname === "/easy/create") return menuLabels.createServer;
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
      height={{ xs: "auto", md: "60px" }}
      minHeight={{ xs: "60px", md: "60px" }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: { xs: 1, md: 0 },
            flexWrap: { xs: "wrap", md: "nowrap" },
            gap: { xs: 1, md: 0 }
          }}
        >
          <Link
            href={easyMode ? "/easy/serverinfo" : "/normal/serverinfo"}
            style={{ textDecoration: "none" }}
          >
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              alignItems={{ xs: "flex-start", sm: "baseline" }} 
              spacing={{ xs: 0, sm: 0.5 }}
            >
              <Typography
                sx={{ 
                  color: "#19B8D7", 
                  fontWeight: "bold",
                  fontSize: { xs: "1.1rem", sm: "1.5rem" }
                }}
              >
                ConoHa for GAME
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: "text.secondary",
                  fontSize: { xs: "0.75rem", sm: "0.75rem" }
                }}
              >
                by GMO
              </Typography>
              {getPageTitle() && (
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: "#888", 
                    ml: { xs: 0, sm: 1 },
                    fontSize: { xs: "0.8rem", sm: "0.875rem" }
                  }}
                >
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

                    width: { xs: 50, md: 60 },
                    height: { xs: 50, md: 60 },
                    borderRadius: "50%",
                    padding: 0,

                  }}
                  onClick={handleUserMenuToggle}
                >
                  <Image
                    src={iconUrl || "/images/conohaIcon.png"}
                    alt="アイコン"
                    width={50}
                    height={50}
                    style={{

                      width: "100%",
                      height: "100%",

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
