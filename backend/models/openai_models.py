"""
OpenAI関連モデル

要件: 10.2, 10.3
"""

from pydantic import BaseModel, Field
from typing import Optional


class TTSRequest(BaseModel):
    """Text-to-Speechリクエスト"""
    text: str = Field(..., min_length=1, max_length=4096)
    voice: str = Field(default="alloy", pattern="^(alloy|echo|fable|onyx|nova|shimmer)$")
    speed: float = Field(default=1.0, ge=0.25, le=4.0)


class STTResponse(BaseModel):
    """Speech-to-Textレスポンス"""
    success: bool
    text: Optional[str] = None
    error: Optional[str] = None
