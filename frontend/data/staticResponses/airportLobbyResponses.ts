/**
 * Airport Lobby State用の静的応答データ
 * 
 * キーワードベースの応答マッピング
 * 要件: 2.2, 2.3, 11.2
 */

import { NPCResponse } from '@/types';

/**
 * キーワードパターンとNPC応答のマッピング
 * キーは正規表現パターン（パイプ区切りでOR条件）
 */
export const airportLobbyResponses: Record<string, NPCResponse> = {
  // 初期メッセージ（会話開始時）
  'initial': {
    npcMessage: "Hello! Welcome to JFK Airport. How can I help you today?",
    slotUpdates: {},
  },

  // 自由の女神に関するキーワード
  'statue|liberty': {
    npcMessage: "Ah, the Statue of Liberty! It's a wonderful destination. You'll need to take the subway to get to Lower Manhattan first. From there, you can reach Battery Park where the ferry departs.",
    slotUpdates: {
      destination: 'Statue of Liberty',
      transport: 'subway'
    },
  },

  // 地下鉄に関するキーワード
  'subway|train|metro': {
    npcMessage: "Yes, the subway is the best way to get into the city from here. You can take the AirTrain to Jamaica Station, then transfer to the subway. It's much cheaper than a taxi!",
    slotUpdates: {
      transport: 'subway'
    },
  },

  // 行き方に関するキーワード
  'how|get|way|go': {
    npcMessage: "To get to the Statue of Liberty, you should take the subway into the city. Where exactly are you trying to go?",
    slotUpdates: {},
  },

  // 準備完了の確認
  'ready|yes|ok|sure': {
    npcMessage: "Great! So you're taking the subway to reach the Statue of Liberty. Let me show you your options.",
    slotUpdates: {},
    movementOptions: [
      {
        id: 'subway',
        label: '地下鉄で市内へ',
        targetStateId: 'city-transit',
        isCorrect: true
      },
      {
        id: 'taxi',
        label: 'タクシーで直接向かう',
        targetStateId: 'wrong-place',
        isCorrect: false
      }
    ]
  },

  // デフォルト応答（マッチしない場合）
  'default': {
    npcMessage: "I'm here to help! Are you looking for directions to somewhere? The Statue of Liberty is a popular destination for visitors.",
    slotUpdates: {},
  }
};
