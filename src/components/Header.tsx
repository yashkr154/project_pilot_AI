import React from "react";
import {
  GraduationCap,
  Sparkles,
  Layers,
  CheckCircle2,
  FileDown,
  MessageSquareCode,
  FolderGit2,
  PlusCircle,
} from "lucide-react";
import { SavedProject } from "../types";
import { calculateProjectProgress } from "../utils/storage";

interface HeaderProps {
  currentTab: "generator" | "roadmap" | "tracker" | "resources" | "export";
  setCurrentTab: (tab: "generator" | "roadmap" | "tracker" | "resources" | "export") => void;
  projects: SavedProject[];
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  onOpenAdvisor: () => void;
  onNewIdea: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  projects,
  activeProjectId,
  setActiveProjectId,
  onOpenAdvisor,
  onNewIdea,
}) => {
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const progress = activeProject ? calculateProjectProgress(activeProject) : { percentage: 0, completed: 0, total: 0 };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">ProjectPilot</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                  FINAL YEAR AI
                </span>
              </div>
              <p className="text-xs text-slate-700 hidden sm:block">Capstone Generator & Roadmap Platform</p>
            </div>
          </div>

          {/* Active Project Selector & Quick Stats */}
          {activeProject && (
            <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 max-w-md">
              <FolderGit2 className="h-4 w-4 text-indigo-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-700 uppercase tracking-wider">Active Capstone:</span>
                  <select
                    id="header-project-select"
                    value={activeProject.id}
                    aria-label="Active Project"
                    onChange={(e) => {
                      if (e.target.value === "new") {
                        onNewIdea();
                      } else {
                        setActiveProjectId(e.target.value);
                      }
                    }}
                    className="text-xs font-semibold text-slate-800 bg-transparent truncate border-0 p-0 focus:ring-0 cursor-pointer max-w-[200px]"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                    <option value="new">+ Brainstorm New Idea</option>
                  </select>
                </div>
              </div>
              {/* Progress gauge */}
              <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-200">
                <div className="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-700">{progress.percentage}%</span>
              </div>
            </div>
          )}

          {/* Actions: AI Advisor & Quick Brainstorm */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="header-ai-advisor-btn"
              onClick={onOpenAdvisor}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs transition border border-indigo-200"
              title="Open Professor Gemini AI Project Advisor"
            >
              <MessageSquareCode className="h-4 w-4 text-indigo-600" />
              <span className="hidden sm:inline">AI Viva Guide</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            <button
              id="header-new-idea-btn"
              onClick={onNewIdea}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Idea</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-t border-slate-100 pt-1 pb-1 overflow-x-auto scrollbar-none">
          <button
            id="tab-generator"
            onClick={() => setCurrentTab("generator")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              currentTab === "generator"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Idea Discovery</span>
          </button>

          <button
            id="tab-roadmap"
            onClick={() => setCurrentTab("roadmap")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              currentTab === "roadmap"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Architecture & Blueprint</span>
            {activeProject?.roadmap && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            id="tab-tracker"
            onClick={() => setCurrentTab("tracker")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              currentTab === "tracker"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Milestone Tracker</span>
            {progress.total > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                currentTab === "tracker" ? "bg-indigo-800 text-indigo-100" : "bg-slate-200 text-slate-700"
              }`}>
                {progress.completed}/{progress.total}
              </span>
            )}
          </button>

          <button
            id="tab-resources"
            onClick={() => setCurrentTab("resources")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              currentTab === "resources"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Learning Resources & Papers</span>
          </button>

          <button
            id="tab-export"
            onClick={() => setCurrentTab("export")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              currentTab === "export"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>Proposal & Synopsis Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
