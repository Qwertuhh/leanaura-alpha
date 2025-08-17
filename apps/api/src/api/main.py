from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.const.server_info import server_info

def create_app() -> FastAPI:
    app = FastAPI(
        **server_info
    )

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

    print("\nAPI initialized!")
    return app

# Create the app instance
app = create_app()