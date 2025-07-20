from fastapi import FastAPI
from routers.ai_router import route as ai_route
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(ai_route, prefix="/api/ai", tags=["ai"])
