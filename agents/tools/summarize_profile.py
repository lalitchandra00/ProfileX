from langchain.tools import ToolRuntime, tool

from ..api_client import api_get_profile
from ..schemas import AgentContext


@tool
def summarize_profile(runtime: ToolRuntime[AgentContext]) -> str:
    """Read the saved profile and return a short human-friendly summary of what is stored."""
    profile = api_get_profile(runtime.context.user_id)
    if profile.get("error"):
        return f"Could not read the profile: {profile['error']}"
    if not profile:
        return "There is no saved profile yet."

    labels = {
        "firstName": "First name",
        "lastName": "Last name",
        "dob": "Date of birth",
        "gender": "Gender",
        "email": "Email",
        "phone1": "Phone",
        "collegeName": "College",
        "year": "Year",
        "branch": "Branch",
        "bloodGroup": "Blood group",
        "maritalStatus": "Marital status",
        "work": "Work",
    }
    parts = [f"{labels.get(key, key)}: {value}" for key, value in profile.items() if key in labels and value]
    return "Saved profile summary - " + ("; ".join(parts) if parts else "no details filled in yet")
