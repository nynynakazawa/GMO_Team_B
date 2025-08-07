/** UI に渡すサーバ詳細 */
export interface ParsedServerInfo {
  nameTag: string;
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  macAddress: string;
  dnsServer1: string;
  dnsServer2: string;
  bandwidthIn: string; // Mbps
  bandwidthOut: string; // Mbps
  autoBackupEnabled: boolean;
  bootStorage: string; // 例: "SSD 100GB"
  securityGroup: string;

  status: string; 
}
// 取得済みサーバーの詳細情報レスポンス
export interface CreatedServerDetailResponse {
  server: ServerDetail;
}

export interface ServerDetail {
  /* --- 固定で必ず来るっぽいフィールド --- */
  id: string;
  name: string;
  status: string;
  tenant_id: string;
  user_id: string;
  hostId: string;

  // image は空文字 or オブジェクト or null らしいのでユニオン
  image: "" | ImageRef | null;

  flavor: FlavorRef;

  created: string; // ISO 8601
  updated: string; // ISO 8601

  // ネットワーク名 → Address[] のマップ
  addresses: Record<string, Address[]>;

  accessIPv4: string;
  accessIPv6: string;

  links: Link[];

  /** "MANUAL" など */
  "OS-DCF:diskConfig": string;

  /** availability zone 名 */
  "OS-EXT-AZ:availability_zone": string;

  /** "True" or "False" 的な文字列 */
  config_drive: string;

  key_name: string | null;

  "OS-SRV-USG:launched_at": string;
  "OS-SRV-USG:terminated_at": string | null;

  security_groups: { name: string }[];

  "OS-EXT-SRV-ATTR:host": string;
  "OS-EXT-SRV-ATTR:instance_name": string;
  "OS-EXT-SRV-ATTR:hypervisor_hostname": string;

  "OS-EXT-STS:task_state": string | null;
  "OS-EXT-STS:vm_state": string;
  "OS-EXT-STS:power_state": number;

  "os-extended-volumes:volumes_attached": VolumeRef[];

  /* --- ここから “来たり来なかったり” するやつは optional --- */

  /** 進行状況パーセンテージっぽい (0–100) */
  progress?: number;

  /** バックアップ系フィールドはないケースもあるので拡張プロパティで吸収 */
  metadata?: {
    [key: string]: string;
  };
}

export interface ImageRef {
  id: string;
  links: Link[];
}

export interface FlavorRef {
  id: string;
  links: Link[];
}

export interface Link {
  rel: string;
  href: string;
}

export interface Address {
  version: 4 | 6;
  addr: string;
  "OS-EXT-IPS:type": string;
  "OS-EXT-IPS-MAC:mac_addr": string;
}

export interface VolumeRef {
  id: string;
}

// サーバの情報を取得して UI 向けに整形
export async function getServerInfo(
  token: string,
  serverId: string
): Promise<ParsedServerInfo> {
    const serverService = "https://compute.c3j1.conoha.io/v2.1";

  if (!token) {
    throw new Error("getServerInfo: token is empty");
  }
  if (!serverId) {
    throw new Error("getServerInfo: serverId is empty");
  }

  console.log(`${serverService}/servers/${serverId}`)
  // 1) サーバ詳細を取得
  const res = await fetch(
    `${serverService}/servers/${serverId}`,
    {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-Auth-Token": token,
      },
    }
  );

  console.log(res);

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(
      `Failed to fetch server info: ${res.status} ${res.statusText} – ${txt}`
    );
  }

  const data = (await res.json()) as CreatedServerDetailResponse;
  const server = data.server;

  // name tag
  const nameTag =
    server.metadata?.instance_name_tag !== undefined
      ? server.metadata.instance_name_tag
      : server.name;

  // ---- ネットワーク情報 ----
  // ConoHa は v4/v6 混在の配列になる。最初の IPv4 を採用
  let ipAddress = "";
  let macAddress = "";
  for (const nets of Object.values(server.addresses)) {
    for (const addr of nets) {
      if (addr.version === 4) {
        ipAddress = addr.addr;
        macAddress = addr["OS-EXT-IPS-MAC:mac_addr"];
        break;
      }
    }
    if (ipAddress) break;
  }

  if (!ipAddress) {
    throw new Error("IPv4 address not found in server.addresses");
  }

  // subnet mask は /23 (=255.255.254.0) が ConoHa デフォ
  const subnetMask = "255.255.254.0";

  // gateway は IP アドレスの最後のオクテットを 1 にしたもの
  const gateway = (() => {
    const parts = ipAddress.split(".");
    parts[3] = "1";
    return parts.join(".");
  })();

  // ---- その他の固定 / 既知値 ----
  // ※ ConoHa 共通値。必要なら env 経由にする
  const dnsServer1 = "150.95.10.8";
  const dnsServer2 = "150.95.10.9";
  const bandwidthIn = "100.0"; // Mbps
  const bandwidthOut = "100.0";

  // 自動バックアップ: metadata.backup_status === "active" なら有効
  const autoBackupEnabled =
    server.metadata?.backup_status === "active" ? true : false;

  // ブートストレージ (例: 100GB)。情報は flavor もしくは別 API だが簡易で固定
  const bootStorage = "SSD 100GB";

  // セキュリティグループは 1 つ目を表示
  const securityGroup =
    server.security_groups && server.security_groups.length > 0
      ? server.security_groups[0].name
      : "—";


  // サーバの状態w（active, shutdownなど）
  const status = server.status || "no status";
  
  return {
    nameTag,
    status,
    ipAddress,
    subnetMask,
    gateway,
    macAddress,
    dnsServer1,
    dnsServer2,
    bandwidthIn,
    bandwidthOut,
    autoBackupEnabled,
    bootStorage,
    securityGroup,
  };
}
