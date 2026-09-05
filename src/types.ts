export interface StudentProfile {
  branch: string;
  skills: string[];
  interests: string[];
  projectType: string;
  teamSize: string;
  difficulty: string;
  customPrompt: string;
}

export interface RecommendedTechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  aiOrSpecialized: string[];
  devops?: string[];
}

export interface KeyModule {
  name: string;
  description: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  tagline: string;
  domain: string;
  problemStatement: string;
  solutionOverview: string;
  noveltyFactor: string;
  targetAudience: string;
  feasibilityScore: number;
  feasibilityRationale: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | string;
  estimatedWeeks: number;
  recommendedTechStack: RecommendedTechStack;
  keyModules: KeyModule[];
  potentialResearchAngle: string;
  evaluationHighlights: string[];
}

export interface ArchitectureOverview {
  summary: string;
  clientTier: string;
  applicationTier: string;
  dataAndAiTier: string;
  securityAndAuth: string;
  dataFlowSteps: string[];
}

export interface TechStackDetail {
  category: string;
  selectedTool: string;
  rationale: string;
  academicEvaluationBenefit: string;
  alternatives?: string[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseName: string;
  durationWeeks: string;
  keyObjectives: string[];
  deliverables: string[];
  vivaCheckpointQuestion: string;
}

export interface MilestoneTask {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  category: string;
  estimatedDays: number;
  priority: "High" | "Medium" | "Low" | string;
  deliverable: string;
  completed?: boolean;
  completedAt?: string;
  notes?: string;
}

export interface LearningResource {
  title: string;
  type: string;
  providerOrTopic: string;
  description: string;
  suggestedSearchQuery: string;
  recommendedUrl?: string;
}

export interface ProjectImprovement {
  title: string;
  category: string;
  impact: string;
  howToImplement: string;
  academicPaperPotential: string;
}

export interface VivaQuestion {
  question: string;
  modelAnswerStrategy: string;
}

export interface ProjectRoadmap {
  architectureOverview: ArchitectureOverview;
  techStackDetails: TechStackDetail[];
  phases: RoadmapPhase[];
  milestoneTasks: MilestoneTask[];
  learningResources: LearningResource[];
  improvementsAndInnovations: ProjectImprovement[];
  vivaPreparationTips: VivaQuestion[];
}

export interface LogbookEntry {
  id: string;
  date: string;
  title: string;
  summary: string;
  advisorFeedback?: string;
  nextSteps: string;
}

export interface SavedProject extends ProjectIdea {
  roadmap?: ProjectRoadmap;
  tasks: MilestoneTask[];
  logbook: LogbookEntry[];
  savedAt: string;
  updatedAt: string;
}

export interface AdvisorChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}
