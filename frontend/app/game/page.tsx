/**
 * ゲームページ
 * 
 * すべてのゲームコンポーネントを統合したメインゲーム画面
 * 要件: 11.4
 */

import { GameStateProvider } from '@/contexts/GameStateContext';
import MapUI from '@/components/MapUI';
import InformationNote from '@/components/InformationNote';
import ChatUI from '@/components/ChatUI';
import AudioInterface from '@/components/AudioInterface';

export default function GamePage() {
  return (
    <GameStateProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 text-center">
              Survival English Roleplay Game
            </h1>
            <p className="text-center text-gray-600 mt-2">
              Navigate to the Statue of Liberty using your English skills!
            </p>
          </header>

          {/* メインゲームエリア */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左パネル: マップと情報ノート */}
            <aside className="space-y-6">
              <MapUI />
              <InformationNote />
            </aside>

            {/* 右パネル: チャットと音声インターフェース */}
            <main className="flex flex-col" style={{ minHeight: '600px' }}>
              <div className="flex-1">
                <ChatUI />
              </div>
              <AudioInterface />
            </main>
          </div>
        </div>
      </div>
    </GameStateProvider>
  );
}
