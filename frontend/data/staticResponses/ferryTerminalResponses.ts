/**
 * Ferry Terminal State用の静的応答データ
 * 
 * キーワードベースの応答マッピング
 * 要件: 2.2, 2.3, 11.2
 */

import { NPCResponse } from '@/types';

export const ferryTerminalResponses: Record<string, NPCResponse> = {
  // 初期メッセージ
  'initial': {
    npcMessage: "Hello! Welcome to the ferry terminal. How can I assist you today?",
    slotUpdates: {},
  },

  // 自由の女神に関するキーワード
  'statue|liberty': {
    npcMessage: "One ticket to the Statue of Liberty? Great choice! The next ferry departs in about 15 minutes. You'll board from dock 3.",
    slotUpdates: {
      ticket_type: 'Statue of Liberty',
      departure_time: 'next ferry'
    },
  },

  // チケットに関するキーワード
  'ticket|buy|one|purchase': {
    npcMessage: "Sure! What destination would you like? We have ferries to the Statue of Liberty and Ellis Island. The next departure is coming up soon.",
    slotUpdates: {
      departure_time: 'next ferry'
    },
  },

  // 時間・出発に関するキーワード
  'when|time|next|depart|leave': {
    npcMessage: "The next ferry to the Statue of Liberty leaves in about 15 minutes. Would you like a ticket?",
    slotUpdates: {
      departure_time: 'next ferry'
    },
  },

  // フェリーに関するキーワード
  'ferry|boat': {
    npcMessage: "Yes, the ferry to the Statue of Liberty! The next one departs soon. Let me get you a ticket.",
    slotUpdates: {
      ticket_type: 'Statue of Liberty',
      departure_time: 'next ferry'
    },
  },

  // 準備完了の確認
  'ready|yes|ok|thanks': {
    npcMessage: "Perfect! You have your ticket for the Statue of Liberty on the next ferry. Head to dock 3 when you're ready to board!",
    slotUpdates: {},
    movementOptions: [
      {
        id: 'correct-ferry',
        label: 'フェリーに乗船',
        targetStateId: 'statue-of-liberty',
        isCorrect: true
      },
      {
        id: 'wrong-ferry',
        label: '間違ったフェリーに乗る',
        targetStateId: 'wrong-place',
        isCorrect: false
      }
    ]
  },

  // デフォルト応答
  'default': {
    npcMessage: "Welcome to the ferry terminal! Are you looking to visit the Statue of Liberty?",
    slotUpdates: {},
  }
};
