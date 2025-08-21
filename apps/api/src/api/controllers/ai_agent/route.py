import json
import uuid
import time
import logging
from typing import Dict, Set, Optional, List
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from langgraph.graph import StateGraph

from api.controllers.ai_agent.config import llm
from api.controllers.ai_agent.tools.greet import greet
from api.controllers.ai_agent.state.agent import AgentState

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize router
router = APIRouter()

# LangGraph setup
llm_with_tools = llm.bind_tools([greet])
graph = StateGraph(AgentState)
graph.add_node("greet", greet)
agent = graph.compile()

# Room Management
class RoomManager:
    def __init__(self, user_limit: int = 5):
        self.rooms: Dict[str, Set[str]] = {}  # room_id: set of sids
        self.user_rooms: Dict[str, str] = {}  # sid: room_id
        self.user_names: Dict[str, str] = {}  # sid: username
        self.max_users_per_room = user_limit
        self.active_connections: Dict[str, WebSocket] = {}

    def join_room(self, sid: str, room_id: str, username: str) -> dict:
        """Join a room, creating it if it doesn't exist"""
        # Leave any existing room
        if sid in self.user_rooms:
            self.leave_room(sid)
        
        # Create room if it doesn't exist
        if room_id not in self.rooms:
            self.rooms[room_id] = set()
        
        # Check if room is full
        if len(self.rooms[room_id]) >= self.max_users_per_room:
            raise ValueError(f"Room {room_id} is full (max {self.max_users_per_room} users)")
        
        # Join the room
        self.rooms[room_id].add(sid)
        self.user_rooms[sid] = room_id
        self.user_names[sid] = username
        
        return {
            "room_id": room_id,
            "participants": list(self.rooms[room_id]),
            "is_full": len(self.rooms[room_id]) >= self.max_users_per_room
        }

    def leave_room(self, sid: str) -> dict:
        """Leave the current room"""
        if sid not in self.user_rooms:
            return {"status": "error", "message": "Not in any room"}
            
        room_id = self.user_rooms.get(sid)
        if not room_id:
            return {"status": "error", "message": "Room not found"}
            
        # Remove user from room
        if room_id in self.rooms:
            self.rooms[room_id].discard(sid)
            
            # Clean up empty rooms
            if not self.rooms[room_id]:
                del self.rooms[room_id]
        
        # Remove user tracking
        self.user_rooms.pop(sid, None)
        self.user_names.pop(sid, None)
        
        return {
            "status": "success",
            "room_id": room_id,
            "message": f"Left room {room_id}"
        }

    def get_room_info(self, room_id: str) -> dict:
        """Get information about a specific room"""
        if room_id not in self.rooms:
            return {"error": "Room not found"}
            
        return {
            "room_id": room_id,
            "participants": list(self.rooms[room_id]),
            "participant_count": len(self.rooms[room_id]),
            "is_full": len(self.rooms[room_id]) >= self.max_users_per_room
        }

    def get_all_rooms(self) -> dict:
        """Get information about all rooms"""
        return {
            room_id: {
                "participants": list(sids),
                "participant_count": len(sids),
                "is_full": len(sids) >= self.max_users_per_room
            }
            for room_id, sids in self.rooms.items()
        }

    async def handle_ai_response(self, room_id: str, message: str, sender_sid: str):
        """Handle AI response to a message"""
        try:
            # Process the message with LangGraph agent
            result = agent.invoke({"messages": [("user", message)]})
            ai_response = result.get("messages", [{}])[-1].get("content", "I'm not sure how to respond to that.")
            
            # Broadcast AI response to the room
            await self.broadcast_message(
                room_id=room_id,
                message={
                    "type": "ai",
                    "content": ai_response,
                    "sender": "AI Assistant",
                    "timestamp": time.time()
                }
            )
        except Exception as e:
            logger.error(f"AI processing error: {e}")

    async def broadcast_message(self, room_id: str, message: dict):
        """Broadcast a message to all clients in a room"""
        if room_id not in self.rooms:
            raise ValueError("Room not found")
        
        # Add metadata to message
        message_data = {
            **message,
            "timestamp": time.time(),
            "room_id": room_id
        }
        
        # Broadcast to all clients in the room
        for sid in list(self.rooms[room_id]):
            try:
                if sid in self.active_connections:
                    await self.active_connections[sid].send_json(message_data)
            except Exception as e:
                logger.error(f"Error sending to {sid}: {e}")
                # Clean up disconnected clients
                if sid in self.user_rooms:
                    self.leave_room(sid)

    def delete_room(self, room_id: str) -> bool:
        """Delete a room and all its participants"""
        if room_id not in self.rooms:
            return False
            
        # Clean up user data
        for sid in list(self.rooms[room_id]):
            self.user_rooms.pop(sid, None)
            self.user_names.pop(sid, None)
            self.active_connections.pop(sid, None)
                
        # Delete the room
        del self.rooms[room_id]
        return True

