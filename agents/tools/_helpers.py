from datetime import date

from langchain.messages import ToolMessage
from langgraph.types import Command

from ..schemas import FIELD_SPECS


def tool_reply(runtime, text: str, actions: list | None = None) -> Command:
    update = {"messages": [ToolMessage(content=text, tool_call_id=runtime.tool_call_id)]}
    if actions:
        update["ui_actions"] = list(actions)
    return Command(update=update)


def normalize_fields(fields) -> tuple[dict, list[str]]:
    if not isinstance(fields, dict):
        return {}, ["fields must be an object of field names and values"]

    cleaned: dict = {}
    errors: list[str] = []

    for name, value in fields.items():
        spec = FIELD_SPECS.get(name)
        if spec is None:
            errors.append(f"unknown field '{name}'")
            continue
        if value is None:
            continue

        if name == "dob":
            try:
                value = date.fromisoformat(str(value).strip()[:10]).isoformat()
            except ValueError:
                errors.append(f"{name} must be a date like YYYY-MM-DD")
                continue

        if spec.get("values"):
            allowed = spec["values"]
            match = next((item for item in allowed if item.lower() == str(value).strip().lower()), None)
            if match is None:
                errors.append(f"{name} must be one of: {', '.join(allowed)}")
                continue
            value = match
        else:
            value = str(value).strip()
            limit = 1000 if spec["type"] == "long_text" else 300
            if len(value) > limit:
                errors.append(f"{name} is too long (max {limit} characters)")
                continue
            if name == "email" and "@" not in value:
                errors.append("email must be a valid email address")
                continue

        cleaned[name] = value

    return cleaned, errors
