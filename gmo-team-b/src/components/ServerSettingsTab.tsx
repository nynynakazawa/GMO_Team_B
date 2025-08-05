import React from 'react';
import { Box } from '@mui/material';
import { serverInfoMockData } from '../data/serverInfoMockData';
import ServerSettingsRow from './ServerSettingsRow';

interface ServerSettingsTabProps {
  autoBackup: boolean;
  deleteLock: boolean;
  onAutoBackupChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteLockChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ServerSettingsTab({
  autoBackup,
  deleteLock,
  onAutoBackupChange,
  onDeleteLockChange,
}: ServerSettingsTabProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* 1行目: ネームタグ、有効期間 */}
      <ServerSettingsRow
        leftItem={serverInfoMockData.serverSettings[0]}
        rightItem={serverInfoMockData.serverSettings[1]}
        customBorderWidth="5px solid #e0e0e0"
      />

      {/* 2行目: ブートストレージ、追加ストレージ */}
      <ServerSettingsRow
        leftItem={serverInfoMockData.serverSettings[2]}
        rightItem={serverInfoMockData.serverSettings[3]}
      />

      {/* 3行目: 自動バックアップ、削除ロック */}
      <ServerSettingsRow
        leftItem={serverInfoMockData.serverSettings[4]}
        rightItem={serverInfoMockData.serverSettings[5]}
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
        leftItem={serverInfoMockData.serverSettings[6]}
        rightItem={serverInfoMockData.serverSettings[7]}
      />

      {/* 5行目: ゲートウェイ、MACアドレス */}
      <ServerSettingsRow
        leftItem={serverInfoMockData.serverSettings[8]}
        rightItem={serverInfoMockData.serverSettings[11]}
      />

      {/* 6行目: DNSサーバー1、DNSサーバー2 */}
      <ServerSettingsRow
        leftItem={serverInfoMockData.serverSettings[9]}
        rightItem={serverInfoMockData.serverSettings[10]}
      />

      {/* 7行目: 帯域、セキュリティグループ */}
      <ServerSettingsRow
        leftItem={serverInfoMockData.serverSettings[12]}
        rightItem={serverInfoMockData.serverSettings[13]}
        isLastRow={true}
      />
    </Box>
  );
} 