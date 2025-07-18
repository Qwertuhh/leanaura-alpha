from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from openai import OpenAI
import os
from dotenv import load_dotenv
from typing import Generator

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

app = FastAPI()

def stream_chat_response() -> Generator[str, None, None]:
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
            {"role": "user", "content": "Hello!"}
        ],
        stream=True
    )
    for chunk in response:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta

@app.get("/ai_response_routing")
def chat_stream():
    return StreamingResponse(stream_chat_response(), media_type="text/plain")


def random_string_stream() -> Generator[str, None, None]:
    """
    Generates a stream of random strings.

    Yields:
        str: A random string of 10 characters.

    """
    while True:
        yield ''.join(random.choices(string.ascii_letters + string.digits, k=10))

@app.get("/random_string_stream")
def random_string_stream_response():
    return