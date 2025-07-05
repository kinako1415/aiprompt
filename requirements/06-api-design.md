# 06. API設計

## 🛠️ API設計概要

### アーキテクチャパターン
**RESTful API + GraphQL ハイブリッド設計**

- **REST API**: CRUD操作、ファイルアップロード、認証等の基本機能
- **GraphQL**: 複雑なクエリ、リアルタイム更新、柔軟なデータ取得
- **WebSocket**: リアルタイム通知、共同編集機能

### API バージョニング戦略
- **URL パス**: `/api/v1/`, `/api/v2/`
- **ヘッダー**: `API-Version: 1.0`
- **後方互換性**: 最低2バージョンのサポート

---

## 🔗 REST API エンドポイント

### 1. 認証・ユーザー管理

#### 1.1 認証エンドポイント
```typescript
// POST /api/v1/auth/register
interface RegisterRequest {
  email: string
  password: string
  username?: string
  display_name?: string
}

interface RegisterResponse {
  user: User
  access_token: string
  refresh_token: string
}

// POST /api/v1/auth/login
interface LoginRequest {
  email: string
  password: string
  remember_me?: boolean
}

interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
  expires_in: number
}

// POST /api/v1/auth/refresh
interface RefreshRequest {
  refresh_token: string
}

interface RefreshResponse {
  access_token: string
  expires_in: number
}

// POST /api/v1/auth/logout
interface LogoutRequest {
  refresh_token: string
}
```

#### 1.2 OAuth認証
```typescript
// GET /api/v1/auth/oauth/{provider}
// プロバイダー: google, github, microsoft

// GET /api/v1/auth/oauth/{provider}/callback
interface OAuthCallbackResponse {
  user: User
  access_token: string
  refresh_token: string
  is_new_user: boolean
}
```

#### 1.3 ユーザー管理
```typescript
// GET /api/v1/users/me
interface UserProfileResponse {
  id: string
  email: string
  username: string
  display_name: string
  avatar_url: string
  bio: string
  plan_type: 'free' | 'pro' | 'enterprise'
  created_at: string
  settings: UserSettings
}

// PUT /api/v1/users/me
interface UpdateProfileRequest {
  username?: string
  display_name?: string
  bio?: string
  avatar_url?: string
  settings?: Partial<UserSettings>
}

// GET /api/v1/users/me/usage
interface UsageResponse {
  current_period: {
    start_date: string
    end_date: string
    api_calls: number
    api_limit: number
    cost_usd: number
  }
  historical: UsageHistory[]
}
```

### 2. プロンプト管理

#### 2.1 プロンプト CRUD
```typescript
// GET /api/v1/prompts
interface GetPromptsQuery {
  page?: number
  per_page?: number
  category?: string
  tags?: string[] // タグのスラッグ配列
  search?: string
  sort?: 'created_at' | 'updated_at' | 'rating' | 'usage_count'
  order?: 'asc' | 'desc'
  visibility?: 'private' | 'team' | 'public'
  user_id?: string
}

interface GetPromptsResponse {
  prompts: Prompt[]
  pagination: {
    total: number
    page: number
    per_page: number
    total_pages: number
  }
  filters: {
    categories: Category[]
    tags: Tag[]
  }
}

// GET /api/v1/prompts/{id}
interface GetPromptResponse {
  prompt: Prompt
  versions: PromptVersion[]
  results: PromptResult[]
  related_prompts: Prompt[]
  can_edit: boolean
  can_delete: boolean
}

// POST /api/v1/prompts
interface CreatePromptRequest {
  title: string
  description?: string
  content: string
  category_id?: string
  tags?: string[]
  target_ai_model?: string
  ai_parameters?: Record<string, any>
  visibility?: 'private' | 'team' | 'public'
  template_id?: string // テンプレートから作成の場合
  template_variables?: Record<string, any>
}

interface CreatePromptResponse {
  prompt: Prompt
  suggestions?: {
    tags: string[]
    category: string
    improvements: string[]
  }
}

// PUT /api/v1/prompts/{id}
interface UpdatePromptRequest {
  title?: string
  description?: string
  content?: string
  category_id?: string
  tags?: string[]
  target_ai_model?: string
  ai_parameters?: Record<string, any>
  visibility?: 'private' | 'team' | 'public'
  change_summary?: string
  change_reason?: string
}

// DELETE /api/v1/prompts/{id}
interface DeletePromptResponse {
  success: boolean
  message: string
}
```

