'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh,
  Timeline,
  Storage,
  NetworkCheck,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';

// Chart.jsの登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface ResourceTabProps {
  serverId: string;
  serverInfo?: {
    nameTag: string;
    status: string;
    ipAddress: string;
  } | null;
}

interface ResourceData {
  timestamp: number;
  value: number;
}

export default function ResourceTab({ serverId, serverInfo }: ResourceTabProps) {
  const [cpuData, setCpuData] = useState<ResourceData[]>([]);
  const [diskReadData, setDiskReadData] = useState<ResourceData[]>([]);
  const [diskWriteData, setDiskWriteData] = useState<ResourceData[]>([]);
  const [networkRxData, setNetworkRxData] = useState<ResourceData[]>([]);
  const [networkTxData, setNetworkTxData] = useState<ResourceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // サーバーが利用可能かチェック
  const isServerAvailable = serverId && serverId.trim() !== '' && serverInfo;
  const isServerActive = serverInfo?.status === 'ACTIVE';

  // CPU使用率を計算（nano secondからパーセンテージに変換）
  const calculateCpuUsage = (nanoSeconds: number, cores: number = 1): number => {
    const maxNanoSeconds = cores * 1000000000; // 1 core = 1,000,000,000 nsec
    return Math.min((nanoSeconds / maxNanoSeconds) * 100, 100);
  };

  // バイトを適切な単位に変換
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // データを取得
  const fetchResourceData = async () => {
    if (!isServerAvailable || !isServerActive) {
      return;
    }

    setError('');

    try {
      const currentTime = Math.floor(Date.now() / 1000);
      
      // CPUデータを取得
      const cpuResponse = await fetch(`/api/server/${serverId}/resources?type=cpu`);
      if (cpuResponse.ok) {
        const cpuResult = await cpuResponse.json();
        if (cpuResult.cpu && cpuResult.cpu.data && cpuResult.cpu.data.length > 0) {
          const latestCpuData = cpuResult.cpu.data[cpuResult.cpu.data.length - 1];
          const [timestamp, value] = latestCpuData;
          const newCpuData = {
            timestamp: currentTime,
            value: calculateCpuUsage(value, 4), // 4コアと仮定
          };
          
          setCpuData(prevData => {
            const newData = [...prevData, newCpuData];
            // 最新の12データポイント（60秒間）を保持
            return newData.slice(-12);
          });
        }
      } else {
        const errorData = await cpuResponse.json();
        if (errorData.error === 'サーバーの電源が切れています') {
          setError('サーバーの電源が切れています。リソースデータを取得するにはサーバーを起動してください。');
          return;
        }
      }

      // ディスクデータを取得
      const diskResponse = await fetch(`/api/server/${serverId}/resources?type=disk`);
      if (diskResponse.ok) {
        const diskResult = await diskResponse.json();
        if (diskResult.disk && diskResult.disk.data && diskResult.disk.data.length > 0) {
          const latestDiskData = diskResult.disk.data[diskResult.disk.data.length - 1];
          const [timestamp, read, write] = latestDiskData;
          
          if (read !== null) {
            setDiskReadData(prevData => {
              const newData = [...prevData, { timestamp: currentTime, value: read }];
              return newData.slice(-12);
            });
          }
          
          if (write !== null) {
            setDiskWriteData(prevData => {
              const newData = [...prevData, { timestamp: currentTime, value: write }];
              return newData.slice(-12);
            });
          }
        }
      } else {
        const errorData = await diskResponse.json();
        if (errorData.error === 'サーバーの電源が切れています') {
          setError('サーバーの電源が切れています。リソースデータを取得するにはサーバーを起動してください。');
          return;
        }
      }

      // ネットワークデータを取得
      const networkResponse = await fetch(`/api/server/${serverId}/resources?type=network`);
      if (networkResponse.ok) {
        const networkResult = await networkResponse.json();
        if (networkResult.interface && networkResult.interface.data && networkResult.interface.data.length > 0) {
          const latestNetworkData = networkResult.interface.data[networkResult.interface.data.length - 1];
          const [timestamp, rx, tx] = latestNetworkData;
          
          if (rx !== null) {
            setNetworkRxData(prevData => {
              const newData = [...prevData, { timestamp: currentTime, value: rx }];
              return newData.slice(-12);
            });
          }
          
          if (tx !== null) {
            setNetworkTxData(prevData => {
              const newData = [...prevData, { timestamp: currentTime, value: tx }];
              return newData.slice(-12);
            });
          }
        }
      } else {
        const errorData = await networkResponse.json();
        if (errorData.error === 'サーバーの電源が切れています') {
          setError('サーバーの電源が切れています。リソースデータを取得するにはサーバーを起動してください。');
          return;
        }
      }

      setLastUpdate(new Date());
    } catch (err) {
      console.error('Resource data fetch error:', err);
      setError('リソースデータの取得に失敗しました');
    }
  };

  // リアルタイム更新の開始
  useEffect(() => {
    if (isServerAvailable && isServerActive) {
      setLoading(true);
      fetchResourceData().finally(() => {
        setLoading(false);
      });
      
      // 30秒ごとに更新（エラーがない場合のみ）- レート制限を回避するため
      intervalRef.current = setInterval(() => {
        if (!error) {
          fetchResourceData();
        }
      }, 30000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [serverId, serverInfo, error]);

  // 手動更新
  const handleRefresh = () => {
    fetchResourceData();
  };

  if (!isServerAvailable) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          サーバー情報が利用できません
        </Alert>
      </Box>
    );
  }

  if (!isServerActive) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          サーバーが停止中です。リソース情報を表示するにはサーバーを起動してください。
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* ヘッダー */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#333' }}>
          リソース監視
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            最終更新: {lastUpdate.toLocaleTimeString('ja-JP')}
          </Typography>
          <Tooltip title="更新">
            <IconButton 
              onClick={handleRefresh} 
              disabled={loading}
              sx={{ color: '#19B8D7' }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* グラフグリッド */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* CPU使用率 */}
          <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
            <Card sx={{ height: 300, position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Timeline sx={{ color: '#19B8D7', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    CPU使用率
                  </Typography>
                </Box>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <CircularProgress size={40} sx={{ color: '#19B8D7' }} />
                  </Box>
                ) : (
                  <Box sx={{ height: 200 }}>
                    <Line 
                      data={{
                        labels: cpuData.map(d => new Date(d.timestamp * 1000).toLocaleTimeString('ja-JP', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })),
                        datasets: [{
                          label: 'CPU使用率',
                          data: cpuData.map(d => d.value),
                          borderColor: '#19B8D7',
                          backgroundColor: '#19B8D720',
                          fill: true,
                          tension: 0.4,
                          pointRadius: 2,
                          pointHoverRadius: 4,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: function(context: any) {
                                return `CPU使用率: ${context.parsed.y.toFixed(1)}%`;
                              }
                            }
                          }
                        },
                        scales: {
                          x: {
                            display: true,
                            grid: { display: false },
                            ticks: { 
                              maxTicksLimit: 6,
                              maxRotation: 0,
                            }
                          },
                          y: {
                            display: true,
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                              callback: function(value: any) {
                                return value + '%';
                              }
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* ディスクIO */}
          <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
            <Card sx={{ height: 300, position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Storage sx={{ color: '#FF6B6B', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    ディスクIO
                  </Typography>
                </Box>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <CircularProgress size={40} sx={{ color: '#FF6B6B' }} />
                  </Box>
                ) : (
                  <Box sx={{ height: 200 }}>
                    <Line 
                      data={{
                        labels: diskReadData.map(d => new Date(d.timestamp * 1000).toLocaleTimeString('ja-JP', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })),
                        datasets: [
                          {
                            label: '読み取り',
                            data: diskReadData.map(d => d.value),
                            borderColor: '#FF6B6B',
                            backgroundColor: '#FF6B6B20',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 2,
                            pointHoverRadius: 4,
                          },
                          {
                            label: '書き込み',
                            data: diskWriteData.map(d => d.value),
                            borderColor: '#4ECDC4',
                            backgroundColor: '#4ECDC420',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 2,
                            pointHoverRadius: 4,
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: true, position: 'top' as const },
                          tooltip: {
                            callbacks: {
                              label: function(context: any) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                return `${label}: ${formatBytes(value)}`;
                              }
                            }
                          }
                        },
                        scales: {
                          x: {
                            display: true,
                            grid: { display: false },
                            ticks: { 
                              maxTicksLimit: 6,
                              maxRotation: 0,
                            }
                          },
                          y: {
                            display: true,
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            beginAtZero: true,
                            ticks: {
                              callback: function(value: any) {
                                if (typeof value === 'number') {
                                  if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + 'M';
                                  } else if (value >= 1000) {
                                    return (value / 1000).toFixed(1) + 'K';
                                  }
                                  return value;
                                }
                                return value;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* ネットワークトラフィック */}
        <Box sx={{ width: '100%' }}>
          <Card sx={{ height: 300, position: 'relative' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NetworkCheck sx={{ color: '#45B7D1', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  ネットワークトラフィック
                </Typography>
              </Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                  <CircularProgress size={40} sx={{ color: '#45B7D1' }} />
                </Box>
              ) : (
                <Box sx={{ height: 200 }}>
                  <Line 
                    data={{
                      labels: networkRxData.map(d => new Date(d.timestamp * 1000).toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })),
                      datasets: [
                        {
                          label: '受信',
                          data: networkRxData.map(d => d.value),
                          borderColor: '#45B7D1',
                          backgroundColor: '#45B7D120',
                          fill: true,
                          tension: 0.4,
                          pointRadius: 2,
                          pointHoverRadius: 4,
                        },
                        {
                          label: '送信',
                          data: networkTxData.map(d => d.value),
                          borderColor: '#96CEB4',
                          backgroundColor: '#96CEB420',
                          fill: true,
                          tension: 0.4,
                          pointRadius: 2,
                          pointHoverRadius: 4,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: true, position: 'top' as const },
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              const label = context.dataset.label || '';
                              const value = context.parsed.y;
                              return `${label}: ${formatBytes(value)}`;
                            }
                          }
                        }
                      },
                                              scales: {
                          x: {
                            display: true,
                            grid: { display: false },
                            ticks: { 
                              maxTicksLimit: 6,
                              maxRotation: 0,
                            }
                          },
                        y: {
                          display: true,
                          grid: { color: 'rgba(0, 0, 0, 0.1)' },
                          beginAtZero: true,
                          ticks: {
                            callback: function(value: any) {
                              if (typeof value === 'number') {
                                if (value >= 1000000) {
                                  return (value / 1000000).toFixed(1) + 'M';
                                } else if (value >= 1000) {
                                  return (value / 1000).toFixed(1) + 'K';
                                }
                                return value;
                              }
                              return value;
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
} 