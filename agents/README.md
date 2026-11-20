# ProfileX Agent (`agents/`)

This folder contains the AI assistant for ProfileX. It is a small Python service that runs **locally only** — there is no hosting configuration, no Docker setup, and no deployment step in this folder.

The assistant chats with the user, reads their saved profile, visibly fills the React form, opens pages, asks for missing details, and saves data after confirmation.

## Quick start

Install once (Python 3.10+):

```powershell
python -m pip install -r agents/requirements.txt
```

Fill in `agents/.env`:

```dotenv
GOOGLE_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=
BACKEND_URL=
```

Only `GOOGLE_API_KEY` is required. Empty values use these defaults:

| Variable | Default | Purpose |
| --- | --- | --- |
| `GOOGLE_API_KEY` | none | Gemini API key. Also accepts `GEMINI_API_KEY`. Without it, `/chat` returns HTTP 503. |
| `GEMINI_MODEL` | `gemini-2.5-flash-lite` | Model name; a full `provider:model` string is also accepted. |
| `BACKEND_URL` | `http://localhost:8000` | Express API the tools call for profile reads/writes. |

Run the three local processes from the project root / frontend folder:

```powershell
# 1. Express + MongoDB
npm run dev

# 2. React
cd frontend; npm run dev

# 3. Agent (from project root, so `agents.server` resolves)
python -m uvicorn agents.server:app --reload --port 8001
```

Check the agent: `curl http://localhost:8001/health`. Log in to the site, click **Ask Assistant**, and try `open the profile page` or `fill the form with my details`.

`frontend/.env` may stay empty; its defaults are `http://localhost:8000` for Express and `http://localhost:8001` for the agent.

## Architecture

```
Browser (React, :5173)
   │  POST /chat  { message, userId, threadId, actionCursor, resume }
   ▼
FastAPI (agents/server.py, :8001)
   │  LangGraph agent (agents/agent.py)
   │     ├─ model node  → Gemini
   │     └─ tools node  → agents/tools/
   │                         ├─ read tools ──────► Express :8000 ──► MongoDB
   │                         └─ UI-action tools
   ▼  { reply, actions, actionCursor, threadId, needsInput, question }
Browser executes actions: fill_form / navigate / open_resume_upload / profile_saved
```

The key idea: **the LLM never touches React directly.** Tools either read/write data through the existing Express API, or they record a small JSON "UI action" that the server returns to the browser. React then performs the action. That is why no browser automation is needed.

The three processes:

| Process | Port | Command |
| --- | --- | --- |
| Express backend | 8000 | `npm run dev` |
| Vite frontend | 5173 | `cd frontend && npm run dev` |
| Agent | 8001 | `python -m uvicorn agents.server:app --reload --port 8001` |

## File map

| File | What it does |
| --- | --- |
| `requirements.txt` | Python packages: `langchain`, `langchain-google-genai`, `langgraph`, `fastapi`, `uvicorn`, `httpx`, `pydantic`, `python-dotenv`, `pytest`. |
| `.env` / `.env.example` | Local configuration. `.env` is gitignored; `.env.example` is the template. |
| `schemas.py` | Field whitelist (`FIELD_SPECS`, line 9), allowed pages (`PAGES`, `ALLOWED_PAGES`), graph state (`ProfileAgentState`, line 68), trusted context (`AgentContext`, line 73), and request/response models (lines 77, 85). |
| `prompt.py` | `SYSTEM_PROMPT` (line 10): rules, field names/enums, allowed pages, and how to behave. Built from `FIELD_SPECS` so prompt and validation stay in sync. |
| `api_client.py` | `api_get_profile` (line 12) and `api_save_profile` (line 28) call Express with `httpx`. All calls are scoped by the trusted `userId`. |
| `tools/` | Seven `@tool` functions, one per file, plus helpers and the `ALL_TOOLS` list. |
| `agent.py` | `get_agent()` (line 27) lazily compiles the LangGraph agent with Gemini, tools, state schema, context schema, system prompt, and checkpointer. Lazy creation keeps `/health` and tests working with an empty `.env`. |
| `server.py` | FastAPI app: `/health` (line 59) and `/chat` (line 68). Handles validation, interrupts, action slicing, and error responses. |
| `tests/` | 7 offline tests: tool validation, real graph loop with a fake model, and API pause/resume with FastAPI's `TestClient`. |

