from fastapi.testclient import TestClient
from langchain.agents import create_agent
from langchain.messages import AIMessage
from langchain_core.language_models import BaseChatModel
from langchain_core.outputs import ChatGeneration, ChatResult
from langgraph.checkpoint.memory import InMemorySaver

from agents import server
from agents.schemas import AgentContext, ProfileAgentState
from agents.tools import ask_user

USER_ID = "507f1f77bcf86cd799439011"


class AskingModel(BaseChatModel):
    calls: int = 0

    @property
    def _llm_type(self) -> str:
        return "asking-fake"

    def bind_tools(self, tools, *, tool_choice=None, **kwargs):
        return self

    def _generate(self, messages, stop=None, run_manager=None, **kwargs) -> ChatResult:
        self.calls += 1
        if self.calls == 1:
            message = AIMessage(
                content="",
                tool_calls=[
                    {
                        "name": "ask_user",
                        "args": {"question": "What is your blood group?"},
                        "id": "ask-1",
                        "type": "tool_call",
                    }
                ],
            )
        else:
            message = AIMessage(content="Thanks, I have what I need.")
        return ChatResult(generations=[ChatGeneration(message=message)])


def test_chat_pauses_and_resumes(monkeypatch):
    fake_agent = create_agent(
        model=AskingModel(),
        tools=[ask_user],
        state_schema=ProfileAgentState,
        context_schema=AgentContext,
        checkpointer=InMemorySaver(),
    )
    monkeypatch.setattr(server, "GOOGLE_API_KEY", "dummy")
    monkeypatch.setattr(server, "get_agent", lambda: fake_agent)

    client = TestClient(server.app)

    first = client.post(
        "/chat",
        json={"message": "fill my form", "userId": USER_ID},
    )
    assert first.status_code == 200
    first_data = first.json()
    assert first_data["needsInput"] is True
    assert first_data["question"] == "What is your blood group?"
    assert first_data["actions"] == []

    second = client.post(
        "/chat",
        json={
            "message": "B+",
            "userId": USER_ID,
            "threadId": first_data["threadId"],
            "actionCursor": first_data["actionCursor"],
            "resume": True,
        },
    )
    assert second.status_code == 200
    second_data = second.json()
    assert second_data["needsInput"] is False
    assert second_data["reply"] == "Thanks, I have what I need."


def test_chat_rejects_bad_user_id(monkeypatch):
    monkeypatch.setattr(server, "GOOGLE_API_KEY", "dummy")
    client = TestClient(server.app)
    response = client.post("/chat", json={"message": "hi", "userId": "not-an-id"})
    assert response.status_code == 400
