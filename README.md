# CareerCraft AI

CareerCraft AI is a React + Express career platform for students, graduates, and job seekers. It helps you build a resume, analyze it against a target role, practice interviews, map skill gaps, and talk to a live AI career coach.

API keys stay on the server in `.env`. The browser never sees them.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Home |
| `/resume-builder` | Resume builder with Classic, Modern, and Creative templates |
| `/resume-analyzer` | AI resume critique, ATS tips, rewrites |
| `/interview` | Live interview questions and mock-answer scoring |
| `/skill-gap` | Skill match, missing skills, four-week plan |
| `/chat` | Career assistant chatbot (real model replies) |

## Setup

1. Install Node.js 18 or newer.
2. In the project folder:

```bash
npm install
```

3. Copy `.env.example` to `.env` and add a key:

```bash
GROQ_API_KEY=your_groq_key
```

or

```bash
OPENAI_API_KEY=your_openai_key
```

Free-tier Groq keys work well. If you use Groq, you can set:

```bash
OPENAI_MODEL=llama-3.3-70b-versatile
```

4. Start the API and the Vite app together:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173).

The Vite dev server proxies `/api` to `http://127.0.0.1:3001`.

## Scripts

- `npm run dev` — API + frontend
- `npm run client` — Vite only
- `npm run server` — Express only
- `npm run build` — production frontend build
- `npm run preview` — preview the built frontend

AI features need the Express server running and a valid key in `.env`. Restart `npm run dev` after you change the key.

## How AI is wired

`server/index.js` reads `GROQ_API_KEY` or `OPENAI_API_KEY` and calls an OpenAI-compatible chat completions API. Routes:

- `POST /api/chat`
- `POST /api/analyze-resume`
- `POST /api/interview-questions`
- `POST /api/interview-feedback`
- `POST /api/skill-gap`
- `POST /api/improve-summary`
- `GET /api/health`

Resume drafts are stored in the browser with `localStorage`, not on the server.
