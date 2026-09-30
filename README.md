# AI BUG DETECTOR 🐞⚡
> **"From Bug Report to Verified Fix."**  
> *Built for the Prompt to Production AI Hackathon*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**AI BUG DETECTOR** is a production-grade developer platform that transforms unstructured software bug reports (natural language, logs, stack traces, code snippets) into structured analyses, probable root-cause hypotheses, defensive code patches, multi-category regression test suites, and audited production readiness checklists.

---

## 🌟 The 6-Stage Remediation Pipeline

```
  🐞 BUG REPORT
       ↓
  🤖 AI ANALYSIS
       ↓
  🔍 PROBABLE ROOT CAUSE DIAGNOSIS
       ↓
  🔧 DEFENSIVE CODE FIX
       ↓
  🧪 5-VECTOR TEST GENERATION
       ↓
  ✅ AUDITED VERIFICATION
```

1. **Bug Report Intake**: Accepts natural language descriptions, environment specifications, screenshots, stack traces, and problematic source code.
2. **AI Analysis**: Normalizes symptoms, calculates AI confidence scores, and correlates duplicate reports.
3. **Probable Root Cause**: Formulates defensible hypotheses rather than unsupported assertions, preserving developer trust.
4. **AI Fix Generator**: Synthesizes type-safe BEFORE vs AFTER code diffs with explanations, architectural changes, and side-effect audits.
5. **5-Vector Test Generation**: Crafts Reproduction, Happy Path, Negative scenarios, Edge Cases, and Regression suites.
6. **Fix Verification**: Runs simulated regression test executions, calculates coverage percentage (98%), and enforces developer governance.

---

## ⚡ The 2-Minute Hackathon Presentation Demo

For judges and evaluators, **AI BUG DETECTOR** includes a dedicated **⚡ Presentation Mode / Live AI Demo**:

1. Click **⚡ Presentation Mode** in the top navigation bar.
2. Select the official hackathon preset:
   > *"When I remove an item from the cart and then apply a coupon, checkout crashes."*
3. Click **Analyze Bug ⚡**:
   - Inspect the structured report, affected component (`CartContext / calculateCartTotal.ts`), and **Probable Root Cause Hypothesis** (unsafe index access `items[0].price` on spliced cart items).
   - Review the **Possible Duplicate Bugs** alert.
4. Click **Generate Fix**:
   - Inspect the **BEFORE vs. AFTER** side-by-side code diff with defensive guard clauses.
   - Note the **Developer Review Required** banner.
5. Click **Generate Tests**:
   - Inspect the 5 generated suites (Reproduction, Happy Path, Negative Tests, Edge Cases, and Regression protection).
6. Click **Verify Fix**:
   - Watch the simulated test runner execute all suites with zero failures.
   - View **VERIFICATION STATUS: VERIFIED IN DEMO** and **98% Regression Coverage**.
7. Review the **Production Readiness Checklist** (with developer approval gate).
8. Conclude on: **"From Bug Report to Verified Fix."**

---

## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing throughout)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom futuristic dark-first SaaS aesthetic)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Architecture**: Pluggable provider abstraction (`services/ai/`) supporting both Gemini/LLM APIs and zero-dependency deterministic heuristic fallback engines.
- **State Management**: React Context + LocalStorage persistence with reactive statistics, severity distributions, and pattern correlation.

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- Node.js `v18+` or `v20+` or `v24+`
- npm `v9+` or `v11+`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/CHAITHANYA-2127/AI-bug-detector.git
cd AI-bug-detector
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 🔑 Environment Variables & AI Configuration

By default, AI BUG DETECTOR operates in **⚡ Demo Mode**, executing realistic, deterministic, context-aware analyses without requiring external API keys.

To connect live Google Gemini or OpenAI LLM APIs:

1. Create a `.env` file in the root folder:
```env
VITE_AI_API_KEY=your_gemini_or_openai_api_key_here
```

2. Alternatively, click the **Settings** gear icon inside the running app and paste your API key directly. Keys are stored strictly in client-side `localStorage` and never forwarded to third-party endpoints.

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── analysis/        # AI Bug Analysis page (symptoms, probable cause, duplicate detection)
│   │   ├── common/          # Badges, CodeDiffViewer, Navbar, Sidebar, PipelineProgress, Toast
│   │   ├── dashboard/       # Stats, AI Insights, Severity & Status distributions, Recent bugs
│   │   ├── demo/            # 2-Minute Hackathon Live AI Demo & Presentation Mode modal
│   │   ├── fix/             # AI Fix Generator (BEFORE vs AFTER diffs, review banner)
│   │   ├── history/         # Bug management table, search, filters, timeline modal
│   │   ├── landing/         # Hero, visual pipeline, interactive preview, feature cards
│   │   ├── pipeline/        # Dedicated 6-stage Prompt to Production architecture page
│   │   ├── report/          # Bug submission form with preset triggers & multi-stage scanning
│   │   ├── tests/           # 5-vector test matrix (Reproduction, Happy, Negative, Edge, Regression)
│   │   └── verification/    # Fix verification, regression coverage, production checklist
│   ├── context/             # BugContext state, stats, Toast notifications, AI correlation engine
│   ├── data/                # Preloaded bugs (BUG-1001 to BUG-1006) and 5 quick scenario presets
│   ├── services/
│   │   └── ai/              # bugAnalyzer, fixGenerator, testGenerator, verifier, orchestrator
│   ├── types/               # TypeScript data models and interfaces
│   ├── App.tsx              # Application layout and routing
│   ├── index.css            # Tailwind custom styles
│   └── main.tsx             # React bootstrap
├── index.html               # HTML entry with custom typography
├── tailwind.config.js       # Dark-first theme palette and glowing animations
├── tsconfig.json            # Strict TypeScript configuration
└── vite.config.ts           # Vite bundler configuration
```

---

## 🛡️ Production & Ethical AI Principles

- **Human-in-the-Loop**: AI BUG DETECTOR generates proposed remediation diffs and regression test suites, but strictly gates deployments behind developer approval.
- **Hypothesis Framing**: AI findings are formulated as "Probable Root Cause" or "Likely Cause" with explicit confidence percentages rather than claiming infallibility.
- **Duplicate Bug Detection**: Proactively identifies potential symptom overlaps against previous reports to reduce developer triage overhead.
- **Fail-Safe Fallback**: Zero external API dependencies required for presentation or evaluation.

---

## 📜 License
MIT License. Built for the university **Prompt to Production** AI Hackathon.
