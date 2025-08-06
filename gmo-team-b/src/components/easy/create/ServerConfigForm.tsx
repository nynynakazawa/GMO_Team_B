"use client";

import React from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
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
  onServerNameChange: (name: string) => void;
  onCreateServer: () => void;
}

export const ServerConfigForm: React.FC<ServerConfigFormProps> = ({
  serverName,
  onServerNameChange,
  onCreateServer,
}) => {
  return (
    <SectionContainer>
      <SectionTitle>サーバー名を設定</SectionTitle>

      <FormContainer spacing={3}>
        <InputRow direction="row">
          <InputLabel>サーバー名：</InputLabel>
          <StyledTextField
            value={serverName}
            onChange={(e) => onServerNameChange(e.target.value)}
            placeholder="サーバー名を入力してください"
            variant="outlined"
          />
        </InputRow>

        <CreateButton onClick={onCreateServer}>作成</CreateButton>
      </FormContainer>
    </SectionContainer>
  );
};
