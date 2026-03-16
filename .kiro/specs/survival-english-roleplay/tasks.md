# 実装タスクリスト: サバイバル英語ロールプレイゲーム

## 概要

本タスクリストは、サバイバル英語ロールプレイゲームの実装を段階的に進めるためのものです。Phase 1では静的プロトタイプ（フロントエンドのみ）を構築し、Phase 2でバックエンドとOpenAI API統合を追加します。

## Phase 1: 静的プロトタイプ実装

### 1. 開発環境のセットアップ

- [x] 1.1 Docker/.devcontainer環境の構築
  - プロジェクトルートに`.devcontainer/`ディレクトリを作成
  - `docker-compose.yml`を作成（フロントエンドサービスのみ）
  - `devcontainer.json`を作成（VS Code設定）
  - フロントエンド用の`Dockerfile`を作成
  - _要件: 11.1_

- [x] 1.2 Next.jsプロジェクトの初期化
  - `frontend/`ディレクトリにNext.js 14プロジェクトを作成
  - TypeScript、Tailwind CSS、ESLintを設定
  - `package.json`に必要な依存関係を追加
  - _要件: 11.1_

- [x] 1.3 プロジェクト構造の作成
  - `app/`, `components/`, `contexts/`, `hooks/`, `lib/`, `data/`, `types/`, `styles/`ディレクトリを作成
  - 基本的なディレクトリ構造を整備
  - _要件: 11.1_

### 2. 型定義とデータモデルの実装

- [x] 2.1 型定義ファイルの作成
  - `types/index.ts`にすべての型定義を実装（Scenario, State, Message, NPCResponse, GameSession, MovementOption, AudioState）
  - _要件: 1.1, 2.1, 3.1, 5.2, 7.1, 8.1, 10.2_

- [x] 2.2 自由の女神シナリオデータの作成
  - `data/scenarios/statueLibertyScenario.ts`にシナリオ定義を実装
  - 5つのState（Airport Lobby, City Transit, Battery Park Area, Ferry Terminal, Statue of Liberty）とWrong Placeを定義
  - 各Stateのマップ座標を設定
  - _要件: 9.1, 9.2, 9.5_

- [x] 2.3 各Stateの詳細定義
  - `data/states/`に各State定義ファイルを作成（airportLobby.ts, cityTransit.ts, batteryParkArea.ts, ferryTerminal.ts, statueOfLiberty.ts, wrongPlace.ts）
  - 各StateのNPC役割、必須スロット、遷移先を定義
  - _要件: 1.1, 2.1, 3.2, 9.3_

### 3. 静的応答システムの実装

- [x] 3.1 静的応答データの作成
  - `data/staticResponses/`に各Stateの応答パターンを作成
  - キーワードベースの応答マッピングを実装（initial, statue|liberty, subway|train, how|get, ready, defaultパターン）
  - _要件: 2.2, 2.3, 11.2_

- [x] 3.2 応答マッチングロジックの実装
  - `lib/responseMatching.ts`にキーワードマッチング関数を実装
  - 大文字小文字を区別しない検索機能
  - デフォルト応答のフォールバック処理
  - _要件: 2.3, 11.3_

- [ ]* 3.3 応答マッチングロジックのユニットテスト
  - キーワードマッチングのテスト
  - 単語レベル入力の受け入れテスト
  - デフォルト応答のテスト
  - _要件: 2.3_

### 4. ゲーム状態管理の実装

- [x] 4.1 GameStateContextの実装
  - `contexts/GameStateContext.tsx`にContext、Provider、Reducerを実装
  - GameStateとGameActionの型定義
  - 初期状態の設定（シナリオ読み込み、開始Stateの設定）
  - _要件: 1.2, 7.4, 8.6_

- [x] 4.2 Reducerアクションの実装
  - SEND_MESSAGE, RECEIVE_NPC_RESPONSE, UPDATE_SLOTS, SHOW_MOVEMENT_OPTIONS, SELECT_MOVEMENT, TRANSITION_STATE, TOGGLE_VOICE_OUTPUT, SET_RECORDINGアクションを実装
  - 各アクションの状態更新ロジック
  - _要件: 2.6, 3.4, 3.5, 7.2, 8.6, 8.7_

