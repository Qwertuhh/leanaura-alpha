from fastapi import APIRouter
from api.controllers.ai_agent.config import llm

router = APIRouter()


@router.post("/ai")
async def ai_call(state: dict):
    """
    Call the agent with the given state.

    Args:
        state: The initial state for the agent

    Returns:
        The final state after the agent has run
    """

    # Chat interface
    messages = [
        ("system", "You are a helpful assistant."),
        ("human", "Tell me a joke"),
    ]
    response = llm.invoke(messages)
    print(response.content)