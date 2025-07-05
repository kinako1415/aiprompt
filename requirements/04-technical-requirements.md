# 04. 技術要件

## 🏗️ システムアーキテクチャ

### 全体アーキテクチャ図
```
┌─────────────────────────────────────────────────────────┐
│                    フロントエンド層                        │
│        Next.js 15 + React 19 + TypeScript 5             │
│     ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│     │  Radix UI   │ │ Tailwind CSS│ │ Lucide Icons│     │
│     │Components   │ │  Styling    │ │   System    │     │
│     └─────────────┘ └─────────────┘ └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                            │
                         API
                            │
┌─────────────────────────────────────────────────────────┐
│                   バックエンド層                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│  │   API GW    │ │  Auth サー  │ │  AI サー    │     │
│  │             │ │   ビス      │ │  ビス       │     │
│  └─────────────┘ └─────────────┘ └─────────────┘     │
│                 Node.js/FastAPI                       │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                    データ層                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│  │ PostgreSQL  │ │   Redis     │ │ File Storage│     │
│  │ (Primary)   │ │  (Cache)    │ │   (S3)      │     │
│  └─────────────┘ └─────────────┘ └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                  外部サービス層                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│  │ OpenAI API  │ │ Claude API  │ │ Other AI    │     │
│  └─────────────┘ └─────────────┘ └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## 💻 技術スタック詳細

### 1. フロントエンド技術（実装済み）

#### 1.1 コアテクノロジー
| 技術 | バージョン | 役割 | 実装状況 |
|------|-----------|------|----------|
| **React** | 19.0.0 | UIライブラリ | ✅ 実装済み |
| **Next.js** | 15.3.5 | フルスタックフレームワーク | ✅ 実装済み |
| **TypeScript** | 5.x | 型システム | ✅ 実装済み |
| **Tailwind CSS** | 4.x | CSSフレームワーク | ✅ 実装済み |

#### 1.2 UI・UXライブラリ（実装済み）
| ライブラリ | バージョン | 用途 | 実装状況 |
|-----------|-----------|------|----------|
| **Radix UI** | 1.2+ | アクセシブルなプリミティブ | ✅ 全コンポーネント導入済み |
| **Lucide React** | 0.525.0 | アイコンシステム | ✅ 実装済み |
| **class-variance-authority** | 0.7.1 | バリアント管理 | ✅ 実装済み |
| **tailwind-merge** | 3.3.1 | スタイリング最適化 | ✅ 実装済み |
| **next-themes** | 0.4.6 | テーマシステム | ✅ 実装済み |

#### 1.3 フォーム・入力系ライブラリ
| ライブラリ | バージョン | 用途 | 実装状況 |
|-----------|-----------|------|----------|
| **React Hook Form** | 7.60.0 | フォーム管理 | ✅ 実装済み |
| **@hookform/resolvers** | 5.1.1 | バリデーション | ✅ 実装済み |
| **react-day-picker** | 9.8.0 | 日付ピッカー | ✅ 実装済み |
| **input-otp** | 1.4.2 | OTP入力 | ✅ 実装済み |

#### 1.4 追加UIライブラリ
| ライブラリ | バージョン | 用途 | 実装状況 |
|-----------|-----------|------|----------|
| **embla-carousel-react** | 8.6.0 | カルーセル | ✅ 実装済み |
| **cmdk** | 1.1.1 | コマンドパレット | ✅ 実装済み |
| **sonner** | 2.0.6 | トースト通知 | ✅ 実装済み |
| **vaul** | 1.1.2 | ドロワー・モーダル | ✅ 実装済み |
| **react-resizable-panels** | 3.0.3 | リサイザブルパネル | ✅ 実装済み |

#### 1.5 実装済みUIコンポーネント
**基盤コンポーネント（shadcn/ui + Radix UI）** - ✅ 全て実装済み:
- ✅ Accordion, AlertDialog, Alert, AspectRatio
- ✅ Avatar, Badge, Button, Calendar
- ✅ Card, Carousel, Checkbox, Collapsible  
- ✅ Command, ContextMenu, Dialog, Drawer
- ✅ DropdownMenu, HoverCard, Input, InputOTP
- ✅ Label, Menubar, NavigationMenu, Pagination
- ✅ Popover, Progress, RadioGroup, ResizablePanels
- ✅ ScrollArea, Select, Separator, Sheet
- ✅ Sidebar (Radix UI), Skeleton, Slider, Switch
- ✅ Table, Tabs, Textarea, Toast, Toggle
- ✅ Tooltip, Typography

**アプリケーションコンポーネント** - ✅ 実装済み:
- ✅ Header（検索、通知、ユーザーメニュー）
- ✅ Sidebar（ナビゲーション、カテゴリ・タグフィルター）  
- ✅ Dashboard（統計カード、タブナビゲーション、プロンプト一覧）
- ✅ PromptCard（詳細情報表示、インタラクション、ドロップダウンメニュー）
- ✅ PromptEditor（タブ切り替え、フォーム管理、プロンプト構成要素ガイド）
- ✅ ImageWithFallback（Next.js Image + フォールバック）

**実装完了度**: 95% - UI層ほぼ完成
**残課題**: 
- 🚧 検索機能の詳細実装（オートコンプリート、検索候補）
- 🚧 無限スクロール実装
- 🚧 リアルタイム通知システム

#### 1.6 開発・ビルドツール
```json
{
  "devDependencies": {
    "eslint": "^9",
    "eslint-config-next": "15.3.5",
    "@eslint/eslintrc": "^3",
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4"
  }
}
```

### 2. バックエンド技術

#### 2.1 API開発オプション

**オプション1: Node.js + Express**
```javascript
// 技術スタック
{
  "runtime": "Node.js 20+",
  "framework": "Express.js 4.18+",
  "orm": "Prisma 5.0+",
  "validation": "Zod",
  "auth": "NextAuth.js",
  "testing": "Jest + Supertest"
}
```

**オプション2: Python + FastAPI**
```python
# 技術スタック
{
  "runtime": "Python 3.11+",
  "framework": "FastAPI 0.104+",
  "orm": "SQLAlchemy 2.0+",
  "validation": "Pydantic",
  "auth": "FastAPI-Users",
  "testing": "pytest + httpx"
}
```

**推奨選択: Node.js**
- フロントエンドとの言語統一
- TypeScript共通化
- Vercelとの親和性
- 豊富なライブラリエコシステム

#### 2.2 API設計パターン
**RESTful API + GraphQL ハイブリッド**:
- **REST**: CRUD操作、ファイルアップロード
- **GraphQL**: 複雑なクエリ、リアルタイム更新
- **WebSocket**: リアルタイム通知、共同編集

#### 2.3 認証・認可
```typescript
// NextAuth.js設定例
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      // メール・パスワード認証
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  // JWT設定、セッション管理等
}
```

### 3. データベース設計

#### 3.1 プライマリDB: PostgreSQL
**選定理由**:
- JSON型サポート（プロンプト内容、メタデータ）
- 全文検索機能
- ACID特性
- スケーラビリティ

**バージョン**: PostgreSQL 15+

#### 3.2 キャッシュ層: Redis
**用途**:
- セッション管理
- API応答キャッシュ
- リアルタイム機能
- 一時データ保存

**設定例**:
```yaml
redis:
  maxmemory: 1gb
  maxmemory-policy: allkeys-lru
  appendonly: yes
  appendfsync: everysec
