import "server-only";

import {
  getHermesAgentConfig,
  HermesAgentProxyError,
  proxyHermesAgent,
  requestHermesWebUi,
} from "@/lib/hermes-agent";

export type HermesChatRequest = {
  message: string;
  context?: Record<string, unknown>;
};

export type HermesChatResponse = {
  reply: string;
  sessionId?: string;
};

export type HermesHealthResponse = {
  ok: boolean;
  service?: string;
  url: string;
  message?: string;
};

export class HermesChatError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "HermesChatError";
    this.status = status;
  }
}

export async function sendHermesChat({
  message,
  context,
}: HermesChatRequest): Promise<HermesChatResponse> {
  try {
    const response = await proxyHermesAgent("agents/run", {
      method: "POST",
      body: {
        message,
        session_id: context?.sessionId,
        profile: context?.profile,
        model: context?.model,
      },
    });
    const data = asRecord(response.data);
    const reply = getString(data, ["answer", "reply", "response"]);

    if (!reply) {
      throw new HermesChatError("Hermes WebUI returned an empty response.");
    }

    return {
      reply,
      sessionId: getString(data, ["session_id"]),
    };
  } catch (error) {
    if (error instanceof HermesChatError) {
      throw error;
    }
    if (error instanceof HermesAgentProxyError) {
      throw new HermesChatError(error.message, error.status);
    }

    throw new HermesChatError("Hermes WebUI request failed.");
  }
}

export async function getHermesHealth(): Promise<HermesHealthResponse> {
  const { baseUrl } = getHermesAgentConfig();
  const healthUrl = `${baseUrl}/health`;

  try {
    const data = asRecord(await requestHermesWebUi("/health", { timeoutMs: 4_000 }));
    const healthy = data.status === "ok";

    return {
      ok: healthy,
      service: "Hermes WebUI",
      url: healthUrl,
      message: healthy ? undefined : `Hermes WebUI is ${String(data.status || "degraded")}.`,
    };
  } catch (error) {
    return {
      ok: false,
      service: "Hermes WebUI",
      url: healthUrl,
      message:
        error instanceof HermesAgentProxyError
          ? error.message
          : "Hermes WebUI is not reachable.",
    };
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}
