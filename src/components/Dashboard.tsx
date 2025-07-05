import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PromptCard } from './PromptCard';
import { 
  TrendingUp, 
  FileText, 
  Star, 
  Eye, 
  Plus,
  Download,
  Upload,
  Sparkles,
  Grid3X3,
  List,
  Filter
} from 'lucide-react';

interface DashboardProps {
  onCreatePrompt: () => void;
}

// Sample data
const dashboardStats = [
  {
    title: '総プロンプト数',
    value: '243',
    change: '+12',
    changeType: 'positive' as const,
    icon: FileText
  },
  {
    title: '平均評価',
    value: '4.2',
    change: '+0.3',
    changeType: 'positive' as const,
    icon: Star
  },
  {
    title: '今月の使用数',
    value: '1,847',
    change: '+234',
    changeType: 'positive' as const,
    icon: Eye
  },
  {
    title: '今月の改善率',
    value: '23%',
    change: '+5%',
    changeType: 'positive' as const,
    icon: TrendingUp
  }
];

const samplePrompts = [
  {
    id: '1',
    title: '商品説明文生成プロンプト',
    description: 'ECサイト用の魅力的な商品説明文を生成するためのプロンプトテンプレート',
    content: 'あなたは優秀なコピーライターです。以下の商品情報を基に、魅力的で購買意欲をそそる商品説明文を作成してください。\n\n商品名: {{product_name}}\n価格: {{price}}\n特徴: {{features}}\n\n以下の要素を含めてください：\n- 商品の主要な特徴とメリット\n- ターゲット顧客への訴求ポイント\n- 購入を促す魅力的な表現',
    category: '文章生成',
    tags: ['EC', 'コピーライティング', 'マーケティング'],
    rating: 4.8,
    ratingCount: 24,
    likeCount: 123,
    viewCount: 1200,
    usageCount: 89,
    createdAt: '2024-01-15',
    updatedAt: '3日前',
    author: {
      name: '田中太郎',
    },
    isFavorite: true,
    isPublic: true
  },
  {
    id: '2',
    title: 'コードレビュー支援プロンプト',
    description: 'コードの品質チェックと改善提案を行うためのプロンプト',
    content: 'あなたは経験豊富なシニアエンジニアです。以下のコードをレビューし、改善点を指摘してください：\n\n```{{language}}\n{{code}}\n```\n\n以下の観点から評価してください：\n- コードの可読性\n- パフォーマンス\n- セキュリティ\n- ベストプラクティス\n- バグの可能性',
    category: 'コード生成',
    tags: ['コードレビュー', 'プログラミング', 'エンジニア'],
    rating: 4.5,
    ratingCount: 18,
    likeCount: 87,
    viewCount: 890,
    usageCount: 45,
    createdAt: '2024-01-10',
    updatedAt: '1週間前',
    author: {
      name: '佐藤花子',
    },
    isFavorite: false,
    isPublic: false
  },
  {
    id: '3',
    title: '会議議事録要約プロンプト',
    description: '長い会議の議事録から要点を抽出し、アクションアイテムを整理するプロンプト',
    content: '以下の会議議事録を分析し、要約してください：\n\n{{meeting_transcript}}\n\n以下の形式で整理してください：\n\n## 会議概要\n- 日時：\n- 参加者：\n- 議題：\n\n## 主要な決定事項\n\n## アクションアイテム\n- [ ] 担当者：期限：内容\n\n## 次回会議予定',
    category: '分析・要約',
    tags: ['会議', '議事録', 'ビジネス'],
    rating: 4.3,
    ratingCount: 31,
    likeCount: 156,
    viewCount: 1500,
    usageCount: 78,
    createdAt: '2024-01-08',
    updatedAt: '5日前',
    author: {
      name: '鈴木次郎',
    },
    isFavorite: true,
    isPublic: true
  },
  {
    id: '4',
    title: 'SNS投稿文生成プロンプト',
    description: 'Twitter/X用の魅力的な投稿文を生成するプロンプト',
    content: 'あなたはソーシャルメディアの専門家です。以下のトピックについて、エンゲージメントの高いSNS投稿文を作成してください：\n\nトピック: {{topic}}\n対象オーディエンス: {{audience}}\n\n要件：\n- 280文字以内\n- 適切なハッシュタグを含める\n- 読者の関心を引く書き出し\n- アクションを促す結び',
    category: '文章生成',
    tags: ['SNS', 'マーケティング', 'Twitter'],
    rating: 4.1,
    ratingCount: 42,
    likeCount: 203,
    viewCount: 2100,
    usageCount: 134,
    createdAt: '2024-01-05',
    updatedAt: '2日前',
    author: {
      name: '山田美咲',
    },
    isFavorite: false,
    isPublic: true
  }
];

export function Dashboard({ onCreatePrompt }: DashboardProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');

  const handlePromptEdit = (id: string) => {
    console.log('Edit prompt:', id);
  };

  const handlePromptDelete = (id: string) => {
    console.log('Delete prompt:', id);
  };

  const handlePromptRun = (id: string) => {
    console.log('Run prompt:', id);
  };

  const handleToggleFavorite = (id: string) => {
    console.log('Toggle favorite:', id);
  };

  const handlePromptShare = (id: string) => {
    console.log('Share prompt:', id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm flex items-center ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <stat.icon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>クイックアクション</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={onCreatePrompt}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Plus className="h-6 w-6" />
              <span>新規プロンプト作成</span>
            </Button>
            <Button 
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <FileText className="h-6 w-6" />
              <span>テンプレートから作成</span>
            </Button>
            <Button 
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Upload className="h-6 w-6" />
              <span>インポート</span>
            </Button>
            <Button 
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Sparkles className="h-6 w-6" />
              <span>AIアシスタント</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prompts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>プロンプト一覧</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                フィルター
              </Button>
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-1"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="p-1"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="recent">最近使用</TabsTrigger>
              <TabsTrigger value="favorites">お気に入り</TabsTrigger>
              <TabsTrigger value="public">公開中</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {samplePrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onEdit={handlePromptEdit}
                    onDelete={handlePromptDelete}
                    onRun={handlePromptRun}
                    onToggleFavorite={handleToggleFavorite}
                    onShare={handlePromptShare}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recent">
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {samplePrompts.slice(0, 2).map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onEdit={handlePromptEdit}
                    onDelete={handlePromptDelete}
                    onRun={handlePromptRun}
                    onToggleFavorite={handleToggleFavorite}
                    onShare={handlePromptShare}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="favorites">
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {samplePrompts.filter(p => p.isFavorite).map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onEdit={handlePromptEdit}
                    onDelete={handlePromptDelete}
                    onRun={handlePromptRun}
                    onToggleFavorite={handleToggleFavorite}
                    onShare={handlePromptShare}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="public">
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {samplePrompts.filter(p => p.isPublic).map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onEdit={handlePromptEdit}
                    onDelete={handlePromptDelete}
                    onRun={handlePromptRun}
                    onToggleFavorite={handleToggleFavorite}
                    onShare={handlePromptShare}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}