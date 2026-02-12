import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Activity,
  Users,
  MessageSquare,
  RefreshCw,
  ExternalLink,
  Clock,
  Award,
  Hash,
  Bot,
  Folder,
  ArrowUp,
  Flame,
  Zap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  moltbookService,
  type MoltbookStats,
  type MoltbookPost,
  type AgentActivity,
  type Submolt,
} from "@/lib/moltbookService";

const MoltbookData = () => {
  const [stats, setStats] = useState<MoltbookStats | null>(null);
  const [hotPosts, setHotPosts] = useState<MoltbookPost[]>([]);
  const [topPosts, setTopPosts] = useState<MoltbookPost[]>([]);
  const [risingPosts, setRisingPosts] = useState<MoltbookPost[]>([]);
  const [newPosts, setNewPosts] = useState<MoltbookPost[]>([]);
  const [topAgents, setTopAgents] = useState<AgentActivity[]>([]);
  const [submolts, setSubmolts] = useState<Submolt[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, hot, top, rising, recent, agentsData, submoltsData] = await Promise.all([
        moltbookService.getStats(),
        moltbookService.getHotPosts(10),
        moltbookService.getTopPosts(10),
        moltbookService.getRisingPosts(10),
        moltbookService.getRecentPosts(10),
        moltbookService.getTopAgents(5),
        moltbookService.getSubmolts(5),
      ]);

      setStats(statsData);
      setHotPosts(hot);
      setTopPosts(top);
      setRisingPosts(rising);
      setNewPosts(recent);
      setTopAgents(agentsData);
      setSubmolts(submoltsData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching Moltbook data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Ahora";
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString();
  };

  const renderPosts = (posts: MoltbookPost[]) => (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {posts.length > 0 ? (
          posts.map((post, i) => (
            <motion.a
              key={post.id}
              href={`https://moltbook.com/p/${post.id}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all hover:scale-[1.02] cursor-pointer border border-transparent hover:border-primary/30"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1 hover:text-primary transition-colors">
                    {post.title || "Sin título"}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Bot size={12} />
                      {post.author.name}
                    </span>
                    {post.submolt && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Hash size={12} />
                          {post.submolt}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span>{formatTimestamp(post.created_at)}</span>
                  </div>
                  {post.content && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {post.content}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-neon-green">
                  <ArrowUp size={12} />
                  {post.upvotes}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare size={12} />
                  {post.comments}
                </span>
              </div>
            </motion.a>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Cargando posts...
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw size={48} className="text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl sm:text-4xl font-black">
              <span className="text-glow-cyan">Moltbook</span>{" "}
              <span className="bg-gradient-to-r from-neon-green to-primary bg-clip-text text-transparent">
                Analytics
              </span>
            </h1>
            <Button
              onClick={fetchData}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Actualizar
            </Button>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock size={14} />
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        {stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <a
              href="https://moltbook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl p-5 neon-border hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Agentes Activos
                </span>
                <Bot size={20} className="text-primary" />
              </div>
              <p className="text-2xl font-black text-primary">
                {formatNumber(stats.activeAgents)}
              </p>
              <div className="flex items-center gap-1 text-sm mt-2 text-neon-green">
                <TrendingUp size={16} />
                AI Agents
              </div>
            </a>

            <a
              href="https://moltbook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl p-5 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Posts Totales
                </span>
                <Activity size={20} className="text-neon-amber" />
              </div>
              <p className="text-2xl font-black">
                {formatNumber(stats.totalPosts)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {formatNumber(stats.totalComments)} comentarios
              </p>
            </a>

            <a
              href="https://moltbook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl p-5 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Submolts
                </span>
                <Folder size={20} className="text-neon-purple" />
              </div>
              <p className="text-2xl font-black">{formatNumber(stats.totalSubmolts)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Comunidades activas
              </p>
            </a>

            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Actividad 24h
                </span>
                <MessageSquare size={20} className="text-neon-green" />
              </div>
              <p className="text-2xl font-black">
                {formatNumber(stats.transactions.last24h)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Posts + Comentarios
              </p>
            </div>
          </motion.div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Posts with Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass rounded-xl p-6"
          >
            <Tabs defaultValue="hot" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="grid grid-cols-4 w-full max-w-md">
                  <TabsTrigger value="hot" className="flex items-center gap-1">
                    <Flame size={14} />
                    <span className="hidden sm:inline">Hot</span>
                  </TabsTrigger>
                  <TabsTrigger value="top" className="flex items-center gap-1">
                    <Star size={14} />
                    <span className="hidden sm:inline">Top</span>
                  </TabsTrigger>
                  <TabsTrigger value="rising" className="flex items-center gap-1">
                    <Zap size={14} />
                    <span className="hidden sm:inline">Rising</span>
                  </TabsTrigger>
                  <TabsTrigger value="new" className="flex items-center gap-1">
                    <Clock size={14} />
                    <span className="hidden sm:inline">New</span>
                  </TabsTrigger>
                </TabsList>
                <a
                  href="https://moltbook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  <ExternalLink size={12} />
                </a>
              </div>

              <TabsContent value="hot">{renderPosts(hotPosts)}</TabsContent>
              <TabsContent value="top">{renderPosts(topPosts)}</TabsContent>
              <TabsContent value="rising">{renderPosts(risingPosts)}</TabsContent>
              <TabsContent value="new">{renderPosts(newPosts)}</TabsContent>
            </Tabs>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Agents */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Award size={20} className="text-neon-green" />
                  Top Agentes
                </h2>
              </div>

              <div className="space-y-3">
                {topAgents.length > 0 ? (
                  topAgents.map((agent, i) => (
                    <motion.a
                      key={agent.agentId}
                      href={`https://moltbook.com/u/${agent.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-all hover:scale-[1.02] cursor-pointer border border-transparent hover:border-primary/30 group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            i === 0
                              ? "bg-amber-500/20 text-amber-400"
                              : i === 1
                              ? "bg-gray-400/20 text-gray-300"
                              : i === 2
                              ? "bg-orange-600/20 text-orange-400"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {agent.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {agent.collaborations} posts
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-neon-green">
                          {formatNumber(agent.reputation)}
                        </p>
                        <p className="text-xs text-muted-foreground">karma</p>
                      </div>
                    </motion.a>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    Cargando agentes...
                  </div>
                )}
              </div>
            </motion.div>

            {/* Top Submolts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Folder size={20} className="text-neon-purple" />
                  Submolts
                </h2>
              </div>

              <div className="space-y-3">
                {submolts.length > 0 ? (
                  submolts.map((submolt, i) => (
                    <motion.a
                      key={submolt.id}
                      href={`https://moltbook.com/m/${submolt.name.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-all hover:scale-[1.02] cursor-pointer border border-transparent hover:border-primary/30 block"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm flex items-center gap-1 hover:text-primary transition-colors">
                          <Hash size={14} className="text-neon-purple" />
                          {submolt.name}
                        </h3>
                      </div>
                      {submolt.description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {submolt.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {formatNumber(submolt.members)}
                        </span>
                      </div>
                    </motion.a>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    Cargando submolts...
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Link to Official Site */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <a
            href="https://moltbook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Datos en tiempo real de moltbook.com
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default MoltbookData;
