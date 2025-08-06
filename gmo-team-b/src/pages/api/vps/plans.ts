import { getConoHaTokenAndEndpoint } from "./conohaAuth";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  
  try {
    const { token, computeEndpoint } = await getConoHaTokenAndEndpoint();

    // ConoHa APIからフレーバー一覧を取得
    const flavorsRes = await fetch(`${computeEndpoint}/flavors`, {
      headers: { "X-Auth-Token": token }
    });
    
    if (!flavorsRes.ok) {
      const errorText = await flavorsRes.text();
      throw new Error(`フレーバー取得に失敗: ${flavorsRes.status} ${flavorsRes.statusText} - ${errorText}`);
    }
    
    const { flavors } = await flavorsRes.json();
    
    console.log("取得されたフレーバー数:", flavors?.length || 0);

    // VPS専用フレーバーをフィルタリングしてプランを作成
    const vpsFlavors = flavors.filter((f: any) => {
      const name = f.name.toLowerCase();
      const isVPSFlavor = (name.includes('g2w') || name.includes('g2l')) && !name.includes('g2d');
      
      if (!isVPSFlavor) return false;
      
      // RAM容量を抽出して指定されたGBのみを許可
      const ramMatch = name.match(/m(\d+)/);
      if (ramMatch) {
        const ramGB = parseInt(ramMatch[1]);
        return [1, 2, 4, 8, 16].includes(ramGB); // 指定されたGBのみ表示
      }
      
      return false; // RAM容量が抽出できない場合は除外
    });
    
    console.log("指定されたGBのVPSフレーバー数:", vpsFlavors.length);
    console.log("フィルタリングされたフレーバー:", vpsFlavors.map((f: any) => f.name));

    // フレーバー名からRAM容量を抽出する関数
    const extractRamFromName = (name: string): number => {
      const match = name.match(/m(\d+)/);
      if (match) {
        return parseInt(match[1]);
      }
      // デフォルト値
      return 1;
    };

    // フレーバー名からCPUコア数を抽出する関数
    const extractCpuFromName = (name: string): number => {
      const match = name.match(/c(\d+)/);
      if (match) {
        return parseInt(match[1]);
      }
      // デフォルト値
      return 1;
    };

    // 指定された価格設定
    const priceMap: { [key: number]: number } = {
      1: 1064,   // 1GB: 1,064円/月
      2: 2032,   // 2GB: 2,032円/月
      4: 3968,   // 4GB: 3,968円/月
      8: 8082,   // 8GB: 8,082円/月
      16: 15730  // 16GB: 15,730円/月
    };

    // プランデータを作成
    const plans = vpsFlavors.map((flavor: any) => {
      const ramGB = extractRamFromName(flavor.name);
      const cpuCores = extractCpuFromName(flavor.name);
      const monthlyPrice = priceMap[ramGB] || ramGB * 1000; // 指定された価格を使用
      
      return {
        id: flavor.id,
        name: `${ramGB}GB RAM / ${cpuCores}Core`,
        capacity: `${ramGB}GB RAM`,
        monthlyPrice: monthlyPrice,
        originalPrice: monthlyPrice,
        discountedPrice: monthlyPrice,
        discount: 0,
        cpuCores: `${cpuCores}Core`,
        storageCapacity: "100GB",
        cpu: "Intel Xeon",
        ssd: "SSD",
        vcpus: cpuCores,
        disk: 100,
        ramGB: ramGB,
        flavorType: flavor.name.includes('g2w') ? 'g2w' : 'g2l',
        flavorName: flavor.name
      };
    });

    // 重複を除去（RAM容量とCPUコア数が同じものは最初の1つだけ残す）
    const uniquePlans = plans.reduce((acc: any[], plan: any) => {
      const existingPlan = acc.find(p => p.ramGB === plan.ramGB && p.vcpus === plan.vcpus);
      if (!existingPlan) {
        acc.push(plan);
      }
      return acc;
    }, []);

    // RAM容量でソート
    uniquePlans.sort((a: any, b: any) => a.ramGB - b.ramGB);
    
    console.log("最終的なプラン数:", uniquePlans.length);
    console.log("表示されるプラン:", uniquePlans.map((p: any) => `${p.ramGB}GB RAM / ${p.vcpus}Core`));

    res.status(200).json({ 
      plans: uniquePlans
    });
  } catch (error) {
    console.error("プラン取得エラー:", error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "プラン取得に失敗しました"
    });
  }
}