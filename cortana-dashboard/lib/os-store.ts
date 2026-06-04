import "server-only";

import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  AgentDefinition,
  Artifact,
  ArtifactType,
  AutomationWorkflow,
  MemoryNote,
  Mission,
  MissionStatus,
  OperatingSystemState,
} from "@/lib/os-types";

const DATA_ROOT = process.env.CORTANA_DATA_ROOT || path.join(process.cwd(), ".cortana-os");
const WORKSPACE_ROOT = process.env.CORTANA_WORKSPACE_ROOT || path.join(DATA_ROOT, "workspace");
const MEMORY_VAULT_PATH = process.env.CORTANA_MEMORY_VAULT_PATH || path.join(DATA_ROOT, "memory-vault");
const STATE_PATH = path.join(DATA_ROOT, "state.json");

const ARTIFACT_BUCKETS: ArtifactType[] = ["app", "image", "video", "voice", "research", "chat", "mission", "note"];

type WriteMemoryInput = {
  title: string;
  category?: MemoryNote["category"];
  content: string;
  source: string;
  tags?: string[];
};

type CreateArtifactInput = {
  type: ArtifactType;
  title: string;
  summary: string;
  agentId: string;
  body: string;
  tags?: string[];
};

type CreateMissionInput = {
  title: string;
  goal: string;
  assignedAgentId: string;
  status?: MissionStatus;
  priority?: Mission["priority"];
};

export async function getOperatingSystemState(): Promise<OperatingSystemState> {
  await ensureStore();
  const raw = await readFile(STATE_PATH, "utf8");
  const state = JSON.parse(raw) as OperatingSystemState;

  return {
    ...state,
    generatedAt: new Date().toISOString(),
    workspaceRoot: WORKSPACE_ROOT,
    memoryVaultPath: MEMORY_VAULT_PATH,
  };
}

export async function createMission(input: CreateMissionInput) {
  const state = await getOperatingSystemState();
  const now = new Date().toISOString();
  const mission: Mission = {
    id: createId("mission"),
    title: input.title.trim(),
    goal: input.goal.trim(),
    assignedAgentId: input.assignedAgentId,
    status: input.status || "capture",
    priority: input.priority || "medium",
    logs: [`${formatLogDate(now)} Created mission.`],
    artifactIds: [],
    createdAt: now,
    updatedAt: now,
  };

  state.missions.unshift(mission);
  await saveState(state);
  await writeMemoryNote({
    title: `Mission: ${mission.title}`,
    category: "project",
    source: "mission",
    tags: ["mission", mission.assignedAgentId],
    content: `# ${mission.title}\n\nGoal: ${mission.goal}\n\nAssigned agent: ${mission.assignedAgentId}\n\nStatus: ${mission.status}\n`,
  });

  return mission;
}

export async function writeMemoryNote(input: WriteMemoryInput) {
  const state = await getOperatingSystemState();
  const now = new Date().toISOString();
  const title = sanitizeTitle(input.title || "Untitled Memory");
  const filename = `${now.slice(0, 10)}-${title}.md`;
  const relativePath = path.join(input.category || "agent-output", filename);
  const absolutePath = path.join(MEMORY_VAULT_PATH, relativePath);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, input.content, "utf8");

  const note: MemoryNote = {
    id: createId("memory"),
    title: input.title,
    category: input.category || "agent-output",
    content: input.content.slice(0, 1200),
    source: input.source,
    path: absolutePath,
    tags: input.tags || [],
    createdAt: now,
  };

  state.memory.unshift(note);
  await saveState(state);
  return note;
}

