import { NextRequest, NextResponse } from "next/server";
import { getConoHaTokenAndEndpoint } from "@/pages/api/vps/conohaAuth";

type Volume = {
  id: string;
  volumeId: string;
  serverId: string;
  device: string;
};

export async function deleteServer(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    console.log("=== /api/server/deleteServer handler start ===");

    const { token } = await getConoHaTokenAndEndpoint();
    const serverId = context.params.id;
    const tenantId = process.env.CONOHA_TENANT_ID;

    if (!token) {
      console.error("CONOHA_TOKEN not found");
      return NextResponse.json(
        { error: "CONOHA_TOKEN not set" },
        { status: 500 }
      );
    }

    console.log("Fetching attached volume list from ConoHa compute API…");
    const listRes = await fetch(
      `https://compute.c3j1.conoha.io/v2.1/servers/${serverId}/os-volume_attachments`,
      {
        headers: {
          Accept: "application/json",
          "X-Auth-Token": token,
        },
      }
    );

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

    const volumeList = (await listRes.json()) as {
      volumeAttachments: Volume[];
    };
    console.log(
      "Number of attached volumes received:",
      volumeList.volumeAttachments?.length || 0
    );

    console.log("=== Start delete attached volumes ===");

    await Promise.all(
      volumeList.volumeAttachments.map(async (volume) => {
        const volumeId = volume.volumeId;
        const res = await fetch(
          `https://block-storage.c3j1.conoha.io/v3/${tenantId}/volumes/${volumeId}`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "X-Auth-Token": token,
            },
          }
        );

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(
            `Delete failed for ${volumeId}: ${res.status} ${res.statusText} – ${txt}`
          );
        }
      })
    );

    console.log("=== Delete attached volumes Completed ===");
    console.log("=== Start delete server ===");

    const res = await fetch(
      `https://compute.c3j1.conoha.io/v2.1/servers/${serverId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "X-Auth-Token": token,
        },
      }
    );

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(
        `Delete failed for ${serverId}: ${res.status} ${res.statusText} – ${txt}`
      );
    }

    console.log("=== Delete server Completed ===");

    /* ▼ 最新のサーバ一覧を取って返す（必要ないなら丸ごと省いて OK） */
    // const listAfter = await fetch(
    //   "https://compute.c3j1.conoha.io/v2.1/servers/detail",
    //   {
    //     headers: { Accept: "application/json", "X-Auth-Token": token },
    //   }
    // );

    // const { servers } = (await listAfter.json()) as {
    //   servers: ServerSummary[];
    // };

    return NextResponse.json(
      {
        deletedServerId: serverId, // どのサーバを消したか分かるように
        // servers, // “残り” の一覧
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("deleteServer API error:", err);

    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
