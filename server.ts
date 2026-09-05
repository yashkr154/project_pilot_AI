import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy get or initialize Google Gen AI
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not set. Using fallback or simulated response mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: Generate Project Ideas
app.post("/api/generate-ideas", async (req, res) => {
  try {
    const {
      branch = "Computer Science & Engineering",
      skills = [],
      interests = [],
      projectType = "Capstone / Final Year Project (2 Semesters)",
      teamSize = "Solo",
      customPrompt = "",
      difficulty = "Intermediate",
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not configured in Settings > Secrets.",
      });
    }

    const ai = getAIClient();

    const prompt = `You are a distinguished University Computer Science Professor, Capstone Project Coordinator, and Senior Tech Lead.
Generate 4 unique, practical, and academically rigorous final-year project ideas tailored for a student with the following profile:

- Academic Branch/Major: ${branch}
- Core Skills & Languages: ${skills.join(", ") || "General Programming (Python, JavaScript, SQL)"}
- Passions & Domains of Interest: ${interests.join(", ") || "Artificial Intelligence, Web Applications, Cloud"}
- Project Scope/Format: ${projectType}
- Team Configuration: ${teamSize}
- Preferred Difficulty: ${difficulty}
- Specific Student Interests / Constraints: ${customPrompt || "Focus on real-world impact and modern industry standards."}

Requirements for each project idea:
1. It MUST solve a tangible real-world problem, not be a generic toy clone (e.g. avoid basic todo apps or standard e-commerce clones).
2. It should have academic depth with clear novelty (e.g., algorithm optimization, privacy-preserving techniques, multimodal AI, edge computing, smart automation, or domain-specific innovation).
3. The technologies recommended must leverage the student's skills while introducing 1-2 valuable modern industry tools to help their resume and viva evaluation.
4. Feasibility rating (1-10) should realistically reflect whether a final-year student/team can finish it within the specified timeframe.

Provide the output strictly as a JSON object adhering to the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  domain: { type: Type.STRING },
                  problemStatement: { type: Type.STRING },
                  solutionOverview: { type: Type.STRING },
                  noveltyFactor: { type: Type.STRING },
                  targetAudience: { type: Type.STRING },
                  feasibilityScore: { type: Type.NUMBER },
                  feasibilityRationale: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  estimatedWeeks: { type: Type.NUMBER },
                  recommendedTechStack: {
                    type: Type.OBJECT,
                    properties: {
                      frontend: { type: Type.ARRAY, items: { type: Type.STRING } },
                      backend: { type: Type.ARRAY, items: { type: Type.STRING } },
                      database: { type: Type.ARRAY, items: { type: Type.STRING } },
                      aiOrSpecialized: { type: Type.ARRAY, items: { type: Type.STRING } },
                      devops: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["frontend", "backend", "database", "aiOrSpecialized"],
                  },
                  keyModules: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                      },
                      required: ["name", "description"],
                    },
                  },
                  potentialResearchAngle: { type: Type.STRING },
                  evaluationHighlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: [
                  "id",
                  "title",
                  "tagline",
                  "domain",
                  "problemStatement",
                  "solutionOverview",
                  "noveltyFactor",
                  "targetAudience",
                  "feasibilityScore",
                  "feasibilityRationale",
                  "difficulty",
                  "estimatedWeeks",
                  "recommendedTechStack",
                  "keyModules",
                  "potentialResearchAngle",
                  "evaluationHighlights",
                ],
              },
            },
          },
          required: ["ideas"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error generating ideas:", error);
    res.status(500).json({
      error: error.message || "Failed to generate project ideas.",
    });
  }
});

// Endpoint: Generate Full Project Roadmap, Features, Steps, Resources, and Improvements
app.post("/api/generate-roadmap", async (req, res) => {
  try {
    const {
      projectTitle,
      projectDomain,
      problemStatement,
      solutionOverview,
      studentSkills = [],
      targetWeeks = 16,
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    const ai = getAIClient();

    const prompt = `You are a Senior Software Architect and University Capstone Advisor.
A final-year student has selected this project:
- Title: ${projectTitle}
- Domain: ${projectDomain}
- Problem: ${problemStatement}
- Solution: ${solutionOverview}
- Student Existing Skills: ${studentSkills.join(", ") || "Standard Full Stack / ML"}
- Planned Project Duration: ${targetWeeks} weeks

Generate an exhaustive, turnkey engineering and academic blueprint to turn this idea into a practical, award-winning final year project.
Provide:
1. System Architecture overview & architectural diagram description (component interactions, data pipeline, security layer).
2. Deep dive into the Recommended Technologies (why chosen, benefits for viva evaluation, alternatives considered).
3. Phased development roadmap across 6 key capstone phases:
   - Phase 1: Literature Survey, SRS (Requirements), and Feasibility
   - Phase 2: System & UI Architecture, Database Schema, and Wireframes
   - Phase 3: Core MVP Development (Foundational services & primary workflow)
   - Phase 4: Advanced Features & AI/Intelligent Model Integration
   - Phase 5: Verification, Usability Testing, Benchmarking & Performance Metrics
   - Phase 6: Production Deployment, Thesis/Report Documentation & Viva Defense Prep
4. Pre-populated actionable milestone tasks for the automated project management tracker (at least 12-18 tasks distributed across phases), each with estimated days, deliverables, and category.
5. Curated high-yield learning resources (official documentation, tutorials, open-source repositories, benchmark datasets, and seminal IEEE/ACM paper keywords).
6. 4-5 High-Impact Innovation Improvements to elevate the project from an average college submission to top-grade / research publication tier.

Return strictly as JSON adhering to the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            architectureOverview: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                clientTier: { type: Type.STRING },
                applicationTier: { type: Type.STRING },
                dataAndAiTier: { type: Type.STRING },
                securityAndAuth: { type: Type.STRING },
                dataFlowSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                "summary",
                "clientTier",
                "applicationTier",
                "dataAndAiTier",
                "securityAndAuth",
                "dataFlowSteps",
              ],
            },
            techStackDetails: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  selectedTool: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  academicEvaluationBenefit: { type: Type.STRING },
                  alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["category", "selectedTool", "rationale", "academicEvaluationBenefit"],
              },
            },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.NUMBER },
                  phaseName: { type: Type.STRING },
                  durationWeeks: { type: Type.STRING },
                  keyObjectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  deliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
                  vivaCheckpointQuestion: { type: Type.STRING },
                },
                required: [
                  "phaseNumber",
                  "phaseName",
                  "durationWeeks",
                  "keyObjectives",
                  "deliverables",
                  "vivaCheckpointQuestion",
                ],
              },
            },
            milestoneTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  phaseNumber: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                  estimatedDays: { type: Type.NUMBER },
                  priority: { type: Type.STRING },
                  deliverable: { type: Type.STRING },
                },
                required: [
                  "id",
                  "phaseNumber",
                  "title",
                  "description",
                  "category",
                  "estimatedDays",
                  "priority",
                  "deliverable",
                ],
              },
            },
            learningResources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING },
                  providerOrTopic: { type: Type.STRING },
                  description: { type: Type.STRING },
                  suggestedSearchQuery: { type: Type.STRING },
                  recommendedUrl: { type: Type.STRING },
                },
                required: [
                  "title",
                  "type",
                  "providerOrTopic",
                  "description",
                  "suggestedSearchQuery",
                ],
              },
            },
            improvementsAndInnovations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  howToImplement: { type: Type.STRING },
                  academicPaperPotential: { type: Type.STRING },
                },
                required: [
                  "title",
                  "category",
                  "impact",
                  "howToImplement",
                  "academicPaperPotential",
                ],
              },
            },
            vivaPreparationTips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  modelAnswerStrategy: { type: Type.STRING },
                },
                required: ["question", "modelAnswerStrategy"],
              },
            },
          },
          required: [
            "architectureOverview",
            "techStackDetails",
            "phases",
            "milestoneTasks",
            "learningResources",
            "improvementsAndInnovations",
            "vivaPreparationTips",
          ],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({
      error: error.message || "Failed to generate project roadmap.",
    });
  }
});

