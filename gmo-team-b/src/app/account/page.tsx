"use client"
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  IconButton,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import UserMenu from '../../components/easy/UserMenu';
import { Header } from "../../components/easy/Header";
const tabLabels = ['お支払い', 'アカウント設定', '過去の請求'];

export default function AccountPage() {
  const [tab, setTab] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Charge');
  const [twoFactor, setTwoFactor] = useState(false);
  const [newsLetter, setNewsLetter] = useState(true);
  const [lineNotify, setLineNotify] = useState(true);
  // UserMenu用の状態
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [easyMode, setEasyMode] = useState(true);
  const handleUserMenuToggle = () => setIsUserMenuOpen((prev) => !prev);
  const handleEasyModeChange = (checked: boolean) => setEasyMode(checked);
  const [savedEmail, setSavedEmail] = useState<string>('');
  const [savedPassword, setSavedPassword] = useState<string>('');

  // const savedEmail = localStorage.getItem("user_email");
  // const savedPassword = localStorage.getItem("user_password")
  // const maskedPassword = savedPassword
  // ? '*'.repeat(savedPassword.length)
  // : '';

    useEffect(() => {
    const email = localStorage.getItem("user_email") ?? '';
    const password = localStorage.getItem("user_password") ?? '';
    setSavedEmail(email);
    setSavedPassword(password);
  }, []);

    const maskedPassword = savedPassword
    ? '*'.repeat(savedPassword.length)
    : '';


  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* ヘッダー部分 */}
      {/* <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', p: 2, position: 'relative' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <IconButton 
                sx={{ bgcolor: '#e3f2fd', color: '#19B8D7' }}
                onClick={handleUserMenuToggle}
              >
                <Person />
              </IconButton>
              <UserMenu
                isOpen={isUserMenuOpen}
                easyMode={easyMode}
                onEasyModeChange={handleEasyModeChange}
              />
            </Box>
          </Box>
        </Container>
      </Box> */}
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper sx={{ width: "100%", borderRadius: "10px", boxShadow: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3, pt: 3 }}>
            <Typography
              variant="h5"
              sx={{ color: "#19B8D7", fontWeight: "bold", mb: 2 }}
            >
              アカウント情報
            </Typography>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: "medium",
                  fontSize: "1.1rem",
                },
                "& .Mui-selected": {
                  color: "#19B8D7",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#19B8D7",
                },
              }}
            >
              {tabLabels.map((label) => (
                <Tab key={label} label={label} />
              ))}
            </Tabs>
          </Box>
          <Box sx={{ p: 4 }}>
            {/* お支払いタブ */}
            {tab === 0 && (
              <Box>
                <Typography variant="h6" sx={{ color: "#19B8D7", mb: 2 }}>
                  ConoHaチャージ
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <TableContainer
                    component={Paper}
                    sx={{ mb: 2, borderRadius: "10px" }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{ color: "#19B8D7", fontWeight: "bold" }}
                          >
                            種別
                          </TableCell>
                          <TableCell
                            sx={{ color: "#19B8D7", fontWeight: "bold" }}
                          >
                            残高
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>チャージ</TableCell>
                          <TableCell>0円</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>株主優待</TableCell>
                          <TableCell>0円</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#19B8D7",
                      color: "white",
                      borderRadius: "10px",
                      px: 4,
                      fontWeight: "bold",
                    }}
                  >
                    チャージ
                  </Button>
                </Box>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6" sx={{ color: "#19B8D7", mb: 2 }}>
                  クレジットカード情報
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#19B8D7",
                      color: "white",
                      borderRadius: "10px",
                      px: 4,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    クレジットカード登録
                  </Button>
                  <TableContainer
                    component={Paper}
                    sx={{ borderRadius: "10px" }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{ color: "#19B8D7", fontWeight: "bold" }}
                          >
                            名義
                          </TableCell>
                          <TableCell
                            sx={{ color: "#19B8D7", fontWeight: "bold" }}
                          >
                            種類
                          </TableCell>
                          <TableCell
                            sx={{ color: "#19B8D7", fontWeight: "bold" }}
                          >
                            カード番号
                          </TableCell>
                          <TableCell
                            sx={{ color: "#19B8D7", fontWeight: "bold" }}
                          >
                            有効期限
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6" sx={{ color: "#19B8D7", mb: 2 }}>
                  支払方法
                </Typography>
                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <RadioGroup
                    row
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel
                      value="Credit"
                      control={
                        <Radio
                          sx={{
                            color: "#19B8D7",
                            "&.Mui-checked": { color: "#19B8D7" },
                          }}
                        />
                      }
                      label="クレジットカード払い"
                    />
                    <FormControlLabel
                      value="Charge"
                      control={
                        <Radio
                          sx={{
                            color: "#19B8D7",
                            "&.Mui-checked": { color: "#19B8D7" },
                          }}
                        />
                      }
                      label="チャージ"
                    />
                  </RadioGroup>
                </FormControl>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6" sx={{ color: "#19B8D7", mb: 2 }}>
                  入金履歴
                </Typography>
                <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          入金日
                        </TableCell>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          入金額
                        </TableCell>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          入金方法
                        </TableCell>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          入金ステータス
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            {/* アカウント設定タブ */}
            {tab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ color: "#19B8D7", mb: 2 }}>
                  ログイン情報
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{ borderRadius: "10px", mb: 3 }}
                >
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        {/* <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          アカウントID
                        </TableCell> */}
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          メールアドレス
                        </TableCell>
                        <TableCell>{savedEmail}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          パスワード
                        </TableCell>
                        <TableCell>
                          {maskedPassword}
                          <Button
                            size="small"
                            sx={{
                              ml: 2,
                              color: "#19B8D7",
                              borderRadius: "10px",
                            }}
                          >
                            編集
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6" sx={{ color: "#19B8D7", mb: 2 }}>
                  お客様情報
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{ borderRadius: "10px", mb: 3 }}
                >
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          氏名
                        </TableCell>
                        <TableCell>Intern teamb</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          生年月日
                        </TableCell>
                        <TableCell>1992-01-01</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          国
                        </TableCell>
                        <TableCell>日本</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          都道府県
                        </TableCell>
                        <TableCell>東京都</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          市・区
                        </TableCell>
                        <TableCell>渋谷区</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          町村番号
                        </TableCell>
                        <TableCell>桜丘町</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          電話番号
                        </TableCell>
                        <TableCell>090-0000-0000</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#19B8D7",
                    color: "white",
                    borderRadius: "10px",
                    px: 4,
                    fontWeight: "bold",
                  }}
                >
                  編集
                </Button>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6" sx={{ color: "#19B8D7", mb: 2 }}>
                  ConoHaアカウント契約情報
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{ borderRadius: "10px", mb: 3 }}
                >
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          登録日
                        </TableCell>
                        <TableCell>2022-09-07</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          請求対象期間
                        </TableCell>
                        <TableCell>毎月01日開始-月末締め</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          次回請求確定日
                        </TableCell>
                        <TableCell>2025-09-01</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          支払方法
                        </TableCell>
                        <TableCell>チャージ</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#19B8D7",
                    color: "white",
                    borderRadius: "10px",
                    px: 4,
                    fontWeight: "bold",
                  }}
                >
                  編集
                </Button>
              </Box>
            )}
            {/* 過去の請求タブ */}
            {tab === 2 && (
              <Box>
                <Typography variant="h6" sx={{ color: "#19B8D7", mb: 2 }}>
                  今月の利用金額
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{ borderRadius: "10px", mb: 3 }}
                >
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          期間
                        </TableCell>
                        <TableCell>2025-08-01～2025-08-04</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          金額
                        </TableCell>
                        <TableCell>0円 (内消費税 0円)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography
                  variant="h6"
                  sx={{ color: "#19B8D7", mt: 4, mb: 2 }}
                >
                  請求履歴
                </Typography>
                <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          請求内容
                        </TableCell>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          請求日
                        </TableCell>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          請求金額
                        </TableCell>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          支払方法
                        </TableCell>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          支払ステータス
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 