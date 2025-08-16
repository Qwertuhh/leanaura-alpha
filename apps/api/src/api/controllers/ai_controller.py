import os
from typing import Generator
from api.const.ai_prompts import  ai_stream_chat_prompt
from langfuse import get_client
from langfuse.openai import openai

langfuse = get_client()



client = openai.OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)


def stream_chat_response(prompt: str) -> Generator[str, None, None]:
    """
    Generates a stream of chat responses using the OpenAI API.

    This function interacts with the OpenAI API to create a chat completion
    response based on predefined messages. It streams the generated content
    in real-time, yielding each piece of content as it becomes available.

    Yields:
        str: The content of the chat response in chunks as it is streamed.

    """

    # Create chat completion with proper configuration for Gemini
    response = client.chat.completions.create(
        model="gemini-pro",  # type: ignore  # Using Gemini Pro model
        messages=[
            {"role": "system", "content": ai_stream_chat_prompt},
            {"role": "user", "content": prompt}
        ],
        stream=True,
        
        # Langfuse metadata for tracking
        metadata={
            "session_id": "session_123",
            "user_id": "user_456",
            "tags": ["production", "chat-bot"],
            "custom_field": "additional metadata"
        }
    )
    for chunk in response:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta