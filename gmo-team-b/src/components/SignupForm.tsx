"use client"

import React, { useState } from 'react'
import { Box, Typography, Stack, Paper } from '@mui/material'
import { InputField } from './InputField'
import { ActionButton } from './ActionButton'
import { LinkText } from './LinkText'

import { signUpWithEmailAndPassword } from './firebaseAuth'

interface SignupFormProps {
  onLogin: (email: string, password: string) => void
  onExistingAccount?: () => void
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onExistingAccount
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

    if (isValid) {
      try {
        await signUpWithEmailAndPassword(email, password)
        // サインアップ成功後の処理（例: ダッシュボードへリダイレクト）
      } catch (error) {
        // エラー処理
        if (error.code === 'auth/email-already-in-use') {
          setEmailError('このメールアドレスは既に使用されています')
        } else {
          setPasswordError('サインアップに失敗しました')
        }
      }
    }
  }

  const isFormValid = email && password && validateEmail(email) && validatePassword(password)

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: '10px',
        padding: '60px 40px 60px 40px',
        backgroundColor: '#fafafa',
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
          サインアップ
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
                  isSignup
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
                  isSignup
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </Box>
            </Stack>

            {/* Terms Agreement */}
            <Box sx={{ marginTop: '20px' }}>
              <Typography
                sx={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#000000',
                  lineHeight: 1.5
                }}
              >
                ConoHa会員規約、ConoHaドメイン登録規約、<br />
                ConoHaチャージ利用規約及び個人情報の取り扱いについてに同意の上、<br />
                「次へ」ボタンを押してください。
              </Typography>
            </Box>

            {/* Navigation Link */}
            <Box sx={{ marginTop: '12px' }}>
              <LinkText onClick={onExistingAccount}>
                ＞すでにアカウントがある方はこちらから
              </LinkText>
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
              <ActionButton type="submit" disabled={!isFormValid}>
                次へ
              </ActionButton>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  )
}
