"use client";

import { motion } from "framer-motion";
import { FormEvent, RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Code2,
  Command,
  Database,
  FileText,
  GalleryHorizontalEnd,
  GitBranch,
  Image,
  KanbanSquare,
  LogOut,
  MessageSquareText,
  Mic2,
  MonitorUp,
  Orbit,
  Plus,
  RefreshCw,
  SendHorizontal,
  ShieldCheck,
  Sparkles,
  Video,
  Workflow,
  Zap,
} from "lucide-react";
import { logoutAction } from "@/lib/actions";
import { navigation, quickActions } from "@/lib/data";
import {
  AgentDefinition,
  Artifact,
  ArtifactType,
  MemoryNote,
  Mission,
  MissionStatus,
  OperatingSystemState,
} from "@/lib/os-types";
import { HermesAgentPanelState, HermesAgentProxyResponse } from "@/lib/hermes-agent-types";

type ChatMessage = {
  id: string;
  speaker: "Louis" | "Cortana";
  text: string;
  target?: string;
};

const panelMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

const fallbackState: OperatingSystemState = {
  generatedAt: new Date().toISOString(),
  workspaceRoot: "Loading local workspace...",
  memoryVaultPath: "Loading memory vault...",
  agents: [],
  missions: [],
  artifacts: [],
  memory: [],
  automations: [],
};

const bucketLabels: Record<ArtifactType, string> = {
  app: "Apps",
  image: "Images",
  video: "Videos",
  voice: "Voice",
  research: "Research",
  chat: "Chats",
  mission: "Missions",
  note: "Notes",
};

const bucketIcons: Record<ArtifactType, typeof FileText> = {
  app: MonitorUp,
  image: Image,
  video: Video,
  voice: Mic2,
  research: BrainCircuit,
  chat: MessageSquareText,
  mission: KanbanSquare,
  note: FileText,
};

function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`glass rounded-[24px] ${className}`}>{children}</section>;
}

