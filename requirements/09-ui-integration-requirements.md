# UI統合・ページ設計要件

## 🎯 概要

このドキュメントでは、PromptHubアプリケーションのUIコンポーネント統合とページベースの設計要件について定義します。画像で示されたUIデザインに基づき、Next.js App Routerを使用したモダンなページ構成を実装します。

## 📁 ページ構成・ルーティング設計

### 1. アプリケーション構造

```
frontend/src/app/
├── layout.tsx              # ルートレイアウト（メインレイアウト統合）
├── page.tsx                # ホームページ（/dashboard にリダイレクト）
├── dashboard/              # ダッシュボードページ
│   └── page.tsx
├── my-prompts/             # マイプロンプトページ  
│   └── page.tsx
├── favorites/              # お気に入りページ
│   └── page.tsx
├── templates/              # テンプレートページ
│   └── page.tsx
├── shared/                 # 共有・チームページ
│   └── page.tsx
├── community/              # コミュニティページ
│   └── page.tsx
├── analytics/              # 統計・分析ページ
│   └── page.tsx
└── settings/               # 設定ページ
    └── page.tsx
```

### 2. レイアウト統合設計

#### 2.1 RootLayout (`app/layout.tsx`)
**実装状況**: ✅ 完全実装済み

**構成要素**:
- StoreProvider: Redux状態管理プロバイダー
- MainLayout: 共通レイアウトコンポーネント
- 全ページ共通のメタデータ設定
- Geistフォント設定

#### 2.2 MainLayout (`components/MainLayout.tsx`)
**実装状況**: ✅ 完全実装済み

**レイアウト構造**:
```
┌─────────────────────────────────────────────────┐
│ Header（固定ヘッダー、高さ64px）                   │
├─────────────────────────────────────────────────┤
│ Sidebar │ Main Content Area                     │
│ (可変幅) │ (フレックス拡張)                        │
│ 256px   │                                       │
│ ↕       │ ページコンテンツ                        │
│ 64px    │ (スクロール可能)                        │
│ (縮小時)  │                                       │
└─────────────────────────────────────────────────┘
```

**機能**:
- ヘッダー・サイドバートグル管理
- プロンプトエディターモーダル管理
- レスポンシブデザイン対応

## 🎨 ページ別設計要件

### 3. ダッシュボードページ (`/dashboard`)

**実装状況**: ✅ 完全実装済み

**主要コンポーネント**:
- 統計カード（4種類）: プロンプト数、平均評価、使用数、改善率
- クイックアクション: 新規作成、テンプレート使用、インポート、AIアシスタント
- タブナビゲーション: すべて、お気に入り、最近使用、高評価、カテゴリ別
- プロンプト一覧: グリッド・リスト表示切り替え、フィルター機能

### 4. マイプロンプトページ (`/my-prompts`)

**実装状況**: ✅ 新規実装済み

**主要機能**:
- プロンプト管理: 作成、編集、削除、公開設定
- 統計情報: 総数、公開数、いいね数、平均評価
- 検索・フィルター: テキスト検索、カテゴリ、公開状態、下書き
- 表示オプション: グリッド・リスト、ソート機能
- タブ分類: すべて、公開中、非公開、下書き、お気に入り

**ページ固有UI要素**:
```tsx
// 統計カード例
<Card>
  <CardHeader>
    <CardTitle>総プロンプト数</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">243</div>
    <p className="text-xs text-green-600">+12 今月</p>
  </CardContent>
</Card>
```

### 5. お気に入りページ (`/favorites`)

**実装状況**: ✅ 新規実装済み

**主要機能**:
- お気に入りプロンプト一覧表示
- 統計情報: お気に入り数、平均評価、最近追加数
- フィルター: テキスト検索、最近追加、カテゴリ別
- 空状態: お気に入りがない場合のガイダンス

### 6. テンプレートページ (`/templates`)

**実装状況**: ✅ 新規実装済み

**主要機能**:
- テンプレートライブラリ表示
- テンプレート情報: タイトル、説明、変数、使用回数、評価
- 統計情報: 総テンプレート数、人気テンプレート、使用回数、平均評価
- テンプレート操作: プレビュー、コピー、使用、作成
- フィルター: 人気、最新、カテゴリ別

