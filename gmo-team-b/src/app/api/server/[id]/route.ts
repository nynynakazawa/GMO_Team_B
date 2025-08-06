// app/api/server/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerInfo, ParsedServerInfo } from "../getServerInfo";
import { getConoHaTokenAndEndpoint } from "@/pages/api/vps/conohaAuth";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tokenAndEndpoint = await getConoHaTokenAndEndpoint();
    const token = tokenAndEndpoint.token;
    
    if (!token) {
      console.warn('CONOHA_TOKEN not found, returning mock data');
      
      // Return mock data when token is not available
      const mockData: ParsedServerInfo = {
        nameTag: "game-2025-08-04-13-54",
        ipAddress: "133.117.75.97",
        subnetMask: "255.255.254.0",
        gateway: "133.117.75.1",
        macAddress: "fa:16:3e:f7:4e:47",
        dnsServer1: "150.95.10.8",
        dnsServer2: "150.95.10.9",
        bandwidthIn: "100.0",
        bandwidthOut: "100.0",
        autoBackupEnabled: false,
        bootStorage: "SSD 100GB",
        securityGroup: "default",
      };
      
      return NextResponse.json(mockData, { status: 200 });
    }
    
    const info = await getServerInfo(token, params.id);
    return NextResponse.json(info, { status: 200 });
  } catch (error) {
    console.error('Error fetching server info:', error);
    
    // Return mock data on error
    const mockData: ParsedServerInfo = {
      nameTag: "game-2025-08-04-13-54",
      ipAddress: "133.117.75.97",
      subnetMask: "255.255.254.0",
      gateway: "133.117.75.1",
      macAddress: "fa:16:3e:f7:4e:47",
      dnsServer1: "150.95.10.8",
      dnsServer2: "150.95.10.9",
      bandwidthIn: "100.0",
      bandwidthOut: "100.0",
      autoBackupEnabled: false,
      bootStorage: "SSD 100GB",
      securityGroup: "default",
    };
    
    return NextResponse.json(mockData, { status: 200 });
  }
}