import os
from typing import Optional
from langfuse import get_client
from langfuse.langchain import CallbackHandler
from langchain_google_genai import ChatGoogleGenerativeAI

# * Initialize Langfuse for monitoring
langfuse = get_client()
langfuse_handler = CallbackHandler()


def get_llm(api_key: Optional[str] = None, model: str = "gemini-2.5-flash"):
    """Initialize and return a configured ChatGoogleGenerativeAI instance.

    Args:
        api_key: Optional Google API key. If not provided, will use GOOGLE_API_KEY from env.
        model: The model name to use (default: "gemini-2.5-flash")

    Returns:
        Configured ChatGoogleGenerativeAI instance with tools bound
    """
    # Get API key from parameter or environment variable
    api_key = api_key or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError(
            "Google API key is required. "
            "Either pass it as an argument or set the GOOGLE_API_KEY environment variable."
        )

    return ChatGoogleGenerativeAI(
        model=model,
        google_api_key=api_key,
        temperature=0.2,
        top_p=0.95,
        top_k=40,
        timeout=60,  # seconds
        max_retries=3,
    )


# * Initialize the default LLM instance
llm = get_llm().bind_tools([])
