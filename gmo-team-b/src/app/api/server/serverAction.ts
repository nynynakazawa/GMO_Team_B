export async function getConoHaTokenAndEndpoint(): Promise<{
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
  return {
    token,
    computeEndpoint: publicEndpoint.url,
    projectId: authData.token.project.id,
  };
}