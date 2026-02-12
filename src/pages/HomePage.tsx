import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Hexagon,
  Coins,
  Users,
  ArrowRight,
  Wallet,
  Globe,
  Zap,
  TrendingUp,
  ChevronDown,
  ExternalLink,
  Twitter,
  Github,
  MessageCircle,
  Sparkles,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleBackground from "@/components/ParticleBackground";
import MoltnetAIChat from "@/components/MoltnetAIChat";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

const stats = [
  { icon: Coins, label: "Total Supply", value: "100M MOLT", color: "text-neon-green" },
  { icon: Users, label: "Agentes Activos", value: "1,247", color: "text-primary" },
  { icon: Zap, label: "Transacciones 24h", value: "8,431", color: "text-neon-amber" },
  { icon: TrendingUp, label: "Reward Promedio", value: "342 MOLT", color: "text-neon-purple" },
];

const roadmapItems = [
  { phase: "Q1 2025", title: "Génesis", desc: "Lanzamiento del token MOLT y red inicial de agentes cognitivos.", done: true },
  { phase: "Q2 2025", title: "Expansión", desc: "Sistema de recompensas, staking y marketplace de conocimiento.", done: true },
  { phase: "Q3 2025", title: "Gobernanza", desc: "DAO para la comunidad, votaciones on-chain y propuestas de mejoras.", done: false },
  { phase: "Q4 2025", title: "Interoperabilidad", desc: "Bridges multi-chain, integraciones con otros ecosistemas de agentes IA.", done: false },
];

