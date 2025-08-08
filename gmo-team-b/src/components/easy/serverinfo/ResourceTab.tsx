"use client";

import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import { Refresh, Timeline, Storage, NetworkCheck } from "@mui/icons-material";
import { Line } from "react-chartjs-2";
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
} from "chart.js";

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

export default function ResourceTab({
  serverId,
  serverInfo,
}: ResourceTabProps) {
  const [cpuData, setCpuData] = useState<ResourceData[]>([]);
  const [diskReadData, setDiskReadData] = useState<ResourceData[]>([]);
  const [diskWriteData, setDiskWriteData] = useState<ResourceData[]>([]);
  const [networkRxData, setNetworkRxData] = useState<ResourceData[]>([]);
  const [networkTxData, setNetworkTxData] = useState<ResourceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRequestingRef = useRef<boolean>(false);

  // サーバーが利用可能かチェック
  const isServerAvailable = serverId && serverId.trim() !== "" && serverInfo;
  const isServerActive = serverInfo?.status === "ACTIVE";

  // CPU使用率を計算（nano secondからパーセンテージに変換）
  const calculateCpuUsage = (
    nanoSeconds: number,
    cores: number = 1
  ): number => {
    const maxNanoSeconds = cores * 1000000000; // 1 core = 1,000,000,000 nsec
    return Math.min((nanoSeconds / maxNanoSeconds) * 100, 100);
  };

  // バイトを適切な単位に変換
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B/s";
    const k = 1024;
    const sizes = ["B/s", "KB/s", "MB/s", "GB/s"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // データを取得（最適化版：1回のAPIコールで全リソースデータを取得）
  const fetchResourceData = async () => {
    if (!isServerAvailable || !isServerActive) {
      return;
    }

    // 既にリクエスト中の場合は処理をスキップ
    if (isRequestingRef.current) {
      console.log("リクエスト中のため、新しいリクエストをスキップします");
      return;
    }

    isRequestingRef.current = true;
    setError("");

    try {
      const currentTime = Math.floor(Date.now() / 1000);

      console.log("=== リソースデータ一括取得開始 ===");

      // 全リソースタイプを一度に取得（認証も1回のみ）
      const [cpuResponse, diskResponse, networkResponse] = await Promise.all([
        fetch(`/api/server/${serverId}/resources?type=cpu`),
        fetch(`/api/server/${serverId}/resources?type=disk`),
        fetch(`/api/server/${serverId}/resources?type=network`),
      ]);

      let hasError = false;
      let errorMessage = "";

      // CPU データの処理 
      if (!hasError && cpuResponse.ok) {
        const cpuResult = await cpuResponse.json();

        // API が返す配列。各要素は [unixTimeSec, nanoSeconds] のイメージ
        const rows: [number, number | null][] = cpuResult.cpu?.data ?? [];

        if (rows.length) {
          // 直近 20 行だけ抜く（時系列昇順で来る前提）
          const sliced = rows.slice(-20);

          // ResourceData 配列へ変換（null は 0 に）
          const entryList: ResourceData[] = sliced.map(([ts, nano]) => ({
            timestamp: ts, // ← API の unix 秒をそのまま
            value: calculateCpuUsage(nano ?? 0, 4), // null→0 にして CPU 使用率へ
          }));

          // 既存 state とマージ → 同タイムスタンプは 1 つに → 昇順ソート → 20 件維持
          setCpuData((prev) =>
            [...prev, ...entryList]
              .filter(
                (d, i, arr) =>
                  arr.findIndex((t) => t.timestamp === d.timestamp) === i
              )
              .sort((a, b) => a.timestamp - b.timestamp)
              .slice(-20)
          );
        }
      } else {
        const errorData = await cpuResponse.json();
        if (errorData.error === "サーバーの電源が切れています") {
          hasError = true;
          errorMessage =
            "サーバーの電源が切れています。リソースデータを取得するにはサーバーを起動してください。";
        }
      }

      // ディスクデータの処理
      if (!hasError && diskResponse.ok) {
        const diskResult = await diskResponse.json();

        const rows: [number, number | null, number | null][] =
          diskResult.disk?.data ?? [];

        if (rows.length) {
          // 直近 20 件だけ抜く（すでに時系列昇順で帰ってくる前提）
          const sliced = rows.slice(-20);

          // read/write をそれぞれ ResourceData 配列へ変換（null→0 にする）
          const readEntries: ResourceData[] = sliced.map(([ts, read]) => ({
            timestamp: ts, // API の unix 秒
            value: read ?? 0, // null は 0
          }));

          const writeEntries: ResourceData[] = sliced.map(([ts, , write]) => ({
            timestamp: ts,
            value: write ?? 0,
          }));

          // state へ反映（既存とマージして重複タイムスタンプは排除）
          setDiskReadData(
            (prev) =>
              [...prev, ...readEntries]
                .filter(
                  (d, i, arr) =>
                    arr.findIndex((t) => t.timestamp === d.timestamp) === i
                )
                .sort((a, b) => a.timestamp - b.timestamp)
                .slice(-20) // 念のため 20 件でキープ
          );

          setDiskWriteData((prev) =>
            [...prev, ...writeEntries]
              .filter(
                (d, i, arr) =>
                  arr.findIndex((t) => t.timestamp === d.timestamp) === i
              )
              .sort((a, b) => a.timestamp - b.timestamp)
              .slice(-20)
          );
        }
      }

      // ネットワークデータの処理 
      if (!hasError && networkResponse.ok) {
        const networkResult = await networkResponse.json();
        const rows: [number, number | null, number | null][] =
          networkResult.interface?.data ?? [];

        if (rows.length) {
          // 直近 20 レコードを取得
          const sliced = rows.slice(-20);

          // === RX ===
          const rxEntries: ResourceData[] = sliced.map(([ts, rx]) => ({
            timestamp: ts, // 取得時刻をそのまま使う
            value: rx ?? 0, // null → 0 B/s
          }));

          setNetworkRxData((prev) =>
            [...prev, ...rxEntries]
              .filter(
                (d, i, arr) =>
                  arr.findIndex((t) => t.timestamp === d.timestamp) === i
              )
              .sort((a, b) => a.timestamp - b.timestamp)
              .slice(-20)
          );

          // === TX ===
          const txEntries: ResourceData[] = sliced.map(([ts, _rx, tx]) => ({
            timestamp: ts,
            value: tx ?? 0,
          }));

          setNetworkTxData((prev) =>
            [...prev, ...txEntries]
              .filter(
                (d, i, arr) =>
                  arr.findIndex((t) => t.timestamp === d.timestamp) === i
              )
              .sort((a, b) => a.timestamp - b.timestamp)
              .slice(-20)
          );
        }
      }

      if (hasError) {
        setError(errorMessage);
        return;
      }

      setLastUpdate(new Date());
      console.log("=== リソースデータ一括取得完了 ===");
    } catch (err) {
      console.error("Resource data fetch error:", err);
      setError("リソースデータの取得に失敗しました");
    } finally {
      isRequestingRef.current = false;
    }
  };

  // リアルタイム更新の開始
  useEffect(() => {
    if (isServerAvailable && isServerActive) {
      setLoading(true);
      fetchResourceData().finally(() => {
        setLoading(false);
      });

      // 120秒ごとに更新（エラーがない場合のみ）- 認証頻度を削減してパフォーマンスを向上
      intervalRef.current = setInterval(() => {
        if (!error) {
          fetchResourceData();
        }
      }, 120000); // 2分間隔に変更
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [serverId, isServerAvailable, isServerActive]);

  // 手動更新
  const handleRefresh = () => {
    fetchResourceData();
  };

  if (!isServerAvailable) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">サーバー情報が利用できません</Alert>
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "medium", color: "#333" }}>
          リソース監視
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            最終更新: {lastUpdate.toLocaleTimeString("ja-JP")}
          </Typography>
          <Tooltip title="更新">
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              sx={{ color: "#19B8D7" }}
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
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {/* CPU使用率 */}
          <Box sx={{ flex: "1 1 400px", minWidth: 0 }}>
            <Card sx={{ height: 300, position: "relative" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Timeline sx={{ color: "#19B8D7", mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                    CPU使用率
                  </Typography>
                </Box>
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 200,
                    }}
                  >
                    <CircularProgress size={40} sx={{ color: "#19B8D7" }} />
                  </Box>
                ) : (
                  <Box sx={{ height: 200 }}>
                    <Line
                      data={{
                        labels: cpuData.map((d) =>
                          new Date(d.timestamp * 1000).toLocaleTimeString(
                            "ja-JP",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )
                        ),
                        datasets: [
                          {
                            label: "CPU使用率",
                            data: cpuData.map((d) => d.value),
                            borderColor: "#19B8D7",
                            backgroundColor: "#19B8D720",
                            fill: true,
                            tension: 0.4,
                            pointRadius: 2,
                            pointHoverRadius: 4,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: function (context: any) {
                                return `CPU使用率: ${context.parsed.y.toFixed(
                                  1
                                )}%`;
                              },
                            },
                          },
                        },
                        scales: {
                          x: {
                            display: true,
                            grid: { display: false },
                            ticks: {
                              maxTicksLimit: 6,
                              maxRotation: 0,
                            },
                          },
                          y: {
                            display: true,
                            grid: { color: "rgba(0, 0, 0, 0.1)" },
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                              callback: function (value: any) {
                                return value + "%";
                              },
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* ディスクIO */}
          <Box sx={{ flex: "1 1 400px", minWidth: 0 }}>
            <Card sx={{ height: 300, position: "relative" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Storage sx={{ color: "#FF6B6B", mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                    ディスクIO
                  </Typography>
                </Box>
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 200,
                    }}
                  >
                    <CircularProgress size={40} sx={{ color: "#FF6B6B" }} />
                  </Box>
                ) : (
                  <Box sx={{ height: 200 }}>
                    <Line
                      data={{
                        labels: diskReadData.map((d) =>
                          new Date(d.timestamp * 1000).toLocaleTimeString(
                            "ja-JP",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )
                        ),
                        datasets: [
                          {
                            label: "読み取り",
                            data: diskReadData.map((d) => d.value),
                            borderColor: "#FF6B6B",
                            backgroundColor: "#FF6B6B20",
                            fill: true,
                            tension: 0.4,
                            pointRadius: 2,
                            pointHoverRadius: 4,
                          },
                          {
                            label: "書き込み",
                            data: diskWriteData.map((d) => d.value),
                            borderColor: "#4ECDC4",
                            backgroundColor: "#4ECDC420",
                            fill: true,
                            tension: 0.4,
                            pointRadius: 2,
                            pointHoverRadius: 4,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: true, position: "top" as const },
                          tooltip: {
                            callbacks: {
                              label: function (context: any) {
                                const label = context.dataset.label || "";
                                const value = context.parsed.y;
                                return `${label}: ${formatBytes(value)}`;
                              },
                            },
                          },
                        },
                        scales: {
                          x: {
                            display: true,
                            grid: { display: false },
                            ticks: {
                              maxTicksLimit: 6,
                              maxRotation: 0,
                            },
                          },
                          y: {
                            display: true,
                            grid: { color: "rgba(0, 0, 0, 0.1)" },
                            beginAtZero: true,
                            ticks: {
                              callback: function (value: any) {
                                if (typeof value === "number") {
                                  if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + "M";
                                  } else if (value >= 1000) {
                                    return (value / 1000).toFixed(1) + "K";
                                  }
                                  return value;
                                }
                                return value;
                              },
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* ネットワークトラフィック */}
        <Box sx={{ width: "100%" }}>
          <Card sx={{ height: 300, position: "relative" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <NetworkCheck sx={{ color: "#45B7D1", mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  ネットワークトラフィック
                </Typography>
              </Box>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 200,
                  }}
                >
                  <CircularProgress size={40} sx={{ color: "#45B7D1" }} />
                </Box>
              ) : (
                <Box sx={{ height: 200 }}>
                  <Line
                    data={{
                      labels: networkRxData.map((d) =>
                        new Date(d.timestamp * 1000).toLocaleTimeString(
                          "ja-JP",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }
                        )
                      ),
                      datasets: [
                        {
                          label: "受信",
                          data: networkRxData.map((d) => d.value),
                          borderColor: "#45B7D1",
                          backgroundColor: "#45B7D120",
                          fill: true,
                          tension: 0.4,
                          pointRadius: 2,
                          pointHoverRadius: 4,
                        },
                        {
                          label: "送信",
                          data: networkTxData.map((d) => d.value),
                          borderColor: "#96CEB4",
                          backgroundColor: "#96CEB420",
                          fill: true,
                          tension: 0.4,
                          pointRadius: 2,
                          pointHoverRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: true, position: "top" as const },
                        tooltip: {
                          callbacks: {
                            label: function (context: any) {
                              const label = context.dataset.label || "";
                              const value = context.parsed.y;
                              return `${label}: ${formatBytes(value)}`;
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          display: true,
                          grid: { display: false },
                          ticks: {
                            maxTicksLimit: 6,
                            maxRotation: 0,
                          },
                        },
                        y: {
                          display: true,
                          grid: { color: "rgba(0, 0, 0, 0.1)" },
                          beginAtZero: true,
                          ticks: {
                            callback: function (value: any) {
                              if (typeof value === "number") {
                                if (value >= 1000000) {
                                  return (value / 1000000).toFixed(1) + "M";
                                } else if (value >= 1000) {
                                  return (value / 1000).toFixed(1) + "K";
                                }
                                return value;
                              }
                              return value;
                            },
                          },
                        },
                      },
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
