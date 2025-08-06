import React from 'react';
import Image from 'next/image';
import { Box, List, ListItem, ListItemButton, ListItemText, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaServer, FaCompactDisc, FaFolder } from "react-icons/fa";
import { FaNetworkWired, FaKey } from "react-icons/fa6";
import { GrDomain } from "react-icons/gr";
import { HiServer } from "react-icons/hi2";
import { IoIosAdd, IoIosPaper,IoLogoGameControllerB} from "react-icons/io";
import { MdLanguage } from "react-icons/md";



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
  { id: 'dashboard', label: 'ダッシュボード', icon: <IoLogoGameControllerB size={20} color="white"/>},
  { id: 'addserver', label: 'サーバー追加', icon: <IoIosAdd size={20} color="white"/> },
  { id: 'server', label: 'サーバー', icon: <FaServer size={20} color="white"/> },
  { id: 'storage', label: 'ストレージ', icon: <HiServer size={20} color="white"/> },
  { id: 'image', label: 'イメージ', icon: <FaCompactDisc size={20}color="white" /> },
  { id: 'network', label: 'ネットワーク', icon: <FaNetworkWired size={20}color="white" /> },
  { id: 'security', label: 'セキュリティ', icon: <FaKey size={20} color="white"/> },
  { id: 'object-storage', label: 'オブジェクトストレージ', icon: <FaFolder size={20}color="white" /> },
  { id: 'dns', label: 'DNS', icon: <MdLanguage size={20} color="white"/> },
  { id: 'license', label: 'ライセンス', icon: <IoIosPaper size={20} color="white"/> },
  { id: 'domain', label: 'ドメイン', icon: <GrDomain size={20}color="white" /> },
  { id: 'api', label: 'API', icon: <GrDomain size={20} color="white"/> }
];
export const SidebarNavigation: React.FC = () => {
  return (
    <SidebarContainer>
      <LogoContainer>
        <Image 
          src="/images/conoha-logo.png" 
          alt="ConoHa Logo" 
          width={165} 
          height={78}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </LogoContainer>
      

      
      <NavList>
         {menuItems.map((item) => (
    <ListItem key={item.id} disablePadding>
      <NavListItem className={item.active ? 'active' : ''}>
        <Stack direction="row" spacing={1} alignItems="center">
          {item.icon}
          <ListItemText 
            primary={item.label}
            primaryTypographyProps={{
              fontSize: '14px',
              fontFamily: '"Noto Sans", sans-serif',
              color: 'white'
            }}
          />
        </Stack>
      </NavListItem>
    </ListItem>
  ))}
      </NavList>
    </SidebarContainer>
  );
};