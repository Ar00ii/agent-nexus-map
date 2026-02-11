import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAgents, fetchConnections } from "@/lib/api";
import AgentGraph from "@/components/AgentGraph";
import AgentDetail from "@/components/AgentDetail";
import FilterBar from "@/components/FilterBar";
import StatsBar from "@/components/StatsBar";
import RankingList from "@/components/RankingList";
import { Hexagon } from "lucide-react";

const Index = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("rank");

  const { data: agents = [] } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
    refetchInterval: 30000,
  });

  const { data: connections = [] } = useQuery({
    queryKey: ["connections"],
    queryFn: fetchConnections,
    refetchInterval: 30000,
  });

  const sortedAgents = useMemo(() => {
    const sorted = [...agents];
    if (sortBy === "balance") sorted.sort((a, b) => b.memecoinBalance - a.memecoinBalance);
    else if (sortBy === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else sorted.sort((a, b) => a.rank - b.rank);
    return sorted;
  }, [agents, sortBy]);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass border-b border-border px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <Hexagon size={28} className="text-primary animate-pulse-glow" />
          <div>
            <h1 className="text-lg font-bold text-foreground text-glow-cyan">
              Moltbook Network
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Mapa de Conocimiento
            </p>
          </div>
        </div>
        <StatsBar agents={agents} connectionCount={connections.length} />
      </header>

      {/* Filter bar */}
      <div className="px-4 py-3">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-4 px-4 pb-4 min-h-0">
        {/* Ranking sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 overflow-y-auto">
          <RankingList
            agents={sortedAgents}
            onSelect={setSelectedAgentId}
            selectedId={selectedAgentId}
          />
        </aside>

        {/* Graph */}
        <main className="flex-1 rounded-lg neon-border overflow-hidden relative bg-background">
          <AgentGraph
            agents={sortedAgents}
            connections={connections}
            selectedAgentId={selectedAgentId}
            onSelectAgent={setSelectedAgentId}
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
          />
          {/* Legend */}
          <div className="absolute bottom-3 left-3 glass rounded-md p-2.5 text-[10px] space-y-1">
            {[
              { color: "hsl(155, 70%, 50%)", label: "≥30K MOLT" },
              { color: "hsl(185, 80%, 55%)", label: "≥10K MOLT" },
              { color: "hsl(38, 90%, 55%)", label: "≥3K MOLT" },
              { color: "hsl(0, 72%, 55%)", label: "<3K MOLT" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ background: item.color }}
                />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </main>

        {/* Agent detail panel */}
        {selectedAgent && (
          <aside className="w-80 flex-shrink-0 overflow-y-auto">
            <AgentDetail
              agent={selectedAgent}
              onClose={() => setSelectedAgentId(null)}
            />
          </aside>
        )}
      </div>
    </div>
  );
};

export default Index;
