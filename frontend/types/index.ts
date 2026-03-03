/**
 * サバイバル英語ロールプレイゲームの型定義
 * 
 * このファイルはゲームシステムのすべてのTypeScript型定義を含みます。
 * 要件: 1.1, 2.1, 3.1, 5.2, 7.1, 8.1, 10.2
 */

// ============================================================================
// コアゲーム型
// ============================================================================

/**
 * Scenario - 開始地点とゴール地点を持つ完全なゲームシナリオ
 * 要件: 1.1
 */
export interface Scenario {
  id: string;
  name: string;
  description: string;
  startStateId: string;
  goalStateId: string;
  states: Record<string, State>;
}

/**
 * State - ゲーム内の特定の場所または状況
 * 要件: 1.1, 2.1, 3.1
 */
export interface State {
  id: string;
  name: string;
  description: string;
  npcRole: string; // 例: "空港スタッフ", "タクシー運転手"
  isGoal: boolean;
  isError: boolean;
  requiredSlots: string[]; // 次に進むために必要な情報
  transitions: StateTransition[];
  mapPosition: { x: number; y: number };
}

/**
 * StateTransition - あるStateから別のStateへの遷移を定義
 * 要件: 3.1
 */
export interface StateTransition {
  targetStateId: string;
  requiredSlotValues?: Record<string, string>; // 正しい遷移の条件
  label: string; // 移動選択肢の表示ラベル
  isCorrect?: boolean; // これが正しい選択肢かどうか
}

// ============================================================================
// コミュニケーション型
// ============================================================================

/**
 * Message - 会話履歴内の単一メッセージ
 * 要件: 8.1
 */
export interface Message {
  id: string;
  role: 'user' | 'npc';
  content: string;
  timestamp: Date;
}

/**
 * NPCResponse - NPCからの構造化された応答
 * 要件: 2.1, 10.2
 */
export interface NPCResponse {
  npcMessage: string;
  slotUpdates?: Record<string, string>; // 更新された情報スロット
  movementOptions?: MovementOption[]; // 利用可能な移動選択肢
  shouldTransition?: boolean; // State遷移が可能かどうか
}

/**
 * MovementOption - 別のStateへ移動するための選択肢
 * 要件: 3.1
 */
export interface MovementOption {
  id: string;
  label: string;
  targetStateId: string;
  isCorrect: boolean; // これが正しい選択肢かどうか
}

// ============================================================================
// ゲームセッション型
// ============================================================================

/**
 * GameSession - 現在のゲームプレイセッション
 * 要件: 7.1, 8.1
 */
export interface GameSession {
  sessionId: string;
  scenarioId: string;
  currentStateId: string;
  requiredSlots: Record<string, string | null>;
  conversationHistory: Message[];
  penaltyState: PenaltyState;
  startTime: Date;
  completedAt?: Date;
  isCompleted: boolean;
}

/**
 * PenaltyState - ペナルティとゲームオーバー条件を追跡
 * 要件: 5.2
 */
export interface PenaltyState {
  lives: number;
  maxLives: number;
  hintsUsed: number;
  wrongMoves: number;
}

// ============================================================================
// 音声関連型
// ============================================================================

/**
 * AudioState - 音声入出力の状態を管理
 * 要件: 8.1
 */
export interface AudioState {
  isRecording: boolean;
  isProcessing: boolean;
  voiceOutputEnabled: boolean;
  isSpeaking: boolean;
}

// ============================================================================
// ゲーム状態管理型
// ============================================================================

/**
 * GameState - 任意の時点でのゲームの完全な状態
 * 要件: 1.1, 2.1, 7.1, 8.1
 */
export interface GameState {
  scenario: Scenario;
  currentStateId: string;
  visitedStateIds: string[]; // 訪問済みStateのID配列
  requiredSlots: Record<string, string | null>;
  conversationHistory: Message[];
  movementOptions: MovementOption[] | null;
  penaltyState: PenaltyState;
  audioState: AudioState;
}

/**
 * GameAction - ゲーム状態を変更できるすべてのアクション
 * 要件: 2.1, 3.1, 5.2, 7.1, 8.1
 */
export type GameAction =
  | { type: 'SEND_MESSAGE'; payload: { content: string } }
  | { type: 'RECEIVE_NPC_RESPONSE'; payload: NPCResponse }
  | { type: 'UPDATE_SLOTS'; payload: Record<string, string> }
  | { type: 'SHOW_MOVEMENT_OPTIONS'; payload: MovementOption[] }
  | { type: 'SELECT_MOVEMENT'; payload: string }
  | { type: 'TRANSITION_STATE'; payload: { newStateId: string } }
  | { type: 'APPLY_PENALTY'; payload: PenaltyType }
  | { type: 'TOGGLE_VOICE_OUTPUT' }
  | { type: 'SET_RECORDING'; payload: boolean };

/**
 * PenaltyType - 適用可能なペナルティの種類
 * 要件: 5.2
 */
export type PenaltyType = 'life_decrease' | 'time_decrease' | 'hint_decrease' | 'npc_attitude_change';

// ============================================================================
// API型（Phase 2）
// ============================================================================

/**
 * ChatRequest - チャットAPIへのリクエストペイロード
 * 要件: 10.2
 */
export interface ChatRequest {
  sessionId: string;
  stateId: string;
  userMessage: string;
  conversationHistory: Message[];
  currentSlots: Record<string, string | null>;
}

/**
 * ChatResponse - チャットAPIからのレスポンス
 * 要件: 10.2
 */
export interface ChatResponse {
  success: boolean;
  data?: NPCResponse;
  error?: string;
}

/**
 * TTSRequest - Text-to-Speech変換のリクエスト
 * 要件: 8.1
 */
export interface TTSRequest {
  text: string;
  voice?: string;
  speed?: number;
}

/**
 * STTResponse - Speech-to-Text APIからのレスポンス
 * 要件: 8.1
 */
export interface STTResponse {
  success: boolean;
  text?: string;
  error?: string;
}

// ============================================================================
// UIコンポーネントProps型
// ============================================================================

/**
 * SlotDisplay - UI表示用の必須スロット情報
 * 要件: 7.1
 */
export interface SlotDisplay {
  slotName: string;
  label: string;
  value: string | null;
  isFilled: boolean;
}

/**
 * StateNode - マップUIレンダリング用のState表現
 * 要件: 1.1
 */
export interface StateNode {
  id: string;
  name: string;
  position: { x: number; y: number };
  isGoal: boolean;
  isError: boolean;
  isCurrent: boolean;
}
