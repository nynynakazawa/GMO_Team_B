"use client";

import React from "react";
import Image from "next/image";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Link,
  useMediaQuery, 
  useTheme
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaServer, FaCompactDisc, FaFolder } from "react-icons/fa";
import { FaNetworkWired, FaKey } from "react-icons/fa6";
import { GrDomain } from "react-icons/gr";
import { HiServer } from "react-icons/hi2";
import { IoIosAdd, IoIosPaper, IoLogoGameControllerB } from "react-icons/io";
import { MdLanguage } from "react-icons/md";

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 165,
  height: "100vh",
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(1),
  display: "flex",
  position: "sticky",
  top: 0,
  flexDirection: "column",
}));

const LogoContainer = styled(Box)(() => ({
  height: 78,
  marginBottom: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const NavList = styled(List)(() => ({
  padding: 0,
  flex: 1,
}));

const NavListItem = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1),
  color: theme.palette.primary.main,
  fontSize: "14px",
  fontFamily: '"Noto Sans", sans-serif',
  "&.active": {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
  },
}));

const menuItems = [
  {
    id: "create",
    label: "サーバー追加",
    icon: <IoIosAdd size={20} color="white" />,
  },
  {
    id: "serverinfo",
    label: "ダッシュボード",
    icon: <IoLogoGameControllerB size={20} color="white" />,
  },
  // {
  //   id: "server",
  //   label: "サーバー",
  //   icon: <FaServer size={20} color="white" />,
  // },
  // {
  //   id: "storage",
  //   label: "ストレージ",
  //   icon: <HiServer size={20} color="white" />,
  // },
  // {
  //   id: "image",
  //   label: "イメージ",
  //   icon: <FaCompactDisc size={20} color="white" />,
  // },
  // {
  //   id: "network",
  //   label: "ネットワーク",
  //   icon: <FaNetworkWired size={20} color="white" />,
  // },
  // {
  //   id: "security",
  //   label: "セキュリティ",
  //   icon: <FaKey size={20} color="white" />,
  // },
  // {
  //   id: "object-storage",
  //   label: "オブジェクトストレージ",
  //   icon: <FaFolder size={20} color="white" />,
  // },
  // { id: "dns", label: "DNS", icon: <MdLanguage size={20} color="white" /> },
  // {
  //   id: "license",
  //   label: "ライセンス",
  //   icon: <IoIosPaper size={20} color="white" />,
  // },
  // {
  //   id: "domain",
  //   label: "ドメイン",
  //   icon: <GrDomain size={20} color="white" />,
  // },
  // { id: "api", label: "API", icon: <GrDomain size={20} color="white" /> },

];

// デフォルトエクスポートに修正
const SidebarNavigation: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // モバイル版ではサイドバーを表示しない
  if (isMobile) {
    return null;
  }

  return (
    <SidebarContainer>
      <LogoContainer>
        <Image
          src="/images/conoha-logo.png"
          alt="ConoHa Logo"
          width={165}
          height={78}
          style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "9px" }}
        />
      </LogoContainer>
      <NavList>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <NavListItem>
              <Stack direction="row" spacing={1} alignItems="center">
                {item.icon}
                <Link href={`/normal/${item.id}`} underline="none">
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "14px",
                      fontFamily: '"Noto Sans", sans-serif',
                      color: "white",
                    }}
                  />
                </Link>
              </Stack>
            </NavListItem>
          </ListItem>
        ))}
      </NavList>
    </SidebarContainer>
  );
};

export default SidebarNavigation;
