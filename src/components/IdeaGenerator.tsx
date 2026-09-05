import React, { useState } from "react";
import {
  Sparkles,
  GraduationCap,
  Layers,
  Wand2,
  Brain,
  Sliders,
  AlertCircle,
  Plus,
  X,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { ProjectIdea, StudentProfile, SavedProject } from "../types";
import {
  DEFAULT_BRANCHES,
  POPULAR_SKILLS,
  INTEREST_DOMAINS,
  PROJECT_TYPES,
  TEAM_SIZES,
} from "../data/mockTemplates";
import { IdeaCard } from "./IdeaCard";

interface IdeaGeneratorProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onSaveProfile: (profile: StudentProfile) => void;
  generatedIdeas: ProjectIdea[];
  setGeneratedIdeas: React.Dispatch<React.SetStateAction<ProjectIdea[]>>;
  activeProjectId: string;
  savedProjects: SavedProject[];
  onSelectProject: (idea: ProjectIdea) => void;
  onConsultAdvisor: (idea: ProjectIdea) => void;
  isGeneratingRoadmap: boolean;
}

export const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({
  profile,
  setProfile,
  onSaveProfile,
  generatedIdeas,
  setGeneratedIdeas,
  activeProjectId,
  savedProjects,
  onSelectProject,
  onConsultAdvisor,
  isGeneratingRoadmap,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const toggleSkill = (skill: string) => {
    const nextSkills = profile.skills.includes(skill)
      ? profile.skills.filter((s) => s !== skill)
      : [...profile.skills, skill];
    const updated = { ...profile, skills: nextSkills };
    setProfile(updated);
    onSaveProfile(updated);
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      const updated = { ...profile, skills: [...profile.skills, trimmed] };
      setProfile(updated);
      onSaveProfile(updated);
      setCustomSkillInput("");
    }
  };

  const toggleInterest = (interest: string) => {
    const nextInterests = profile.interests.includes(interest)
      ? profile.interests.filter((i) => i !== interest)
      : [...profile.interests, interest];
    const updated = { ...profile, interests: nextInterests };
    setProfile(updated);
    onSaveProfile(updated);
  };

  const handleGenerateIdeas = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate ideas from server.");
      }

      const data = await response.json();
      if (data.ideas && Array.isArray(data.ideas)) {
        setGeneratedIdeas(data.ideas);
      } else {
        throw new Error("Invalid response format received from AI model.");
      }
    } catch (err: any) {
      console.error("Error generating ideas:", err);
      setErrorMsg(err.message || "An unexpected error occurred while generating ideas.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero / Motivation Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/20">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
            <span>AI Final-Year Capstone Ideation & Feasibility Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Transform Your Skills Into An Outstanding Final-Year Capstone
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Tell us your branch, existing technologies, and domain interests. ProjectPilot generates academically
            sound, high-novelty project ideas complete with system architecture, milestone checklists, and viva defense
            strategies.
          </p>
        </div>
      </div>

      {/* Main Form: Student Profile Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Student Profile & Technical Stack</h2>
              <p className="text-xs text-slate-700">Tailors project ideas to your current strengths and course requirements</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>{showAdvancedSettings ? "Hide Options" : "More Options"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Branch / Major */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Academic Branch / Discipline
            </label>
            <select
              value={profile.branch}
              onChange={(e) => {
                const updated = { ...profile, branch: e.target.value };
                setProfile(updated);
                onSaveProfile(updated);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium transition shadow-2xs"
            >
              {DEFAULT_BRANCHES.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {/* Project Format */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Project Format & Scope
            </label>
            <select
              value={profile.projectType}
              onChange={(e) => {
                const updated = { ...profile, projectType: e.target.value };
                setProfile(updated);
                onSaveProfile(updated);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium transition shadow-2xs"
            >
              {PROJECT_TYPES.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills Selection */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Your Current Technical Skills ({profile.skills.length} Selected)
            </label>
            <span className="text-[11px] text-slate-700">Click to toggle or add custom</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {POPULAR_SKILLS.map((skill) => {
              const selected = profile.skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                    selected
                      ? "bg-indigo-600 text-white shadow-xs font-semibold"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60"
                  }`}
                >
                  {selected && <Sparkles className="h-3 w-3" />}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>

          {/* Custom skill input */}
          <form onSubmit={addCustomSkill} className="flex gap-2 max-w-sm pt-1">
            <input
              type="text"
              placeholder="Add other skill (e.g. ROS, Web3, Rust)..."
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
            <button
              type="submit"
              disabled={!customSkillInput.trim()}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold disabled:opacity-40 transition flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Interest Domains */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Domains & Impact Areas of Interest ({profile.interests.length} Selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_DOMAINS.map((domain) => {
              const selected = profile.interests.includes(domain);
              return (
                <button
                  key={domain}
                  type="button"
                  onClick={() => toggleInterest(domain)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                    selected
                      ? "bg-purple-600 text-white shadow-xs font-semibold"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60"
                  }`}
                >
                  {selected && <Sparkles className="h-3 w-3" />}
                  <span>{domain}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Settings Drawer */}
        {showAdvancedSettings && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 bg-slate-50/50 p-4 rounded-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Team Composition</label>
              <select
                value={profile.teamSize}
                onChange={(e) => {
                  const updated = { ...profile, teamSize: e.target.value };
                  setProfile(updated);
                  onSaveProfile(updated);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
              >
                {TEAM_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Preferred Difficulty</label>
              <select
                value={profile.difficulty}
                onChange={(e) => {
                  const updated = { ...profile, difficulty: e.target.value };
                  setProfile(updated);
                  onSaveProfile(updated);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
              >
                <option value="Beginner-Friendly">Beginner-Friendly (Solid implementation, lower risk)</option>
                <option value="Intermediate">Intermediate (Industry standard, solid viva score)</option>
                <option value="Advanced / Research-Grade">Advanced / Research-Grade (Patent / Paper potential)</option>
              </select>
            </div>
          </div>
        )}

        {/* Custom prompt / constraints */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Specific Requirements, College Guidelines, or Ideas You Want to Incorporate
          </label>
          <textarea
            rows={2}
            value={profile.customPrompt}
            onChange={(e) => {
              const updated = { ...profile, customPrompt: e.target.value };
              setProfile(updated);
              onSaveProfile(updated);
            }}
            placeholder="e.g., Must have a mobile app component, or needs to deploy on low-cost hardware like Raspberry Pi, or emphasize privacy-preserving AI..."
            className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Generation Notice</p>
              <p className="mt-0.5 text-rose-700">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <Brain className="h-4 w-4 text-indigo-600" />
            <span>Powered by Google Gemini 3.8 Flash • Generates 4 verified capstone architectures</span>
          </div>

          <button
            id="generate-ideas-btn"
            type="button"
            onClick={handleGenerateIdeas}
            disabled={isGenerating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Synthesizing Academic Projects...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                <span>Generate Capstone Ideas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Project Ideas Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {generatedIdeas.length > 0 ? "Curated Project Proposals" : "Featured Exemplar Capstones"}
            </h2>
            <p className="text-xs text-slate-700">
              Select any project to explore its full architecture, milestone schedule, and viva defense answers.
            </p>
          </div>

          {generatedIdeas.length > 0 && (
            <button
              onClick={handleGenerateIdeas}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 bg-white transition"
            >
              <RefreshCw className={`h-3 w-3 ${isGenerating ? "animate-spin" : ""}`} />
              <span>Regenerate Ideas</span>
            </button>
          )}
        </div>

        {/* Empty state while generating */}
        {isGenerating && (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <div className="inline-flex p-4 rounded-2xl bg-indigo-50 text-indigo-600 animate-bounce">
              <Brain className="h-8 w-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-base font-bold text-slate-900">Consulting Professor Gemini...</h3>
              <p className="text-xs text-slate-700">
                Evaluating domain feasibility, determining academic novelty, matching modern frameworks to your
                skills, and calculating university review committee scoring...
              </p>
            </div>
          </div>
        )}

        {/* Ideas Grid */}
        {!isGenerating && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(generatedIdeas.length > 0 ? generatedIdeas : savedProjects).map((idea) => {
              const isActive = activeProjectId === idea.id;
              const savedMatch = savedProjects.find((p) => p.id === idea.id);
              const hasRoadmap = Boolean(savedMatch?.roadmap);

              return (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  isActive={isActive}
                  hasRoadmap={hasRoadmap}
                  isGeneratingRoadmap={isGeneratingRoadmap && isActive}
                  onSelectAndGenerateRoadmap={onSelectProject}
                  onConsultAdvisor={onConsultAdvisor}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
