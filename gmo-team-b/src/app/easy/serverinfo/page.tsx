'use client';

import React, { useState } from 'react';
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
  Divider,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';
import {
  KeyboardArrowRight,
  Refresh,
  HelpOutline,
  Edit,
  Clear,
  ContentCopy,
  RestartAlt,
  PowerSettingsNew,
  OpenInNew,
  CloudUpload,
  CloudDownload,
  Delete,
  Person,
} from '@mui/icons-material';
import { serverInfoMockData, ServerAction, ServerSetting } from '../../../data/serverInfoMockData';
import ServerSettingsTab from '../../../components/ServerSettingsTab';
import ServerNameEditor from '../../../components/ServerNameEditor';
import UserMenu from '../../../components/UserMenu';

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
  const [selectedPlan, setSelectedPlan] = useState('8GB/6Core');
  const [autoBackup, setAutoBackup] = useState(false);
  const [deleteLock, setDeleteLock] = useState(false);
  const [serverName, setServerName] = useState(serverInfoMockData.serverName);
  const [isEditingServerName, setIsEditingServerName] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [easyMode, setEasyMode] = useState(true);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleServerStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServerStatus(event.target.checked);
  };

  const handleAutoBackupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoBackup(event.target.checked);
  };

  const handleDeleteLockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteLock(event.target.checked);
  };

  const handlePlanChange = (event: any) => {
    setSelectedPlan(event.target.value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleServerNameEdit = () => {
    setIsEditingServerName(true);
  };

  const handleServerNameSave = () => {
    setIsEditingServerName(false);
    // ここでサーバー名の保存処理を追加できます
  };

  const handleServerNameCancel = () => {
    setServerName(serverInfoMockData.serverName);
    setIsEditingServerName(false);
  };

  const handleServerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServerName(event.target.value);
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleEasyModeChange = (checked: boolean) => {
    setEasyMode(checked);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', p: 2, position: 'relative' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ color: '#19B8D7', fontWeight: 'bold' }}>
                ConoHa for GAME
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                by GMO
              </Typography>
            </Box>
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

          {/* Server Info Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <KeyboardArrowRight />
            </IconButton>
            <ServerNameEditor
              serverName={serverName}
              ipAddress={serverInfoMockData.ipAddress}
              isEditing={isEditingServerName}
              onEdit={handleServerNameEdit}
              onSave={handleServerNameSave}
              onCancel={handleServerNameCancel}
              onChange={handleServerNameChange}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Switch
                checked={serverStatus}
                onChange={handleServerStatusChange}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#19B8D7',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#19B8D7',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {serverInfoMockData.actions.map((action: ServerAction, index: number) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  variant="outlined"
                  startIcon={<IconComponent />}
                  sx={{
                    borderRadius: '50px',
                    textTransform: 'none',
                    borderColor: '#19B8D7',
                    color: '#19B8D7',
                    '&:hover': {
                      borderColor: '#15a0c0',
                      backgroundColor: '#e3f2fd',
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
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 'medium',
                },
                '& .Mui-selected': {
                  color: '#19B8D7',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#19B8D7',
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
            />
          </TabPanel>

          {/* Plan Change Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                プランを変更しますか?
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
                ストレージ容量は変更されません。これまでのリソースグラフのデータは削除されます。
              </Typography>

              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        変更前プラン
                      </Typography>
                      <Typography variant="body2">メモリ 4GB/CPU 4Core</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        変更後プラン
                      </Typography>
                      <FormControl size="small" sx={{ minWidth: 200 }}>
                        <Select
                          value={selectedPlan}
                          onChange={handlePlanChange}
                          displayEmpty
                          sx={{ '& .MuiSelect-icon': { color: '#19B8D7' } }}
                        >
                          <MenuItem value="8GB/6Core">メモリ 8GB/CPU 6Core</MenuItem>
                          <MenuItem value="16GB/8Core">メモリ 16GB/CPU 8Core</MenuItem>
                          <MenuItem value="32GB/12Core">メモリ 32GB/CPU 12Core</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        プラン変更後の料金
                      </Typography>
                      <Typography variant="body2">8,082 円/月 (14.6 円/時間)</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: '50px',
                    textTransform: 'none',
                    borderColor: 'text.secondary',
                    color: 'text.secondary',
                  }}
                >
                  いいえ
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: '50px',
                    textTransform: 'none',
                    bgcolor: '#19B8D7',
                    '&:hover': { bgcolor: '#15a0c0' },
                  }}
                >
                  はい
                </Button>
              </Box>

              <Typography variant="caption" sx={{ textAlign: 'center', display: 'block', color: 'text.secondary' }}>
                ※表示料金にはサービス維持調整費が含まれています。
                <Typography
                  component="span"
                  sx={{ color: '#19B8D7', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  詳しくはこちら
                </Typography>
              </Typography>
            </Box>
          </TabPanel>
        </Paper>

        {/* Help Link */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            startIcon={<HelpOutline />}
            sx={{
              color: '#19B8D7',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'transparent' },
            }}
          >
            この画面のサポート &gt;
          </Button>
        </Box>
      </Container>
    </Box>
  );
} 