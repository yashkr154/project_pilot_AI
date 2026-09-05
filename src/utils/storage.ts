import { SavedProject, StudentProfile } from "../types";
import { EXEMPLAR_PROJECTS, INITIAL_PROFILE } from "../data/mockTemplates";

const PROFILE_STORAGE_KEY = "projectpilot_student_profile";
const PROJECTS_STORAGE_KEY = "projectpilot_saved_projects";
const ACTIVE_PROJECT_KEY = "projectpilot_active_project_id";

export function loadStoredProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load stored profile:", e);
  }
  return INITIAL_PROFILE;
}

export function saveStoredProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile:", e);
  }
}

export function loadStoredProjects(): SavedProject[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load stored projects:", e);
  }
  return EXEMPLAR_PROJECTS;
}

export function saveStoredProjects(projects: SavedProject[]): void {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error("Failed to save projects:", e);
  }
}

export function loadActiveProjectId(projects: SavedProject[]): string {
  try {
    const raw = localStorage.getItem(ACTIVE_PROJECT_KEY);
    if (raw && projects.some((p) => p.id === raw)) {
      return raw;
    }
  } catch (e) {
    console.error("Failed to load active project id:", e);
  }
  return projects[0]?.id || "";
}

export function saveActiveProjectId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  } catch (e) {
    console.error("Failed to save active project id:", e);
  }
}

export function calculateProjectProgress(project: SavedProject): {
  completed: number;
  total: number;
  percentage: number;
} {
  const tasks = project.tasks || [];
  if (tasks.length === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const percentage = Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

export function generateProposalMarkdown(project: SavedProject): string {
  const tasks = project.tasks || [];
  const completedTasks = tasks.filter((t) => t.completed).length;
  const roadmap = project.roadmap;

  return `# FINAL YEAR CAPSTONE PROJECT SYNOPSIS & PROPOSAL

**Project Title:** ${project.title}  
**Domain / Field:** ${project.domain}  
**Difficulty Tier:** ${project.difficulty} | **Estimated Duration:** ${project.estimatedWeeks} Weeks  
**Academic Feasibility Score:** ${project.feasibilityScore} / 10  
**Generated Via:** ProjectPilot AI Academic Advisory Platform  
**Date:** ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

---

## 1. ABSTRACT & OVERVIEW
${project.tagline}

${project.solutionOverview}

---

## 2. PROBLEM STATEMENT & MOTIVATION
${project.problemStatement}

**Target Users & Beneficiaries:**
${project.targetAudience}

---

## 3. NOVELTY & INNOVATION FACTOR
${project.noveltyFactor}

**Potential Research & Publication Angle:**
${project.potentialResearchAngle}

---

## 4. PROPOSED SYSTEM ARCHITECTURE & TECH STACK
${roadmap ? `### Architectural Summary\n${roadmap.architectureOverview.summary}\n\n- **Client Tier:** ${roadmap.architectureOverview.clientTier}\n- **Application Tier:** ${roadmap.architectureOverview.applicationTier}\n- **Data & Intelligence Tier:** ${roadmap.architectureOverview.dataAndAiTier}\n- **Security & RBAC:** ${roadmap.architectureOverview.securityAndAuth}\n` : ""}

### Recommended Technologies
- **Frontend:** ${project.recommendedTechStack.frontend.join(", ")}
- **Backend:** ${project.recommendedTechStack.backend.join(", ")}
- **Database:** ${project.recommendedTechStack.database.join(", ")}
- **AI / Specialized:** ${project.recommendedTechStack.aiOrSpecialized.join(", ")}
${project.recommendedTechStack.devops ? `- **DevOps & Tooling:** ${project.recommendedTechStack.devops.join(", ")}` : ""}

---

## 5. CORE FUNCTIONAL MODULES
${project.keyModules.map((mod, idx) => `${idx + 1}. **${mod.name}**: ${mod.description}`).join("\n")}

---

## 6. PROJECT EVALUATION HIGHLIGHTS (FOR VIVA PANEL)
${project.evaluationHighlights.map((item) => `- ${item}`).join("\n")}

---

## 7. PHASED DEVELOPMENT ROADMAP & MILESTONES
${
  roadmap?.phases
    ? roadmap.phases
        .map(
          (phase) =>
            `### Phase ${phase.phaseNumber}: ${phase.phaseName} (${phase.durationWeeks})\n**Objectives:**\n${phase.keyObjectives.map((o) => `  - ${o}`).join("\n")}\n**Deliverables:**\n${phase.deliverables.map((d) => `  - ${d}`).join("\n")}\n**Viva Defense Checkpoint Question:**\n  > "${phase.vivaCheckpointQuestion}"\n`
        )
        .join("\n")
    : "Roadmap not yet generated. Visit the Roadmap tab in ProjectPilot to generate the complete technical breakdown."
}

---

## 8. MILESTONE TASKS STATUS (${completedTasks}/${tasks.length} Completed)
${
  tasks.length > 0
    ? tasks
        .map(
          (t) =>
            `- [${t.completed ? "x" : " "}] Phase ${t.phaseNumber}: **${t.title}** (${t.category}, ${t.estimatedDays} days) - ${t.deliverable}`
        )
        .join("\n")
    : "No tasks populated."
}

---

*Report prepared using ProjectPilot AI. Verified for university review standards.*
`;
}
