"use client"

import React from 'react';
import { Box, Stack, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BillingCard } from './BillingCard';
import { BillingInfo } from '../../../types/dashboard';

const BillingSectionContainer = styled(Box)(() => ({
  padding: '20px',
  marginTop: '20px'
}));

const BillingDivider = styled(Divider)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[300]}`,
  margin: '20px 0'
}));

interface BillingSectionProps {
  billingInfo: BillingInfo;
}

export const BillingSection: React.FC<BillingSectionProps> = ({ billingInfo }) => {
  const handleButtonClick = (action: string) => {
    console.log(`Billing action: ${action}`);
    // Handle billing actions here
  };

  return (
    <BillingSectionContainer>
      <BillingDivider />
      
      <Stack direction="row" spacing={3} sx={{ justifyContent: 'flex-start' }}>
        <BillingCard
          type="usage"
          title="今月のご利用金額"
          subtitle={billingInfo.period}
          amount={billingInfo.currentMonthUsage}
          buttonText="詳細はこちら"
          onButtonClick={() => handleButtonClick('details')}
        />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <BillingCard
                type="payment"
                title="お支払い設定"
                subtitle={billingInfo.period}
                paymentMethod={billingInfo.paymentMethod}
                buttonText="お支払い設定"
                onButtonClick={() => handleButtonClick('payment')}
              />
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <BillingCard
                type="charge"
                title="チャージ残高"
                amount={billingInfo.chargeBalance}
                buttonText="チャージ"
                onButtonClick={() => handleButtonClick('charge')}
              />
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <BillingCard
                type="coupon"
                title="クーポン残高"
                amount={billingInfo.couponBalance}
                buttonText="クーポン登録"
                onButtonClick={() => handleButtonClick('coupon')}
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </BillingSectionContainer>
  );
};