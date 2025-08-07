"use client";

import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(() => ({
  borderRadius: '10px !important',
  '& .MuiFormControl-root': {
    borderRadius: '10px !important',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px !important',
    backgroundColor: 'transparent',
    '& fieldset': {
      border: '2px solid #ffffff',
      borderRadius: '10px !important',
    },
    '&:hover fieldset': {
      border: '2px solid #ffffff',
      borderRadius: '10px !important',
    },
    '&.Mui-focused fieldset': {
      border: '2px solid #2BBBD8',
      borderRadius: '10px !important',
    },
  },
  '& .MuiInputBase-root': {
    borderRadius: '10px !important',
  },
  '& .MuiInputLabel-root': {
    display: 'none', // Hide the label since we use custom labels
  },
}));

const StyledTextFieldSignup = styled(TextField)(() => ({
  borderRadius: '10px !important',
  '& .MuiFormControl-root': {
    borderRadius: '10px !important',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px !important',
    backgroundColor: 'transparent',
    '& fieldset': {
      border: '2px solid #fafafa',
      borderRadius: '10px !important',
    },
    '&:hover fieldset': {
      border: '2px solid #fafafa',
      borderRadius: '10px !important',
    },
    '&.Mui-focused fieldset': {
      border: '2px solid #2BBBD8',
      borderRadius: '10px !important',
    },
  },
  '& .MuiInputBase-root': {
    borderRadius: '10px !important',
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
          borderRadius: '10px',
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px',
        },
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        ...props.sx
      }}
      {...props}
    />
  );
};