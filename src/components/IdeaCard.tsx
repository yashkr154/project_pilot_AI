import React from "react";
import {
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2,
  BrainCircuit,
  Target,
  Code2,
  Lightbulb,
  Award,
  Layers,
  MessageSquareCode,
} from "lucide-react";
import { ProjectIdea } from "../types";

interface IdeaCardProps {
  idea: ProjectIdea;
  isActive: boolean;
  hasRoadmap: boolean;
  isGeneratingRoadmap: boolean;
  onSelectAndGenerateRoadmap: (idea: ProjectIdea) => void;
  onConsultAdvisor: (idea: ProjectIdea) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  isActive,
  hasRoadmap,
  isGeneratingRoadmap,
  onSelectAndGenerateRoadmap,
  onConsultAdvisor,
}) => {
  const getFeasibilityColor = (score: number) => {
    if (score >= 8.5) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 7.0) return "text-blue-700 bg-blue-50 border-blue-200";
    return "text-amber-700 bg-amber-50 border-amber-200";
  };

  return (
    <div
      id={`idea-card-${idea.id}`}
      className={`rounded-2xl bg-white border transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden ${
        isActive
          ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Top Banner / Badges */}
      <div className="p-5 pb-4 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-transparent">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {idea.domain}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
              {idea.difficulty} • ~{idea.estimatedWeeks} wks
            </span>
            {isActive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Check className="h-3 w-3" /> Active Project
              </span>
            )}
          </div>

          {/* Feasibility score */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${getFeasibilityColor(
              idea.feasibilityScore
            )}`}
            title={idea.feasibilityRationale}
          >
            <Award className="h-3.5 w-3.5" />
            <span>Feasibility: {idea.feasibilityScore}/10</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug mb-1">
          {idea.title}
        </h3>
        <p className="text-xs font-medium text-indigo-700 line-clamp-1">{idea.tagline}</p>
      </div>

      {/* Main Content Body */}
      <div className="p-5 pt-3 space-y-4 flex-1">
        {/* Problem & Solution */}
        <div className="space-y-2">
          <div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              The Real Problem:
            </span>
            <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{idea.problemStatement}</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mb-1">
              <Target className="h-3.5 w-3.5 text-indigo-600" />
              <span>Proposed Solution Architecture</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{idea.solutionOverview}</p>
          </div>
        </div>

        {/* Novelty Factor */}
        <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-200/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
            <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
            <span>Academic Novelty & Viva Edge</span>
          </div>
          <p className="text-xs text-amber-950/80 leading-relaxed">{idea.noveltyFactor}</p>
        </div>

        {/* Recommended Tech Stack */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            <Code2 className="h-3.5 w-3.5 text-indigo-600" />
            <span>Recommended Tech Stack</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {idea.recommendedTechStack.aiOrSpecialized?.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200"
              >
                {tech}
              </span>
            ))}
            {idea.recommendedTechStack.backend?.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                {tech}
              </span>
            ))}
            {idea.recommendedTechStack.frontend?.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                {tech}
              </span>
            ))}
            {idea.recommendedTechStack.database?.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Key Modules preview */}
        {idea.keyModules && idea.keyModules.length > 0 && (
          <div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Key Functional Modules:
            </span>
            <ul className="space-y-1">
              {idea.keyModules.slice(0, 3).map((mod, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-slate-800">{mod.name}:</strong> {mod.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Evaluation Highlights */}
        {idea.evaluationHighlights && (
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-700 block mb-1">
              Evaluation Scoring Highlights:
            </span>
            <div className="flex flex-wrap gap-1">
              {idea.evaluationHighlights.map((hl, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span className="truncate max-w-xs">{hl}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
        <button
          id={`consult-advisor-${idea.id}`}
          onClick={() => onConsultAdvisor(idea)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-white border border-slate-200 bg-white transition"
          title="Ask Professor Gemini about this project"
        >
          <MessageSquareCode className="h-3.5 w-3.5 text-indigo-600" />
          <span>Ask Guide</span>
        </button>

        <button
          id={`build-roadmap-${idea.id}`}
          onClick={() => onSelectAndGenerateRoadmap(idea)}
          disabled={isGeneratingRoadmap}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition flex-1 ${
            isActive && hasRoadmap
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          } disabled:opacity-50`}
        >
          {isGeneratingRoadmap ? (
            <>
              <BrainCircuit className="h-4 w-4 animate-spin" />
              <span>Generating Blueprint...</span>
            </>
          ) : hasRoadmap ? (
            <>
              <Layers className="h-4 w-4" />
              <span>View Technical Blueprint</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Adopt & Generate Roadmap</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
