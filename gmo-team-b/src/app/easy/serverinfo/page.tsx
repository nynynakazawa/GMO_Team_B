"use client";

import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { KeyboardArrowRight, HelpOutline, Refresh } from "@mui/icons-material";
import { serverInfoMockData } from "../../../data/serverInfoMockData";
import ServerSettingsTab from "../../../components/easy/serverinfo/ServerSettingsTab";
import ServerNameEditor from "../../../components/easy/serverinfo/ServerNameEditor";
import BillingCards from "../../../components/easy/serverinfo/BillingCards";
import { Header } from "../../../components/easy/Header";
import type { ParsedServerInfo } from "@/app/api/serverinfo/getServerInfo";
import type {
  ServerSummary,
  ServerListResponse,
} from "../../../types/serverTypes";

interface ServerAction {
  label: string;
  icon: React.ElementType;
}

const serverActions: ServerAction[] = [
  { label: "起動", icon: KeyboardArrowRight },
  { label: "再起動", icon: KeyboardArrowRight },
  { label: "シャットダウン", icon: KeyboardArrowRight },
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

export default function ServerInfoPage() {
  const [tabValue, setTabValue] = useState(0);
  const [serverStatus, setServerStatus] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("8GB/6Core");
  const [autoBackup, setAutoBackup] = useState(false);
  const [deleteLock, setDeleteLock] = useState(false);
  const [serverInfo, setServerInfo] = useState<ParsedServerInfo | null>(null);
  const [serverName, setServerName] = useState("");
  const [isEditingServerName, setIsEditingServerName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverList, setServerList] = useState<ServerSummary[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [serverListLoading, setServerListLoading] = useState(false);
  const [isServerListOpen, setIsServerListOpen] = useState(false);

  // Load server list
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
      const list = json?.servers || [];
      setServerList(list);

      if (Array.isArray(list) && list.length > 0) {
        setSelectedServerId(list[0].id);
        await loadServerInfo(list[0].id);
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
      const mockList: ServerSummary[] = [
        {
          id: "be135a87-c7ee-4f43-8072-8531716cad09",
          name: "game-2025-08-04-13-54",
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
    } catch (err) {
      console.warn("Server info API call failed, using mock data:", err);

      // Fallback to mock data
      const mockServerInfo: ParsedServerInfo = {
        nameTag: serverInfoMockData.serverName,
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

  const handlePlanChange = (event: any) => {
    setSelectedPlan(event.target.value);
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
          <Header />

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
            sx={{ display: "flex", alignItems: "center", gap: 2, pt: 2, pr: 2, pl:2 }}
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
                onChange={handleServerStatusChange}
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
          {/* Server Selection */}
          {isServerListOpen && serverList.length > 1 && (
            <Box sx={{ pb: 2, pr:2, pl:2 }}>
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
                          primary={server.name}
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
          <Box mt={2} mb={2} sx={{ display: "flex", gap: 2, flexWrap: "wrap", px: 2 }}>
            {serverActions.map((action: ServerAction, index: number) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  variant="outlined"
                  startIcon={<IconComponent />}
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
                  {action.label}
                </Button>
              );
            })}
          </Box>
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
              <Tab label="プラン変更" />
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
            />
          </TabPanel>

          {/* Plan Change Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ maxWidth: 600, mx: "auto" }}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                プランを変更しますか?
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  textAlign: "center",
                  color: "text.secondary",
                  display: "inline",
                }}
              >
                ストレージ容量は変更されません。
                <br />
                これまでのリソースグラフのデータは削除されます。
              </Typography>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        変更前プラン
                      </Typography>
                      <Typography variant="body2">
                        メモリ 4GB/CPU 4Core
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        変更後プラン
                      </Typography>
                      <FormControl size="small" sx={{ minWidth: 200 }}>
                        <Select
                          value={selectedPlan}
                          onChange={handlePlanChange}
                          displayEmpty
                          sx={{
                            "& .MuiSelect-icon": { color: "#19B8D7" },
                            fontSize: "1rem",
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: { fontSize: "1rem" },
                            },
                          }}
                        >
                          <MenuItem value="8GB/6Core" sx={{ fontSize: "1rem" }}>
                            メモリ 8GB/CPU 6Core
                          </MenuItem>
                          <MenuItem
                            value="16GB/8Core"
                            sx={{ fontSize: "1rem" }}
                          >
                            メモリ 16GB/CPU 8Core
                          </MenuItem>
                          <MenuItem
                            value="32GB/12Core"
                            sx={{ fontSize: "1rem" }}
                          >
                            メモリ 32GB/CPU 12Core
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        プラン変更後の料金
                      </Typography>
                      <Typography variant="body2">
                        8,082 円/月 (14.6 円/時間)
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "50px",
                    textTransform: "none",
                    borderColor: "text.secondary",
                    color: "text.secondary",
                  }}
                >
                  いいえ
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: "50px",
                    textTransform: "none",
                    bgcolor: "#19B8D7",
                    "&:hover": { bgcolor: "#15a0c0" },
                  }}
                >
                  はい
                </Button>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  textAlign: "center",
                  display: "block",
                  color: "text.secondary",
                }}
              >
                ※表示料金にはサービス維持調整費が含まれています。
                <span
                  style={{
                    color: "#19B8D7",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "inherit",
                    marginLeft: 4,
                  }}
                >
                  詳しくはこちら
                </span>
              </Typography>
            </Box>
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