## Tools

All tools live in `agents/tools/` and are exported through `ALL_TOOLS` in `agents/tools/__init__.py:9`.

| Tool | File | Behavior | Confirmation |
| --- | --- | --- | --- |
| `get_my_profile` | `get_my_profile.py:10` | Calls `GET /api/profile` and returns saved data as text. | No (read-only) |
| `fill_form` | `fill_form.py:11` | Validates fields, emits a `fill_form` UI action. Does **not** save. | No (user sees it) |
| `navigate` | `navigate.py:9` | Maps names/paths to `/home`, `/profile`, `/login`, `/signup` and emits a `navigate` action. Unknown paths are rejected. | No |
| `ask_user` | `ask_user.py:6` | Calls LangGraph `interrupt()` to pause and wait for one chat answer. | Built-in pause |
| `save_profile` | `save_profile.py:20` | Validates fields, pauses for confirmation, then calls `POST /api/home`. Emits `profile_saved`. | **Yes** |
| `open_resume_upload` | `open_resume_upload.py:9` | Emits an action that clicks the PDF file input on the form. | No |
| `summarize_profile` | `summarize_profile.py:8` | Reads the profile and returns a short text summary. | No (read-only) |

`tools/_helpers.py` contains:

- `tool_reply` (line 9): builds a `Command` with a `ToolMessage` (required by `ToolNode`) and optional UI actions.
- `normalize_fields` (line 16): rejects unknown fields, checks enum values, normalizes `dob` to `YYYY-MM-DD`, trims text, and validates email. This is the second line of defence after the system prompt.

## LangGraph concepts used here

- **`create_agent`** (`agents/agent.py:27`) compiles a graph with two main nodes: `model` (Gemini) and `tools`. The model loops: call tools → read tool results → call model again, until it stops requesting tools. Graph nodes are `__start__ → model → tools → __end__`.
- **Runtime context** (`AgentContext`): the browser sends `userId`; the server passes it to tools through `context=AgentContext(user_id=...)`. The LLM cannot supply or change it, so one user cannot read another user's profile. `ToolRuntime` gives tools access to it without exposing a `runtime` parameter in the Gemini tool schema.
- **Custom state** (`ProfileAgentState`): adds a `ui_actions` channel with an `operator.add` reducer, so tools that run in parallel can each append actions without overwriting each other.
- **Checkpointer** (`InMemorySaver`): stores conversation state per `thread_id`. It makes multi-turn chat and pauses possible. It is memory-only, so restarting the agent process clears conversations.
- **`thread_id`**: one conversation ID, generated by the browser (`crypto.randomUUID()`) and stored in `localStorage` under `profilex.assistant.<userId>`. Reusing it continues the chat; a new one starts fresh. **New chat** in the panel clears it.
- **`interrupt()` + `Command(resume=...)`**: `ask_user` and `save_profile` can pause a run. The graph saves its place, the server returns `needsInput: true` plus a question, and the next user message is sent back with `resume: true` and the same `thread_id`.
- **Action cursor**: the browser stores how many UI actions it has already applied. The server slices `ui_actions[actionCursor:]` and filters exact duplicates, so resuming a paused run never re-fills the same field twice.

## API contract

Request (`POST /chat`):

```json
{
  "message": "fill the form with my details",
  "userId": "507f1f77bcf86cd799439011",
  "threadId": "8b1f...",
  "actionCursor": 0,
  "resume": false
}
```

Normal response:

```json
{
  "reply": "I filled your name and email. Please check the form.",
  "actions": [
    { "type": "fill_form", "fields": { "firstName": "Lalit", "email": "lalit@example.com" } }
  ],
  "actionCursor": 1,
  "threadId": "8b1f...",
  "needsInput": false,
  "question": null
}
```

Paused response:

```json
{
  "reply": "",
  "actions": [],
  "actionCursor": 0,
  "threadId": "8b1f...",
  "needsInput": true,
  "question": "What is your date of birth?"
}
```

`userId` must be a 24-character MongoDB ObjectId (HTTP 400 otherwise). Missing API key returns HTTP 503. Unexpected agent errors return HTTP 500 with a short message; full traceback goes to the agent terminal.

## Two example flows

**"Open the profile page"**

