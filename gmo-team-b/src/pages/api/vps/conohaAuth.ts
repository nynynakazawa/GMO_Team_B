// ConoHa API v3認証レスポンスの型
export type ConoHaAuthResponse = {
  token: {
    expires_at: string;
    catalog: Array<{
      type: string;
      name: string;
      endpoints: Array<{
        interface: string;
        region: string;
        url: string;
      }>;
    }>;
    project: {
      id: string;
      name: string;
    };
  };
};

// トークンキャッシュ用の変数
let cachedToken: string | null = null;
let cachedComputeEndpoint: string | null = null;
let cachedProjectId: string | null = null;
let tokenExpiryTime: number | null = null;

// 同時実行制御用の変数
let authenticationInProgress: Promise<{
  token: string;
  computeEndpoint: string;
  projectId: string;
}> | null = null;
// ConoHa APIトークンとエンドポイントを取得する関数
export async function getConoHaTokenAndEndpoint(): Promise<{
  token: string;
  computeEndpoint: string;
  projectId: string;
}> {
  // キャッシュされたトークンが有効な場合はそれを返す
  if (cachedToken && cachedComputeEndpoint && cachedProjectId && tokenExpiryTime) {
    const now = Date.now();
    // トークンの有効期限の10分前に期限切れとみなす（より長くキャッシュを保持）
    if (now < tokenExpiryTime - 10 * 60 * 1000) {
      console.log("=== キャッシュされたトークンを使用 ===");
      return {
        token: cachedToken,
        computeEndpoint: cachedComputeEndpoint,
        projectId: cachedProjectId,
      };
    }
  }

  // 既に認証処理が進行中の場合は、その結果を待つ
  if (authenticationInProgress) {
    console.log("=== 認証処理進行中のため待機 ===");
    return await authenticationInProgress;
  }

  // 認証処理を開始し、Promiseを保存
  authenticationInProgress = performAuthentication();
  
  try {
    const result = await authenticationInProgress;
    return result;
  } finally {
    // 認証処理完了後、フラグをクリア
    authenticationInProgress = null;
  }
}

// 実際の認証処理を行う内部関数
async function performAuthentication(): Promise<{
  token: string;
  computeEndpoint: string;
  projectId: string;
}> {
  const username = process.env.CONOHA_USERNAME;
  const password = process.env.CONOHA_PASSWORD;
  const tenantName = process.env.CONOHA_TENANT_NAME;
  const identityService = process.env.CONOHA_IDENTITY_SERVICE;
  if (!username || !password || !tenantName || !identityService) {
    throw new Error("ConoHa credentials not configured");
  }
  // ConoHa API v3の認証ペイロード
  const authPayload = {
    auth: {
      identity: {
        methods: ["password"],
        password: {
          user: {
            name: username,
            password: password,
            domain: {
              name: "default",
            },
          },
        },
      },
      scope: {
        project: {
          name: tenantName,
          domain: {
            name: "default",
          },
        },
      },
    },
  };

  console.log("=== ConoHa認証開始 ===");
  console.log("認証URL:", `${identityService}/auth/tokens`);
  console.log("認証ペイロード:", JSON.stringify(authPayload, null, 2));
  const response = await fetch(`${identityService}/auth/tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authPayload),
  });

  console.log("認証レスポンスステータス:", response.status, response.statusText);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("認証失敗:", response.status, response.statusText, errorText);
    
    // エラーが発生した場合はキャッシュをクリア
    cachedToken = null;
    cachedComputeEndpoint = null;
    cachedProjectId = null;
    tokenExpiryTime = null;
    
    throw new Error(`ConoHa authentication failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  // ConoHa API v3では、トークンはX-Subject-Tokenヘッダーに含まれる
  const token = response.headers.get('X-Subject-Token');

  console.log("取得されたトークン:", token);
  if (!token) {
    console.error("トークンが見つかりません");
    throw new Error('No token found in response headers');
  }
  const authData: ConoHaAuthResponse = await response.json();
  console.log("認証レスポンスデータ:", {
    projectId: authData.token.project.id,
    projectName: authData.token.project.name,
    expiresAt: authData.token.expires_at,
    catalogServices: authData.token.catalog.map(service => service.type)
  });
  // サービスカタログからCompute Serviceのエンドポイントを取得
  const computeService = authData.token.catalog.find(
    (service) => service.type === "compute"
  );
  if (!computeService) {
    console.error("Compute service not found in catalog");
    throw new Error('Compute service not found in catalog');
  }
  const publicEndpoint = computeService.endpoints.find(endpoint => endpoint.interface === 'public');
  if (!publicEndpoint) {
    console.error("Public compute endpoint not found");
    throw new Error('Public compute endpoint not found');
  }

  console.log("Compute エンドポイント:", publicEndpoint.url);
  console.log("=== ConoHa認証完了 ===");

  // トークンをキャッシュに保存
  cachedToken = token;
  cachedComputeEndpoint = publicEndpoint.url;
  cachedProjectId = authData.token.project.id;
  // トークンの有効期限を設定（ISO 8601文字列をミリ秒に変換）
  tokenExpiryTime = new Date(authData.token.expires_at).getTime();

  return {
    token,
    computeEndpoint: publicEndpoint.url,
    projectId: authData.token.project.id,
  };
}

// キャッシュの状態を確認する関数
export function getCacheStatus(): {
  hasCachedToken: boolean;
  tokenExpiryTime: number | null;
  timeUntilExpiry: number | null;
} {
  const now = Date.now();
  const hasCachedToken = !!(cachedToken && cachedComputeEndpoint && cachedProjectId && tokenExpiryTime);
  const timeUntilExpiry = tokenExpiryTime ? tokenExpiryTime - now : null;
  
  return {
    hasCachedToken,
    tokenExpiryTime,
    timeUntilExpiry,
  };
}

// APIハンドラー - URL直打ちで実行可能
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {

    return res.status(405).json({
      message: "Method Not Allowed. Use GET method to test authentication."
    });
  }
  try {
    console.log("=== ConoHa認証API直接実行 ===");
    console.log("リクエスト時刻:", new Date().toISOString());
    console.log("リクエストメソッド:", req.method);
    console.log("リクエストURL:", req.url);
    const result = await getConoHaTokenAndEndpoint();
    console.log("=== 認証結果 ===");
    console.log("プロジェクトID:", result.projectId);
    console.log("Compute エンドポイント:", result.computeEndpoint);
    console.log("トークン（最初の20文字）:", result.token.substring(0, 20) + "...");

    // セキュリティのため、トークンは最初の20文字のみ返す
    const responseData = {
      success: true,
      message: "ConoHa認証が成功しました",
      data: {
        projectId: result.projectId,
        computeEndpoint: result.computeEndpoint,
        tokenPreview: result.token.substring(0, 20) + "...",
        timestamp: new Date().toISOString()
      }
    };

    res.status(200).json(responseData);

  } catch (error) {
    console.error("=== ConoHa認証API実行エラー ===");
    console.error("エラー:", error);


    res.status(500).json({
      success: false,
      message: "ConoHa認証に失敗しました",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
  }
}