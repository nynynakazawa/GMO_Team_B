"use client"

import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeaderContainer = styled(Box)(() => ({
  height: 78,
  backgroundColor: '#f5f5f5',
  borderBottom: '1px solid #e0e0e0'
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  height: '100%',
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 500,
  textTransform: 'none',
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main
  }
}));

const tabs = [
  { id: 'vps', label: 'VPS' },
  { id: 'wing', label: 'WING' },
  { id: 'game', label: 'GAME' },
  { id: 'ai', label: 'AI' },
  { id: 'pencil', label: 'Pencil' }
];

export const HeaderTabs: React.FC = () => {
  const [value, setValue] = React.useState(2); // GAME tab is active

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <HeaderContainer>
      <StyledTabs value={value} onChange={handleChange}>
        {tabs.map((tab) => (
          <StyledTab key={tab.id} label={tab.label} />
        ))}
      </StyledTabs>
    </HeaderContainer>
  );
};