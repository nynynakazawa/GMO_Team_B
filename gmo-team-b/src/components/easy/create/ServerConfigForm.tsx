"use client";

import React from "react";
import { Box, Typography, TextField, Button, Stack, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const SectionContainer = styled(Box)(() => ({
  marginBottom: 40,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "36px",
  fontWeight: 400,
  fontFamily: "Iceland",
  color: theme.palette.primary.main,
  marginBottom: 20,
}));

const FormContainer = styled(Stack)(() => ({
  spacing: 3,
  alignItems: "flex-start",
}));

const InputRow = styled(Stack)(() => ({
  alignItems: "center",
  spacing: 2,
  width: "100%",
}));

const InputLabel = styled(Typography)(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 400,
  fontFamily: '"Noto Sans", sans-serif',
  color: theme.palette.text.primary,
  minWidth: 135,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  maxWidth: 902,
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `2px solid ${theme.palette.grey[300]}`,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    "& fieldset": {
      border: "none",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "18px",
    fontFamily: '"Noto Sans", sans-serif',
    padding: "16px",
  },
  "& .MuiInputBase-input::placeholder": {
    color: theme.palette.grey[400],
    opacity: 1,
  },
}));

const CreateButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: "32px",
  fontWeight: 400,
  fontFamily: '"Noto Sans", sans-serif',
  textTransform: "none",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5, 4),
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  marginTop: theme.spacing(3),
  alignSelf: "center",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.3)",
  },
}));

interface ServerConfigFormProps {
  serverName: string;
  password: string;
  onServerNameChange: (name: string) => void;
  onPasswordChange: (password: string) => void;
  onCreateServer: () => void;
  loading?: boolean;
  validationErrors?: {
    serverName: boolean;
    password: boolean;
  };
}

export const ServerConfigForm: React.FC<ServerConfigFormProps> = ({
  serverName,
  password,
  onServerNameChange,
  onPasswordChange,
  onCreateServer,
  loading = false,
  validationErrors,
}) => {
  return (
    <SectionContainer>
      <SectionTitle>サーバー設定</SectionTitle>

      <FormContainer spacing={3}>
        <InputRow direction="row">
          <InputLabel sx={{ color: validationErrors?.serverName ? 'error.main' : 'text.primary' }}>
            サーバー名：
          </InputLabel>
          <StyledTextField
            value={serverName}
            onChange={(e) => {
              // 英数字のみを許可
              const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
              onServerNameChange(value);
            }}
            placeholder="英数字で設定"
            variant="outlined"
            inputProps={{
              maxLength: 20
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderColor: validationErrors?.serverName ? 'error.main' : undefined,
              }
            }}
          />
          {validationErrors?.serverName && (
            <Typography variant="body2" color="error.main" sx={{ fontSize: '14px', ml: 2 }}>
              入力が必要です
            </Typography>
          )}
        </InputRow>

        <InputRow direction="row">
          <InputLabel sx={{ color: validationErrors?.password ? 'error.main' : 'text.primary' }}>
            パスワード：
          </InputLabel>
          <StyledTextField
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="パスワードを入力してください 大小英数字記号を含める必要があります"
            variant="outlined"
            inputProps={{
              minLength: 8,
              maxLength: 50
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderColor: validationErrors?.password ? 'error.main' : undefined,
              }
            }}
          />
          {validationErrors?.password && (
            <Typography variant="body2" color="error.main" sx={{ fontSize: '14px', ml: 2 }}>
              入力が必要です
            </Typography>
          )}
        </InputRow>

        <CreateButton 
          onClick={onCreateServer} 
          disabled={loading || !serverName || !password}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? '作成中...' : '作成'}
        </CreateButton>
      </FormContainer>
    </SectionContainer>
  );
};
