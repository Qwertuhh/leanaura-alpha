from fastapi import APIRouter
from controllers.ai_controller import stream_chat_response
from fastapi.responses import StreamingResponse

route = APIRouter()
@route.post("/ai_response_routing")
async def chat_stream(prompt: str):
    return StreamingResponse(stream_chat_response(prompt), media_type="text/plain")

