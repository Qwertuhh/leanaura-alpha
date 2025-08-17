from typing import TypedDict, Literal, Union

# Define OutputToneType
OutputToneType = Union[Literal["conversation"], Literal["chat"]]

# Define AgentState of a Cognitive Agent
class AgentState(TypedDict):
    output_tone: OutputToneType
    notebook_name: str
    notebook_context: str
    message: str
