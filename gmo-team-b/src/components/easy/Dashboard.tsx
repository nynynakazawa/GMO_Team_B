"use client"

import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SidebarNavigation } from './SidebarNavigation';
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
  return (
    <DashboardContainer>
      <SidebarNavigation />
      
      <MainContent>
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