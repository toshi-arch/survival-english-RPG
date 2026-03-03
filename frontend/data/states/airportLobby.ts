/**
 * Airport Lobby State定義
 * 
 * JFK空港の到着ロビー - ゲームの開始地点
 * 要件: 1.1, 2.1, 3.2, 9.3
 */

import { State } from '@/types';

export const airportLobbyState: State = {
  id: 'airport-lobby',
  name: 'Airport Lobby',
  description: 'JFK空港の到着ロビー。ここから自由の女神への旅が始まります。',
  npcRole: '空港インフォメーションスタッフ',
  isGoal: false,
  isError: false,
  
  // 必須スロット: 目的地と交通手段
  requiredSlots: ['destination', 'transport'],
  
  mapPosition: { x: 100, y: 100 },
  
  transitions: [
    {
      targetStateId: 'city-transit',
      requiredSlotValues: {
        destination: 'Statue of Liberty',
        transport: 'subway'
      },
      label: '地下鉄で市内へ',
      isCorrect: true
    },
    {
      targetStateId: 'wrong-place',
      label: 'タクシーで直接向かう',
      isCorrect: false
    }
  ]
};
