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
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: { xs: 'center', md: 'center' }, 
      gap: { xs: 1, md: 2 },
      width: { xs: '100%', md: 'auto' }
    }}>
      {/* First Row - Server Name and Edit Icon */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: { xs: 'center', md: 'flex-start' },
        gap: 1,
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        width: { xs: '100%', md: 'auto' }
      }}>
        {isEditing ? (
          <>
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
                minWidth: '150px'
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
          </>
        ) : (
          <>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'medium',
                fontSize: { xs: '1.7rem', md: '2.0rem' }
              }}
            >
              {serverName}
            </Typography>
            <IconButton 
              size="small" 
              sx={{ color: '#19B8D7' }}
              onClick={onEdit}
            >
              <Edit fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>
      
      {/* Second Row - IP Address */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: { xs: 'center', md: 'center' },
        gap: { xs: 2, md: 2 },
        width: { xs: '100%', md: 'auto' }
      }}>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 'medium',
            fontSize: { xs: '1.5rem', md: '1.125rem' },
            color: 'text.secondary'
          }}
        >
          {ipAddress}
        </Typography>
      </Box>
    </Box>
  );
} 