// Endpoint: AI Project Advisor & Viva Defense Coach Chat
app.post("/api/ai-advisor", async (req, res) => {
  try {
    const {
      message,
      chatHistory = [],
      projectContext = null,
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    const ai = getAIClient();

    let systemInstruction = `You are "Professor Gemini", an experienced, encouraging, and sharp University Senior Project Guide and Viva Examiner for final-year engineering and computer science students.
Your mission is to help final-year students refine their ideas, troubleshoot architecture decisions, explain algorithms, prepare for internal reviews and external viva examinations, and write high-standard project documentation.
Provide direct, highly structured, practical advice with actionable steps, code snippets/pseudocode where applicable, and academic best practices.`;

    if (projectContext) {
      systemInstruction += `\n\nCurrent Project Context:
- Title: ${projectContext.title || "Final Year Project"}
- Domain: ${projectContext.domain || "Software Engineering"}
- Problem Statement: ${projectContext.problemStatement || "N/A"}
- Tech Stack: ${JSON.stringify(projectContext.recommendedTechStack || {})}
- Current Progress: ${projectContext.progressPercentage ?? 0}% completed`;
    }

    // Format previous messages
    const formattedHistory = chatHistory.map((item: any) => ({
      role: item.role === "user" ? "user" : "model",
      parts: [{ text: item.content }],
    }));

    const contents = [
      ...formattedHistory,
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || "I couldn't generate a response. Please try rephrasing.",
    });
  } catch (error: any) {
    console.error("Error in AI advisor:", error);
    res.status(500).json({
      error: error.message || "Advisor failed to respond.",
    });
  }
});

// Endpoint: Suggest specific targeted learning resources or tutorials for a milestone/blocker
app.post("/api/suggest-resources", async (req, res) => {
  try {
    const { topic, context = "" } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    const ai = getAIClient();

    const prompt = `As a technical mentor, suggest the top 5 most effective learning resources (official documentation, definitive tutorials, open source repositories, and research papers/datasets) for a student working on: "${topic}".
Context: ${context}

Format response strictly as JSON with an array of resources.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            summaryAdvice: { type: Type.STRING },
            resources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING }, // "Documentation", "Video Course", "Research Paper", "GitHub Repo", "Interactive Guide"
                  provider: { type: Type.STRING },
                  description: { type: Type.STRING },
                  keyTakeaway: { type: Type.STRING },
                  url: { type: Type.STRING },
                },
                required: ["title", "type", "provider", "description", "keyTakeaway"],
              },
            },
          },
          required: ["topic", "summaryAdvice", "resources"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error suggesting resources:", error);
    res.status(500).json({
      error: error.message || "Failed to suggest learning resources.",
    });
  }
});

// Vite middleware for development & static files for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