- [x] 4.3 ゲームロジックの実装
  - `lib/gameLogic.ts`にState遷移ロジック、スロット完全性チェックを実装
  - shouldShowMovementOptions関数
  - processUserMessage関数
  - _要件: 2.1, 3.4, 3.5_

- [ ]* 4.4 状態管理のユニットテスト
  - Reducerの各アクションのテスト
  - State遷移ロジックのテスト
  - スロット更新の伝播テスト
  - _要件: 2.6, 3.4, 7.4_

### 5. UIコンポーネントの実装

- [x] 5.1 MapUIコンポーネントの実装
  - `components/MapUI.tsx`を作成
  - SVGベースのマップ表示
  - 現在のStateのハイライト表示
  - ゴールStateの特別なマーカー表示
  - State間の接続線の表示
  - _要件: 1.5, 6.1, 6.2, 6.3, 6.5_

- [x] 5.2 InformationNoteコンポーネントの実装
  - `components/InformationNote.tsx`を作成
  - 必須スロットの一覧表示
  - 埋まっているスロットと空のスロットの視覚的区別
  - スロット値の表示
  - _要件: 7.1, 7.2, 7.3, 7.5_

- [x] 5.3 ChatUIコンポーネントの実装
  - `components/ChatUI.tsx`を作成
  - 会話履歴の表示（MessageListコンポーネント）
  - テキスト入力フィールドと送信ボタン
  - メッセージ送信時のdispatch処理
  - _要件: 8.1, 8.2, 8.6, 8.7, 8.8_

- [x] 5.4 MovementOptionsコンポーネントの実装
  - `components/MovementOptions.tsx`を作成
  - 移動選択肢のボタン表示
  - 選択時の確認ダイアログ
  - 選択後のState遷移処理
  - _要件: 3.1, 3.2, 3.3_

- [x] 5.5 AudioInterfaceコンポーネントの実装（UIのみ）
  - `components/AudioInterface.tsx`を作成
  - マイクボタン（クリック時に「開発中」メッセージ表示）
  - スピーカーアイコンとオン/オフトグル（UIのみ）
  - 音声処理状態の表示要素（Phase 2で機能実装）
  - _要件: 8.3, 8.5, 8.9, 8.12_

- [ ]* 5.6 UIコンポーネントのテスト
  - 各コンポーネントのレンダリングテスト
  - ユーザーインタラクションのテスト
  - Context統合のテスト
  - _要件: 6.1, 7.1, 8.1, 8.2_

### 6. ゲーム画面の統合

- [x] 6.1 ゲームページの実装
  - `app/game/page.tsx`を作成
  - GameStateProviderでラップ
  - 左パネル（MapUI, InformationNote）と右パネル（ChatUI, AudioInterface）のレイアウト
  - _要件: 11.4_

- [x] 6.2 ホーム画面の実装
  - `app/page.tsx`を作成
  - ゲーム開始ボタンとシナリオ説明
  - ゲーム画面へのナビゲーション
  - _要件: 11.4_

- [x] 6.3 スタイリングの実装
  - `styles/globals.css`にTailwind CSSベースのスタイルを実装
  - レスポンシブデザインの調整
  - カラースキームの適用
  - _要件: 11.4_

### 7. データ検証とエラーハンドリング

- [x] 7.1 データ検証ロジックの実装
  - `lib/validation.ts`にvalidateScenario関数を実装
  - シナリオ構造の検証（必須フィールド、State参照の整合性）
  - _要件: 1.1, 1.3, 9.2_

- [x] 7.2 エラーハンドリングの実装
  - Reducerでのエラーハンドリング
  - ErrorBoundaryコンポーネントの実装
  - エラートースト通知の実装
  - _要件: 5.4_

- [ ]* 7.3 データ検証のプロパティベーステスト
  - **Property 1: シナリオデータ構造の完全性**
  - **検証要件: 1.1, 1.3, 2.1, 3.2**
  - fast-checkを使用したシナリオ構造の検証

