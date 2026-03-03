/**
 * 静的応答データのエクスポート
 * 
 * すべてのState用の静的応答をまとめてエクスポート
 * 要件: 2.2, 2.3, 11.2
 */

import { NPCResponse } from '@/types';
import { airportLobbyResponses } from './airportLobbyResponses';
import { cityTransitResponses } from './cityTransitResponses';
import { batteryParkAreaResponses } from './batteryParkAreaResponses';
import { ferryTerminalResponses } from './ferryTerminalResponses';
import { statueOfLibertyResponses } from './statueOfLibertyResponses';
import { wrongPlaceResponses } from './wrongPlaceResponses';

/**
 * StateIDをキーとした静的応答マップ
 */
export const staticResponsesByState: Record<string, Record<string, NPCResponse>> = {
  'airport-lobby': airportLobbyResponses,
  'city-transit': cityTransitResponses,
  'battery-park-area': batteryParkAreaResponses,
  'ferry-terminal': ferryTerminalResponses,
  'statue-of-liberty': statueOfLibertyResponses,
  'wrong-place': wrongPlaceResponses,
};

/**
 * 指定されたStateの静的応答を取得
 */
export function getStaticResponsesForState(stateId: string): Record<string, NPCResponse> {
  return staticResponsesByState[stateId] || {};
}
