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

// ConoHa APIトークンとエンドポイントを取得する関数
export async function getConoHaTokenAndEndpoint(): Promise<{ token: string, computeEndpoint: string, projectId: string }> {
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
              name: "default"
            }
          }
        }
      },
      scope: {
        project: {
          name: tenantName,
          domain: {
            name: "default"
          }
        }
      }
    }
  };

  const response = await fetch(`${identityService}/auth/tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ConoHa authentication failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  // ConoHa API v3では、トークンはX-Subject-Tokenヘッダーに含まれる
  const token = response.headers.get('X-Subject-Token');
  if (!token) {
    throw new Error('No token found in response headers');
  }

  const authData: ConoHaAuthResponse = await response.json();

  // サービスカタログからCompute Serviceのエンドポイントを取得
  const computeService = authData.token.catalog.find(service => service.type === 'compute');
  if (!computeService) {
    throw new Error('Compute service not found in catalog');
  }

  const publicEndpoint = computeService.endpoints.find(endpoint => endpoint.interface === 'public');
  if (!publicEndpoint) {
    throw new Error('Public compute endpoint not found');
  }

  return {
    token,
    computeEndpoint: publicEndpoint.url,
    projectId: authData.token.project.id
  };
}