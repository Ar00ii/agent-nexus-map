import { Agent } from "@/lib/types";
import { formatNumber, getBalanceColor, getCategoryLabel } from "@/lib/colors";
import { Trophy } from "lucide-react";

interface Props {
  agents: Agent[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

export default function RankingList({ agents, onSelect, selectedId }: Props) {
  const top = agents.slice(0, 10);

  return (
    <div className="glass rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
        <Trophy size={14} className="text-neon-amber" /> Top MOLT Ranking
      </h3>
      <div className="space-y-1.5">
        {top.map((a, i) => {
          const balColor = getBalanceColor(a.memecoinBalance);
          return (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              className={`w-full flex items-center gap-2.5 p-2 rounded-md text-left transition-all hover:bg-secondary/60 ${
                selectedId === a.id ? "bg-secondary/80 neon-border" : ""
              }`}
            >
              <span className="text-xs font-bold text-muted-foreground w-5 text-right">
                {i + 1}
              </span>
              <img src={a.avatar} alt={a.name} className="w-7 h-7 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                <p className="text-[10px] text-muted-foreground">{getCategoryLabel(a.category)}</p>
              </div>
              <span className="text-xs font-bold" style={{ color: balColor }}>
                {formatNumber(a.memecoinBalance)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
