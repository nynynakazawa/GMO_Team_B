"use client"

import React, { useState } from 'react'
import { Box, Typography, Stack, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { InputField } from './ui/InputField'
import { ActionButton } from './ui/ActionButton'
import { LinkText } from './ui/LinkText'
import { AuthError } from 'firebase/auth'

import { signUpWithEmailAndPassword } from './firebaseAuth'

// createページのパターンに合わせたstyled components
const FormPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '10px',
  padding: '60px 40px',
  backgroundColor: '#fafafa',
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
  fontSize: '16px',
  fontWeight: 500,
  color: '#000000',
  minWidth: '100px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    minWidth: 'auto',
  },
}));

const FieldBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

// カスタムエラー型の定義
type FirebaseAuthError = {
  code: string;
  message: string;
}

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
      } catch (error: AuthError | any) {
        // エラー処理
        if (error && typeof error === 'object' && 'code' in error) {
          const authError = error as FirebaseAuthError;
          if (authError.code === 'auth/email-already-in-use') {
            setEmailError('このメールアドレスは既に使用されています')
          } else {
            setPasswordError('サインアップに失敗しました')
          }
        } else {
          setPasswordError('サインアップに失敗しました')
        }
      }
    }
  }

  const isFormValid = email && password && validateEmail(email) && validatePassword(password)

  return (
    <FormPaper elevation={1}>
      <FormStack spacing={{ xs: 1.5, md: 2 }}>
        {/* Title */}
        <FormTitle variant="h4">
          サインアップ
        </FormTitle>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Stack spacing={{ xs: 2, md: 2.5 }}>
            {/* Email Field */}
            <FieldStack>
              <FieldLabel>
                メールアドレス : 
              </FieldLabel>
              <FieldBox>
                <InputField
                  isSignup
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
                  isSignup
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </FieldBox>
            </FieldStack>

            {/* Terms Agreement */}
            <Box sx={{ marginTop: { xs: '16px', md: '20px' } }}>
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
            <Box sx={{ marginTop: { xs: '8px', md: '12px' } }}>
              <LinkText onClick={onExistingAccount}>
                ＞すでにアカウントがある方はこちらから
              </LinkText>
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: { xs: '16px', md: '24px' } }}>
              <ActionButton type="submit" disabled={!isFormValid}>
                次へ
              </ActionButton>
            </Box>
          </Stack>
        </Box>
      </FormStack>
    </FormPaper>
  )
}
