
# CodeQuest — Pixel/Retro Gamified Coding Platform (MVP)

A Codédex-inspired, pixel-art coding adventure. MVP focused on a complete, polished end-to-end loop: **sign in → pick a quest → solve a challenge → run code via Judge0 → earn XP → level up**.

## Visual direction
- **Aesthetic**: dark retro RPG. Deep navy/charcoal background, neon accents (magenta, cyan, lime), CRT-style subtle scanlines on hero areas.
- **Type**: pixel display font (e.g., "Press Start 2P") for headings/HUD; clean mono ("JetBrains Mono") for body and code.
- **Iconography**: 8-bit style icons (hearts, coins, badges, chests).
- **Motion**: snappy bouncy transitions, XP bar fill animation, level-up confetti burst, sprite hover wiggle.

## Screens (MVP)

1. **Landing / Login**
   - Pixel hero with mascot, "Start your quest" CTA.
   - Email/password sign-in & sign-up (calls your backend's `/auth/login` & `/auth/register`, JWT stored in localStorage). Local fallback account if backend not connected yet.

2. **World Map (Dashboard)**
   - Top navbar: logo, **🌐 language switcher** (UI language + programming language), XP bar, level badge, streak flame, avatar.
   - Pixel-art world map with ~10 nodes representing levels. Completed = lit, current = pulsing, locked = greyed with padlock.
   - Side panel: daily challenge card, current streak, next badge progress.

3. **Challenge / Lesson Page**
   - Left: problem statement, examples, difficulty, XP reward, hint button (reveals hints progressively, small XP cost).
   - Right: **Monaco code editor** with syntax highlighting for the selected programming language; starter code per language.
   - Bottom: Run / Submit buttons, test case results panel with pass/fail icons, runtime + memory stats.
   - On success: level-up animation, XP gained toast, "Continue" button to next node.

4. **Profile / Skill Tree**
   - Avatar, total XP, level, streak, badges grid, completion stats per language, simple skill-tree view (branching unlocks per language track).

5. **Leaderboard**
   - Global + weekly tabs. Rank, avatar, username, XP. Highlights current user's row.

## Core systems

- **Level system**: 10 challenges in the MVP track ("JavaScript Basics" by default; same problems re-keyed per programming language). Linear unlock.
- **XP & levels**: each challenge awards XP based on difficulty; level = f(totalXP). Level-up triggers animation.
- **Streaks**: increments on any solve within 24h of last solve; resets otherwise.
- **Badges**: first solve, 3-day streak, 5 challenges solved, first language switch, etc. (~6 in MVP).
- **Daily challenge**: one rotating problem/day with 2x XP.
- **Hints**: 3 progressive hints per challenge; each used hint reduces awarded XP slightly.

## Multi-language support

- **🌐 Language switcher** in navbar with two segments:
  - **UI language**: English, Hindi, Hinglish (i18n via `react-i18next`, JSON locale files in `src/locales/`).
  - **Programming language**: JavaScript, Python, Java, C++ (Monaco syntax highlighting + per-language starter code & test harness).
- Selection persists to localStorage immediately and syncs to backend (`PUT /users/me/preferences`) when signed in.
- Challenge content stored with localized `title`/`description` per UI language and per-language `starterCode` + `tests`.

## Code execution (Judge0 via RapidAPI)

- You'll provide a **RapidAPI key for Judge0 CE**. We'll add it as a runtime secret.
- Since Lovable projects are frontend-only, we'll proxy execution through your external backend endpoint `POST /execute` (recommended — keeps the key off the client). If you want a quick path before the backend is ready, we can call Judge0 directly from the browser using the key (less secure, MVP-only). I'll default to the proxy pattern and document the direct-call fallback.
- Submission flow: send `{ language_id, source_code, stdin, expected_output }` → poll/await result → display status, stdout, stderr, time, memory.

## Backend integration (your external Node/Express + MongoDB)

We'll build a typed API client (`src/lib/api.ts`) expecting these endpoints. You'll provide `VITE_API_BASE_URL`.

- `POST /auth/register`, `POST /auth/login` → `{ token, user }`
- `GET /users/me`, `PUT /users/me/preferences` `{ uiLanguage, programmingLanguage }`
- `GET /challenges?lang=python`, `GET /challenges/:id`
- `POST /submissions` `{ challengeId, language, code }` → `{ passed, xpAwarded, results[] }`
- `GET /leaderboard?scope=global|weekly`
- `POST /execute` (proxy to Judge0)

**Suggested MongoDB schemas** (for your backend team):
- `users`: `{ _id, email, passwordHash, username, avatar, xp, level, streak, lastSolvedAt, badges[], preferences:{ uiLanguage, programmingLanguage }, createdAt }`
- `challenges`: `{ _id, slug, order, difficulty, xpReward, i18n:{ en,hi,hi-en }:{ title,description,hints[] }, perLanguage:{ js,py,java,cpp }:{ starterCode, tests[] } }`
- `submissions`: `{ _id, userId, challengeId, language, code, passed, runtimeMs, memoryKb, createdAt }`

If the backend isn't ready, the app runs in **local mode** with seeded challenges and progress in localStorage, so you can demo end-to-end immediately.

## Tech in this Lovable project
- React + Vite + TypeScript, Tailwind, shadcn/ui (themed pixel/retro), `react-router-dom`.
- `@monaco-editor/react` for the editor.
- `react-i18next` for UI translations.
- `framer-motion` for level-up & transitions.
- `@tanstack/react-query` for API calls and caching.
- Pixel font via Google Fonts; design tokens in `index.css` + `tailwind.config.ts` (semantic HSL tokens — no hardcoded colors in components).

## Folder structure (frontend)
```
src/
  components/ (Navbar, LanguageSwitcher, XPBar, LevelBadge, MapNode, ChallengeEditor, TestResults, BadgeGrid, ...)
  pages/ (Landing, Login, Dashboard, Challenge, Profile, Leaderboard, NotFound)
  lib/ (api.ts, auth.ts, judge0.ts, xp.ts, storage.ts)
  locales/ (en.json, hi.json, hi-en.json)
  data/ (seedChallenges.ts — used in local mode)
  hooks/ (useAuth, usePreferences, useChallenges)
  i18n.ts
```

## Out of scope for MVP (next iterations)
Full skill-tree branching, multiplayer/PvP, real-time chat, friend system, paid tiers, mobile app. We'll layer these on after the core loop feels great.

## What I need from you after approval
1. **RapidAPI Judge0 key** (I'll prompt for it as a secret).
2. **`VITE_API_BASE_URL`** for your backend when ready (optional at start — local mode works without it).
