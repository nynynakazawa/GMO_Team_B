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
  Select,
  MenuItem,
  FormControl,
  Card,
  CardContent,
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
  OpenInNew,
  CloudUpload,
  CloudDownload,
  Delete,
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

  // Load server list with nameTags
  const loadServerList = async () => {
    try {
      setServerListLoading(true);
      setError(null);

      const res = await fetch("/api/server/getServerList");

      if (!res.ok) {
        throw new Error(
          `Server list API call failed: ${res.status} ${res.statusText}`
        );
      }

      const json = (await res.json()) as ServerListResponse;
      console.log("Server list response:", json);

      // Safely access the servers array with proper null checks
      const basicList = json?.servers || [];

      if (Array.isArray(basicList) && basicList.length > 0) {
        // Enhance server list with nameTags
        const enhancedList: EnhancedServerSummary[] = await Promise.all(
          basicList.map(async (server) => {
            const nameTag = await loadServerNameTag(server.id);
            return {
              ...server,
              nameTag,
              displayName: nameTag || server.name, // Use nameTag if available, fallback to name
            };
          })
        );

        setServerList(enhancedList);
        setSelectedServerId(enhancedList[0].id);
        await loadServerInfo(enhancedList[0].id);
      } else {
        console.warn("No servers found in the response");
        setError("No servers found");
      }
    } catch (err) {
      console.error("Failed to load server list", err);
      setError(
        `Failed to load server list: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );

      // Fallback to mock data
      const mockList: EnhancedServerSummary[] = [
        {
          id: "be135a87-c7ee-4f43-8072-8531716cad09",
          name: "game-2025-08-04-13-54",
          nameTag: "game-2025-08-04-13-54",
          displayName: "game-2025-08-04-13-54",
          links: [],
        },
      ];
      setServerList(mockList);
      setSelectedServerId(mockList[0].id);
      await loadServerInfo(mockList[0].id);
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
      setServerInfo(info);
      setServerName(info.nameTag);
      setServerStatus(info.status == "ACTIVE");
    } catch (err) {
      console.warn("Server info API call failed, using mock data:", err);

      // Fallback to mock data
      const mockServerInfo: ParsedServerInfo = {
        nameTag: serverInfoMockData.serverName,
        status: "ACTIVE",
        ipAddress: serverInfoMockData.ipAddress,
        subnetMask: "255.255.254.0",
        gateway: "163.44.116.1",
        macAddress: "fa:16:3e:f7:4e:47",
        dnsServer1: "150.95.10.8",
        dnsServer2: "150.95.10.9",
        bandwidthIn: "100.0",
        bandwidthOut: "100.0",
        autoBackupEnabled: false,
        bootStorage: "SSD 100GB",
        securityGroup: "default",
      };

      setServerInfo(mockServerInfo);
      setServerName(mockServerInfo.nameTag);
      setError("Using mock data - API unavailable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServerList();

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
  }, []);

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
              alignItems: "center",
              gap: 2,
              pt: 2,
              pl: 2,
              pr: 2,
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
            <ServerNameEditor
              serverName={serverName}
              ipAddress={serverInfo?.ipAddress ?? "Loading..."}
              isEditing={isEditingServerName}
              onEdit={handleServerNameEdit}
              onSave={handleServerNameSave}
              onCancel={handleServerNameCancel}
              onChange={handleServerNameChange}
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
            <Box sx={{ pb: 2, pl: 2, pr: 2 }}>
              <Paper sx={{ maxHeight: 200, overflow: "auto" }}>
                <List>
                  {serverList.map((server) => (
                    <ListItem key={server.id} disablePadding>
                      <ListItemButton
                        selected={selectedServerId === server.id}
                        onClick={() => handleServerSelect(server.id)}
                        disabled={serverListLoading}
                      >
                        <ListItemText
                          primary={server.displayName}
                          // secondary={server.id}
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
            sx={{ display: "flex", gap: 2, flexWrap: "wrap", px: 2 }}
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
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Paper sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                minHeight: 40,
                alignItems: "center",
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: "medium",
                  minHeight: 40,
                  fontSize: "1rem",
                  px: 2,
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
            <ServerSettingsTab
              autoBackup={autoBackup}
              deleteLock={deleteLock}
              onAutoBackupChange={handleAutoBackupChange}
              onDeleteLockChange={handleDeleteLockChange}
              serverInfo={serverInfo}
              onNameTagChange={handleNameTagChange}
            />
          </TabPanel>
        </Paper>

        {/* Billing Cards */}
        <BillingCards />

        {/* Help Link */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            startIcon={<HelpOutline />}
            sx={{
              color: "#19B8D7",
              textTransform: "none",
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
