'use client';

/**
 * GameStateContext - ゲーム状態管理
 * 
 * React Context + useReducerを使用したゲーム状態の一元管理
 * 要件: 1.2, 7.4, 8.6
 */

import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { GameState, GameAction, Scenario, Message } from '@/types';
import { statueLibertyScenario } from '@/data/scenarios/statueLibertyScenario';
import { validateScenario } from '@/lib/validation';

// ============================================================================
// Context定義
// ============================================================================

interface GameStateContextType {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

const GameStateContext = createContext<GameStateContextType | null>(null);

// ============================================================================
// 初期状態の生成
// ============================================================================

/**
 * シナリオから初期状態を生成
 */
function createInitialState(scenario: Scenario): GameState {
  // シナリオの検証
  const validationResult = validateScenario(scenario);
  if (!validationResult.isValid) {
    console.error('Scenario validation failed:', validationResult.errors);
    // エラーがあっても続行（開発中のため）
    validationResult.errors.forEach(error => {
      if (error.severity === 'error') {
        console.error(`[${error.severity}] ${error.field}: ${error.message}`);
      } else {
        console.warn(`[${error.severity}] ${error.field}: ${error.message}`);
      }
    });
  }

  const currentState = scenario.states[scenario.startStateId];
  
  // 現在のStateの必須スロットを初期化
  const requiredSlots: Record<string, string | null> = {};
  if (currentState) {
    currentState.requiredSlots.forEach(slot => {
      requiredSlots[slot] = null;
    });
  }

  return {
    scenario,
    currentStateId: scenario.startStateId,
    visitedStateIds: [scenario.startStateId], // 開始地点を訪問済みに追加
    requiredSlots,
    conversationHistory: [],
    movementOptions: null,
    penaltyState: {
      lives: 3,
      maxLives: 3,
      hintsUsed: 0,
      wrongMoves: 0,
    },
    audioState: {
      isRecording: false,
      isProcessing: false,
      voiceOutputEnabled: false,
      isSpeaking: false,
    },
  };
}

// ============================================================================
// Reducer
// ============================================================================

/**
 * ゲーム状態を更新するReducer
 */
function gameStateReducer(state: GameState, action: GameAction): GameState {
  try {
    switch (action.type) {
    // メッセージ送信
    case 'SEND_MESSAGE': {
      const newMessage: Message = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: action.payload.content,
        timestamp: new Date(),
      };

      return {
        ...state,
        conversationHistory: [...state.conversationHistory, newMessage],
      };
    }

    // NPC応答受信
    case 'RECEIVE_NPC_RESPONSE': {
      const response = action.payload;
      const npcMessage: Message = {
        id: `msg-${Date.now()}-npc`,
        role: 'npc',
        content: response.npcMessage,
        timestamp: new Date(),
      };

      let updatedState = {
        ...state,
        conversationHistory: [...state.conversationHistory, npcMessage],
      };

      // スロット更新がある場合
      if (response.slotUpdates) {
        updatedState = {
          ...updatedState,
          requiredSlots: {
            ...updatedState.requiredSlots,
            ...response.slotUpdates,
          },
        };
      }

      // 移動選択肢がある場合
      if (response.movementOptions) {
        updatedState = {
          ...updatedState,
          movementOptions: response.movementOptions,
        };
      }

      return updatedState;
    }

    // スロット更新
    case 'UPDATE_SLOTS': {
      return {
        ...state,
        requiredSlots: {
          ...state.requiredSlots,
          ...action.payload,
        },
      };
    }

    // 移動選択肢表示
    case 'SHOW_MOVEMENT_OPTIONS': {
      return {
        ...state,
        movementOptions: action.payload,
      };
    }

    // 移動選択
    case 'SELECT_MOVEMENT': {
      const selectedOption = state.movementOptions?.find(
        option => option.id === action.payload
      );

      if (!selectedOption) {
        return state;
      }

      // 誤った選択の場合はペナルティを適用
      if (!selectedOption.isCorrect) {
        return {
          ...state,
          penaltyState: {
            ...state.penaltyState,
            lives: state.penaltyState.lives - 1,
            wrongMoves: state.penaltyState.wrongMoves + 1,
          },
        };
      }

      return state;
    }

    // State遷移
    case 'TRANSITION_STATE': {
      const newStateId = action.payload.newStateId;
      const newState = state.scenario.states[newStateId];

      if (!newState) {
        console.error(`State not found: ${newStateId}`);
        return state;
      }

      // 新しいStateの必須スロットを初期化
      const requiredSlots: Record<string, string | null> = {};
      newState.requiredSlots.forEach(slot => {
        requiredSlots[slot] = null;
      });

      // 訪問済みStateに追加
      const visitedStateIds = state.visitedStateIds.includes(newStateId)
        ? state.visitedStateIds
        : [...state.visitedStateIds, newStateId];

      return {
        ...state,
        currentStateId: newStateId,
        visitedStateIds,
        requiredSlots,
        movementOptions: null,
      };
    }

    // ペナルティ適用
    case 'APPLY_PENALTY': {
      const penaltyType = action.payload;
      let updatedPenaltyState = { ...state.penaltyState };

      switch (penaltyType) {
        case 'life_decrease':
          updatedPenaltyState.lives = Math.max(0, updatedPenaltyState.lives - 1);
          break;
        case 'hint_decrease':
          updatedPenaltyState.hintsUsed += 1;
          break;
        default:
          break;
      }

      return {
        ...state,
        penaltyState: updatedPenaltyState,
      };
    }

    // 音声出力トグル
    case 'TOGGLE_VOICE_OUTPUT': {
      return {
        ...state,
        audioState: {
          ...state.audioState,
          voiceOutputEnabled: !state.audioState.voiceOutputEnabled,
        },
      };
    }

    // 録音状態設定
    case 'SET_RECORDING': {
      return {
        ...state,
        audioState: {
          ...state.audioState,
          isRecording: action.payload,
        },
      };
    }

    default:
      return state;
    }
  } catch (error) {
    console.error('Error in gameStateReducer:', error);
    // エラーが発生しても現在の状態を返す
    return state;
  }
}

// ============================================================================
// Provider Component
// ============================================================================

interface GameStateProviderProps {
  children: ReactNode;
  scenario?: Scenario;
}

export function GameStateProvider({ children, scenario = statueLibertyScenario }: GameStateProviderProps) {
  const [state, dispatch] = useReducer(
    gameStateReducer,
    scenario,
    createInitialState
  );

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
}

// ============================================================================
// Custom Hook
// ============================================================================

/**
 * GameStateContextを使用するためのカスタムフック
 */
export function useGameState() {
  const context = useContext(GameStateContext);
  
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  
  return context;
}
