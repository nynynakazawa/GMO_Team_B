import { NextRequest, NextResponse } from "next/server";
import { getConoHaTokenAndEndpoint } from "@/pages/api/vps/conohaAuth";

type Volume = {
  id: string;
  volumeId: string;
  serverId: string;
  device: string;
};

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const serverId = id;
  try {
    console.log("=== /api/server/deleteServer handler start ===");

    const { token } = await getConoHaTokenAndEndpoint();
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
    console.log(volumeList)

    console.log("=== Start save server image ===");
    const time = new Date();
    const volumeId = volumeList.volumeAttachments[0].volumeId;

    console.log(`https://block-storage.c3j1.conoha.io/v3/${tenantId}/volumes/${volumeId}/action`)

    const res = await fetch(
      `https://block-storage.c3j1.conoha.io/v3/${tenantId}/volumes/${volumeId}/action`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-Auth-Token": token,
        },
        body: JSON.stringify({ "os-volume_upload_image": { name: time } }),
      }
    );

    if (!res.ok) {
        console.log(res)
      throw new Error(`save failed`);
    }

    console.log("=== Save server image Completed ===");

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
