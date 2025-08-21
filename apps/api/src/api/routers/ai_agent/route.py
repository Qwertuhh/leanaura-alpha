# main.py
from fastapi import FastAPI, APIRouter, HTTPException, Body
from typing import Dict, Set, List, Optional, Literal
from pydantic import BaseModel
import socketio
import logging
import uuid
import time
import json
import asyncio


# A placeholder for your AI model. In a real app, this would be an instance
# of your LLM class that supports streaming.
class MockLLM:
    def __init__(self):
        # A mock implementation to simulate a streaming response
        self.mock_responses = {
            "hello": "Hello there! I'm a helpful AI assistant. How can I help you today?",
            "how are you": "I'm doing great, thank you for asking! I'm ready to assist you.",
            "what's up": "Just processing data and waiting for a chat!",
        }

    async def stream(self, message: str):
        # Find a mock response or generate a generic one
        response = self.mock_responses.get(
            message.strip().lower(),
            "I'm an AI assistant. I can help you with a variety of tasks. Try asking me a question."
        )
        # Simulate a stream by yielding parts of the response
        words = response.split(" ")
        for word in words:
            yield word + " "
            await asyncio.sleep(0.05)  # Simulate network delay


# Assuming llm is configured and imported from your project,
# for this example, we'll use a mock.
llm = MockLLM()

# Configure logging for better visibility
logging.basicConfig(level=logging.INFO)

# Initialize the Socket.IO server
# async_mode='asgi' is crucial for integration with FastAPI
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
sio_app = socketio.ASGIApp(sio)

# Initialize FastAPI router
router = APIRouter()


class RoomManager:
    """
    Manages chat rooms, user memberships, and broadcasts.
    This class is now designed to work directly with Socket.IO SIDs (Session IDs).
    """

    def __init__(self, user_limit: int = 5):
        self.rooms: Dict[str, Set[str]] = {}  # room_id: set of sids
        self.sid_to_room: Dict[str, str] = {}  # sid: room_id
        self.sid_to_user_id: Dict[str, str] = {}  # sid: user_id
        self.max_users_per_room = user_limit

    async def join_room(self, sid: str, room_id: str, user_id: Optional[str] = None):
        """Join or create a room for a given Socket.IO session ID (sid)."""
        # Leave any existing room
        if sid in self.sid_to_room:
            await self.leave_room(sid)

        # Create room if it doesn't exist
        if room_id not in self.rooms:
            self.rooms[room_id] = set()

        # Check if room is full
        if len(self.rooms[room_id]) >= self.max_users_per_room:
            raise ValueError(f"Room {room_id} is full")

        # Assign a user_id if not provided
        assigned_user_id = user_id or f"anon-{str(uuid.uuid4())[:8]}"
        self.sid_to_user_id[sid] = assigned_user_id

        # Add the user's sid to the room
        self.rooms[room_id].add(sid)
        self.sid_to_room[sid] = room_id

        # Formally add the client to the Socket.IO room
        sio.enter_room(sid, room_id)

        room_info = self.get_room_info(room_id)

        # Notify others in the room
        await self.broadcast_message(
            room_id=room_id,
            message={
                "type": "system",
                "content": f"User {assigned_user_id} joined the room",
                "room_info": room_info
            },
            exclude_sid=sid
        )

        return room_info

    async def leave_room(self, sid: str):
        """Leave the current room based on a Socket.IO session ID."""
        if sid not in self.sid_to_room:
            return {"status": "error", "message": "Not in any room"}

        room_id = self.sid_to_room[sid]
        user_id = self.sid_to_user_id.get(sid, "unknown")

        # Remove user from room set
        if room_id in self.rooms:
            self.rooms[room_id].discard(sid)

            # Clean up empty rooms
            if not self.rooms[room_id]:
                del self.rooms[room_id]

        # Remove from Socket.IO room
        sio.leave_room(sid, room_id)

        # Clean up user data
        self.sid_to_room.pop(sid, None)
        self.sid_to_user_id.pop(sid, None)

        # Notify others in the room if room still exists
        if room_id in self.rooms:
            await self.broadcast_message(
                room_id=room_id,
                message={
                    "type": "system",
                    "content": f"User {user_id} left the room",
                    "room_info": self.get_room_info(room_id)
                }
            )

        return {
            "status": "success",
            "room_id": room_id,
            "message": f"Left room {room_id}"
        }

    async def delete_room(self, room_id: str):
        """Delete a room and disconnect all users in it."""
        if room_id not in self.rooms:
            raise ValueError("Room not found")

        # Get a copy of the list of users to avoid issues while iterating and modifying
        users_to_disconnect = list(self.rooms[room_id])

        # Disconnect all users in the room gracefully
        for sid in users_to_disconnect:
            # Send a notification to the user before they are disconnected
            await sio.emit("room_deleted", {"message": f"The room {room_id} has been deleted."}, room=sid)
            # Remove the user from the room manager
            await self.leave_room(sid)

        # Broadcast a final message to the room to confirm deletion
        # This will only be seen by users who are still connected
        # which is none in this case
        await sio.emit("system_message", {"content": f"Room {room_id} has been deleted."}, room=room_id)

        # Final cleanup in case any user was not properly removed
        if room_id in self.rooms:
            del self.rooms[room_id]

        return {"status": "success", "message": f"Room {room_id} deleted"}

    def get_room_info(self, room_id: str) -> dict:
        """Get information about a specific room."""
        if room_id not in self.rooms:
            raise ValueError("Room not found")

        # Get user_ids from sids for a more user-friendly output
        participants = [self.sid_to_user_id[sid] for sid in self.rooms[room_id]]

        return {
            "room_id": room_id,
            "participants": participants,
            "participant_count": len(self.rooms[room_id]),
            "is_full": len(self.rooms[room_id]) >= self.max_users_per_room,
            "timestamp": time.time()
        }

    def get_all_rooms(self) -> List[dict]:
        """Get information about all active rooms."""
        return [self.get_room_info(room_id) for room_id in self.rooms]

    async def broadcast_message(self, room_id: str, message: dict, exclude_sid: str = None):
        """Broadcast a message to all users in a room using Socket.IO."""
        if room_id not in self.rooms:
            return

        # The 'room' parameter targets the specific Socket.IO room
        # The 'skip_sid' parameter excludes the sender
        await sio.emit("message", message, room=room_id, skip_sid=exclude_sid)


