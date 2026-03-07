"""
ゲームロジックサービス

プロンプト構築とAI応答のパース処理
要件: 2.2, 10.3, 10.4
"""

import json
from typing import Dict, List, Optional
from models.game import Message, NPCResponse


# State定義（フロントエンドのデータと同期）
STATE_DEFINITIONS = {
    'airport-lobby': {
        'name': 'Airport Lobby',
        'npc_role': '空港インフォメーションスタッフ',
        'required_slots': ['destination', 'transport']
    },
    'city-transit': {
        'name': 'City Transit',
        'npc_role': '地下鉄の乗客',
        'required_slots': ['landmark', 'ferry_location']
    },
    'battery-park-area': {
        'name': 'Battery Park Area',
        'npc_role': 'バッテリーパークの案内人',
        'required_slots': ['ferry_terminal']
    },
    'ferry-terminal': {
        'name': 'Ferry Terminal',
        'npc_role': 'フェリーチケット販売員',
        'required_slots': ['ticket', 'boarding']
    },
    'statue-of-liberty': {
        'name': 'Statue of Liberty',
        'npc_role': '観光ガイド',
        'required_slots': []
    },
    'wrong-place': {
        'name': 'Wrong Place',
        'npc_role': '困惑した地元の人',
        'required_slots': []
    }
}


class GameLogic:
    """ゲームロジック処理クラス"""
    
    def build_npc_prompt(
        self,
        state_id: str,
        slots: Dict[str, Optional[str]],
        history: List[Message]
    ) -> str:
        """
        ゲーム状態に基づいてNPCプロンプトを構築
        
        Args:
            state_id: 現在のState ID
            slots: 現在収集されているスロット情報
            history: 会話履歴
            
        Returns:
            システムプロンプト文字列
        """
        # State定義を取得
        state = STATE_DEFINITIONS.get(state_id)
        if not state:
            raise ValueError(f"Unknown state_id: {state_id}")
        
        # スロット情報をフォーマット
        slots_info = self._format_slots(slots, state['required_slots'])
        
        # 会話履歴をフォーマット
        history_info = self._format_history(history)
        
        # プロンプトを構築
        prompt = f"""You are a {state['npc_role']} at {state['name']}.
You are helping a beginner English learner who is trying to reach their destination.

Current information collected:
{slots_info}

Required information to proceed:
{', '.join(state['required_slots']) if state['required_slots'] else 'None (goal reached)'}

Guidelines:
- Be friendly and patient
- Accept broken English and single words
- Help the user discover the required information naturally
- Do not correct grammar during roleplay
- When all required information is collected, offer movement options

Valid state IDs for target_state_id:
- airport-lobby
- city-transit
- battery-park-area
- ferry-terminal
- statue-of-liberty
- wrong-place

Respond in JSON format:
{{
  "npc_message": "your response here",
  "slot_updates": {{"slot_name": "value"}},
  "movement_options": [
    {{"id": "option1", "label": "Go to Battery Park", "target_state_id": "battery-park-area", "is_correct": true}}
  ],
  "should_transition": false
}}

IMPORTANT: Use exact state IDs from the list above. Do NOT add prefixes like "state-" to the state IDs.

Conversation history:
{history_info}
"""
        return prompt
    
    def _format_slots(
        self,
        slots: Dict[str, Optional[str]],
        required_slots: List[str]
    ) -> str:
        """
        スロット情報をフォーマット
        
        Args:
            slots: 現在のスロット値
            required_slots: 必須スロットのリスト
            
        Returns:
            フォーマットされたスロット情報
        """
        if not required_slots:
            return "No information required (goal state)"
        
        lines = []
        for slot in required_slots:
            value = slots.get(slot)
            status = value if value else "not yet collected"
            lines.append(f"- {slot}: {status}")
        return "\n".join(lines)
    
    def _format_history(self, history: List[Message]) -> str:
        """
        会話履歴をフォーマット（最新5件のみ）
        
        Args:
            history: 会話履歴のリスト
            
        Returns:
            フォーマットされた会話履歴
        """
        if not history:
            return "No previous conversation"
        
        # 最新5件のみ取得
        recent_history = history[-5:]
        
        return "\n".join([
            f"{msg.role}: {msg.content}"
            for msg in recent_history
        ])
    
    def parse_ai_response(self, ai_response: str) -> NPCResponse:
        """
        AI応答をパースして検証
        
        Args:
            ai_response: OpenAI APIからのJSON文字列応答
            
        Returns:
            パースされたNPCResponse
            
        Raises:
            ValueError: JSON解析エラーまたは必須フィールド欠落
        """
        try:
            data = json.loads(ai_response)
            
            # 必須フィールドの検証
            if "npc_message" not in data:
                raise ValueError("Missing npc_message field")
            
            # NPCResponseモデルを構築
            return NPCResponse(
                npc_message=data["npc_message"],
                slot_updates=data.get("slot_updates"),
                movement_options=data.get("movement_options"),
                should_transition=data.get("should_transition", False)
            )
        
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON response: {str(e)}")
        except Exception as e:
            raise ValueError(f"Failed to parse AI response: {str(e)}")
