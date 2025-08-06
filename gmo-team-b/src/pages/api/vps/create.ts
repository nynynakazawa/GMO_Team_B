import { getConoHaTokenAndEndpoint } from "./conohaAuth";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { planId, serverName, game, period } = req.body as { 
    planId: string; 
    serverName: string; 
    game: string; 
    period: string 
  };
  
  if (!planId || !serverName || !game || !period) {
    return res.status(400).json({ message: "planId, serverName, game, period は必須です" });
  }

  // planIdからRAM容量を抽出（例: "plan-8gb" → 8）
  const ramGB = parseInt(planId.replace('plan-', '').replace('gb', ''));
  if (isNaN(ramGB)) {
    return res.status(400).json({ message: "無効なプランIDです" });
  }

  try {
    const { token, computeEndpoint, projectId } = await getConoHaTokenAndEndpoint();

    /*--- フレーバー一覧を取得（詳細情報付き） ---*/
    const flavorsRes = await fetch(`${computeEndpoint}/flavors/detail`, {
      headers: { "X-Auth-Token": token }
    });
    
    if (!flavorsRes.ok) {
      throw new Error(`フレーバー取得に失敗: ${flavorsRes.status} ${flavorsRes.statusText}`);
    }
    
    const { flavors } = await flavorsRes.json();
    console.log("取得されたフレーバー数:", flavors?.length || 0);

    // パブリックAPIで使用可能なVPS専用フレーバーを検索
    const publicFlavors = flavors.filter((f: any) => {
      // パブリックAPIで使用可能かチェック
      const isPublic = f["os-flavor-access:is_public"] === true;
      const isNotDisabled = !f["OS-FLV-DISABLED:disabled"];
      
      return isPublic && isNotDisabled;
    });
    
    console.log("パブリックAPI使用可能フレーバー数:", publicFlavors.length);
    console.log("パブリックフレーバー名:", publicFlavors.slice(0, 5).map((f: any) => f.name));
    
    // 全フレーバーの詳細情報をログ出力
    console.log("全フレーバーの詳細情報:");
    flavors.forEach((f: any, index: number) => {
      if (index < 10) { // 最初の10個のみ表示
        console.log(`${index + 1}. ${f.name} (${f.id}):`, {
          isPublic: f["os-flavor-access:is_public"],
          isDisabled: f["OS-FLV-DISABLED:disabled"],
          vcpus: f.vcpus,
          ram: f.ram,
          disk: f.disk
        });
      }
    });

    // 小さくてシンプルなLinux用フレーバーを優先検索
    const suitableFlavors = publicFlavors.filter((f: any) => {
      const name = f.name.toLowerCase();
      
      // Linux VPS専用フレーバー（g2l）で、DBaaS用（g2d）ではない
      const isLinuxVPS = name.includes('g2l') && !name.includes('g2d');
      
      // RAM容量の条件を緩く設定
      const ramMatch = ramGB <= 4 || name.includes('m4') || name.includes('m8') || name.includes('m16');
      
      return isLinuxVPS && ramMatch;
    });
    
    console.log("適用可能なLinuxフレーバー:", suitableFlavors.map((f: any) => ({
      name: f.name,
      id: f.id,
      vcpus: f.vcpus,
      ram: f.ram
    })));
    
    // 特定の動作確認済みフレーバーを試す（Linux用を優先）
    const knownWorkingFlavors = [
      'g2l-t-c4m4',   // Linux用 4vCPU 4GB RAM
      'g2l-p-c4m4',   // Linux用 4vCPU 4GB RAM (プレミアム)
      'g2l-t-c6m8',   // Linux用 6vCPU 8GB RAM
      'g2l-t-c8m16',  // Linux用 8vCPU 16GB RAM
      'g2l-p-c6m8',   // Linux用 6vCPU 8GB RAM (プレミアム)
      'g2l-p-c8m16'   // Linux用 8vCPU 16GB RAM (プレミアム)
    ];
    
    let matchingFlavor = null;
    
    // まず動作確認済みフレーバーを試す
    for (const flavorName of knownWorkingFlavors) {
      const flavor = publicFlavors.find((f: any) => f.name.toLowerCase() === flavorName);
      if (flavor) {
        matchingFlavor = flavor;
        console.log(`動作確認済みフレーバーを使用: ${flavorName}`);
        break;
      }
    }
    
    // 見つからない場合は最小のフレーバーを選択
    if (!matchingFlavor) {
      matchingFlavor = suitableFlavors.sort((a: any, b: any) => a.ram - b.ram)[0] || 
                      publicFlavors.filter((f: any) => {
                        const name = f.name.toLowerCase();
                        return name.includes('g2w') && !name.includes('g2d');
                      }).sort((a: any, b: any) => a.ram - b.ram)[0];
    }
    
    if (matchingFlavor) {
      console.log("選択されたフレーバーの詳細情報:", {
        id: matchingFlavor.id,
        name: matchingFlavor.name,
        isPublic: matchingFlavor["os-flavor-access:is_public"],
        isDisabled: matchingFlavor["OS-FLV-DISABLED:disabled"],
        vcpus: matchingFlavor.vcpus,
        ram: matchingFlavor.ram,
        disk: matchingFlavor.disk,
        links: matchingFlavor.links,
        extra_specs: matchingFlavor.extra_specs || matchingFlavor["OS-FLV-EXT-DATA:extra_specs"] || "なし",
        all_properties: Object.keys(matchingFlavor),
        full_object: matchingFlavor
      });
    }

    if (!matchingFlavor) {
      throw new Error(`要求仕様 (RAM=${ramGB}GB) を満たすVPS専用フレーバーが見つかりません`);
    }

    /*--- 既存のボリューム一覧を取得 ---*/
    console.log("既存ボリューム取得開始");
    const volumesRes = await fetch(`https://block-storage.c3j1.conoha.io/v3/${projectId}/volumes/detail`, {
      headers: { "X-Auth-Token": token }
    });
    
    if (!volumesRes.ok) {
      const errorText = await volumesRes.text();
      console.error("ボリューム一覧取得エラー:", errorText);
      throw new Error(`ボリューム一覧取得に失敗: ${volumesRes.status} ${volumesRes.statusText} - ${errorText}`);
    }
    
    const { volumes } = await volumesRes.json();
    console.log("取得されたボリューム数:", volumes?.length || 0);
    
    // 利用可能な空のボリュームを探す
    const availableVolume = volumes.find((v: any) => 
      v.status === "available" && 
      (!v.attachments || v.attachments.length === 0) &&
      v.size >= 30 // 最小30GB
    );
    
    console.log("既存ボリューム詳細:", volumes.map((v: any) => ({
      id: v.id,
      name: v.name,
      status: v.status,
      size: v.size,
      volume_type: v.volume_type,
      attachments: v.attachments?.length || 0
    })));
    
    let volume;
    
    if (availableVolume) {
      console.log("既存の利用可能ボリュームを使用:", { id: availableVolume.id, name: availableVolume.name, size: availableVolume.size });
      volume = availableVolume;
    } else {
      console.log("利用可能ボリュームがないため、通常のボリュームを新規作成します");
      
      // ボリュームタイプ一覧を取得
      console.log("ボリュームタイプ取得開始");
      const volumeTypesRes = await fetch(`https://block-storage.c3j1.conoha.io/v3/${projectId}/types`, {
        headers: { "X-Auth-Token": token }
      });
      
      let volumeType = "c3j1-ds02"; // デフォルト
      
      if (volumeTypesRes.ok) {
        const { volume_types } = await volumeTypesRes.json();
        console.log("利用可能ボリュームタイプ:", volume_types.map((vt: any) => ({
          id: vt.id,
          name: vt.name,
          description: vt.description
        })));
        
        // 適切なボリュームタイプを選択
        const availableType = volume_types.find((vt: any) => 
          vt.name && (vt.name.includes('ds02') || vt.name.includes('standard'))
        );
        
        if (availableType) {
          volumeType = availableType.name;
          console.log("選択されたボリュームタイプ:", volumeType);
        }
      } else {
        console.error("ボリュームタイプ取得失敗、デフォルトを使用");
      }
      
      // 通常のボリュームを作成
      const volumePayload = {
        volume: {
          size: 100, // 100GB
          name: `${serverName}-volume`,
          description: `Volume for ${serverName}`,
          volume_type: volumeType
        }
      };
      
      console.log("ボリューム作成ペイロード:", JSON.stringify(volumePayload, null, 2));

      const volumeRes = await fetch(`https://block-storage.c3j1.conoha.io/v3/${projectId}/volumes`, {
        method: "POST",
        headers: { 
          "X-Auth-Token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(volumePayload)
      });

      console.log("ボリューム作成レスポンス:", volumeRes.status, volumeRes.statusText);

      if (!volumeRes.ok) {
        const errorText = await volumeRes.text();
        console.error("ボリューム作成エラー詳細:", errorText);
        throw new Error(`ボリューム作成に失敗: ${volumeRes.status} ${volumeRes.statusText} - ${errorText}`);
      }

      volume = (await volumeRes.json()).volume;
      console.log("ボリューム作成成功:", { id: volume.id, status: volume.status, name: volume.name });

      // ボリュームが利用可能になるまで待機
      let volumeStatus = volume.status;
      let attempts = 0;
      const maxAttempts = 30; // 最大30回試行（約5分）

      while (volumeStatus !== "available" && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10秒待機
        
        const statusRes = await fetch(`https://block-storage.c3j1.conoha.io/v3/${projectId}/volumes/${volume.id}`, {
          headers: { "X-Auth-Token": token }
        });
        
        if (statusRes.ok) {
          const { volume: updatedVolume } = await statusRes.json();
          volumeStatus = updatedVolume.status;
        }
        
        attempts++;
      }

      if (volumeStatus !== "available") {
        throw new Error("ボリュームの作成がタイムアウトしました");
      }
    }

    /*--- サーバー作成 ---*/
    console.log("サーバー作成開始");
    console.log("使用するエンドポイント:", `${computeEndpoint}/servers`);
    
    const serverPayload = {
      server: {
        flavorRef: matchingFlavor.id,
        adminPass: "TempPassword123!",
        block_device_mapping_v2: [{ 
          uuid: volume.id
        }],
        metadata: { 
          instance_name_tag: serverName
        }
      }
    };
    
    console.log("サーバー作成ペイロード:", JSON.stringify(serverPayload, null, 2));
    
    // HTTPリクエストの詳細をログ出力
    const requestUrl = `${computeEndpoint}/servers`;
    const requestHeaders = { 
      "X-Auth-Token": token, 
      "Content-Type": "application/json" 
    };
    
    console.log("HTTPリクエスト詳細:", {
      method: "POST",
      url: requestUrl,
      headers: {
        "X-Auth-Token": token ? `${token.substring(0, 20)}...` : "なし",
        "Content-Type": "application/json"
      },
      bodySize: JSON.stringify(serverPayload).length
    });
    
    const serverRes = await fetch(requestUrl, {
      method: "POST", 
      headers: requestHeaders, 
      body: JSON.stringify(serverPayload)
    });
    
    // HTTPレスポンスの詳細をログ出力
    console.log("HTTPレスポンス詳細:", {
      status: serverRes.status,
      statusText: serverRes.statusText,
      headers: {
        "content-type": serverRes.headers.get("content-type"),
        "content-length": serverRes.headers.get("content-length"),
        "date": serverRes.headers.get("date")
      },
      ok: serverRes.ok
    });
    
    if (!serverRes.ok) {
      const errorText = await serverRes.text();
      console.error("サーバー作成エラー詳細:", {
        status: serverRes.status,
        statusText: serverRes.statusText,
        errorBody: errorText,
        requestPayload: serverPayload,
        timestamp: new Date().toISOString()
      });
      throw new Error(`サーバー作成に失敗: ${serverRes.status} ${serverRes.statusText} - ${errorText}`);
    }
    
    const { server } = await serverRes.json();
    console.log("サーバー作成成功:", { id: server.id, adminPass: server.adminPass });

    res.status(200).json({ 
      serverId: server.id,
      adminPass: server.adminPass,
      flavor: {
        id: matchingFlavor.id,
        name: matchingFlavor.name
      },
      volume: {
        id: volume.id,
        size: volume.size,
        name: volume.name
      },
      message: "VPSサーバーの作成を開始しました"
    });
  } catch (e) {
    res.status(500).json({ message: (e as Error).message });
  }
}