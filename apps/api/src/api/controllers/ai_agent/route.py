from langgraph.graph import StateGraph
from api.controllers.ai_agent.config import llm
from api.controllers.ai_agent.tools.greet import greet
from api.controllers.ai_agent.state.agent import AgentState

# Bind tool to LLM
llm_with_tools = llm.bind_tools([greet])

# Define graph
graph = StateGraph(AgentState)
graph.add_node("greet", greet)

agent = graph.compile()
