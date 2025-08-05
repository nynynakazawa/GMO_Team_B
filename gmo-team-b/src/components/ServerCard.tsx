import React from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import TerminalIcon from '@mui/icons-material/Terminal';
import RefreshIcon from '@mui/icons-material/Refresh';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { type ServerInfo } from '../types/dashboard';

const ServerCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  border: `2px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  marginBottom: theme.spacing(1),
  minHeight: 46
}));

const StatusIndicator = styled(Box)(({ theme }) => ({
  width: 24,
  height: 22,
  backgroundColor: theme.palette.grey[300],
  borderRadius: 3,
  marginRight: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StatusDot = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: '#4caf50' // Green for running status
}));

const ServerInfoContainer = styled(Box)(() => ({
  flex: 1,
  marginLeft: 8
}));

const ServerName = styled(Typography)(() => ({
  fontSize: '14px',
  fontWeight: 400,
  color: '#000000'
}));

const ActionButtons = styled(Stack)(() => ({
  direction: 'row',
  spacing: 1
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  '& .MuiSvgIcon-root': {
    fontSize: '18px',
    color: theme.palette.primary.main
  }
}));

interface ServerCardProps {
  server: ServerInfo;
  onAction: (action: string, serverId: string) => void;
}

export const ServerCard: React.FC<ServerCardProps> = ({ server, onAction }) => {
  return (
    <ServerCardContainer>
      <StatusIndicator>
        <StatusDot />
      </StatusIndicator>
      
      <ServerInfoContainer>
        <ServerName>
          {server.name} ({server.ip})
        </ServerName>
      </ServerInfoContainer>

      <ActionButtons direction="row" spacing={1}>
        <ActionButton 
          onClick={() => onAction('details', server.id)}
          title="詳細情報"
        >
          <SettingsIcon />
        </ActionButton>
        
        <ActionButton 
          onClick={() => onAction('console', server.id)}
          title="コンソール"
        >
          <TerminalIcon />
        </ActionButton>
        
        <ActionButton 
          onClick={() => onAction('restart', server.id)}
          title="再起動"
        >
          <RefreshIcon />
        </ActionButton>
        
        <ActionButton 
          onClick={() => onAction('shutdown', server.id)}
          title="シャットダウン"
        >
          <PowerSettingsNewIcon />
        </ActionButton>
      </ActionButtons>
    </ServerCardContainer>
  );
};