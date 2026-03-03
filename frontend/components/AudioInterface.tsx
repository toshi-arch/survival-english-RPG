'use client';

/**
 * AudioInterfaceコンポーネント（Phase 1: UIのみ）
 * 
 * 音声入力と音声出力の制御インターフェース
 * Phase 1ではUIのみ実装、Phase 2で実際の音声機能を追加
 * 要件: 8.3, 8.5, 8.9, 8.12
 */

import React, { useState } from 'react';
import { useGameState } from '@/contexts/GameStateContext';

export default function AudioInterface() {
  const { state, dispatch } = useGameState();
  const { audioState } = state;
  const [showDevMessage, setShowDevMessage] = useState(false);

  // マイクボタンのクリック処理（Phase 1: 開発中メッセージ表示）
  const handleMicClick = () => {
    setShowDevMessage(true);
    setTimeout(() => setShowDevMessage(false), 3000);
  };

  // スピーカートグルのクリック処理
  const handleSpeakerToggle = () => {
    dispatch({ type: 'TOGGLE_VOICE_OUTPUT' });
  };

  return (
    <div className="audio-interface bg-white rounded-lg shadow-md p-4 mt-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Audio Controls</h3>

      <div className="flex items-center justify-around gap-4">
        {/* マイクボタン */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleMicClick}
            className={`relative p-4 rounded-full transition-all ${
              audioState.isRecording
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white shadow-lg hover:shadow-xl`}
            title="Voice Input (Coming in Phase 2)"
          >
            {audioState.isRecording ? (
              // 録音中アイコン
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <rect x="6" y="4" width="8" height="12" rx="1" />
              </svg>
            ) : (
              // マイクアイコン
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            )}

            {/* 録音中のパルスエフェクト */}
            {audioState.isRecording && (
              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></span>
            )}
          </button>
          <span className="text-xs text-gray-600 mt-2">
            {audioState.isRecording ? 'Recording...' : 'Voice Input'}
          </span>
        </div>

        {/* スピーカートグル */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleSpeakerToggle}
            className={`p-4 rounded-full transition-all ${
              audioState.voiceOutputEnabled
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-400 hover:bg-gray-500'
            } text-white shadow-lg hover:shadow-xl`}
            title={audioState.voiceOutputEnabled ? 'Voice Output: ON' : 'Voice Output: OFF'}
          >
            {audioState.voiceOutputEnabled ? (
              // スピーカーオンアイコン
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            ) : (
              // スピーカーオフアイコン
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            )}
          </button>
          <span className="text-xs text-gray-600 mt-2">
            {audioState.voiceOutputEnabled ? 'Audio: ON' : 'Audio: OFF'}
          </span>
        </div>
      </div>

      {/* 音声処理状態の表示 */}
      {audioState.isProcessing && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-800">Processing audio...</span>
          </div>
        </div>
      )}

      {/* 音声再生中の表示 */}
      {audioState.isSpeaking && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-green-600 animate-pulse"></div>
              <div className="w-1 h-4 bg-green-600 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-4 bg-green-600 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-green-800">Speaking...</span>
          </div>
        </div>
      )}

      {/* 開発中メッセージ（Phase 1のみ） */}
      {showDevMessage && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 text-center">
            🚧 Voice input feature is coming in Phase 2!
          </p>
        </div>
      )}

      {/* Phase 1の注意書き */}
      <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-500 text-center">
        Phase 1: UI only. Full audio features will be available in Phase 2.
      </div>
    </div>
  );
}
