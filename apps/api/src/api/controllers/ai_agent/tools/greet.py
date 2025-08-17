from langchain.tools import tool

@tool
def greet(name: str) -> str:
    """Greets the user by name."""
    return f"Hello, {name}! Welcome to the LangGraph agent."
