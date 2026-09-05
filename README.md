# ProjectPilot 🎓 — AI Final-Year Capstone Generator & Advisor

[![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19.0.1-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Gemini 3.8 Flash](https://img.shields.io/badge/Gemini_AI-3.8_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

> **ProjectPilot** is an intelligent, full-stack, AI-powered platform designed specifically to guide final-year computer science and engineering undergraduates through the rigorous lifecycle of brainstorming, planning, building, and defending their Capstone project.

Using the advanced **Gemini 3.8 Flash** model via the `@google/genai` SDK, ProjectPilot acts as both a **Senior Tech Architect** and an encouraging **University Project Coordinator** (Professor Gemini) to turn academic requirements into award-winning project proposals.

---

## 🎨 Design Variation 5 (Modern Obsidian)

This project runs on the highly-polished **Modern Obsidian** design system:
- **Obisidian Canvas:** `#111113` background for eye-strain reduction during long coding sessions.
- **Porcelain Ink:** High-readability warm-toned text (`#f2efeb`).
- **Periwinkle Accent:** `#87a9ff` for critical interaction points, selections, and focus items.
- **Mint Feasibility Badge:** `#50e3c2` for highlighting viable, award-winning capstone scores.
- **Architectural Minimalism:** Structured borders, monospace identifiers, and subtle geometric highlights. Includes an advanced, contrast-optimized **Light/Dark theme toggle** in the top-right header.

---

## 🚀 Key Features

### 🔍 Phase 1: Idea Discovery & Feasibility Engine
- Inputs academic discipline, preferred stack, constraints, and target timeframe.
- Generates high-novelty, academically challenging project concepts tailored to your profile.
- Provides real-time **Feasibility Scores (1-10)** and detailed rationales to prevent late-semester failures.

### 🗺️ Phase 2: System & UI Architecture Blueprints
- Auto-generates detailed multi-tier technical designs (Client, Application, Database, AI/Intelligent models).
- Details data pipeline flows and security layer strategies.
- Evaluates tech stacks and suggests industry-relevant alternatives.

### 📋 Phase 3: Automated Milestone Tracker
- Breaks down the capstone project into 6 sequential phases (from literature surveys to viva defense).
- Generates a pre-populated list of actionable tasks, complete with priority levels, deliverables, and category codes.
- Supports interactive checkboxes to log progress, triggering real-time completion status updates.

### 📚 Phase 4: Curated Literature & Dataset Finder
- Provides search queries for Google Scholar, IEEE Xplore, and ACM Digital Library.
- Points out recommended open-source codebases, Kaggle datasets, and public benchmarks.
- Helps students compile their first-draft references for project reports.

### 🖨️ Phase 5: Proposal Document Exporter
- Packages your curated capstone profile, system architecture, tech stacks, and roadmap milestones into a professional, printable Project Proposal document.

### 💬 Phase 6: Professor Gemini AI Advisor & Viva Coach
- A persistent chat coach that understands your chosen project.
- Simulates mock reviews, analyzes potential code blockers, and trains you to confidently answer external examiner questions.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **React 19 (TypeScript)** with functional hook-based state.
- **Tailwind CSS v4.0** with a custom theme configuration for instant theme transitions.
- **Lucide React** for ultra-clean, vector-perfect iconography.
- **Canvas Confetti & Motion** for polished, responsive state interactions.

### Backend
- **Node.js & Express** server running on TSX (native TypeScript runtime).
- **Google GenAI Node SDK (`@google/genai`)** with structured responses configured via strict JSON schemas.
- **ESBuild** bundler compiling backend modules into optimized, stand-alone CJS files inside `/dist` for lightning-fast container startups.

---

## 📥 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- A Google [Gemini API Key](https://aistudio.google.com/)

### Environment Variables
Configure a `.env` file at the root of the project using the instructions inside `.env.example`:

```env
# Required for Gemini AI generation features
GEMINI_API_KEY="your_actual_gemini_api_key"

# Used for production environments and self-referential routes
APP_URL="http://localhost:3000"
```

### Installation & Run

1. Clone or download this project's repository.
2. Install the standard npm packages:
   ```bash
   npm install
   ```
3. Run the development environment (Express + Vite HMR reverse proxy on port 3000):
   ```bash
   npm run dev
   ```
4. Access the platform at [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Production Build & Deploy

This repository is optimized for deployment on cloud container platforms (like Google Cloud Run or AWS ECS):

1. **Build the production client and server bundle:**
   ```bash
   npm run build
   ```
   This triggers the standard Vite static build into `dist/` and compiles `server.ts` into a standalone compiled bundle `dist/server.cjs` with `esbuild`.

2. **Start the production server:**
   ```bash
   npm run start
   ```
   The backend server will host your compiled React frontend as static assets alongside raw REST endpoints on port `3000`.

---

## 📁 Repository Structure

```text
├── .env.example            # Environment variables example template
├── .gitignore              # Standard ignore configurations
├── index.html              # Main HTML mount target
├── metadata.json           # Platform configurations and description
├── package.json            # Node.js workspace dependencies and script runners
├── server.ts               # Full-stack Express server and Gemini SDK router
├── tsconfig.json           # Strict TypeScript compilation rules
├── vite.config.ts          # Vite build pipeline plugins (React & Tailwind)
├── src/
│   ├── main.tsx            # Main React mount entry point
│   ├── App.tsx             # Context-wrapped view routing
│   ├── types.ts            # Project-wide strict TypeScript type declarations
│   ├── index.css           # Global custom classes & Variation 5 CSS variables
│   ├── context/
│   │   └── ThemeContext.tsx # Light/Dark mode state and storage hook
│   ├── components/
│   │   ├── Header.tsx      # Responsive nav, active capstone dropdown & theme toggle
│   │   ├── IdeaCard.tsx    # Feasibility tags and action controllers
│   │   ├── IdeaGenerator.tsx # Config sidebar & Capstone recommendations
│   │   ├── RoadmapView.tsx # Systems architecture specs & roadmap layout
│   │   ├── ProgressTracker.tsx # Operational Gantt checklists and logs
│   │   ├── LearningResourcesView.tsx # Paper citations and Kaggle benchmarks
│   │   ├── ProjectProposalExport.tsx # Print/Export layouts for reviews
│   │   └── AIAdvisorDrawer.tsx       # Live "Professor Gemini" chat guide
```

---

## 📄 License

This project is licensed under the MIT License - see your repository specifications for details.
