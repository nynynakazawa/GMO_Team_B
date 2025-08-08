"use client"

import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SidebarNavigation } from '../nomal/SidebarNavigation';
import { HeaderTabs } from './HeaderTabs';
import { ProgressStepper } from './ProgressStepper';
import { ServicesList } from './ServicesList';
import { BillingSection } from './serverinfo/BillingSection';
import { DashboardProps } from '../../types/dashboard';

const DashboardContainer = styled(Box)(() => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f5f5f5'
}));

const MainContent = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column'
}));

const ContentArea = styled(Box)(() => ({
  flex: 1,
  padding: '0 20px',
  overflow: 'auto'
}));

export const Dashboard: React.FC<DashboardProps> = ({
  currentStep,
  servers,
  billingInfo
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <DashboardContainer sx={{
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      <SidebarNavigation />
      
      <MainContent sx={{
        width: isMobile ? '100%' : 'auto'
      }}>
        <HeaderTabs />
        
        <ContentArea>
          <ProgressStepper currentStep={currentStep} />
          <ServicesList servers={servers} />
          <BillingSection billingInfo={billingInfo} />
        </ContentArea>
      </MainContent>
    </DashboardContainer>
  );
};