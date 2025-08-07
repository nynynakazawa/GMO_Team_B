"use client";

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

export const AuthHeader: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '16px 24px',
        width: '100%',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      {/* User Profile Section */}
      <Stack direction="row" alignItems="center" spacing={3}>
        <Typography
          variant="body2"
          sx={{
            color: '#666666',
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