# Initialize room manager
room_manager = RoomManager()

# Pydantic models
class RoomRequest(BaseModel):
    room_id: str
    username: str = "User"

class MessageRequest(BaseModel):
    content: str
    sender: str = "user"

# WebSocket endpoint
@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, username: str = "User"):
    await websocket.accept()
    client_id = str(uuid.uuid4())
    
    try:
        # Register the connection
        room_manager.active_connections[client_id] = websocket
        
        # Join the room
        room_manager.join_room(client_id, room_id, username)
        
        # Notify room about new user
        await room_manager.broadcast_message(
            room_id=room_id,
            message={
                "type": "system",
                "content": f"{username} joined the room",
                "participants": [room_manager.user_names.get(sid, "User") 
                               for sid in room_manager.rooms[room_id]],
                "sender": "System"
            }
        )
        
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                
                # Handle different message types
                if message.get("type") == "chat":
                    # Broadcast user message
                    await room_manager.broadcast_message(
                        room_id=room_id,
                        message={
                            "type": "chat",
                            "content": message["content"],
                            "sender": username,
                            "sender_id": client_id
                        }
                    )
                    
                    # Get AI response
                    await room_manager.handle_ai_response(room_id, message["content"], client_id)
                    
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON received: {data}")
            except Exception as e:
                logger.error(f"Error processing message: {e}")
    
    except WebSocketDisconnect:
        # Handle disconnection
        logger.info(f"Client {client_id} disconnected")
    finally:
        # Clean up
        room_manager.active_connections.pop(client_id, None)
        room_info = room_manager.leave_room(client_id)
        
        if room_info.get("status") == "success":
            # Notify room about user leaving
            await room_manager.broadcast_message(
                room_id=room_id,
                message={
                    "type": "system",
                    "content": f"{username} left the room",
                    "participants": [room_manager.user_names.get(sid, "User")
                                   for sid in room_manager.rooms.get(room_id, [])],
                    "sender": "System"
                }
            )

# REST API Endpoints
@router.post("/rooms/join")
async def join_room(data: RoomRequest):
    """Join a room"""
    try:
        client_id = str(uuid.uuid4())
        return room_manager.join_room(
            sid=client_id,
            room_id=data.room_id,
            username=data.username
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/rooms/leave")
async def leave_room(data: RoomRequest):
    """Leave the current room"""
    # Find the socket ID for this user
    socket_id = next((sid for sid, name in room_manager.user_names.items()
                     if name == data.username), None)
    
    if not socket_id:
        raise HTTPException(status_code=404, detail="User not found in any room")
        
    result = room_manager.leave_room(sid=socket_id)
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.delete("/rooms/{room_id}")
async def delete_room(room_id: str):
    """Delete a room (admin only)"""
    if not room_manager.delete_room(room_id):
        raise HTTPException(status_code=404, detail="Room not found")
    return {"status": "success", "message": f"Room {room_id} deleted"}

@router.get("/rooms/{room_id}/participants")
async def get_participants(room_id: str):
    """Get list of participants in a room"""
    room = room_manager.get_room_info(room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    return {
        "room_id": room_id,
        "participants": [
            {"id": sid, "name": room_manager.user_names.get(sid, "Anonymous")}
            for sid in room.get("participants", [])
        ]
    }

@router.get("/rooms")
async def list_rooms():
    """List all active rooms"""
    return room_manager.get_all_rooms()