export async function createArtifact(input: CreateArtifactInput) {
  const state = await getOperatingSystemState();
  const now = new Date().toISOString();
  const title = sanitizeTitle(input.title || "untitled-artifact");
  const extension = input.type === "app" ? "html" : "md";
  const relativePath = path.join(input.type, `${now.slice(0, 10)}-${title}.${extension}`);
  const absolutePath = path.join(WORKSPACE_ROOT, relativePath);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, input.body, "utf8");

  const artifact: Artifact = {
    id: createId("artifact"),
    type: input.type,
    title: input.title,
    summary: input.summary,
    agentId: input.agentId,
    path: absolutePath,
    tags: input.tags || [],
    createdAt: now,
  };

  state.artifacts.unshift(artifact);
  await saveState(state);
  await writeMemoryNote({
    title: `Artifact: ${input.title}`,
    category: "agent-output",
    source: "workspace",
    tags: ["artifact", input.type, input.agentId],
    content: `# ${input.title}\n\nType: ${input.type}\nAgent: ${input.agentId}\nPath: ${absolutePath}\n\n${input.summary}\n`,
  });

  return artifact;
}

export async function recordChatExchange({
  message,
  reply,
  targetAgent,
}: {
  message: string;
  reply: string;
  targetAgent: string;
}) {
  const body = `# Chat with ${targetAgent}\n\n## Louis\n${message}\n\n## Cortana\n${reply}\n`;

  return createArtifact({
    type: "chat",
    title: `Chat ${targetAgent}`,
    summary: `Command routed to ${targetAgent}: ${message.slice(0, 160)}`,
    agentId: targetAgent,
    body,
    tags: ["chat", targetAgent],
  });
}

async function ensureStore() {
  await mkdir(DATA_ROOT, { recursive: true });
  await mkdir(WORKSPACE_ROOT, { recursive: true });
  await mkdir(MEMORY_VAULT_PATH, { recursive: true });
  await Promise.all(ARTIFACT_BUCKETS.map((bucket) => mkdir(path.join(WORKSPACE_ROOT, bucket), { recursive: true })));

  try {
    await stat(STATE_PATH);
  } catch {
    const seed = createSeedState();
    await saveState(seed);
    await writeSeedFiles(seed);
  }
}

async function saveState(state: OperatingSystemState) {
  await mkdir(DATA_ROOT, { recursive: true });
  await writeFile(
    STATE_PATH,
    JSON.stringify(
      {
        ...state,
        generatedAt: new Date().toISOString(),
        workspaceRoot: WORKSPACE_ROOT,
        memoryVaultPath: MEMORY_VAULT_PATH,
      },
      null,
      2,
    ),
    "utf8",
  );
}

async function writeSeedFiles(state: OperatingSystemState) {
  await Promise.all(
    state.memory.map(async (note) => {
      await mkdir(path.dirname(note.path), { recursive: true });
      await writeFile(note.path, note.content, "utf8");
    }),
  );
  await Promise.all(
    state.artifacts.map(async (artifact) => {
      await mkdir(path.dirname(artifact.path), { recursive: true });
      await writeFile(artifact.path, `# ${artifact.title}\n\n${artifact.summary}\n`, "utf8");
    }),
  );
}

