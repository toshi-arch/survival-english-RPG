/**
 * City Transit State定義
 * 
 * 地下鉄で市内を移動中
 * 要件: 1.1, 2.1, 3.2, 9.3
 */

import { State } from '@/types';

export const cityTransitState: State = {
  id: 'city-transit',
  name: 'City Transit',
  description: '地下鉄に乗って市内を移動中。次の目的地を確認する必要があります。',
  npcRole: '親切な地元の乗客',
  isGoal: false,
  isError: false,
  
  // 必須スロット: ランドマークと次の交通手段
  requiredSlots: ['landmark', 'next_transport'],
  
  mapPosition: { x: 250, y: 150 },
  
  transitions: [
    {
      targetStateId: 'battery-park-area',
      requiredSlotValues: {
        landmark: 'Battery Park',
        next_transport: 'walk'
      },
      label: 'Battery Parkへ向かう',
      isCorrect: true
    },
    {
      targetStateId: 'wrong-place',
      label: '別の駅で降りる',
      isCorrect: false
    }
  ]
};
