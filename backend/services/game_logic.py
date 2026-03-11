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
        'required_slots': ['destination', 'transport'],
        'correct_path': 'User should take subway to reach Battery Park. Direct taxi/bus to Statue of Liberty is wrong.',
        'slot_guidance': 'Help user discover: (1) destination = "Statue of Liberty", (2) transport = "subway" or "train"'
    },
    'city-transit': {
        'name': 'City Transit',
        'npc_role': '地下鉄の乗客',
        'required_slots': ['landmark', 'next_transport'],
        'correct_path': 'User should get off at Bowling Green station and walk to Battery Park.',
        'slot_guidance': 'Help user discover: (1) landmark = "Battery Park" or "Bowling Green", (2) next_transport = "walk" or "on foot"'
    },
    'battery-park-area': {
        'name': 'Battery Park Area',
        'npc_role': 'バッテリーパークの案内人',
        'required_slots': ['ferry_location', 'ticket_info'],
        'correct_path': 'User should find the ferry terminal to take ferry to Statue of Liberty.',
        'slot_guidance': 'Help user discover: (1) ferry_location = "Battery Park Ferry Terminal", (2) ticket_info = "ticket booth"'
    },
    'ferry-terminal': {
        'name': 'Ferry Terminal',
        'npc_role': 'フェリーチケット販売員',
        'required_slots': ['ticket_type', 'departure_time'],
        'correct_path': 'User should buy ticket and board the ferry.',
        'slot_guidance': 'Help user discover: (1) ticket_type = "adult" or "standard", (2) departure_time = any reasonable time like "10:00 AM"'
    },
    'statue-of-liberty': {
        'name': 'Statue of Liberty',
        'npc_role': '観光ガイド',
        'required_slots': [],
        'correct_path': 'Goal reached!'
    },
    'wrong-place': {
        'name': 'Wrong Place',
        'npc_role': '困惑した地元の人',
        'required_slots': [],
        'correct_path': 'User made a wrong choice and needs to restart.'
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

Slot guidance (what values to help user discover):
{state.get('slot_guidance', 'No specific guidance')}

Correct path guidance:
{state.get('correct_path', 'No specific path guidance')}

Guidelines:
- Be friendly and patient
- Accept broken English and single words
- Help the user discover the required information naturally through conversation
- When user mentions information related to required slots, update slot_updates in your response
- Guide them towards the CORRECT path
- Do not correct grammar during roleplay
- When all required information is collected, offer movement options
- IMPORTANT: Update slot_updates field when user provides relevant information

Valid state IDs and correct transitions:
- From airport-lobby → city-transit (subway/train) OR wrong-place (taxi/bus)
- From city-transit → battery-park-area (get off at Battery Park) OR wrong-place (wrong station)
- From battery-park-area → ferry-terminal (find ferry terminal) OR wrong-place (wrong location)
- From ferry-terminal → statue-of-liberty (board ferry) OR wrong-place (wrong ferry)

CRITICAL MOVEMENT OPTION RULES:
1. NEVER offer an option that returns to the CURRENT state (e.g., if in city-transit, do NOT offer city-transit as target)
2. The correct option MUST progress to the NEXT state in the sequence
3. The incorrect option should lead to wrong-place
4. Current state is: {state_id}

Required movement options for current state ({state_id}):
- If airport-lobby: [{{"id": "subway", "label": "Take subway to city", "target_state_id": "city-transit", "is_correct": true}}, {{"id": "taxi", "label": "Take taxi directly", "target_state_id": "wrong-place", "is_correct": false}}]
- If city-transit: [{{"id": "battery-park", "label": "Get off at Battery Park", "target_state_id": "battery-park-area", "is_correct": true}}, {{"id": "wrong-station", "label": "Get off at different station", "target_state_id": "wrong-place", "is_correct": false}}]
- If battery-park-area: [{{"id": "ferry-terminal", "label": "Go to ferry terminal", "target_state_id": "ferry-terminal", "is_correct": true}}, {{"id": "wrong-location", "label": "Go somewhere else", "target_state_id": "wrong-place", "is_correct": false}}]
- If ferry-terminal: [{{"id": "board-ferry", "label": "Board ferry to Statue of Liberty", "target_state_id": "statue-of-liberty", "is_correct": true}}, {{"id": "wrong-ferry", "label": "Board different ferry", "target_state_id": "wrong-place", "is_correct": false}}]

Respond in JSON format:
{{
  "npc_message": "your response here",
  "slot_updates": {{"slot_name": "value"}},
  "movement_options": [
    {{"id": "option1", "label": "Correct choice", "target_state_id": "next-state", "is_correct": true}},
    {{"id": "option2", "label": "Wrong choice", "target_state_id": "wrong-place", "is_correct": false}}
  ],
  "should_transition": false
}}

CRITICAL VALIDATION BEFORE RESPONDING:
- Verify target_state_id in movement_options is NOT equal to current state_id ({state_id})
- Verify the correct option's target_state_id matches the next state in the sequence
- For city-transit, correct target MUST be "battery-park-area" (NOT "city-transit")
- Only offer movement options when user has collected ALL required information for current state

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
