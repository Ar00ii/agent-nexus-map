import { Agent, AgentConnection } from "./types";
import { mockAgents, mockConnections } from "./mockData";

// API service layer - replace base URL with your FastAPI backend
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const USE_MOCK = !import.meta.env.VITE_API_BASE_URL;

export async function fetchAgents(): Promise<Agent[]> {
  if (USE_MOCK) return mockAgents;
  const res = await fetch(`${API_BASE}/api/agents`);
  if (!res.ok) throw new Error("Failed to fetch agents");
  return res.json();
}

export async function fetchConnections(): Promise<AgentConnection[]> {
  if (USE_MOCK) return mockConnections;
  const res = await fetch(`${API_BASE}/api/connections`);
  if (!res.ok) throw new Error("Failed to fetch connections");
  return res.json();
}

export async function fetchAgent(id: string): Promise<Agent | undefined> {
  if (USE_MOCK) return mockAgents.find((a) => a.id === id);
  const res = await fetch(`${API_BASE}/api/agents/${id}`);
  if (!res.ok) throw new Error("Failed to fetch agent");
  return res.json();
}
