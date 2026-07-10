# Changelog

All notable changes to the **MindCare AI** project are documented in this file.

---

## [1.0.0] - 2026-07-11

### Added
- **Context-Aware Sequence Classification (BERT)**: Upgraded the backend mood prediction flow. It now groups the last 5 user messages in a rolling context window and runs model inference collectively, resolving prediction flip-flopping on follow-up messages.
- **Frontend Simulated Word Streaming**: Added word-by-word streaming animation for assistant responses, giving the workspace an interactive, real-time feel without relying on backend server-sent events.
- **Dashboard Metric Counters**: Added smooth, float-capable numerical count-up animations on page mount using browser `requestAnimationFrame` loops.
- **Vercel-Style Area & Line Charts**: Configured responsive Recharts graphs with custom styled glassmorphic tooltip panels.
- **Feedback & RLHF Logs**: Created the `/feedback` rating system, storing responses locally and appending dialogue metrics to `rlhf_logs.csv` for reinforcement learning.
- **Markdown Practitioner Report Exporter**: Added the `/report` endpoint to instantly compile dialogue history into structured clinician summaries ready for markdown download.
- **MIT License**: Included the license file for open-source distribution.

### Fixed
- **Session ID Synchronization Bug**: Fixed an issue where assistant messages vanished from the chat after typing finished. The frontend now dynamically synchronizes client-generated session IDs with backend-resolved UUIDs using the `updateSessionId` hook.
- **Hard-Rounded Confidence Displays**: Fixed confidence percentages displaying as exactly `100%` due to integer rounding. All confidence values now display to one decimal place (e.g., `99.6%`).
- **SSR Hydration Fails**: Refined Next.js 15 `ThemeProvider` wrapping to prevent hydration errors during server pre-rendering of client themes.
- **Metadata Configuration warnings**: Separated `viewport` config objects from standard metadata schemas in page layouts to comply with Next.js 15 app router standards.

### Improved
- **Scalable Architecture**: Migrated codebase to a scalable, domain-focused, feature-based directory structure (`app/`, `components/`, `features/`, `hooks/`, `services/`, `types/`).
- **Recruiter Readme & Badge Icons**: Created a professional portfolio README.md complete with tech badges, architectural flows, project trees, and detailed installation guidelines.
- **Production Ignored Rules**: Overhauled `.gitignore` file to restrict compiled files, caches, ML models, and private configurations from being tracked in git index history.
