import { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { Agent, AgentConnection, GraphNode, GraphLink } from "@/lib/types";
import { getCategoryColor, getBalanceColor } from "@/lib/colors";

interface Props {
  agents: Agent[];
  connections: AgentConnection[];
  selectedAgentId: string | null;
  onSelectAgent: (id: string) => void;
  searchQuery: string;
  categoryFilter: string | null;
}

export default function AgentGraph({
  agents,
  connections,
  selectedAgentId,
  onSelectAgent,
  searchQuery,
  categoryFilter,
}: Props) {
  const graphRef = useRef<ForceGraphMethods | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const filteredAgents = agents.filter((a) => {
    const matchesSearch = !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredIds = new Set(filteredAgents.map((a) => a.id));

  const graphData = {
    nodes: filteredAgents.map((a): GraphNode => ({
      id: a.id,
      name: a.name,
      val: Math.max(4, Math.log2(a.memecoinBalance) * 2),
      category: a.category,
      balance: a.memecoinBalance,
      status: a.status,
    })),
    links: connections
      .filter((c) => filteredIds.has(c.source) && filteredIds.has(c.target))
      .map((c): GraphLink => ({
        source: c.source,
        target: c.target,
        type: c.type,
        strength: c.strength,
      })),
  };

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const paintNode = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const label = node.name as string;
      const size = node.val as number;
      const isSelected = node.id === selectedAgentId;
      const color = getBalanceColor(node.balance);

      // Glow
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, size + (isSelected ? 4 : 2), 0, 2 * Math.PI);
      ctx.fillStyle = isSelected
        ? `${color.slice(0, -1)}, 0.3)`
        : `${color.slice(0, -1)}, 0.15)`;
      ctx.fill();

      // Node
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Status dot
      const statusColors = { active: "#22c55e", idle: "#eab308", offline: "#6b7280" };
      ctx.beginPath();
      ctx.arc(node.x! + size * 0.7, node.y! - size * 0.7, 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = statusColors[node.status as keyof typeof statusColors];
      ctx.fill();

      // Label
      if (globalScale > 0.8) {
        const fontSize = Math.max(10, 12 / globalScale);
        ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "hsl(200, 20%, 92%)";
        ctx.fillText(label, node.x!, node.y! + size + 4);
      }
    },
    [selectedAgentId]
  );

  const paintLink = useCallback(
    (link: any, ctx: CanvasRenderingContext2D) => {
      const colors: Record<string, string> = {
        collaboration: "hsla(185, 80%, 55%, 0.25)",
        learning: "hsla(270, 70%, 60%, 0.25)",
        trade: "hsla(38, 90%, 55%, 0.25)",
        mentorship: "hsla(155, 70%, 50%, 0.25)",
      };
      ctx.strokeStyle = colors[link.type] || "hsla(200, 20%, 50%, 0.15)";
      ctx.lineWidth = Math.max(0.5, link.strength / 5);
      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      ctx.stroke();
    },
    []
  );

  return (
    <div ref={containerRef} className="w-full h-full">
      <ForceGraph2D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeCanvasObject={paintNode}
        linkCanvasObject={paintLink}
        onNodeClick={(node: any) => onSelectAgent(node.id)}
        nodeRelSize={6}
        cooldownTicks={100}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        backgroundColor="transparent"
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  );
}
