import "server-only";

const DEFAULT_WEBUI_BASE_URL = "http://127.0.0.1:8787";
const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;
const CHAT_REQUEST_TIMEOUT_MS = 300_000;

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

type WebUiRequestOptions = ProxyOptions & {
  timeoutMs?: number;
};

type UnknownRecord = Record<string, unknown>;

export class HermesAgentProxyError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "HermesAgentProxyError";
    this.status = status;
  }
}

export async function proxyHermesAgent(endpoint: HermesAgentEndpoint, options: ProxyOptions = {}) {
  const result = await resolveEndpoint(endpoint, options);

  return {
    data: result,
    upstreamUrl: getHermesAgentConfig().baseUrl,
  };
}

export async function requestHermesWebUi(pathname: string, options: WebUiRequestOptions = {}) {
  const url = buildHermesWebUiUrl(pathname);
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs || DEFAULT_REQUEST_TIMEOUT_MS,
  );

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    const authHeader = process.env.HERMES_WEBUI_AUTH_HEADER;
    const cookie = process.env.HERMES_WEBUI_COOKIE;

    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    if (authHeader) {
      headers.Authorization = authHeader;
    }
    if (cookie) {
      headers.Cookie = cookie;
    }

    const response = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
      signal: controller.signal,
    });
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : await response.text().catch(() => "");

    if (!response.ok) {
      const detail = getErrorMessage(data);
      throw new HermesAgentProxyError(
        detail || `Hermes WebUI returned HTTP ${response.status}.`,
        response.status,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof HermesAgentProxyError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new HermesAgentProxyError("Hermes WebUI timed out.", 504);
    }

    throw new HermesAgentProxyError("Hermes WebUI is not reachable.");
  } finally {
    clearTimeout(timeout);
  }
}

export function getHermesAgentConfig() {
  const baseUrl =
    process.env.HERMES_WEBUI_BASE_URL ||
    process.env.HERMES_AGENT_BASE_URL ||
    DEFAULT_WEBUI_BASE_URL;

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    publicUrl: process.env.NEXT_PUBLIC_HERMES_WEBUI_URL || "/hermes/",
  };
}

async function resolveEndpoint(endpoint: HermesAgentEndpoint, options: ProxyOptions) {
  switch (endpoint) {
    case "overview":
      return getOverview();
    case "graph":
      return getAgentGraph();
    case "sessions":
      return requestHermesWebUi("/api/sessions");
    case "memory":
      return getMemory();
    case "processes":
      return getProcesses();
    case "agents/run":
      return runAgent(options.body);
    case "obsidian/sync":
      return {
        ok: true,
        source: "hermes-webui",
        memory: await getMemory(),
      };
  }
}

async function getOverview() {
  const [health, agentHealth, systemHealth, crons, sessions] = await Promise.all([
    requestHermesWebUi("/health"),
    requestHermesWebUi("/api/health/agent").catch(() => null),
    requestHermesWebUi("/api/system/health").catch(() => null),
    requestHermesWebUi("/api/crons").catch(() => ({ jobs: [] })),
    requestHermesWebUi("/api/sessions").catch(() => ({ sessions: [] })),
  ]);
  const healthRecord = asRecord(health);
  const agentRecord = asRecord(agentHealth);
  const systemRecord = asRecord(systemHealth);
  const sessionItems = getArray(asRecord(sessions).sessions);
  const jobs = getArray(asRecord(crons).jobs);
  const activeRuns = getArray(healthRecord.runs);
  const agentAlive = agentRecord.alive;

  return {
    status: healthRecord.status || "ok",
    service: "Hermes WebUI",
    sessions: Number(healthRecord.sessions || sessionItems.length),
    active_streams: Number(healthRecord.active_streams || 0),
    gateway: {
      status: agentAlive === true ? "online" : agentAlive === false ? "offline" : "not configured",
      ...asRecord(agentRecord.details),
    },
    vps: {
      cpu_pct: getNestedNumber(systemRecord, ["cpu", "percent"]),
      mem_pct: getNestedNumber(systemRecord, ["memory", "percent"]),
      disk_pct: getNestedNumber(systemRecord, ["disk", "percent"]),
    },
    stats: {
      total: sessionItems.length,
      completed: sessionItems.filter((session) => !isSessionRunning(session)).length,
      running: activeRuns.length,
    },
    activity: sessionItems.slice(0, 12).map((session) => sessionActivity(session)),
    cron: { jobs },
    board: {
      tasks: activeRuns.map((run) => ({
        ...asRecord(run),
        title: getFirstString(asRecord(run), ["title", "session_id", "stream_id"]) || "Hermes run",
        status: "in_progress",
      })),
    },
    health,
    agent_health: agentHealth,
    system_health: systemHealth,
  };
}

async function getMemory() {
  const memory = asRecord(await requestHermesWebUi("/api/memory"));
  const items = [
    memoryDocument("Hermes Memory", "memory", memory.memory, memory.memory_path, memory.memory_mtime),
    memoryDocument("User Context", "user", memory.user, memory.user_path, memory.user_mtime),
    memoryDocument("Hermes Soul", "soul", memory.soul, memory.soul_path, memory.soul_mtime),
  ].filter((item) => item !== null);

  return { ...memory, items, notes: items };
}

