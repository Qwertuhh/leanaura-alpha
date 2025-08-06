from langgraph.graph import StateGraph
from controllers.ai_agent.state import AgentState
from controllers.ai_agent.nodes.greet import greeting_node

graph = StateGraph(AgentState)
graph.add_node("greet_node", greeting_node)
graph.set_entry_point("greet_node")
app = graph.compile()
print("AI Agent initialized!")