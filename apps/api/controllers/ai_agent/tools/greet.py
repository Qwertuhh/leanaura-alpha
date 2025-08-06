from langchain.tools import tool

@tool
def greet(name: str) -> str:
    """Greets a person by their name.
    
    Args:
        name: The name of the person to greet
        
    Returns:
        A greeting message with the person's name
    """
    return f"Hello, {name}! 👋"