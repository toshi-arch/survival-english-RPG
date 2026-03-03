/**
 * City Transit State用の静的応答データ
 * 
 * キーワードベースの応答マッピング
 * 要件: 2.2, 2.3, 11.2
 */

import { NPCResponse } from '@/types';

export const cityTransitResponses: Record<string, NPCResponse> = {
  // 初期メッセージ
  'initial': {
    npcMessage: "Hi there! I couldn't help but notice you look a bit lost. Are you heading somewhere special?",
    slotUpdates: {},
  },

  // 自由の女神に関するキーワード
  'statue|liberty': {
    npcMessage: "Oh, the Statue of Liberty! You're on the right track. You need to get off at Bowling Green station, then walk to Battery Park. That's where the ferry terminal is.",
    slotUpdates: {
      landmark: 'Battery Park',
      next_transport: 'walk'
    },
  },

  // Battery Parkに関するキーワード
  'battery|park': {
    npcMessage: "Yes, Battery Park! That's exactly where you need to go. Get off at Bowling Green station and walk to the park. You'll find the ferry terminal there.",
    slotUpdates: {
      landmark: 'Battery Park',
      next_transport: 'walk'
    },
  },

  // フェリーに関するキーワード
  'ferry|boat': {
    npcMessage: "The ferry to the Statue of Liberty leaves from Battery Park. You should get off at the next stop and walk there. It's not far!",
    slotUpdates: {
      landmark: 'Battery Park',
      next_transport: 'walk'
    },
  },

  // 駅・降りる場所に関するキーワード
  'station|stop|where|get off': {
    npcMessage: "You want to get off at Bowling Green station. From there, it's a short walk to Battery Park where the ferry terminal is located.",
    slotUpdates: {
      landmark: 'Battery Park',
      next_transport: 'walk'
    },
  },

  // 準備完了の確認
  'ready|thanks|thank you|ok': {
    npcMessage: "You're welcome! So you'll get off at the next stop and walk to Battery Park. Here are your options.",
    slotUpdates: {},
    movementOptions: [
      {
        id: 'battery-park',
        label: 'Battery Parkへ向かう',
        targetStateId: 'battery-park-area',
        isCorrect: true
      },
      {
        id: 'wrong-station',
        label: '別の駅で降りる',
        targetStateId: 'wrong-place',
        isCorrect: false
      }
    ]
  },

  // デフォルト応答
  'default': {
    npcMessage: "Are you trying to get to the Statue of Liberty? I can help you with directions!",
    slotUpdates: {},
  }
};
