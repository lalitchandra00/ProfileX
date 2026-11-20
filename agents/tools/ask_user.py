from langchain.tools import tool
from langgraph.types import interrupt


@tool
def ask_user(question: str) -> str:
    """Ask the user one short question in the chat and wait for their answer. Use this when a detail is missing."""
    answer = interrupt({"type": "ask_user", "question": question})
    if isinstance(answer, dict):
        answer = answer.get("answer", "")
    return f"The user answered: {answer}"
