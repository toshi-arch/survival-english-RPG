# 要件定義書

## 導入

サバイバル英語ロールプレイゲームは、英語初心者向けのインタラクティブな学習体験を提供するWebアプリケーションです。文法の正確さよりも「伝わること」と「目的達成」を重視し、単語レベルの英語でも目的地にたどり着けるゲーム体験を実現します。ユーザーは明確な目的地（例：空港から自由の女神）を目指し、マップ上を進行しながら、AI NPCとの会話を通じて必要な情報を収集します。

## 用語集

- **Game_System**: サバイバル英語ロールプレイゲーム全体のシステム
- **User**: ゲームをプレイする英語学習者
- **AI_NPC**: AIが演じる親切な現地人またはスタッフ
- **State**: マップ上の特定の地点または状況
- **Required_Slot**: 次のStateに進むために必要な情報項目（destination, transport, landmarkなど）
- **Information_Note**: 会話で得た情報を記録する自動メモ機能
- **Map_UI**: 現在地と進行状況を視覚的に表示するインターフェース
- **Chat_UI**: AI_NPCとの会話を行うインターフェース
- **Voice_Input**: マイクを使用した音声による入力機能
- **Speech_Recognition**: 音声をテキストに変換する機能
- **Audio_Interface**: 音声入力とテキスト入力の両方をサポートする会話インターフェース
- **Text-to-Speech**: テキストを音声に変換する機能（TTS）
- **Voice_Output**: AI_NPCの応答を音声で出力する機能
- **Voice_Mode**: 音声入力と音声出力の両方を使用する会話モード
- **Penalty_System**: 誤った選択に対するフィードバック機構
- **Movement_Option**: Userが選択可能な移動先の選択肢
- **Scenario**: 特定の出発地とゴールを持つゲームストーリー（例：JFK空港から自由の女神）

## 要件

### 要件1: ステートベースのマップ進行

**ユーザーストーリー:** ユーザーとして、マップ上の異なる場所を進んでいきたい。そうすることで、旅をベースにした学習アドベンチャーを体験できるから。

#### 受け入れ基準

1. THE Game_System SHALL Scenario毎に少なくとも5つのStateを定義する
2. WHEN Scenarioが開始される、THE Game_System SHALL Userの現在のStateを開始地点に設定する
3. THE Game_System SHALL 各ScenarioのゴールとなるStateを定義する
4. WHEN UserがゴールのStateに到達する、THE Game_System SHALL Scenarioを完了する
5. THE Map_UI SHALL すべてのStateを表示し、Userの現在のStateを示す

### 要件2: 会話を通じた情報収集

**ユーザーストーリー:** ユーザーとして、AI NPCとの会話を通じて必要な情報を集めたい。そうすることで、進行に必要なことを学べるから。

#### 受け入れ基準

1. THE Game_System SHALL 各State遷移のためのRequired_Slotを定義する
2. WHEN UserがStateに入る、THE AI_NPC SHALL UserがRequired_Slotを発見できるよう会話を行う
3. THE AI_NPC SHALL Userからのブロークン英語や単語のみの応答を受け入れる
4. WHEN Userの意図が不明確である、THE AI_NPC SHALL Yes/No質問または選択肢を提供する
5. THE AI_NPC SHALL ロールプレイ会話中に文法を訂正しない
6. THE Information_Note SHALL 会話を通じて得られた情報を自動的に記録する

### 要件3: 移動決定システム

**ユーザーストーリー:** ユーザーとして、収集した情報に基づいて移動を決定したい。そうすることで、会話で学んだことを応用できるから。

#### 受け入れ基準

1. WHEN Userが情報を収集した、THE Game_System SHALL Movement_Optionを提示する
2. THE Game_System SHALL 正しいMovement_Optionと誤ったMovement_Optionの両方を含める
3. WHEN UserがMovement_Optionを選択する、THE AI_NPC SHALL 最終確認を行う
4. WHEN すべてのRequired_Slotが正しく埋められている、THE Game_System SHALL 次のStateへの遷移を許可する
5. WHEN Required_Slotが不完全または誤っている、THE Game_System SHALL エラーStateに遷移するかPenalty_Systemを適用する

### 要件4: 初心者に優しいAI NPCの振る舞い

**ユーザーストーリー:** ユーザーとして、親切で忍耐強いAI NPCと対話したい。そうすることで、自分のレベルで英語を練習することに安心感を持てるから。

#### 受け入れ基準

1. THE AI_NPC SHALL Userが英語初心者であると想定する
2. THE AI_NPC SHALL 親切な現地住民またはスタッフとしてロールプレイする
3. THE AI_NPC SHALL ブロークン英語やサバイバル英語に対して親切に応答する
4. WHEN Userが単語やフレーズを使用する、THE AI_NPC SHALL 意図を解釈し適切に応答する
5. THE AI_NPC SHALL ゲームプレイ中にキャラクターを破って言語指導を提供しない

### 要件5: 誤った選択に対するペナルティシステム

**ユーザーストーリー:** ユーザーとして、間違いを犯したときに意味のあるフィードバックを受けたい。そうすることで、即座にゲームオーバーにならずにエラーから学べるから。

#### 受け入れ基準

1. WHEN Userが誤った移動決定を行う、THE Penalty_System SHALL 結果を適用する
2. THE Penalty_System SHALL ライフ減少、時間減少、ヒント減少、またはNPCの態度変化のうち少なくとも1つのペナルティタイプをサポートする
3. THE Game_System SHALL 1回の間違いの後に即座にゲームを終了しない
4. WHEN ペナルティが適用される、THE Game_System SHALL Userにフィードバックを提供する
5. WHEN ペナルティ条件が終了状態に達する、THE Game_System SHALL Scenarioを終了する

