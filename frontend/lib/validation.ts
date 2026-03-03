/**
 * データ検証ロジック
 * 
 * シナリオデータの構造検証
 * 要件: 1.1, 1.3, 9.2
 */

import { Scenario, State } from '@/types';

/**
 * 検証エラーの型
 */
export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * 検証結果の型
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * シナリオデータの検証
 * 
 * @param scenario - 検証対象のシナリオ
 * @returns 検証結果
 */
export function validateScenario(scenario: Scenario): ValidationResult {
  const errors: ValidationError[] = [];

  // 必須フィールドの検証
  if (!scenario.id || scenario.id.trim() === '') {
    errors.push({
      field: 'id',
      message: 'Scenario ID is required',
      severity: 'error',
    });
  }

  if (!scenario.name || scenario.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Scenario name is required',
      severity: 'error',
    });
  }

  if (!scenario.startStateId || scenario.startStateId.trim() === '') {
    errors.push({
      field: 'startStateId',
      message: 'Start state ID is required',
      severity: 'error',
    });
  }

  if (!scenario.goalStateId || scenario.goalStateId.trim() === '') {
    errors.push({
      field: 'goalStateId',
      message: 'Goal state ID is required',
      severity: 'error',
    });
  }

  // Statesの存在確認
  if (!scenario.states || Object.keys(scenario.states).length === 0) {
    errors.push({
      field: 'states',
      message: 'Scenario must have at least one state',
      severity: 'error',
    });
    return { isValid: false, errors };
  }

  // 開始Stateの存在確認
  if (scenario.startStateId && !scenario.states[scenario.startStateId]) {
    errors.push({
      field: 'startStateId',
      message: `Start state "${scenario.startStateId}" does not exist in states`,
      severity: 'error',
    });
  }

  // ゴールStateの存在確認
  if (scenario.goalStateId && !scenario.states[scenario.goalStateId]) {
    errors.push({
      field: 'goalStateId',
      message: `Goal state "${scenario.goalStateId}" does not exist in states`,
      severity: 'error',
    });
  }

  // 各Stateの検証
  Object.entries(scenario.states).forEach(([stateId, state]) => {
    const stateErrors = validateState(state, stateId, scenario);
    errors.push(...stateErrors);
  });

  // ゴールStateが正しくマークされているか確認
  if (scenario.goalStateId && scenario.states[scenario.goalStateId]) {
    const goalState = scenario.states[scenario.goalStateId];
    if (!goalState.isGoal) {
      errors.push({
        field: `states.${scenario.goalStateId}.isGoal`,
        message: 'Goal state must have isGoal set to true',
        severity: 'warning',
      });
    }
  }

  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
  };
}

/**
 * 個別Stateの検証
 * 
 * @param state - 検証対象のState
 * @param stateId - StateのID
 * @param scenario - 親シナリオ（参照整合性チェック用）
 * @returns 検証エラーの配列
 */
function validateState(
  state: State,
  stateId: string,
  scenario: Scenario
): ValidationError[] {
  const errors: ValidationError[] = [];
  const prefix = `states.${stateId}`;

  // 必須フィールドの検証
  if (!state.id || state.id.trim() === '') {
    errors.push({
      field: `${prefix}.id`,
      message: 'State ID is required',
      severity: 'error',
    });
  }

  if (state.id !== stateId) {
    errors.push({
      field: `${prefix}.id`,
      message: `State ID "${state.id}" does not match key "${stateId}"`,
      severity: 'error',
    });
  }

  if (!state.name || state.name.trim() === '') {
    errors.push({
      field: `${prefix}.name`,
      message: 'State name is required',
      severity: 'error',
    });
  }

  if (!state.npcRole || state.npcRole.trim() === '') {
    errors.push({
      field: `${prefix}.npcRole`,
      message: 'NPC role is required',
      severity: 'error',
    });
  }

  // 必須スロットの検証
  if (!Array.isArray(state.requiredSlots)) {
    errors.push({
      field: `${prefix}.requiredSlots`,
      message: 'Required slots must be an array',
      severity: 'error',
    });
  }

  // 遷移の検証
  if (!Array.isArray(state.transitions)) {
    errors.push({
      field: `${prefix}.transitions`,
      message: 'Transitions must be an array',
      severity: 'error',
    });
  } else {
    state.transitions.forEach((transition, index) => {
      // 遷移先Stateの存在確認
      if (!transition.targetStateId || transition.targetStateId.trim() === '') {
        errors.push({
          field: `${prefix}.transitions[${index}].targetStateId`,
          message: 'Transition target state ID is required',
          severity: 'error',
        });
      } else if (!scenario.states[transition.targetStateId]) {
        errors.push({
          field: `${prefix}.transitions[${index}].targetStateId`,
          message: `Target state "${transition.targetStateId}" does not exist`,
          severity: 'error',
        });
      }

      // ラベルの検証
      if (!transition.label || transition.label.trim() === '') {
        errors.push({
          field: `${prefix}.transitions[${index}].label`,
          message: 'Transition label is required',
          severity: 'error',
        });
      }
    });
  }

  // マップ座標の検証
  if (!state.mapPosition) {
    errors.push({
      field: `${prefix}.mapPosition`,
      message: 'Map position is required',
      severity: 'error',
    });
  } else {
    if (typeof state.mapPosition.x !== 'number') {
      errors.push({
        field: `${prefix}.mapPosition.x`,
        message: 'Map position x must be a number',
        severity: 'error',
      });
    }
    if (typeof state.mapPosition.y !== 'number') {
      errors.push({
        field: `${prefix}.mapPosition.y`,
        message: 'Map position y must be a number',
        severity: 'error',
      });
    }
  }

  // ゴールStateは遷移を持たないべき
  if (state.isGoal && state.transitions.length > 0) {
    errors.push({
      field: `${prefix}.transitions`,
      message: 'Goal state should not have transitions',
      severity: 'warning',
    });
  }

  return errors;
}

/**
 * シナリオの到達可能性を検証
 * 
 * @param scenario - 検証対象のシナリオ
 * @returns 検証結果
 */
export function validateReachability(scenario: Scenario): ValidationResult {
  const errors: ValidationError[] = [];
  const visited = new Set<string>();
  const queue: string[] = [scenario.startStateId];

  // 幅優先探索で到達可能なStateを探索
  while (queue.length > 0) {
    const currentStateId = queue.shift()!;
    
    if (visited.has(currentStateId)) continue;
    visited.add(currentStateId);

    const currentState = scenario.states[currentStateId];
    if (!currentState) continue;

    currentState.transitions.forEach(transition => {
      if (!visited.has(transition.targetStateId)) {
        queue.push(transition.targetStateId);
      }
    });
  }

  // ゴールStateに到達可能か確認
  if (!visited.has(scenario.goalStateId)) {
    errors.push({
      field: 'goalStateId',
      message: `Goal state "${scenario.goalStateId}" is not reachable from start state`,
      severity: 'error',
    });
  }

  // 到達不可能なStateを警告
  Object.keys(scenario.states).forEach(stateId => {
    const state = scenario.states[stateId];
    if (!visited.has(stateId) && !state.isError) {
      errors.push({
        field: `states.${stateId}`,
        message: `State "${stateId}" is not reachable from start state`,
        severity: 'warning',
      });
    }
  });

  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
  };
}
