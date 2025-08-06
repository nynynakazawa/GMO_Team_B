import type { NextApiRequest, NextApiResponse } from "next";
import { getConoHaTokenAndEndpoint } from "@/pages/api/vps/conohaAuth";

type ServerSummary = {
  id: string;
  name: string;
  links: { rel: string; href: string }[];
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("=== /api/server/getServerList handler start ===");
    console.log("Timestamp:", new Date().toISOString());
    const { token } = await getConoHaTokenAndEndpoint();
    console.log(
      "Token obtained (first 20 chars):",
      token.substring(0, 20) + "..."
    );

    console.log("Fetching server list from ConoHa compute API…");
    const listRes = await fetch("https://compute.c3j1.conoha.io/v2.1/servers", {
      headers: {
        Accept: "application/json",
        "X-Auth-Token": token,
      },
    });
    console.log(
      "Server list response status:",
      listRes.status,
      listRes.statusText
    );

    if (!listRes.ok) {
      const txt = await listRes.text();
      throw new Error(
        `Compute API failed: ${listRes.status} ${listRes.statusText} – ${txt}`
      );
    }

    const data = (await listRes.json()) as { servers: ServerSummary[] };

    // --- 各サーバの metadata を並列取得して name を置き換え -----------------
    const serversWithTag: ServerSummary[] = await Promise.all(
      data.servers.map(async (server) => {
        const { id } = server;
        try {
          const metaRes = await fetch(
            `https://compute.c3j1.conoha.io/v2.1/servers/${id}/metadata`,
            {
              headers: {
                Accept: "application/json",
                "X-Auth-Token": token,
              },
            }
          );

          if (!metaRes.ok) {
            const txt = await metaRes.text();
            throw new Error(
              `Metadata fetch failed for ${id}: ${metaRes.status} ${metaRes.statusText} – ${txt}`
            );
          }

          const { metadata } = (await metaRes.json()) as {
            metadata: Record<string, string>;
          };

          const nameTag = metadata.instance_name_tag ?? server.name;
          console.log(`Server ${id} nameTag =`, nameTag);

          // 新しいオブジェクトを返す（イミュータブル）
          return { ...server, name: nameTag };
        } catch (err) {
          console.error(`❌ Failed processing metadata for ${id}:`, err);
          return server; // フォールバックとして元データを返す
        }
      })
    );
    console.log("Number of servers received:", serversWithTag.length);
    console.log("=== /api/server/getServerList handler success ===");
    res.status(200).json({ servers: serversWithTag });
  } catch (err) {
    console.error("serverList API error:", err);
    res.status(500).json({ error: "Failed to load server list" });
  }
}
