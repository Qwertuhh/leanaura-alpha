from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.const.server_info import server_info
from api.routers.ai_agent.route import router as ai_agent_router, sio
import socketio

def create_app() -> FastAPI:
    app = FastAPI(
        **server_info
    )
    app_socket = socketio.ASGIApp(sio, app)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # * Server Info
    @app.get("/", tags=["Server Info"])
    async def get_server_info():
        return server_info
    app.include_router(ai_agent_router, prefix="/api/v1", tags=["AI Agent"])
    print("\nAPI initialized!")
    return app

# Create the app instance
app = create_app()