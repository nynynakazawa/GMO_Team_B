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
      justifyContent: 'space-between', 
      alignItems: 'center', 
      py: 2, 
      px: 3,
      borderBottom: borderWidth,
      width: '100%'
    }}>
      {/* 左側の項目 */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '140px' }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 0.8, justifyContent: 'flex-end' }}>
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
                }}
              />
            ) : (
              <>
                <Typography variant="body2">{editValue}</Typography>
                <IconButton
                  size="small"
                  sx={{ color: '#19B8D7' }}
                  onClick={() => setIsEditing(true)}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </>
            )
          ) : (
            <Typography variant="body2">
              {leftValue !== undefined ? leftValue : leftItem.value}
            </Typography>
          )}
        </Box>
      </Box>
      
      {/* 右側の項目 */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-start', pl: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '140px' }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 0.8, justifyContent: 'flex-end' }}>
          {rightSwitch ? (
            <>
              <Typography variant="body2" sx={{ color: rightSwitch.checked ? '#19B8D7' : 'text.secondary' }}>
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
              <Typography variant="body2">
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