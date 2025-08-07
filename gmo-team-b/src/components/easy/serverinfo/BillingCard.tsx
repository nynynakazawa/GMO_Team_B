"use client"

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const CardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  color: theme.palette.primary.contrastText,
  minHeight: 145
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Iceland',
  fontSize: '18px',
  fontWeight: 400,
  color: theme.palette.grey[400],
  marginBottom: theme.spacing(0.5)
}));

const CardSubtitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Iceland',
  fontSize: '18px',
  fontWeight: 400,
  color: theme.palette.grey[400],
  marginBottom: theme.spacing(1)
}));

const CardAmount = styled(Typography)(() => ({
  fontFamily: 'Iceland',
  fontSize: '50px',
  fontWeight: 400,
  color: '#000000',
  lineHeight: 1
}));

const CardButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: theme.palette.primary.contrastText,
  fontFamily: 'Iceland',
  fontSize: '14px',
  textTransform: 'none',
  marginTop: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  }
}));

const PaymentMethodText = styled(Typography)(() => ({
  fontFamily: 'Iceland',
  fontSize: '24px',
  fontWeight: 400,
  color: '#000000',
  marginTop: 8
}));

interface BillingCardProps {
  type: 'usage' | 'payment' | 'charge' | 'coupon';
  title: string;
  subtitle?: string;
  amount?: string;
  buttonText?: string;
  paymentMethod?: string;
  onButtonClick?: () => void;
}

export const BillingCard: React.FC<BillingCardProps> = ({
  title,
  subtitle,
  amount,
  buttonText,
  paymentMethod,
  onButtonClick
}) => {
  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
      {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
      
      {paymentMethod && (
        <PaymentMethodText>{paymentMethod}</PaymentMethodText>
      )}
      
      {amount && <CardAmount>{amount}</CardAmount>}
      
      {buttonText && (
        <CardButton onClick={onButtonClick} fullWidth>
          {buttonText}
        </CardButton>
      )}
    </CardContainer>
  );
};