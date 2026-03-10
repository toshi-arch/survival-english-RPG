'use client';

/**
 * AudioInterfaceコンポーネント（Phase 2: 完全実装）
 * 
 * 音声入力と音声出力の制御インターフェース
 * useSpeechRecognitionとuseTextToSpeechフックを統合
 * 要件: 8.3, 8.4, 8.5, 8.9, 8.10, 8.11, 8.12
 */

import React, { useState, useEffect } from 'react';
import { useGameState } from '@/contexts/GameStateContext';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

export default function AudioInterface() {
  const { state, dispatch, sendMessageWithAPI } = useGameState();
  const { audioState, conversationHistory } = state;
  
  // 音声認識フック
  const {
    isRecording,
    transcript,
    error: sttError,
    isSupported: sttSupported,
    startRecording,
    stopRecording,
    clearTranscript,
  } = useSpeechRecognition();

  // 音声合成フック
  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isEnabled: ttsEnabled,
    toggleEnabled: toggleTTS,
    error: ttsError,
  } = useTextToSpeech();

  // AI統合が有効かどうかをチェック（クライアントサイドのみ）
  const [useAI, setUseAI] = useState(false);
  
  useEffect(() => {
    setUseAI(process.env.NEXT_PUBLIC_USE_AI === 'true');
  }, []);

  // トランスクリプトが更新されたらメッセージを送信
  useEffect(() => {
    if (transcript && transcript.trim()) {
      if (useAI) {
        // AI統合モード
        sendMessageWithAPI(transcript);
      } else {
        // 静的応答モード
        dispatch({
          type: 'SEND_MESSAGE',
          payload: { content: transcript },
        });
      }
      clearTranscript();
    }
  }, [transcript, useAI, sendMessageWithAPI, dispatch, clearTranscript]);

  // NPC応答が追加されたら音声出力（音声出力が有効な場合）
  // 最後に再生したメッセージIDを追跡して重複再生を防ぐ
  const lastPlayedMessageIdRef = React.useRef<string | null>(null);
  const hasUserInteractedRef = React.useRef(false);
  
  useEffect(() => {
    if (ttsEnabled && conversationHistory.length > 0 && useAI && hasUserInteractedRef.current) {
      const lastMessage = conversationHistory[conversationHistory.length - 1];
      
      // 最後のメッセージがNPCからのもので、まだ再生していない場合のみ音声出力
      if (lastMessage.role === 'npc' && lastMessage.id !== lastPlayedMessageIdRef.current) {
        lastPlayedMessageIdRef.current = lastMessage.id;
        
        // ユーザーインタラクション後のみ再生（autoplay制限を回避）
        speak(lastMessage.content).catch(err => {
          console.error('Failed to play TTS:', err);
          // Autoplay制限エラーの場合は静かに失敗
        });
      }
    }
  }, [conversationHistory, ttsEnabled, speak, useAI]);

  // 録音状態をContextに同期
  useEffect(() => {
    dispatch({
      type: 'SET_RECORDING',
      payload: isRecording,
    });
  }, [isRecording, dispatch]);

  // マイクボタンのクリック処理
  const handleMicClick = async () => {
    // ユーザーインタラクションがあったことを記録
    hasUserInteractedRef.current = true;
    
    if (!useAI) {
      // Phase 1モード: 開発中メッセージ
      alert('🚧 Voice input feature is coming in Phase 2! Set NEXT_PUBLIC_USE_AI=true to enable.');
      return;
    }

    if (!sttSupported) {
      alert('Your browser does not support audio recording. Please use a modern browser like Chrome or Edge.');
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  // スピーカートグルのクリック処理
  const handleSpeakerToggle = () => {
    // ユーザーインタラクションがあったことを記録
    hasUserInteractedRef.current = true;
    
    toggleTTS();
    
    // 音声再生中の場合は停止
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  return (
    <div className="audio-interface bg-white rounded-lg shadow-md p-4 mt-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Audio Controls</h3>

      <div className="flex items-center justify-around gap-4">
        {/* マイクボタン */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleMicClick}
            disabled={!useAI || !sttSupported}
            className={`relative p-4 rounded-full transition-all ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600'
                : useAI && sttSupported
                ? 'bg-indigo-500 hover:bg-indigo-600'
                : 'bg-gray-300 cursor-not-allowed'
            } text-white shadow-lg hover:shadow-xl disabled:hover:shadow-lg`}
            title={
              !useAI
                ? 'Enable AI mode to use voice input'
                : !sttSupported
                ? 'Your browser does not support audio recording'
                : isRecording
                ? 'Stop recording'
                : 'Start voice input'
            }
          >
            {isRecording ? (
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
            {isRecording && (
              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></span>
            )}
          </button>
          <span className="text-xs text-gray-600 mt-2">
            {isRecording ? 'Recording...' : 'Voice Input'}
          </span>
        </div>

        {/* スピーカートグル */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleSpeakerToggle}
            disabled={!useAI}
            className={`p-4 rounded-full transition-all ${
              ttsEnabled && useAI
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-400 hover:bg-gray-500'
            } text-white shadow-lg hover:shadow-xl disabled:cursor-not-allowed`}
            title={
              !useAI
                ? 'Enable AI mode to use voice output'
                : ttsEnabled
                ? 'Voice Output: ON'
                : 'Voice Output: OFF'
            }
          >
            {ttsEnabled ? (
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
            {ttsEnabled ? 'Audio: ON' : 'Audio: OFF'}
          </span>
        </div>
      </div>

      {/* 音声再生中の表示 */}
      {isSpeaking && (
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

      {/* エラー表示 */}
      {(sttError || ttsError) && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            ⚠️ {sttError || ttsError}
          </p>
        </div>
      )}

      {/* モード表示 */}
      <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-500 text-center">
        {useAI ? (
          <span className="text-green-600 font-medium">
            🎤 Audio features enabled (AI Mode)
          </span>
        ) : (
          <span>
            Phase 1: Set NEXT_PUBLIC_USE_AI=true to enable audio features
          </span>
        )}
      </div>
    </div>
  );
}
