from langchain.tools import ToolRuntime, tool
from langgraph.types import Command

from ..schemas import ALLOWED_PAGES, PAGES, AgentContext, ProfileAgentState
from ._helpers import tool_reply


@tool
def navigate(page: str, runtime: ToolRuntime[AgentContext, ProfileAgentState]) -> Command:
    """Open a page in the user's browser. Use one of: /home, /profile, /login, /signup, or their plain names."""
    raw = page.strip().lower()
    path = raw if raw.startswith("/") else PAGES.get(raw, "/" + raw.replace(" ", "-"))

    if path not in ALLOWED_PAGES:
        return tool_reply(
            runtime,
            f"'{page}' is not an allowed page. Choose one of: {', '.join(sorted(ALLOWED_PAGES))}.",
        )

    action = {"type": "navigate", "to": path}
    return tool_reply(runtime, f"Opening {path}.", [action])
