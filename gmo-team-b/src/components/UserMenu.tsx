import React from 'react';
import {
  Box,
  Typography,
  Switch,
  Divider,
  Paper,
  Link
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { logout } from './firebaseAuth';

interface UserMenuProps {
  isOpen: boolean;
  easyMode: boolean;
  onEasyModeChange: (checked: boolean) => void;
}

export default function UserMenu({
  isOpen,
  easyMode,
  onEasyModeChange,
}: UserMenuProps) {
  const router = useRouter();
  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: '60px',
        right: '16px',
        width: '200px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        overflow: 'hidden',
        animation: isOpen ? 'slideIn 0.2s ease-out' : 'slideOut 0.2s ease-in',
        '@keyframes slideIn': {
          '0%': {
            opacity: 0,
            transform: 'translateY(-10px) scale(0.95)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          },
        },
      }}
    >
      <Box sx={{ py: 1 }}>
        {/* Myサーバー */}
        <Link href="/easy/serverinfo">
        <Box sx={{ px: 3, py: 2, cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}>
          <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'center' }}>
            Myサーバー
          </Typography>
        </Box>
        </Link>
        
        <Divider sx={{ my: 0 }} />
        
        {/* 新規サーバー作成 */}
        <Box sx={{ px: 3, py: 2, cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}>
          <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'center' }}>
            新規サーバー作成
          </Typography>
        </Box>
        
        <Divider sx={{ my: 0 }} />
        
        {/* 簡単モード */}
        <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            簡単モード
          </Typography>
          <Switch
            checked={easyMode}
            onChange={(e) => onEasyModeChange(e.target.checked)}
            size="small"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#19B8D7',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#19B8D7',
              },
            }}
          />
        </Box>
        
        <Divider sx={{ my: 0 }} />
        
        {/* アカウント設定 */}
        <Link href="/account">
        <Box sx={{ px: 3, py: 2, cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}>
          <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'center' }}>
            アカウント設定
          </Typography>
        </Box>
        </Link>
        
        <Divider sx={{ my: 0 }} />
        
        {/* ログアウト */}
        <Box sx={{ px: 3, py: 2, cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }} onClick={handleLogout}>
          <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'center' }}>
            ログアウト
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
} 