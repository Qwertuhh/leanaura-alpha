from fastapi import APIRouter
from controllers.ai_controller import stream_chat_response
from fastapi.responses import StreamingResponse

route = APIRouter()

@route.get("/ai_response_routing")
def chat_stream():
    return StreamingResponse(stream_chat_response(), media_type="text/plain")

