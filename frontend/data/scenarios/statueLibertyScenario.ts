/**
 * 自由の女神シナリオ
 * 
 * JFK空港から自由の女神までの旅をシミュレートするシナリオ
 * 要件: 9.1, 9.2, 9.5
 */

import { Scenario } from '@/types';

/**
 * 自由の女神シナリオの定義
 * 
 * このシナリオには以下の6つのStateが含まれます：
 * 1. Airport Lobby（開始地点）
 * 2. City Transit（市内交通）
 * 3. Battery Park Area（バッテリーパーク周辺）
 * 4. Ferry Terminal（フェリーターミナル）
 * 5. Statue of Liberty（ゴール地点）
 * 6. Wrong Place（エラーState）
 */
export const statueLibertyScenario: Scenario = {
  id: 'statue-of-liberty',
  name: '自由の女神への旅',
  description: 'JFK空港から自由の女神を目指す英語サバイバルアドベンチャー',
  startStateId: 'airport-lobby',
  goalStateId: 'statue-of-liberty',
  
  states: {
    // ============================================================================
    // State 1: Airport Lobby（開始地点）
    // ============================================================================
    'airport-lobby': {
      id: 'airport-lobby',
      name: 'Airport Lobby',
      description: 'JFK空港の到着ロビー。ここから自由の女神への旅が始まります。',
      npcRole: '空港インフォメーションスタッフ',
      isGoal: false,
      isError: false,
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
    },

    // ============================================================================
    // State 2: City Transit（市内交通）
    // ============================================================================
    'city-transit': {
      id: 'city-transit',
      name: 'City Transit',
      description: '地下鉄に乗って市内を移動中。次の目的地を確認する必要があります。',
      npcRole: '親切な地元の乗客',
      isGoal: false,
      isError: false,
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
    },

    // ============================================================================
    // State 3: Battery Park Area（バッテリーパーク周辺）
    // ============================================================================
    'battery-park-area': {
      id: 'battery-park-area',
      name: 'Battery Park Area',
      description: 'Battery Park周辺に到着。フェリーターミナルを探す必要があります。',
      npcRole: '公園の警備員',
      isGoal: false,
      isError: false,
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
    },

    // ============================================================================
    // State 4: Ferry Terminal（フェリーターミナル）
    // ============================================================================
    'ferry-terminal': {
      id: 'ferry-terminal',
      name: 'Ferry Terminal',
      description: 'フェリーターミナルに到着。チケットを購入して乗船する必要があります。',
      npcRole: 'チケット売り場のスタッフ',
      isGoal: false,
      isError: false,
      requiredSlots: ['ticket_type', 'departure_time'],
      mapPosition: { x: 550, y: 250 },
      transitions: [
        {
          targetStateId: 'statue-of-liberty',
          requiredSlotValues: {
            ticket_type: 'Statue of Liberty',
            departure_time: 'next ferry'
          },
          label: 'フェリーに乗船',
          isCorrect: true
        },
        {
          targetStateId: 'wrong-place',
          label: '間違ったフェリーに乗る',
          isCorrect: false
        }
      ]
    },

    // ============================================================================
    // State 5: Statue of Liberty（ゴール地点）
    // ============================================================================
    'statue-of-liberty': {
      id: 'statue-of-liberty',
      name: 'Statue of Liberty',
      description: '自由の女神に到着！目的地に無事たどり着きました。',
      npcRole: '観光ガイド',
      isGoal: true,
      isError: false,
      requiredSlots: [],
      mapPosition: { x: 700, y: 300 },
      transitions: []
    },

    // ============================================================================
    // State 6: Wrong Place（エラーState）
    // ============================================================================
    'wrong-place': {
      id: 'wrong-place',
      name: 'Wrong Place',
      description: '間違った場所に来てしまいました。情報を集め直す必要があります。',
      npcRole: '困惑した通行人',
      isGoal: false,
      isError: true,
      requiredSlots: ['correct_direction'],
      mapPosition: { x: 400, y: 400 },
      transitions: [
        {
          targetStateId: 'airport-lobby',
          label: '空港に戻る',
          isCorrect: true
        }
      ]
    }
  }
};
