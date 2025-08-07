'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Refresh,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';

interface ConsoleTabProps {
  serverId: string;
  serverInfo?: {
    nameTag: string;
    status: string;
    ipAddress: string;
  } | null;
}

interface ConsoleResponse {
  success: boolean;
  consoleUrl?: string;
  error?: string;
}

export default function ConsoleTab({ serverId, serverInfo }: ConsoleTabProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [consoleUrl, setConsoleUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // サーバーが利用可能かチェック
  const isServerAvailable = serverId && serverId.trim() !== '' && serverInfo;
  const isServerActive = serverInfo?.status === 'ACTIVE';

  const connectToConsole = useCallback(async () => {
  if (!isServerAvailable) {
    setError("サーバー情報が利用できません");
    return;
  }
  if (!isServerActive) {
    setError("サーバーが停止中です。コンソールに接続するにはサーバーを起動してください。");
    return;
  }

  setIsConnecting(true);
  setError("");

  try {
    const res = await fetch("/api/server/console", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverId }),
    });

    const data: ConsoleResponse = await res.json();

    if (data.success && data.consoleUrl) {
      setConsoleUrl(data.consoleUrl);
      setIsConnected(true);
    } else {
      setError(data.error || "コンソール接続に失敗しました");
    }
  } catch (err) {
    setError("コンソール接続中にエラーが発生しました");
    console.error("Console connection error:", err);
  } finally {
    setIsConnecting(false);
  }
  // 2. 依存配列に「関数内で読む値」を列挙
}, [isServerAvailable, isServerActive, serverId]);

// 3. useEffect には connectToConsole を依存に入れる
useEffect(() => {
  setIsConnected(false);
  setConsoleUrl("");
  setError("");

  if (isServerAvailable && isServerActive) {
    connectToConsole();
  }
}, [serverId, serverInfo?.status, isServerAvailable, isServerActive, connectToConsole]);

  const disconnectConsole = () => {
    setIsConnected(false);
    setConsoleUrl('');
    setError('');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const refreshConsole = () => {
    if (isConnected && iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  useEffect(() => {
    // サーバーIDが変更されたら接続をリセット
    setIsConnected(false);
    setConsoleUrl('');
    setError('');
    
    // サーバーが利用可能でアクティブな場合のみ自動接続
    if (isServerAvailable && isServerActive) {
      connectToConsole();
    }
  }, [serverId, serverInfo?.status, isServerAvailable, isServerActive, connectToConsole]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ヘッダー */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
          WebSocketコンソール
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!isConnected && (
            <Button
              variant="contained"
              startIcon={isConnecting ? <CircularProgress size={16} /> : <PlayArrow />}
              onClick={connectToConsole}
              disabled={isConnecting || !isServerAvailable || !isServerActive}
              sx={{
                bgcolor: '#19B8D7',
                '&:hover': { bgcolor: '#15a0c0' },
                textTransform: 'none',
                borderRadius: '50px',
              }}
            >
              {isConnecting ? '接続中...' : '接続'}
            </Button>
          )}
          
          {isConnected && (
            <>
              <Tooltip title="更新">
                <IconButton onClick={refreshConsole} size="small">
                  <Refresh />
                </IconButton>
              </Tooltip>
              
              <Tooltip title={isFullscreen ? '全画面解除' : '全画面表示'}>
                <IconButton onClick={toggleFullscreen} size="small">
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Tooltip>
              
              <Button
                variant="outlined"
                startIcon={<Stop />}
                onClick={disconnectConsole}
                sx={{
                  borderColor: '#f44336',
                  color: '#f44336',
                  '&:hover': {
                    borderColor: '#d32f2f',
                    backgroundColor: '#ffebee',
                  },
                  textTransform: 'none',
                  borderRadius: '50px',
                }}
              >
                切断
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* エラー表示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* コンソール表示エリア */}
      <Paper
        sx={{
          flex: 1,
          minHeight: '800px', // 高さを2倍に設定
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: '#1e1e1e',
        }}
      >
        {isConnecting && !isConnected ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: '800px', // 最小高さを設定
              color: 'text.secondary',
            }}
          >
            <CircularProgress size={48} sx={{ mb: 2, color: '#19B8D7' }} />
            <Typography variant="body1">コンソールに接続中...</Typography>
          </Box>
        ) : isConnected && consoleUrl ? (
          <Box
            sx={{
              position: 'relative',
              flex: 1,
              overflow: 'hidden',
              minHeight: '800px', // 親要素と同じ高さを設定
            }}
          >
            <iframe
              ref={iframeRef}
              src={consoleUrl}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '800px', // iframeの最小高さも設定
                border: 'none',
                backgroundColor: '#1e1e1e',
              }}
              title="WebSocket Console"
              allow="fullscreen"
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: '800px', // 最小高さを設定
              color: 'text.secondary',
              p: 4,
            }}
          >
            {!isServerAvailable ? (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  サーバー情報が利用できません
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center', mb: 3 }}>
                  サーバーを選択してからコンソールに接続してください。
                </Typography>
              </>
            ) : !isServerActive ? (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  サーバーが停止中です
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center', mb: 3 }}>
                  コンソールに接続するには、サーバーを起動してください。
                  <br />
                  サーバー名: {serverInfo?.nameTag}
                  <br />
                  IPアドレス: {serverInfo?.ipAddress}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  コンソールが接続されていません
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center', mb: 3 }}>
                  サーバーに接続してコンソールを利用できます。
                  <br />
                  サーバー名: {serverInfo?.nameTag}
                  <br />
                  IPアドレス: {serverInfo?.ipAddress}
                  <br />
                  接続ボタンをクリックしてコンソールを開始してください。
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={connectToConsole}
                  disabled={isConnecting}
                  sx={{
                    bgcolor: '#19B8D7',
                    '&:hover': { bgcolor: '#15a0c0' },
                    textTransform: 'none',
                    borderRadius: '50px',
                  }}
                >
                  コンソールに接続
                </Button>
              </>
            )}
          </Box>
        )}
      </Paper>

      {/* ステータス表示 */}
      {isConnected && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 1,
            p: 1,
            bgcolor: 'success.light',
            color: 'success.contrastText',
            borderRadius: 1,
            fontSize: '0.875rem',
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'success.main',
              animation: 'pulse 2s infinite',
            }}
          />
          コンソールに接続中
        </Box>
      )}
    </Box>
  );
} 