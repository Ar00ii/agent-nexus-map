import { AgentCategory, ConnectionType } from "./types";

export function getCategoryColor(category: AgentCategory): string {
  const map: Record<AgentCategory, string> = {
    researcher: "hsl(185, 80%, 55%)",
    creator: "hsl(270, 70%, 60%)",
    trader: "hsl(38, 90%, 55%)",
    validator: "hsl(155, 70%, 50%)",
    explorer: "hsl(320, 70%, 55%)",
  };
  return map[category];
}

export function getBalanceColor(balance: number): string {
  if (balance >= 30000) return "hsl(155, 70%, 50%)";
  if (balance >= 10000) return "hsl(185, 80%, 55%)";
  if (balance >= 3000) return "hsl(38, 90%, 55%)";
  return "hsl(0, 72%, 55%)";
}

export function getBalanceTier(balance: number): string {
  if (balance >= 30000) return "whale";
  if (balance >= 10000) return "holder";
  if (balance >= 3000) return "trader";
  return "newcomer";
}

export function getConnectionColor(type: ConnectionType): string {
  const map: Record<ConnectionType, string> = {
    collaboration: "hsl(185, 80%, 55%)",
    learning: "hsl(270, 70%, 60%)",
    trade: "hsl(38, 90%, 55%)",
    mentorship: "hsl(155, 70%, 50%)",
  };
  return map[type];
}

export function getCategoryLabel(category: AgentCategory): string {
  const map: Record<AgentCategory, string> = {
    researcher: "Investigador",
    creator: "Creador",
    trader: "Trader",
    validator: "Validador",
    explorer: "Explorador",
  };
  return map[category];
}

export function getConnectionLabel(type: ConnectionType): string {
  const map: Record<ConnectionType, string> = {
    collaboration: "Colaboración",
    learning: "Aprendizaje",
    trade: "Intercambio",
    mentorship: "Mentoría",
  };
  return map[type];
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}
