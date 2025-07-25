# 03. UI・UX 要件

## 🎨 デザイン原則

### デザインフィロソフィー

**「効率性と直感性の両立」**

1. **シンプルな複雑性**: 高機能でありながら直感的な操作性
2. **情報の階層化**: 重要な情報を優先的に表示
3. **一貫性**: 全画面で統一されたデザイン言語
4. **レスポンシブ**: あらゆるデバイスで最適な体験
5. **アクセシビリティ**: 誰もが使いやすいユニバーサルデザイン

### UI ライブラリ・フレームワーク

**Radix UI ベースのモダン UI システム**:

- **コンポーネントライブラリ**: Radix UI（アクセシブルな基盤コンポーネント）
- **アイコンシステム**: Lucide React（統一されたアイコンセット）
- **ユーティリティ CSS**: Tailwind CSS（レスポンシブ・カスタマイザブル）
- **スタイリング**: class-variance-authority（バリアント管理）
- **テーマシステム**: next-themes（ダーク・ライトモード対応）

### カラーパレット

**プライマリカラー**:

- **メインブルー**: #2563EB（信頼性、知性を表現）
- **アクセントグリーン**: #10B981（成功、改善を表現）
- **ワーニングオレンジ**: #F59E0B（注意、重要を表現）

**セカンダリカラー**:

- **ダークグレー**: #1F2937（テキスト、背景）
- **ライトグレー**: #F9FAFB（背景、ボーダー）
- **ホワイト**: #FFFFFF（基本背景）

### タイポグラフィ

- **フォントファミリー**: Inter, 'Noto Sans JP', sans-serif
- **見出し**: 24px-32px, font-weight: 600-700
- **本文**: 14px-16px, font-weight: 400-500
- **キャプション**: 12px-14px, font-weight: 400

---

## 📱 画面設計詳細

### 1. トップページ（ダッシュボード）

#### 1.1 レイアウト構成

