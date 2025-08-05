"use client";

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

import UserAvatarIcon from './icons/UserAvatarIcon';

export const AuthHeader: React.FC = () => {
  return (
    <Box
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 17px',
        width: '100%'
      }}
    >
      {/* ConoHa Logo */}
      <Box
        component="img"
        src="/images/conoha-logo.png"
        alt="ConoHa for GAME"
        sx={{
          height: '84px',
          width: '437px',
          objectFit: 'cover'
        }}
      />

      {/* User Profile Section */}
      <Stack direction="row" alignItems="center" spacing={3} sx={{ marginRight: '20px' }}>
        <Typography
          variant="body2"
          sx={{
            color: '#ffffff',
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: '16px',
            fontWeight: 400
          }}
        >
          マイページ
        </Typography>
      </Stack>
    </Box>
  );
};