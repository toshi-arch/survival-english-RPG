/**
 * Wrong Place State用の静的応答データ
 * 
 * エラーStateの応答
 * 要件: 2.2, 2.3, 11.2
 */

import { NPCResponse } from '@/types';

export const wrongPlaceResponses: Record<string, NPCResponse> = {
  // 初期メッセージ（間違った場所に到着）
  'initial': {
    npcMessage: "Hmm... I'm not sure where you're trying to go, but this doesn't seem like the right place for the Statue of Liberty. Maybe you should go back and ask for better directions?",
    slotUpdates: {},
  },

  // 助けを求めるキーワード
  'help|lost|where': {
    npcMessage: "You seem lost! The Statue of Liberty is quite far from here. I think you should go back to where you started and gather more information before choosing your route.",
    slotUpdates: {
      correct_direction: 'back to start'
    },
  },

  // 戻る・やり直しに関するキーワード
  'back|return|again|restart': {
    npcMessage: "Yes, going back might be a good idea. You can start over and make sure you have all the information you need before making your next move.",
    slotUpdates: {
      correct_direction: 'back to start'
    },
    movementOptions: [
      {
        id: 'back-to-airport',
        label: '空港に戻る',
        targetStateId: 'airport-lobby',
        isCorrect: true
      }
    ]
  },

  // デフォルト応答
  'default': {
    npcMessage: "I'm sorry, but I don't think this is where you want to be. Would you like to go back and try again?",
    slotUpdates: {},
  }
};