```

#### 3.3 ファイルストレージ
**AWS S3 (または互換サービス)**:
- プロンプト添付ファイル
- AI出力画像
- エクスポートファイル
- バックアップデータ

### 4. AI・外部サービス連携

#### 4.1 サポートAIサービス
| サービス | API | 用途 |
|----------|-----|------|
| **OpenAI** | GPT-4, GPT-3.5, DALL-E | テキスト・画像生成 |
| **Anthropic** | Claude 3 | テキスト生成 |
| **Google** | Gemini Pro | テキスト生成 |
| **Stability AI** | Stable Diffusion | 画像生成 |

#### 4.2 API統一化レイヤー
```typescript
interface AIProvider {
  generateText(prompt: string, options: TextGenerationOptions): Promise<TextResponse>
  generateImage(prompt: string, options: ImageGenerationOptions): Promise<ImageResponse>
  analyzePrompt(prompt: string): Promise<AnalysisResponse>
}

class OpenAIProvider implements AIProvider {
  async generateText(prompt: string, options: TextGenerationOptions) {
    // OpenAI API実装
  }
}

class ClaudeProvider implements AIProvider {
  async generateText(prompt: string, options: TextGenerationOptions) {
    // Claude API実装
  }
}
```

#### 4.3 レート制限・コスト管理
```typescript
interface RateLimiter {
  checkLimit(userId: string, apiType: string): Promise<boolean>
  updateUsage(userId: string, apiType: string, cost: number): Promise<void>
  getUserUsage(userId: string, period: string): Promise<UsageReport>
}
```

---

## 🚀 性能要件

### 1. レスポンス時間目標

| 操作 | 目標時間 | 許容時間 |
|------|----------|----------|
| ページ初期読み込み | 2秒以内 | 3秒以内 |
| ページ遷移 | 500ms以内 | 1秒以内 |
| 検索結果表示 | 300ms以内 | 500ms以内 |
| プロンプト保存 | 200ms以内 | 500ms以内 |
| AI API実行 | 5秒以内 | 10秒以内 |

### 2. スケーラビリティ要件

#### 2.1 同時接続数
- **初期目標**: 100同時接続
- **スケール目標**: 1,000同時接続
- **最大目標**: 10,000同時接続

#### 2.2 データ容量
- **初期**: 10GB
- **1年後**: 100GB
- **3年後**: 1TB

#### 2.3 トラフィック
- **初期**: 1,000 req/min
- **1年後**: 10,000 req/min
- **3年後**: 100,000 req/min

### 3. 可用性要件

#### 3.1 稼働率目標
- **サービス可用性**: 99.9%（年間8.77時間以下のダウンタイム）
- **計画メンテナンス**: 月1回、1時間以内
- **障害復旧時間**: 30分以内

#### 3.2 障害対応
- **監視**: 24/7自動監視
- **アラート**: 1分以内に通知
- **復旧**: 自動フェイルオーバー

---

## 🔒 セキュリティ要件

### 1. 認証・認可

#### 1.1 認証方式
```typescript
enum AuthMethod {
  EMAIL_PASSWORD = "email_password",
  GOOGLE_OAUTH = "google_oauth",
  GITHUB_OAUTH = "github_oauth",
  MICROSOFT_OAUTH = "microsoft_oauth",
  TWO_FACTOR = "two_factor"
}
```

#### 1.2 認可レベル
```typescript
enum Permission {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
  ADMIN = "admin",
  SHARE = "share"
}

