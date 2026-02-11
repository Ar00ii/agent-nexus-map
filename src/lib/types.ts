export interface Agent {
  id: string;
  name: string;
  category: AgentCategory;
  description: string;
  avatar: string;
  memecoinBalance: number;
  memecoinSymbol: string;
  totalRewards: number;
  rank: number;
  status: "active" | "idle" | "offline";
  createdAt: string;
  tokenHistory: TokenTransaction[];
}

export interface TokenTransaction {
  id: string;
  type: "reward" | "transfer" | "stake";
  amount: number;
  timestamp: string;
  description: string;
}

export interface AgentConnection {
  source: string;
  target: string;
  type: ConnectionType;
  strength: number; // 1-10
  lastInteraction: string;
}

export type AgentCategory =
  | "researcher"
  | "creator"
  | "trader"
  | "validator"
  | "explorer";

export type ConnectionType =
  | "collaboration"
  | "learning"
  | "trade"
  | "mentorship";

export interface GraphNode {
  id: string;
  name: string;
  val: number;
  category: AgentCategory;
  balance: number;
  status: Agent["status"];
}

export interface GraphLink {
  source: string;
  target: string;
  type: ConnectionType;
  strength: number;
}
