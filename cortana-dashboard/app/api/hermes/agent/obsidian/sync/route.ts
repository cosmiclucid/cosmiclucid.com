import { NextRequest, NextResponse } from "next/server";
import { isDashboardAuthenticated } from "@/lib/api-auth";
import { HermesAgentProxyError, proxyHermesAgent } from "@/lib/hermes-agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  try {
    return NextResponse.json(await proxyHermesAgent("obsidian/sync", { method: "POST", body }));
  } catch (error) {
    if (error instanceof HermesAgentProxyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Hermes Agent OS request failed." }, { status: 502 });
  }
}
