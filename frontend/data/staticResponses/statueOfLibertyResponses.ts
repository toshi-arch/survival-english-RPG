/**
 * Statue of Liberty State用の静的応答データ
 * 
 * ゴール地点の応答
 * 要件: 2.2, 2.3, 11.2
 */

import { NPCResponse } from '@/types';

export const statueOfLibertyResponses: Record<string, NPCResponse> = {
  // 初期メッセージ（ゴール到達）
  'initial': {
    npcMessage: "Congratulations! You made it to the Statue of Liberty! Welcome to one of America's most iconic landmarks. Your English survival skills brought you here successfully!",
    slotUpdates: {},
  },

  // 任意のメッセージに対する応答
  'default': {
    npcMessage: "Enjoy your visit to the Statue of Liberty! You did a great job navigating here with your English skills. Feel free to explore and take in the amazing views!",
    slotUpdates: {},
  }
};
