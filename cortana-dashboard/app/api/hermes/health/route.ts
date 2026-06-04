import { NextResponse } from "next/server";
import { isDashboardAuthenticated } from "@/lib/api-auth";
import { getHermesHealth } from "@/lib/hermes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const health = await getHermesHealth();
  return NextResponse.json(health, { status: health.ok ? 200 : 503 });
}
