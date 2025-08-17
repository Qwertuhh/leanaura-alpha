from typing import Literal, Union
from pydantic import BaseModel

# Define OutputToneType
OutputToneType = Union[Literal["conversation"], Literal["chat"]]

# Define AgentState of a Cognitive Agent
class AgentState(BaseModel):
    output_tone: OutputToneType
    notebook_name: str
    notebook_context: str
    message: str
