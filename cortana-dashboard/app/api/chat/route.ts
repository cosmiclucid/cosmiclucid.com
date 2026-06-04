import { NextRequest, NextResponse } from "next/server";
import { isDashboardAuthenticated } from "@/lib/api-auth";
import { HermesChatError, sendHermesChat } from "@/lib/hermes";
import { recordChatExchange } from "@/lib/os-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 2_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 24;
const KNOWN_AGENT_IDS = new Set(["cortana", "hermes", "codex", "n8n", "telegram", "elevenlabs", "obsidian", "memory"]);

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

export async function POST(request: NextRequest) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ reply: "Unauthorized." }, { status: 401 });
  }

  const rateLimit = checkRateLimit(getClientKey(request));

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { reply: "Too many messages. Wait a moment and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)),
        },
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reply: "Invalid JSON payload." }, { status: 400 });
  }

  const message = extractMessage(body);
  const targetAgent = extractTargetAgent(body);

  if (!message) {
    return NextResponse.json({ reply: "Message is required." }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { reply: `Message is too long. Keep it under ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 413 },
    );
  }

  try {
    const hermesResponse = await sendHermesChat({
      message,
      context: {
        route: "/api/chat",
        targetAgent,
        // TODO: memory sync - attach memory IDs here when memory sync is connected.
        // TODO: file uploads - attach uploaded file references here when chat uploads are added.
        // TODO: Attach authenticated user/session metadata if multi-user access is added.
      },
    });

    await recordChatExchange({
      message,
      reply: hermesResponse.reply,
      targetAgent,
    });

    // TODO: streaming - add Server-Sent Events or Web Streams support for future streaming replies.
    return NextResponse.json({ reply: hermesResponse.reply });
  } catch (error) {
    if (error instanceof HermesChatError) {
      return NextResponse.json({ reply: error.message }, { status: error.status });
    }

    return NextResponse.json({ reply: "Hermes request failed." }, { status: 502 });
  }
}

function extractMessage(body: unknown) {
  if (!body || typeof body !== "object" || !("message" in body)) {
    return null;
  }

  const message = (body as { message: unknown }).message;

  if (typeof message !== "string") {
    return null;
  }

  return message.trim();
}

function extractTargetAgent(body: unknown) {
  if (!body || typeof body !== "object" || !("targetAgent" in body)) {
    return "hermes";
  }

  const targetAgent = (body as { targetAgent: unknown }).targetAgent;

  if (typeof targetAgent !== "string") {
    return "hermes";
  }

  const normalized = targetAgent.trim().toLowerCase();
  return KNOWN_AGENT_IDS.has(normalized) ? normalized : "hermes";
}

function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "local";
}

function checkRateLimit(clientKey: string) {
  const now = Date.now();
  const current = rateLimitStore.get(clientKey);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfterMs: current.resetAt - now };
  }

  current.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

// TODO: Replace this in-memory limiter with Redis/Upstash on multi-instance VPS deployments.
