import re
import traceback
import uuid

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain.messages import AIMessage
from langgraph.types import Command

from .agent import GOOGLE_API_KEY, MODEL, get_agent
from .schemas import AgentContext, ChatRequest, ChatResponse

app = FastAPI(title="ProfileX Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OBJECT_ID = re.compile(r"^[0-9a-fA-F]{24}$")


def last_reply(result: dict) -> str:
    for message in reversed(result.get("messages", [])):
        if not isinstance(message, AIMessage):
            continue
        text = getattr(message, "text", None)
        if isinstance(text, str) and text.strip():
            return text.strip()
        content = getattr(message, "content", "")
        if isinstance(content, str) and content.strip():
            return content.strip()
        if isinstance(content, list):
            parts = []
            for block in content:
                if isinstance(block, str):
                    parts.append(block)
                elif isinstance(block, dict) and block.get("type") == "text":
                    parts.append(str(block.get("text", "")))
            joined = " ".join(part for part in parts if part).strip()
            if joined:
                return joined
    return ""


def interrupt_payload(result: dict) -> dict | None:
    interrupts = result.get("__interrupt__") or ()
    if not interrupts:
        return None
    item = interrupts[0]
    value = getattr(item, "value", item)
    if isinstance(value, dict):
        return value
    return {"type": "ask_user", "question": str(value)}


@app.get("/health")
def health() -> dict:
    return {
        "ok": True,
        "model": MODEL,
        "apiKeyConfigured": bool(GOOGLE_API_KEY),
    }


@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    if not GOOGLE_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Set GOOGLE_API_KEY in agents/.env, then restart the agent server.",
        )
    if not OBJECT_ID.fullmatch(payload.userId):
        raise HTTPException(status_code=400, detail="userId must be a valid MongoDB ObjectId.")

    thread_id = payload.threadId or str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}
    context = AgentContext(user_id=payload.userId)

    agent = get_agent()

    try:
        if payload.resume:
            result = agent.invoke(
                Command(resume=payload.message),
                config=config,
                context=context,
            )
        else:
            result = agent.invoke(
                {"messages": [{"role": "user", "content": payload.message}]},
                config=config,
                context=context,
            )
    except Exception as error:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"The agent failed ({type(error).__name__}). Check the agent terminal for details.",
        )

    all_actions = result.get("ui_actions", []) or []
    cursor = payload.actionCursor if payload.actionCursor <= len(all_actions) else 0
    already_sent = all_actions[:cursor]
    actions = [action for action in all_actions[cursor:] if action not in already_sent]
    new_cursor = cursor + len(actions)

    pending = interrupt_payload(result)
    question = None
    if pending:
        raw_question = pending.get("question", "Please answer that question.")
        question = raw_question if isinstance(raw_question, str) else str(raw_question)

    return ChatResponse(
        reply="" if pending else last_reply(result),
        actions=actions,
        actionCursor=new_cursor,
        threadId=thread_id,
        needsInput=bool(pending),
        question=question,
    )
