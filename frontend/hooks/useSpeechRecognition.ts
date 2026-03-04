/**
 * useSpeechRecognition - 音声認識フック
 * 
 * MediaRecorder APIを使用した音声録音とWhisper APIによる音声認識
 * 要件: 8.3, 8.4, 8.5, 8.9
 */

import { useState, useRef, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';

interface UseSpeechRecognitionReturn {
  isRecording: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearTranscript: () => void;
}

/**
 * 音声認識フック
 * 
 * ブラウザのMediaRecorder APIで音声を録音し、
 * バックエンドのWhisper APIでテキストに変換
 */
export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // ブラウザがMediaRecorder APIをサポートしているかチェック
  const isSupported = typeof window !== 'undefined' && 
                      typeof navigator !== 'undefined' && 
                      !!navigator.mediaDevices?.getUserMedia;

  /**
   * 録音を開始
   */
  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Your browser does not support audio recording');
      return;
    }

    try {
      setError(null);
      
      // マイクへのアクセスを要求
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });
      
      streamRef.current = stream;

      // MediaRecorderを作成
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // 音声データが利用可能になったときのハンドラ
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 録音停止時のハンドラ
      mediaRecorder.onstop = async () => {
        try {
          // 音声データをBlobに変換
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // 音声データが空でないかチェック
          if (audioBlob.size === 0) {
            throw new Error('No audio data recorded');
          }

          // バックエンドのWhisper APIに送信
          const text = await apiClient.speechToText(audioBlob);
          setTranscript(text);
          setError(null);
          
        } catch (err) {
          console.error('Speech recognition error:', err);
          setError(err instanceof Error ? err.message : 'Failed to transcribe audio');
        } finally {
          // ストリームを停止
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
        }
      };

      // エラーハンドラ
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Recording error occurred');
        setIsRecording(false);
      };

      // 録音開始
      mediaRecorder.start();
      setIsRecording(true);
      
    } catch (err) {
      console.error('Failed to start recording:', err);
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Microphone access denied. Please allow microphone access.');
        } else if (err.name === 'NotFoundError') {
          setError('No microphone found. Please connect a microphone.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to start recording');
      }
      
      setIsRecording(false);
    }
  }, [isSupported]);

  /**
   * 録音を停止
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  /**
   * トランスクリプトをクリア
   */
  const clearTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isRecording,
    transcript,
    error,
    isSupported,
    startRecording,
    stopRecording,
    clearTranscript,
  };
}
