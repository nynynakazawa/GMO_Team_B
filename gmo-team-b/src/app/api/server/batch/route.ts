// app/api/server/batch/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerInfo, ParsedServerInfo } from "../getServerInfo";
import { getConoHaTokenAndEndpoint } from "@/pages/api/vps/conohaAuth";

interface BatchServerInfoResponse {
  servers: (ParsedServerInfo & { id: string })[];
  errors: { id: string; error: string }[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serverIds } = body as { serverIds: string[] };

    if (!Array.isArray(serverIds) || serverIds.length === 0) {
      return NextResponse.json(
        { error: "serverIds array is required" },
        { status: 400 }
      );
    }

    console.log(`=== バッチサーバー情報取得開始 (${serverIds.length}台) ===`);
    
    // 一度だけ認証を取得
    const tokenAndEndpoint = await getConoHaTokenAndEndpoint();
    const token = tokenAndEndpoint.token;
    
    if (!token) {
      console.warn('CONOHA_TOKEN not found, returning mock data for all servers');
      
      // Return mock data for all servers when token is not available
      const mockServers = serverIds.map(id => ({
        id,
        nameTag: `game-server-${id.slice(-4)}`,
        status: "ACTIVE",
        ipAddress: "133.117.75.97",
        subnetMask: "255.255.254.0",
        gateway: "133.117.75.1",
        macAddress: "fa:16:3e:f7:4e:47",
        dnsServer1: "150.95.10.8",
        dnsServer2: "150.95.10.9",
        bandwidthIn: "100.0",
        bandwidthOut: "100.0",
        autoBackupEnabled: false,
        bootStorage: "SSD 100GB",
        securityGroup: "default",
      }));
      
      return NextResponse.json({ servers: mockServers, errors: [] }, { status: 200 });
    }

    // 並行してサーバー情報を取得（ただし認証は1回のみ）
    const results = await Promise.allSettled(
      serverIds.map(async (serverId) => {
        try {
          const info = await getServerInfo(token, serverId);
          return { id: serverId, ...info };
        } catch (error) {
          throw { id: serverId, error: error instanceof Error ? error.message : String(error) };
        }
      })
    );

    const servers: (ParsedServerInfo & { id: string })[] = [];
    const errors: { id: string; error: string }[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        servers.push(result.value);
      } else {
        errors.push(result.reason);
      }
    });

    console.log(`=== バッチサーバー情報取得完了 (成功: ${servers.length}台, 失敗: ${errors.length}台) ===`);

    const response: BatchServerInfoResponse = { servers, errors };
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error in batch server info fetch:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}