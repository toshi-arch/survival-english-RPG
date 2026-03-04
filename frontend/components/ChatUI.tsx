'use client';

/**
 * ChatUIコンポーネント
 * 
 * AI NPCとの会話インターフェース
 * 要件: 8.1, 8.2, 8.6, 8.7, 8.8
 */

import React, { useState, useRef, useEffect } from 'react';
import { useGameState } from '@/contexts/GameStateContext';
import { getStaticResponsesForState } from '@/data/staticResponses';
import { matchResponse } from '@/lib/responseMatching';
import { processUserMessage } from '@/lib/gameLogic';

export default function ChatUI() {
  const { state, dispatch, sendMessageWithAPI } = useGameState();
  const { conversationHistory, currentStateId, requiredSlots, movementOptions, scenario } = state;
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  // AI統合が有効かどうかをチェック
  const useAI = process.env.NEXT_PUBLIC_USE_AI === 'true';

  // 会話履歴が更新されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  // コンポーネントマウント時に初期メッセージを送信
  useEffect(() => {
    if (!initializedRef.current && conversationHistory.length === 0) {
      initializedRef.current = true;
      handleInitialMessage();
    }
  }, []);

  // 初期メッセージの処理
  const handleInitialMessage = () => {
    const responses = getStaticResponsesForState(currentStateId);
    const npcResponse = matchResponse('', responses, true);
    
    dispatch({
      type: 'RECEIVE_NPC_RESPONSE',
      payload: npcResponse,
    });
  };

  // メッセージ送信処理
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    const messageContent = inputValue;
    setInputValue(''); // 入力フィールドをすぐにクリア
    inputRef.current?.focus();

    if (useAI) {
      // Phase 2: API経由でメッセージを送信
      setIsLoading(true);
      try {
        await sendMessageWithAPI(messageContent);
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Phase 1: 静的応答を使用
      // ユーザーメッセージを追加
      dispatch({
        type: 'SEND_MESSAGE',
        payload: { content: messageContent },
      });

      // 静的応答を取得
      const responses = getStaticResponsesForState(currentStateId);
      const npcResponse = matchResponse(messageContent, responses, false);

      // NPC応答を追加
      dispatch({
        type: 'RECEIVE_NPC_RESPONSE',
        payload: npcResponse,
      });

      // 移動選択肢を表示すべきかチェック
      const currentState = scenario.states[currentStateId];
      const result = processUserMessage(messageContent, currentState, requiredSlots);

      if (result.shouldShowOptions && result.movementOptions) {
        dispatch({
          type: 'SHOW_MOVEMENT_OPTIONS',
          payload: result.movementOptions,
        });
      }
    }
  };

  // 移動選択肢のクリック処理
  const handleMovementOptionClick = (optionId: string) => {
    const selectedOption = movementOptions?.find(opt => opt.id === optionId);
    if (!selectedOption) return;

    // 選択を記録
    dispatch({
      type: 'SELECT_MOVEMENT',
      payload: optionId,
    });

    // State遷移
    dispatch({
      type: 'TRANSITION_STATE',
      payload: { newStateId: selectedOption.targetStateId },
    });

    // 新しいStateの初期メッセージを表示
    setTimeout(() => {
      const newResponses = getStaticResponsesForState(selectedOption.targetStateId);
      const initialResponse = matchResponse('', newResponses, true);
      
      dispatch({
        type: 'RECEIVE_NPC_RESPONSE',
        payload: initialResponse,
      });
    }, 500);
  };

  return (
    <div className="chat-ui flex flex-col h-full bg-white rounded-lg shadow-md">
      {/* ヘッダー */}
      <div className="chat-header bg-indigo-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">Chat with NPC</h2>
        <p className="text-sm text-indigo-100">
          {scenario.states[currentStateId]?.npcRole || 'NPC'}
        </p>
      </div>

      {/* メッセージリスト */}
      <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-4">
        {conversationHistory.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {/* 移動選択肢 */}
        {movementOptions && movementOptions.length > 0 && (
          <div className="movement-options space-y-2 mt-4">
            <p className="text-sm text-gray-600 font-medium">Choose your next move:</p>
            {movementOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleMovementOptionClick(option.id)}
                className="w-full text-left p-3 rounded-lg border-2 border-indigo-300 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 transition-colors"
              >
                <span className="text-indigo-800 font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 入力フォーム */}
      <form onSubmit={handleSendMessage} className="chat-input p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isLoading ? "Processing..." : "Type your message..."}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading || (movementOptions !== null && movementOptions.length > 0)}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading || (movementOptions !== null && movementOptions.length > 0)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
        {useAI && (
          <p className="text-xs text-gray-500 mt-2">
            🤖 AI Mode: Using OpenAI API
          </p>
        )}
      </form>
    </div>
  );
}
