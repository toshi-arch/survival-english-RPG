/**
 * ホーム画面
 * 
 * ゲーム開始画面とシナリオ説明
 * 要件: 11.4
 */

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Survival English Roleplay
          </h1>
          <p className="text-lg text-gray-600">
            英語初心者向けインタラクティブ学習ゲーム
          </p>
        </div>

        {/* シナリオ説明 */}
        <div className="mb-8 p-6 bg-indigo-50 rounded-lg border-2 border-indigo-200">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">
            🗽 Scenario: Journey to the Statue of Liberty
          </h2>
          <p className="text-gray-700 mb-4">
            You've just arrived at JFK Airport in New York. Your goal is to reach the Statue of Liberty!
          </p>
          <p className="text-gray-700 mb-4">
            Talk to friendly NPCs, gather information, and navigate through the city using your English skills.
            Don't worry about perfect grammar - focus on communicating and achieving your goal!
          </p>
          <div className="mt-4 p-4 bg-white rounded border border-indigo-200">
            <h3 className="font-semibold text-indigo-800 mb-2">Game Features:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Accept broken English and single words</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Collect information through conversation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Visual map to track your progress</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Make decisions based on what you learn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* スタートボタン */}
        <div className="text-center">
          <Link
            href="/game"
            className="inline-block px-8 py-4 bg-indigo-600 text-white text-xl font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Your Journey
          </Link>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Phase 1: Static Prototype</p>
          <p className="mt-1">AI integration coming in Phase 2</p>
        </div>
      </div>
    </main>
  );
}
