import React, { useState } from "react";
import {
  Layers,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Calendar,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Workflow,
  Wand2,
  BookOpen,
  MessageSquareCode,
  FileCheck2,
} from "lucide-react";
import { SavedProject, ProjectRoadmap } from "../types";

interface RoadmapViewProps {
  project: SavedProject;
  isGeneratingRoadmap: boolean;
  onGenerateRoadmap: (project: SavedProject) => void;
  onSwitchToTracker: () => void;
  onConsultAdvisor: (query: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  project,
  isGeneratingRoadmap,
  onGenerateRoadmap,
  onSwitchToTracker,
  onConsultAdvisor,
}) => {
  const [selectedPhaseTab, setSelectedPhaseTab] = useState<number>(1);
  const [activeSection, setActiveSection] = useState<"phases" | "architecture" | "techstack" | "improvements" | "viva">(
    "phases"
  );

  const roadmap: ProjectRoadmap | undefined = project.roadmap;

  if (!roadmap && !isGeneratingRoadmap) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 max-w-2xl mx-auto">
        <div className="inline-flex p-4 rounded-2xl bg-indigo-50 text-indigo-600">
          <Layers className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Technical Blueprint Not Yet Generated</h2>
          <p className="text-sm text-slate-700">
            Generate the comprehensive, university-grade development blueprint for{" "}
            <strong className="text-slate-900 font-semibold">{project.title}</strong>. This includes system
            architecture, component data flows, 6-phase milestones, and viva defense answers.
          </p>
        </div>

        <button
          id="generate-roadmap-now-btn"
          onClick={() => onGenerateRoadmap(project)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition"
        >
          <Sparkles className="h-4 w-4" />
          <span>Generate Complete Engineering Blueprint</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (isGeneratingRoadmap) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex p-4 rounded-2xl bg-indigo-50 text-indigo-600 animate-spin">
          <BrainCircuit className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900">Synthesizing Turnkey Project Blueprint...</h3>
          <p className="text-xs text-slate-700">
            Designing micro-architecture, mapping data pipelines, planning semester timeline phases, scheduling
            milestones, and formulating viva review questions...
          </p>
        </div>
      </div>
    );
  }

  if (!roadmap) return null;

  const currentPhase = roadmap.phases.find((p) => p.phaseNumber === selectedPhaseTab) || roadmap.phases[0];

  return (
    <div className="space-y-6">
      {/* Project Overview Header Bar */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {project.domain}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                Est. {project.estimatedWeeks} Weeks • {project.difficulty}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{project.title}</h1>
            <p className="text-xs font-medium text-indigo-700 mt-0.5">{project.tagline}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="roadmap-consult-advisor-btn"
              onClick={() => onConsultAdvisor(`I need help reviewing the architecture and roadmap for "${project.title}".`)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition"
            >
              <MessageSquareCode className="h-4 w-4 text-indigo-600" />
              <span>Discuss With Guide</span>
            </button>

            <button
              id="roadmap-goto-tracker-btn"
              onClick={onSwitchToTracker}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition"
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Open Milestone Tracker</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pt-1">
          <button
            onClick={() => setActiveSection("phases")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === "phases"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Phased Development Plan</span>
          </button>

          <button
            onClick={() => setActiveSection("architecture")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === "architecture"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Workflow className="h-3.5 w-3.5" />
            <span>System Architecture & Data Flow</span>
          </button>

          <button
            onClick={() => setActiveSection("techstack")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === "techstack"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Tech Stack Justifications</span>
          </button>

          <button
            onClick={() => setActiveSection("improvements")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === "improvements"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Innovations & Research Edge</span>
          </button>

          <button
            onClick={() => setActiveSection("viva")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === "viva"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Viva Defense Prep</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Phased Development Plan */}
      {activeSection === "phases" && (
        <div className="space-y-4">
          {/* Phase Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {roadmap.phases.map((phase) => {
              const isSelected = phase.phaseNumber === currentPhase.phaseNumber;
              return (
                <button
                  key={phase.phaseNumber}
                  onClick={() => setSelectedPhaseTab(phase.phaseNumber)}
                  className={`p-3 rounded-xl border text-left transition ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block ${
                      isSelected ? "text-indigo-200" : "text-slate-700"
                    }`}
                  >
                    Phase {phase.phaseNumber} • {phase.durationWeeks}
                  </span>
                  <p className="text-xs font-semibold truncate mt-0.5">{phase.phaseName}</p>
                </button>
              );
            })}
          </div>

          {/* Current Phase Detail Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Phase {currentPhase.phaseNumber} Plan
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">{currentPhase.phaseName}</h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto">
                Duration: {currentPhase.durationWeeks}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Objectives */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  <span>Key Objectives</span>
                </h3>
                <ul className="space-y-2">
                  {currentPhase.keyObjectives.map((obj, i) => (
                    <li key={i} className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tangible Deliverables */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  <span>Tangible Academic Deliverables</span>
                </h3>
                <ul className="space-y-2">
                  {currentPhase.deliverables.map((del, i) => (
                    <li key={i} className="text-xs text-slate-700 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Viva checkpoint question */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <HelpCircle className="h-4 w-4 text-amber-600" />
                <span>Internal Review Checkpoint Question (Viva Defense Preview):</span>
              </div>
              <p className="text-xs text-amber-950 font-medium italic pl-6">
                "{currentPhase.vivaCheckpointQuestion}"
              </p>
              <div className="pt-2 pl-6">
                <button
                  onClick={() =>
                    onConsultAdvisor(
                      `In Phase ${currentPhase.phaseNumber} of "${project.title}", how should I answer this review question: "${currentPhase.vivaCheckpointQuestion}"?`
                    )
                  }
                  className="text-[11px] font-semibold text-amber-900 hover:text-amber-950 underline inline-flex items-center gap-1"
                >
                  <span>Ask Professor Gemini for model answer & defense strategy</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Architecture & Data Flow */}
      {activeSection === "architecture" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">System Architecture & Component Topology</h2>
            <p className="text-xs text-slate-700 mt-1">{roadmap.architectureOverview.summary}</p>
          </div>

          {/* 4-Tier Architecture Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Cpu className="h-4 w-4 text-indigo-600" />
                <span>Client & Presentation Tier</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{roadmap.architectureOverview.clientTier}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Workflow className="h-4 w-4 text-blue-600" />
                <span>Application & Gateway Tier</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{roadmap.architectureOverview.applicationTier}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <BrainCircuit className="h-4 w-4 text-purple-600" />
                <span>Data & Intelligence Tier</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{roadmap.architectureOverview.dataAndAiTier}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Security, RBAC & Compliance</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{roadmap.architectureOverview.securityAndAuth}</p>
            </div>
          </div>

          {/* End-to-End Data Pipeline Steps */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Step-by-Step Data Flow Pipeline
            </h3>
            <div className="space-y-2">
              {roadmap.architectureOverview.dataFlowSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50/40 border border-indigo-100/60">
                  <span className="h-5 w-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Tech Stack Justifications */}
      {activeSection === "techstack" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Technology Stack Justifications</h2>
            <p className="text-xs text-slate-700 mt-0.5">
              External examiners always ask: "Why did you choose this technology instead of alternatives?" Here are
              the academic rationales and comparative arguments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmap.techStackDetails.map((tech, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                    {tech.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-white text-slate-900 border border-slate-200">
                    {tech.selectedTool}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{tech.rationale}</p>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded-lg">
                  <strong>Viva Panel Appeal:</strong> {tech.academicEvaluationBenefit}
                </div>

                {tech.alternatives && tech.alternatives.length > 0 && (
                  <p className="text-[10px] text-slate-700">
                    Alternatives considered: {tech.alternatives.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: High Impact Improvements & Research Edge */}
      {activeSection === "improvements" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Academic Innovations & Research Enhancements</h2>
            <p className="text-xs text-slate-700 mt-0.5">
              Distinguish your capstone from generic student clones. These features add publication credibility and
              boost evaluation scores from average to grade 'A'.
            </p>
          </div>

          <div className="space-y-4">
            {roadmap.improvementsAndInnovations.map((imp, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900">{imp.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800 self-start sm:self-auto">
                    {imp.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <strong className="text-slate-800 block mb-0.5">Expected Impact:</strong>
                    <p className="text-slate-600">{imp.impact}</p>
                  </div>
                  <div>
                    <strong className="text-slate-800 block mb-0.5">Implementation Guidance:</strong>
                    <p className="text-slate-600">{imp.howToImplement}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-100 text-[11px] text-purple-900 font-medium">
                  <strong>Conference / IEEE Paper Potential:</strong> {imp.academicPaperPotential}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: Viva Preparation Tips */}
      {activeSection === "viva" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Viva Voce Defense Preparation & Model Answers</h2>
            <p className="text-xs text-slate-700 mt-0.5">
              Anticipate the tough technical cross-questions asked by external evaluators during project defense.
            </p>
          </div>

          <div className="space-y-4">
            {roadmap.vivaPreparationTips.map((tip, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    Q
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">{tip.question}</h3>
                </div>

                <div className="pl-7">
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 text-xs text-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                      Recommended Defense Strategy:
                    </span>
                    <p className="leading-relaxed">{tip.modelAnswerStrategy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
