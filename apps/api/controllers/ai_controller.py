from openai import OpenAI
import os
from dotenv import load_dotenv
from typing import Generator
import time

load_dotenv()

client = OpenAI(
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
    response = client.chat.completions.create(
        model="gemini-2.0-flash",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        stream=True
    )
    for chunk in response:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta

