"""
設定管理

環境変数の読み込みと設定値の管理
要件: 11.1
"""

import os
from dotenv import load_dotenv

# .envファイルの読み込み
load_dotenv()


class Settings:
    """アプリケーション設定"""
    
    # OpenAI API設定
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4")
    OPENAI_TTS_MODEL: str = os.getenv("OPENAI_TTS_MODEL", "tts-1")
    OPENAI_TTS_VOICE: str = os.getenv("OPENAI_TTS_VOICE", "alloy")
    OPENAI_WHISPER_MODEL: str = os.getenv("OPENAI_WHISPER_MODEL", "whisper-1")
    
    # CORS設定
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://frontend:3000",
    ]
    
    # アプリケーション設定
    APP_NAME: str = "Survival English Roleplay API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"


# グローバル設定インスタンス
settings = Settings()