**テンプレートカード設計**:
```tsx
// テンプレートカード構成
<Card>
  <CardHeader>
    <Puzzle icon />
    <Title + 人気バッジ />
    <Description />
    <Category + Tags />
    <Variables />
  </CardHeader>
  <CardContent>
    <Statistics (使用回数、評価) />
    <Actions (プレビュー、コピー、使用) />
  </CardContent>
</Card>
```

## 🔗 ナビゲーション・ルーティング要件

### 7. サイドバーナビゲーション

**実装状況**: ✅ 更新実装済み

**新機能**:
- Next.js `useRouter` 統合ナビゲーション
- `usePathname` による現在ページハイライト
- 動的なアクティブ状態管理

**メニュー構成**:
```tsx
const menuItems = [
  { icon: Home, label: "ダッシュボード", href: "/dashboard" },
  { icon: FileText, label: "マイプロンプト", href: "/my-prompts", badge: 243 },
  { icon: Star, label: "お気に入り", href: "/favorites", badge: 12 },
  { icon: Puzzle, label: "テンプレート", href: "/templates", badge: 8 },
  { icon: Users, label: "共有・チーム", href: "/shared", badge: 3 },
  { icon: Trophy, label: "コミュニティ", href: "/community" },
  { icon: BarChart3, label: "統計・分析", href: "/analytics" },
  { icon: Settings, label: "設定", href: "/settings" }
];
```

### 8. ルーティング設計

**ルーティング仕様**:
- `/` → `/dashboard` (自動リダイレクト)
- `/dashboard` → ダッシュボードページ
- `/my-prompts` → マイプロンプト管理ページ
- `/favorites` → お気に入り一覧ページ
- `/templates` → テンプレートライブラリページ
- その他の計画されたページへの準備

## 🎯 UI統合の設計原則

### 9. 共通設計パターン

#### 9.1 ページ構造パターン
```tsx
// 標準ページ構造
export default function PageComponent() {
  return (
    <div className="p-6 space-y-6">
      {/* ページヘッダー */}
      <PageHeader />
      
      {/* 統計情報セクション */}
      <StatsCards />
      
      {/* メインコンテンツカード */}
      <Card>
        <CardHeader>
          <SearchAndFilters />
        </CardHeader>
        <CardContent>
          <TabsNavigation />
          <ContentGrid />
        </CardContent>
      </Card>
    </div>
  );
}
```

#### 9.2 共通UI要素
- **統計カード**: 4カラムグリッド、数値・変化率・説明表示
- **検索・フィルター**: 検索入力・ソート・フィルター・表示切り替え
- **タブナビゲーション**: コンテンツ分類とカウント表示
- **アクションボタン**: 新規作成・インポート・エクスポート等

#### 9.3 レスポンシブ設計
- **デスクトップ**: サイドバー展開（256px）
- **タブレット**: サイドバー縮小（64px）
- **モバイル**: サイドバーオーバーレイ（Sheet UI）

## ✅ 実装完了項目

### 完全実装済み（2024年1月時点）
- [x] ルートレイアウト設計
- [x] MainLayout コンポーネント統合
- [x] ダッシュボードページ（既存）
- [x] マイプロンプトページ（新規）
- [x] お気に入りページ（新規）
- [x] テンプレートページ（新規）
- [x] サイドバーナビゲーション更新
- [x] ページ間ルーティング機能
- [x] レスポンシブレイアウト対応

### 今後の実装予定
- [ ] 共有・チームページ
- [ ] コミュニティページ
- [ ] 統計・分析ページ
- [ ] 設定ページ
- [ ] APIデータ統合
- [ ] ユーザー認証統合
- [ ] リアルタイム機能追加

## 🔧 技術要件

### 使用技術スタック
- **フレームワーク**: Next.js 15 (App Router)
- **UIライブラリ**: Radix UI + Tailwind CSS
- **アイコン**: Lucide React
- **状態管理**: Redux Toolkit + RTK Query
- **型安全性**: TypeScript 5

### パフォーマンス要件
- **ページ遷移**: 100ms以下の応答性
- **レイアウト安定性**: CLS (Cumulative Layout Shift) 最小化
- **メモリ効率**: コンポーネント最適化とメモ化
- **バンドルサイズ**: 動的インポートによる最適化

---

この要件に基づき、PromptHubアプリケーションは統合されたUI体験と効率的なページベースナビゲーションを提供します。