#### 2.2 プロンプト実行・テスト
```typescript
// POST /api/v1/prompts/{id}/execute
interface ExecutePromptRequest {
  ai_model: string
  parameters?: {
    temperature?: number
    max_tokens?: number
    top_p?: number
    [key: string]: any
  }
  input_variables?: Record<string, any> // テンプレート変数
}

interface ExecutePromptResponse {
  execution_id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: {
    output: string
    metadata?: Record<string, any>
    execution_time_ms: number
    token_usage?: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
    cost_usd?: number
  }
  error?: string
}

// GET /api/v1/prompts/{id}/executions/{execution_id}
interface GetExecutionStatusResponse {
  execution_id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress?: number // 0-100
  result?: ExecutionResult
  error?: string
  estimated_completion_time?: string
}
```

#### 2.3 プロンプト評価
```typescript
// POST /api/v1/prompts/{id}/results/{result_id}/evaluate
interface EvaluateResultRequest {
  overall_rating: number // 1-5
  accuracy_rating?: number
  usefulness_rating?: number
  creativity_rating?: number
  readability_rating?: number
  comment?: string
  is_good?: boolean
  suggested_improvements?: string
}

interface EvaluateResultResponse {
  evaluation: ResultEvaluation
  updated_averages: {
    prompt_rating: number
    user_rating: number
  }
}

// GET /api/v1/prompts/{id}/analytics
interface PromptAnalyticsResponse {
  usage_stats: {
    total_executions: number
    unique_users: number
    success_rate: number
    avg_rating: number
  }
  time_series: {
    daily_usage: Array<{ date: string; count: number }>
    rating_trend: Array<{ date: string; rating: number }>
  }
  ai_model_breakdown: Array<{ model: string; count: number; avg_rating: number }>
}
```

### 3. テンプレート管理

#### 3.1 テンプレート CRUD
```typescript
// GET /api/v1/templates
interface GetTemplatesQuery {
  page?: number
  per_page?: number
  category?: string
  visibility?: 'private' | 'team' | 'public'
  featured?: boolean
  sort?: 'created_at' | 'usage_count' | 'rating'
}

interface GetTemplatesResponse {
  templates: Template[]
  pagination: PaginationInfo
}

// POST /api/v1/templates
interface CreateTemplateRequest {
  name: string
  description?: string
  body: string
  category_id?: string
  variables: TemplateVariable[]
  visibility?: 'private' | 'team' | 'public'
}

// POST /api/v1/templates/{id}/generate
interface GenerateFromTemplateRequest {
  variables: Record<string, any>
  save_as_prompt?: boolean
  prompt_title?: string
}

interface GenerateFromTemplateResponse {
  generated_content: string
  prompt_id?: string // save_as_prompt=trueの場合
  preview_url?: string
}
```

#### 3.2 テンプレート変数自動抽出
```typescript
// POST /api/v1/templates/extract-variables
interface ExtractVariablesRequest {
  content: string
  ai_assist?: boolean // AI支援を使用するか
}

interface ExtractVariablesResponse {
  variables: Array<{
    name: string
    type: 'text' | 'number' | 'date' | 'select'
    positions: Array<{ start: number; end: number }>
    suggested_description?: string
    suggested_default?: any
    confidence?: number // AI提案の確信度
  }>
  suggested_template: string // {{variable}}形式に変換したテンプレート
}
```

### 4. AI統合・改善機能