```
┌─────────────────────────────────────────────────┐
│ ヘッダー（検索バー、ユーザーメニュー）                   │
├─────────────────────────────────────────────────┤
│ サイドバー │ メインコンテンツエリア                    │
│ ┌─────────┐ │ ┌─────────────────────────────────┐ │
│ │ナビ     │ │ │ 統計カード                     │ │
│ │メニュー  │ │ ├─────────────────────────────────┤ │
│ │フィルター │ │ │ タブナビゲーション               │ │
│ │        │ │ ├─────────────────────────────────┤ │
│ │        │ │ │ プロンプトカード一覧             │ │
│ └─────────┘ │ └─────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**実装状況**: ✅ 完全実装済み

- ヘッダー、サイドバー、ダッシュボードの基本レイアウト
- Radix UI Sidebar コンポーネントによる実装
- レスポンシブ対応済み

#### 1.2 ヘッダーコンポーネント

**実装状況**: ✅ 完全実装済み

**左側エリア**:

- ✅ ハンバーガーメニューボタン（サイドバー展開・収束）
- ✅ 検索バー（Input コンポーネント使用）
  - プレースホルダー: "プロンプトを検索..."
  - 右側：ショートカットキー表示（⌘K）
  - **実装詳細**: Search、Command アイコンを使用

**右側エリア**:

- ✅ 新規作成ボタン（Plus アイコン、Button コンポーネント）
- ✅ 通知ドロップダウン（DropdownMenu 使用）
  - Bell アイコン
  - 未読通知数 Badge 表示
  - 通知一覧とアクション機能
- ✅ ユーザーアバター（Avatar コンポーネント）
  - DropdownMenu でプロフィール、設定、ログアウト
  - AvatarImage, AvatarFallback 実装済み

#### 1.3 サイドバーコンポーネント

**実装状況**: ✅ 完全実装済み（Radix UI Sidebar 使用）

**レスポンシブ動作**:

- ✅ 展開時：幅 256px (w-64)
- ✅ 収束時：幅 64px (w-16)
- ✅ スムーズなアニメーション遷移（300ms）
- ✅ モバイル対応：Sheet コンポーネントによる全画面オーバーレイ

**ヘッダーセクション**:

- ✅ アプリ名表示「PromptHub」（展開時のみ）
- ✅ ボーダー区切り線

**メインナビゲーション**: ✅ 実装済み

- 🏠 ダッシュボード
- 📝 マイプロンプト（Badge：243）
- ⭐ お気に入り（Badge：12）
- 🧩 テンプレート（Badge：8）
- 👥 共有・チーム（Badge：3）
- 🏆 コミュニティ
- 📊 統計・分析
- ⚙️ 設定

#### 1.4 ダッシュボードメインエリア

**実装状況**: ✅ 完全実装済み

**統計カードセクション**: ✅ 実装済み

```
┌─────────────────────────────────────────────────┐
│ [総プロンプト数] [平均評価] [今月の使用数] [改善率] │
│   📝 243        ⭐ 4.2     👁 1,847    📈 23%  │
│   +12          +0.3      +234        +5%      │
└─────────────────────────────────────────────────┘
```

- ✅ Card コンポーネントを使用した統計表示
- ✅ アイコン（FileText, Star, Eye, TrendingUp）
- ✅ 前期比較表示（変化量と色分け）

**タブナビゲーション**: ✅ 実装済み（Tabs コンポーネント使用）

- ✅ すべて / お気に入り / 最近使用 / 高評価 / カテゴリ別
- ✅ アクティブタブのビジュアル強調

**表示切り替え・操作エリア**: ✅ 実装済み

- ✅ グリッド・リスト表示切り替えボタン（Grid3X3, List アイコン）
- ✅ ソート順ドロップダウン（最新、人気、評価順）
- ✅ フィルターボタン（Filter アイコン）
- ✅ 新規作成ボタン（Plus アイコン）
- ✅ インポートボタン（Upload アイコン）

**プロンプトカード一覧**: ✅ 実装済み

- ✅ レスポンシブグリッド表示
- ✅ PromptCard コンポーネント実装
- ✅ カードホバー時のインタラクション効果

### 2. プロンプトエディター（ダイアログ）

#### 2.1 ダイアログ構成

**実装状況**: ✅ 完全実装済み（Radix UI Dialog 使用）

**モーダルダイアログ**:

- ✅ 全画面オーバーレイ（DialogOverlay）
- ✅ 中央配置、レスポンシブなサイズ調整
- ✅ 外部クリックまたは Esc キーで閉じる
- ✅ フォーカストラップ機能

#### 2.2 タブ構成

**実装状況**: ✅ 完全実装済み（Tabs コンポーネント使用）

**メインタブ**:

1. ✅ **📝 エディター**: プロンプト本文作成・編集
2. ✅ **🔍 プレビュー**: リアルタイムプレビュー表示
3. ✅ **💡 AI 提案**: 改善提案とオプティマイゼーション
4. ✅ **📊 分析**: プロンプト構造の分析

#### 2.3 エディターバブ

**実装状況**: ✅ 完全実装済み

**基本情報セクション**:

- ✅ **タイトル**: Input コンポーネント（必須入力）
- ✅ **説明**: Textarea コンポーネント（複数行）
- ✅ **カテゴリ**: Badge コンポーネントでの選択表示
- ✅ **タグ**: マルチセレクト対応（Badge + X ボタン）

**メインエディター**:

- ✅ 大きな Textarea（自動高さ調整）
- ✅ 文字数カウンター表示
- ✅ 変数ハイライト対応準備
- ✅ プロンプト構成要素の表示

**プロンプト構成要素パネル**: ✅ 実装済み

- ✅ 役割・タスク（例：専門家として振る舞う）
- ✅ 背景・文脈（例：マーケティング資料作成の場面で）
- ✅ 指示・目標（例：魅力的な商品説明を作成してください）
- ✅ 制約・条件（例：200 文字以内で簡潔に）
- ✅ 出力形式（例：タイトル、説明、特徴の順番で）
- ✅ 例示（例：商品名「○○」→「魅力的な ○○ で...」）

#### 2.4 アクション群

**実装状況**: ✅ 完全実装済み

**主要アクション**:

- ✅ 💾 保存ボタン（Button - primary variant）
- ✅ ▶️ テスト実行ボタン（Button - secondary variant）
- ✅ ✨ AI 改善提案ボタン（Sparkles アイコン）
- ✅ 👁 プレビューボタン（Eye アイコン）
- ✅ ❌ キャンセル・閉じるボタン（X アイコン）

### 3. プロンプトカード詳細設計

#### 3.1 カード構成要素

**実装状況**: ✅ 完全実装済み（PromptCard コンポーネント）

**カードヘッダー**: ✅ 実装済み

- ✅ プロンプトタイトル（font-semibold, text-lg）
- ✅ カテゴリ Badge（色分け対応）
- ✅ 公開ステータス Badge（"公開" Badge）
- ✅ DropdownMenu（MoreHorizontal アイコン）
  - 編集（Edit アイコン）
  - 複製（Copy アイコン）
  - 削除（Trash2 アイコン）
  - 共有（Share2 アイコン）

**カードコンテンツ**: ✅ 実装済み

- ✅ 説明文（line-clamp-3 で省略表示）
- ✅ カテゴリ Badge（色分けシステム）
  - 文章生成: bg-blue-100 text-blue-800
  - 画像生成: bg-green-100 text-green-800
  - コード生成: bg-purple-100 text-purple-800
  - 分析・要約: bg-orange-100 text-orange-800
  - 翻訳: bg-red-100 text-red-800
  - アイデア出し: bg-yellow-100 text-yellow-800
- ✅ タグ群（Badge 形式、最大表示数制限）

**カードフッター**: ✅ 実装済み

- ✅ 評価スコア（Star アイコン + 数値）
- ✅ 統計情報
  - 👁 閲覧数（Eye + viewCount）
  - ❤️ いいね数（Heart + likeCount）
  - 🔄 使用数（usageCount）
- ✅ 作成者情報（Avatar + 名前）
- ✅ 更新日時（Calendar アイコン + 相対時間）

#### 3.2 インタラクション

**実装状況**: ✅ 完全実装済み

**ホバー効果**: ✅ 実装済み

- ✅ カード全体の影効果（hover:shadow-lg）
- ✅ ボーダー色変化（hover 時 border-blue-300）
- ✅ アクションボタンの表示状態変化

**クリック動作**: ✅ 実装済み

- ✅ カード本体クリック：詳細表示・編集
- ✅ アクションボタン：各種操作（onEdit, onDelete, onRun, onToggleFavorite, onShare）
- ✅ お気に入り切り替え（Heart アイコン、状態管理）
  │ カテゴリ | タグ | 評価 | 使用回数 │
  ├─────────────────────────────────────────┤
  │ プロンプト本文（編集可能） │
  │ ┌─────────────────────────────────────┐ │
  │ │ │ │
  │ │ │ │
  │ └─────────────────────────────────────┘ │
  └─────────────────────────────────────────┘

```

