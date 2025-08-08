import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Switch,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Clear,
  ContentCopy,
  HelpOutline,
} from '@mui/icons-material';
import { ServerSetting } from '../../../data/serverInfoMockData';

interface ServerSettingsRowProps {
  leftItem: ServerSetting;
  rightItem: ServerSetting;
  leftValue?: string | boolean;
  rightValue?: string | boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftOnClick?: () => void;
  rightOnClick?: () => void;
  leftSwitch?: {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  rightSwitch?: {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  isLastRow?: boolean;
  customBorderWidth?: string;
  onNameTagChange?: (newValue: string) => void;
}

export default function ServerSettingsRow({
  leftItem,
  rightItem,
  leftValue,
  rightValue,
  leftIcon,
  rightIcon,
  leftOnClick,
  rightOnClick,
  leftSwitch,
  rightSwitch,
  isLastRow = false,
  customBorderWidth,
  onNameTagChange,
}: ServerSettingsRowProps) {
 const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(leftItem.value as string);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const borderWidth = customBorderWidth || (isLastRow ? 'none' : '1px solid #e0e0e0');
  useEffect(() => {
    setEditValue(leftItem.value as string);
  }, [leftItem.value]);
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      justifyContent: { xs: 'flex-start', md: 'space-between' }, 
      alignItems: { xs: 'stretch', md: 'center' }, 
      py: 2, 
      px: { xs: 2, md: 3 },
      borderBottom: borderWidth,
      width: '100%',
      gap: { xs: 2, md: 0 }
    }}>
      {/* 左側の項目 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        flex: { xs: 'none', md: 1 },
        justifyContent: 'space-between',
        width: { xs: '100%', md: 'auto' }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: 'auto', md: '140px' } }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: { xs: '0.875rem', md: '0.875rem' } }}>
            {leftItem.label}
          </Typography>
          {leftItem.help && (
            <Tooltip title={leftItem.help}>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <HelpOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: { xs: 1, md: 0.8 }, justifyContent: 'flex-end' }}>
          {leftItem.label === 'ネームタグ' ? (
            isEditing ? (
              <input
                type="text"
                value={editValue}
                autoFocus
                onChange={e => setEditValue(e.target.value)}
                onBlur={() => {
                  setIsEditing(false);
                  if (onNameTagChange) onNameTagChange(editValue);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setIsEditing(false);
                    if (onNameTagChange) onNameTagChange(editValue);
                  }
                }}
                style={{
                  fontSize: '14px',
                  padding: '4px 6px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  minWidth: '120px',
                  maxWidth: '200px',
                }}
              />
            ) : (
              <>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '0.875rem' } }}>
                  {editValue}
                </Typography>
                <IconButton
                  size="small"
                  sx={{ color: '#19B8D7' }}
                  onClick={() => setIsEditing(true)}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </>
            )
          ) : leftSwitch ? (
            <>
              <Typography variant="body2" sx={{ 
                color: leftSwitch.checked ? '#19B8D7' : 'text.secondary',
                fontSize: { xs: '0.875rem', md: '0.875rem' }
              }}>
                {leftSwitch.checked ? '有効' : '無効'}
              </Typography>
              <Switch
                checked={leftSwitch.checked}
                onChange={leftSwitch.onChange}
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
            </>
          ) : (
            <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '0.875rem' } }}>
              {leftValue !== undefined ? leftValue : leftItem.value}
            </Typography>
          )}
        </Box>
      </Box>
      
      {/* 右側の項目 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        flex: { xs: 'none', md: 1 }, 
        justifyContent: 'space-between', 
        pl: { xs: 0, md: 4 },
        width: { xs: '100%', md: 'auto' }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: 'auto', md: '140px' } }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: { xs: '0.875rem', md: '0.875rem' } }}>
            {rightItem.label}
          </Typography>
          {rightItem.help && (
            <Tooltip title={rightItem.help}>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <HelpOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: { xs: 1, md: 0.8 }, justifyContent: 'flex-end' }}>
          {rightSwitch ? (
            <>
              <Typography variant="body2" sx={{ 
                color: rightSwitch.checked ? '#19B8D7' : 'text.secondary',
                fontSize: { xs: '0.875rem', md: '0.875rem' }
              }}>
                {rightSwitch.checked ? '有効' : '無効'}
              </Typography>
              <Switch
                checked={rightSwitch.checked}
                onChange={rightSwitch.onChange}
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
            </>
          ) : (
            <>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '0.875rem' } }}>
                {rightValue !== undefined ? rightValue : rightItem.value}
              </Typography>
              {rightIcon || (
                rightItem.label === 'セキュリティグループ' || rightItem.label === '帯域' ? (
                  <IconButton size="small" sx={{ color: '#19B8D7' }}>
                    <Edit fontSize="small" />
                  </IconButton>
                ) : (
                  <>
                  </>
                )
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}