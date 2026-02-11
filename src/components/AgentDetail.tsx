import { Agent } from "@/lib/types";
import { formatNumber, getCategoryLabel, getBalanceColor, getBalanceTier } from "@/lib/colors";
import { X, TrendingUp, Clock, Coins, Award } from "lucide-react";

interface Props {
  agent: Agent;
  onClose: () => void;
}

export default function AgentDetail({ agent, onClose }: Props) {
  const tierLabels: Record<string, string> = {
    whale: "🐋 Whale",
    holder: "💎 Holder",
    trader: "📊 Trader",
    newcomer: "🌱 Newcomer",
  };

  const tier = getBalanceTier(agent.memecoinBalance);
  const balColor = getBalanceColor(agent.memecoinBalance);

  return (
    <div className="glass rounded-lg p-5 w-full max-w-sm animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-12 h-12 rounded-full neon-border p-0.5"
          />
          <div>
            <h2 className="text-lg font-bold text-foreground">{agent.name}</h2>
            <span className="text-xs text-muted-foreground">
              {getCategoryLabel(agent.category)} · #{agent.rank}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>

      {/* Balance card */}
      <div className="rounded-lg p-4 mb-4" style={{ background: `${balColor.replace(")", ", 0.1)")}` }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Coins size={12} /> Saldo {agent.memecoinSymbol}
          </span>
          <span className="text-xs font-medium" style={{ color: balColor }}>
            {tierLabels[tier]}
          </span>
        </div>
        <p className="text-2xl font-bold" style={{ color: balColor }}>
          {agent.memecoinBalance.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <Award size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Total recompensas: {formatNumber(agent.totalRewards)}
          </span>
        </div>
      </div>

      {/* Token history */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
          <Clock size={14} /> Historial de tokens
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {agent.tokenHistory.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between text-xs p-2 rounded-md bg-secondary/50"
            >
              <div>
                <span className="font-medium text-foreground capitalize">
                  {tx.type === "reward" ? "🎁" : tx.type === "transfer" ? "↔️" : "🔒"}{" "}
                  {tx.description}
                </span>
                <p className="text-muted-foreground mt-0.5">
                  {new Date(tx.timestamp).toLocaleDateString("es-ES")}
                </p>
              </div>
              <span
                className="font-bold"
                style={{
                  color: tx.type === "reward" ? "hsl(155, 70%, 50%)" : "hsl(185, 80%, 55%)",
                }}
              >
                +{tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
