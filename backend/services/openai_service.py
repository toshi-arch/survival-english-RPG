"""
OpenAI API統合サービス

ChatGPT、TTS、Whisper APIとの統合を提供
要件: 8.4, 8.10, 8.13
"""

from openai import AsyncOpenAI
from typing import BinaryIO
from config import settings


class OpenAIService:
    """OpenAI APIサービスクラス"""
    
    def __init__(self):
        """OpenAIクライアントの初期化"""
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.chat_model = settings.OPENAI_MODEL
        self.tts_model = settings.OPENAI_TTS_MODEL
        self.tts_voice = settings.OPENAI_TTS_VOICE
        self.whisper_model = settings.OPENAI_WHISPER_MODEL
    
    async def generate_npc_response(
        self,
        prompt: str,
        user_message: str
    ) -> str:
        """
        ChatGPT APIを使用してNPC応答を生成
        
        Args:
            prompt: システムプロンプト（ゲーム状態とNPC役割を含む）
            user_message: ユーザーのメッセージ
            
        Returns:
            JSON形式のNPC応答文字列
            
        Raises:
            Exception: OpenAI API呼び出しエラー
        """
        try:
            response = await self.client.chat.completions.create(
                model=self.chat_model,
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_tokens=500,
                response_format={"type": "json_object"}
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            raise Exception(f"OpenAI Chat API error: {str(e)}")
    
    async def generate_speech(
        self,
        text: str,
        voice: str = "alloy",
        speed: float = 1.0
    ):
        """
        OpenAI TTS APIを使用して音声を生成
        
        Args:
            text: 音声に変換するテキスト
            voice: 音声の種類（alloy, echo, fable, onyx, nova, shimmer）
            speed: 再生速度（0.25-4.0）
            
        Returns:
            音声データのバイトストリーム
            
        Raises:
            Exception: OpenAI TTS API呼び出しエラー
        """
        try:
            response = await self.client.audio.speech.create(
                model=self.tts_model,
                voice=voice,
                input=text,
                speed=speed
            )
            
            return response.iter_bytes()
        
        except Exception as e:
            raise Exception(f"OpenAI TTS API error: {str(e)}")
    
    async def transcribe_audio(self, audio_file) -> str:
        """
        OpenAI Whisper APIを使用して音声をテキストに変換
        
        Args:
            audio_file: 音声ファイル（タプル形式: (filename, file, content_type)）
            
        Returns:
            認識されたテキスト
            
        Raises:
            Exception: OpenAI Whisper API呼び出しエラー
        """
        try:
            transcript = await self.client.audio.transcriptions.create(
                model=self.whisper_model,
                file=audio_file,
                language="en"
            )
            
            return transcript.text
        
        except Exception as e:
            raise Exception(f"OpenAI Whisper API error: {str(e)}")
