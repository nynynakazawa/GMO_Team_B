"use client"

import React, { useState } from 'react'
import { Box,Button, Typography, Stack, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { InputField } from './ui/InputField'
import { ActionButton } from './ui/ActionButton'
import { LinkText } from './ui/LinkText'
import GoogleIcon from "@mui/icons-material/Google"; 
import { signInWithGoogle } from "./firebaseAuth"
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext';

// createページのパターンに合わせたstyled components
const FormPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '10px',
  padding: '60px 40px',
  backgroundColor: '#ffffff',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  [theme.breakpoints.down('md')]: {
    padding: '40px 30px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '20px 16px',
  },
}));

const FormStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  [theme.breakpoints.down('sm')]: {
    spacing: 1.5,
  },
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Noto Sans', sans-serif",
  fontSize: '28px',
  fontWeight: 600,
  color: '#000000',
  marginBottom: '32px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '22px',
    marginBottom: '20px',
  },
}));

const FieldStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
  },
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  fontFamily: "'Noto Sans', sans-serif",
  fontSize: '20px',
  fontWeight: 500,
  color: '#000000',
  width: '180px',
  textAlign: 'right',
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
    width: '100%',
    textAlign: 'left',
  },
}));

const FieldBox = styled(Box)(({ theme }) => ({
  width: '350px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

//サーバー一覧の型定義
export type Server = {
  id: string;
  name: string;
  links: { rel: string; href: string }[];
};

export type ServersResponse = {
  servers: Server[];
};

interface LoginFormProps {
  onLogin?: (email: string, password: string) => void
  onForgotPassword?: () => void
  onCreateAccount?: () => void
}

//サーバー一覧の取得
export async function getConohaServers(): Promise<Server[]> {
  const token = process.env.NEXT_PUBLIC_API_TOKEN;
  if (!token) {
    throw new Error('環境変数 `token` が未設定です（.env.local を確認してください）');
  }

  const res = await fetch('/api/conoha/v2.1/servers', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-Auth-Token': token,
    },
  });

  if (!res.ok) {
    throw new Error(`ConoHa servers fetch failed: ${res.status} ${res.statusText}`);
  }

  const json: ServersResponse = await res.json();
  return json.servers;
}

//サーバー一覧からサーバーの有無
export async function judgeServer(){
  const servers = await getConohaServers();
    return servers.some(server => server.id != null && server.id !== '');
}


export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onForgotPassword,
  onCreateAccount
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setEmailError('')
    setPasswordError('')

    let isValid = true

    if (!email) {
      setEmailError('メールアドレスを入力してください')
      isValid = false
    } else if (!validateEmail(email)) {
      setEmailError('有効なメールアドレスを入力してください')
      isValid = false
    }

    if (!password) {
      setPasswordError('パスワードを入力してください')
      isValid = false
    } else if (!validatePassword(password)) {
      setPasswordError('パスワードは6文字以上で入力してください')
      isValid = false
    }

    //トークン情報をconsole.logに表示
    const server_log = await getConohaServers();
    //サーバーの有無
    const server = await judgeServer()

    if (isValid) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // ログイン成功時の処理
          const user = userCredential.user;
          console.log("ログイン成功:", user);
          console.log("ログインユーザーのメールアドレス:", user.email)
          console.log("ログインユーザーのパスワード:", password)
          console.log("トークン:", server_log)
          localStorage.setItem('user_email', user.email || '');
          localStorage.setItem('user_password', password);
          
          // リダイレクト先を確認
          const urlParams = new URLSearchParams(window.location.search);
          const redirectPath = urlParams.get('redirect');
          
          if (redirectPath) {
            router.push(redirectPath);
          } else if (server) {
            router.push("/easy/serverinfo");
          } else {
            router.push("/easy/create");
          }
          
          if (onLogin) {
            onLogin(email, password);
          }
        })
        .catch((error) => {
          // エラー処理
          console.error("ログインエラー:", error);
          setEmailError("ログインに失敗しました。メールアドレスまたはパスワードを確認してください。");
        });
    }
  }

  const isFormValid = email && password && validateEmail(email) && validatePassword(password)

  return (
    <FormPaper elevation={1}>
      <FormStack spacing={{ xs: 1.5, md: 2 }}>
        {/* Title */}
        <FormTitle variant="h4">
          ログイン
        </FormTitle>


        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Stack spacing={{ xs: 2, md: 2.5 }} alignItems="center">
            {/* Email Field */}
            <FieldStack>
              <FieldLabel>
                メールアドレス : 
              </FieldLabel>
              <FieldBox>
                <InputField
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                />
              </FieldBox>
            </FieldStack>

            {/* Password Field */}
            <FieldStack>
              <FieldLabel>
                パスワード : 
              </FieldLabel>
              <FieldBox>
                <InputField
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </FieldBox>
            </FieldStack>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: { xs: '12px', md: '16px' } }}>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={signInWithGoogle}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: { xs: '14px', sm: '16px', md: '18px' },
              padding: { xs: '8px 16px', md: '10px 20px' },
            }}
          >
            Googleでログイン
          </Button>
        </Box>
            {/* Navigation Links */}
            <Stack spacing={{ xs: 0.5, md: 1 }} sx={{ marginTop: { xs: '12px', md: '20px' }, alignItems: 'center' }}>
              <LinkText onClick={onCreateAccount}>
                ＞新規アカウント登録はこちらから
              </LinkText>
              <LinkText onClick={onForgotPassword}>
                ＞パスワードを忘れた方はこちら
              </LinkText>
            </Stack>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: { xs: '16px', md: '24px' } }}>
              <ActionButton type="submit" disabled={!isFormValid}>
                ログイン
              </ActionButton>
            </Box>
          </Stack>
        </Box>
      </FormStack>
    </FormPaper>
  )
}
