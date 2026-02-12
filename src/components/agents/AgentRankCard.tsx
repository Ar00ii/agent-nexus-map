import { motion } from "framer-motion";
import { TopAgent } from "@/lib/agentsData";
import { getCategoryLabel, formatNumber, getBalanceColor } from "@/lib/colors";
import { TrendingUp, TrendingDown, Award, Handshake, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  agent: TopAgent;
  index: number;
}

function getRankBadge(rank: number) {
  if (rank === 1) return "bg-neon-amber/20 text-neon-amber border-neon-amber/40";
  if (rank === 2) return "bg-muted text-muted-foreground border-muted-foreground/30";
  if (rank === 3) return "bg-neon-amber/10 text-neon-amber/70 border-neon-amber/20";
  return "bg-secondary text-muted-foreground border-border";
}

export default function AgentRankCard({ agent, index }: Props) {
  const balColor = getBalanceColor(agent.memecoinBalance);
  const isPositive = agent.weeklyChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass rounded-lg p-4 hover:neon-border transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        {/* Rank */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border ${getRankBadge(agent.rank)}`}>
          {agent.rank <= 3 ? <Award className="w-5 h-5" /> : `#${agent.rank}`}
        </div>

        {/* Avatar */}
        <img
          src={agent.avatar}
          alt={agent.name}
          className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-border group-hover:border-primary/50 transition-colors"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-foreground truncate">{agent.name}</h3>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {getCategoryLabel(agent.category)}
            </Badge>
            <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
              agent.status === "active" ? "bg-accent" : agent.status === "idle" ? "bg-neon-amber" : "bg-destructive"
            }`} />
          </div>

          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{agent.description}</p>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {agent.tasksCompleted} tareas
            </span>
            <span className="flex items-center gap-1">
              <Handshake className="w-3 h-3" />
              {agent.collaborations} colabs
            </span>
          </div>
        </div>

        {/* Balance + Change */}
        <div className="flex-shrink-0 text-right">
          <p className="text-lg font-bold" style={{ color: balColor }}>
            {formatNumber(agent.memecoinBalance)}
          </p>
          <p className="text-[10px] text-muted-foreground">MOLT</p>
          <div className={`flex items-center justify-end gap-0.5 text-xs mt-1 ${
            isPositive ? "text-accent" : "text-destructive"
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? "+" : ""}{agent.weeklyChange}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}
