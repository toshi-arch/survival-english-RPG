/**
 * ゲームロジック
 * 
 * State遷移、スロット完全性チェックなどのゲームルール
 * 要件: 2.1, 3.4, 3.5
 */

import { State, MovementOption, Scenario } from '@/types';

// ============================================================================
// スロット完全性チェック
// ============================================================================

/**
 * 必須スロットがすべて埋まっているかチェック
 * 
 * @param requiredSlots - 現在のStateの必須スロット
 * @param currentSlots - 現在収集されているスロット値
 * @returns すべてのスロットが埋まっている場合true
 */
export function areAllSlotsComplete(
  requiredSlots: string[],
  currentSlots: Record<string, string | null>
): boolean {
  return requiredSlots.every(slot => {
    const value = currentSlots[slot];
    return value !== null && value !== undefined && value.trim() !== '';
  });
}

/**
 * 埋まっているスロットの数を取得
 * 
 * @param requiredSlots - 必須スロット
 * @param currentSlots - 現在のスロット値
 * @returns 埋まっているスロットの数
 */
export function getFilledSlotsCount(
  requiredSlots: string[],
  currentSlots: Record<string, string | null>
): number {
  return requiredSlots.filter(slot => {
    const value = currentSlots[slot];
    return value !== null && value !== undefined && value.trim() !== '';
  }).length;
}

// ============================================================================
// 移動選択肢の表示判定
// ============================================================================

/**
 * 移動選択肢を表示すべきかどうかを判定
 * 
 * @param state - 現在のState
 * @param currentSlots - 現在のスロット値
 * @returns 移動選択肢を表示すべき場合true
 */
export function shouldShowMovementOptions(
  state: State,
  currentSlots: Record<string, string | null>
): boolean {
  // ゴールStateまたはエラーStateの場合は常に表示
  if (state.isGoal || state.isError) {
    return state.transitions.length > 0;
  }

  // 必須スロットがすべて埋まっている場合に表示
  return areAllSlotsComplete(state.requiredSlots, currentSlots);
}

/**
 * 現在のStateから利用可能な移動選択肢を取得
 * 
 * @param state - 現在のState
 * @returns MovementOptionの配列
 */
export function getMovementOptions(state: State): MovementOption[] {
  return state.transitions.map((transition, index) => ({
    id: `option-${index}`,
    label: transition.label,
    targetStateId: transition.targetStateId,
    isCorrect: transition.isCorrect ?? true, // デフォルトはtrue
  }));
}

// ============================================================================
// State遷移の検証
// ============================================================================

/**
 * 選択された移動が正しいかどうかを検証
 * 
 * @param state - 現在のState
 * @param selectedOptionId - 選択された移動選択肢のID
 * @param movementOptions - 利用可能な移動選択肢
 * @returns 正しい選択の場合true
 */
export function isCorrectMovement(
  state: State,
  selectedOptionId: string,
  movementOptions: MovementOption[]
): boolean {
  const selectedOption = movementOptions.find(opt => opt.id === selectedOptionId);
  return selectedOption?.isCorrect ?? false;
}

/**
 * 必須スロット値が遷移条件を満たしているかチェック
 * 
 * @param transition - State遷移定義
 * @param currentSlots - 現在のスロット値
 * @returns 条件を満たしている場合true
 */
export function meetsTransitionRequirements(
  transition: { requiredSlotValues?: Record<string, string> },
  currentSlots: Record<string, string | null>
): boolean {
  if (!transition.requiredSlotValues) {
    return true; // 条件がない場合は常にtrue
  }

  return Object.entries(transition.requiredSlotValues).every(([slot, requiredValue]) => {
    const currentValue = currentSlots[slot];
    if (!currentValue) return false;
    
    // 大文字小文字を区別しない比較
    return currentValue.toLowerCase().trim() === requiredValue.toLowerCase().trim();
  });
}

// ============================================================================
// ユーザーメッセージの処理
// ============================================================================

/**
 * ユーザーメッセージを処理してゲーム状態を更新
 * 
 * @param userMessage - ユーザーの入力メッセージ
 * @param currentState - 現在のState
 * @param currentSlots - 現在のスロット値
 * @returns 処理結果（スロット更新、移動選択肢など）
 */
export function processUserMessage(
  userMessage: string,
  currentState: State,
  currentSlots: Record<string, string | null>
): {
  shouldShowOptions: boolean;
  movementOptions: MovementOption[] | null;
} {
  // メッセージ処理後、移動選択肢を表示すべきかチェック
  const shouldShow = shouldShowMovementOptions(currentState, currentSlots);
  
  return {
    shouldShowOptions: shouldShow,
    movementOptions: shouldShow ? getMovementOptions(currentState) : null,
  };
}

// ============================================================================
// ゴール到達判定
// ============================================================================

/**
 * ゴールに到達したかどうかを判定
 * 
 * @param currentStateId - 現在のStateID
 * @param scenario - シナリオ
 * @returns ゴールに到達した場合true
 */
export function hasReachedGoal(currentStateId: string, scenario: Scenario): boolean {
  return currentStateId === scenario.goalStateId;
}

/**
 * 現在のStateがゴールStateかどうかを判定
 * 
 * @param state - チェック対象のState
 * @returns ゴールStateの場合true
 */
export function isGoalState(state: State): boolean {
  return state.isGoal;
}

/**
 * 現在のStateがエラーStateかどうかを判定
 * 
 * @param state - チェック対象のState
 * @returns エラーStateの場合true
 */
export function isErrorState(state: State): boolean {
  return state.isError;
}

// ============================================================================
// ヘルパー関数
// ============================================================================

/**
 * Stateを取得
 * 
 * @param scenario - シナリオ
 * @param stateId - StateID
 * @returns State、存在しない場合はundefined
 */
export function getState(scenario: Scenario, stateId: string): State | undefined {
  return scenario.states[stateId];
}

/**
 * 進捗率を計算（0-100）
 * 
 * @param currentStateId - 現在のStateID
 * @param scenario - シナリオ
 * @returns 進捗率（パーセント）
 */
export function calculateProgress(currentStateId: string, scenario: Scenario): number {
  const stateIds = Object.keys(scenario.states).filter(id => {
    const state = scenario.states[id];
    return !state.isError; // エラーStateは除外
  });
  
  const currentIndex = stateIds.indexOf(currentStateId);
  if (currentIndex === -1) return 0;
  
  return Math.round((currentIndex / (stateIds.length - 1)) * 100);
}