export function DashboardShell() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [selectedAgentId, setSelectedAgentId] = useState("hermes");
  const [state, setState] = useState<OperatingSystemState>(fallbackState);
  const [hermesHealth, setHermesHealth] = useState<{ ok: boolean; url: string; message?: string } | null>(null);
  const [hermesAgentState, setHermesAgentState] = useState<HermesAgentPanelState | null>(null);
  const [hermesAgentError, setHermesAgentError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const agentsRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);

  async function refreshState() {
    setError(null);

    try {
      const [response, healthResponse] = await Promise.all([
        fetch("/api/os", { cache: "no-store" }),
        fetch("/api/hermes/health", { cache: "no-store" }).catch(() => null),
      ]);
      const data = (await response.json()) as OperatingSystemState | { error?: string };

      if (!response.ok) {
        throw new Error("error" in data && data.error ? data.error : "Could not load COSMIC CORTANA OS.");
      }

      setState(data as OperatingSystemState);
      if (healthResponse) {
        const health = (await healthResponse.json().catch(() => null)) as { ok?: boolean; url?: string; message?: string } | null;
        setHermesHealth({
          ok: healthResponse.ok && health?.ok === true,
          url: health?.url || "http://127.0.0.1:8001/health",
          message: health?.message,
        });
      } else {
        setHermesHealth({ ok: false, url: "http://127.0.0.1:8001/health", message: "Hermes bridge is not reachable." });
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load COSMIC CORTANA OS.");
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshHermesAgent() {
    setHermesAgentError(null);

    try {
      const endpoints = ["overview", "graph", "sessions", "memory", "processes"] as const;
      const responses = await Promise.all(
        endpoints.map(async (endpoint) => {
          const response = await fetch(`/api/hermes/agent/${endpoint}`, { cache: "no-store" });
          const payload = (await response.json().catch(() => null)) as HermesAgentProxyResponse | { error?: string } | null;

          if (!response.ok) {
            throw new Error(payload && "error" in payload && payload.error ? payload.error : `Could not load Hermes ${endpoint}.`);
          }

          return [endpoint, (payload as HermesAgentProxyResponse).data] as const;
        }),
      );

      setHermesAgentState(Object.fromEntries(responses) as HermesAgentPanelState);
    } catch (agentError) {
      setHermesAgentError(agentError instanceof Error ? agentError.message : "Could not load Hermes Agent OS.");
    }
  }

  useEffect(() => {
    void refreshState();
    void refreshHermesAgent();
  }, []);

  function selectSection(section: string) {
    setActiveSection(section);

    if (section === "Chat") {
      requestAnimationFrame(() => {
        chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        chatInputRef.current?.focus();
      });
    } else if (section === "Agents") {
      requestAnimationFrame(() => agentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } else if (section === "Studio") {
      requestAnimationFrame(() => studioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  return (
    <main className="min-h-dvh px-3 py-3 sm:px-5 lg:p-6">
      <div className="mx-auto grid max-w-[1800px] gap-4 lg:grid-cols-[240px_minmax(0,1fr)_330px]">
        <Sidebar activeSection={activeSection} onSelect={selectSection} />
        <section className="min-w-0 space-y-4">
          <MobileNav activeSection={activeSection} onSelect={selectSection} />
          <HeroPanel state={state} isLoading={isLoading} onRefresh={refreshState} />
          {error ? (
            <p className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          ) : null}
          <SevenLayerPanel />
          <HermesConnectionPanel health={hermesHealth} />
          <HermesAgentPanel
            data={hermesAgentState}
            error={hermesAgentError}
            onRefresh={refreshHermesAgent}
          />
          <AgentNetworkPanel
            agents={state.agents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={setSelectedAgentId}
            panelRef={agentsRef}
          />
          <StudioPanel
            panelRef={studioRef}
            selectedAgentId={selectedAgentId}
            artifacts={state.artifacts}
            onCreated={refreshState}
          />
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
            <ChatPanel
              agents={state.agents}
              selectedAgentId={selectedAgentId}
              onSelectAgent={setSelectedAgentId}
              inputRef={chatInputRef}
              panelRef={chatRef}
              onActivity={refreshState}
            />
            <MissionComposer agents={state.agents} onCreated={refreshState} />
          </div>
          <WorkspacePanel artifacts={state.artifacts} workspaceRoot={state.workspaceRoot} onCreated={refreshState} />
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <MissionBoard missions={state.missions} agents={state.agents} />
            <MemoryPanel memory={state.memory} memoryVaultPath={state.memoryVaultPath} />
          </div>
        </section>
        <RightRail state={state} />
      </div>
    </main>
  );
}

function Sidebar({
  activeSection,
  onSelect,
}: {
  activeSection: string;
  onSelect: (section: string) => void;
}) {
  return (
    <aside className="glass sticky top-3 hidden h-[calc(100dvh-1.5rem)] rounded-[28px] p-4 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-glow">
          <Sparkles className="h-5 w-5 text-aurora" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">COSMIC</p>
          <p className="text-xs uppercase tracking-[0.22em] text-mist">Cortana</p>
        </div>
      </div>
      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = item.label === activeSection;
          return (
            <button
              key={item.label}
              onClick={() => onSelect(item.label)}
              className={`flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm transition ${
                active
                  ? "bg-white text-void shadow-cyan"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
              type="button"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <form action={logoutAction} className="absolute bottom-4 left-4 right-4">
        <button
          className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          type="submit"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </form>
    </aside>
  );
}

function MobileNav({
  activeSection,
  onSelect,
}: {
  activeSection: string;
  onSelect: (section: string) => void;
}) {
  return (
    <nav className="glass flex gap-2 overflow-x-auto rounded-[22px] p-2 lg:hidden">
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = item.label === activeSection;

        return (
          <button
            key={item.label}
            onClick={() => onSelect(item.label)}
            className={`flex h-10 shrink-0 items-center gap-2 rounded-2xl px-3 text-sm transition ${
              active ? "bg-white text-void shadow-cyan" : "text-slate-300"
            }`}
            type="button"
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function HeroPanel({
  state,
  isLoading,
  onRefresh,
}: {
  state: OperatingSystemState;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}) {
  const connectedAgents = state.agents.filter((agent) => agent.status === "online" || agent.status === "ready").length;
  const openMissions = state.missions.filter((mission) => mission.status !== "done").length;
  const memoryCount = state.memory.length;
  const artifactCount = state.artifacts.length;

  const metrics = [
    { label: "Connected agents", value: connectedAgents, icon: Bot, tone: "text-aurora" },
    { label: "Open missions", value: openMissions, icon: KanbanSquare, tone: "text-amber-200" },
    { label: "Artifacts saved", value: artifactCount, icon: Boxes, tone: "text-emerald-300" },
    { label: "Memory notes", value: memoryCount, icon: Database, tone: "text-lime-200" },
  ];

  return (
    <motion.section
      {...panelMotion}
      className="glass luxury-ring overflow-hidden rounded-[30px] p-5 sm:p-7"
    >
      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_auto] 2xl:items-end">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-aurora">
            <ShieldCheck className="h-3.5 w-3.5" />
            Local agent operating system
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            COSMIC CORTANA
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-mist sm:text-lg">
            One private command center with agents, missions, workspace artifacts, memory writeback,
            and a feedback loop that keeps every output findable.
          </p>
          <button
            type="button"
            onClick={() => void onRefresh()}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh OS
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:min-w-[420px] sm:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-black/20 px-3 py-4"
              >
                <Icon className={`mb-3 h-4 w-4 ${metric.tone}`} />
                <p className="text-2xl font-semibold text-white">{metric.value}</p>
                <p className="mt-1 text-xs leading-5 text-mist">{metric.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

function SevenLayerPanel() {
  const layers = [
    ["Foundation", "Local Next.js app, local files, private auth"],
    ["Memory", "Obsidian-style Markdown vault and writeback"],
    ["Brain", "Hermes, Claude, OpenRouter, or any model endpoint"],
    ["Agents", "Harnesses with tools, roles, and memory permissions"],
    ["Command", "Mission control dashboard and targeted chat"],
    ["Production", "Typed workspace for apps, media, research, voice, chats"],
    ["Loop", "Every output becomes memory for the next run"],
  ];

  return (
    <GlassPanel className="p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <GitBranch className="h-5 w-5 text-aurora" />
        <div>
          <h2 className="text-lg font-semibold text-white">Seven-Layer OS Blueprint</h2>
          <p className="mt-1 text-sm text-mist">The exact structure from the Agent OS walkthrough, implemented locally.</p>
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-2 2xl:grid-cols-7">
        {layers.map(([title, text], index) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-xs font-semibold text-aurora">Layer {index + 1}</p>
            <h3 className="mt-2 text-sm font-semibold text-white">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-mist">{text}</p>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function HermesConnectionPanel({
  health,
}: {
  health: { ok: boolean; url: string; message?: string } | null;
}) {
  const ok = health?.ok === true;

  return (
    <GlassPanel className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${ok ? "border-emerald-300/25 bg-emerald-300/10" : "border-amber-200/25 bg-amber-200/10"}`}>
            <Workflow className={`h-5 w-5 ${ok ? "text-emerald-300" : "text-amber-200"}`} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Hermes Connection</h2>
            <p className="mt-1 text-sm leading-6 text-mist">
              COSMIC CORTANA calls the protected Next API, then the local bridge at <span className="text-slate-200">{health?.url || "http://127.0.0.1:8001/health"}</span>.
            </p>
          </div>
        </div>
        <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${ok ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200" : "border-amber-200/20 bg-amber-200/10 text-amber-100"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-300" : "bg-amber-200"}`} />
          {ok ? "Bridge online" : health?.message || "Bridge not connected"}
        </div>
      </div>
    </GlassPanel>
  );
}

function HermesAgentPanel({
  data,
  error,
  onRefresh,
}: {
  data: HermesAgentPanelState | null;
  error: string | null;
  onRefresh: () => Promise<void>;
}) {
  const [prompt, setPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const sessions = normalizeList(data?.sessions, ["sessions", "recentSessions", "items"]);
  const memoryItems = normalizeList(data?.memory, ["memory", "items", "notes"]);
  const processes = normalizeList(data?.processes, ["processes", "tasks", "running"]);
  const scheduledJobs = normalizeList(data?.overview, ["cron", "scheduledJobs", "jobs", "schedules"]);
  const graphNodes = normalizeList(data?.graph, ["nodes", "agents", "items"]);
  const graphEdges = normalizeList(data?.graph, ["edges", "links"]);
  const overviewStatus = getStringValue(data?.overview, ["status", "state", "health"]) || (error ? "offline" : data ? "online" : "loading");

  async function runAgent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!prompt.trim() || isRunning) {
      return;
    }

    setIsRunning(true);
    setActionError(null);
    setReply(null);

    try {
      const response = await fetch("/api/hermes/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          prompt,
          agent: "hermes",
          source: "cosmic-cortana",
        }),
      });
      const payload = (await response.json().catch(() => null)) as HermesAgentProxyResponse | { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload && "error" in payload && payload.error ? payload.error : "Hermes run failed.");
      }

      setReply(formatUnknown((payload as HermesAgentProxyResponse).data));
      setPrompt("");
      await onRefresh();
    } catch (runError) {
      setActionError(runError instanceof Error ? runError.message : "Hermes run failed.");
    } finally {
      setIsRunning(false);
    }
  }

  async function syncObsidian() {
    setIsSyncing(true);
    setActionError(null);

    try {
      const response = await fetch("/api/hermes/agent/obsidian/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "cosmic-cortana" }),
      });
      const payload = (await response.json().catch(() => null)) as HermesAgentProxyResponse | { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload && "error" in payload && payload.error ? payload.error : "Obsidian sync failed.");
      }

      setReply(`Obsidian sync complete: ${formatUnknown((payload as HermesAgentProxyResponse).data)}`);
      await onRefresh();
    } catch (syncError) {
      setActionError(syncError instanceof Error ? syncError.message : "Obsidian sync failed.");
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <GlassPanel className="p-4 sm:p-5">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-aurora">Hermes Agent</p>
          <h2 className="text-2xl font-semibold text-white sm:text-4xl">Cosmic Agent Panel</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-mist">
            Hermes runs inside COSMIC CORTANA as an agent surface: sessions, memory, processes, cron jobs, and prompt execution all proxy through protected Next.js routes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void onRefresh()}
            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Hermes
          </button>
          <button
            type="button"
            onClick={() => void syncObsidian()}
            disabled={isSyncing}
            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-void shadow-cyan transition hover:bg-aurora disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Database className="h-4 w-4" />
            {isSyncing ? "Syncing..." : "Sync Obsidian"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-2xl border border-amber-200/20 bg-amber-200/10 px-4 py-3 text-sm leading-6 text-amber-100">
          {error}
        </p>
      ) : null}

      <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard icon={Workflow} label="Hermes status" value={overviewStatus} tone={error ? "text-amber-200" : "text-emerald-300"} />
        <MetricCard icon={MessageSquareText} label="Recent sessions" value={sessions.length} tone="text-aurora" />
        <MetricCard icon={BrainCircuit} label="Memory items" value={memoryItems.length} tone="text-lime-200" />
        <MetricCard icon={Zap} label="Running tasks" value={processes.length} tone="text-amber-200" />
        <MetricCard icon={RefreshCw} label="Scheduled jobs" value={scheduledJobs.length} tone="text-pink-200" />
      </div>

      <HermesMissionControl data={data} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <form className="rounded-2xl border border-white/10 bg-black/20 p-4" onSubmit={runAgent}>
          <div className="mb-3 flex items-center gap-2">
            <Command className="h-4 w-4 text-aurora" />
            <p className="text-sm font-semibold text-white">Prompt Hermes</p>
          </div>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="min-h-28 w-full resize-none rounded-2xl border border-white/12 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500"
            placeholder="Ask Hermes to research, plan, summarize memory, or run an agent task..."
            maxLength={2000}
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-mist">POST /agent-os/api/agents/run</p>
            <button
              type="submit"
              disabled={!prompt.trim() || isRunning}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-void shadow-cyan transition hover:bg-aurora disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SendHorizontal className="h-4 w-4" />
              {isRunning ? "Running..." : "Run Hermes"}
            </button>
          </div>
          {actionError ? <p className="mt-3 text-sm leading-6 text-red-100">{actionError}</p> : null}
          {reply ? (
            <div className="mt-4 max-h-56 overflow-auto rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-slate-200">
              {reply}
            </div>
          ) : null}
        </form>

        <div className="grid gap-3">
          <CompactList title="Recent Sessions" items={sessions} empty="No sessions returned yet." />
          <CompactList title="Running Agent Tasks" items={processes} empty="No running processes returned." />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <CompactList title="Memory Summary" items={memoryItems} empty="No memory items returned." />
        <CompactList title="Cron / Scheduled Jobs" items={scheduledJobs} empty="No scheduled jobs returned." />
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Agent Graph</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/[0.06] p-3">
              <p className="text-xs text-mist">Nodes</p>
              <p className="mt-1 text-2xl font-semibold text-white">{graphNodes.length}</p>
            </div>
            <div className="rounded-xl bg-white/[0.06] p-3">
              <p className="text-xs text-mist">Edges</p>
              <p className="mt-1 text-2xl font-semibold text-white">{graphEdges.length}</p>
            </div>
          </div>
          <p className="mt-3 line-clamp-4 text-xs leading-5 text-mist">{formatUnknown(data?.graph)}</p>
        </div>
      </div>
    </GlassPanel>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof FileText;
  label: string;
  value: string | number;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <Icon className={`mb-3 h-4 w-4 ${tone}`} />
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs leading-5 text-mist">{label}</p>
    </div>
  );
}

function HermesMissionControl({ data }: { data: HermesAgentPanelState | null }) {
  const [tab, setTab] = useState<"overview" | "agents" | "tasks" | "schedule" | "content">("overview");
  const overview = asRecord(data?.overview);
  const activity = normalizeList(data?.overview, ["activity", "activities", "feed"]);
  const tasks = getNestedList(overview, ["board", "tasks"]);
  const cronJobs = getNestedList(overview, ["cron", "jobs"]).length
    ? getNestedList(overview, ["cron", "jobs"])
    : normalizeList(data?.overview, ["crons", "jobs", "schedules"]);
  const contentItems = normalizeList(data?.memory, ["content", "documents", "notes", "items"]);
  const sessionItems = normalizeList(data?.sessions, ["sessions", "items"]);
  const gateway = asRecord(overview.gateway);
  const vps = asRecord(overview.vps);
  const stats = asRecord(overview.stats);
  const specialistAgents = [
    { id: "orchestrator", name: "Orchestrator", code: "ORC", role: "Coordinates the team", icon: Orbit, tone: "text-amber-200" },
    { id: "scout", name: "Scout", code: "SCT", role: "Research and briefs", icon: BrainCircuit, tone: "text-aurora" },
    { id: "scribe", name: "Scribe", code: "SCR", role: "Writing and documents", icon: FileText, tone: "text-pink-200" },
    { id: "reach", name: "Reach", code: "RCH", role: "Marketing and distribution", icon: MonitorUp, tone: "text-emerald-300" },
    { id: "dev", name: "Dev", code: "DEV", role: "Code and infrastructure", icon: Code2, tone: "text-violet-200" },
  ];

  return (
    <div className="mb-4 rounded-[24px] border border-white/10 bg-black/20 p-3 sm:p-4">
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">Hermes Mission Control</p>
          <p className="mt-1 text-sm text-slate-300">Five specialist agents, one visible operating workflow.</p>
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-black/20 p-1.5">
          {(["overview", "agents", "tasks", "schedule", "content"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`h-9 shrink-0 rounded-xl px-3 text-xs font-semibold capitalize transition ${
                tab === item ? "bg-white text-void" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" ? (
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-mist">Operational Directive</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Specialists execute. Orchestrator coordinates.</h3>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                {getStringValue(gateway, ["state", "status"]) || "waiting"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <SmallStat label="Tasks" value={getNumberValue(stats, ["total"]) || tasks.length} />
              <SmallStat label="Completed" value={getNumberValue(stats, ["completed"])} />
              <SmallStat label="Sessions" value={sessionItems.length} />
              <SmallStat label="Activity" value={activity.length} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <HealthBar label="CPU" value={getNumberValue(vps, ["cpu_pct"])} tone="bg-sky-300" />
              <HealthBar label="RAM" value={getNumberValue(vps, ["mem_pct"])} tone="bg-violet-300" />
              <HealthBar label="Disk" value={getNumberValue(vps, ["disk_pct"])} tone="bg-emerald-300" />
            </div>
          </div>
          <ActivityList activity={activity} />
        </div>
      ) : null}

      {tab === "agents" ? (
        <div>
          <div className="mb-4 grid gap-2 md:grid-cols-5">
            {specialistAgents.map((agent, index) => (
              <div key={agent.id} className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between gap-2">
                  <agent.icon className={`h-5 w-5 ${agent.tone}`} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-mist">{agent.code}</span>
                </div>
                <p className="mt-4 text-sm font-semibold text-white">{agent.name}</p>
                <p className="mt-1 text-xs leading-5 text-mist">{agent.role}</p>
                <p className="mt-3 text-[11px] text-lime-200">Shared memory enabled</p>
                {index < specialistAgents.length - 1 ? (
                  <ChevronRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-slate-500 md:block" />
                ) : null}
              </div>
            ))}
          </div>
          <ActivityList activity={activity} />
        </div>
      ) : null}

      {tab === "tasks" ? <OperatorTaskBoard tasks={tasks} /> : null}
      {tab === "schedule" ? <OperatorSchedule jobs={cronJobs} /> : null}
      {tab === "content" ? <OperatorContent items={contentItems} activity={activity} /> : null}
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="text-xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-mist">{label}</p>
    </div>
  );
}

function HealthBar({ label, value, tone }: { label: string; value: number; tone: string }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-mist">{label}</span>
        <span className="text-white">{safeValue.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

function ActivityList({ activity }: { activity: unknown[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white">Live Agent Activity</h3>
        <span className="text-xs text-mist">{activity.length} entries</span>
      </div>
      <div className="max-h-64 space-y-2 overflow-auto">
        {activity.slice(0, 8).map((item, index) => {
          const record = asRecord(item);
          return (
            <div key={index} className="grid gap-1 rounded-xl border border-white/5 bg-black/20 p-3 sm:grid-cols-[90px_minmax(0,1fr)_auto] sm:items-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-aurora">
                {getStringValue(record, ["agent_name", "agent", "name"]) || "agent"}
              </span>
              <span className="truncate text-xs text-slate-300">
                {getStringValue(record, ["task_description", "description", "title", "message"]) || formatUnknown(item)}
              </span>
              <span className="text-[11px] text-mist">
                {getStringValue(record, ["model_used", "model", "status"]) || "complete"}
              </span>
            </div>
          );
        })}
        {!activity.length ? <p className="text-xs leading-5 text-mist">No activity returned by Hermes yet.</p> : null}
      </div>
    </div>
  );
}

function OperatorTaskBoard({ tasks }: { tasks: unknown[] }) {
  const columns = [
    { id: "pending", label: "Pending", tone: "text-amber-200" },
    { id: "in_progress", label: "In Progress", tone: "text-aurora" },
    { id: "done", label: "Done", tone: "text-emerald-300" },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => normalizeTaskStatus(getStringValue(asRecord(task), ["status", "state"])) === column.id);
        return (
          <div key={column.id} className="min-h-64 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${column.tone}`}>{column.label}</p>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-mist">{columnTasks.length}</span>
            </div>
            <div className="space-y-2">
              {columnTasks.slice(0, 8).map((task, index) => {
                const record = asRecord(task);
                return (
                  <div key={index} className="rounded-xl border border-white/5 bg-black/20 p-3">
                    <p className="text-sm font-semibold text-white">{getStringValue(record, ["title", "name"]) || "Untitled task"}</p>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-mist">
                      {getStringValue(record, ["notes", "description", "detail"]) || "No task notes."}
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                      {getStringValue(record, ["priority"]) || "medium"}
                    </p>
                  </div>
                );
              })}
              {!columnTasks.length ? <p className="text-xs text-slate-500">No tasks.</p> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OperatorSchedule({ jobs }: { jobs: unknown[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {jobs.slice(0, 12).map((job, index) => {
        const record = asRecord(job);
        return (
          <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-200">
              {getStringValue(record, ["english", "schedule", "next_run_at"]) || "Scheduled"}
            </p>
            <p className="mt-3 text-sm font-semibold text-white">{getStringValue(record, ["name", "label"]) || "Hermes job"}</p>
            <p className="mt-2 line-clamp-3 text-xs leading-5 text-mist">
              {getStringValue(record, ["detail", "command", "description"]) || formatUnknown(job)}
            </p>
          </div>
        );
      })}
      {!jobs.length ? <p className="text-xs leading-5 text-mist">No cron jobs returned by Hermes yet.</p> : null}
    </div>
  );
}

function OperatorContent({ items, activity }: { items: unknown[]; activity: unknown[] }) {
  const content = items.length
    ? items
    : activity.filter((item) => {
        const record = asRecord(item);
        const agent = getStringValue(record, ["agent_name", "agent"]);
        return agent === "scribe" || agent === "reach";
      });

  return (
    <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-mist">Content Library</p>
        <div className="space-y-2">
          {content.slice(0, 8).map((item, index) => {
            const record = asRecord(item);
            return (
              <div key={index} className="rounded-xl bg-black/20 p-3">
                <p className="text-xs font-semibold text-white">
                  {getStringValue(record, ["title", "name", "task_description"]) || `Document ${index + 1}`}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-aurora">
                  {getStringValue(record, ["agent", "agent_name", "source"]) || "Hermes"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mist">Pipeline</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {[
            ["Scout", "Research"],
            ["Scribe", "Draft"],
            ["Reach", "Distribute"],
            ["Orchestrator", "Review"],
          ].map(([agent, action], index) => (
            <div key={agent} className="relative rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-sm font-semibold text-white">{agent}</p>
              <p className="mt-1 text-xs text-mist">{action}</p>
              {index < 3 ? <ChevronRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-500 sm:block" /> : null}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Research moves to writing, writing moves to distribution, and the orchestrator records the final result in shared memory.
        </p>
      </div>
    </div>
  );
}

function CompactList({ title, items, empty }: { title: string; items: unknown[]; empty: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <h3 className="mb-3 text-sm font-semibold text-white">{title}</h3>
      <div className="space-y-2">
        {items.slice(0, 5).map((item, index) => (
          <div key={index} className="rounded-xl bg-white/[0.06] p-3">
            <p className="line-clamp-2 text-xs leading-5 text-slate-300">{formatUnknown(item)}</p>
          </div>
        ))}
        {!items.length ? <p className="text-xs leading-5 text-mist">{empty}</p> : null}
      </div>
    </div>
  );
}

function AgentNetworkPanel({
  agents,
  selectedAgentId,
  onSelectAgent,
  panelRef,
}: {
  agents: AgentDefinition[];
  selectedAgentId: string;
  onSelectAgent: (agentId: string) => void;
  panelRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <motion.div ref={panelRef} {...panelMotion} transition={{ ...panelMotion.transition, delay: 0.04 }}>
      <GlassPanel className="p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Agents</h2>
            <p className="mt-1 text-sm text-mist">Claude, OpenClaw, Hermes, Gemini, Antigravity, Codex, and Free Claude Code share the same memory vault.</p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            {agents.length || 0} registered
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {agents.map((agent) => {
            const Icon = iconForAgent(agent);
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => onSelectAgent(agent.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selectedAgentId === agent.id
                    ? "border-white/50 bg-white text-void shadow-cyan"
                    : "border-white/10 bg-black/20 hover:bg-white/10"
                }`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${selectedAgentId === agent.id ? "bg-black/10" : "bg-white/10"}`}>
                      <Icon className={`h-4 w-4 ${selectedAgentId === agent.id ? "text-void" : "text-aurora"}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className={`truncate text-sm font-semibold ${selectedAgentId === agent.id ? "text-void" : "text-white"}`}>{agent.name}</h3>
                      <p className={`truncate text-xs ${selectedAgentId === agent.id ? "text-slate-700" : "text-mist"}`}>{agent.role}</p>
                    </div>
                  </div>
                  <StatusPill status={agent.status} />
                </div>
                <p className={`min-h-12 text-sm leading-6 ${selectedAgentId === agent.id ? "text-slate-800" : "text-slate-300"}`}>{agent.description}</p>
                <div className={`mt-3 flex items-center gap-2 text-xs ${selectedAgentId === agent.id ? "text-slate-700" : "text-lime-200"}`}>
                  <Database className="h-3.5 w-3.5" />
                  {agent.memoryAccess ? "Shared memory enabled" : "No memory access"}
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/10 pt-3">
                  {agent.tools.slice(0, 4).map((tool) => (
                    <span key={tool} className={`rounded-full px-2 py-1 text-[11px] ${selectedAgentId === agent.id ? "bg-black/10 text-slate-700" : "bg-white/[0.07] text-slate-300"}`}>
                      {tool}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </GlassPanel>
    </motion.div>
  );
}

function StudioPanel({
  panelRef,
  selectedAgentId,
  artifacts,
  onCreated,
}: {
  panelRef: RefObject<HTMLDivElement | null>;
  selectedAgentId: string;
  artifacts: Artifact[];
  onCreated: () => Promise<void>;
}) {
  const [mode, setMode] = useState<"image" | "video" | "voice">("image");
  const [prompt, setPrompt] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const modeArtifacts = artifacts.filter((artifact) => artifact.type === mode);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!prompt.trim() || isSaving) {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/artifacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: mode,
          title: `${mode} request`,
          summary: prompt,
          agentId: selectedAgentId,
          body: `# ${mode} request\n\nAgent: ${selectedAgentId}\n\n${prompt}\n`,
          tags: [mode, selectedAgentId, "studio"],
        }),
      });

      if (!response.ok) {
        throw new Error("Could not save studio request.");
      }

      setPrompt("");
      setMessage("Studio request saved to workspace and memory. Connect the provider next to generate media.");
      await onCreated();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save studio request.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <motion.div ref={panelRef} {...panelMotion} transition={{ ...panelMotion.transition, delay: 0.06 }}>
      <GlassPanel className="p-4 sm:p-5">
        <div className="mb-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-mist">Self Studio</p>
          <h2 className="text-3xl font-semibold text-white sm:text-5xl">Studio</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-mist">
            Generate images, videos, and speech with the selected agent. Requests are saved to the shared vault now; generation providers can attach to the same form.
          </p>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            { id: "image", label: "Images", icon: Image },
            { id: "video", label: "Videos", icon: Video },
            { id: "voice", label: "Speech", icon: Mic2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const selected = mode === tab.id;
            const count = artifacts.filter((artifact) => artifact.type === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMode(tab.id as "image" | "video" | "voice")}
                className={`inline-flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm transition ${
                  selected ? "border-pink-300/50 bg-pink-400/15 text-pink-100" : "border-white/10 bg-black/20 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{count}</span>
              </button>
            );
          })}
        </div>
        <form className="rounded-2xl border border-white/10 bg-black/20 p-4" onSubmit={handleSubmit}>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-200" />
            <p className="text-sm font-semibold text-white">Generate {mode}</p>
          </div>
          <div className="grid gap-3 lg:grid-cols-[56px_minmax(0,1fr)_140px]">
            <div className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
              <Mic2 className="h-5 w-5 text-mist" />
            </div>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="min-h-24 resize-none rounded-2xl border border-white/12 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500"
              placeholder="A glowing futuristic dashboard floating in deep space, neon accents, cinematic lighting..."
              maxLength={900}
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isSaving}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-pink-300/20 px-4 text-sm font-semibold text-pink-100 transition hover:bg-pink-300/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Zap className="h-4 w-4" />
              Save
            </button>
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-mist">
            {mode}_gen via {selectedAgentId} - saved to workspace and memory vault
          </p>
        </form>
        {message ? <p className="mt-3 text-xs leading-5 text-mist">{message}</p> : null}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {modeArtifacts.slice(0, 4).map((artifact) => (
            <article key={artifact.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-semibold text-white">{artifact.title}</p>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-mist">{artifact.summary}</p>
              <button className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-pink-100" type="button">
                <ArrowUpRight className="h-3.5 w-3.5" />
                Saved
              </button>
            </article>
          ))}
        </div>
      </GlassPanel>
    </motion.div>
  );
}

function ChatPanel({
  agents,
  selectedAgentId,
  onSelectAgent,
  inputRef,
  panelRef,
  onActivity,
}: {
  agents: AgentDefinition[];
  selectedAgentId: string;
  onSelectAgent: (agentId: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  onActivity: () => Promise<void>;
}) {
  const defaultAgent = agents.find((agent) => agent.id === "hermes") || agents[0];
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "cortana-ready",
      speaker: "Cortana",
      target: "Hermes",
      text: "Pick an agent. Every successful exchange is saved as a chat artifact and memory note.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId) || defaultAgent;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages, isSending]);

  useEffect(() => {
    if (!selectedAgent && agents[0]) {
      onSelectAgent(agents[0].id);
    }
  }, [agents, selectedAgent, onSelectAgent]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = draft.trim();

    if (!text || isSending || !selectedAgent) {
      return;
    }

    const now = Date.now();
    const routedText = selectedAgent.id === "hermes" ? text : `[Route to ${selectedAgent.name}] ${text}`;

    setChatMessages((current) => [
      ...current,
      { id: `louis-${now}`, speaker: "Louis", target: selectedAgent.name, text },
    ]);
    setDraft("");
    setIsSending(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: routedText,
          targetAgent: selectedAgent.id,
        }),
      });

      const data = (await response.json().catch(() => null)) as { reply?: string } | null;
      const reply = data?.reply?.trim() || "Agent returned an empty response.";

      if (!response.ok) {
        throw new Error(reply);
      }

      setChatMessages((current) => [
        ...current,
        {
          id: `cortana-${now}`,
          speaker: "Cortana",
          target: selectedAgent.name,
          text: reply,
        },
      ]);
      await onActivity();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "I could not reach the secure chat route. Check the dashboard server and try again.";

      setErrorMessage(message);
      setChatMessages((current) => [
        ...current,
        {
          id: `cortana-${now}`,
          speaker: "Cortana",
          target: selectedAgent.name,
          text: `Request failed: ${message}`,
        },
      ]);
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  return (
    <motion.div
      ref={panelRef}
      {...panelMotion}
      transition={{ ...panelMotion.transition, delay: 0.08 }}
    >
      <GlassPanel className="p-4 sm:p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Command Chat</h2>
            <p className="text-sm text-mist">Target an agent. Successful replies write back into workspace and memory.</p>
          </div>
          <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
            {isSending ? "Thinking" : "Ready"}
          </div>
        </div>
        <div className="mb-4 grid gap-2 sm:grid-cols-2">
          {agents.map((agent) => {
            const Icon = iconForAgent(agent);
            const selected = agent.id === selectedAgent?.id;
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => onSelectAgent(agent.id)}
                className={`flex h-11 items-center gap-2 rounded-2xl border px-3 text-left text-xs transition ${
                  selected
                    ? "border-white/60 bg-white text-void"
                    : "border-white/10 bg-black/20 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate">{agent.name}</span>
              </button>
            );
          })}
        </div>
        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {chatMessages.map((message) => {
            const isUser = message.speaker === "Louis";
            return (
              <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-[22px] px-4 py-3 text-sm leading-6 ${
                    isUser
                      ? "bg-white text-void"
                      : "border border-white/10 bg-black/25 text-slate-100"
                  }`}
                >
                  <p className={`mb-1 text-xs font-semibold ${isUser ? "text-slate-700" : "text-aurora"}`}>
                    {message.speaker}
                    {message.target ? <span className="font-normal"> / {message.target}</span> : null}
                  </p>
                  {message.text}
                </div>
              </div>
            );
          })}
          {isSending && selectedAgent ? (
            <div className="flex justify-start">
              <div className="max-w-[88%] rounded-[22px] border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-slate-100">
                <p className="mb-1 text-xs font-semibold text-aurora">Cortana / {selectedAgent.name}</p>
                <span className="inline-flex items-center gap-1.5 text-mist">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aurora" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aurora [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aurora [animation-delay:240ms]" />
                </span>
              </div>
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>
        {errorMessage ? (
          <p className="mt-3 rounded-2xl border border-red-300/20 bg-red-400/10 px-3 py-2 text-xs leading-5 text-red-100">
            {errorMessage}
          </p>
        ) : null}
        <form className="mt-5 flex gap-2" onSubmit={handleSubmit}>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-white/12 bg-black/25 px-3">
            <Command className="h-4 w-4 shrink-0 text-aurora" />
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={2000}
              className="h-12 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              placeholder={`Command ${selectedAgent?.name || "Cortana"}...`}
              disabled={isSending}
            />
          </div>
          <button
            type="submit"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-void shadow-cyan transition hover:bg-aurora disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send command"
            disabled={!draft.trim() || isSending || !selectedAgent}
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </form>
      </GlassPanel>
    </motion.div>
  );
}

function MissionComposer({
  agents,
  onCreated,
}: {
  agents: AgentDefinition[];
  onCreated: () => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [agentId, setAgentId] = useState("cortana");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedGoal = goal.trim();

    if (!trimmedTitle || !trimmedGoal || isSaving) {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmedTitle, goal: trimmedGoal, assignedAgentId: agentId, priority: "high" }),
      });

      if (!response.ok) {
        throw new Error("Could not create mission.");
      }

      setTitle("");
      setGoal("");
      setMessage("Mission created and written to memory.");
      await onCreated();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create mission.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <motion.div {...panelMotion} transition={{ ...panelMotion.transition, delay: 0.14 }}>
      <GlassPanel className="p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200/20 bg-amber-200/10">
            <KanbanSquare className="h-5 w-5 text-amber-200" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Create Mission</h2>
            <p className="text-sm text-mist">Queue a goal, assign an agent, and save it into the OS.</p>
          </div>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-11 w-full rounded-2xl border border-white/12 bg-black/25 px-3 text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="Mission title"
            maxLength={90}
          />
          <textarea
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            className="min-h-24 w-full resize-none rounded-2xl border border-white/12 bg-black/25 px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500"
            placeholder="What should this agent accomplish?"
            maxLength={600}
          />
          <select
            value={agentId}
            onChange={(event) => setAgentId(event.target.value)}
            className="h-11 w-full rounded-2xl border border-white/12 bg-black/80 px-3 text-sm text-white outline-none"
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} - {agent.role}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!title.trim() || !goal.trim() || isSaving}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-void shadow-cyan transition hover:bg-aurora disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {isSaving ? "Creating..." : "Create Mission"}
          </button>
        </form>
        {message ? <p className="mt-3 text-xs leading-5 text-mist">{message}</p> : null}
      </GlassPanel>
    </motion.div>
  );
}

function WorkspacePanel({
  artifacts,
  workspaceRoot,
  onCreated,
}: {
  artifacts: Artifact[];
  workspaceRoot: string;
  onCreated: () => Promise<void>;
}) {
  const grouped = useMemo(() => {
    return artifacts.reduce<Record<ArtifactType, Artifact[]>>(
      (current, artifact) => {
        current[artifact.type].push(artifact);
        return current;
      },
      {
        app: [],
        image: [],
        video: [],
        voice: [],
        research: [],
        chat: [],
        mission: [],
        note: [],
      },
    );
  }, [artifacts]);
  const [artifactTitle, setArtifactTitle] = useState("");
  const [artifactSummary, setArtifactSummary] = useState("");
  const [artifactType, setArtifactType] = useState<ArtifactType>("note");
  const [isSavingArtifact, setIsSavingArtifact] = useState(false);
  const [artifactMessage, setArtifactMessage] = useState<string | null>(null);

  async function handleArtifactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!artifactTitle.trim() || !artifactSummary.trim() || isSavingArtifact) {
      return;
    }

    setIsSavingArtifact(true);
    setArtifactMessage(null);

    try {
      const response = await fetch("/api/artifacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: artifactType,
          title: artifactTitle,
          summary: artifactSummary,
          agentId: "cortana",
          body: `# ${artifactTitle}\n\n${artifactSummary}\n`,
          tags: [artifactType, "manual-capture"],
        }),
      });

      if (!response.ok) {
        throw new Error("Could not save artifact.");
      }

      setArtifactTitle("");
      setArtifactSummary("");
      setArtifactMessage("Artifact saved to workspace and memory.");
      await onCreated();
    } catch (error) {
      setArtifactMessage(error instanceof Error ? error.message : "Could not save artifact.");
    } finally {
      setIsSavingArtifact(false);
    }
  }

  return (
    <GlassPanel className="p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Typed Workspace</h2>
          <p className="mt-1 text-sm text-mist">Every output gets a home: apps, media, voice, research, chats, missions, notes.</p>
        </div>
        <p className="max-w-lg truncate rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-mist">
          {workspaceRoot}
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
        {(Object.keys(grouped) as ArtifactType[]).map((type) => {
          const Icon = bucketIcons[type];
          const latest = grouped[type][0];
          return (
            <article key={type} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-4 w-4 text-aurora" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{bucketLabels[type]}</h3>
                    <p className="text-xs text-mist">{grouped[type].length} saved</p>
                  </div>
                </div>
              </div>
              {latest ? (
                <div>
                  <p className="truncate text-sm font-semibold text-white">{latest.title}</p>
                  <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-mist">{latest.summary}</p>
                  <p className="mt-3 truncate text-[11px] text-slate-500">{latest.path}</p>
                </div>
              ) : (
                <p className="text-sm leading-6 text-mist">Ready for the first {bucketLabels[type].toLowerCase()} output.</p>
              )}
            </article>
          );
        })}
      </div>
      <form
        className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 lg:grid-cols-[160px_minmax(0,1fr)_minmax(0,1.4fr)_auto]"
        onSubmit={handleArtifactSubmit}
      >
        <select
          value={artifactType}
          onChange={(event) => setArtifactType(event.target.value as ArtifactType)}
          className="h-11 rounded-2xl border border-white/12 bg-black/80 px-3 text-sm text-white outline-none"
        >
          {(Object.keys(bucketLabels) as ArtifactType[]).map((type) => (
            <option key={type} value={type}>
              {bucketLabels[type]}
            </option>
          ))}
        </select>
        <input
          value={artifactTitle}
          onChange={(event) => setArtifactTitle(event.target.value)}
          className="h-11 min-w-0 rounded-2xl border border-white/12 bg-black/25 px-3 text-sm text-white outline-none placeholder:text-slate-500"
          placeholder="Artifact title"
          maxLength={100}
        />
        <input
          value={artifactSummary}
          onChange={(event) => setArtifactSummary(event.target.value)}
          className="h-11 min-w-0 rounded-2xl border border-white/12 bg-black/25 px-3 text-sm text-white outline-none placeholder:text-slate-500"
          placeholder="What should be saved?"
          maxLength={260}
        />
        <button
          type="submit"
          disabled={!artifactTitle.trim() || !artifactSummary.trim() || isSavingArtifact}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-void shadow-cyan transition hover:bg-aurora disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Save
        </button>
      </form>
      {artifactMessage ? <p className="mt-3 text-xs leading-5 text-mist">{artifactMessage}</p> : null}
    </GlassPanel>
  );
}

function MissionBoard({
  missions,
  agents,
}: {
  missions: Mission[];
  agents: AgentDefinition[];
}) {
  const lanes: Array<{ id: MissionStatus; label: string }> = [
    { id: "capture", label: "Capture" },
    { id: "build", label: "Build" },
    { id: "monitor", label: "Monitor" },
    { id: "done", label: "Done" },
  ];

  function agentName(agentId: string) {
    return agents.find((agent) => agent.id === agentId)?.name || agentId;
  }

  return (
    <GlassPanel className="p-5">
      <div className="mb-4 flex items-center gap-3">
        <KanbanSquare className="h-5 w-5 text-amber-200" />
        <div>
          <h2 className="text-lg font-semibold text-white">Mission Board</h2>
          <p className="text-sm text-mist">Kanban-style agent goals with logs and memory writeback.</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {lanes.map((lane) => {
          const laneMissions = missions.filter((mission) => mission.status === lane.id);
          return (
            <div key={lane.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{lane.label}</p>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-mist">{laneMissions.length}</span>
              </div>
              <div className="space-y-2">
                {laneMissions.slice(0, 4).map((mission) => (
                  <article key={mission.id} className="rounded-xl bg-white/[0.06] p-3">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-white">{mission.title}</h3>
                      <span className="rounded-full bg-black/25 px-2 py-0.5 text-[11px] text-amber-100">
                        {mission.priority}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-xs leading-5 text-mist">{mission.goal}</p>
                    <p className="mt-2 text-[11px] text-slate-400">{agentName(mission.assignedAgentId)}</p>
                  </article>
                ))}
                {!laneMissions.length ? <p className="text-xs text-slate-500">No missions in this lane.</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

function MemoryPanel({
  memory,
  memoryVaultPath,
}: {
  memory: MemoryNote[];
  memoryVaultPath: string;
}) {
  return (
    <GlassPanel className="p-5">
      <div className="mb-4 flex items-center gap-3">
        <Database className="h-5 w-5 text-lime-200" />
        <div>
          <h2 className="text-lg font-semibold text-white">Memory Vault</h2>
          <p className="text-sm text-mist">Markdown notes for brand, decisions, projects, journals, and agent outputs.</p>
        </div>
      </div>
      <p className="mb-4 truncate rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-mist">
        {memoryVaultPath}
      </p>
      <div className="space-y-3">
        {memory.slice(0, 8).map((item) => (
          <article key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="truncate text-sm font-semibold text-white">{item.title}</p>
              <span className="rounded-full bg-lime-200/10 px-2 py-0.5 text-[11px] text-lime-100">
                {item.category}
              </span>
            </div>
            <p className="line-clamp-2 text-xs leading-5 text-mist">{item.content.replace(/^# .*\n*/, "")}</p>
          </article>
        ))}
      </div>
    </GlassPanel>
  );
}

function RightRail({ state }: { state: OperatingSystemState }) {
  const statusItems = [
    { label: "Agent Status", value: `${state.agents.length} registered`, icon: Bot, tone: "text-emerald-300" },
    { label: "Active Model", value: "Hermes bridge", icon: Code2, tone: "text-aurora" },
    { label: "Memory Status", value: `${state.memory.length} notes`, icon: BrainCircuit, tone: "text-lime-200" },
    { label: "Workspace", value: `${state.artifacts.length} artifacts`, icon: GalleryHorizontalEnd, tone: "text-plasma" },
    { label: "Automations", value: `${state.automations.length} workflows`, icon: Workflow, tone: "text-amber-200" },
    { label: "Feedback Loop", value: "Writeback active", icon: CheckCircle2, tone: "text-slate-200" },
  ];

  return (
    <aside className="space-y-4 lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:overflow-auto">
      <GlassPanel className="p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">OS Status</h2>
        <div className="space-y-3">
          {statusItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/25">
                  <Icon className={`h-4 w-4 ${item.tone}`} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs text-mist">{item.label}</p>
                  <p className="truncate text-sm font-semibold text-white">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassPanel>
      <GlassPanel className="p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">Automations</h2>
        <div className="space-y-4">
          {state.automations.map((workflow) => (
            <div key={workflow.id}>
              <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-white">{workflow.name}</span>
                <span className="text-mist">{workflow.state}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-300 via-amber-200 to-aurora"
                  style={{ width: `${workflow.progress}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{workflow.trigger}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
      <GlassPanel className="p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
        <div className="grid gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const content = (
              <>
                <Icon className="h-4 w-4 text-aurora" />
                <span className="min-w-0 flex-1 truncate text-left">{action.label}</span>
                {action.href ? <ArrowUpRight className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
              </>
            );

            if (action.href) {
              return (
                <a
                  key={action.label}
                  href={action.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  {content}
                </a>
              );
            }

            return (
              <button
                key={action.label}
                type="button"
                className="flex h-11 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                {content}
              </button>
            );
          })}
        </div>
      </GlassPanel>
    </aside>
  );
}

function StatusPill({ status }: { status: AgentDefinition["status"] }) {
  const className =
    status === "online"
      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
      : status === "ready"
        ? "border-aurora/20 bg-aurora/10 text-sky-100"
        : status === "planned"
          ? "border-amber-200/20 bg-amber-200/10 text-amber-100"
          : "border-red-300/20 bg-red-400/10 text-red-100";

  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${className}`}>
      {status}
    </span>
  );
}

function iconForAgent(agent: AgentDefinition) {
  if (agent.id === "hermes") return Code2;
  if (agent.id === "codex") return Code2;
  if (agent.id === "obsidian") return Database;
  if (agent.layer === "automation") return Workflow;
  if (agent.layer === "voice") return Mic2;
  if (agent.layer === "mobile") return MessageSquareText;
  if (agent.layer === "memory") return BrainCircuit;
  if (agent.layer === "execution") return Zap;
  if (agent.layer === "model") return BrainCircuit;
  return Orbit;
}

function normalizeList(value: unknown, keys: string[]) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    for (const key of keys) {
      if (Array.isArray(record[key])) {
        return record[key] as unknown[];
      }
    }
  }

  return [];
}

function getStringValue(value: unknown, keys: string[]) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  for (const key of keys) {
    const current = record[key];

    if (typeof current === "string" || typeof current === "number" || typeof current === "boolean") {
      return String(current);
    }
  }

  return null;
}

function getNumberValue(value: unknown, keys: string[]) {
  if (!value || typeof value !== "object") {
    return 0;
  }

  const record = value as Record<string, unknown>;

  for (const key of keys) {
    const current = record[key];

    if (typeof current === "number" && Number.isFinite(current)) {
      return current;
    }

    if (typeof current === "string") {
      const parsed = Number(current);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return 0;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getNestedList(record: Record<string, unknown>, path: string[]) {
  let current: unknown = record;

  for (const segment of path) {
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      return [];
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return Array.isArray(current) ? current : [];
}

function normalizeTaskStatus(status: string | null) {
  const value = (status || "pending").toLowerCase().replace(/[\s-]+/g, "_");

  if (value === "done" || value === "completed" || value === "complete") {
    return "done";
  }

  if (value === "in_progress" || value === "running" || value === "active" || value === "build") {
    return "in_progress";
  }

  return "pending";
}

function formatUnknown(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => formatUnknown(item)).join(", ");
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const preferred = ["title", "name", "id", "status", "state", "summary", "message"]
      .map((key) => record[key])
      .filter(Boolean)
      .map((item) => formatUnknown(item));

    if (preferred.length) {
      return preferred.join(" - ");
    }

    return JSON.stringify(value);
  }

  return String(value);
}
