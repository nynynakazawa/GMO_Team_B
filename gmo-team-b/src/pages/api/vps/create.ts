import { getConoHaTokenAndEndpoint } from "./conohaAuth";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    planId,
    serverName,
    password,
    game,
    period,
    ramGB,
    cpuCores,
    ssdSize,
  } = req.body as {
    planId: string;
    serverName: string;
    password: string;
    game: string;
    period: string;
    ramGB?: number;
    cpuCores?: number;
    ssdSize?: number;
  };

  if (!planId || !serverName || !password || !game || !period) {
    return res
      .status(400)
      .json({
        message: "planId, serverName, password, game, period は必須です",
      });
  }

  // デバッグ: 受け取ったパラメータを出力
  console.log("受け取ったリクエストパラメータ:", {
    planId,
    serverName,
    game,
    period,
    ramGB,
    cpuCores,
    ssdSize,
  });

  // ConoHaパスワード要件チェック（英数字記号を含む8-70文字）
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,70}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "パスワードは英字、数字、記号を含む8-70文字で設定してください",
    });
  }

  // プラン選択からのパラメータを使用、なければplanIdから抽出
  let selectedRamGB = ramGB;
  let selectedCpuCores = cpuCores;
  const selectedSsdSize = ssdSize || 100; // デフォルトは100GB

  // ramGBが送信されていない場合、planIdから抽出を試行
  if (!selectedRamGB) {
    // planIdからRAM容量を抽出（例: "plan-8gb" → 8）
    const planIdMatch = planId.match(/(\d+)/);
    if (planIdMatch) {
      selectedRamGB = parseInt(planIdMatch[1]);
    }

    if (!selectedRamGB || isNaN(selectedRamGB)) {
      return res.status(400).json({ message: "無効なプランIDです" });
    }
  }

  // CPU数が指定されていない場合、RAM容量に基づいてデフォルト値を設定
  if (!selectedCpuCores) {
    selectedCpuCores =
      selectedRamGB === 1
        ? 2
        : selectedRamGB === 2
        ? 3
        : selectedRamGB === 4
        ? 4
        : selectedRamGB === 8
        ? 6
        : 8;
  }

  console.log("最終的に使用するプラン仕様:", {
    selectedRamGB,
    selectedCpuCores,
    selectedSsdSize,
  });

  try {
    const { token, computeEndpoint, projectId } =
      await getConoHaTokenAndEndpoint();

    /*--- フレーバー一覧を取得（詳細情報付き） ---*/
    const flavorsRes = await fetch(`${computeEndpoint}/flavors/detail`, {
      headers: { "X-Auth-Token": token },
    });

    if (!flavorsRes.ok) {
      throw new Error(
        `フレーバー取得に失敗: ${flavorsRes.status} ${flavorsRes.statusText}`
      );
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
    console.log(
      "パブリックフレーバー名:",
      publicFlavors.slice(0, 5).map((f: any) => f.name)
    );

    // 全フレーバーの詳細情報をログ出力
    console.log("全フレーバーの詳細情報:");
    flavors.forEach((f: any, index: number) => {
      if (index < 10) {
        // 最初の10個のみ表示
        console.log(`${index + 1}. ${f.name} (${f.id}):`, {
          isPublic: f["os-flavor-access:is_public"],
          isDisabled: f["OS-FLV-DISABLED:disabled"],
          vcpus: f.vcpus,
          ram: f.ram,
          disk: f.disk,
        });
      }
    });

    // 選択されたプランの仕様に合うフレーバーを検索（条件を緩く設定）
    const suitableFlavors = publicFlavors.filter((f: any) => {
      const name = f.name.toLowerCase();

      // Linux VPS専用フレーバー（g2l）で、DBaaS用（g2d）ではない
      const isLinuxVPS = name.includes("g2l") && !name.includes("g2d");

      // 選択されたRAM容量以上のフレーバーを許可（厳密な一致ではなく）
      const ramMatch =
        name.includes(`m${selectedRamGB}`) ||
        (selectedRamGB <= 4 &&
          (name.includes("m4") ||
            name.includes("m8") ||
            name.includes("m16"))) ||
        (selectedRamGB <= 8 && (name.includes("m8") || name.includes("m16"))) ||
        (selectedRamGB <= 16 && name.includes("m16"));

      return isLinuxVPS && ramMatch;
    });

    console.log(
      "適用可能なLinuxフレーバー:",
      suitableFlavors.map((f: any) => ({
        name: f.name,
        id: f.id,
        vcpus: f.vcpus,
        ram: f.ram,
      }))
    );

    console.log(
      `選択されたプラン仕様: RAM=${selectedRamGB}GB, CPU=${
        selectedCpuCores || "auto"
      }Core, SSD=${selectedSsdSize}GB`
    );

    // 選択されたプランの仕様に基づいて動作確認済みフレーバーを生成
    const generateKnownFlavors = (ram: number, cpu?: number) => {
      const flavors = [];
      if (cpu) {
        flavors.push(`g2l-t-c${cpu}m${ram}`); // 通常プラン
        flavors.push(`g2l-p-c${cpu}m${ram}`); // プレミアムプラン
      } else {
        // CPU数が指定されていない場合は、RAM容量に応じたデフォルトを使用
        const defaultCpu =
          ram === 1 ? 2 : ram === 2 ? 3 : ram === 4 ? 4 : ram === 8 ? 6 : 8;
        flavors.push(`g2l-t-c${defaultCpu}m${ram}`);
        flavors.push(`g2l-p-c${defaultCpu}m${ram}`);
      }
      return flavors;
    };

    const knownWorkingFlavors = generateKnownFlavors(
      selectedRamGB,
      selectedCpuCores
    );

    let matchingFlavor = null;

    // まず選択されたプランに合う動作確認済みフレーバーを試す
    for (const flavorName of knownWorkingFlavors) {
      const flavor = publicFlavors.find(
        (f: any) => f.name.toLowerCase() === flavorName
      );
      if (flavor) {
        matchingFlavor = flavor;
        console.log(`選択されたプランに合うフレーバーを使用: ${flavorName}`);
        break;
      }
    }

    // 見つからない場合は以前の動作確認済みフレーバーを試す
    if (!matchingFlavor) {
      const fallbackFlavors = [
        "g2l-t-c4m4", // Linux用 4vCPU 4GB RAM
        "g2l-p-c4m4", // Linux用 4vCPU 4GB RAM (プレミアム)
        "g2l-t-c6m8", // Linux用 6vCPU 8GB RAM
        "g2l-t-c8m16", // Linux用 8vCPU 16GB RAM
        "g2l-p-c6m8", // Linux用 6vCPU 8GB RAM (プレミアム)
        "g2l-p-c8m16", // Linux用 8vCPU 16GB RAM (プレミアム)
      ];

      // フォールバックフレーバーを試す
      for (const flavorName of fallbackFlavors) {
        const flavor = publicFlavors.find(
          (f: any) => f.name.toLowerCase() === flavorName
        );
        if (flavor) {
          matchingFlavor = flavor;
          console.log(`フォールバックフレーバーを使用: ${flavorName}`);
          break;
        }
      }

      // それでも見つからない場合は適用可能なフレーバーから選択
      if (!matchingFlavor) {
        matchingFlavor =
          suitableFlavors.sort((a: any, b: any) => a.ram - b.ram)[0] ||
          publicFlavors
            .filter((f: any) => {
              const name = f.name.toLowerCase();
              return name.includes("g2w") && !name.includes("g2d");
            })
            .sort((a: any, b: any) => a.ram - b.ram)[0];
      }
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
        extra_specs:
          matchingFlavor.extra_specs ||
          matchingFlavor["OS-FLV-EXT-DATA:extra_specs"] ||
          "なし",
        all_properties: Object.keys(matchingFlavor),
        full_object: matchingFlavor,
      });
    }

    if (!matchingFlavor) {
      throw new Error(
        `要求仕様 (RAM=${selectedRamGB}GB${
          selectedCpuCores ? `, CPU=${selectedCpuCores}Core` : ""
        }) を満たすVPS専用フレーバーが見つかりません`
      );
    }

    /*--- イメージ一覧を取得 ---*/
    console.log("イメージ一覧取得開始");
    // ConoHaの正しいImage APIエンドポイントを使用
    const imageApiEndpoint = "https://image-service.c3j1.conoha.io/v2/images";
    console.log(
      "Image APIエンドポイント:",
      `${imageApiEndpoint}?visibility=public&os_type=linux&limit=200`
    );

    const imagesRes = await fetch(
      `${imageApiEndpoint}?visibility=public&os_type=linux&limit=200`,
      {
        headers: {
          "X-Auth-Token": token,
          Accept: "application/json",
        },
      }
    );

    console.log(
      "イメージAPI レスポンス:",
      imagesRes.status,
      imagesRes.statusText
    );

    let imagesData = null;
    if (!imagesRes.ok) {
      const errorText = await imagesRes.text();
      console.error("Image APIからのイメージ取得に失敗:", errorText);
      throw new Error(
        `イメージ一覧取得に失敗: ${imagesRes.status} ${imagesRes.statusText} - ${errorText}`
      );
    } else {
      try {
        imagesData = await imagesRes.json();
        console.log("イメージデータ取得成功");
      } catch (error) {
        console.error("イメージデータの解析に失敗:", error);
        throw new Error("イメージデータの解析に失敗しました");
      }
    }

    let suitableImage = null;

    if (imagesData && imagesData.images) {
      const { images } = imagesData;
      console.log("取得されたイメージ数:", images?.length || 0);

      // 利用可能なイメージをログ出力（最初の5つ）
      console.log("利用可能なイメージ（最初の5つ）:");
      images.slice(0, 5).forEach((img: any, index: number) => {
        console.log(
          `${index + 1}. ${img.name} (${img.id}): status=${
            img.status
          }, os_type=${img.os_type}`
        );
      });

      if (images && images.length > 0) {
        // ConoHaの公式イメージ名に基づいてUbuntu 22.04を優先的に選択
        suitableImage =
          images.find((img: any) => {
            const name = img.name?.toLowerCase() || "";
            return name.includes("vmi-ubuntu-22.04") && img.status === "active";
          }) ||
          images.find((img: any) => {
            const name = img.name?.toLowerCase() || "";
            return name.includes("vmi-ubuntu-20.04") && img.status === "active";
          }) ||
          images.find((img: any) => {
            const name = img.name?.toLowerCase() || "";
            return name.includes("ubuntu") && img.status === "active";
          }) ||
          images.find((img: any) => {
            const name = img.name?.toLowerCase() || "";
            return name.includes("centos") && img.status === "active";
          }) ||
          images.find((img: any) => img.status === "active"); // アクティブなイメージを選択

        if (suitableImage) {
          console.log("選択されたイメージ:", {
            id: suitableImage.id,
            name: suitableImage.name,
            status: suitableImage.status,
            os_type: suitableImage.os_type,
            min_disk: suitableImage.min_disk,
            min_ram: suitableImage.min_ram,
          });
        }
      }
    }

    // ブートボリュームには必ずイメージが必要
    if (!suitableImage) {
      throw new Error(
        "ブートボリューム作成に必要なイメージが見つかりません。利用可能なアクティブなイメージが存在しない可能性があります。"
      );
    }

    /*--- 新しいブートボリュームを作成 ---*/
    console.log("新しいブートボリュームを作成します");

    // ボリュームタイプ一覧を取得
    console.log("ボリュームタイプ取得開始");
    const volumeTypesRes = await fetch(
      `https://block-storage.c3j1.conoha.io/v3/${projectId}/types`,
      {
        headers: { "X-Auth-Token": token },
      }
    );

    let volumeType = "c3j1-ds02-boot"; // ブート用ボリュームタイプ

    if (volumeTypesRes.ok) {
      const { volume_types } = await volumeTypesRes.json();
      console.log(
        "利用可能ボリュームタイプ:",
        volume_types.map((vt: any) => ({
          id: vt.id,
          name: vt.name,
          description: vt.description,
        }))
      );

      // ブート用ボリュームタイプを選択（512MB専用を除く）
      const bootType =
        volume_types.find(
          (vt: any) =>
            vt.name && vt.name.includes("boot") && !vt.name.includes("as01")
        ) ||
        volume_types.find(
          (vt: any) => vt.name && vt.name.includes("ds02-boot")
        );

      if (bootType) {
        volumeType = bootType.name;
        console.log("選択されたボリュームタイプ:", volumeType);
      }
    } else {
      console.error("ボリュームタイプ取得失敗、デフォルトを使用");
    }

    // ブートボリュームを作成（必ずイメージ指定）
    // 選択されたSSDサイズまたはボリュームタイプに応じてサイズを調整
    let volumeSize = selectedSsdSize; // 選択されたSSDサイズを使用
    if (volumeType.includes("as01")) {
      volumeSize = Math.min(selectedSsdSize, 30); // 512MBプラン用は最大30GB
    }

    console.log(
      `ボリュームタイプ ${volumeType} に対してサイズ ${volumeSize}GB を使用`
    );

    const volumePayload = {
      volume: {
        size: volumeSize,
        name: `${serverName}-boot-volume`,
        description: `Boot volume for ${serverName}`,
        volume_type: volumeType,
        imageRef: suitableImage.id, // 必須パラメータ
      },
    };

    console.log("イメージ指定でブートボリュームを作成:", {
      imageId: suitableImage.id,
      imageName: suitableImage.name,
      volumeType: volumeType,
    });

    console.log(
      "ブートボリューム作成ペイロード:",
      JSON.stringify(volumePayload, null, 2)
    );

    const volumeRes = await fetch(
      `https://block-storage.c3j1.conoha.io/v3/${projectId}/volumes`,
      {
        method: "POST",
        headers: {
          "X-Auth-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(volumePayload),
      }
    );

    console.log(
      "ブートボリューム作成レスポンス:",
      volumeRes.status,
      volumeRes.statusText
    );

    if (!volumeRes.ok) {
      const errorText = await volumeRes.text();
      console.error("ブートボリューム作成エラー詳細:", errorText);
      throw new Error(
        `ブートボリューム作成に失敗: ${volumeRes.status} ${volumeRes.statusText} - ${errorText}`
      );
    }

    const volume = (await volumeRes.json()).volume;
    console.log("ブートボリューム作成成功:", {
      id: volume.id,
      status: volume.status,
      name: volume.name,
      bootable: volume.bootable,
    });

    // ボリュームが利用可能になるまで待機
    let volumeStatus = volume.status;
    let attempts = 0;
    const maxAttempts = 30; // 最大30回試行（約5分）

    while (volumeStatus !== "available" && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 10000)); // 10秒待機

      const statusRes = await fetch(
        `https://block-storage.c3j1.conoha.io/v3/${projectId}/volumes/${volume.id}`,
        {
          headers: { "X-Auth-Token": token },
        }
      );

      if (statusRes.ok) {
        const { volume: updatedVolume } = await statusRes.json();
        volumeStatus = updatedVolume.status;
        console.log(
          `ボリューム状態確認 (試行 ${attempts + 1}/${maxAttempts}):`,
          {
            status: volumeStatus,
            bootable: updatedVolume.bootable,
          }
        );
      }

      attempts++;
    }

    if (volumeStatus !== "available") {
      throw new Error("ブートボリュームの作成がタイムアウトしました");
    }

    console.log("ブートボリューム作成完了:", {
      id: volume.id,
      status: volumeStatus,
      name: volume.name,
      size: volume.size,
      bootable: volume.bootable,
    });

    /*--- サーバー作成 ---*/
    console.log("サーバー作成開始");
    console.log("使用するエンドポイント:", `${computeEndpoint}/servers`);

    const serverPayload = {
      server: {
        flavorRef: matchingFlavor.id,
        adminPass: password, // ユーザーが指定したパスワードを使用
        block_device_mapping_v2: [
          {
            uuid: volume.id,
            source_type: "volume",
            destination_type: "volume",
            boot_index: 0,
            delete_on_termination: true,
          },
        ],
        metadata: {
          instance_name_tag: serverName,
        },
      },
    };

    console.log(
      "サーバー作成ペイロード:",
      JSON.stringify(serverPayload, null, 2)
    );

    // HTTPリクエストの詳細をログ出力
    const requestUrl = `${computeEndpoint}/servers`;
    const requestHeaders = {
      "X-Auth-Token": token,
      "Content-Type": "application/json",
    };

    console.log("HTTPリクエスト詳細:", {
      method: "POST",
      url: requestUrl,
      headers: {
        "X-Auth-Token": token ? `${token.substring(0, 20)}...` : "なし",
        "Content-Type": "application/json",
      },
      bodySize: JSON.stringify(serverPayload).length,
    });

    const serverRes = await fetch(requestUrl, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(serverPayload),
    });

    // HTTPレスポンスの詳細をログ出力
    console.log("HTTPレスポンス詳細:", {
      status: serverRes.status,
      statusText: serverRes.statusText,
      headers: {
        "content-type": serverRes.headers.get("content-type"),
        "content-length": serverRes.headers.get("content-length"),
        date: serverRes.headers.get("date"),
      },
      ok: serverRes.ok,
    });

    if (!serverRes.ok) {
      const errorText = await serverRes.text();
      console.error("サーバー作成エラー詳細:", {
        status: serverRes.status,
        statusText: serverRes.statusText,
        errorBody: errorText,
        requestPayload: serverPayload,
        timestamp: new Date().toISOString(),
      });
      throw new Error(
        `サーバー作成に失敗: ${serverRes.status} ${serverRes.statusText} - ${errorText}`
      );
    }

    const { server } = await serverRes.json();
    console.log("サーバー作成成功:", {
      id: server.id,
      adminPass: server.adminPass,
    });

    res.status(200).json({
      serverId: server.id,
      adminPass: server.adminPass,
      flavor: {
        id: matchingFlavor.id,
        name: matchingFlavor.name,
      },
      volume: {
        id: volume.id,
        size: volume.size,
        name: volume.name,
      },
      planSpecs: {
        ramGB: selectedRamGB,
        cpuCores: selectedCpuCores,
        ssdSize: selectedSsdSize,
      },
      message: "VPSサーバーの作成を開始しました",
    });
  } catch (e) {
    res.status(500).json({ message: (e as Error).message });
  }
}
