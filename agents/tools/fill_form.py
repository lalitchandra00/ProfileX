from typing import Any

from langchain.tools import ToolRuntime, tool
from langgraph.types import Command

from ..schemas import AgentContext, ProfileAgentState
from ._helpers import normalize_fields, tool_reply


@tool
def fill_form(fields: dict[str, Any], runtime: ToolRuntime[AgentContext, ProfileAgentState]) -> Command:
    """Visibly fill one or more profile form fields on the user's screen. This does not save anything to the database."""
    cleaned, errors = normalize_fields(fields)
    if errors:
        return tool_reply(runtime, "I could not fill those fields: " + "; ".join(errors))
    if not cleaned:
        return tool_reply(runtime, "There were no valid fields to fill.")

    action = {"type": "fill_form", "fields": cleaned}
    names = ", ".join(cleaned)
    return tool_reply(runtime, f"Filled {len(cleaned)} field(s) on screen: {names}.", [action])