### 8. チェックポイント - Phase 1完了確認

- [x] 8.1 統合テストの実施
  - 自由の女神シナリオの完全なプレイスルーテスト
  - すべてのState遷移の動作確認
  - UI/UXの確認
  - _要件: 11.3, 11.4, 11.5_

- [x] 8.2 Phase 1完了確認
  - すべてのテストが通過することを確認
  - ユーザーに質問があれば確認

## Phase 2: AI統合とバックエンド実装

### 9. バックエンド開発環境の追加

- [x] 9.1 バックエンドDocker環境の構築
  - `backend/`ディレクトリを作成
  - バックエンド用の`Dockerfile`を作成
  - `docker-compose.yml`にバックエンドサービスを追加
  - `.devcontainer/devcontainer.json`を更新
  - _要件: 11.1_

- [x] 9.2 Pythonプロジェクトの初期化
  - `requirements.txt`を作成（FastAPI, OpenAI SDK, Pydantic, uvicorn）
  - プロジェクト構造を作成（api/, models/, services/, config.py）
  - _要件: 11.1_

- [x] 9.3 環境変数の設定
  - `.env.example`を作成（OPENAI_API_KEY等）
  - `config.py`に環境変数読み込みロジックを実装
  - _要件: 11.1_

### 10. バックエンドデータモデルの実装

- [x] 10.1 Pydanticモデルの作成
  - `models/game.py`にMessage, ChatRequest, NPCResponse, MovementOption, ChatResponseモデルを実装
  - `models/openai_models.py`にTTSRequest, STTResponseモデルを実装
  - _要件: 10.2, 10.3_

- [ ]* 10.2 データモデルのユニットテスト
  - Pydanticモデルの検証テスト
  - 無効なデータの拒否テスト
  - _要件: 10.2_

### 11. OpenAI API統合の実装

- [x] 11.1 OpenAIServiceクラスの実装
  - `services/openai_service.py`を作成
  - generate_npc_response関数（ChatGPT API呼び出し）
  - generate_speech関数（TTS API呼び出し）
  - transcribe_audio関数（Whisper API呼び出し）
  - _要件: 8.4, 8.10, 8.13_

- [x] 11.2 ゲームロジックサービスの実装
  - `services/game_logic.py`を作成
  - build_npc_prompt関数（プロンプト構築）
  - parse_ai_response関数（AI応答のパース）
  - _要件: 2.2, 10.3, 10.4_

- [ ]* 11.3 OpenAI統合のユニットテスト
  - モックを使用したAPI呼び出しテスト
  - プロンプト構築ロジックのテスト
  - 応答パースのテスト
  - _要件: 10.1, 10.5_

### 12. REST APIエンドポイントの実装

- [x] 12.1 FastAPIアプリケーションの作成
  - `main.py`にFastAPIアプリケーションを実装
  - CORS設定
  - ヘルスチェックエンドポイント
  - _要件: 11.1_

- [x] 12.2 チャットエンドポイントの実装
  - `api/chat.py`にPOST /api/chatエンドポイントを実装
  - リクエスト検証、OpenAIService呼び出し、応答返却
  - エラーハンドリングとリトライロジック
  - _要件: 2.2, 10.1, 10.2, 10.3, 10.4_

- [x] 12.3 TTSエンドポイントの実装
  - `api/tts.py`にPOST /api/ttsエンドポイントを実装
  - 音声データのストリーミング返却
  - エラーハンドリング
  - _要件: 8.10, 8.13_

- [x] 12.4 STTエンドポイントの実装
  - `api/stt.py`にPOST /api/sttエンドポイントを実装
  - 音声ファイルのアップロード処理
  - Whisper API呼び出し
  - エラーハンドリング
  - _要件: 8.4_

- [ ]* 12.5 APIエンドポイントのテスト
  - 各エンドポイントの統合テスト
  - エラーケースのテスト
  - _要件: 10.1, 10.5_

### 13. フロントエンドAPIクライアントの実装

