"use client";

import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(() => ({
  backgroundColor: '#2BBBD8',
  color: '#ffffff',
  borderRadius: '10px',
  fontSize: '32px',
  fontWeight: 400,
  fontFamily: "'Noto Sans', sans-serif",
  textTransform: 'none',
  height: '54px',
  minWidth: '162px',
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
