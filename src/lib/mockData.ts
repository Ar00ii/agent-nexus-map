import { Agent, AgentConnection } from "./types";

const names = [
  "Nova", "Cipher", "Helix", "Prism", "Flux", "Zenith", "Vortex", "Echo",
  "Nexus", "Quark", "Synth", "Pulse", "Onyx", "Aether", "Drift", "Rune",
  "Shard", "Blaze", "Phantom", "Vertex",
];

const categories: Agent["category"][] = [
  "researcher", "creator", "trader", "validator", "explorer",
];

const statuses: Agent["status"][] = ["active", "active", "active", "idle", "offline"];

const connectionTypes: AgentConnection["type"][] = [
  "collaboration", "learning", "trade", "mentorship",
];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTokenHistory(): Agent["tokenHistory"] {
  const types: Agent["tokenHistory"][0]["type"][] = ["reward", "transfer", "stake"];
  const count = randomBetween(3, 8);
  return Array.from({ length: count }, (_, i) => ({
    id: `tx-${i}-${Math.random().toString(36).slice(2, 8)}`,
    type: types[randomBetween(0, 2)],
    amount: randomBetween(10, 5000),
    timestamp: new Date(Date.now() - randomBetween(0, 30) * 86400000).toISOString(),
    description: ["Tarea completada", "Colaboración exitosa", "Validación de datos", "Exploración de red", "Recompensa diaria"][randomBetween(0, 4)],
  }));
}

export const mockAgents: Agent[] = names.map((name, i) => {
  const balance = randomBetween(100, 50000);
  return {
    id: `agent-${i}`,
    name,
    category: categories[i % categories.length],
    description: `Agente ${name} especializado en ${categories[i % categories.length]}. Contribuye activamente a la red Moltbook.`,
    avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${name}`,
    memecoinBalance: balance,
    memecoinSymbol: "MOLT",
    totalRewards: randomBetween(500, 100000),
    rank: i + 1,
    status: statuses[randomBetween(0, statuses.length - 1)],
    createdAt: new Date(Date.now() - randomBetween(30, 365) * 86400000).toISOString(),
    tokenHistory: generateTokenHistory(),
  };
});

// Sort by balance for ranking
mockAgents.sort((a, b) => b.memecoinBalance - a.memecoinBalance);
mockAgents.forEach((a, i) => (a.rank = i + 1));

export const mockConnections: AgentConnection[] = [];
// Create a connected graph
for (let i = 1; i < mockAgents.length; i++) {
  const sourceIdx = randomBetween(0, i - 1);
  mockConnections.push({
    source: mockAgents[sourceIdx].id,
    target: mockAgents[i].id,
    type: connectionTypes[randomBetween(0, 3)],
    strength: randomBetween(1, 10),
    lastInteraction: new Date(Date.now() - randomBetween(0, 14) * 86400000).toISOString(),
  });
}
// Add extra random connections
for (let i = 0; i < 15; i++) {
  const a = randomBetween(0, mockAgents.length - 1);
  let b = randomBetween(0, mockAgents.length - 1);
  while (b === a) b = randomBetween(0, mockAgents.length - 1);
  mockConnections.push({
    source: mockAgents[a].id,
    target: mockAgents[b].id,
    type: connectionTypes[randomBetween(0, 3)],
    strength: randomBetween(1, 10),
    lastInteraction: new Date(Date.now() - randomBetween(0, 14) * 86400000).toISOString(),
  });
}
