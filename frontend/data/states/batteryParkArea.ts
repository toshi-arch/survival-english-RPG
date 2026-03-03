/**
 * Battery Park Area State定義
 * 
 * Battery Park周辺エリア
 * 要件: 1.1, 2.1, 3.2, 9.3
 */

import { State } from '@/types';

export const batteryParkAreaState: State = {
  id: 'battery-park-area',
  name: 'Battery Park Area',
  description: 'Battery Park周辺に到着。フェリーターミナルを探す必要があります。',
  npcRole: '公園の警備員',
  isGoal: false,
  isError: false,
  
  // 必須スロット: フェリーの場所とチケット情報
  requiredSlots: ['ferry_location', 'ticket_info'],
  
  mapPosition: { x: 400, y: 200 },
  
  transitions: [
    {
      targetStateId: 'ferry-terminal',
      requiredSlotValues: {
        ferry_location: 'Battery Park Ferry Terminal',
        ticket_info: 'ticket booth'
      },
      label: 'フェリーターミナルへ',
      isCorrect: true
    },
    {
      targetStateId: 'wrong-place',
      label: '別の場所へ向かう',
      isCorrect: false
    }
  ]
};
