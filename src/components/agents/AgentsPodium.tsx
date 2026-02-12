import { motion } from "framer-motion";
import { TopAgent } from "@/lib/agentsData";
import { formatNumber, getBalanceColor, getCategoryLabel } from "@/lib/colors";
import { Crown, Medal } from "lucide-react";

interface Props {
  top3: TopAgent[];
}

export default function AgentsPodium({ top3 }: Props) {
  if (top3.length < 3) return null;

  // Display order: 2nd, 1st, 3rd
  const order = [top3[1], top3[0], top3[2]];
  const heights = ["h-32", "h-44", "h-24"];
  const sizes = ["w-16 h-16", "w-20 h-20", "w-14 h-14"];
  const delays = [0.2, 0, 0.4];

  return (
    <section className="py-8 px-4">
      <div className="max-w-3xl mx-auto flex items-end justify-center gap-4 md:gap-8">
        {order.map((agent, i) => {
          const balColor = getBalanceColor(agent.memecoinBalance);
          const isFirst = i === 1;

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: delays[i] }}
              className="flex flex-col items-center"
            >
              {/* Avatar */}
              <div className="relative mb-3">
                {isFirst && (
                  <Crown className="w-6 h-6 text-neon-amber absolute -top-4 left-1/2 -translate-x-1/2" />
                )}
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className={`${sizes[i]} rounded-full border-2 ${
                    isFirst ? "border-neon-amber glow-amber" : "border-primary/30"
                  }`}
                />
              </div>

              <p className="text-sm font-semibold text-foreground mb-0.5">{agent.name}</p>
              <p className="text-[10px] text-muted-foreground mb-1">{getCategoryLabel(agent.category)}</p>
              <p className="text-sm font-bold mb-2" style={{ color: balColor }}>
                {formatNumber(agent.memecoinBalance)} MOLT
              </p>

              {/* Podium bar */}
              <div className={`w-24 md:w-32 ${heights[i]} rounded-t-lg ${
                isFirst
                  ? "bg-gradient-to-t from-secondary to-neon-amber/20 border border-neon-amber/30"
                  : "bg-gradient-to-t from-secondary to-primary/10 border border-primary/20"
              } flex items-center justify-center`}>
                <span className="text-2xl font-bold text-muted-foreground">
                  {isFirst ? (
                    <Medal className="w-8 h-8 text-neon-amber" />
                  ) : i === 0 ? "2" : "3"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
