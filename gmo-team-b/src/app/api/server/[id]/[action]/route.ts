import { NextResponse } from "next/server";
import { getConoHaTokenAndEndpoint } from "@/pages/api/vps/conohaAuth";

type Action = "os-start" | "os-stop" | "reboot" | "force_shutdown";

export async function POST(
  _req: Request,
  { params }: { params: { id: string; action: Action } }
) {
  const { id, action } = params;

  // 1) アクション妥当性チェック
  if (!["os-start", "os-stop", "reboot", "force_shutdown"].includes(action)) {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  try {
    // 2) 認証（トークン取得）
    const { token, computeEndpoint } = await getConoHaTokenAndEndpoint();

    // 3) ConoHa API へ転送
    //    例: POST /servers/<id>/action { "reboot": { "type": "SOFT" } }

    const body = (() => {
      if (action === "os-start") {
        return {
          "os-start": null,
        };
      } else if (action === "os-stop") {
        return {
          "os-stop": null,
        };
      } else if (action === "reboot") {
        return {
          "reboot": {
            "type": "SOFT",
          },
        };
      } else if (action === "force_shutdown") {
        return {
          "os-stop": {
            "force_shutdown": true,
          },
        };
      }
      return "";
    })();

    const res = await fetch(`${computeEndpoint}/servers/${id}/action`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Auth-Token": token,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(
        `ConoHa API error ${res.status} ${res.statusText}: ${txt}`
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("server action API error:", err);
    return NextResponse.json(
      { error: "Failed to execute action" },
      { status: 500 }
    );
  }
}
