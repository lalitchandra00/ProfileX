import json

from langchain.tools import ToolRuntime, tool

from ..api_client import api_get_profile
from ..schemas import AgentContext


@tool
def get_my_profile(runtime: ToolRuntime[AgentContext]) -> str:
    """Read the logged-in user's saved profile from the database. Use this before filling, saving, or summarizing a profile."""
    profile = api_get_profile(runtime.context.user_id)
    if profile.get("error"):
        return f"Could not read the profile: {profile['error']}"
    if not profile:
        return "No saved profile yet. Ask the user for their details before filling the form."
    return "Saved profile: " + json.dumps(profile, ensure_ascii=False)