#### 2.2 機能タブ
**タブ構成**:
1. **実行・テスト**: AIとの連携実行
2. **結果履歴**: 過去の実行結果と評価
3. **バージョン**: 変更履歴とバージョン管理
4. **改善提案**: AI支援による改善案
5. **要素分解**: プロンプト構造の分析

#### 2.3 実行・テストタブ
**AIモデル選択**:
- ドロップダウンでモデル選択
- パラメータ設定（temperature等）
- APIキー設定状況表示

**実行ボタン**:
- 大きな実行ボタン
- 実行中のローディング表示
- 推定コスト表示

**結果表示エリア**:
- レスポンシブな結果表示
- 結果のコピー・保存機能
- 即座の評価入力

### 3. 新規プロンプト作成画面

#### 3.1 作成フロー
```

ステップ 1: 基本情報入力
↓
ステップ 2: プロンプト本文作成
↓
ステップ 3: 分類・タグ設定
↓
ステップ 4: プレビュー・保存

```

#### 3.2 プロンプト入力エリア
**メインエディタ**:
- 大きなテキストエリア（可変高さ）
- シンタックスハイライト（変数等）
- 文字数カウント
- リアルタイムプレビュー

**サイドパネル**:
- AI改善提案（リアルタイム）
- 類似プロンプト検索
- 要素分解プレビュー
- テンプレート化提案

#### 3.3 AI支援機能
**リアルタイム提案**:
- 入力に応じた改善案表示
- ワンクリック適用
- 提案理由の説明
- 提案の履歴管理

### 4. テンプレート管理画面

#### 4.1 テンプレート一覧
**表示形式**:
- カード形式（デフォルト）
- テーブル形式
- 詳細リスト形式

**カード要素**:
- テンプレート名
- 変数数
- 使用回数
- 最終更新日
- 公開/非公開ステータス

#### 4.2 テンプレート作成・編集
**変数定義エリア**:
```

┌─────────────────────────────────────────┐
│ 変数一覧 │
│ ┌─────────┬─────────┬─────────┬───────┐ │
│ │ 変数名 │ 型 │ 必須 │ 操作 │ │
│ ├─────────┼─────────┼─────────┼───────┤ │
│ │{{name}} │ 文字列 │✓ │ 編集削除 │ │
│ │{{date}} │ 日付 │ │ 編集削除 │ │
│ └─────────┴─────────┴─────────┴───────┘ │
│ [+ 変数追加] │
└─────────────────────────────────────────┘

```

