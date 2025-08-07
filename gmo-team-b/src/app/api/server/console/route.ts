import { NextRequest, NextResponse } from 'next/server';
import { getConoHaTokenAndEndpoint } from '../../../../pages/api/vps/conohaAuth';

export async function POST(request: NextRequest) {
  console.log('=== WebSocketコンソールAPI開始 ===');
  console.log('リクエストURL:', request.url);
  console.log('リクエストメソッド:', request.method);
  console.log('リクエストヘッダー:', Object.fromEntries(request.headers.entries()));
  
  try {
    const body = await request.json();
    const { serverId } = body;
    
    console.log('リクエストボディ:', body);
    console.log('サーバーID:', serverId);
    
    if (!serverId) {
      console.log('サーバーIDが不足しています');
      return NextResponse.json(
        { error: 'サーバーIDが必要です' },
        { status: 400 }
      );
    }

    // ConoHa認証情報を取得
    console.log('ConoHa認証開始...');
    const { token, computeEndpoint } = await getConoHaTokenAndEndpoint();
    console.log('ConoHa認証完了:', { 
      computeEndpoint,
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'null'
    });

    // WebSocketコンソール接続URLを取得
    const apiUrl = `${computeEndpoint}/servers/${serverId}/remote-consoles`;
    console.log('ConoHa API URL:', apiUrl);
    
    const requestBody = {
      remote_console: {
        protocol: 'web',
        type: 'serial'
      }
    };
    
    console.log('ConoHa API リクエストボディ:', JSON.stringify(requestBody, null, 2));
    console.log('ConoHa API リクエストヘッダー:', {
      'Accept': 'application/json',
      'X-Auth-Token': token ? token.substring(0, 20) + '...' : 'null',
      'Content-Type': 'application/json'
    });

    const consoleResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('ConoHa API レスポンスステータス:', consoleResponse.status);
    console.log('ConoHa API レスポンスヘッダー:', Object.fromEntries(consoleResponse.headers.entries()));

    if (!consoleResponse.ok) {
      const errorText = await consoleResponse.text();
      console.error('WebSocketコンソール接続失敗:', {
        status: consoleResponse.status,
        statusText: consoleResponse.statusText,
        errorText: errorText
      });
      return NextResponse.json(
        { 
          error: `WebSocketコンソール接続に失敗しました: ${consoleResponse.status}`,
          details: errorText,
          apiUrl: apiUrl,
          requestBody: requestBody
        },
        { status: consoleResponse.status }
      );
    }

    const consoleData = await consoleResponse.json();
    console.log('コンソールデータ取得成功:', {
      protocol: consoleData.remote_console?.protocol,
      type: consoleData.remote_console?.type,
      urlLength: consoleData.remote_console?.url?.length || 0,
      urlPreview: consoleData.remote_console?.url ? consoleData.remote_console.url.substring(0, 50) + '...' : 'null'
    });
    
    const response = {
      success: true,
      consoleUrl: consoleData.remote_console.url,
      protocol: consoleData.remote_console.protocol,
      type: consoleData.remote_console.type
    };
    
    console.log('APIレスポンス:', {
      success: response.success,
      protocol: response.protocol,
      type: response.type,
      urlLength: response.consoleUrl?.length || 0
    });
    console.log('=== WebSocketコンソールAPI完了 ===');
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('WebSocketコンソールAPI エラー:', {
      error: error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'WebSocketコンソール接続に失敗しました',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 