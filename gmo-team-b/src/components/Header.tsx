"use client";

import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import UserAvatarIcon from "./icons/UserAvatarIcon";

const HeaderContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "15px 17px",
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #000000",
}));

const Logo = styled("img")(() => ({
  height: 84,
  width: "auto",
}));

const MyPageText = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 400,
  fontFamily: '"Noto Sans", sans-serif',
  color: "#ffffff",
}));

const RightSection = styled(Stack)(() => ({
  alignItems: "center",
  gap: 2,
}));

const UserIconContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo src="/images/conoha-logo.png" alt="ConoHa for GAME" />
      <RightSection direction="row">
        <MyPageText>マイページ</MyPageText>
        <UserIconContainer>
          <UserAvatarIcon width={80} height={80} color="#19b8d7" />
        </UserIconContainer>
      </RightSection>
    </HeaderContainer>
  );
};