1. React sends the message to `/chat`.
2. Gemini calls `navigate(page="/profile")`.
3. The tool validates the path and appends `{type:"navigate", to:"/profile"}` to `ui_actions`.
4. `executeActions` in `frontend/src/components/AssistantPanel.jsx:49` calls React Router's `navigate("/profile")`.

**"Fill the form with my details"**

1. Gemini calls `get_my_profile()` to see what is already stored.
2. For each missing detail it calls `ask_user(...)`, which pauses the graph. The question appears in the chat.
3. Each answer resumes the graph with `Command(resume=answer)`.
4. Once it has enough data, Gemini calls `fill_form({...})`.
5. `executeActions` first navigates to `/home` if needed, then calls `setField` for each field with a short delay so filling is visible.
6. Nothing is written to MongoDB until the user says "save it", which triggers `save_profile` and its confirmation interrupt.

## Frontend wiring

| File | Role |
| --- | --- |
| `frontend/src/lib/config.js` | Reads `VITE_API_BASE_URL` / `VITE_AGENT_URL` with localhost fallbacks. |
| `frontend/src/lib/agentClient.js` | `sendChatMessage()` posts to `/chat` and turns non-2xx responses into readable errors. |
| `frontend/src/context/formContextStore.js` | The React context object. |
| `frontend/src/context/ProfileFormProvider.jsx:23` | Owns form state, loads the saved profile, exposes `setField`, `saveProfile`, `uploadResume`, `reloadProfile`, and the file-input ref. |
| `frontend/src/context/useProfileForm.js:4` | Hook used by Home and the assistant panel. |
| `frontend/src/components/AssistantPanel.jsx:12` | Chat UI. `executeActions` (line 49) performs UI actions; `handleSend` (line 71) manages resume/cursor state; `startNewChat` (line 118) clears the thread. |
| `frontend/src/App.jsx:9` | Mounts the provider, routes, and panel. |

Because form state lives in a provider above the routes, the agent can fill the form even when the user is on another page — the panel navigates to `/home` first and the values are still there.

The root `src/models/Profile.models.js` was extended with an `email` field so the email from the form is actually persisted (Mongoose drops unknown fields by default).

## Safety decisions

- Field names and enum values are whitelisted in `schemas.py:9` and used both in the prompt and in Python validation.
- Pages are whitelisted in `ALLOWED_PAGES`.
- `userId` comes from the request, never from the LLM, and is validated as an ObjectId before any tool runs.
- `fill_form` never writes to MongoDB; `save_profile` always pauses for confirmation.
- No browser automation, no shell execution, and no arbitrary code from model output.
- No hosting was added: no `langgraph.json`, no Docker files, no deployment scripts.

## Tests and checks

```powershell
python -m pytest agents/tests -q
npm run lint       # run in frontend/
npm run build      # run in frontend/
curl http://localhost:8001/health
```

Current result: 7 Python tests pass, frontend lint is clean, and the production build succeeds. Tests use fake chat models, so no API key or network is needed.

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `/chat` returns 503 "Set GOOGLE_API_KEY" | Fill `GOOGLE_API_KEY` in `agents/.env` and restart the agent server. |
| `/chat` returns 400 about `userId` | Log in first; the browser must send a real 24-character ObjectId. |
| "Cannot reach the agent" in chat | The agent server is not running on port 8001. |
| Save fails but filling works | Express is not running on port 8000, or `BACKEND_URL` is wrong. |
| Gemini says model not found | Set `GEMINI_MODEL` to a model available on your API key. |
| Chat memory disappears | Expected: `InMemorySaver` loses state on restart. A database checkpointer would be the upgrade. |
| Backend error `querySrv ENOTFOUND ...mongodb.net` | Unrelated to this folder. The `MONGODB_URI` in the root `.env` points to a cluster hostname that does not resolve; replace it with a fresh Atlas URI. |

## Current limitations / possible upgrades

- Conversation memory is in-memory only; restarting the agent starts new chats. A MongoDB checkpointer could reuse the project's existing Atlas database.
- Responses are not streamed; the panel shows "Thinking…" until the full reply arrives.
- `userId` still comes from browser `localStorage` (existing app behaviour). Fine for practice, but real JWT verification would be needed before sharing the app.
- No PDF parsing: the resume tool only opens the file picker; uploading stays handled by the existing Express/Cloudinary endpoint.
