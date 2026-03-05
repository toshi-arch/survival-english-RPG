"""
Text-to-Speech APIエンドポイント

要件: 8.10, 8.13
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models.openai_models import TTSRequest
from services.openai_service import OpenAIService

router = APIRouter()

# サービスインスタンスの作成
openai_service = OpenAIService()


@router.post("/tts")
async def text_to_speech(request: TTSRequest):
    """
    Text-to-Speechエンドポイント
    
    テキストを音声に変換してストリーミング返却
    
    Args:
        request: TTSリクエスト（text, voice, speed）
        
    Returns:
        StreamingResponse: 音声データ（audio/mpeg）
        
    Raises:
        HTTPException: TTS API呼び出しエラー
    """
    try:
        # OpenAI TTS APIを呼び出し
        audio_stream = await openai_service.generate_speech(
            text=request.text,
            voice=request.voice,
            speed=request.speed
        )
        
        return StreamingResponse(
            audio_stream,
            media_type="audio/mpeg"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"TTS error: {str(e)}"
        )
