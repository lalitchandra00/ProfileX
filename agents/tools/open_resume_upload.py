from langchain.tools import ToolRuntime, tool
from langgraph.types import Command

from ..schemas import AgentContext, ProfileAgentState
from ._helpers import tool_reply


@tool
def open_resume_upload(runtime: ToolRuntime[AgentContext, ProfileAgentState]) -> Command:
    """Open the resume file picker on the form page so the user can choose a PDF to upload."""
    action = {"type": "open_resume_upload"}
    return tool_reply(runtime, "I opened the file picker. Choose your PDF and click Upload.", [action])
