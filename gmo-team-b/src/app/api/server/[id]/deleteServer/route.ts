import { NextResponse } from "next/server";
import { getConoHaTokenAndEndpoint } from "@/pages/api/vps/conohaAuth";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // 1) 認証（トークン取得）
    const { token, computeEndpoint } = await getConoHaTokenAndEndpoint();

    // 2) ConoHa API へ削除リクエスト送信
    const res = await fetch(`${computeEndpoint}/servers/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "X-Auth-Token": token,
      },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(
        `ConoHa API error ${res.status} ${res.statusText}: ${txt}`
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("server delete API error:", err);
    return NextResponse.json(
      { error: "Failed to delete server" },
      { status: 500 }
    );
  }
}
