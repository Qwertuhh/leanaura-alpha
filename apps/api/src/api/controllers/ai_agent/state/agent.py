from typing import TypedDict

class AgentState(TypedDict):
  notebook_name: str
  notebook_canvas_context: str
  message: str