- [x] 13.1 APIクライアントクラスの実装
  - `lib/apiClient.ts`にAPIClientクラスを実装
  - sendMessage, textToSpeech, speechToTextメソッド
  - リトライロジックとタイムアウト処理
  - フォールバック応答
  - _要件: 2.2, 8.4, 8.10_

- [x] 13.2 GameStateContextのAPI統合
  - 静的応答からAPI呼び出しへの切り替え
  - SEND_MESSAGEアクション内でAPIClientを使用
  - _要件: 2.2, 11.2_

- [ ]* 13.3 APIクライアントのテスト
  - モックを使用したAPI呼び出しテスト
  - エラーハンドリングのテスト
  - フォールバック動作のテスト
  - _要件: 2.2_

### 14. 音声機能の実装

- [x] 14.1 音声認識フックの実装
  - `hooks/useSpeechRecognition.ts`を作成
  - MediaRecorder APIを使用した音声録音
  - APIClientを使用した音声認識
  - エラーハンドリング（ブラウザ非対応、マイクアクセス拒否）
  - _要件: 8.3, 8.4, 8.5, 8.9_

- [x] 14.2 音声合成フックの実装
  - `hooks/useTextToSpeech.ts`を作成
  - APIClientを使用した音声合成
  - 音声再生の制御
  - オン/オフトグル機能
  - _要件: 8.10, 8.11, 8.12, 8.13_

- [x] 14.3 AudioInterfaceコンポーネントの機能実装
  - useSpeechRecognitionとuseTextToSpeechフックの統合
  - マイクボタンの録音機能実装
  - スピーカートグルの音声出力制御実装
  - 音声処理状態の表示
  - _要件: 8.3, 8.4, 8.5, 8.9, 8.10, 8.11, 8.12_

- [ ]* 14.4 音声機能のテスト
  - 音声録音のテスト（モック使用）
  - 音声再生のテスト（モック使用）
  - エラーハンドリングのテスト
  - _要件: 8.4, 8.9, 8.11_

### 15. プロパティベーステストの実装

- [ ]* 15.1 fast-checkのセットアップ
  - fast-checkとTypeScript型定義をインストール
  - テスト設定ファイルを作成

- [ ]* 15.2 Property 2-13のプロパティベーステスト実装
  - **Property 2: ゲーム初期化の正確性** - 検証要件: 1.2
  - **Property 3: ゴール到達時のゲーム完了** - 検証要件: 1.4
  - **Property 4: Map UIの完全なレンダリング** - 検証要件: 1.5, 6.3, 6.5
  - **Property 5: 単語レベル入力の受け入れ** - 検証要件: 2.3
  - **Property 6: スロット更新の伝播** - 検証要件: 2.6
  - **Property 7: 正しい選択によるState遷移** - 検証要件: 3.4
  - **Property 8: Information Noteの完全な表示** - 検証要件: 7.1, 7.3
  - **Property 9: State遷移後の状態保持** - 検証要件: 7.4
  - **Property 10: 会話履歴の完全性** - 検証要件: 8.1, 8.6, 8.7
  - **Property 11: NPCResponse構造の完全性** - 検証要件: 10.2, 10.3

### 16. チェックポイント - Phase 2完了確認

- [x] 16.1 統合テストの実施
  - AI NPCとの会話フローのテスト
  - 音声入力・出力のテスト
  - エラーハンドリングのテスト
  - すべてのプロパティベーステストの実行

- [x] 16.2 Phase 2完了確認
  - すべてのテストが通過することを確認
  - ユーザーに質問があれば確認

### 17. Phase 2改善 - Information Note UX改善

- [x] 17.1 スロット情報の段階的表示
  - InformationNoteコンポーネントを修正
  - 未収集のスロットは「???」として表示
  - 収集済みのスロットのみラベルと値を表示
  - 自然な会話学習を促進するUX改善
  - _要件: 7.1, 7.3_

### 18. Phase 2改善 - ゲームフロー修正

