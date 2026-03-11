"""
FastAPIメインアプリケーション

要件: 11.1
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from config import settings
from api import chat, tts, stt

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


# バリデーションエラーハンドラー
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Pydanticバリデーションエラーの詳細をログに出力
    """
    body = await request.body()
    print(f"Validation error for {request.method} {request.url}")
    print(f"Error details: {exc.errors()}")
    print(f"Request body: {body}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": exc.errors(),
            "body": body.decode('utf-8') if body else "",
        },
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


# APIルーターの登録
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(tts.router, prefix="/api", tags=["tts"])
app.include_router(stt.router, prefix="/api", tags=["stt"])