#### 4.1 AI改善提案
```typescript
// POST /api/v1/ai/analyze-prompt
interface AnalyzePromptRequest {
  content: string
  target_ai_model?: string
  context?: {
    category?: string
    purpose?: string
    target_audience?: string
  }
}

interface AnalyzePromptResponse {
  analysis: {
    clarity_score: number // 0-100
    specificity_score: number
    structure_score: number
    completeness_score: number
    overall_score: number
  }
  suggestions: Array<{
    type: 'structure' | 'clarity' | 'examples' | 'constraints'
    priority: 'high' | 'medium' | 'low'
    description: string
    before?: string
    after?: string
    reasoning: string
  }>
  auto_improvements?: {
    improved_prompt: string
    changes: Array<{
      type: string
      description: string
      position: { start: number; end: number }
    }>
  }
}

// POST /api/v1/ai/generate-prompt
interface GeneratePromptRequest {
  purpose: string
  keywords?: string[]
  target_ai_model?: string
  style?: 'formal' | 'casual' | 'technical' | 'creative'
  length?: 'short' | 'medium' | 'long'
  examples?: string[]
}

interface GeneratePromptResponse {
  generated_prompts: Array<{
    content: string
    confidence: number
    reasoning: string
    estimated_quality: number
  }>
  suggestions: {
    category: string
    tags: string[]
    target_models: string[]
  }
}
```

#### 4.2 A/Bテスト機能
```typescript
// POST /api/v1/experiments
interface CreateExperimentRequest {
  name: string
  description?: string
  hypothesis?: string
  prompt_variants: Array<{
    prompt_id: string
    name: string
    traffic_allocation: number // 0.0-1.0
  }>
  success_metric: 'rating' | 'engagement' | 'custom'
  minimum_sample_size?: number
  confidence_level?: number
  duration_days?: number
}

interface CreateExperimentResponse {
  experiment: Experiment
  estimated_completion: string
  required_executions: number
}

// GET /api/v1/experiments/{id}/results
interface ExperimentResultsResponse {
  experiment: Experiment
  results: {
    status: 'running' | 'completed' | 'inconclusive'
    statistical_significance: boolean
    p_value?: number
    winner?: {
      variant_id: string
      confidence: number
      improvement_percentage: number
    }
    variants: Array<{
      id: string
      name: string
      executions: number
      success_rate: number
      average_rating: number
      confidence_interval: [number, number]
    }>
  }
  recommendations: string[]
}
```

### 5. チーム・コラボレーション

#### 5.1 チーム管理
```typescript
// GET /api/v1/teams
interface GetTeamsResponse {
  teams: Array<{
    id: string
    name: string
    role: 'owner' | 'admin' | 'member' | 'viewer'
    member_count: number
    created_at: string
  }>
}

// POST /api/v1/teams
interface CreateTeamRequest {
  name: string
  description?: string
  is_public?: boolean
  max_members?: number
}

// POST /api/v1/teams/{id}/invite
interface InviteTeamMemberRequest {
  email?: string
  user_id?: string
  role: 'admin' | 'member' | 'viewer'
  message?: string
}

// GET /api/v1/teams/{id}/prompts
interface GetTeamPromptsQuery extends GetPromptsQuery {
  member_id?: string
}
```

#### 5.2 共有・権限管理
```typescript
// POST /api/v1/prompts/{id}/share
interface SharePromptRequest {
  share_type: 'link' | 'team' | 'user'
  recipients?: string[] // user_ids or team_ids
  permissions: {
    read: boolean
    write: boolean
    execute: boolean
    comment: boolean
  }
  expires_at?: string
  message?: string
}

interface SharePromptResponse {
  share_id: string
  share_url?: string
  recipients_notified: number
}

// GET /api/v1/shared/{share_id}
interface GetSharedPromptResponse {
  prompt: Prompt
  permissions: SharePermissions
  shared_by: User
  expires_at?: string
}
```

### 6. 検索・発見

