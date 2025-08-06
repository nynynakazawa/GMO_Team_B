import React from 'react';
import { Box } from '@mui/material';
import { serverInfoMockData } from '../../../data/serverInfoMockData';
import ServerSettingsRow from './ServerSettingsRow';

interface ServerSettingsTabProps {
  autoBackup: boolean;
  deleteLock: boolean;
  onAutoBackupChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteLockChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  serverInfo?: {
    nameTag: string;
    ipAddress: string;
    subnetMask: string;
    gateway: string;
    macAddress: string;
    dnsServer1: string;
    dnsServer2: string;
    bandwidthIn: string;
    bandwidthOut: string;
    bootStorage: string;
    securityGroup: string;
  } | null;
}

export default function ServerSettingsTab({
  autoBackup,
  deleteLock,
  onAutoBackupChange,
  onDeleteLockChange,
  serverInfo,
}: ServerSettingsTabProps) {
  // Create dynamic server settings based on serverInfo or fallback to mock data
  const dynamicSettings = serverInfo ? [
    { ...serverInfoMockData.serverSettings[0], value: serverInfo.nameTag },
    { ...serverInfoMockData.serverSettings[1] },
    { ...serverInfoMockData.serverSettings[2], value: serverInfo.bootStorage },
    { ...serverInfoMockData.serverSettings[3] },
    { ...serverInfoMockData.serverSettings[4] },
    { ...serverInfoMockData.serverSettings[5] },
    { ...serverInfoMockData.serverSettings[6], value: serverInfo.ipAddress },
    { ...serverInfoMockData.serverSettings[7], value: serverInfo.subnetMask },
    { ...serverInfoMockData.serverSettings[8], value: serverInfo.gateway },
    { ...serverInfoMockData.serverSettings[9], value: serverInfo.dnsServer1 },
    { ...serverInfoMockData.serverSettings[10], value: serverInfo.dnsServer2 },
    { ...serverInfoMockData.serverSettings[11], value: serverInfo.macAddress },
    { ...serverInfoMockData.serverSettings[12], value: `In ${serverInfo.bandwidthIn} Mbps / Out ${serverInfo.bandwidthOut} Mbps` },
    { ...serverInfoMockData.serverSettings[13], value: serverInfo.securityGroup },
  ] : serverInfoMockData.serverSettings;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* 1行目: ネームタグ、有効期間 */}
      <ServerSettingsRow
        leftItem={dynamicSettings[0]}
        rightItem={dynamicSettings[1]}
        customBorderWidth="5px solid #e0e0e0"
      />

      {/* 2行目: ブートストレージ、追加ストレージ */}
      <ServerSettingsRow
        leftItem={dynamicSettings[2]}
        rightItem={dynamicSettings[3]}
      />

      {/* 3行目: 自動バックアップ、削除ロック */}
      <ServerSettingsRow
        leftItem={dynamicSettings[4]}
        rightItem={dynamicSettings[5]}
        leftSwitch={{
          checked: autoBackup,
          onChange: onAutoBackupChange,
        }}
        rightSwitch={{
          checked: deleteLock,
          onChange: onDeleteLockChange,
        }}
        customBorderWidth="5px solid #e0e0e0"
      />

      {/* 4行目: IPアドレス、サブネットマスク */}
      <ServerSettingsRow
        leftItem={dynamicSettings[6]}
        rightItem={dynamicSettings[7]}
      />

      {/* 5行目: ゲートウェイ、MACアドレス */}
      <ServerSettingsRow
        leftItem={dynamicSettings[8]}
        rightItem={dynamicSettings[11]}
      />

      {/* 6行目: DNSサーバー1、DNSサーバー2 */}
      <ServerSettingsRow
        leftItem={dynamicSettings[9]}
        rightItem={dynamicSettings[10]}
      />

      {/* 7行目: 帯域、セキュリティグループ */}
      <ServerSettingsRow
        leftItem={dynamicSettings[12]}
        rightItem={dynamicSettings[13]}
        isLastRow={true}
      />
    </Box>
  );
} 