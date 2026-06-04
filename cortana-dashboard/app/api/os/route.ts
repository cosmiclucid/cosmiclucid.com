import { NextResponse } from "next/server";
import { isDashboardAuthenticated } from "@/lib/api-auth";
import { getOperatingSystemState } from "@/lib/os-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json(await getOperatingSystemState());
}
