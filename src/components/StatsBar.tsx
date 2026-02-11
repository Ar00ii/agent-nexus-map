import { Agent } from "@/lib/types";
import { formatNumber } from "@/lib/colors";
import { Users, Coins, TrendingUp, Activity } from "lucide-react";

interface Props {
  agents: Agent[];
  connectionCount: number;
}

export default function StatsBar({ agents, connectionCount }: Props) {
  const totalBalance = agents.reduce((s, a) => s + a.memecoinBalance, 0);
  const activeCount = agents.filter((a) => a.status === "active").length;

  const stats = [
    { icon: Users, label: "Agentes", value: agents.length.toString(), color: "text-primary" },
    { icon: Coins, label: "Total MOLT", value: formatNumber(totalBalance), color: "text-neon-green" },
    { icon: Activity, label: "Conexiones", value: connectionCount.toString(), color: "text-neon-amber" },
    { icon: TrendingUp, label: "Activos", value: activeCount.toString(), color: "text-neon-cyan" },
  ];

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {stats.map((s) => (
        <div
          key={s.label}
          className="glass rounded-lg px-4 py-2.5 flex items-center gap-2.5 min-w-[120px]"
        >
          <s.icon size={16} className={s.color} />
          <div>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
