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
        # ファイル形式の検証（より柔軟に）
        # 音声ファイルの拡張子またはcontent_typeをチェック
        allowed_types = ['audio/', 'video/', 'application/octet-stream']
        allowed_extensions = ['.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.wav', '.webm']
        
        is_valid = False
        if audio.content_type:
            is_valid = any(audio.content_type.startswith(t) for t in allowed_types)
        
        if not is_valid and audio.filename:
            is_valid = any(audio.filename.lower().endswith(ext) for ext in allowed_extensions)
        
        if not is_valid:
            return STTResponse(
                success=False,
                error=f"Invalid file type. Received: {audio.content_type}. Supported: audio files (mp3, wav, webm, etc.)"
            )
        
        # ファイルをタプル形式で渡す（ファイル名を含める）
        # OpenAI APIはファイル名から形式を判断する
        # webmファイルの場合は明示的にファイル名を設定
        filename = audio.filename or "audio.webm"
        content_type = audio.content_type or "audio/webm"
        
        # ファイル名に拡張子がない場合は追加
        if not any(filename.lower().endswith(ext) for ext in allowed_extensions):
            filename = "audio.webm"
        
        file_tuple = (filename, audio.file, content_type)
        
        # OpenAI Whisper APIを呼び出し
        transcript = await openai_service.transcribe_audio(file_tuple)
        
        return STTResponse(success=True, text=transcript)
    
    except Exception as e:
        return STTResponse(
            success=False,
            error=f"STT error: {str(e)}"
        )
