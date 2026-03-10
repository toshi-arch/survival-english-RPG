'use client';

/**
 * InformationNoteコンポーネント
 * 
 * 収集した情報の表示と進捗管理
 * 要件: 7.1, 7.2, 7.3, 7.5
 */

import React from 'react';
import { useGameState } from '@/contexts/GameStateContext';
import { SlotDisplay } from '@/types';

export default function InformationNote() {
  const { state } = useGameState();
  const { scenario, currentStateId, requiredSlots } = state;

  // 現在のStateを取得
  const currentState = scenario.states[currentStateId];

  // スロット表示用のデータを生成
  const slotDisplays: SlotDisplay[] = currentState.requiredSlots.map(slotName => {
    const value = requiredSlots[slotName];
    const isFilled = value !== null && value !== undefined && value.trim() !== '';

    // スロット名を人間が読みやすいラベルに変換
    const label = formatSlotLabel(slotName);

    return {
      slotName,
      label,
      value,
      isFilled,
    };
  });

  // 埋まっているスロットの数
  const filledCount = slotDisplays.filter(s => s.isFilled).length;
  const totalCount = slotDisplays.length;

  return (
    <div className="information-note bg-white rounded-lg shadow-md p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Information Note</h2>
        <span className="text-sm text-gray-600">
          {filledCount} / {totalCount} collected
        </span>
      </div>

      {/* 進捗バー */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalCount > 0 ? (filledCount / totalCount) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {/* スロット一覧 */}
      {slotDisplays.length === 0 ? (
        <p className="text-gray-500 text-sm italic">
          No information needed for this location.
        </p>
      ) : (
        <div className="space-y-3">
          {slotDisplays.map(slot => (
            <div
              key={slot.slotName}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                slot.isFilled
                  ? 'bg-green-50 border-green-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* チェックボックス風アイコン */}
              <div className="flex-shrink-0 mt-0.5">
                {slot.isFilled ? (
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  </svg>
                )}
              </div>

              {/* スロット情報 */}
              <div className="flex-1 min-w-0">
                {slot.isFilled ? (
                  <>
                    <div className="font-medium text-gray-800 text-sm">
                      {slot.label}
                    </div>
                    <div className="text-green-700 text-sm mt-1 font-semibold">
                      {slot.value}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-medium text-gray-400 text-sm">
                      ???
                    </div>
                    <div className="text-gray-400 text-xs mt-1 italic">
                      Discover through conversation
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 完了メッセージ */}
      {filledCount === totalCount && totalCount > 0 && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-green-800 text-sm font-medium text-center">
            ✓ All information collected! You can now proceed.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * スロット名を人間が読みやすいラベルに変換
 */
function formatSlotLabel(slotName: string): string {
  // アンダースコアをスペースに変換し、各単語の先頭を大文字に
  return slotName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
