import { NextRequest, NextResponse } from 'next/server';
import { getConoHaTokenAndEndpoint, getCacheStatus } from '../../../../../pages/api/vps/conohaAuth';
import { getServerInfo } from '../../getServerInfo';

type ResourceType = 'cpu' | 'disk' | 'network';



const getApiEndpoint = (computeEndpoint: string, serverId: string, resourceType: ResourceType, portId?: string): string => {
  switch (resourceType) {
    case 'cpu':
      return `${computeEndpoint}/servers/${serverId}/rrd/cpu`;
    case 'disk':
      return `${computeEndpoint}/servers/${serverId}/rrd/disk`;
    case 'network':
      if (!portId) {
        throw new Error('Port ID is required for network resource');
      }
      return `${computeEndpoint}/servers/${serverId}/rrd/interface?port_id=${portId}`;
    default:
      throw new Error(`Unknown resource type: ${resourceType}`);
  }
};

// サーバーからポートIDを取得する関数
const getPortId = async (token: string, computeEndpoint: string, serverId: string): Promise<string> => {
  try {
    console.log(`Getting interface attachments for port ID...`);
    console.log(`Interface URL: ${computeEndpoint}/servers/${serverId}/os-interface`);
    
    // サーバーのインターフェース情報を取得
    const interfaceResponse = await fetch(`${computeEndpoint}/servers/${serverId}/os-interface`, {
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': token,
      },
    });

    if (!interfaceResponse.ok) {
      throw new Error(`Failed to fetch interface attachments: ${interfaceResponse.status}`);
    }

    const interfaceData = await interfaceResponse.json();
    console.log(`Interface data received:`, interfaceData);

    if (interfaceData.interfaceAttachments && interfaceData.interfaceAttachments.length > 0) {
      const firstInterface = interfaceData.interfaceAttachments[0];
      console.log(`First interface:`, firstInterface);
      
      if (firstInterface.port_id) {
        console.log(`Port ID found: ${firstInterface.port_id}`);
        return firstInterface.port_id;
      }
    }

    throw new Error('No port ID found in interface attachments');
  } catch (error) {
    console.error('Error getting port ID:', error);
    throw error;
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: serverId } = await params;
    const { searchParams } = new URL(request.url);
    const resourceType = searchParams.get('type') as ResourceType;
    
    console.log(`=== Resource API called ===`);
    console.log(`Server ID: ${serverId}`);
    console.log(`Resource Type: ${resourceType}`);
    
    if (!resourceType || !['cpu', 'disk', 'network'].includes(resourceType)) {
      console.log(`Invalid resource type: ${resourceType}`);
      return NextResponse.json(
        { error: 'Invalid resource type. Must be one of: cpu, disk, network' },
        { status: 400 }
      );
    }
    
    // キャッシュの状態を確認
    const cacheStatus = getCacheStatus();
    console.log(`Cache status:`, cacheStatus);
    
    // ConoHa APIからトークンとエンドポイントを取得（キャッシュ優先）
    console.log(`Getting ConoHa token and endpoint (with cache)...`);
    const { token, computeEndpoint } = await getConoHaTokenAndEndpoint();
    console.log(`Token obtained: ${token.substring(0, 20)}...`);
    console.log(`Compute endpoint: ${computeEndpoint}`);
    console.log(`Token length: ${token.length} characters`);
    console.log(`Using cached token: ${cacheStatus.hasCachedToken ? 'YES' : 'NO'}`);
    
    // サーバーの電源状態を確認
    console.log(`Getting server info for server ID: ${serverId}`);
    const serverInfo = await getServerInfo(token, serverId);
    console.log(`Server status: ${serverInfo.status}`);
    
    // サーバーが停止している場合はエラーメッセージを返す
    if (serverInfo.status !== 'ACTIVE') {
      return NextResponse.json(
        { 
          error: 'サーバーの電源が切れています',
          status: serverInfo.status,
          message: 'リソースデータを取得するにはサーバーを起動してください'
        },
        { status: 400 }
      );
    }
    
    // ネットワークリソースの場合はポートIDを取得
    let portId: string | undefined;
    if (resourceType === 'network') {
      console.log(`Getting port ID for network resource...`);
      portId = await getPortId(token, computeEndpoint, serverId);
      console.log(`Port ID obtained: ${portId}`);
    }

    // ConoHa APIからリソースデータを取得
    const apiEndpoint = getApiEndpoint(computeEndpoint, serverId, resourceType, portId);
    console.log(`API Endpoint: ${apiEndpoint}`);
    console.log(`Making request to ConoHa API...`);
    
    const response = await fetch(apiEndpoint, {
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': token,
      },
    });
    
    console.log(`Response status: ${response.status} ${response.statusText}`);
    console.log(`Response URL: ${response.url}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ConoHa API error: ${response.status} ${response.statusText}`);
      console.error(`Error response body: ${errorText}`);
      console.error(`Request URL: ${apiEndpoint}`);
      
      throw new Error(`ConoHa API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`Successfully received data for ${resourceType}`);
    console.log(`Data structure:`, Object.keys(data));
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching resource data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource data' },
      { status: 500 }
    );
  }
} 