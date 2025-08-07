import {
  RestartAlt,
  PowerSettingsNew,
  OpenInNew,
  CloudUpload,
  CloudDownload,
  Delete,
} from '@mui/icons-material';

export interface ServerAction {
  label: string;
  icon: React.ComponentType;
}

export interface ServerSetting {
  label: string;
  value: string | boolean;
  type: 'text' | 'editable' | 'copyable' | 'toggle' | 'clearable';
  key?: string;
  help?: string;
  clearable?: boolean;
}

export interface ServerInfoData {
  serverName: string;
  ipAddress: string;
  serverId: string;
  actions: ServerAction[];
  serverSettings: ServerSetting[];
}

export const serverInfoMockData: ServerInfoData = {
  serverName: 'game-2025-08-04-13-54',
  ipAddress: '133.117.75.97',
  serverId: 'test-server-id-12345',
  actions: [
    {
      label: '再起動',
      icon: RestartAlt,
    },
    {
      label: '強制終了',
      icon: PowerSettingsNew,
    },
    {
      label: '管理画面',
      icon: OpenInNew,
    },
    {
      label: '保存',
      icon: CloudUpload,
    },
    {
      label: '復元',
      icon: CloudDownload,
    },
    {
      label: '削除',
      icon: Delete,
    },
  ],
  serverSettings: [
    {
      label: 'ネームタグ',
      value: 'vps-2025-08-04-14-39',
      type: 'editable',
    },
    {
      label: '有効期間',
      value: '時間課金',
      type: 'clearable',
      help: 'サーバーの利用期間について',
      clearable: true,
    },
    {
      label: 'ブートストレージ',
      value: 'SSD 100GB',
      type: 'clearable',
      clearable: true,
    },
    {
      label: '追加ストレージ',
      value: '未接続',
      type: 'clearable',
      help: '追加ストレージの接続状況',
      clearable: true,
    },
    {
      label: '自動バックアップ',
      value: false,
      type: 'toggle',
      key: 'autoBackup',
    },
    {
      label: '削除ロック',
      value: false,
      type: 'toggle',
      key: 'deleteLock',
      help: 'サーバーの削除を防ぐロック機能',
    },
    {
      label: 'IPアドレス',
      value: '163.44.116.129',
      type: 'copyable',
    },
    {
      label: 'サブネットマスク',
      value: '255.255.254.0',
      type: 'text',
    },
    {
      label: 'ゲートウェイ',
      value: '163.44.116.1',
      type: 'text',
    },
    {
      label: 'DNSサーバー1',
      value: '150.95.10.8',
      type: 'text',
    },
    {
      label: 'DNSサーバー2',
      value: '150.95.10.9',
      type: 'text',
    },
    {
      label: 'MACアドレス',
      value: 'fa:16:3e:f7:4e:47',
      type: 'text',
    },
    {
      label: '帯域',
      value: 'In 100.0 Mbps / Out 100.0 Mbps',
      type: 'editable',
    },
    {
      label: 'セキュリティグループ',
      value: 'default',
      type: 'editable',
      help: 'セキュリティグループの設定',
    },
  ],
}; 