#### 6.1 検索機能
```typescript
// GET /api/v1/search
interface SearchQuery {
  q: string // 検索クエリ
  type?: 'prompts' | 'templates' | 'users' | 'all'
  filters?: {
    category?: string[]
    tags?: string[]
    ai_model?: string[]
    rating_min?: number
    date_range?: {
      start: string
      end: string
    }
    visibility?: string[]
  }
  sort?: 'relevance' | 'rating' | 'popularity' | 'recent'
  page?: number
  per_page?: number
}

interface SearchResponse {
  results: {
    prompts: SearchResult<Prompt>[]
    templates: SearchResult<Template>[]
    users: SearchResult<User>[]
  }
  total_results: number
  search_time_ms: number
  suggestions?: string[]
  filters: {
    available_categories: Category[]
    available_tags: Tag[]
    available_models: string[]
  }
}

interface SearchResult<T> {
  item: T
  score: number
  highlights: {
    title?: string[]
    description?: string[]
    content?: string[]
  }
}
```

#### 6.2 レコメンデーション
```typescript
// GET /api/v1/recommendations/prompts
interface GetRecommendationsQuery {
  based_on?: 'usage' | 'ratings' | 'similar_users' | 'trending'
  limit?: number
  exclude_own?: boolean
}

interface RecommendationsResponse {
  prompts: Array<{
    prompt: Prompt
    reason: string
    confidence: number
    why_recommended: string[]
  }>
  next_update_at: string
}

// GET /api/v1/trending
interface TrendingResponse {
  prompts: Prompt[]
  templates: Template[]
  tags: Tag[]
  period: 'day' | 'week' | 'month'
  generated_at: string
}
```

---

## 🔄 GraphQL API

### スキーマ設計

#### 1. 基本型定義
```graphql
type User {
  id: ID!
  email: String!
  username: String
  displayName: String
  avatarUrl: String
  bio: String
  planType: PlanType!
  createdAt: DateTime!
  
  # リレーション
  prompts(first: Int, after: String, filter: PromptFilter): PromptConnection!
  templates(first: Int, after: String): TemplateConnection!
  teams: [Team!]!
  
  # 統計
  stats: UserStats!
}

type Prompt {
  id: ID!
  title: String!
  description: String
  content: String!
  visibility: Visibility!
  status: PromptStatus!
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # リレーション
  author: User!
  category: Category
  tags: [Tag!]!
  versions: [PromptVersion!]!
  results(first: Int, after: String): PromptResultConnection!
  
  # 統計
  stats: PromptStats!
  
  # 権限
  permissions: PromptPermissions!
}

type PromptResult {
  id: ID!
  prompt: Prompt!
  aiModel: String!
  input: String!
  output: String
  status: ExecutionStatus!
  executionTimeMs: Int
  tokenUsage: TokenUsage
  costUsd: Float
  createdAt: DateTime!
  
  # 評価
  evaluations: [ResultEvaluation!]!
  averageRating: Float
}
```

#### 2. クエリ定義
```graphql
type Query {
  # ユーザー
  me: User
  user(id: ID!): User
  
  # プロンプト
  prompt(id: ID!): Prompt
  prompts(
    first: Int = 20
    after: String
    filter: PromptFilter
    sort: PromptSort
  ): PromptConnection!
  
  # 検索
  search(
    query: String!
    type: SearchType = ALL
    filter: SearchFilter
    first: Int = 20
    after: String
  ): SearchConnection!
  
  # レコメンデーション
  recommendations(
    type: RecommendationType = PERSONALIZED
    limit: Int = 10
  ): [PromptRecommendation!]!
  
  # 統計
  analytics(
    period: AnalyticsPeriod!
    entity: AnalyticsEntity!
    entityId: ID
  ): Analytics!
}
```

