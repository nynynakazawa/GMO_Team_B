import React from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Edit,
  Clear,
} from '@mui/icons-material';

interface ServerNameEditorProps {
  serverName: string;
  ipAddress: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ServerNameEditor({
  serverName,
  ipAddress,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: ServerNameEditorProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {/* サーバー名とペンアイコン */}
      {isEditing ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <input
            type="text"
            value={serverName}
            onChange={onChange}
            style={{
              border: '1px solid #19B8D7',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '16px',
              fontWeight: '500',
              outline: 'none',
              minWidth: '200px'
            }}
            autoFocus
          />
          <IconButton 
            size="small" 
            sx={{ color: '#19B8D7' }}
            onClick={onSave}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ color: 'text.secondary' }}
            onClick={onCancel}
          >
            <Clear fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {serverName}
          </Typography>
          <IconButton 
            size="small" 
            sx={{ color: '#19B8D7' }}
            onClick={onEdit}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Box>
      )}
      
      {/* IPアドレス */}
      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
        {ipAddress}
      </Typography>
    </Box>
  );
} 