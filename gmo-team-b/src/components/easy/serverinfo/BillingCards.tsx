import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import { useRouter } from 'next/navigation';

interface BillingCardProps {
  title: string;
  period?: string;
  amount?: string;
  method?: string;
  buttonText: string;
  onClick?: () => void;
}

function BillingCard({ title, period, amount, method, buttonText, onClick }: BillingCardProps) {
  return (
    <Card
      sx={{
        height: '200px',
        background: 'linear-gradient(135deg, #19B8D7 0%, #15a0c0 100%)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(25, 184, 215, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(25, 184, 215, 0.3)',
        },
      }}
    >
      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* ヘッダー部分 */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 'medium',
              fontSize: '0.95rem',
              mb: 1,
            }}
          >
            {title}
          </Typography>
          {period && (
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.8rem',
                mb: 2,
              }}
            >
              {period}
            </Typography>
          )}
        </Box>

        {/* 中央部分 */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {amount ? (
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '2rem',
              }}
            >
              {amount}
            </Typography>
          ) : method ? (
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 'medium',
                fontSize: '1.1rem',
              }}
            >
              {method}
            </Typography>
          ) : null}
        </Box>

        {/* ボタン部分 */}
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={onClick}
            sx={{
              width: '100%',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: '0.85rem',
              py: 1,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            {buttonText}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function BillingCards() {
  const router = useRouter();
  const handleDetailsClick = () => {
    router.push('/account?tab=2');
  };

  const handlePaymentSettingsClick = () => {
    router.push('/account?tab=0');
  };

  const handleChargeClick = () => {
    router.push('/account?tab=0');
  };

  const handleCouponRegisterClick = () => {
    router.push('/account?tab=0');
  };

  return (
    <Box sx={{ mt: 4, mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 3,
          width: '100%',
        }}
      >
        <BillingCard
          title="今月のご利用金額"
          period="2025 8/1~8/31"
          amount="0円"
          buttonText="詳細はこちら"
          onClick={handleDetailsClick}
        />
        
        <BillingCard
          title="お支払い設定"
          period="2025 8/1~8/31"
          method="クレジットカード"
          buttonText="お支払い設定"
          onClick={handlePaymentSettingsClick}
        />
        
        <BillingCard
          title="チャージ残高"
          amount="0円"
          buttonText="チャージ"
          onClick={handleChargeClick}
        />
        
        <BillingCard
          title="クーポン残高"
          amount="0円"
          buttonText="クーポン登録"
          onClick={handleCouponRegisterClick}
        />
      </Box>
    </Box>
  );
} 