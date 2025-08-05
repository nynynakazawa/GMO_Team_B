"use client"

import React, { useState } from 'react'
import { Box,Button, Typography, Stack, Paper } from '@mui/material'
import { InputField } from './InputField'
import { ActionButton } from './ActionButton'
import { LinkText } from './LinkText'

import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";



interface LoginFormProps {
  onLogin?: (email: string, password: string) => void
  onForgotPassword?: () => void
  onCreateAccount?: () => void
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleSubmit = (e: React.FormEvent) => {
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

    if (isValid) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // ログイン成功時の処理
          const user = userCredential.user;
          console.log("ログイン成功:", user);
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
    <Paper
      elevation={1}
      sx={{
        borderRadius: '10px',
        padding: '60px 40px 60px 40px',
        backgroundColor: '#ffffff',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      <Stack spacing={2} alignItems="center">
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: '28px',
            fontWeight: 600,
            color: '#000000',
            marginBottom: '32px'
          }}
        >
          ログイン
        </Typography>


        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Stack spacing={2.5}>
            {/* Email Field */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography
                sx={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#000000',
                  minWidth: '100px'
                }}
              >
                メールアドレス : 
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <InputField
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                />
              </Box>
            </Stack>

            {/* Password Field */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography
                sx={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#000000',
                  minWidth: '100px'
                }}
              >
                パスワード : 
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <InputField
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </Box>
              
            </Stack>
        <Box sx={{ display: 'flex',  justifyContent: 'flex-start', marginTop: '16px' }}>
  <Button
    variant="outlined"
    startIcon={<GoogleIcon />}
    onClick={signInWithGoogle}
    sx={{
      textTransform: 'none',
      fontWeight: 500,
      fontFamily: "'Noto Sans', sans-serif",
    }}
  >
    Googleでログイン
  </Button>
</Box>
            {/* Navigation Links */}
            <Stack spacing={1} sx={{ marginTop: '24px' }}>
              <LinkText onClick={onCreateAccount}>
                ＞新規アカウント登録はこちらから
              </LinkText>
              <LinkText onClick={onForgotPassword}>
                ＞パスワードを忘れた方はこちら
              </LinkText>
            </Stack>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
              <ActionButton type="submit" disabled={!isFormValid}>
                ログイン
              </ActionButton>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  )
}
