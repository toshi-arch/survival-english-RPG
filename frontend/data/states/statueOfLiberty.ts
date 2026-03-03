/**
 * Statue of Liberty State定義
 * 
 * 自由の女神 - ゲームのゴール地点
 * 要件: 1.1, 2.1, 3.2, 9.3
 */

import { State } from '@/types';

export const statueOfLibertyState: State = {
  id: 'statue-of-liberty',
  name: 'Statue of Liberty',
  description: '自由の女神に到着！目的地に無事たどり着きました。',
  npcRole: '観光ガイド',
  isGoal: true,
  isError: false,
  
  // ゴール地点なので必須スロットなし
  requiredSlots: [],
  
  mapPosition: { x: 700, y: 300 },
  
  // ゴール地点なので遷移なし
  transitions: []
};