#### 4.3 テンプレート使用画面
**変数入力フォーム**:
- 変数に応じた適切な入力フィールド
- バリデーション機能
- デフォルト値の表示
- 入力例の提示

**プレビューエリア**:
- リアルタイムプレビュー
- 生成されるプロンプトの表示
- 文字数・複雑さの表示

### 5. 共有・コミュニティ画面

#### 5.1 公開プロンプトギャラリー
**フィルタリング**:
- カテゴリ別
- 人気順・新着順・評価順
- タグによる絞り込み
- 作成者によるフィルタ

**プロンプトカード**:
```

┌─────────────────────────────────────────┐
│ [タイトル] ⭐4.8 ❤️123 👁️1.2k │
│ 説明文... │
│ #タグ 1 #タグ 2 #タグ 3 │
│ by @username | 3 日前 │
│ [試す] [複製] [いいね] [シェア] │
└─────────────────────────────────────────┘

```

#### 5.2 フォーラム機能
**ディスカッション表示**:
- スレッド形式
- 投票機能（いいね・よくない）
- 返信機能
- ベストアンサー選択

**投稿エディタ**:
- リッチテキストエディタ
- プロンプトの埋め込み
- 画像・ファイル添付
- プレビュー機能

### 6. 統計・分析画面

#### 6.1 ダッシュボード
**KPIカード**:
```

┌─────────────┬─────────────┬─────────────┐
│ 総プロンプト数 │ 平均評価 │ 今月の使用数 │
│ 243 │ 4.2 │ 1,847 │
│ ↑ 12 │ ↑ 0.3 │ ↑ 234 │
└─────────────┴─────────────┴─────────────┘

```

#### 6.2 チャート・グラフ
**使用傾向グラフ**:
- 時系列での使用状況
- カテゴリ別使用分布
- 評価スコアの推移
- インタラクティブなチャート

**パフォーマンス分析**:
- プロンプト品質ヒートマップ
- 改善効果の可視化
- A/Bテスト結果の比較

---

## 🎯 UXパターン

### 1. オンボーディング

#### 1.1 初回ユーザー体験
**ウェルカムフロー**:
1. **アカウント作成**:
   - シンプルなサインアップフォーム
   - ソーシャルログイン対応
   - メールアドレス確認

2. **プロフィール設定**:
   - 基本情報入力
   - 使用目的の選択
   - 興味のあるカテゴリ選択

3. **チュートリアル**:
   - インタラクティブなツアー
   - 主要機能の説明
   - サンプルプロンプトでの実習

4. **最初のプロンプト作成**:
   - ガイド付きプロンプト作成
   - テンプレートからの選択
   - 作成完了の達成感演出

#### 1.2 段階的機能開放
**プログレッシブディスクロージャー**:
- 基本機能から開始
- 使用状況に応じて高度な機能を提案
- 機能発見のタイミング最適化

### 2. 効率的なワークフロー

#### 2.1 キーボードファースト設計
**ショートカット体系**:
- `Ctrl/Cmd + N`: 新規プロンプト作成
- `Ctrl/Cmd + /`: 検索フォーカス
- `Ctrl/Cmd + S`: 保存
- `Ctrl/Cmd + Enter`: 実行
- `Esc`: モーダル閉じる

#### 2.2 コンテキストメニュー
**右クリックメニュー**:
- プロンプトカード: 編集、複製、削除、共有
- テキスト選択: コピー、テンプレート化、改善提案
- 空白エリア: 新規作成、ペースト

#### 2.3 ドラッグ&ドロップ
**対応操作**:
- プロンプトのカテゴリ間移動
- ファイルのインポート
- 要素の並び替え
- お気に入りへの追加

### 3. フィードバックとガイダンス

#### 3.1 インラインヘルプ
**ヘルプ表示**:
- ツールチップによる説明
- 疑問符アイコンでの詳細説明
- コンテキスト別ヘルプ
- 動画チュートリアル埋め込み

#### 3.2 エラーハンドリング
**エラー表示パターン**:
- インライン検証（リアルタイム）
- フォーム送信時の統合エラー
- API通信エラーの明確な説明
- 復旧方法の提示

#### 3.3 成功フィードバック
**ポジティブフィードバック**:
- 操作完了の即座通知
- プログレスインジケーター
- 達成感のあるアニメーション
- 統計での成長可視化

