export type HermesAgentProxyResponse<T = unknown> = {
  data: T;
  upstreamUrl: string;
};

export type HermesAgentPanelState = {
  overview: unknown;
  graph: unknown;
  sessions: unknown;
  memory: unknown;
  processes: unknown;
};
