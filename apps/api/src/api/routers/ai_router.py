from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from ..controllers.ai_controller import stream_chat_response

route = APIRouter()

class PromptRequest(BaseModel):
    prompt: str

@route.post("/chat/stream")
async def chat_stream(request: PromptRequest):
    return StreamingResponse(
        stream_chat_response(request.prompt),
        media_type="text/plain"
    )
