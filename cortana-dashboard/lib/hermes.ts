import "server-only";

export type HermesChatRequest = {
  message: string;
  context?: Record<string, unknown>;
};

export type HermesChatResponse = {
  reply: string;
};

export type HermesHealthResponse = {
  ok: boolean;
  service?: string;
  url: string;
  message?: string;
};

const HERMES_TIMEOUT_MS = 50_000;
const DEFAULT_HERMES_BRIDGE_URL = "http://127.0.0.1:8001/chat";

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
  const hermesUrl = process.env.HERMES_API_URL || DEFAULT_HERMES_BRIDGE_URL;
  const hermesToken = process.env.HERMES_API_TOKEN;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HERMES_TIMEOUT_MS);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (hermesToken) {
      headers.Authorization = `Bearer ${hermesToken}`;
    }

    const response = await fetch(hermesUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ message, context }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new HermesChatError(`Hermes returned HTTP ${response.status}.`, response.status);
    }

    const data = (await response.json()) as Partial<HermesChatResponse>;

    if (typeof data.reply !== "string" || !data.reply.trim()) {
      throw new HermesChatError("Hermes returned an invalid response shape.");
    }

    return { reply: data.reply };
  } catch (error) {
    if (error instanceof HermesChatError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new HermesChatError("Hermes timed out.", 504);
    }

    throw new HermesChatError("Hermes local runtime is unavailable.");
  } finally {
    clearTimeout(timeout);
  }
}

export async function getHermesHealth(): Promise<HermesHealthResponse> {
  const hermesChatUrl = process.env.HERMES_API_URL || DEFAULT_HERMES_BRIDGE_URL;
  const healthUrl = hermesChatUrl.replace(/\/chat\/?$/, "/health");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4_000);

  try {
    const response = await fetch(healthUrl, {
      cache: "no-store",
      signal: controller.signal,
    });
    const data = (await response.json().catch(() => null)) as { ok?: boolean; service?: string } | null;

    return {
      ok: response.ok && data?.ok === true,
      service: data?.service,
      url: healthUrl,
      message: response.ok ? undefined : `Bridge returned HTTP ${response.status}.`,
    };
  } catch (error) {
    return {
      ok: false,
      url: healthUrl,
      message:
        error instanceof DOMException && error.name === "AbortError"
          ? "Hermes bridge health check timed out."
          : "Hermes bridge is not reachable.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

// TODO: streaming - add a token/audio streaming adapter when Hermes exposes incremental output.
// TODO: memory sync - add hooks so dashboard conversations can update Cortana memory server-side.
