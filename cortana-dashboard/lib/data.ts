import {
  Activity,
  Bot,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  Cpu,
  Database,
  GitBranch,
  GalleryHorizontalEnd,
  KanbanSquare,
  MessageSquareText,
  Mic2,
  Orbit,
  RadioTower,
  Settings,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Workflow,
  Zap,
} from "lucide-react";

export const navigation = [
  { label: "Dashboard", icon: Orbit },
  { label: "Agents", icon: Bot },
  { label: "Studio", icon: GalleryHorizontalEnd },
  { label: "Chat", icon: MessageSquareText },
  { label: "Voice", icon: Mic2 },
  { label: "Tasks", icon: KanbanSquare },
  { label: "Memory", icon: BrainCircuit },
  { label: "Automations", icon: Workflow },
  { label: "Settings", icon: Settings },
];

export const quickActions = [
  { label: "Plan My Day", icon: CalendarDays },
  { label: "Create Content Ideas", icon: WandSparkles },
  { label: "Research Topic", icon: Sparkles },
  { label: "Open Telegram", icon: MessageSquareText, href: process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL },
  { label: "Open n8n", icon: Workflow, href: process.env.NEXT_PUBLIC_N8N_URL },
  { label: "Generate Voice Message", icon: Mic2 },
];

export const statusItems = [
  { label: "Agent Status", value: "Standby", icon: Activity, tone: "text-emerald-300" },
  { label: "Active Model", value: "Hermes bridge", icon: Cpu, tone: "text-aurora" },
  { label: "Voice Provider", value: "ElevenLabs ready", icon: RadioTower, tone: "text-plasma" },
  { label: "Memory Status", value: "Local placeholder", icon: BrainCircuit, tone: "text-violet-200" },
  { label: "API Cost", value: "EUR 0.00 today", icon: Bot, tone: "text-slate-200" },
  { label: "VPS Status", value: "Awaiting monitor", icon: Activity, tone: "text-amber-200" },
];

export const agentNetwork = [
  {
    id: "cortana",
    name: "Cortana",
    role: "Command router",
    status: "Online",
    description: "Directs requests to the right agent and keeps the dashboard conversation focused.",
    icon: Orbit,
    accent: "text-aurora",
    border: "border-aurora/30",
    metric: "1 active route",
  },
  {
    id: "hermes",
    name: "Hermes",
    role: "Local reasoning runtime",
    status: "Connected",
    description: "Runs the secure chat bridge behind the dashboard API.",
    icon: Cpu,
    accent: "text-emerald-300",
    border: "border-emerald-300/30",
    metric: "50s timeout",
  },
  {
    id: "n8n",
    name: "n8n",
    role: "Workflow automation",
    status: "Ready",
    description: "Turns repeatable agent work into controlled automations.",
    icon: Workflow,
    accent: "text-amber-200",
    border: "border-amber-200/30",
    metric: "2 actions linked",
  },
  {
    id: "telegram",
    name: "Telegram",
    role: "Mobile command channel",
    status: "Linked",
    description: "Keeps quick agent commands available away from the dashboard.",
    icon: MessageSquareText,
    accent: "text-sky-300",
    border: "border-sky-300/30",
    metric: "Bot shortcut",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    role: "Voice interface",
    status: "Reserved",
    description: "Voice output and future live speaking mode for Cortana.",
    icon: Mic2,
    accent: "text-fuchsia-200",
    border: "border-fuchsia-200/30",
    metric: "Voice bridge next",
  },
  {
    id: "memory",
    name: "Memory",
    role: "Context layer",
    status: "Planned",
    description: "Stores brand facts, preferences, project state, and decisions.",
    icon: BrainCircuit,
    accent: "text-lime-200",
    border: "border-lime-200/30",
    metric: "Local schema needed",
  },
];

export const commandMetrics = [
  { label: "Connected agents", value: "5", icon: Bot, tone: "text-aurora" },
  { label: "Open missions", value: "7", icon: KanbanSquare, tone: "text-amber-200" },
  { label: "Automations", value: "3", icon: Zap, tone: "text-emerald-300" },
  { label: "Memory sets", value: "4", icon: Database, tone: "text-lime-200" },
];

export const taskLanes = [
  {
    title: "Capture",
    count: 3,
    items: ["Voice bridge spec", "Agent registry schema", "Telegram command map"],
  },
  {
    title: "Build",
    count: 2,
    items: ["Hermes health endpoint", "n8n webhook adapter"],
  },
  {
    title: "Monitor",
    count: 2,
    items: ["VPS uptime", "Daily agent cost"],
  },
];

export const memoryItems = [
  { label: "Brand", value: "Cosmic Lucid voice and offers", icon: Sparkles },
  { label: "Projects", value: "Website, dashboard, automations", icon: GitBranch },
  { label: "Preferences", value: "Private, server-side, controllable", icon: ShieldCheck },
  { label: "Decisions", value: "Hermes first, adapters next", icon: CheckCircle2 },
];

export const automationPipelines = [
  { label: "Morning brief", state: "Draft", progress: 64 },
  { label: "Content research", state: "Ready", progress: 82 },
  { label: "Inbox triage", state: "Needs connector", progress: 38 },
];
