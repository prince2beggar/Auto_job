<div align="center">

# CareerPilot AI

**Autonomous, Truth-Preserving Personal AI Job Hunting Agent**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI_Agents-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](./LICENSE)

Discover opportunities, evaluate real eligibility, tailor truthful CVs, draft cover letters & recruiter emails, and manage your entire job pipeline from one unified dashboard.

</div>

---

## Key Features

- **Multi-Source Job Discovery**
  Aggregates and normalizes listings from private tech & corporate portals (Bdjobs, LinkedIn), government circulars (with Teletalk / quota / age-limit metadata), and internship/graduate programs.
- **Eligibility & Match Scoring Engine**
  Computes transparent, multi-dimensional match scores across **Education**, **Experience**, **Skills**, **Role Fit**, and **Location**, with clear gap analysis and deadline urgency alerts.
- **Truth-Preserving CV Parsing & Tailoring**
  Parses uploaded PDF/DOCX resumes (`pdf-parse`, `mammoth`) into structured profiles with provenance tracking (`EXTRACTED`, `ENTERED`, `INFERRED`, `CONFIRMED`), and generates role-tailored CV versions and LaTeX/PDF exports (`jspdf`) without fabricating experience.
- **AI Cover Letter & Recruiter Email Drafting**
  Generates tailored cover letters and structured application email drafts for human-in-the-loop review before sending.
- **Natural Language Career Preferences**
  Configure target roles, industries, salary expectations, remote preferences, and organization types using natural language.
- **End-to-End Application Pipeline**
  Track every opportunity from `SAVED` and `SHORTLISTED` through `CV_GENERATED`, `APPLIED`, `INTERVIEW`, and `OFFER` with timeline events and notifications.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling & UI** | Tailwind CSS, Lucide React |
| **Database & ORM** | Prisma ORM (SQLite local by default, PostgreSQL ready) |
| **AI Engine** | Google Generative AI (`@google/generative-ai`) |
| **Document Processing** | `pdf-parse`, `mammoth`, `jspdf` |

---

## Project Structure

```text
.
├── app/                    # Next.js App Router pages & REST API routes
│   ├── api/                # API endpoints (jobs, cv, cover-letter, email, applications, profile)
│   ├── applications/       # Application pipeline tracker page
│   ├── cv/                 # Master CV & tailored versions manager
│   ├── jobs/               # Job discovery & filtering workspace
│   ├── onboarding/         # Guided profile & preference setup
│   └── profile/            # Candidate profile & skills editor
├── components/             # Reusable UI components & modals
│   ├── cv/                 # CV tailoring & cover letter modals
│   ├── email/              # Email review modal
│   └── jobs/               # Job cards & detail inspection modals
├── lib/
│   ├── agents/             # Modular AI agents (CV parser, tailoring, matching, eligibility, email, etc.)
│   │   └── job-discovery/  # Source connectors (Bdjobs, LinkedIn, Government, Internship) & normalizer
│   ├── ai/                 # Gemini AI client configuration
│   └── types/              # Shared TypeScript definitions
├── prisma/
│   └── schema.prisma       # Relational data model (User, UserProfile, Job, JobMatch, Application, etc.)
└── scripts/                # Database seeding & verification scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (or yarn / pnpm)
- A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prince2beggar/Auto_job.git
   cd Auto_job
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your `GEMINI_API_KEY` (and `DATABASE_URL` if using PostgreSQL instead of local SQLite):
   ```env
   DATABASE_URL="file:./dev.db"
   GEMINI_API_KEY="your-gemini-api-key"
   NODE_ENV="development"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize the database & seed sample data**
   ```bash
   npx prisma generate
   npm run db:push
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run Next.js ESLint checks |
| `npm run db:push` | Push Prisma schema changes to the database |
| `npm run db:generate` | Generate the Prisma Client |
| `npm run db:seed` | Populate the database with sample jobs & profile data |
| `npm test` | Run agent verification script (`scripts/test-agent.mjs`) |

---

## License

This project is licensed under the [MIT License](./LICENSE).