async function getProcesses() {
  const health = asRecord(await requestHermesWebUi("/health"));
  const runs = getArray(health.runs);

  return {
    processes: runs,
    running: runs,
    active_streams: Number(health.active_streams || 0),
    active_runs: Number(health.active_runs || runs.length),
  };
}

async function getAgentGraph() {
  const [profiles, models] = await Promise.all([
    requestHermesWebUi("/api/profiles").catch(() => ({ profiles: [] })),
    requestHermesWebUi("/api/models").catch(() => ({ models: [] })),
  ]);
  const profileItems = getArray(asRecord(profiles).profiles);
  const modelItems = extractModels(models);
  const nodes = [
    { id: "hermes", name: "Hermes", type: "runtime" },
    ...profileItems.map((profile, index) => ({
      id: getFirstString(asRecord(profile), ["name", "id"]) || `profile-${index}`,
      name: getFirstString(asRecord(profile), ["name", "id"]) || `Profile ${index + 1}`,
      type: "profile",
    })),
    ...modelItems.slice(0, 30).map((model, index) => ({
      id: getFirstString(asRecord(model), ["id", "model", "value"]) || `model-${index}`,
      name: getFirstString(asRecord(model), ["name", "label", "id", "model"]) || `Model ${index + 1}`,
      type: "model",
    })),
  ];

  return {
    nodes,
    edges: nodes.slice(1).map((node) => ({
      source: "hermes",
      target: node.id,
    })),
    profiles: profileItems,
    models: modelItems,
  };
}

async function runAgent(body: unknown) {
  const input = asRecord(body);
  const message = getFirstString(input, ["message", "prompt"]);

  if (!message) {
    throw new HermesAgentProxyError("A Hermes prompt is required.", 400);
  }

  let sessionId = getFirstString(input, ["session_id", "sessionId"]);

  if (!sessionId) {
    const sessionResult = asRecord(
      await requestHermesWebUi("/api/session/new", {
        method: "POST",
        body: {
          workspace: process.env.HERMES_WEBUI_DEFAULT_WORKSPACE || undefined,
          profile: getFirstString(input, ["profile"]) || undefined,
          model: getFirstString(input, ["model"]) || undefined,
        },
      }),
    );
    sessionId = getFirstString(asRecord(sessionResult.session), ["session_id"]);
  }

  if (!sessionId) {
    throw new HermesAgentProxyError("Hermes WebUI did not create a session.");
  }

  const result = asRecord(
    await requestHermesWebUi("/api/chat", {
      method: "POST",
      timeoutMs: CHAT_REQUEST_TIMEOUT_MS,
      body: {
        session_id: sessionId,
        message,
        model: getFirstString(input, ["model"]) || undefined,
        workspace: process.env.HERMES_WEBUI_DEFAULT_WORKSPACE || undefined,
      },
    }),
  );

  return {
    ...result,
    answer: getFirstString(result, ["answer", "reply", "response"]) || "",
    session_id: sessionId,
  };
}

function buildHermesWebUiUrl(pathname: string) {
  const { baseUrl } = getHermesAgentConfig();
  return `${baseUrl}/${pathname.replace(/^\/+/, "")}`;
}

function memoryDocument(
  title: string,
  source: string,
  content: unknown,
  filePath: unknown,
  modifiedAt: unknown,
) {
  if (typeof content !== "string" || !content.trim()) {
    return null;
  }

  return {
    title,
    name: title,
    source,
    content,
    summary: content.replace(/^#+\s*/gm, "").trim().slice(0, 240),
    path: typeof filePath === "string" ? filePath : "",
    modified_at: modifiedAt,
  };
}

function sessionActivity(value: unknown) {
  const session = asRecord(value);

  return {
    agent_name: getFirstString(session, ["profile"]) || "Hermes",
    task_description: getFirstString(session, ["title"]) || "Untitled session",
    model_used: getFirstString(session, ["model"]) || "default model",
    status: isSessionRunning(session) ? "running" : "complete",
    updated_at: session.updated_at,
  };
}

function isSessionRunning(value: unknown) {
  const session = asRecord(value);
  return Boolean(
    session.active_stream_id ||
      session.is_running === true ||
      session.running === true ||
      session.status === "running",
  );
}

function extractModels(value: unknown) {
  if (Array.isArray(value)) {
    return value;
  }

  const record = asRecord(value);
  for (const key of ["models", "available_models", "items", "options"]) {
    if (Array.isArray(record[key])) {
      return record[key] as unknown[];
    }
  }

  return [];
}

function getNestedNumber(record: UnknownRecord, path: string[]) {
  let current: unknown = record;

  for (const segment of path) {
    current = asRecord(current)[segment];
  }

  return typeof current === "number" && Number.isFinite(current) ? current : 0;
}

function getArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function getFirstString(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function getErrorMessage(value: unknown) {
  if (typeof value === "string" && value.trim()) {
    return value.trim().slice(0, 300);
  }

  return getFirstString(asRecord(value), ["error", "message", "detail"]);
}
