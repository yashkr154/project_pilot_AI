import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { IdeaGenerator } from "./components/IdeaGenerator";
import { RoadmapView } from "./components/RoadmapView";
import { ProgressTracker } from "./components/ProgressTracker";
import { LearningResourcesView } from "./components/LearningResourcesView";
import { ProjectProposalExport } from "./components/ProjectProposalExport";
import { AIAdvisorDrawer } from "./components/AIAdvisorDrawer";
import {
  StudentProfile,
  ProjectIdea,
  SavedProject,
  ProjectRoadmap,
} from "./types";
import {
  loadStoredProfile,
  saveStoredProfile,
  loadStoredProjects,
  saveStoredProjects,
  loadActiveProjectId,
  saveActiveProjectId,
} from "./utils/storage";

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(loadStoredProfile());
  const [projects, setProjects] = useState<SavedProject[]>(loadStoredProjects());
  const [activeProjectId, setActiveProjectId] = useState<string>(() =>
    loadActiveProjectId(loadStoredProjects())
  );
  const [currentTab, setCurrentTab] = useState<
    "generator" | "roadmap" | "tracker" | "resources" | "export"
  >("generator");

  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdea[]>([]);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [advisorInitialQuery, setAdvisorInitialQuery] = useState<string | undefined>(undefined);

  // Sync to storage
  const handleSaveProfile = (updated: StudentProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleUpdateProject = (updated: SavedProject) => {
    const nextProjects = projects.map((p) => (p.id === updated.id ? updated : p));
    setProjects(nextProjects);
    saveStoredProjects(nextProjects);
  };

  const handleSelectProject = async (idea: ProjectIdea) => {
    // Check if idea is already in projects
    let existing = projects.find((p) => p.id === idea.id);

    if (!existing) {
      existing = {
        ...idea,
        tasks: [],
        logbook: [],
        savedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const nextProjects = [existing, ...projects];
      setProjects(nextProjects);
      saveStoredProjects(nextProjects);
    }

    setActiveProjectId(existing.id);
    saveActiveProjectId(existing.id);

    // If roadmap already exists, switch to roadmap tab
    if (existing.roadmap) {
      setCurrentTab("roadmap");
      return;
    }

    // Otherwise generate the roadmap automatically
    await handleGenerateRoadmap(existing);
    setCurrentTab("roadmap");
  };

  const handleGenerateRoadmap = async (targetProject: SavedProject) => {
    setIsGeneratingRoadmap(true);
    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle: targetProject.title,
          projectDomain: targetProject.domain,
          problemStatement: targetProject.problemStatement,
          solutionOverview: targetProject.solutionOverview,
          studentSkills: profile.skills,
          targetWeeks: targetProject.estimatedWeeks || 16,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate roadmap.");
      }

      const roadmap: ProjectRoadmap = await response.json();

      // Combine existing tasks if any or use generated tasks
      const initialTasks =
        targetProject.tasks && targetProject.tasks.length > 0
          ? targetProject.tasks
          : roadmap.milestoneTasks.map((t) => ({ ...t, completed: false }));

      const updatedProject: SavedProject = {
        ...targetProject,
        roadmap,
        tasks: initialTasks,
        updatedAt: new Date().toISOString(),
      };

      handleUpdateProject(updatedProject);
    } catch (err: any) {
      console.error("Error generating roadmap:", err);
      alert(err.message || "Failed to generate project roadmap.");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleOpenAdvisorWithQuery = (query: string) => {
    setAdvisorInitialQuery(query);
    setIsAdvisorOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        projects={projects}
        activeProjectId={activeProjectId}
        setActiveProjectId={(id) => {
          setActiveProjectId(id);
          saveActiveProjectId(id);
        }}
        onOpenAdvisor={() => {
          setAdvisorInitialQuery(undefined);
          setIsAdvisorOpen(true);
        }}
        onNewIdea={() => setCurrentTab("generator")}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === "generator" && (
          <IdeaGenerator
            profile={profile}
            setProfile={setProfile}
            onSaveProfile={handleSaveProfile}
            generatedIdeas={generatedIdeas}
            setGeneratedIdeas={setGeneratedIdeas}
            activeProjectId={activeProjectId}
            savedProjects={projects}
            onSelectProject={handleSelectProject}
            onConsultAdvisor={(idea) =>
              handleOpenAdvisorWithQuery(`Can you evaluate this project idea: "${idea.title}"? What are its strengths and risks?`)
            }
            isGeneratingRoadmap={isGeneratingRoadmap}
          />
        )}

        {currentTab === "roadmap" && activeProject && (
          <RoadmapView
            project={activeProject}
            isGeneratingRoadmap={isGeneratingRoadmap}
            onGenerateRoadmap={handleGenerateRoadmap}
            onSwitchToTracker={() => setCurrentTab("tracker")}
            onConsultAdvisor={handleOpenAdvisorWithQuery}
          />
        )}

        {currentTab === "tracker" && activeProject && (
          <ProgressTracker
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onConsultAdvisor={handleOpenAdvisorWithQuery}
          />
        )}

        {currentTab === "resources" && activeProject && (
          <LearningResourcesView
            project={activeProject}
            onConsultAdvisor={handleOpenAdvisorWithQuery}
          />
        )}

        {currentTab === "export" && activeProject && (
          <ProjectProposalExport project={activeProject} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-700 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ProjectPilot</span>
            <span>•</span>
            <span>AI Final-Year Capstone Planner & Viva Preparation</span>
          </div>
          <div className="text-slate-700">
            Powered by Google Gemini 3.8 Flash • Designed for Computer Science & Engineering Undergraduates
          </div>
        </div>
      </footer>

      {/* Interactive AI Advisor Drawer */}
      <AIAdvisorDrawer
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        activeProject={activeProject || null}
        initialQuery={advisorInitialQuery}
      />
    </div>
  );
}
