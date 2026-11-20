from langchain.agents import create_agent
from langchain.messages import AIMessage
from langchain_core.language_models import BaseChatModel
from langchain_core.outputs import ChatGeneration, ChatResult
from langgraph.checkpoint.memory import InMemorySaver

from agents.schemas import AgentContext, ProfileAgentState
from agents.tools import fill_form


class FakeModel(BaseChatModel):
    calls: int = 0

    @property
    def _llm_type(self) -> str:
        return "fake"

    def bind_tools(self, tools, *, tool_choice=None, **kwargs):
        return self

    def _generate(self, messages, stop=None, run_manager=None, **kwargs) -> ChatResult:
        self.calls += 1
        if self.calls == 1:
            message = AIMessage(
                content="",
                tool_calls=[
                    {
                        "name": "fill_form",
                        "args": {"fields": {"firstName": "Lalit"}},
                        "id": "call-1",
                        "type": "tool_call",
                    }
                ],
            )
        else:
            message = AIMessage(content="I filled your first name.")
        return ChatResult(generations=[ChatGeneration(message=message)])


def test_graph_runs_tool_and_records_ui_action():
    agent = create_agent(
        model=FakeModel(),
        tools=[fill_form],
        state_schema=ProfileAgentState,
        context_schema=AgentContext,
        checkpointer=InMemorySaver(),
    )
    result = agent.invoke(
        {"messages": [{"role": "user", "content": "fill my first name"}]},
        config={"configurable": {"thread_id": "smoke-1"}},
        context=AgentContext(user_id="507f1f77bcf86cd799439011"),
    )
    assert result["ui_actions"] == [
        {"type": "fill_form", "fields": {"firstName": "Lalit"}}
    ]
    assert "filled" in result["messages"][-1].content