- [x] 18.1 正しいゲームルートの実装
  - バックエンドのstate定義を修正
  - 正しいルート: 空港 → 地下鉄(city-transit) → Battery Park → フェリー → 自由の女神
  - 各stateのrequired_slotsをフロントエンドと同期
  - AIプロンプトに正しいパスガイダンスを追加
  - _要件: 1.1, 2.1, 3.4_

### 19. Phase 2改善 - 移動選択肢の制御強化

- [x] 19.1 スロット完全性チェックの実装
  - AIプロンプトに全スロット埋まるまで移動選択肢を出さない指示を追加
  - `validate_slots_complete()` 関数をバックエンドに実装
  - チャットエンドポイントでスロット完全性を検証
  - スロットが未完了の場合は移動選択肢を自動削除
  - _要件: 2.6, 3.4, 7.1_

- [x] 19.2 移動選択肢の検証強化
  - 現在のstateに戻る選択肢を防ぐ検証を追加
  - AIプロンプトに「CRITICAL MOVEMENT OPTION RULES」セクションを追加
  - 各stateに`slot_guidance`を追加（AIが正しい値を誘導）
  - バックエンドで不正な移動選択肢を検出してログ出力
  - _要件: 3.4, 10.3_

### 20. Phase 2改善 - チャットUIの固定レイアウト

- [x] 20.1 チャットエリアの固定高さ実装
  - ゲームページの右パネルに固定高さ（700px）を設定
  - ChatUIコンポーネントをflexboxで構造化
  - メッセージリストのみスクロール可能に変更
  - ヘッダーと入力フォームを固定位置に配置
  - _要件: 8.1, 8.2, 11.4_

- [x] 20.2 レイアウトの最適化
  - `overflow-hidden`でコンテナ全体のスクロールを防止
  - `min-h-0`でflexboxの高さ計算を修正
  - Information NoteとMapUIが常に見える位置に固定
  - 会話が長くなってもページ全体が伸びないように改善
  - _要件: 6.1, 7.1, 11.4_

## 注意事項

- `*`マークの付いたタスクはオプションであり、より速いMVP実装のためにスキップ可能です
- 各タスクは前のタスクに基づいて構築されるため、順番に実行してください
- チェックポイントタスクでは、進捗を確認し、問題があれば修正してください
- プロパティベーステストは、システムの正確性を検証するための重要な要素です
- Phase 1完了後、Phase 2に進む前にユーザーと確認してください

## 将来の拡張タスク（未着手）

### 21. UI改善 - ビジュアルデザインの強化

- [ ] 21.1 各シーンの挿絵・背景画像の追加
  - 各State（空港、地下鉄、Battery Park、フェリー、自由の女神）に対応した画像を用意
  - チャットエリアの背景またはサイドパネルに表示
  - ユーザーが現在地を視覚的に把握できるようにする

- [ ] 21.2 全体UIのビジュアルリデザイン
  - 現在の殺風景なUIをよりユーザーフレンドリーなデザインに刷新
  - NPCキャラクターのアバター表示
  - アニメーションやトランジション効果の追加
  - モバイル対応レイアウトの改善

### 22. 学習フィードバック機能

- [ ] 22.1 ゴール到達後の学習レビュー画面
  - ゴール到達後に会話履歴を振り返る画面を実装
  - 「あの時AIはこう言っていた」という学習の起点となる機能
  - 使用した単語・フレーズのハイライト表示

- [ ] 22.2 DBの導入（学習履歴の永続化）
  - 会話履歴をDBに保存する仕組みの設計・実装
  - ユーザーセッションの管理
  - 過去のプレイ履歴の参照機能
  - ※ DBが必要になるため、実装コストが高い

### 23. シナリオの拡張

- [ ] 23.1 シナリオ追加の仕組み整備
  - 新しいシナリオを追加しやすいデータ構造の整備
  - シナリオ選択画面の実装

- [ ] 23.2 新シナリオの追加
  - 自由の女神以外の観光地シナリオを追加
  - 例: ロンドン（ビッグベン）、パリ（エッフェル塔）、東京（浅草）など
  - 各シナリオに対応したNPC・スロット定義
