/**
 * Ferry Terminal State定義
 * 
 * フェリーターミナル
 * 要件: 1.1, 2.1, 3.2, 9.3
 */

import { State } from '@/types';

export const ferryTerminalState: State = {
  id: 'ferry-terminal',
  name: 'Ferry Terminal',
  description: 'フェリーターミナルに到着。チケットを購入して乗船する必要があります。',
  npcRole: 'チケット売り場のスタッフ',
  isGoal: false,
  isError: false,
  
  // 必須スロット: チケットの種類と出発時刻
  requiredSlots: ['ticket_type', 'departure_time'],
  
  mapPosition: { x: 550, y: 250 },
  
  transitions: [
    {
      targetStateId: 'statue-of-liberty',
      requiredSlotValues: {
        ticket_type: 'Statue of Liberty',
        departure_time: 'next ferry'
      },
      label: 'フェリーに乗船',
      isCorrect: true
    },
    {
      targetStateId: 'wrong-place',
      label: '間違ったフェリーに乗る',
      isCorrect: false
    }
  ]
};
