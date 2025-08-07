"use client"
import React, {useRef, useEffect, useState } from 'react';
import { AuthGuard } from '../../components/auth/AuthGuard';
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
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
} from '@mui/material';
import { storage } from '@/firebase/firebase'; 
import Avatar from '@mui/material/Avatar';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Person } from '@mui/icons-material';
import Image from 'next/image';
import UserMenu from '../../components/easy/serverinfo/UserMenu';
import { Header } from "../../components/easy/Header";
import { db } from '../../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const tabLabels = ['お支払い', 'アカウント設定', '過去の請求'];

function AccountPageContent() {
  const [tab, setTab] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Charge');
  const [savedEmail, setSavedEmail] = useState<string>('');
  const [savedPassword, setSavedPassword] = useState<string>('');
  const [iconUrl, setIconUrl] = useState<string>('/images/conohaIcon.png'); 
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    const url = URL.createObjectURL(file);
    setIconUrl(url);
    setUploading(false);
  };

  // お客様情報編集用の状態
  const [isEditingCustomerInfo, setIsEditingCustomerInfo] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: 'Intern teamb',
    birthDate: '1992-01-01',
    country: '日本',
    prefecture: '東京都',
    city: '渋谷区',
    address: '桜丘町',
    phone: '090-0000-0000'
  });

  // クレジットカード情報用の状態
  const [isEditingCreditCard, setIsEditingCreditCard] = useState(false);
  const [creditCardInfo, setCreditCardInfo] = useState({
    name: '',
    type: '',
    number: '',
    expiry: ''
  });

  useEffect(() => {
    const email = localStorage.getItem("user_email") ?? '';
    const password = localStorage.getItem("user_password") ?? '';
    setSavedEmail(email);
    setSavedPassword(password);
    
    // Firebaseからお客様情報を取得
    loadCustomerInfo();
    // Firebaseからクレジットカード情報を取得
    loadCreditCardInfo();
  }, []);

    const maskedPassword = savedPassword
    ? '*'.repeat(savedPassword.length)
    : '';

  // Firebaseからお客様情報を取得
  const loadCustomerInfo = async () => {
    try {
      const userEmail = localStorage.getItem("user_email");
      if (!userEmail) return;

      const customerDoc = doc(db, 'customers', userEmail);
      const customerSnap = await getDoc(customerDoc);

      if (customerSnap.exists()) {
        const data = customerSnap.data();
        setCustomerInfo({
          name: data.name || 'Intern teamb',
          birthDate: data.birthDate || '1992-01-01',
          country: data.country || '日本',
          prefecture: data.prefecture || '東京都',
          city: data.city || '渋谷区',
          address: data.address || '桜丘町',
          phone: data.phone || '090-0000-0000'
        });
      }
    } catch (error) {
      console.error('お客様情報の取得に失敗しました:', error);
    }
  };

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCustomerInfo = async () => {
    try {
      const userEmail = localStorage.getItem("user_email");
      if (!userEmail) {
        console.error('ユーザーEmailが見つかりません');
        return;
      }

      const customerDoc = doc(db, 'customers', userEmail);
      await setDoc(customerDoc, customerInfo, { merge: true });
      
      console.log('お客様情報を保存しました');
      setIsEditingCustomerInfo(false);
    } catch (error) {
      console.error('お客様情報の保存に失敗しました:', error);
    }
  };

  const handleCancelCustomerInfo = () => {
    // Firebaseから最新のデータを再取得
    loadCustomerInfo();
    setIsEditingCustomerInfo(false);
  };

  // Firebaseからクレジットカード情報を取得
  const loadCreditCardInfo = async () => {
    try {
      const userEmail = localStorage.getItem("user_email");
      if (!userEmail) return;

      const creditCardDoc = doc(db, 'creditCards', userEmail);
      const creditCardSnap = await getDoc(creditCardDoc);

      if (creditCardSnap.exists()) {
        const data = creditCardSnap.data();
        setCreditCardInfo({
          name: data.name || '',
          type: data.type || '',
          number: data.number || '',
          expiry: data.expiry || ''
        });
      }
    } catch (error) {
      console.error('クレジットカード情報の取得に失敗しました:', error);
    }
  };

  const handleCreditCardInfoChange = (field: string, value: string) => {
    setCreditCardInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCreditCardInfo = async () => {
    try {
      const userEmail = localStorage.getItem("user_email");
      if (!userEmail) {
        console.error('ユーザーEmailが見つかりません');
        return;
      }

      const creditCardDoc = doc(db, 'creditCards', userEmail);
      await setDoc(creditCardDoc, creditCardInfo, { merge: true });
      
      console.log('クレジットカード情報を保存しました');
      setIsEditingCreditCard(false);
    } catch (error) {
      console.error('クレジットカード情報の保存に失敗しました:', error);
    }
  };

  const handleCancelCreditCardInfo = () => {
    // Firebaseから最新のデータを再取得
    loadCreditCardInfo();
    setIsEditingCreditCard(false);
  };


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
      <Header iconUrl={iconUrl} />
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
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    {!isEditingCreditCard ? (
                      <Button
                        variant="contained"
                        onClick={() => setIsEditingCreditCard(true)}
                        sx={{
                          bgcolor: "#19B8D7",
                          color: "white",
                          borderRadius: "10px",
                          px: 4,
                          fontWeight: "bold",
                        }}
                      >
                        クレジットカード登録
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          onClick={handleSaveCreditCardInfo}
                          sx={{
                            bgcolor: "#19B8D7",
                            color: "white",
                            borderRadius: "10px",
                            px: 4,
                            fontWeight: "bold",
                          }}
                        >
                          保存
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={handleCancelCreditCardInfo}
                          sx={{
                            borderColor: "#19B8D7",
                            color: "#19B8D7",
                            borderRadius: "10px",
                            px: 4,
                            fontWeight: "bold",
                          }}
                        >
                          キャンセル
                        </Button>
                      </>
                    )}
                  </Box>
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
                          <TableCell>
                            {isEditingCreditCard ? (
                              <TextField
                                fullWidth
                                value={creditCardInfo.name}
                                onChange={(e) => handleCreditCardInfoChange('name', e.target.value)}
                                placeholder="カード名義"
                              />
                            ) : (
                              creditCardInfo.name || '-'
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditingCreditCard ? (
                              <TextField
                                fullWidth
                                value={creditCardInfo.type}
                                onChange={(e) => handleCreditCardInfoChange('type', e.target.value)}
                                placeholder="VISA/MasterCard等"
                              />
                            ) : (
                              creditCardInfo.type || '-'
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditingCreditCard ? (
                              <TextField
                                fullWidth
                                value={creditCardInfo.number}
                                onChange={(e) => handleCreditCardInfoChange('number', e.target.value)}
                                placeholder="1234-5678-9012-3456"
                              />
                            ) : (
                              creditCardInfo.number || '-'
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditingCreditCard ? (
                              <TextField
                                fullWidth
                                value={creditCardInfo.expiry}
                                onChange={(e) => handleCreditCardInfoChange('expiry', e.target.value)}
                                placeholder="MM/YY"
                              />
                            ) : (
                              creditCardInfo.expiry || '-'
                            )}
                          </TableCell>
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
                        <TableCell>
                          {isEditingCustomerInfo ? (
                            <TextField
                              fullWidth
                              value={customerInfo.name}
                              onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                            />
                          ) : (
                            customerInfo.name
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          生年月日
                        </TableCell>
                        <TableCell>
                          {isEditingCustomerInfo ? (
                            <TextField
                              fullWidth
                              type="date"
                              value={customerInfo.birthDate}
                              onChange={(e) => handleCustomerInfoChange('birthDate', e.target.value)}
                            />
                          ) : (
                            customerInfo.birthDate
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          国
                        </TableCell>
                        <TableCell>
                          {isEditingCustomerInfo ? (
                            <TextField
                              fullWidth
                              value={customerInfo.country}
                              onChange={(e) => handleCustomerInfoChange('country', e.target.value)}
                            />
                          ) : (
                            customerInfo.country
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          都道府県
                        </TableCell>
                        <TableCell>
                          {isEditingCustomerInfo ? (
                            <TextField
                              fullWidth
                              value={customerInfo.prefecture}
                              onChange={(e) => handleCustomerInfoChange('prefecture', e.target.value)}
                            />
                          ) : (
                            customerInfo.prefecture
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          市・区
                        </TableCell>
                        <TableCell>
                          {isEditingCustomerInfo ? (
                            <TextField
                              fullWidth
                              value={customerInfo.city}
                              onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                            />
                          ) : (
                            customerInfo.city
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          町村番号
                        </TableCell>
                        <TableCell>
                          {isEditingCustomerInfo ? (
                            <TextField
                              fullWidth
                              value={customerInfo.address}
                              onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                            />
                          ) : (
                            customerInfo.address
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#19B8D7", fontWeight: "bold" }}
                        >
                          電話番号
                        </TableCell>
                        <TableCell>
                          {isEditingCustomerInfo ? (
                            <TextField
                              fullWidth
                              value={customerInfo.phone}
                              onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                            />
                          ) : (
                            customerInfo.phone
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {!isEditingCustomerInfo ? (
                    <Button
                      variant="contained"
                      onClick={() => setIsEditingCustomerInfo(true)}
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
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        onClick={handleSaveCustomerInfo}
                        sx={{
                          bgcolor: "#19B8D7",
                          color: "white",
                          borderRadius: "10px",
                          px: 4,
                          fontWeight: "bold",
                        }}
                      >
                        保存
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancelCustomerInfo}
                        sx={{
                          borderColor: "#19B8D7",
                          color: "#19B8D7",
                          borderRadius: "10px",
                          px: 4,
                          fontWeight: "bold",
                        }}
                      >
                        キャンセル
                      </Button>
                    </>
                  )}
                </Box>
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
                <Divider sx={{ my: 4 }} />
 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
<Image
  src={iconUrl}
  alt="アイコン"
  width={80}
  height={80}
  style={{ borderRadius: '20px', border: '2px solid #19B8D7', objectFit: 'cover' }}
/>
      <Button
        variant="contained"
        component="label"
        sx={{ bgcolor: "#19B8D7", color: "white", borderRadius: "10px", px: 4, fontWeight: "bold" }}
        disabled={uploading}
      >
        {uploading ? "アップロード中..." : "画像を選択"}
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleIconUpload}
        />
      </Button>
    </Box>
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

export default function AccountPage() {
  return (
    <AuthGuard>
      <AccountPageContent />
    </AuthGuard>
  );
} 