interface UserRole {
  id: string
  name: string
  permissions: Permission[]
}
```

### 2. データ保護

#### 2.1 暗号化
- **転送時**: TLS 1.3
- **保存時**: AES-256
- **データベース**: 透過的データ暗号化（TDE）
- **API通信**: HTTPS必須

#### 2.2 個人情報保護
- **GDPR準拠**: EU一般データ保護規則
- **CCPA準拠**: カリフォルニア州消費者プライバシー法
- **個人情報取扱い**: 日本の個人情報保護法準拠

### 3. セキュリティ対策

#### 3.1 脆弱性対策
```yaml
security_measures:
  - SQL injection prevention (Parameterized queries)
  - XSS protection (Content Security Policy)
  - CSRF protection (SameSite cookies)
  - Rate limiting (API throttling)
  - Input validation (Schema validation)
  - Output sanitization (HTML escaping)
```

#### 3.2 監査・ログ
```typescript
interface AuditLog {
  userId: string
  action: string
  resource: string
  timestamp: Date
  ipAddress: string
  userAgent: string
  result: "success" | "failure"
  details?: Record<string, any>
}
```

---

## 🏗️ インフラ・デプロイ

### 1. ホスティング戦略

#### 1.1 フロントエンド
**Vercel (推奨)**:
- Next.js最適化
- グローバルCDN
- 自動スケーリング
- プレビューデプロイ

**代替案**:
- Netlify
- AWS Amplify
- Firebase Hosting

#### 1.2 バックエンド
**Railway/Render (開発・小規模)**:
- 簡単デプロイ
- コスト効率
- PostgreSQL内蔵

**AWS/GCP (本格運用)**:
- ECS/Cloud Run
- RDS/Cloud SQL
- ElastiCache/Memorystore

### 2. CI/CD パイプライン

#### 2.1 GitHub Actions設定
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run e2e

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

#### 2.2 デプロイ戦略
- **ブルーグリーンデプロイ**: ゼロダウンタイム
- **カナリアリリース**: 段階的ロールアウト
- **ロールバック**: 即座の前バージョン復帰

### 3. 監視・分析

#### 3.1 アプリケーション監視
```typescript
// Sentry設定例
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
})
```

#### 3.2 パフォーマンス監視
- **Core Web Vitals**: LCP, FID, CLS
- **カスタムメトリクス**: API応答時間、エラー率
- **ユーザーエクスペリエンス**: セッション記録、ヒートマップ

#### 3.3 分析ツール
- **Google Analytics 4**: ユーザー行動分析
- **Mixpanel**: イベント追跡
- **LogRocket**: セッション再生

---

## 🧪 テスト戦略

### 1. テストピラミッド

```
       E2E Tests
      /           \
   Integration Tests
  /                 \