function createSeedState(): OperatingSystemState {
  const now = new Date().toISOString();
  const agents: AgentDefinition[] = [
    {
      id: "cortana",
      name: "Cortana",
      role: "Command router",
      layer: "command",
      provider: "COSMIC CORTANA",
      description: "Routes commands, keeps missions aligned, and writes important outputs back into memory.",
      tools: ["agent-routing", "mission-control", "memory-writeback"],
      memoryAccess: true,
      status: "online",
      lastSeen: now,
    },
    {
      id: "hermes",
      name: "Hermes",
      role: "Research and workflow engine",
      layer: "research",
      provider: "Local Hermes bridge",
      endpoint: process.env.HERMES_API_URL || "http://127.0.0.1:8001/chat",
      description: "Runs local research, long-horizon goals, and workflow commands through the private bridge.",
      tools: ["research", "goal-mode", "web-briefs", "content-drafts"],
      memoryAccess: true,
      status: "ready",
      lastSeen: now,
    },
    {
      id: "claude",
      name: "Claude",
      role: "Deep reasoning and writing",
      layer: "model",
      provider: "Anthropic / Claude",
      description: "Primary reasoning model for planning, strategy, editing, and high-context writing.",
      tools: ["reasoning", "writing", "planning", "review"],
      memoryAccess: true,
      status: "planned",
      lastSeen: now,
    },
    {
      id: "openclaw",
      name: "OpenClaw",
      role: "Browser and studio execution",
      layer: "execution",
      provider: "OpenClaw",
      description: "Execution agent for browser work, studio tasks, and visual workflows.",
      tools: ["browser-control", "studio", "voice-talk", "visual-workflows"],
      memoryAccess: true,
      status: "planned",
      lastSeen: now,
    },
    {
      id: "gemini",
      name: "Gemini",
      role: "Multimodal model",
      layer: "model",
      provider: "Google Gemini",
      description: "Multimodal reasoning, long-context research, and model fallback.",
      tools: ["long-context", "vision", "research", "summaries"],
      memoryAccess: true,
      status: "planned",
      lastSeen: now,
    },
    {
      id: "antigravity",
      name: "Antigravity",
      role: "App builder",
      layer: "execution",
      provider: "Antigravity CLI",
      description: "Builder agent for app generation and workspace previews.",
      tools: ["app-builds", "previews", "code-generation"],
      memoryAccess: true,
      status: "planned",
      lastSeen: now,
    },
    {
      id: "codex",
      name: "Codex",
      role: "Build and code execution",
      layer: "execution",
      provider: "Local workspace",
      description: "Turns plans into code, edits files, verifies builds, and records implementation notes.",
      tools: ["code-editing", "terminal", "build-verification"],
      memoryAccess: true,
      status: "online",
      lastSeen: now,
    },
    {
      id: "free-claude-code",
      name: "Free Claude Code",
      role: "Open-source coding harness",
      layer: "execution",
      provider: "Free Claude Code",
      description: "Optional coding harness that can share the same workspace and memory notes.",
      tools: ["code-harness", "terminal", "agent-coding"],
      memoryAccess: true,
      status: "planned",
      lastSeen: now,
    },
    {
      id: "n8n",
      name: "n8n",
      role: "External automation plumbing",
      layer: "automation",
      provider: "n8n",
      endpoint: process.env.NEXT_PUBLIC_N8N_URL,
      description: "Handles webhook-heavy automations where external service wiring is still useful.",
      tools: ["webhooks", "schedules", "external-apis"],
      memoryAccess: false,
      status: "ready",
      lastSeen: now,
    },
    {
      id: "telegram",
      name: "Telegram",
      role: "Mobile command channel",
      layer: "mobile",
      provider: "Telegram Bot",
      endpoint: process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL,
      description: "Gives COSMIC CORTANA a quick mobile command surface.",
      tools: ["mobile-commands", "notifications"],
      memoryAccess: false,
      status: "ready",
      lastSeen: now,
    },
    {
      id: "elevenlabs",
      name: "ElevenLabs",
      role: "Voice interface",
      layer: "voice",
      provider: "ElevenLabs",
      description: "Reserved for text-to-speech, voice replies, and push-to-talk mode.",
      tools: ["text-to-speech", "voice-replies"],
      memoryAccess: false,
      status: "planned",
      lastSeen: now,
    },
    {
      id: "obsidian",
      name: "Obsidian Vault",
      role: "Infinite context engine",
      layer: "memory",
      provider: "Local Markdown vault",
      endpoint: MEMORY_VAULT_PATH,
      description: "Stores brand, project, decisions, journals, and agent output notes as plain Markdown.",
      tools: ["markdown-memory", "knowledge-graph", "context-retrieval"],
      memoryAccess: true,
      status: "online",
      lastSeen: now,
    },
  ];

  const missions: Mission[] = [
    {
      id: "mission-agent-registry",
      title: "Agent Registry",
      goal: "Keep every agent, endpoint, tool, and memory permission visible in one control plane.",
      assignedAgentId: "cortana",
      status: "build",
      priority: "high",
      logs: ["Seeded OS layer.", "Dashboard registry is now file-backed."],
      artifactIds: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "mission-memory-bridge",
      title: "Obsidian Memory Bridge",
      goal: "Write every important chat, decision, mission, and artifact into the local memory vault.",
      assignedAgentId: "obsidian",
      status: "build",
      priority: "high",
      logs: ["Local Markdown vault initialized."],
      artifactIds: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "mission-workspace",
      title: "Typed Workspace",
      goal: "Auto-save apps, images, videos, voice notes, chats, research, and mission outputs into typed buckets.",
      assignedAgentId: "codex",
      status: "monitor",
      priority: "high",
      logs: ["Workspace buckets created."],
      artifactIds: [],
      createdAt: now,
      updatedAt: now,
    },
  ];

  const memory: MemoryNote[] = [
    createSeedMemory("Brand Context", "brand", "COSMIC CORTANA should feel private, cinematic, local-first, and useful for running Louis' AI agents.", "seed"),
    createSeedMemory("Architecture Decision", "decision", "Use a file-backed local OS first: JSON metadata plus Markdown memory notes and typed workspace folders.", "seed"),
    createSeedMemory("Build Priority", "project", "Next priority is real connectors: Hermes health, Obsidian path selection, n8n webhook launch, Telegram commands, ElevenLabs voice.", "seed"),
  ];

  const artifacts: Artifact[] = [
    createSeedArtifact("COSMIC CORTANA Blueprint", "mission", "Seven-layer Agent OS blueprint: foundation, memory, brain, agents, command center, production services, loop.", "cortana"),
    createSeedArtifact("Workspace Index", "note", "Typed home for every output so nothing lands in random folders.", "codex"),
  ];

  const automations: AutomationWorkflow[] = [
    { id: "auto-morning-brief", name: "Morning Brief", trigger: "Weekdays 07:00", agentId: "hermes", state: "ready", progress: 70, outputBucket: "research" },
    { id: "auto-memory-writeback", name: "Memory Writeback", trigger: "On chat or artifact creation", agentId: "obsidian", state: "running", progress: 100, outputBucket: "note" },
    { id: "auto-content-research", name: "Content Research", trigger: "Manual or scheduled", agentId: "hermes", state: "draft", progress: 45, outputBucket: "research" },
  ];

  return {
    generatedAt: now,
    workspaceRoot: WORKSPACE_ROOT,
    memoryVaultPath: MEMORY_VAULT_PATH,
    agents,
    missions,
    artifacts,
    memory,
    automations,
  };
}

