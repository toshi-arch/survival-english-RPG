"""
Speech-to-Text APIエンドポイント

要件: 8.4
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from models.openai_models import STTResponse
from services.openai_service import OpenAIService

router = APIRouter()

# サービスインスタンスの作成
openai_service = OpenAIService()


@router.post("/stt", response_model=STTResponse)
async def speech_to_text(audio: UploadFile = File(...)):
    """
    Speech-to-Textエンドポイント
    
    音声ファイルをテキストに変換
    
    Args:
        audio: アップロードされた音声ファイル
        
    Returns:
        STTResponse: 認識されたテキストまたはエラー情報
    """
    try:
        # ファイル形式の検証
        if not audio.content_type or not audio.content_type.startswith('audio/'):
            return STTResponse(
                success=False,
                error="Invalid file type. Audio file required."
            )
        
        # OpenAI Whisper APIを呼び出し
        transcript = await openai_service.transcribe_audio(audio.file)
        
        return STTResponse(success=True, text=transcript)
    
    except Exception as e:
        return STTResponse(
            success=False,
            error=f"STT error: {str(e)}"
        )
