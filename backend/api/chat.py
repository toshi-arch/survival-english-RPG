"""
チャットAPIエンドポイント

要件: 2.2, 10.1, 10.2, 10.3, 10.4
"""

from fastapi import APIRouter, HTTPException
from backend.models.game import ChatRequest, ChatResponse, NPCResponse
from backend.services.openai_service import OpenAIService
from backend.services.game_logic import GameLogic

router = APIRouter()

# サービスインスタンスの作成
openai_service = OpenAIService()
game_logic = GameLogic()


@router.post("/chat", response_model=ChatResponse)
async def process_chat(request: ChatRequest):
    """
    チャット処理エンドポイント
    
    ユーザーメッセージを受け取り、OpenAI APIを使用してNPC応答を生成
    
    Args:
        request: チャットリクエスト（session_id, state_id, user_message, etc.）
        
    Returns:
        ChatResponse: NPC応答またはエラー情報
    """
    try:
        # ゲームロジックでプロンプトを構築
        prompt = game_logic.build_npc_prompt(
            state_id=request.state_id,
            slots=request.current_slots,
            history=request.conversation_history
        )
        
        # OpenAI ChatGPT APIを呼び出し
        ai_response = await openai_service.generate_npc_response(
            prompt=prompt,
            user_message=request.user_message
        )
        
        # 応答をパースして検証
        npc_response = game_logic.parse_ai_response(ai_response)
        
        return ChatResponse(success=True, data=npc_response)
    
    except ValueError as e:
        # パースエラーまたはバリデーションエラー
        return ChatResponse(
            success=False,
            error=f"Response parsing error: {str(e)}"
        )
    
    except Exception as e:
        # その他のエラー
        return ChatResponse(
            success=False,
            error=f"Chat processing error: {str(e)}"
        )