#### 3. ミューテーション定義
```graphql
type Mutation {
  # 認証
  login(input: LoginInput!): AuthPayload!
  register(input: RegisterInput!): AuthPayload!
  logout: Boolean!
  
  # プロンプト
  createPrompt(input: CreatePromptInput!): CreatePromptPayload!
  updatePrompt(id: ID!, input: UpdatePromptInput!): UpdatePromptPayload!
  deletePrompt(id: ID!): DeletePromptPayload!
  
  # 実行
  executePrompt(id: ID!, input: ExecutePromptInput!): ExecutePromptPayload!
  
  # 評価
  evaluateResult(
    resultId: ID!
    input: EvaluateResultInput!
  ): EvaluateResultPayload!
  
  # テンプレート
  createTemplate(input: CreateTemplateInput!): CreateTemplatePayload!
  generateFromTemplate(
    id: ID!
    input: GenerateFromTemplateInput!
  ): GenerateFromTemplatePayload!
}
```

#### 4. サブスクリプション定義
```graphql
type Subscription {
  # リアルタイム実行状況
  promptExecution(executionId: ID!): PromptExecutionUpdate!
  
  # 通知
  notifications(userId: ID!): Notification!
  
  # 共同編集
  promptChanges(promptId: ID!): PromptChange!
  
  # チーム活動
  teamActivity(teamId: ID!): TeamActivityUpdate!
}
```

---

## 🌐 WebSocket API

### 1. 接続管理
```typescript
interface WebSocketConnection {
  // 接続初期化
  connect(token: string): Promise<void>
  
  // チャンネル管理
  subscribe(channel: string, params?: Record<string, any>): void
  unsubscribe(channel: string): void
  
  // メッセージ送信
  send(type: string, data: any): void
  
  // イベントリスナー
  on(event: string, handler: (data: any) => void): void
}
```

### 2. チャンネル定義

#### 2.1 通知チャンネル
```typescript
// チャンネル: user.{user_id}.notifications
interface NotificationMessage {
  type: 'notification'
  data: {
    id: string
    type: NotificationType
    title: string
    message: string
    action_url?: string
    created_at: string
  }
}
```

#### 2.2 実行状況チャンネル
```typescript
// チャンネル: execution.{execution_id}
interface ExecutionUpdateMessage {
  type: 'execution_update'
  data: {
    execution_id: string
    status: 'pending' | 'running' | 'completed' | 'failed'
    progress?: number
    partial_result?: string
    estimated_completion?: string
    error?: string
  }
}
```

#### 2.3 共同編集チャンネル
```typescript
// チャンネル: prompt.{prompt_id}.collaboration
interface CollaborationMessage {
  type: 'collaboration'
  data: {
    user_id: string
    user_name: string
    action: 'join' | 'leave' | 'edit' | 'cursor_move'
    content?: {
      position: number
      text?: string
      cursor_position?: number
    }
    timestamp: string
  }
}
```

---

## 🔌 外部API統合

### 1. AI プロバイダー統合

#### 1.1 OpenAI統合
```typescript
interface OpenAIProvider {
  // テキスト生成
  generateText(params: {
    model: 'gpt-4' | 'gpt-3.5-turbo'
    messages: ChatMessage[]
    temperature?: number
    max_tokens?: number
    stream?: boolean
  }): Promise<OpenAIResponse>
  
  // 画像生成
  generateImage(params: {
    prompt: string
    model?: 'dall-e-3' | 'dall-e-2'
    size?: '1024x1024' | '1792x1024' | '1024x1792'
    quality?: 'standard' | 'hd'
  }): Promise<ImageResponse>
  
  // 使用量確認
  getUsage(period: string): Promise<UsageData>
}
```

#### 1.2 Claude統合
```typescript
interface ClaudeProvider {
  generateText(params: {
    model: 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku'
    messages: ClaudeMessage[]
    max_tokens?: number
    temperature?: number
  }): Promise<ClaudeResponse>
  
  analyzePrompt(prompt: string): Promise<PromptAnalysis>
}
```

### 2. 認証プロバイダー統合

