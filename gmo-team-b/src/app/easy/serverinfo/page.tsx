"use client";

import React, { useState, useEffect } from "react";
import { AuthGuard } from "../../../components/auth/AuthGuard";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Switch,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import {
  RestartAlt,
  PowerSettingsNew,
  CloudUpload,
  CloudDownload,
  Delete,
  Edit,
  Clear,
} from "@mui/icons-material";
import { KeyboardArrowRight, HelpOutline, Refresh } from "@mui/icons-material";
import { serverInfoMockData } from "../../../data/serverInfoMockData";
import ServerSettingsTab from "../../../components/easy/serverinfo/ServerSettingsTab";
import ServerNameEditor from "../../../components/easy/serverinfo/ServerNameEditor";
import BillingCards from "../../../components/easy/serverinfo/BillingCards";
import { Header } from "../../../components/easy/Header";
import type { ParsedServerInfo } from "@/app/api/server/getServerInfo";
import type {
  ServerListResponse,
  EnhancedServerSummary,
} from "../../../types/serverTypes";

interface ServerAction {
  label: string;
  icon: React.ElementType;
  slug?: string;
}

const serverActions: ServerAction[] = [
  {
    label: "再起動",
    icon: RestartAlt,
    slug: "reboot",
  },
  {
    label: "強制終了",
    icon: PowerSettingsNew,
    slug: "force_shutdown",
  },
  {
    label: "保存",
    icon: CloudUpload,
  },
  {
    label: "復元",
    icon: CloudDownload,
  },
  {
    label: "削除",
    icon: Delete,
    slug: "delete",
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`server-tabpanel-${index}`}
      aria-labelledby={`server-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function ServerInfo() {
  const [tabValue, setTabValue] = useState(0);
  const [serverStatus, setServerStatus] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [deleteLock, setDeleteLock] = useState(false);
  const [serverInfo, setServerInfo] = useState<ParsedServerInfo | null>(null);
  const [serverName, setServerName] = useState("");
  const [isEditingServerName, setIsEditingServerName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverList, setServerList] = useState<EnhancedServerSummary[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [serverListLoading, setServerListLoading] = useState(false);
  const [isServerListOpen, setIsServerListOpen] = useState(false);
  const [serverSettings, setServerSettings] = useState(
    serverInfoMockData.serverSettings
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    slug: ServerAction["slug"];
    label: string;
  } | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

const [iconUrl, setIconUrl] = useState("/images/conohaIcon.png");
  const handleServerAction = async (slug: ServerAction["slug"]) => {
    if (!selectedServerId) return;

    try {
      console.log(slug);
      const path =
        slug == "delete"
          ? `/api/server/${selectedServerId}/deleteServer`
          : `/api/server/${selectedServerId}/${slug}`;

      const res = await fetch(path, {
        method: "POST",
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? `${res.status} ${res.statusText}`);
      }

      // delete成功時にリスト再取得
      if (slug === "delete") {
        await loadServerList(); // 一覧リフレッシュ
        setSnackbarMessage("サーバを削除しました");
        return; // 以降の loadServerInfo は不要
      }

      // 成功したらステータス再取得
      await loadServerInfo(selectedServerId);
    } catch (err) {
      console.error("handleServerAction error:", err);
      throw err; // ← 呼び出し元に失敗を知らせる
    }
  };
  //アカウント情報→ネームタグ編集用関数

  const handleNameTagChange = (newValue: string) => {
    setServerSettings((prev) =>
      prev.map((setting) =>
        setting.label === "ネームタグ"
          ? { ...setting, value: newValue }
          : setting
      )
    );
    setServerName(newValue); // サーバー名も同期したい場合
  };
  // open confirm dialog for a given action
  const openConfirm = (slug: ServerAction["slug"], label: string) => {
    setPendingAction({ slug, label });
    setConfirmOpen(true);
  };

  const handleConfirmOk = async () => {
    if (!pendingAction?.slug) {
      setConfirmOpen(false);
      return;
    }

    try {
      await handleServerAction(pendingAction.slug);
      setSnackbarMessage(`${pendingAction.label} が完了しました`);
      if (pendingAction.slug === "os-start") setServerStatus(true);
      if (pendingAction.slug === "os-stop") setServerStatus(false);
    } catch (_err) {
      setSnackbarMessage(`${pendingAction.label} に失敗しました`);
    } finally {
      setSnackbarOpen(true);
      setConfirmOpen(false);
      setPendingAction(null);
    }
  };

  const requestStatusToggle = (next: boolean) => {
    const slug = next ? "os-start" : "os-stop";
    const label = next ? "起動" : "停止";
    openConfirm(slug, label);
  };

  const handleConfirmCancel = () => {
    setConfirmOpen(false);
    setPendingAction(null);
  };

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // Load nameTag for a server
  const loadServerNameTag = async (serverId: string): Promise<string> => {
    try {
      const res = await fetch(`/api/server/${serverId}`);
      if (res.ok) {
        const info = (await res.json()) as ParsedServerInfo;
        return info.nameTag;
      }
    } catch (err) {
      console.warn(`Failed to load nameTag for server ${serverId}:`, err);
    }
    return ""; // Return empty string if failed
  };

  // Load server list with detailed info using batch API
  const loadServerList = async () => {
    try {
      setServerListLoading(true);
      setError(null);
      setLoading(true);

      console.log("=== サーバーリスト読み込み開始 ===");

      // 1. まず基本的なサーバーリストを取得
      const serverListRes = await fetch("/api/server/getServerList");
      console.log("Server list API response status:", serverListRes.status);

      if (!serverListRes.ok) {
        console.error(`Server list API call failed: ${serverListRes.status} ${serverListRes.statusText}`);
        // APIエラーの場合は一時停止して再試行
        await new Promise(resolve => setTimeout(resolve, 2000));
        const retryRes = await fetch("/api/server/getServerList");
        if (!retryRes.ok) {
        throw new Error(
            `Server list API call failed after retry: ${retryRes.status} ${retryRes.statusText}`
          );
        }
        console.log("Server list API retry succeeded");
        const retryJson = await retryRes.json();
        console.log("Server list retry response:", retryJson);
        const basicList = retryJson?.servers || [];
        if (!basicList.length) {
          throw new Error("No servers found in retry response");
        }
        return basicList;
      }

      const serverListJson = await serverListRes.json();
      console.log("Server list response:", serverListJson);

      // Safely access the servers array with proper null checks
      const basicList = serverListJson?.servers || [];
      if (!basicList.length) {
        throw new Error("No servers found in response");
      }

      if (Array.isArray(basicList) && basicList.length > 0) {
        console.log(`=== ${basicList.length}台のサーバーの詳細情報をバッチ取得開始 ===`);
        
        // 2. バッチAPIで全サーバーの詳細情報を一度に取得
        const serverIds = basicList.map(server => server.id);
        const batchRes = await fetch("/api/server/batch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ serverIds }),
        });

        if (!batchRes.ok) {
          console.warn("Batch API failed, falling back to individual requests");
          throw new Error("Batch API failed");
        }

        const batchData = await batchRes.json();
        console.log("Batch server info response:", batchData);

        // 3. サーバーリストと詳細情報を結合
        const enhancedList: EnhancedServerSummary[] = basicList.map(server => {
          const detailedInfo = batchData.servers.find((s: any) => s.id === server.id);
          return {
            ...server,
            nameTag: detailedInfo?.nameTag || server.name,
            displayName: detailedInfo?.nameTag || server.name,
          };
        });

        // 4. 最初のサーバーの詳細情報をセット（新しく作成されたサーバーを優先）
        let serverToShow = basicList[0];
        
        // sessionStorageから新しく作成されたサーバー情報を取得
        if (typeof window !== 'undefined') {
          const newServerData = sessionStorage.getItem('newlyCreatedServer');
          if (newServerData) {
            try {
              const { serverId, serverName: expectedName, createdAt } = JSON.parse(newServerData);
              
              // 5分以内に作成されたサーバーのみ対象
              if (Date.now() - createdAt < 5 * 60 * 1000) {
                const newServer = basicList.find(server => server.id === serverId);
                if (newServer) {
                  serverToShow = newServer;
                  console.log('[ServerInfo] 新しく作成されたサーバーを優先選択:', serverToShow.id, 'expected name:', expectedName);
                }
              } else {
                // 古いデータは削除
                sessionStorage.removeItem('newlyCreatedServer');
              }
            } catch (error) {
              console.error('[ServerInfo] sessionStorage解析エラー:', error);
              sessionStorage.removeItem('newlyCreatedServer');
            }
          }
        }
        
        const serverDetail = batchData.servers.find((s: any) => s.id === serverToShow.id);
        if (serverDetail) {
          console.log('[ServerInfo] serverDetail が見つかりました:', serverDetail);
          
          // 新しく作成されたサーバーの場合、構築中なら再読み込み設定
          const isNewlyCreated = typeof window !== 'undefined' && sessionStorage.getItem('newlyCreatedServer');
          const isBuilding = serverDetail.status === 'BUILD' || serverDetail.ipAddress.includes('構築中');
          
          console.log('[ServerInfo] 再読み込み判定:', {
            isNewlyCreated: !!isNewlyCreated,
            status: serverDetail.status,
            ipAddress: serverDetail.ipAddress,
            isBuilding: isBuilding
          });
          
          // 一旦現在の情報を表示
          setServerInfo(serverDetail);
          setServerName(serverDetail.nameTag);
          setServerStatus(serverDetail.status === "ACTIVE");
          setLoading(false);
          
          if (isNewlyCreated && isBuilding) {
            console.log('[ServerInfo] 新しく作成されたサーバーが構築中です。5秒ごとにページを再読み込みします');
            
            // 5秒ごとにページを再読み込み
            const reloadInterval = setInterval(() => {
              console.log('[ServerInfo] ページを再読み込みします');
              window.location.reload();
            }, 5000);
            
            // 5分後にタイムアウト
            setTimeout(() => {
              console.log('[ServerInfo] 最大リトライ時間に達したため、自動再読み込みを停止します');
              clearInterval(reloadInterval);
              setError('サーバー情報の取得に時間がかかっています。手動で再読み込みしてください。');
            }, 300000); // 5分
          } else {
            // 構築完了したらsessionStorageをクリア
            if (isNewlyCreated && !isBuilding) {
              console.log('[ServerInfo] サーバー構築が完了しました。sessionStorageをクリアします');
              sessionStorage.removeItem('newlyCreatedServer');
            }
          }
          
          console.log('[ServerInfo] サーバー情報をセットし、loading を false にしました');
        } else {
          // バッチでサーバー詳細が取得できなかった場合は個別取得を試みる
          console.log('[ServerInfo] バッチでサーバー詳細が取得できませんでした。個別取得を試みます');
          
          // 新しく作成されたサーバーの場合、詳細情報が取得できるまで複数回リトライ
          const isNewlyCreated = typeof window !== 'undefined' && sessionStorage.getItem('newlyCreatedServer');
          let retryCount = 0;
          const maxRetries = isNewlyCreated ? 3 : 1;
          
          const attemptLoadServerInfo = async (): Promise<void> => {
            try {
              console.log(`[ServerInfo] 個別取得を試行中 (${retryCount + 1}/${maxRetries})`);
              await loadServerInfo(serverToShow.id);
              console.log('[ServerInfo] 個別取得成功');
            } catch (error) {
              console.error(`[ServerInfo] 個別取得失敗 (${retryCount + 1}/${maxRetries}):`, error);
              retryCount++;
              
              if (retryCount < maxRetries) {
                console.log(`[ServerInfo] ${3}秒後に再試行します`);
                setTimeout(attemptLoadServerInfo, 3000);
              } else {
                console.error('[ServerInfo] 最大リトライ回数に達しました');
                
                // 新しく作成されたサーバーの場合、期待される名前を表示
                let displayName = serverToShow.name; // デフォルトはvm-形式
                if (isNewlyCreated) {
                  const newServerData = sessionStorage.getItem('newlyCreatedServer');
                  if (newServerData) {
                    try {
                      const { serverName: expectedName } = JSON.parse(newServerData);
                      displayName = expectedName;
                      console.log('[ServerInfo] 新しく作成されたサーバーの期待される名前を使用:', displayName);
                    } catch (error) {
                      console.error('[ServerInfo] sessionStorage解析エラー:', error);
                    }
                  }
                }

                // 最後の手段として、基本情報だけでも表示
                const basicServerInfo: ParsedServerInfo = {
                  nameTag: displayName,
                  status: "BUILDING", // 構築中として表示
                  ipAddress: "取得中...",
                  subnetMask: "取得中...",
                  gateway: "取得中...",
                  macAddress: "取得中...",
                  dnsServer1: "取得中...",
                  dnsServer2: "取得中...",
                  bandwidthIn: "取得中...",
                  bandwidthOut: "取得中...",
                  autoBackupEnabled: false,
                  bootStorage: "取得中...",
                  securityGroup: "取得中...",
                };
                
                setServerInfo(basicServerInfo);
                setServerName(displayName);
                setServerStatus(false);
                setLoading(false);
                setError('サーバー詳細情報を取得中です。自動的に更新されます。');
                

              }
            }
          };
          
          await attemptLoadServerInfo();
        }

        setServerList(enhancedList);
        setSelectedServerId(serverToShow.id);
        
        console.log(`=== サーバーリスト読み込み完了 (${enhancedList.length}台) ===`);
      } else {
        console.warn("No servers found in the response");
        // サーバーが見つからない場合でもローディング状態を解除
        setLoading(false);
        setError("サーバーが見つかりませんでした。新しいサーバーを作成してください。");
        return;
      }
    } catch (err) {
      console.error("Failed to load server list", err);
      setError(
        `サーバーリストの読み込みに失敗しました: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );

      // エラー時はローディング状態を解除し、エラーメッセージを表示
      setLoading(false);
      setServerList([]);
      setSelectedServerId("");
    } finally {
      setServerListLoading(false);
    }
  };

  // Load individual server info
  const loadServerInfo = async (serverId: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/server/${serverId}`);

      if (!res.ok) {
        throw new Error(
          `Server info API call failed: ${res.status} ${res.statusText}`
        );
      }

      const info = (await res.json()) as ParsedServerInfo;
      console.log('[ServerInfo] loadServerInfo で取得したサーバー情報:', info);
      
      // 新しく作成されたサーバーで名前がまだvm-形式の場合、期待される名前を使用
      let displayName = info.nameTag;
      console.log('[ServerInfo] 初期displayName:', displayName);
      
      if (typeof window !== 'undefined') {
        const newServerData = sessionStorage.getItem('newlyCreatedServer');
        console.log('[ServerInfo] sessionStorageからのデータ:', newServerData);
        
        if (newServerData) {
          try {
            const { serverId, serverName: expectedName } = JSON.parse(newServerData);
            console.log('[ServerInfo] 期待される名前:', expectedName, 'サーバーID:', serverId);
            
            // vm-形式または構築中の場合は期待される名前を使用
            if (info.nameTag && (info.nameTag.startsWith('vm-') || info.ipAddress.includes('構築中'))) {
              console.log(`[ServerInfo] サーバー構築中のため期待される名前に置換: ${info.nameTag} -> ${expectedName}`);
              displayName = expectedName;
              // 構築中の場合はsessionStorageはまだクリアしない
              if (!info.ipAddress.includes('構築中')) {
                sessionStorage.removeItem('newlyCreatedServer');
              }
            } else {
              console.log(`[ServerInfo] 名前は既に正しい形式です: ${info.nameTag}`);
              // 正しい名前が取得できた場合はsessionStorageをクリア
              sessionStorage.removeItem('newlyCreatedServer');
            }
          } catch (error) {
            console.error('[ServerInfo] sessionStorage解析エラー:', error);
          }
        } else {
          console.log('[ServerInfo] sessionStorageにnewlyCreatedServerデータがありません');
        }
      }
      
      console.log('[ServerInfo] 最終的なdisplayName:', displayName);
      setServerInfo(info);
      setServerName(displayName);
      setServerStatus(info.status == "ACTIVE");
    } catch (err) {
      console.warn("Server info API call failed, using mock data:", err);

      // エラー時はサーバー情報をクリアしてエラーメッセージを表示
      setServerInfo(null);
      setServerName("");
      setError("サーバー情報の取得に失敗しました。しばらく待ってから再試行してください。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        await loadServerList();
      } catch (error) {
        console.error('Failed to initialize server info page:', error);
        // エラーが発生した場合でもローディング状態を解除
        setLoading(false);
        setError('サーバー情報の読み込みに失敗しました。ページを再読み込みしてください。');
      }
    };

    initializePage();

    // flavorsResの結果を取得してコンソールに表示
    const fetchFlavorsRes = async () => {
      try {
        console.log("=== flavorsRes取得開始 ===");
        const response = await fetch("/api/vps/plans");

        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            "flavorsRes取得エラー:",
            errorData.message || "flavorsResの取得に失敗しました"
          );
          return;
        }

        const data = await response.json();
        console.log("=== flavorsResの結果 ===");
        console.log("flavorsRes全体:", data);

        // 元のflavorsResの構造を再現
        console.log("=== 元のflavorsRes構造 ===");
        if (data.plans && Array.isArray(data.plans)) {
          data.plans.forEach((plan: any, index: number) => {
            console.log(`flavor ${index + 1}:`, {
              id: plan.id,
              name: plan.flavorName, // 元のフレーバー名
              vcpus: plan.vcpus,
              ram: plan.ramGB * 1024, // MBに変換
              disk: plan.disk,
              flavorType: plan.flavorType,
              // 元のflavorsResに含まれる可能性のある他のプロパティ
              originalFlavorName: plan.flavorName,
              extractedRamGB: plan.ramGB,
              extractedCpuCores: plan.vcpus,
            });
          });
        }

        console.log("=== flavorsRes取得完了 ===");
      } catch (err) {
        console.error("flavorsRes取得中にエラーが発生しました:", err);
      }
    };

    fetchFlavorsRes();

  }, []); // 依存配列を空配列に修正



  const handleServerSelect = async (serverId: string) => {
    setSelectedServerId(serverId);
    await loadServerInfo(serverId);
  };

  const handleRefreshServerList = () => {
    loadServerList();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleServerStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setServerStatus(event.target.checked);
  };

  const handleAutoBackupChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAutoBackup(event.target.checked);
  };

  const handleDeleteLockChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeleteLock(event.target.checked);
  };

  const handleServerNameEdit = () => {
    setIsEditingServerName(true);
  };

  const handleServerNameSave = () => {
    setIsEditingServerName(false);
  };

  const handleServerNameCancel = () => {
    setServerName(serverInfo?.nameTag || "");
    setIsEditingServerName(false);
  };
  const handleServerNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setServerName(event.target.value);
  };

  if (loading && !serverInfo) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#19B8D7" }} />
      </Box>
    );
  }

  // const pathname = usePathname();
  // const getPageTitle = () => {
  //   if (pathname === '/easy/serverinfo') return menuLabels.myServer;
  //   if (pathname === '/account') return menuLabels.accountSettings;
  //   if (pathname === '/create') return menuLabels.createServer;
  //   return '';
  // };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "white",
          borderBottom: 1,
          borderColor: "divider",
          position: "relative",
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <Header iconUrl={iconUrl}/>

          {error && (
            <Alert
              severity="warning"
              sx={{ m: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleRefreshServerList}
                  startIcon={<Refresh />}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Server Info Bar */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "center" },
              gap: { xs: 1, md: 2 },
              pt: 2,
              pl: { xs: 1, md: 2 },
              pr: { xs: 1, md: 2 },
            }}
          >
            {/* First Row - Arrow, Server Name and Edit Icon */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
                gap: { xs: 1, md: 2 },
                flexWrap: { xs: "wrap", md: "nowrap" },
                width: { xs: "100%", md: "auto" },
              }}
            >
              <IconButton
                size="small"
                sx={{ color: "text.secondary" }}
                onClick={() => setIsServerListOpen((prev) => !prev)}
              >
                <KeyboardArrowRight
                  sx={{
                    transform: isServerListOpen ? "rotate(90deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                />
              </IconButton>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isEditingServerName ? (
                  <>
                    <input
                      type="text"
                      value={serverName}
                      onChange={handleServerNameChange}
                      style={{
                        border: '1px solid #19B8D7',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '16px',
                        fontWeight: '500',
                        outline: 'none',
                        minWidth: '150px'
                      }}
                      autoFocus
                    />
                    <IconButton
                      size="small"
                      sx={{ color: '#19B8D7' }}
                      onClick={handleServerNameSave}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ color: 'text.secondary' }}
                      onClick={handleServerNameCancel}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "medium",
                        fontSize: { xs: "1.7rem", md: "2.0rem" }
                      }}
                    >
                      {serverName}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{ color: "#19B8D7" }}
                      onClick={handleServerNameEdit}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>

            {/* Second Row - IP Address and Status Switch */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "center" },
                gap: { xs: 2, md: 2 },
                width: { xs: "100%", md: "auto" },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "medium",
                  fontSize: { xs: "1.5rem", md: "1.125rem" },
                  color: "text.secondary",
                }}
              >
                {serverInfo?.ipAddress ?? "Loading..."}
              </Typography>
              <Switch
                checked={serverStatus}
                onChange={(e) => requestStatusToggle(e.target.checked)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#19B8D7",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#19B8D7",
                  },
                }}
              />
            </Box>
          </Box>

          {isServerListOpen && serverList.length > 1 && (
            <Box sx={{ pb: 2, pl: { xs: 1, md: 2 }, pr: { xs: 1, md: 2 } }}>
              <Paper sx={{ maxHeight: { xs: 150, md: 200 }, overflow: "auto" }}>
                <List dense={window.innerWidth < 600}>
                  {serverList.map((server) => (
                    <ListItem key={server.id} disablePadding>
                      <ListItemButton
                        selected={selectedServerId === server.id}
                        onClick={() => handleServerSelect(server.id)}
                        disabled={serverListLoading}
                        sx={{ py: { xs: 0.5, md: 1 } }}
                      >
                        <ListItemText
                          primary={server.displayName}
                          primaryTypographyProps={{
                            fontSize: { xs: "0.875rem", md: "1rem" }
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}

          {/* Action Buttons */}
          <Box
            mt={2}
            mb={2}
            sx={{ 
              display: "flex", 
              gap: { xs: 1, md: 2 }, 
              flexWrap: "wrap", 
              px: { xs: 1, md: 2 },
              justifyContent: { xs: "center", md: "flex-start" }
            }}
          >
            {serverActions.map(
              ({ label, icon: IconComponent, slug }, index: number) => (
                <Button
                  key={index}
                  variant="outlined"
                  startIcon={<IconComponent />}
                  disabled={
                    (slug == "reboot" && !serverStatus) ||
                    (slug == "force_shutdown" && !serverStatus) ||
                    (slug == "delete" && deleteLock)
                  }
                  onClick={() => {
                    if (slug) {
                      openConfirm(slug, label);
                    }
                  }}
                  sx={{
                    borderRadius: "50px",
                    textTransform: "none",
                    borderColor: "#19B8D7",
                    color: "#19B8D7",
                    minHeight: { xs: "40px", md: "36px" },
                    px: { xs: 2, md: 3 },
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                    "&:hover": {
                      borderColor: "#15a0c0",
                      backgroundColor: "#e3f2fd",
                    },
                  }}
                >
                  {label}
                </Button>
              )
            )}
          </Box>
          <Dialog
            open={confirmOpen}
            onClose={handleConfirmCancel}
            aria-labelledby="server-action-confirm-title"
          >
            <DialogTitle id="server-action-confirm-title">
              {pendingAction?.label} の確認
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                本当に {pendingAction?.label} を実行しますか？
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConfirmCancel}>キャンセル</Button>
              <Button onClick={handleConfirmOk} autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          />
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 3 } }}>
        <Paper sx={{ width: "100%", mx: { xs: 0, md: "auto" } }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: { xs: 36, md: 40 },
                alignItems: "center",
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: "medium",
                  minHeight: { xs: 36, md: 40 },
                  fontSize: { xs: "0.875rem", md: "1rem" },
                  px: { xs: 1, md: 2 },
                  minWidth: { xs: "auto", md: 90 },
                  display: "flex",
                  alignItems: "center",
                  lineHeight: 1.5,
                },
                "& .Mui-selected": {
                  color: "#19B8D7",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#19B8D7",
                  height: 3,
                },
              }}
            >
              <Tab label="サーバー設定" />
            </Tabs>
          </Box>

          {/* Server Settings Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: { xs: 0, md: 0 }, mx: { xs: -3, md: 0 } }}>
              <ServerSettingsTab
                autoBackup={autoBackup}
                deleteLock={deleteLock}
                onAutoBackupChange={handleAutoBackupChange}
                onDeleteLockChange={handleDeleteLockChange}
                serverInfo={serverInfo}
                onNameTagChange={handleNameTagChange}
              />
            </Box>
          </TabPanel>
        </Paper>

        {/* Billing Cards */}
        <BillingCards />

        {/* Help Link */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: { xs: "center", md: "flex-end" }, 
          mt: 2,
          px: { xs: 1, md: 0 }
        }}>
          <Button
            startIcon={<HelpOutline />}
            sx={{
              color: "#19B8D7",
              textTransform: "none",
              fontSize: { xs: "0.875rem", md: "1rem" },
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            この画面のサポート &gt;
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default function ServerInfoPage() {
  return (
    <AuthGuard>
      <ServerInfo />
    </AuthGuard>
  );
}