Unit Tests           Component Tests
```

#### 1.1 単体テスト (70%)
```typescript
// Jest + Testing Library
import { render, screen } from '@testing-library/react'
import { PromptCard } from './PromptCard'

describe('PromptCard', () => {
  it('displays prompt title and description', () => {
    const prompt = {
      title: 'Test Prompt',
      description: 'Test Description'
    }
    
    render(<PromptCard prompt={prompt} />)
    
    expect(screen.getByText('Test Prompt')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })
})
```

#### 1.2 結合テスト (20%)
```typescript
// API統合テスト
import { testClient } from './test-utils'

describe('Prompt API', () => {
  it('creates a new prompt', async () => {
    const response = await testClient.post('/api/prompts', {
      title: 'Test Prompt',
      content: 'Test content'
    })
    
    expect(response.status).toBe(201)
    expect(response.data.id).toBeDefined()
  })
})
```

#### 1.3 E2Eテスト (10%)
```typescript
// Cypress
describe('Prompt Management', () => {
  it('creates, edits, and deletes a prompt', () => {
    cy.visit('/prompts')
    cy.get('[data-testid="new-prompt-btn"]').click()
    cy.get('[data-testid="prompt-title"]').type('My Test Prompt')
    cy.get('[data-testid="prompt-content"]').type('This is a test prompt')
    cy.get('[data-testid="save-btn"]').click()
    
    cy.contains('My Test Prompt').should('be.visible')
  })
})
```

### 2. テストデータ管理

#### 2.1 テストフィクスチャ
```typescript
export const mockPrompts = [
  {
    id: '1',
    title: 'Code Review Prompt',
    content: 'Please review this code...',
    category: 'development',
    tags: ['code', 'review'],
    rating: 4.5
  },
  // ...more test data
]
```

#### 2.2 MSW (Mock Service Worker)
```typescript
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/prompts', (req, res, ctx) => {
    return res(ctx.json(mockPrompts))
  }),
  
  rest.post('/api/prompts', (req, res, ctx) => {
    return res(ctx.json({ id: '123', ...req.body }))
  })
]
```

---

## 📊 開発環境・ツール

### 1. 開発環境セットアップ

#### 1.1 必要なツール
```bash
# Node.js環境
node --version  # 20.0.0+
npm --version   # 10.0.0+

# 開発ツール
git --version
docker --version
```

#### 1.2 環境構築スクリプト
```bash
#!/bin/bash
# setup.sh

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local

# データベースセットアップ
npx prisma generate
npx prisma db push

# 開発サーバー起動
npm run dev
```

### 2. 開発ワークフロー

#### 2.1 Git戦略
```
main (production)
├── develop (staging)
│   ├── feature/prompt-editing
│   ├── feature/ai-integration
│   └── hotfix/urgent-bug
```

#### 2.2 プルリクエストフロー
1. **ブランチ作成**: `feature/descriptive-name`
2. **コード実装**: 機能開発
3. **テスト**: 自動テスト実行
4. **プルリクエスト**: レビュー依頼
5. **コードレビュー**: 品質チェック
6. **マージ**: developブランチへマージ

### 3. コード品質管理

#### 3.1 ESLint設定
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error",
    "no-console": "warn"
  }
}
```

#### 3.2 Prettier設定
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

#### 3.3 Husky設定
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
```