#### 2.1 OAuth設定
```typescript
interface OAuthConfig {
  google: {
    client_id: string
    client_secret: string
    scopes: ['openid', 'email', 'profile']
  }
  github: {
    client_id: string
    client_secret: string
    scopes: ['user:email']
  }
  microsoft: {
    client_id: string
    client_secret: string
    scopes: ['openid', 'email', 'profile']
  }
}
```

---

## 📊 API分析・監視

### 1. メトリクス収集

#### 1.1 パフォーマンスメトリクス
```typescript
interface APIMetrics {
  // レスポンス時間
  response_time: {
    avg: number
    p50: number
    p95: number
    p99: number
  }
  
  // スループット
  requests_per_second: number
  
  // エラー率
  error_rate: number
  
  // エンドポイント別統計
  endpoints: Record<string, EndpointMetrics>
}
```

#### 1.2 ビジネスメトリクス
```typescript
interface BusinessMetrics {
  // API使用量
  total_api_calls: number
  unique_users: number
  popular_endpoints: Array<{
    endpoint: string
    calls: number
    unique_users: number
  }>
  
  // AI使用量
  ai_executions: {
    total: number
    by_model: Record<string, number>
    total_cost: number
    avg_cost_per_execution: number
  }
  
  // ユーザーエンゲージメント
  user_engagement: {
    dau: number
    mau: number
    retention_rate: number
  }
}
```

### 2. レート制限・クォータ管理

#### 2.1 レート制限設定
```typescript
interface RateLimitConfig {
  // ユーザー種別別制限
  free_tier: {
    requests_per_minute: 60
    requests_per_hour: 1000
    requests_per_day: 10000
    ai_executions_per_day: 100
  }
  
  pro_tier: {
    requests_per_minute: 300
    requests_per_hour: 10000
    requests_per_day: 100000
    ai_executions_per_day: 1000
  }
  
  enterprise_tier: {
    requests_per_minute: 1000
    requests_per_hour: 50000
    requests_per_day: 1000000
    ai_executions_per_day: 10000
  }
}
```

#### 2.2 クォータ管理
```typescript
// GET /api/v1/quota/status
interface QuotaStatusResponse {
  current_usage: {
    api_calls: number
    ai_executions: number
    storage_mb: number
  }
  limits: {
    api_calls: number
    ai_executions: number
    storage_mb: number
  }
  reset_times: {
    daily_reset: string
    monthly_reset: string
  }
  warnings: string[]
}
```

---

## 🔒 API セキュリティ

### 1. 認証・認可

#### 1.1 JWT構造
```typescript
interface JWTPayload {
  sub: string // user_id
  email: string
  username?: string
  plan_type: 'free' | 'pro' | 'enterprise'
  permissions: string[]
  iat: number // issued at
  exp: number // expires
  jti: string // JWT ID
}
```

#### 1.2 API キー管理
```typescript
// POST /api/v1/api-keys
interface CreateAPIKeyRequest {
  name: string
  description?: string
  permissions: string[]
  expires_at?: string
}

interface CreateAPIKeyResponse {
  id: string
  name: string
  api_key: string // 一度だけ表示
  permissions: string[]
  created_at: string
  expires_at?: string
}
```

### 2. セキュリティヘッダー

#### 2.1 必須セキュリティヘッダー
```typescript
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
}
```

#### 2.2 CORS設定
```typescript
const corsConfig = {
  origin: [
    'https://app.prompthub.com',
    'https://staging.prompthub.com',
    /.*\.prompthub\.com$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-API-Key',
    'X-Request-ID'
  ],
  credentials: true,
  maxAge: 86400 // 24 hours
}
```

### 3. 入力検証

#### 3.1 バリデーションスキーマ
```typescript
import { z } from 'zod'

const CreatePromptSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  content: z.string().min(1).max(10000),
  category_id: z.string().uuid().optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  visibility: z.enum(['private', 'team', 'public']).default('private'),
  target_ai_model: z.string().max(100).optional()
})

type CreatePromptRequest = z.infer<typeof CreatePromptSchema>
```
