"use client";

import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#2BBBD8',
  color: '#ffffff',
  borderRadius: '10px',
  fontSize: '32px',
  fontWeight: 400,
  fontFamily: "'Noto Sans', sans-serif",
  textTransform: 'none',
  height: '54px',
  minWidth: '162px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
    height: '42px',
    minWidth: '120px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
    height: '38px',
    minWidth: '100px',
  },
  '&:hover': {
    backgroundColor: '#239bb5',
  },
  '&:disabled': {
    backgroundColor: '#cccccc',
    color: '#666666',
  },
}));

interface ActionButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  children, 
  ...props 
}) => {
  return (
    <StyledButton
      variant="contained"
      {...props}
    >
      {children}
    </StyledButton>
  );
};
