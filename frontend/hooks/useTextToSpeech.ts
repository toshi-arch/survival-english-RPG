/**
 * useTextToSpeech - 音声合成フック
 * 
 * OpenAI TTS APIを使用した音声合成と再生制御
 * 要件: 8.10, 8.11, 8.12, 8.13
 */

import { useState, useRef, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';

interface UseTextToSpeechReturn {
  speak: (text: string, voice?: string, speed?: number) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
  isEnabled: boolean;
  toggleEnabled: () => void;
  error: string | null;
}

/**
 * 音声合成フック
 * 
 * バックエンドのTTS APIを使用してテキストを音声に変換し、
 * ブラウザで再生する
 */
export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  /**
   * テキストを音声に変換して再生
   * 
   * @param text - 音声に変換するテキスト
   * @param voice - 音声の種類（デフォルト: 'alloy'）
   * @param speed - 再生速度（デフォルト: 1.0）
   */
  const speak = useCallback(async (
    text: string, 
    voice: string = 'alloy', 
    speed: number = 1.0
  ) => {
    // 音声出力が無効の場合は何もしない
    if (!isEnabled) {
      return;
    }

    // 空のテキストの場合は何もしない
    if (!text.trim()) {
      return;
    }

    try {
      setError(null);
      setIsSpeaking(true);

      // 既存の音声を停止
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // 既存のURLをクリーンアップ
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }

      // バックエンドのTTS APIを呼び出し
      const audioBlob = await apiClient.textToSpeech(text, voice, speed);
      
      // BlobからURLを作成
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;

      // 音声を再生
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // 再生終了時のハンドラ
      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
        
        // 少し遅延してからURLをクリーンアップ（再生完了を確実にする）
        setTimeout(() => {
          if (audioUrlRef.current === audioUrl) {
            URL.revokeObjectURL(audioUrl);
            audioUrlRef.current = null;
          }
        }, 100);
      };

      // エラーハンドラ
      audio.onerror = (event) => {
        console.error('Audio playback error:', event);
        setError('Failed to play audio');
        setIsSpeaking(false);
        audioRef.current = null;
        
        // エラー時はすぐにクリーンアップ
        if (audioUrlRef.current === audioUrl) {
          URL.revokeObjectURL(audioUrl);
          audioUrlRef.current = null;
        }
      };

      // 音声を再生（try-catchで囲んでautoplay制限をハンドル）
      try {
        await audio.play();
      } catch (playError) {
        // Autoplay制限の場合は特別なエラーメッセージ
        if (playError instanceof Error && playError.name === 'NotAllowedError') {
          console.warn('Autoplay blocked by browser. User interaction required.');
          setError('Click to enable audio playback');
        } else {
          throw playError;
        }
      }

    } catch (err) {
      console.error('Text-to-speech error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate speech');
      setIsSpeaking(false);

      // エラー時もURLをクリーンアップ
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    }
  }, [isEnabled]);

  /**
   * 音声再生を停止
   */
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    setIsSpeaking(false);
  }, []);

  /**
   * 音声出力の有効/無効を切り替え
   */
  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => {
      const newEnabled = !prev;
      
      // 無効にする場合は再生中の音声を停止
      if (!newEnabled && isSpeaking) {
        stop();
      }
      
      return newEnabled;
    });
  }, [isSpeaking, stop]);

  return {
    speak,
    stop,
    isSpeaking,
    isEnabled,
    toggleEnabled,
    error,
  };
}