# Initialize room manager
room_manager = RoomManager()


# Pydantic models
class RoomRequest(BaseModel):
    room_id: str
    user_id: Optional[str] = None


# --- Socket.IO Event Handlers ---
@sio.event
async def connect(sid, environ):
    """Handles new client connections."""
    logging.info(f"Client connected: {sid}")


@sio.event
async def disconnect(sid):
    """Handles client disconnections."""
    logging.info(f"Client disconnected: {sid}")
    await room_manager.leave_room(sid)


@sio.event
async def join_room(sid, data):
    """
    Handles a client's request to join a room.
    The 'data' dict should contain 'room_id' and optional 'user_id'.
    """
    try:
        room_id = data.get('room_id')
        user_id = data.get('user_id')
        if not room_id:
            raise ValueError("Room ID is required")

        room_info = await room_manager.join_room(sid, room_id, user_id)

        await sio.emit(
            'room_joined',
            {"status": "success", "room_info": room_info},
            room=sid
        )

        logging.info(f"Client {sid} (user {room_manager.sid_to_user_id.get(sid)}) joined room {room_id}")
    except Exception as e:
        error_msg = {"status": "error", "message": str(e)}
        logging.error(f"Error joining room: {error_msg}")
        await sio.emit('error', error_msg, room=sid)


@sio.event
async def chat_message(sid, data):
    """
    Handles a user's chat message and broadcasts it to the room.
    The 'data' dict should contain 'content'.
    """
    room_id = room_manager.sid_to_room.get(sid)
    user_id = room_manager.sid_to_user_id.get(sid)

    if not room_id or not user_id:
        await sio.emit("error", {"message": "Not in a room. Join a room first."}, room=sid)
        return

    message_content = data.get('content')
    if not message_content:
        return

    # Broadcast the user's message to the room
    await room_manager.broadcast_message(
        room_id=room_id,
        message={
            "type": "chat",
            "sender_id": user_id,
            "content": message_content,
            "timestamp": time.time()
        },
        exclude_sid=sid
    )

    # Broadcast typing indicator for AI
    await sio.emit("typing_indicator",
                   {"sender": "ai", "is_typing": True},
                   room=room_id,
                   skip_sid=sid)

    # Stream AI response back to the room
    full_response = ""
    async for chunk in llm.stream(message_content):
        full_response += chunk
        await sio.emit("ai_stream_chunk",
                       {"chunk": chunk, "sender": "ai"},
                       room=room_id)

    # Send a final 'complete' message or turn off typing indicator
    await sio.emit("typing_indicator",
                   {"sender": "ai", "is_typing": False},
                   room=room_id)

    logging.info(f"AI responded in room {room_id}: {full_response[:50]}...")


# --- REST API Endpoints ---
# These endpoints are for management purposes, not for real-time chat.
@router.get("/rooms")
async def list_rooms():
    """List all active rooms."""
    return room_manager.get_all_rooms()


@router.get("/rooms/{room_id}")
async def get_room(room_id: str):
    """Get information about a specific room."""
    try:
        return room_manager.get_room_info(room_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/rooms/join")
async def join_room_rest(request: RoomRequest):
    """
    Join a room via REST. This is not for establishing the WebSocket connection,
    but for a user to see if a room is available.
    """
    # This endpoint is kept for demonstration but a full application would
    # typically only use the Socket.IO join event.
    try:
        # A mock sid is used here as there's no active WebSocket connection
        mock_sid = str(uuid.uuid4())
        room_info = await room_manager.join_room(
            sid=mock_sid,
            room_id=request.room_id,
            user_id=request.user_id
        )
        # Note: This user will "exist" in the RoomManager but not have a WS connection.
        return room_info
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/rooms/{room_id}")
async def delete_room(room_id: str):
    """
    Delete a room and disconnect all users in it.
    This is an administrative endpoint.
    """
    try:
        return await room_manager.delete_room(room_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# Main FastAPI application setup
app = FastAPI()

# Mount the Socket.IO app
app.mount("/socket.io", sio_app)

# Include the REST API router
app.include_router(router)