### 要件6: ビジュアルマップインターフェース

**ユーザーストーリー:** ユーザーとして、マップ上で現在地と利用可能な目的地を見たい。そうすることで、進捗と選択肢を理解できるから。

#### 受け入れ基準

1. THE Map_UI SHALL 現在のScenarioのすべてのStateを表示する
2. THE Map_UI SHALL Userの現在のStateを視覚的に強調表示する
3. THE Map_UI SHALL ゴールのStateを示す
4. WHEN Userが情報を収集する、THE Map_UI SHALL 進捗を反映して更新する
5. THE Map_UI SHALL 利用可能な場合にMovement_Optionを表示する

### 要件7: 情報メモの表示

**ユーザーストーリー:** ユーザーとして、収集した情報を見たい。そうすることで、決定を下すときに参照できるから。

#### 受け入れ基準

1. THE Information_Note SHALL 現在のStateのすべてのRequired_Slotを表示する
2. WHEN Userが会話を通じて情報を得る、THE Information_Note SHALL 自動的に更新する
3. THE Information_Note SHALL どのRequired_Slotが埋まっていてどれが空かを視覚的に示す
4. THE Information_Note SHALL Scenario内のState遷移を通じて情報を保持する
5. THE Information_Note SHALL Chat_UIと並んで表示される

### 要件8: 会話のためのチャットインターフェース

**ユーザーストーリー:** ユーザーとして、AI NPCとコミュニケーションするための明確なチャットインターフェースが欲しい。そうすることで、自然に英会話を練習できるから。

#### 受け入れ基準

1. THE Chat_UI SHALL UserとAI_NPC間の会話履歴を表示する
2. THE Chat_UI SHALL Userがメッセージを入力するためのテキスト入力フィールドを提供する
3. THE Audio_Interface SHALL Userがマイクを使用して音声入力を行うための機能を提供する
4. WHEN Userが音声入力を開始する、THE Speech_Recognition SHALL 音声をテキストに変換する
5. THE Audio_Interface SHALL 音声入力とテキスト入力の切り替えを可能にする
6. WHEN Userがメッセージを送信する、THE Chat_UI SHALL それを会話履歴に表示する
7. WHEN AI_NPCが応答する、THE Chat_UI SHALL 応答を会話履歴に表示する
8. THE Chat_UI SHALL リアルタイムのメッセージ交換をサポートする
9. WHEN Speech_Recognitionが音声を処理している、THE Audio_Interface SHALL 処理状態を視覚的に示す
10. THE Voice_Output SHALL AI_NPCの応答をText-to-Speechで音声に変換する機能を提供する
11. WHEN UserがVoice_Modeを使用している、THE Voice_Output SHALL AI_NPCの応答を自動的に音声で再生する
12. THE Audio_Interface SHALL Voice_Outputのオン/オフを切り替える機能を提供する
13. WHEN Voice_Outputがオンである、THE Text-to-Speech SHALL AI_NPCの応答テキストを音声に変換して再生する

### 要件9: 自由の女神シナリオの実装

**ユーザーストーリー:** ユーザーとして、JFK空港から自由の女神までのシナリオをプレイしたい。そうすることで、完全なゲームの旅を体験できるから。

#### 受け入れ基準

1. THE Game_System SHALL 開始State「Airport Lobby」とゴールState「Statue of Liberty」を持つScenarioを実装する
2. THE Scenario SHALL 正確に5つのStateを含む：Airport Lobby、City Transit、Battery Park Area、Ferry Terminal、およびWrong Place
3. THE Game_System SHALL Scenario内の各State遷移のためのRequired_Slotを定義する
4. WHEN Userが自由の女神Scenarioを完了する、THE Game_System SHALL 成功を示す
5. THE Wrong Place State SHALL 情報不足のためのエラーStateとして機能する

### 要件10: JSONベースのAI応答フォーマット

**ユーザーストーリー:** 開発者として、構造化されたJSON形式でAI応答を受け取りたい。そうすることで、ゲーム状態の更新を確実に解析および処理できるから。

#### 受け入れ基準

1. THE AI_NPC SHALL 有効なJSON形式で応答を返す
2. THE JSON応答 SHALL 最低限以下を含む：NPCの対話テキストと収集された情報の更新
3. WHEN Required_Slotが更新される、THE JSON応答 SHALL どのスロットが埋められたかを示す
4. WHEN State遷移が可能である、THE JSON応答 SHALL 利用可能なMovement_Optionを示す
5. THE Game_System SHALL 処理前にJSON応答を検証する

### 要件11: フェーズ1の静的プロトタイプ実装

**ユーザーストーリー:** 開発者として、固定応答を持つフロントエンドのみのプロトタイプを構築したい。そうすることで、AIを統合する前にUI/UXを検証できるから。

#### 受け入れ基準

1. THE Game_System SHALL Next.jsを使用してChat_UI、Map_UI、およびInformation_Noteを実装する
2. WHERE フェーズ1がアクティブである、THE Game_System SHALL AIの代わりに事前定義された静的応答を使用する
3. THE 静的プロトタイプ SHALL 自由の女神Scenarioを通じた完全な進行を実証する
4. THE 静的プロトタイプ SHALL すべてのUIコンポーネントが連携して動作することを実証する
5. THE 静的プロトタイプ SHALL ユーザーエクスペリエンスフローの手動テストを可能にする

