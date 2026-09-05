import React, { useState } from "react";
import {
  FileDown,
  Copy,
  Printer,
  Check,
  GraduationCap,
  Sparkles,
  Layers,
  FileCheck2,
} from "lucide-react";
import { SavedProject } from "../types";
import { generateProposalMarkdown } from "../utils/storage";

interface ProjectProposalExportProps {
  project: SavedProject;
}

export const ProjectProposalExport: React.FC<ProjectProposalExportProps> = ({ project }) => {
  const [copied, setCopied] = useState(false);

  const markdownContent = generateProposalMarkdown(project);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const completedTasks = project.tasks?.filter((t) => t.completed).length || 0;
  const totalTasks = project.tasks?.length || 0;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Academic Submission Documentation
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            Capstone Project Synopsis & Formal Proposal
          </h1>
          <p className="text-xs text-slate-700 mt-0.5">
            Auto-formatted according to university and accreditation (ABET/NBA) standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-proposal-markdown-btn"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy as Markdown</span>
              </>
            )}
          </button>

          <button
            id="print-proposal-btn"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Formal Paper / Document Preview Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="text-center border-b-2 border-slate-900 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold tracking-wider uppercase mb-2">
            Final Year Undergraduate Capstone Proposal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {project.title}
          </h1>
          <p className="text-sm font-medium text-slate-600 italic">{project.tagline}</p>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-slate-500 pt-2">
            <span>
              <strong>Domain:</strong> {project.domain}
            </span>
            <span>•</span>
            <span>
              <strong>Academic Feasibility:</strong> {project.feasibilityScore}/10
            </span>
            <span>•</span>
            <span>
              <strong>Scope:</strong> ~{project.estimatedWeeks} Weeks ({project.difficulty})
            </span>
            <span>•</span>
            <span>
              <strong>Generated:</strong> {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}
            </span>
          </div>
        </div>

        {/* Section 1: Abstract & Problem Statement */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            1. Problem Statement & Motivation
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">{project.problemStatement}</p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs text-slate-700">
            <strong>Target Stakeholders / End-Users: </strong>
            {project.targetAudience}
          </div>
        </div>

        {/* Section 2: Solution Architecture & Novelty */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            2. Proposed Solution & Academic Novelty
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">{project.solutionOverview}</p>
          <div className="bg-amber-50/70 p-3.5 rounded-lg border border-amber-200 text-xs text-amber-950">
            <strong>Novelty & Innovation Factor: </strong>
            {project.noveltyFactor}
          </div>
          {project.potentialResearchAngle && (
            <p className="text-xs text-slate-600">
              <strong>Publication / Conference Potential: </strong>
              {project.potentialResearchAngle}
            </p>
          )}
        </div>

        {/* Section 3: System Architecture & Technologies */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            3. System Architecture & Technical Specifications
          </h2>
          {project.roadmap ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed">
                {project.roadmap.architectureOverview.summary}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Presentation Layer:</strong>
                  <span className="text-slate-600">{project.roadmap.architectureOverview.clientTier}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Application & Gateway Layer:</strong>
                  <span className="text-slate-600">{project.roadmap.architectureOverview.applicationTier}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Data & Intelligence Layer:</strong>
                  <span className="text-slate-600">{project.roadmap.architectureOverview.dataAndAiTier}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Security & Access Control:</strong>
                  <span className="text-slate-600">{project.roadmap.architectureOverview.securityAndAuth}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              Detailed micro-architecture blueprint will be generated in Section 4.
            </p>
          )}

          {/* Tech stack list */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-800 mb-2">Technology Stack Selection:</h3>
            <ul className="text-xs text-slate-700 space-y-1 list-disc pl-5">
              <li>
                <strong>Frontend:</strong> {project.recommendedTechStack.frontend.join(", ")}
              </li>
              <li>
                <strong>Backend:</strong> {project.recommendedTechStack.backend.join(", ")}
              </li>
              <li>
                <strong>Database & Storage:</strong> {project.recommendedTechStack.database.join(", ")}
              </li>
              <li>
                <strong>AI Models & Specialized Tooling:</strong>{" "}
                {project.recommendedTechStack.aiOrSpecialized.join(", ")}
              </li>
              {project.recommendedTechStack.devops && (
                <li>
                  <strong>DevOps & Infrastructure:</strong> {project.recommendedTechStack.devops.join(", ")}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Section 4: Key Modules */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            4. Core Functional Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.keyModules.map((mod, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-xs font-bold text-indigo-700">Module {idx + 1}: {mod.name}</span>
                <p className="text-xs text-slate-600">{mod.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Phased Roadmap & Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              5. Phased Semester Development Plan
            </h2>
            <span className="text-xs font-bold text-slate-700">
              Progress: {completedTasks} of {totalTasks} Milestones Verified
            </span>
          </div>

          {project.roadmap?.phases ? (
            <div className="space-y-3">
              {project.roadmap.phases.map((phase) => (
                <div key={phase.phaseNumber} className="border border-slate-200 rounded-lg p-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>
                      Phase {phase.phaseNumber}: {phase.phaseName}
                    </span>
                    <span className="text-slate-500 font-normal">{phase.durationWeeks}</span>
                  </div>
                  <p className="text-slate-600">
                    <strong>Deliverables:</strong> {phase.deliverables.join("; ")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">Roadmap phases will be outlined here.</p>
          )}
        </div>

        {/* Section 6: Evaluation & Viva Checklist */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            6. Project Evaluation Criteria & Viva Defense Highlights
          </h2>
          <ul className="text-xs text-slate-700 space-y-1 list-disc pl-5">
            {project.evaluationHighlights.map((hl, i) => (
              <li key={i}>{hl}</li>
            ))}
          </ul>
        </div>

        {/* Signature & Sign-Off Blocks */}
        <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs text-slate-700">
          <div className="space-y-8">
            <div className="h-8 border-b border-slate-300" />
            <span className="font-semibold block">Student Candidate Signature</span>
          </div>
          <div className="space-y-8">
            <div className="h-8 border-b border-slate-300" />
            <span className="font-semibold block">Internal Faculty Guide</span>
          </div>
          <div className="space-y-8 col-span-2 sm:col-span-1">
            <div className="h-8 border-b border-slate-300" />
            <span className="font-semibold block">Head of Department (HOD)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
