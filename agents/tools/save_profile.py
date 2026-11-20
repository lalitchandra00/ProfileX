from typing import Any

from langchain.tools import ToolRuntime, tool
from langgraph.types import Command, interrupt

from ..api_client import api_save_profile
from ..schemas import AgentContext, ProfileAgentState
from ._helpers import normalize_fields, tool_reply


def _agreed(decision) -> bool:
    if isinstance(decision, bool):
        return decision
    if isinstance(decision, dict):
        decision = decision.get("answer", "")
    return str(decision).strip().lower() in {"yes", "y", "save", "submit", "confirm", "ok", "okay", "true"}


@tool
def save_profile(fields: dict[str, Any], runtime: ToolRuntime[AgentContext, ProfileAgentState]) -> Command:
    """Save profile fields to the database. The user is always asked to confirm before anything is written."""
    cleaned, errors = normalize_fields(fields)
    if errors:
        return tool_reply(runtime, "I could not save those fields: " + "; ".join(errors))
    if not cleaned:
        return tool_reply(runtime, "There are no valid fields to save.")

    decision = interrupt(
        {
            "type": "confirm_save",
            "question": "Should I save these details? " + ", ".join(f"{key}: {value}" for key, value in cleaned.items()),
            "fields": cleaned,
        }
    )

    if not _agreed(decision):
        return tool_reply(runtime, "Okay, I did not save anything.")

    result = api_save_profile(runtime.context.user_id, cleaned)
    if not result.get("success"):
        return tool_reply(runtime, f"Saving failed: {result.get('message', 'unknown error')}")

    action = {"type": "profile_saved", "fields": cleaned}
    return tool_reply(runtime, "Saved your details successfully.", [action])
