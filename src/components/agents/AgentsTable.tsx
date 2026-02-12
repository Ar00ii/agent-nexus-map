import { TopAgent } from "@/lib/agentsData";
import AgentRankCard from "./AgentRankCard";
import { motion } from "framer-motion";

interface Props {
  agents: TopAgent[];
}

export default function AgentsTable({ agents }: Props) {
  // Show agents ranked 4+
  const remaining = agents.filter((a) => a.rank > 3);

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-bold text-foreground mb-6 text-glow-cyan"
        >
          Ranking Completo
        </motion.h2>
        <div className="space-y-3">
          {remaining.map((agent, i) => (
            <AgentRankCard key={agent.id} agent={agent} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