function createSeedMemory(
  title: string,
  category: MemoryNote["category"],
  content: string,
  source: string,
): MemoryNote {
  const now = new Date().toISOString();
  const file = path.join(MEMORY_VAULT_PATH, category, `${sanitizeTitle(title)}.md`);
  return {
    id: createId("memory"),
    title,
    category,
    content: `# ${title}\n\n${content}\n`,
    source,
    path: file,
    tags: [category, "seed"],
    createdAt: now,
  };
}

function createSeedArtifact(title: string, type: ArtifactType, summary: string, agentId: string): Artifact {
  const now = new Date().toISOString();
  return {
    id: createId("artifact"),
    type,
    title,
    summary,
    agentId,
    path: path.join(WORKSPACE_ROOT, type, `${sanitizeTitle(title)}.md`),
    tags: [type, "seed"],
    createdAt: now,
  };
}

function sanitizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "untitled";
}

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatLogDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export async function listWorkspaceFiles() {
  await ensureStore();
  const files: Record<string, string[]> = {};

  await Promise.all(
    ARTIFACT_BUCKETS.map(async (bucket) => {
      const bucketPath = path.join(WORKSPACE_ROOT, bucket);
      const entries = await readdir(bucketPath).catch(() => []);
      files[bucket] = entries;
    }),
  );

  return files;
}
