"use client";

import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: 'transparent',
    '& fieldset': {
      border: '2px solid #ffffff',
    },
    '&:hover fieldset': {
      border: '2px solid #ffffff',
    },
    '&.Mui-focused fieldset': {
      border: '2px solid #2BBBD8',
    },
  },
  '& .MuiInputLabel-root': {
    display: 'none', // Hide the label since we use custom labels
  },
}));

const StyledTextFieldSignup = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: 'transparent',
    '& fieldset': {
      border: '2px solid #fafafa',
    },
    '&:hover fieldset': {
      border: '2px solid #fafafa',
    },
    '&.Mui-focused fieldset': {
      border: '2px solid #2BBBD8',
    },
  },
  '& .MuiInputLabel-root': {
    display: 'none', // Hide the label since we use custom labels
  },
}));

interface InputFieldProps extends Omit<TextFieldProps, 'variant'> {
  isSignup?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  isSignup = false, 
  ...props 
}) => {
  const Component = isSignup ? StyledTextFieldSignup : StyledTextField;
  
  return (
    <Component
      variant="outlined"
      fullWidth
      sx={{
        height: '58px',
        '& .MuiInputBase-root': {
          height: '58px',
        },
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        ...props.sx
      }}
      {...props}
    />
  );
};