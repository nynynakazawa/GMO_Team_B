import { NextRequest, NextResponse } from "next/server";

type ServerSummary = {
  id: string;
  name: string;
  links: { rel: string; href: string }[];
};

export async function GET(_req: NextRequest) {
  try {
    console.log("=== /api/server/getServerList handler start ===");
    
    const token = process.env.CONOHA_TOKEN;
    
    if (!token) {
      console.warn('CONOHA_TOKEN not found, returning mock server list');
      
      // Return mock server list when token is not available
      const mockServerList: ServerSummary[] = [
        {
          id: "be135a87-c7ee-4f43-8072-8531716cad09",
          name: "game-2025-08-04-13-54",
          nameTag: "game-2025-08-04-13-54", // Include nameTag in mock data
          links: [
            { rel: "self", href: "https://compute.c3j1.conoha.io/v2.1/servers/be135a87-c7ee-4f43-8072-8531716cad09" }
          ]
        },
        {
          id: "af246b98-d8ff-5g54-9183-9642827dbe1a",
          name: "minecraft-server-01",
          nameTag: "minecraft-server-01",
          links: [
            { rel: "self", href: "https://compute.c3j1.conoha.io/v2.1/servers/af246b98-d8ff-5g54-9183-9642827dbe1a" }
          ]
        }
      ];
      
      return NextResponse.json({ servers: mockServerList }, { status: 200 });
    }
    
    console.log("Fetching server list from ConoHa compute API…");
    const listRes = await fetch("https://compute.c3j1.conoha.io/v2.1/servers", {
      headers: {
        "Accept": "application/json",
        "X-Auth-Token": token,
      },
    });
    
    console.log("Server list response status:", listRes.status, listRes.statusText);

    if (!listRes.ok) {
      const txt = await listRes.text();
      throw new Error(
        `Compute API failed: ${listRes.status} ${listRes.statusText} – ${txt}`
      );
    }

    const data = (await listRes.json()) as { servers: ServerSummary[] };
    console.log("Number of servers received:", data.servers?.length || 0);
    console.log("=== /api/server/getServerList handler success ===");
    
    return NextResponse.json({ servers: data.servers || [] }, { status: 200 });
  } catch (err) {
    console.error("serverList API error:", err);
    
    // Return mock data on error
    const mockServerList: ServerSummary[] = [
      {
        id: "be135a87-c7ee-4f43-8072-8531716cad09",
        name: "game-2025-08-04-13-54",
        nameTag: "game-2025-08-04-13-54",
        links: [
          { rel: "self", href: "https://compute.c3j1.conoha.io/v2.1/servers/be135a87-c7ee-4f43-8072-8531716cad09" }
        ]
      }
    ];
    
    return NextResponse.json({ servers: mockServerList }, { status: 200 });
  }
}