### 4. レスポンシブデザイン

#### 4.1 ブレイクポイント
- **モバイル**: ~768px
- **タブレット**: 768px~1024px
- **デスクトップ**: 1024px~
- **大画面**: 1400px~

#### 4.2 モバイル固有の配慮
**モバイル最適化**:
- タッチフレンドリーなボタンサイズ（44px以上）
- スワイプジェスチャー対応
- 縦画面での効率的レイアウト
- 親指での操作範囲考慮

#### 4.3 タブレット体験
**タブレット特化機能**:
- 分割画面での並列作業
- Apple Pencil / スタイラス対応
- キーボードショートカット対応
- ランドスケープモード最適化

---

## ♿ アクセシビリティ要件

### 1. WCAG 2.1 AA準拠

#### 1.1 知覚可能性
**カラーとコントラスト**:
- 色のみに依存しない情報伝達
- テキストコントラスト比4.5:1以上
- 大きなテキストは3:1以上
- カラーブラインド対応

**代替テキスト**:
- 画像の適切なalt属性
- アイコンの意味説明
- グラフ・チャートのテキスト説明

#### 1.2 操作可能性
**キーボードアクセス**:
- 全機能のキーボード操作対応
- 論理的なTab順序
- フォーカスインジケーター
- キーボードトラップの回避

**時間制限**:
- 自動更新の制御機能
- セッションタイムアウト警告
- 時間延長オプション

---

## 🧩 UIコンポーネント仕様

### 基盤コンポーネント（Radix UI） - ✅ 全て実装済み

#### Button - ✅ 実装済み
- **バリアント**: default, destructive, outline, secondary, ghost, link
- **サイズ**: default, sm, lg, icon
- **状態**: enabled, disabled, loading
- **実装**: class-variance-authority でバリアント管理
- **アイコン対応**: Lucide React アイコンとの組み合わせ対応

#### Input - ✅ 実装済み
- **タイプ**: text, email, password, number, search
- **状態**: default, error, disabled, focus
- **サイズ**: default, sm, lg
- **実装**: forwardRef対応、Tailwind CSSスタイリング

#### Card - ✅ 実装済み
- **構成**: CardHeader, CardTitle, CardContent, CardFooter
- **レイアウト**: グリッド対応、レスポンシブ
- **スタイル**: ボーダー、影効果、ホバー状態
- **使用箇所**: PromptCard, 統計カード

#### Dialog - ✅ 実装済み
- **構成**: DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
- **機能**: オーバーレイ、フォーカストラップ、Escキー対応
- **実装**: Radix UI Dialog primitive使用
- **使用箇所**: PromptEditor

#### Dropdown Menu - ✅ 実装済み
- **構成**: DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator
- **機能**: キーボードナビゲーション、位置調整
- **使用箇所**: ヘッダーメニュー、プロンプトカードアクション

#### Tabs - ✅ 実装済み
- **構成**: TabsList, TabsTrigger, TabsContent
- **レイアウト**: 水平配置（デフォルト）
- **状態**: アクティブ、非アクティブの視覚的区別
- **使用箇所**: Dashboard、PromptEditor

#### Badge - ✅ 実装済み
- **バリアント**: default, secondary, destructive, outline
- **サイズ**: default, sm, lg
- **用途**: ステータス表示、カウンター、カテゴリラベル
- **カラー**: カテゴリ別色分けシステム対応

#### Avatar - ✅ 実装済み
- **構成**: AvatarImage, AvatarFallback
- **機能**: 画像フォールバック、イニシャル生成
- **サイズ**: sm, default, lg
- **使用箇所**: ヘッダー、プロンプトカード作成者表示

#### ScrollArea - ✅ 実装済み
- **機能**: カスタムスクロールバー
- **レスポンシブ**: モバイル対応
- **使用箇所**: サイドバー、長いコンテンツ表示

#### Separator - ✅ 実装済み
- **方向**: 水平、垂直
- **スタイル**: 細線スタイル
- **使用箇所**: DropdownMenu区切り、レイアウト区切り

### アプリケーション固有コンポーネント - ✅ 実装済み

#### Sidebar Component - ✅ 実装済み
- **実装**: Radix UI Sidebar primitive使用
- **機能**:
  - 展開・収束アニメーション
  - レスポンシブ対応（モバイル時Sheet使用）
  - キーボードショートカット（⌘+B）
  - 状態保持（Cookie）
