"""
ゲームデータモデル

要件: 10.2, 10.3
"""

from pydantic import BaseModel, Field
from typing import Optional


class Message(BaseModel):
    """会話メッセージ"""
    id: str
    role: str = Field(..., pattern="^(user|npc)$")
    content: str
    timestamp: str


class ChatRequest(BaseModel):
    """チャットAPIリクエスト"""
    session_id: str = Field(..., min_length=1)
    state_id: str = Field(..., min_length=1)
    user_message: str = Field(..., min_length=1)
    conversation_history: list[Message] = Field(default_factory=list)
    current_slots: dict[str, Optional[str]] = Field(default_factory=dict)


class MovementOption(BaseModel):
    """移動選択肢"""
    id: str
    label: str
    target_state_id: str
    is_correct: bool


class NPCResponse(BaseModel):
    """NPC応答"""
    npc_message: str = Field(..., min_length=1)
    slot_updates: Optional[dict[str, str]] = None
    movement_options: Optional[list[MovementOption]] = None
    should_transition: bool = False


class ChatResponse(BaseModel):
    """チャットAPIレスポンス"""
    success: bool
    data: Optional[NPCResponse] = None
    error: Optional[str] = None
