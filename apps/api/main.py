from fastapi import FastAPI
from routers.ai_router import route as ai_route
from fastapi.responses import StreamingResponse
import time

app = FastAPI()
app.include_router(ai_route, prefix="/api/ai", tags=["ai"])
