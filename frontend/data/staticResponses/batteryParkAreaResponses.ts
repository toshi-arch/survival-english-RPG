/**
 * Battery Park Area State用の静的応答データ
 * 
 * キーワードベースの応答マッピング
 * 要件: 2.2, 2.3, 11.2
 */

import { NPCResponse } from '@/types';

export const batteryParkAreaResponses: Record<string, NPCResponse> = {
  // 初期メッセージ
  'initial': {
    npcMessage: "Good afternoon! Welcome to Battery Park. Can I help you find something?",
    slotUpdates: {},
  },

  // フェリーに関するキーワード
  'ferry|boat|statue|liberty': {
    npcMessage: "The ferry terminal for the Statue of Liberty is right over there, near the waterfront. You'll need to buy tickets at the ticket booth before boarding.",
    slotUpdates: {
      ferry_location: 'Battery Park Ferry Terminal',
      ticket_info: 'ticket booth'
    },
  },

  // チケットに関するキーワード
  'ticket|buy|purchase': {
    npcMessage: "You can buy tickets at the ticket booth near the ferry terminal. Just look for the signs that say 'Statue of Liberty Ferry'.",
    slotUpdates: {
      ticket_info: 'ticket booth'
    },
  },

  // 場所・方向に関するキーワード
  'where|location|direction': {
    npcMessage: "The ferry terminal is at the Battery Park Ferry Terminal, right by the water. Head towards the waterfront and you'll see it. Don't forget to get your tickets first!",
    slotUpdates: {
      ferry_location: 'Battery Park Ferry Terminal',
      ticket_info: 'ticket booth'
    },
  },

  // ターミナルに関するキーワード
  'terminal': {
    npcMessage: "Yes, the Battery Park Ferry Terminal. That's where all the ferries to the Statue of Liberty depart from. Make sure you have your ticket!",
    slotUpdates: {
      ferry_location: 'Battery Park Ferry Terminal'
    },
  },

  // 準備完了の確認
  'ready|thanks|ok|got it': {
    npcMessage: "Perfect! You know where to go - the Battery Park Ferry Terminal, and you'll get your tickets at the booth. Good luck!",
    slotUpdates: {},
    movementOptions: [
      {
        id: 'ferry-terminal',
        label: 'フェリーターミナルへ',
        targetStateId: 'ferry-terminal',
        isCorrect: true
      },
      {
        id: 'wrong-direction',
        label: '別の場所へ向かう',
        targetStateId: 'wrong-place',
        isCorrect: false
      }
    ]
  },

  // デフォルト応答
  'default': {
    npcMessage: "Are you looking for the ferry to the Statue of Liberty? I can point you in the right direction!",
    slotUpdates: {},
  }
};