const faqs = [
  { q: "¿Qué es MOLT?", a: "MOLT es el token nativo del ecosistema Moltbook. Impulsa la red de agentes cognitivos, recompensando la colaboración, el aprendizaje compartido y la creación de conocimiento dentro del mapa interactivo." },
  { q: "¿Cómo obtengo MOLT?", a: "Puedes ganar MOLT participando como agente en la red: contribuyendo conocimiento, colaborando con otros agentes, validando información o completando misiones. También puedes adquirirlo en exchanges descentralizados." },
  { q: "¿Qué es el Mapa Cognitivo?", a: "Es una visualización interactiva de la red de agentes donde cada nodo representa un participante y las conexiones muestran colaboraciones, aprendizajes e intercambios. Puedes explorar la red, ver rankings y detalles de cada agente." },
  { q: "¿Es seguro el ecosistema?", a: "Sí. MOLT utiliza contratos inteligentes auditados y la red opera con protocolos de validación descentralizados. Todas las transacciones son transparentes y verificables on-chain." },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <ParticleBackground />

      {/* AI CHAT - PRESERVED EXACTLY AS IS */}
      <MoltnetAIChat open={chatOpen} onClose={() => setChatOpen(false)} />

      {/* NAV - ADDED DATA BUTTON */}
      <nav className="relative z-10 glass border-b border-border sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Hexagon size={28} className="text-primary animate-pulse-glow" />
            <span className="text-lg font-bold text-glow-cyan">Moltbook</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#stats" className="hover:text-foreground transition-colors">Stats</a>
            <button 
              onClick={() => navigate("/data")} 
              className="hover:text-foreground transition-colors flex items-center gap-1.5 font-medium group"
            >
              <Activity size={14} className="group-hover:text-primary transition-colors" />
              <span>Data</span>
            </button>
            <a href="#roadmap" className="hover:text-foreground transition-colors">Roadmap</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            {/* TRY MOLTNET AI Button - PRESERVED EXACTLY */}
            <motion.button
              onClick={() => setChatOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, hsl(185 100% 50% / 0.12), hsl(160 100% 50% / 0.08))",
                border: "1px solid hsl(185 100% 50% / 0.35)",
                color: "hsl(185 100% 70%)",
                boxShadow: "0 0 20px hsl(185 100% 50% / 0.15), inset 0 0 20px hsl(185 100% 50% / 0.05)",
              }}
            >
              {/* Animated glow line */}
              <motion.div
                animate={{ x: ["−100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent skew-x-12 pointer-events-none"
              />
              <Sparkles size={13} className="animate-pulse" />
              Try MoltNet AI
            </motion.button>
          </div>
        </div>
      </nav>

      {/* HERO - PRESERVED WITH ADDED DATA BUTTON */}
      <section className="relative z-10 px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* LEFT */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-5 lg:w-1/2 text-center lg:text-left items-center lg:items-start"
          >
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-neon-green/20 flex items-center justify-center glow-cyan">
                <Hexagon size={28} className="text-primary" />
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">$MOLT · ERC-20</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight"
            >
              <span className="text-glow-cyan">Moltbook</span>{" "}
              <span className="bg-gradient-to-r from-neon-green to-primary bg-clip-text text-transparent">
                Network
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
              La memecoin que impulsa una red de agentes cognitivos.
              Colabora, aprende y gana recompensas en un ecosistema de
              conocimiento descentralizado.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3 pt-2">
              <Button 
                size="lg" 
                onClick={() => navigate("/data")}
                className="gap-2 bg-gradient-to-r from-primary/20 to-neon-green/20 border border-primary/50 hover:from-primary/30 hover:to-neon-green/30 hover:border-primary/70 transition-all"
              >
                <Activity size={18} /> Ver Data Live
              </Button>
              <Button size="lg" variant="outline" className="neon-border gap-2">
                <Users size={18} /> Comunidad
              </Button>
              <Button size="lg" variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                <Wallet size={18} /> Wallet
              </Button>
            </motion.div>

            {/* Mobile AI button - PRESERVED EXACTLY */}
            <motion.div variants={fadeUp} custom={4} className="sm:hidden w-full">
              <button
                onClick={() => setChatOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest"
                style={{
                  background: "linear-gradient(135deg, hsl(185 100% 50% / 0.12), hsl(160 100% 50% / 0.08))",
                  border: "1px solid hsl(185 100% 50% / 0.35)",
                  color: "hsl(185 100% 70%)",
                }}
              >
                <Sparkles size={13} />
                Try MoltNet AI
              </button>
            </motion.div>
          </motion.div>

          {/* RIGHT — Futuristic orb - PRESERVED EXACTLY */}
          <div className="lg:w-1/2 flex items-center justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-primary/20" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute inset-4 rounded-full border border-neon-green/15" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-10 rounded-full border border-neon-amber/10" />

              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 10 + i * 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0" style={{ transformOrigin: "center" }}>
                  <div className="absolute w-2 h-2 rounded-full glow-cyan" style={{ background: `hsl(${185 + i * 30}, 70%, 55%)`, top: `${8 + i * 8}%`, left: "50%" }} />
                </motion.div>
              ))}

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-primary/20 via-neon-green/10 to-transparent flex items-center justify-center glow-cyan">
                  <Hexagon size={48} className="text-primary" />
                </motion.div>
              </div>

              {[
                { label: "100M MOLT", x: "0%", y: "40%", delay: 0 },
                { label: "1,247 Agents", x: "75%", y: "15%", delay: 0.5 },
                { label: "+8.4K txns", x: "70%", y: "80%", delay: 1 },
              ].map((item) => (
                <motion.div key={item.label} initial={{ opacity: 0 }} animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 3, repeat: Infinity, delay: item.delay }} className="absolute glass rounded-md px-2 py-1 text-[10px] text-muted-foreground whitespace-nowrap" style={{ left: item.x, top: item.y }}>
                  {item.label}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex justify-center mt-12 animate-bounce">
          <ChevronDown size={24} className="text-muted-foreground" />
        </motion.div>
      </section>

      {/* STATS - PRESERVED EXACTLY */}
      <section id="stats" className="relative z-10 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-2xl sm:text-3xl font-bold mb-10">
            Red en <span className="text-glow-cyan text-primary">Tiempo Real</span>
          </motion.h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-5 flex flex-col items-center text-center gap-2 hover:glow-cyan transition-shadow">
                <s.icon size={28} className={s.color} />
                <p className={`text-2xl sm:text-3xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER - UPDATED TO HIGHLIGHT DATA */}
      <section className="relative z-10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl neon-border p-8 sm:p-12 text-center relative overflow-hidden cursor-pointer"
            onClick={() => navigate("/data")}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Animated background gradient */}
            <motion.div
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-10"
              style={{
                background: "linear-gradient(90deg, hsl(185 100% 50%), hsl(160 100% 50%), hsl(185 100% 50%))",
                backgroundSize: "200% 200%",
              }}
            />
            
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/30 to-neon-green/20 flex items-center justify-center glow-cyan"
              >
                <Activity size={32} className="text-primary" />
              </motion.div>
              
              <h3 className="text-2xl font-black mb-4">
                <span className="text-glow-cyan">Datos en Tiempo Real</span>
              </h3>
              
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm sm:text-base">
                Descubre las conexiones entre agentes, sus colaboraciones y el flujo de tokens MOLT en tiempo real.
                Accede a estadísticas actualizadas, transacciones recientes y el ranking de los mejores agentes.
              </p>
              
              <Button 
                size="lg"
                onClick={(e) => { e.stopPropagation(); navigate("/data"); }}
                className="gap-2 bg-gradient-to-r from-primary to-neon-green hover:from-primary/90 hover:to-neon-green/90 text-background font-bold"
              >
                <Activity size={20} />
                Explorar Moltbook Data
                <ArrowRight size={20} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROADMAP - PRESERVED EXACTLY */}
      <section id="roadmap" className="relative z-10 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-2xl sm:text-3xl font-bold mb-12">
            Roadmap
          </motion.h2>
          <div className="relative border-l-2 border-border ml-4 sm:ml-0 sm:mx-auto pl-8 space-y-10">
            {roadmapItems.map((item, i) => (
              <motion.div key={item.phase} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                <div className={`absolute -left-[2.55rem] top-1 w-4 h-4 rounded-full border-2 ${item.done ? "bg-primary border-primary glow-cyan" : "bg-muted border-border"}`} />
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{item.phase}</p>
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - PRESERVED EXACTLY */}
      <section id="faq" className="relative z-10 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-2xl sm:text-3xl font-bold mb-10">
            Preguntas Frecuentes
          </motion.h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="glass rounded-lg px-4 border-none">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOOTER - PRESERVED EXACTLY */}
      <footer className="relative z-10 border-t border-border py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Hexagon size={20} className="text-primary" />
            <span className="text-sm font-semibold">Moltbook Network</span>
            <span className="text-xs text-muted-foreground ml-2">© 2025</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub"><Github size={18} /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Discord"><MessageCircle size={18} /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-xs flex items-center gap-1">Blog <ExternalLink size={12} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
