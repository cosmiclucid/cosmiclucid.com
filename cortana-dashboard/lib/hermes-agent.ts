import "server-only";

const DEFAULT_AGENT_BASE_URL = "http://127.0.0.1:8787";
const DEFAULT_AGENT_PREFIX = "/agent-os";
const HERMES_AGENT_TIMEOUT_MS = 30_000;

export type HermesAgentEndpoint =
  | "overview"
  | "graph"
  | "sessions"
  | "memory"
  | "processes"
  | "agents/run"
  | "obsidian/sync";

type ProxyOptions = {
  method?: "GET" | "POST";
  body?: unknown;
};

const endpointPaths: Record<HermesAgentEndpoint, string> = {
  overview: "/api/overview",
  graph: "/api/graph",
  sessions: "/api/sessions",
  memory: "/api/memory",
  processes: "/api/processes",
  "agents/run": "/api/agents/run",
  "obsidian/sync": "/api/obsidian/sync",
};

export class HermesAgentProxyError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "HermesAgentProxyError";
    this.status = status;
  }
}

export async function proxyHermesAgent(endpoint: HermesAgentEndpoint, options: ProxyOptions = {}) {
  const url = buildHermesAgentUrl(endpoint);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HERMES_AGENT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
      signal: controller.signal,
    });
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : await response.text().catch(() => "");

    if (!response.ok) {
      throw new HermesAgentProxyError(`Hermes Agent OS returned HTTP ${response.status}.`, response.status);
    }

    return {
      data,
      upstreamUrl: url,
    };
  } catch (error) {
    if (error instanceof HermesAgentProxyError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new HermesAgentProxyError("Hermes Agent OS timed out.", 504);
    }

    throw new HermesAgentProxyError("Hermes Agent OS is not reachable.");
  } finally {
    clearTimeout(timeout);
  }
}

export function getHermesAgentConfig() {
  return {
    baseUrl: process.env.HERMES_AGENT_BASE_URL || DEFAULT_AGENT_BASE_URL,
    routePrefix: process.env.HERMES_AGENT_ROUTE_PREFIX || DEFAULT_AGENT_PREFIX,
  };
}

function buildHermesAgentUrl(endpoint: HermesAgentEndpoint) {
  const { baseUrl, routePrefix } = getHermesAgentConfig();
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const cleanPrefix = routePrefix ? `/${routePrefix.replace(/^\/+|\/+$/g, "")}` : "";
  return `${cleanBase}${cleanPrefix}${endpointPaths[endpoint]}`;
}
