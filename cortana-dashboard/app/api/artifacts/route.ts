import { NextRequest, NextResponse } from "next/server";
import { isDashboardAuthenticated } from "@/lib/api-auth";
import { createArtifact, getOperatingSystemState } from "@/lib/os-store";
import { ArtifactType } from "@/lib/os-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ARTIFACT_TYPES = new Set(["app", "image", "video", "voice", "research", "chat", "mission", "note"]);

export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const state = await getOperatingSystemState();
  return NextResponse.json({ artifacts: state.artifacts });
}

export async function POST(request: NextRequest) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    type?: unknown;
    title?: unknown;
    summary?: unknown;
    agentId?: unknown;
    body?: unknown;
    tags?: unknown;
  } | null;

  if (!body || typeof body.title !== "string" || typeof body.summary !== "string") {
    return NextResponse.json({ error: "Artifact title and summary are required." }, { status: 400 });
  }

  const type = typeof body.type === "string" && ARTIFACT_TYPES.has(body.type) ? (body.type as ArtifactType) : "note";
  const artifact = await createArtifact({
    type,
    title: body.title,
    summary: body.summary,
    agentId: typeof body.agentId === "string" ? body.agentId : "cortana",
    body: typeof body.body === "string" ? body.body : body.summary,
    tags: Array.isArray(body.tags) ? body.tags.filter((tag): tag is string => typeof tag === "string") : [type],
  });

  return NextResponse.json({ artifact }, { status: 201 });
}
