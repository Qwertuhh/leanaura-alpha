from fastapi import FastAPI
from routers.ai import route as ai_route

app = FastAPI()
app.include_router(ai_route, prefix="/ai", tags=["ai"])