import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles, MapPin, Gift, Star, HelpCircle, Diamond } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  reply: string;
  suggestions?: string[];
}

export default function LuxuryAiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to Essence Yogurt. I'm your personal AI concierge, powered by Gemini. How may I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const chatMutation = useMutation({
    mutationFn: async (message: string): Promise<ChatResponse> => {
      const response = await fetch("/api/ai/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message,
          history: messages.slice(-6).map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });
      if (!response.ok) throw new Error("Chat failed");
      return response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "I apologize for the inconvenience. Please try again or contact us at support@essenceyogurt.com",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    },
  });

  const sendMessage = (text: string) => {
    if (!text.trim() || chatMutation.isPending) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() },
    ]);
    setInput("");
    setIsTyping(true);
    chatMutation.mutate(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const quickActions = [
    { icon: MapPin, label: "Find locations", action: "Where are your locations?" },
    { icon: Star, label: "VIP loyalty", action: "Tell me about the VIP loyalty program" },
    { icon: Gift, label: "E-Gift cards", action: "How do E-Gift cards work?" },
    { icon: HelpCircle, label: "How it works", action: "How does Essence Yogurt work?" },
  ];

  return (
    <>
      {/* Floating Button - Mobile Safe Position */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="ey-ai-toggle fixed z-50 flex items-center gap-2 rounded-full text-sm font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all"
        style={{
          right: "16px",
          bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
          padding: "8px 14px",
          background: isOpen 
            ? "linear-gradient(135deg, #000000, #c9a155)" 
            : "linear-gradient(135deg, #D6A743 0%, #F7E3A3 50%, #B8862D 100%)",
          color: isOpen ? "#ffffff" : "#111827",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-testid="luxury-ai-chat-toggle"
      >
        {isOpen ? (
          <>
            <X size={18} />
            <span className="hidden sm:inline">Close</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span className="hidden sm:inline tracking-wide">Essence AI</span>
            <span className="sm:hidden">AI</span>
          </>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 w-[calc(100vw-32px)] max-w-[400px] overflow-hidden rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.3)]"
            style={{
              right: "16px",
              bottom: "calc(64px + env(safe-area-inset-bottom, 0px))",
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(#fff, #fff), linear-gradient(135deg, #D6A743 0%, #F7E3A3 50%, #B8862D 100%)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
            data-testid="luxury-ai-chat-window"
          >
            {/* Header with Close Button */}
            <div className="relative overflow-hidden px-5 py-4" style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
            }}>
              {/* Gold shimmer overlay */}
              <div className="absolute inset-0 opacity-20" style={{
                background: "linear-gradient(45deg, transparent 30%, #D6A743 50%, transparent 70%)",
                backgroundSize: "200% 200%",
                animation: "shimmer 3s ease-in-out infinite",
              }} />
              
              {/* Decorative diamonds */}
              <div className="absolute top-2 right-16 opacity-30">
                <Diamond size={10} className="text-[#D6A743]" />
              </div>
              <div className="absolute bottom-2 left-20 opacity-20">
                <Diamond size={8} className="text-[#F7E3A3]" />
              </div>
              
              <div className="relative flex items-center gap-3">
                {/* Logo with gold ring */}
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#D6A743] via-[#F7E3A3] to-[#B8862D] opacity-50 blur-sm" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#F7E3A3] via-[#D6A743] to-[#B8862D] shadow-lg ring-2 ring-[#F7E3A3]/30">
                    <Sparkles size={22} className="text-[#1a1a1a]" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-sm font-bold tracking-wide text-white flex items-center gap-2">
                    Essence AI Concierge
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#D6A743]/20 px-2 py-0.5 text-[9px] font-medium text-[#F7E3A3]">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22c55e]" />
                      LIVE
                    </span>
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#D6A743]">
                    Powered by Gemini AI
                  </p>
                </div>
                
                {/* Close X Button - Easy to tap */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-[#D6A743] hover:text-[#1a1a1a] hover:scale-110"
                  data-testid="luxury-ai-chat-close"
                  aria-label="Close chat"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Messages Area - Luxe Cream Background */}
            <div 
              className="h-[320px] overflow-y-auto px-4 py-4" 
              style={{
                background: "linear-gradient(180deg, #fdfcf9 0%, #f9f7f2 50%, #fdfcf9 100%)",
              }}
              data-testid="luxury-ai-chat-messages"
            >
              {/* Subtle pattern overlay */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23D6A743' fill-opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: "30px 30px",
              }} />
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "text-[#1a1a1a] shadow-lg"
                        : "bg-white text-[#374151] shadow-md border border-[#D6A743]/20"
                    }`}
                    style={message.role === "user" ? {
                      background: "linear-gradient(135deg, #D6A743 0%, #F7E3A3 50%, #B8862D 100%)",
                    } : {}}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles size={10} className="text-[#D6A743]" />
                        <span className="text-[9px] uppercase tracking-wider text-[#D6A743] font-semibold">Essence AI</span>
                      </div>
                    )}
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="mb-3 flex justify-start">
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-md border border-[#D6A743]/20">
                    <div className="flex items-center gap-2">
                      <Sparkles size={10} className="text-[#D6A743]" />
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#D6A743]" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#D6A743]" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#D6A743]" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions - Gold themed */}
            {messages.length <= 2 && (
              <div className="border-t border-[#D6A743]/20 px-4 py-3" style={{
                background: "linear-gradient(180deg, #fdfcf9, #f5f0e6)",
              }}>
                <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-[#B8862D] font-semibold flex items-center gap-1.5">
                  <Diamond size={10} />
                  Quick questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(action.action)}
                      className="flex items-center gap-1.5 rounded-full border border-[#D6A743]/30 bg-white px-3 py-1.5 text-[11px] font-medium text-[#4b5563] shadow-sm transition-all hover:border-[#D6A743] hover:bg-gradient-to-r hover:from-[#fdfbf3] hover:to-[#f5edd8] hover:text-[#1a1a1a] hover:shadow-md"
                      data-testid={`quick-action-${idx}`}
                    >
                      <action.icon size={12} className="text-[#D6A743]" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input - Luxe styling */}
            <form onSubmit={handleSubmit} className="border-t border-[#D6A743]/20 p-4" style={{
              background: "linear-gradient(180deg, #ffffff, #fdfcf9)",
            }}>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about flavors, locations, VIP..."
                    className="w-full rounded-full border-2 border-[#e5e2d9] bg-[#fdfcf9] px-4 py-2.5 text-sm text-[#1a1a1a] placeholder-[#9ca3af] outline-none transition-all focus:border-[#D6A743] focus:ring-4 focus:ring-[#D6A743]/10"
                    disabled={chatMutation.isPending}
                    data-testid="luxury-ai-chat-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || chatMutation.isPending}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[#1a1a1a] shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  style={{
                    background: "linear-gradient(135deg, #D6A743 0%, #F7E3A3 50%, #B8862D 100%)",
                  }}
                  data-testid="luxury-ai-chat-send"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-[#9ca3af]">
                <Diamond size={8} className="text-[#D6A743]" />
                <span>Essence Yogurt™ © {new Date().getFullYear()}</span>
                <Diamond size={8} className="text-[#D6A743]" />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}
