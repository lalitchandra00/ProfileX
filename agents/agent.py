import os

from dotenv import load_dotenv
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

from .prompt import SYSTEM_PROMPT
from .schemas import AgentContext, ProfileAgentState
from .tools import ALL_TOOLS

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
if api_key and not os.getenv("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = api_key

GOOGLE_API_KEY = (os.getenv("GOOGLE_API_KEY") or "").strip()

model_name = (os.getenv("GEMINI_MODEL") or "gemini-2.5-flash-lite").strip()
MODEL = model_name if ":" in model_name else f"google_genai:{model_name}"

checkpointer = InMemorySaver()

_agent = None


def get_agent():
    global _agent
    if _agent is None:
        _agent = create_agent(
            model=MODEL,
            tools=ALL_TOOLS,
            system_prompt=SYSTEM_PROMPT,
            state_schema=ProfileAgentState,
            context_schema=AgentContext,
            checkpointer=checkpointer,
        )
    return _agent
