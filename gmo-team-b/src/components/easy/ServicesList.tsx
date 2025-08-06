import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ServerCard } from './ServerCard';
import { ServerInfo } from '../../types/dashboard';
import GamepadIcon from '@mui/icons-material/Gamepad';

const ServicesContainer = styled(Box)(() => ({
  margin: '20px 0'
}));

const ServicesHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1, 2)
}));

const ServicesTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 500,
  color: theme.palette.text.primary,
  marginLeft: theme.spacing(1)
}));

const ServerListContainer = styled(Box)(() => ({
  padding: '0 20px'
}));

interface ServicesListProps {
  servers: ServerInfo[];
}

export const ServicesList: React.FC<ServicesListProps> = ({ servers }) => {
  const handleServerAction = (action: string, serverId: string) => {
    console.log(`Action: ${action} on server: ${serverId}`);
    // Handle server actions here
  };

  return (
    <ServicesContainer>
      <ServicesHeader>
        <GamepadIcon color="primary" />
        <ServicesTitle>サービス</ServicesTitle>
        <Box sx={{ flex: 1 }} />
        <Typography 
          variant="body2" 
          sx={{ color: 'primary.main', cursor: 'pointer' }}
        >
          サーバー一覧 →
        </Typography>
      </ServicesHeader>

      <ServerListContainer>
        <Stack spacing={1}>
          {servers.map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              onAction={handleServerAction}
            />
          ))}
        </Stack>
      </ServerListContainer>
    </ServicesContainer>
  );
};