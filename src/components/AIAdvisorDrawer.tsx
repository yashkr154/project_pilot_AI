import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquareCode,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  GraduationCap,
  HelpCircle,
  Code2,
  Database,
  Award,
} from "lucide-react";
import { SavedProject, AdvisorChatMessage } from "../types";

interface AIAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeProject: SavedProject | null;
  initialQuery?: string;
}

const QUICK_PROMPTS = [
  "How should I defend this system architecture in my external viva?",
  "Generate an SQL schema and ER diagram outline for this project",
  "What quantitative evaluation metrics should I record for Chapter 5?",
  "Suggest a fair workload split for a 2-3 student team",
  "How can I add an explainable AI (XAI) feature to impress examiners?",
];

export const AIAdvisorDrawer: React.FC<AIAdvisorDrawerProps> = ({
  isOpen,
  onClose,
  activeProject,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<AdvisorChatMessage[]>([
    {
      id: "welcome-1",
      role: "model",
      content: `Hello! I am your AI Capstone Project Guide and Viva Defense Mentor. ${
        activeProject
          ? `I see you are working on "${activeProject.title}".`
          : "Let's brainstorm or troubleshoot your final-year project."
      }\n\nAsk me anything about system architecture, dataset selection, algorithm design, viva voce cross-examination, or thesis formatting!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: AdvisorChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          chatHistory: messages.slice(-8).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          projectContext: activeProject
            ? {
                title: activeProject.title,
                domain: activeProject.domain,
                problemStatement: activeProject.problemStatement,
                recommendedTechStack: activeProject.recommendedTechStack,
                progressPercentage: activeProject.tasks?.length
                  ? Math.round(
                      (activeProject.tasks.filter((t) => t.completed).length / activeProject.tasks.length) * 100
                    )
                  : 0,
              }
            : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI Guide.");
      }

      const data = await response.json();
      const modelMessage: AdvisorChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "model",
        content: data.reply || "I couldn't formulate a response. Please try asking in a different way.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: "model",
          content: "Sorry, I encountered an issue contacting the advisory engine. Please check that GEMINI_API_KEY is configured in Settings > Secrets.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "model",
        content: `Chat session refreshed. How can I assist you with your capstone today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">Professor Gemini</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-800">
                  VIVA GUIDE
                </span>
              </div>
              <p className="text-[11px] text-slate-700 truncate max-w-xs">
                {activeProject ? `Context: ${activeProject.title}` : "Capstone Project Advisor"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={resetChat}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
              title="Reset conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div className="p-2.5 bg-slate-100/70 border-b border-slate-200 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider pl-1 shrink-0">
            Quick Prompts:
          </span>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white text-slate-700 hover:text-indigo-600 hover:border-indigo-300 border border-slate-200 whitespace-nowrap transition shrink-0 font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === "user" ? "bg-slate-800 text-white" : "bg-indigo-600 text-white shadow-xs"
                }`}
              >
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 relative group ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/70"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[10px] flex items-center justify-between pt-1 ${
                    msg.role === "user" ? "text-indigo-200" : "text-slate-400"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.role === "model" && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 transition p-0.5 text-slate-500 hover:text-slate-800"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
              <Sparkles className="h-4 w-4 text-indigo-600 animate-spin" />
              <span>Professor Gemini is formulating academic guidance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about architecture, viva questions, datasets, or code..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition shadow-xs"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
