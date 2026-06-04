export type AgentStatus = "online" | "ready" | "planned" | "offline";

export type AgentDefinition = {
  id: string;
  name: string;
  role: string;
  layer: "command" | "research" | "automation" | "mobile" | "voice" | "memory" | "execution" | "model";
  provider: string;
  endpoint?: string;
  description: string;
  tools: string[];
  memoryAccess: boolean;
  status: AgentStatus;
  lastSeen: string;
};

export type MissionStatus = "capture" | "build" | "monitor" | "done";

export type Mission = {
  id: string;
  title: string;
  goal: string;
  assignedAgentId: string;
  status: MissionStatus;
  priority: "low" | "medium" | "high";
  logs: string[];
  artifactIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type ArtifactType = "app" | "image" | "video" | "voice" | "research" | "chat" | "mission" | "note";

export type Artifact = {
  id: string;
  type: ArtifactType;
  title: string;
  summary: string;
  agentId: string;
  path: string;
  previewUrl?: string;
  tags: string[];
  createdAt: string;
};

export type MemoryNote = {
  id: string;
  title: string;
  category: "brand" | "project" | "preference" | "decision" | "journal" | "agent-output";
  content: string;
  source: string;
  path: string;
  tags: string[];
  createdAt: string;
};

export type AutomationWorkflow = {
  id: string;
  name: string;
  trigger: string;
  agentId: string;
  state: "draft" | "ready" | "running" | "paused";
  progress: number;
  outputBucket: ArtifactType;
};

export type OperatingSystemState = {
  generatedAt: string;
  workspaceRoot: string;
  memoryVaultPath: string;
  agents: AgentDefinition[];
  missions: Mission[];
  artifacts: Artifact[];
  memory: MemoryNote[];
  automations: AutomationWorkflow[];
};
