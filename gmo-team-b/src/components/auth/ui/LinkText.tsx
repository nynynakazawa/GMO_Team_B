"use client";

import React from 'react';
import { Typography, Link } from '@mui/material';

interface LinkTextProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

export const LinkText: React.FC<LinkTextProps> = ({ 
  children, 
  onClick, 
  href 
}) => {
  return (
    <Typography
      component={href ? Link : 'span'}
      href={href}
      onClick={onClick}
      sx={{
        fontFamily: "'Noto Sans', sans-serif",
        fontSize: { xs: '14px', sm: '18px', md: '24px' },
        fontWeight: 400,
        color: '#000000',
        textDecoration: 'none',
        cursor: 'pointer',
        '&:hover': {
          color: '#2BBBD8',
          textDecoration: 'underline',
        }
      }}
    >
      {children}
    </Typography>
  );
};