- **構成**: SidebarProvider, SidebarContent, SidebarMenu等

#### PromptCard - ✅ 実装済み
- **データ構造**: 詳細なプロンプト情報対応
- **インタラクション**: ホバー効果、アクション実行
- **状態管理**: お気に入り、公開状態等

#### PromptEditor - ✅ 実装済み
- **タブ構成**: エディター、プレビュー、AI提案、分析
- **フォーム管理**: 状態管理とバリデーション
- **プロンプト構成要素**: 役割、背景、指示等のガイド

#### ImageWithFallback - ✅ 実装済み
- **機能**: Next.js Image コンポーネント使用
- **フォールバック**: エラー時の代替表示

### 特殊コンポーネント - 部分実装・今後実装予定

#### Search Suggestions - 🚧 部分実装
- **現在の実装**: 基本的な検索入力フィールド
- **予定機能**:
  - フォーカス時のドロップダウン
  - 履歴表示、オートコンプリート
  - キーボード操作（矢印キー、Enter選択）

#### Notification System - ✅ 基本実装済み
- **実装済み**: 通知ドロップダウン、Badge表示
- **機能**: 未読管理、通知リスト表示
- **今後**: リアルタイム更新、アクション実行

#### Statistics Cards - ✅ 実装済み
- **データ表示**: 数値、変化率、アイコン
- **実装**: Card コンポーネントベース
- **今後**: カウントアップアニメーション効果

#### Filter Panel - ✅ 実装済み
- **構成**: アコーディオン形式のフィルター群
- **機能**: カテゴリ・タグフィルター、展開・収束
- **UI**: Badge、Button、アイコン使用

#### 1.3 理解可能性
**明確な情報構造**:
- 適切な見出し階層
- ランドマークの使用
- 一貫したナビゲーション
- エラーメッセージの明確化

#### 1.4 堅牢性
**技術的堅牢性**:
- セマンティックHTML使用
- ARIA属性の適切な使用
- スクリーンリーダー対応
- 各種支援技術との互換性

### 2. 多言語対応

#### 2.1 国際化（i18n）
**対応言語**:
- 日本語（プライマリー）
- 英語
- 中国語（簡体字）
- 韓国語

**考慮事項**:
- 右から左（RTL）言語対応準備
- 文字数変動への対応
- 日付・数値フォーマット
- 文化的配慮

### 3. パフォーマンス配慮

#### 3.1 読み込み時間
**パフォーマンス目標**:
- 初回ページ読み込み: 3秒以内
- ページ遷移: 1秒以内
- API応答: 500ms以内
- 画像読み込み: 2秒以内

#### 3.2 最適化手法
**技術的最適化**:
- 画像の遅延読み込み
- コード分割
- CDN活用
- キャッシュ戦略

---

## 🔧 UI技術要件

### 1. 使用ライブラリ・フレームワーク

#### 1.1 メインフレームワーク
- **React 18+**: メインUIライブラリ
- **Next.js 14+**: フルスタックフレームワーク
- **TypeScript**: 型安全性

#### 1.2 UIライブラリ・コンポーネント
- **shadcn/ui**: ベースコンポーネント
- **Tailwind CSS**: スタイリング
- **Radix UI**: アクセシブルなプリミティブ
- **Framer Motion**: アニメーション

#### 1.3 機能特化ライブラリ
- **Monaco Editor**: コードエディタ（プロンプト編集）
- **React Hook Form**: フォーム管理
- **React Query**: データフェッチング
- **Zustand**: 状態管理

### 2. デザインシステム

#### 2.1 コンポーネント体系
**アトミックデザイン採用**:
- **Atoms**: Button, Input, Icon等
- **Molecules**: SearchBox, Card等
- **Organisms**: Header, Sidebar等
- **Templates**: PageLayout等
- **Pages**: 各画面コンポーネント

#### 2.2 スタイルガイド
**設計トークン**:
- カラーパレット
- タイポグラフィスケール
- スペーシングシステム
- シャドウとエフェクト
- ボーダーとradius

### 3. インタラクション設計

#### 3.1 マイクロインタラクション
**詳細設計**:
- ボタンホバー効果
- フォーム入力フィードバック
- ローディングアニメーション
- 成功・エラー表示
- ページ遷移効果

#### 3.2 レスポンシブパターン
**レイアウトパターン**:
- サイドバー折りたたみ
- モバイルナビゲーション
- テーブルの横スクロール
- モーダルの画面サイズ対応
```
