# Code Quest Arena

Frontend is a Vite + React app. Backend is an Express + MongoDB + Judge0 service under `backend/`.

## Prerequisites

- Node.js 18+
- MongoDB running locally or a remote MongoDB URI
- Judge0 RapidAPI credentials

## Frontend Setup

```bash
npm install
npm run dev
```

Optional frontend env:

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Backend Setup

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and set real values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/codequest
JWT_SECRET=supersecret
JUDGE0_API_KEY=your_key
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
JUDGE0_BASE_URL=https://judge0-ce.p.rapidapi.com
```

Run backend:

```bash
cd backend
npm run dev
```

## Main API Endpoints

- `GET /health` - backend health check
- `POST /api/execute` - compile/run code against quest tests
- `POST /api/users/register` - register user
- `POST /api/users/login` - login user
- `GET /api/users/me` - authenticated profile + progress
- `GET /api/quests` - list quests
- `GET /api/quests/:id` - get one quest by Mongo `_id` or `challengeId`
- `POST /api/quests` - upsert quest (auth required)

## Adding New Challenges (Hardness Templates)

New challenges should use the hardness-based factory so content stays consistent by difficulty.

1. Open `src/data/seedChallenges.ts`.
2. Add a new entry to `NEW_CHALLENGE_DEFINITIONS` (do not modify existing challenge arrays unless intentional).
3. Provide minimum author input:
   - `id`, `order`, `track`, `difficulty`, `funcName`
   - localized `title` and `description` (`en`, `hi`, `hi-en`)
   - `tests` with valid function calls (e.g. `sum(1,2)`)
4. The template factory in `src/data/challengeTemplates.ts` auto-generates:
   - starter code for all languages,
   - fallback hints by difficulty,
   - default XP reward by difficulty (unless overridden).
5. Validation runs during generation and throws if:
   - locale text is missing,
   - starter templates do not include `funcName`,
   - tests are empty or don’t call `funcName(...)`.

Common pitfall:
- `tests.expected` must match runtime string output exactly (including array/object formatting), because pass/fail uses string equality.

## Execute API Example

Request:

```http
POST /api/execute
Content-Type: application/json
```

```json
{
  "code": "print(input())",
  "language_id": 71,
  "questId": "hello",
  "tests": [
    { "input": "Hello, World!", "expectedOutput": "Hello, World!" }
  ]
}
```

Response shape:

```json
{
  "success": true,
  "status": "Accepted",
  "passed": true,
  "results": [],
  "totalTimeMs": 0,
  "user": null,
  "awardedXp": 0
}
```
