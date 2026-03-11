"""
チャットAPIエンドポイント

要件: 2.2, 10.1, 10.2, 10.3, 10.4
"""

from fastapi import APIRouter, HTTPException
from models.game import ChatRequest, ChatResponse, NPCResponse
from services.openai_service import OpenAIService
from services.game_logic import GameLogic

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
        # デバッグ用ログ
        print(f"Received chat request: session_id={request.session_id}, state_id={request.state_id}")
        print(f"User message: {request.user_message}")
        print(f"Current slots: {request.current_slots}")
        print(f"Conversation history length: {len(request.conversation_history)}")
        
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
        
        # Movement optionsの検証（デバッグ用）
        if npc_response.movement_options:
            for option in npc_response.movement_options:
                if option.target_state_id == request.state_id:
                    print(f"WARNING: Movement option loops back to current state!")
                    print(f"  Current state: {request.state_id}")
                    print(f"  Option: {option.label} -> {option.target_state_id}")
                    print(f"  This should not happen. AI generated incorrect movement options.")
        
        return ChatResponse(success=True, data=npc_response)
    
    except ValueError as e:
        # パースエラーまたはバリデーションエラー
        print(f"ValueError in chat endpoint: {str(e)}")
        return ChatResponse(
            success=False,
            error=f"Response parsing error: {str(e)}"
        )
    
    except Exception as e:
        # その他のエラー
        print(f"Exception in chat endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        return ChatResponse(
            success=False,
            error=f"Chat processing error: {str(e)}"
        )
