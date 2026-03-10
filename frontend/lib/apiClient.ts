/**
 * APIクライアント
 * 
 * バックエンドAPIとの通信を管理
 * 要件: 2.2, 8.4, 8.10
 */

import { ChatRequest, ChatResponse, NPCResponse, Message } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// デバッグ用ログ
if (typeof window !== 'undefined') {
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
}

/**
 * APIクライアントクラス
 * 
 * バックエンドAPIへのHTTPリクエストを処理し、
 * リトライロジック、タイムアウト、フォールバック応答を提供
 */
export class APIClient {
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = 30000, maxRetries: number = 2) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.maxRetries = maxRetries;
    
    // デバッグ用ログ
    if (typeof window !== 'undefined') {
      console.log('APIClient initialized with baseUrl:', this.baseUrl);
    }
  }

  /**
   * チャットメッセージを送信してNPC応答を取得
   * 
   * @param request - チャットリクエスト
   * @returns NPC応答またはフォールバック応答
   */
  async sendMessage(request: ChatRequest): Promise<NPCResponse> {
    let lastError: Error | null = null;

    // リトライロジック
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const requestBody = {
          session_id: request.sessionId,
          state_id: request.stateId,
          user_message: request.userMessage,
          conversation_history: request.conversationHistory.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp.toISOString(),
          })),
          current_slots: request.currentSlots,
        };
        
        // デバッグ用ログ
        console.log('Sending chat request:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${this.baseUrl}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data: ChatResponse = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || 'Unknown API error');
        }

        // バックエンドのsnake_caseをcamelCaseに変換
        const rawData = data.data as any;
        
        // movement_optionsの変換
        let movementOptions = undefined;
        if (rawData.movement_options || rawData.movementOptions) {
          const options = rawData.movement_options || rawData.movementOptions;
          movementOptions = options.map((opt: any) => ({
            id: opt.id,
            label: opt.label,
            targetStateId: opt.target_state_id || opt.targetStateId,
            isCorrect: opt.is_correct ?? opt.isCorrect ?? false,
          }));
        }
        
        const npcResponse: NPCResponse = {
          npcMessage: rawData.npc_message || rawData.npcMessage,
          slotUpdates: rawData.slot_updates || rawData.slotUpdates || {},
          movementOptions,
          shouldTransition: rawData.should_transition ?? rawData.shouldTransition ?? false,
        };

        return npcResponse;

      } catch (error) {
        lastError = error as Error;
        console.error(`Chat API attempt ${attempt + 1} failed:`, error);

        // 最後の試行でない場合は待機してリトライ
        if (attempt < this.maxRetries) {
          await this.delay(1000 * (attempt + 1)); // 指数バックオフ
        }
      }
    }

    // すべてのリトライが失敗した場合、フォールバック応答を返す
    console.error('All chat API attempts failed, using fallback response');
    return this.getFallbackResponse(lastError);
  }

  /**
   * テキストを音声に変換
   * 
   * @param text - 音声に変換するテキスト
   * @param voice - 音声の種類（デフォルト: 'alloy'）
   * @param speed - 再生速度（デフォルト: 1.0）
   * @returns 音声データのBlob
   */
  async textToSpeech(text: string, voice: string = 'alloy', speed: number = 1.0): Promise<Blob> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voice, speed }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status} ${response.statusText}`);
      }

      return await response.blob();

    } catch (error) {
      console.error('TTS API error:', error);
      throw new Error(`Failed to generate speech: ${(error as Error).message}`);
    }
  }

  /**
   * 音声をテキストに変換
   * 
   * @param audioBlob - 音声データのBlob
   * @returns 認識されたテキスト
   */
  async speechToText(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/api/stt`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`STT API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success || !data.text) {
        throw new Error(data.error || 'Speech recognition failed');
      }

      return data.text;

    } catch (error) {
      console.error('STT API error:', error);
      throw new Error(`Failed to transcribe audio: ${(error as Error).message}`);
    }
  }

  /**
   * 指定時間待機するヘルパー関数
   * 
   * @param ms - 待機時間（ミリ秒）
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * API失敗時のフォールバック応答を生成
   * 
   * @param error - 発生したエラー
   * @returns フォールバックNPC応答
   */
  private getFallbackResponse(error: Error | null): NPCResponse {
    return {
      npcMessage: "I'm sorry, I'm having trouble understanding right now. Could you try again?",
      slotUpdates: {},
      movementOptions: undefined,
      shouldTransition: false,
    };
  }
}

// シングルトンインスタンスをエクスポート
export const apiClient = new APIClient();
