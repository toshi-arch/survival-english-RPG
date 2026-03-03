/**
 * 応答マッチングロジック
 * 
 * ユーザー入力に基づいて適切な静的応答を検索する
 * 要件: 2.3, 11.3
 */

import { NPCResponse } from '@/types';

/**
 * ユーザーメッセージから適切な応答パターンを検索
 * 
 * @param userMessage - ユーザーの入力メッセージ
 * @param responses - State用の応答マップ
 * @param isFirstMessage - 会話の最初のメッセージかどうか
 * @returns マッチしたNPCResponse
 */
export function matchResponse(
  userMessage: string,
  responses: Record<string, NPCResponse>,
  isFirstMessage: boolean = false
): NPCResponse {
  // 最初のメッセージの場合は'initial'応答を返す
  if (isFirstMessage && responses['initial']) {
    return responses['initial'];
  }

  // メッセージを小文字に変換して正規化
  const normalizedMessage = userMessage.toLowerCase().trim();

  // 空のメッセージの場合はデフォルト応答
  if (!normalizedMessage) {
    return responses['default'] || createDefaultResponse();
  }

  // 各パターンをチェック
  for (const [pattern, response] of Object.entries(responses)) {
    // 'initial'と'default'はスキップ
    if (pattern === 'initial' || pattern === 'default') {
      continue;
    }

    // パターンをパイプ区切りで分割してOR条件として扱う
    const keywords = pattern.split('|');
    
    // いずれかのキーワードがメッセージに含まれているかチェック
    const isMatch = keywords.some(keyword => 
      normalizedMessage.includes(keyword.toLowerCase().trim())
    );

    if (isMatch) {
      return response;
    }
  }

  // マッチしない場合はデフォルト応答
  return responses['default'] || createDefaultResponse();
}

/**
 * キーワードがメッセージに含まれているかチェック（単語境界を考慮）
 * 
 * @param message - チェック対象のメッセージ
 * @param keyword - 検索するキーワード
 * @returns キーワードが含まれている場合true
 */
export function containsKeyword(message: string, keyword: string): boolean {
  const normalizedMessage = message.toLowerCase();
  const normalizedKeyword = keyword.toLowerCase();
  
  // 単純な部分一致チェック
  return normalizedMessage.includes(normalizedKeyword);
}

/**
 * 複数のキーワードパターンのいずれかにマッチするかチェック
 * 
 * @param message - チェック対象のメッセージ
 * @param patterns - パイプ区切りのキーワードパターン
 * @returns いずれかのパターンにマッチする場合true
 */
export function matchesPattern(message: string, patterns: string): boolean {
  const keywords = patterns.split('|');
  return keywords.some(keyword => containsKeyword(message, keyword.trim()));
}

/**
 * デフォルトのNPC応答を生成
 * 
 * @returns デフォルトのNPCResponse
 */
function createDefaultResponse(): NPCResponse {
  return {
    npcMessage: "I'm not sure I understand. Could you try asking in a different way?",
    slotUpdates: {},
  };
}

/**
 * ユーザーメッセージが単語レベルの入力かどうかを判定
 * 
 * @param message - チェック対象のメッセージ
 * @returns 単語レベルの入力の場合true
 */
export function isSingleWordInput(message: string): boolean {
  const words = message.trim().split(/\s+/);
  return words.length <= 3; // 3単語以下を単語レベルとみなす
}

/**
 * メッセージから重要なキーワードを抽出
 * 
 * @param message - 対象のメッセージ
 * @returns 抽出されたキーワードの配列
 */
export function extractKeywords(message: string): string[] {
  // 一般的なストップワードを除外
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been',
    'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'to', 'from', 'in', 'on', 'at', 'by', 'for', 'with',
    'can', 'could', 'would', 'should', 'may', 'might',
    'do', 'does', 'did', 'have', 'has', 'had'
  ]);

  const words = message
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // 句読点を除去
    .split(/\s+/)
    .filter(word => word.length > 0 && !stopWords.has(word));

  return words;
}
