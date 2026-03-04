"""
FastAPIメインアプリケーション

要件: 11.1
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

# FastAPIアプリケーションの作成
app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for Survival English Roleplay Game",
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """ルートエンドポイント"""
    return {
        "message": "Survival English Roleplay API",
        "version": settings.APP_VERSION,
    }


@app.get("/health")
async def health_check():
    """ヘルスチェックエンドポイント"""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
    }


# TODO: Phase 2でAPIルーターを追加
# from api import chat, tts, stt
# app.include_router(chat.router, prefix="/api", tags=["chat"])
# app.include_router(tts.router, prefix="/api", tags=["tts"])
# app.include_router(stt.router, prefix="/api", tags=["stt"])
