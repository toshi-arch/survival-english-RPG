'use client';

/**
 * MapUIコンポーネント
 * 
 * 現在地と進行状況を視覚的に表示するマップインターフェース
 * 要件: 1.5, 6.1, 6.2, 6.3, 6.5
 */

import React from 'react';
import { useGameState } from '@/contexts/GameStateContext';
import { StateNode } from '@/types';

export default function MapUI() {
  const { state } = useGameState();
  const { scenario, currentStateId } = state;

  // StateをStateNodeに変換
  const stateNodes: StateNode[] = Object.values(scenario.states).map(s => ({
    id: s.id,
    name: s.name,
    position: s.mapPosition,
    isGoal: s.isGoal,
    isError: s.isError,
    isCurrent: s.id === currentStateId,
  }));

  // エラーStateを除外した通常のState
  const normalStates = stateNodes.filter(node => !node.isError);
  const errorStates = stateNodes.filter(node => node.isError);

  // SVGのビューボックスサイズ
  const viewBoxWidth = 800;
  const viewBoxHeight = 500;

  return (
    <div className="map-ui bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Map</h2>
      
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-auto border border-gray-200 rounded"
        style={{ maxHeight: '400px' }}
      >
        {/* 背景 */}
        <rect width={viewBoxWidth} height={viewBoxHeight} fill="#f0f9ff" />

        {/* State間の接続線を描画 */}
        {normalStates.map(node => {
          const currentState = scenario.states[node.id];
          return currentState.transitions
            .filter(t => !scenario.states[t.targetStateId]?.isError) // エラーStateへの線は除外
            .map((transition, idx) => {
              const targetNode = stateNodes.find(n => n.id === transition.targetStateId);
              if (!targetNode) return null;

              return (
                <line
                  key={`${node.id}-${transition.targetStateId}-${idx}`}
                  x1={node.position.x}
                  y1={node.position.y}
                  x2={targetNode.position.x}
                  y2={targetNode.position.y}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray={transition.isCorrect === false ? '5,5' : '0'}
                  opacity="0.5"
                />
              );
            });
        })}

        {/* 通常のStateノードを描画 */}
        {normalStates.map(node => {
          const isGoal = node.isGoal;
          const isCurrent = node.isCurrent;
          
          // 色の決定
          let fillColor = '#e0e7ff'; // デフォルト（未訪問）
          let strokeColor = '#6366f1';
          let strokeWidth = 2;

          if (isCurrent) {
            fillColor = '#4f46e5'; // 現在地（濃い青）
            strokeColor = '#312e81';
            strokeWidth = 4;
          } else if (isGoal) {
            fillColor = '#fef08a'; // ゴール（黄色）
            strokeColor = '#ca8a04';
            strokeWidth = 3;
          }

          return (
            <g key={node.id}>
              {/* ノードの円 */}
              <circle
                cx={node.position.x}
                cy={node.position.y}
                r={isGoal ? 30 : 25}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              
              {/* ゴールマーカー */}
              {isGoal && (
                <text
                  x={node.position.x}
                  y={node.position.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="24"
                  fill="#ca8a04"
                >
                  ★
                </text>
              )}

              {/* 現在地マーカー */}
              {isCurrent && !isGoal && (
                <circle
                  cx={node.position.x}
                  cy={node.position.y}
                  r={8}
                  fill="white"
                />
              )}

              {/* State名ラベル */}
              <text
                x={node.position.x}
                y={node.position.y + 45}
                textAnchor="middle"
                fontSize="12"
                fontWeight={isCurrent ? 'bold' : 'normal'}
                fill={isCurrent ? '#312e81' : '#475569'}
              >
                {node.name}
              </text>
            </g>
          );
        })}

        {/* エラーStateを別の場所に表示 */}
        {errorStates.map(node => (
          <g key={node.id}>
            <circle
              cx={node.position.x}
              cy={node.position.y}
              r={20}
              fill="#fee2e2"
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="3,3"
            />
            <text
              x={node.position.x}
              y={node.position.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20"
              fill="#dc2626"
            >
              ✕
            </text>
            <text
              x={node.position.x}
              y={node.position.y + 35}
              textAnchor="middle"
              fontSize="10"
              fill="#991b1b"
            >
              {node.name}
            </text>
          </g>
        ))}
      </svg>

      {/* 凡例 */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-indigo-600 border-2 border-indigo-900"></div>
          <span>Current Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-200 border-2 border-yellow-600"></div>
          <span>Goal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-100 border-2 border-red-600 border-dashed"></div>
          <span>Wrong Place</span>
        </div>
      </div>
    </div>
  );
}
