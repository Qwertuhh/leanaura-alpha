from api.controllers.ai_agent.tools.greet import greet
from api.controllers.ai_agent.state import AgentState

def greeting_node(state: AgentState) -> AgentState:
    name = state["name"]
    greeting = greet.invoke(name)
    return {**state, "greeting": greeting}
