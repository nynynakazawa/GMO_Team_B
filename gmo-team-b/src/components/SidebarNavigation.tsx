import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 165,
  height: '100vh',
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column'
}));

const LogoContainer = styled(Box)(() => ({
  height: 78,
  marginBottom: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const AddServerButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '0px',
  height: 46,
  fontSize: '14px',
  fontFamily: '"Noto Sans", sans-serif',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}));

const NavList = styled(List)(() => ({
  padding: 0,
  flex: 1
}));

const NavListItem = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1),
  color: theme.palette.primary.main,
  fontSize: '14px',
  fontFamily: '"Noto Sans", sans-serif',
  '&.active': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main
  }
}));

const menuItems = [
  { id: 'dashboard', label: 'ダッシュボード', active: true },
  { id: 'server', label: 'サーバー', active: false },
  { id: 'storage', label: 'ストレージ', active: false },
  { id: 'image', label: 'イメージ', active: false },
  { id: 'security', label: 'セキュリティ', active: false }
];

export const SidebarNavigation: React.FC = () => {
  return (
    <SidebarContainer>
      <LogoContainer>
        <img 
          src="/images/conoha-logo.png" 
          alt="ConoHa Logo" 
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </LogoContainer>
      
      <AddServerButton
        startIcon={<AddIcon />}
        fullWidth
      >
        サーバー追加
      </AddServerButton>
      
      <NavList>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <NavListItem className={item.active ? 'active' : ''}>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontFamily: '"Noto Sans", sans-serif'
                }}
              />
            </NavListItem>
          </ListItem>
        ))}
      </NavList>
    </SidebarContainer>
  );
};