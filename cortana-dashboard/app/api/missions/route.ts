import { NextRequest, NextResponse } from "next/server";
import { isDashboardAuthenticated } from "@/lib/api-auth";
import { createMission, getOperatingSystemState } from "@/lib/os-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const state = await getOperatingSystemState();
  return NextResponse.json({ missions: state.missions });
}

export async function POST(request: NextRequest) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    title?: unknown;
    goal?: unknown;
    assignedAgentId?: unknown;
    priority?: unknown;
  } | null;

  if (!body || typeof body.title !== "string" || typeof body.goal !== "string") {
    return NextResponse.json({ error: "Mission title and goal are required." }, { status: 400 });
  }

  const mission = await createMission({
    title: body.title,
    goal: body.goal,
    assignedAgentId: typeof body.assignedAgentId === "string" ? body.assignedAgentId : "cortana",
    priority: body.priority === "high" || body.priority === "low" ? body.priority : "medium",
  });

  return NextResponse.json({ mission }, { status: 201 });
}
