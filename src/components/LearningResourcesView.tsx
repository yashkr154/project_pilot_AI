import React, { useState } from "react";
import {
  BookOpen,
  ExternalLink,
  Search,
  Sparkles,
  FileText,
  Github,
  Database,
  GraduationCap,
  BookmarkPlus,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { SavedProject, LearningResource } from "../types";

interface LearningResourcesViewProps {
  project: SavedProject;
  onConsultAdvisor: (query: string) => void;
}

export const LearningResourcesView: React.FC<LearningResourcesViewProps> = ({
  project,
  onConsultAdvisor,
}) => {
  const [activeTab, setActiveTab] = useState<"project" | "search">("project");
  const [customTopic, setCustomTopic] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [customResults, setCustomResults] = useState<{
    topic: string;
    summaryAdvice: string;
    resources: any[];
  } | null>(null);
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);

  const defaultResources = project.roadmap?.learningResources || [];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(text);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const handleFetchCustomResources = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch("/api/suggest-resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: customTopic.trim(),
          context: `Final year project: ${project.title}. Domain: ${project.domain}. Tech Stack: ${JSON.stringify(
            project.recommendedTechStack
          )}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch curated resources.");
      }

      const data = await response.json();
      setCustomResults(data);
      setActiveTab("search");
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const getResourceIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("paper") || t.includes("ieee") || t.includes("research")) {
      return <FileText className="h-4 w-4 text-purple-600" />;
    }
    if (t.includes("dataset") || t.includes("kaggle")) {
      return <Database className="h-4 w-4 text-emerald-600" />;
    }
    if (t.includes("repo") || t.includes("github")) {
      return <Github className="h-4 w-4 text-slate-800" />;
    }
    return <BookOpen className="h-4 w-4 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Academic & Technical Reference Library
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Curated Learning Resources, Datasets & Research Papers
            </h1>
            <p className="text-xs text-slate-700 mt-0.5">
              Verified literature and documentation for <strong>{project.title}</strong> to cite in your literature
              survey chapter.
            </p>
          </div>

          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("project")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                activeTab === "project" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
              }`}
            >
              Curated for Project ({defaultResources.length})
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                activeTab === "search" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
              }`}
            >
              On-Demand Deep Dive
            </button>
          </div>
        </div>

        {/* Search input for specific blocker / library */}
        <form onSubmit={handleFetchCustomResources} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search tutorials or papers on any specific algorithm, model, or tool (e.g., 'FastAPI WebSockets with Redis' or 'YOLOv8 custom dataset fine-tuning')..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !customTopic.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition disabled:opacity-50 shrink-0"
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Curating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Find Targeted Resources</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Main Content Area */}
      {activeTab === "project" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Core References & Documentation for {project.title}
            </h2>
            <span className="text-xs text-slate-700">
              Include these in Chapter 2 (Literature Survey) & Bibliography
            </span>
          </div>

          {defaultResources.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs">
              Generate the project roadmap first to populate project-specific literature and datasets, or use the
              search bar above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {defaultResources.map((res, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-100">{getResourceIcon(res.type)}</div>
                        <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                          {res.type}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                        {res.providerOrTopic}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{res.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {/* Suggested scholar / arXiv search */}
                    <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold text-slate-700 block">Recommended Search Query:</span>
                        <span className="text-xs text-slate-700 font-mono truncate block">
                          {res.suggestedSearchQuery}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(res.suggestedSearchQuery)}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition shrink-0"
                        title="Copy search query for Google Scholar / arXiv"
                      >
                        {copiedQuery === res.suggestedSearchQuery ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    {res.recommendedUrl && (
                      <a
                        href={res.recommendedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        <span>Visit Direct Resource</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* On-Demand Search Results Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          {customResults ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
                <span className="text-xs font-bold text-indigo-900 block">
                  AI Mentor Advice for: "{customResults.topic}"
                </span>
                <p className="text-xs text-indigo-950 mt-1 leading-relaxed">{customResults.summaryAdvice}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customResults.resources?.map((res, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                          {res.type}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">
                          {res.provider}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{res.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                        <strong className="text-slate-900">Key Takeaway: </strong>
                        {res.keyTakeaway}
                      </div>
                    </div>

                    {res.url && (
                      <div className="pt-2 border-t border-slate-100">
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          <span>Open Resource</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs">
              Type any topic or tool in the search bar above to generate tailored tutorials, official docs, and
              research citations.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
