import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Hexagon, Loader2, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MoltnetAIChatProps {
  open: boolean;
  onClose: () => void;
}

export default function MoltnetAIChat({ open, onClose }: MoltnetAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bienvenido al núcleo cognitivo de Moltbook. Soy MoltNet AI, tu asistente en la red de agentes. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Sin respuesta del servidor." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Error de conexión con el núcleo. Asegúrate de que el backend está corriendo en http://localhost:8000",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Chat Panel */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{
              background:
                "linear-gradient(180deg, hsl(222 47% 5%) 0%, hsl(222 47% 3%) 100%)",
              borderLeft: "1px solid hsl(185 100% 50% / 0.15)",
              boxShadow: "-20px 0 60px hsl(185 100% 50% / 0.08)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                borderBottom: "1px solid hsl(185 100% 50% / 0.1)",
                background: "hsl(222 47% 6%)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(185 100% 50% / 0.2), hsl(160 100% 50% / 0.1))",
                      border: "1px solid hsl(185 100% 50% / 0.3)",
                      boxShadow: "0 0 16px hsl(185 100% 50% / 0.3)",
                    }}
                  >
                    <Hexagon size={18} className="text-cyan-400" />
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400"
                    style={{ boxShadow: "0 0 6px hsl(160 100% 50%)" }}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-cyan-300 tracking-wide">
                    MOLTNET AI
                  </p>
                  <p className="text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles size={9} /> Núcleo Activo
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={
                      msg.role === "assistant"
                        ? {
                            background:
                              "linear-gradient(135deg, hsl(185 100% 50% / 0.2), hsl(160 100% 50% / 0.1))",
                            border: "1px solid hsl(185 100% 50% / 0.3)",
                          }
                        : {
                            background:
                              "linear-gradient(135deg, hsl(270 100% 60% / 0.2), hsl(220 100% 60% / 0.1))",
                            border: "1px solid hsl(270 100% 60% / 0.3)",
                          }
                    }
                  >
                    {msg.role === "assistant" ? (
                      <Bot size={13} className="text-cyan-400" />
                    ) : (
                      <User size={13} className="text-purple-400" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className="max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                    style={
                      msg.role === "assistant"
                        ? {
                            background: "hsl(222 47% 8%)",
                            border: "1px solid hsl(185 100% 50% / 0.12)",
                            color: "hsl(210 20% 85%)",
                          }
                        : {
                            background:
                              "linear-gradient(135deg, hsl(185 100% 30% / 0.25), hsl(160 100% 30% / 0.15))",
                            border: "1px solid hsl(185 100% 50% / 0.2)",
                            color: "hsl(185 80% 90%)",
                          }
                    }
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(185 100% 50% / 0.2), hsl(160 100% 50% / 0.1))",
                      border: "1px solid hsl(185 100% 50% / 0.3)",
                    }}
                  >
                    <Bot size={13} className="text-cyan-400" />
                  </div>
                  <div
                    className="rounded-2xl px-4 py-3 flex items-center gap-2"
                    style={{
                      background: "hsl(222 47% 8%)",
                      border: "1px solid hsl(185 100% 50% / 0.12)",
                    }}
                  >
                    <Loader2 size={14} className="text-cyan-400 animate-spin" />
                    <span className="text-xs text-gray-500">Procesando...</span>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="px-4 py-4"
              style={{
                borderTop: "1px solid hsl(185 100% 50% / 0.1)",
                background: "hsl(222 47% 5%)",
              }}
            >
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                style={{
                  background: "hsl(222 47% 8%)",
                  border: "1px solid hsl(185 100% 50% / 0.15)",
                  boxShadow: "0 0 0 0 hsl(185 100% 50% / 0)",
                  transition: "box-shadow 0.2s",
                }}
                onFocus={() => {}}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                  style={{
                    background: input.trim()
                      ? "linear-gradient(135deg, hsl(185 100% 40%), hsl(160 100% 40%))"
                      : "hsl(222 47% 12%)",
                    boxShadow: input.trim()
                      ? "0 0 12px hsl(185 100% 50% / 0.4)"
                      : "none",
                  }}
                >
                  <Send size={14} className="text-black" />
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-700 mt-2 tracking-wider uppercase">
                Powered by Gemini · Moltbook Network
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
