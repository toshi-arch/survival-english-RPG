/**
 * Wrong Place State定義
 * 
 * 間違った場所 - エラーState
 * 要件: 1.1, 2.1, 3.2, 9.3
 */

import { State } from '@/types';

export const wrongPlaceState: State = {
  id: 'wrong-place',
  name: 'Wrong Place',
  description: '間違った場所に来てしまいました。情報を集め直す必要があります。',
  npcRole: '困惑した通行人',
  isGoal: false,
  isError: true,
  
  // 必須スロット: 正しい方向
  requiredSlots: ['correct_direction'],
  
  mapPosition: { x: 400, y: 400 },
  
  transitions: [
    {
      targetStateId: 'airport-lobby',
      label: '空港に戻る',
      isCorrect: true
    }
  ]
};
