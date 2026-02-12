import { Agent } from "./types";

export interface TopAgent {
  id: string;
  name: string;
  avatar: string;
  category: Agent["category"];
  memecoinBalance: number;
  totalRewards: number;
  rank: number;
  status: Agent["status"];
  description: string;
  createdAt: string;
  weeklyChange: number; // percentage
  tasksCompleted: number;
  collaborations: number;
}

export function buildTopAgents(agents: Agent[]): TopAgent[] {
  return [...agents]
    .sort((a, b) => b.memecoinBalance - a.memecoinBalance)
    .slice(0, 20)
    .map((a, i) => ({
      id: a.id,
      name: a.name,
      avatar: a.avatar,
      category: a.category,
      memecoinBalance: a.memecoinBalance,
      totalRewards: a.totalRewards,
      rank: i + 1,
      status: a.status,
      description: a.description,
      createdAt: a.createdAt,
      weeklyChange: Math.round((Math.random() * 40 - 10) * 10) / 10,
      tasksCompleted: Math.floor(Math.random() * 500) + 20,
      collaborations: Math.floor(Math.random() * 150) + 5,
    }));
}
