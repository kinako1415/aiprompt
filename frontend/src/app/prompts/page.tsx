"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { PromptCard } from "@/components/PromptCard";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SortAsc, 
  Plus,
  FileText,
  Star,
  Clock,
  TrendingUp
} from "lucide-react";

// サンプルデータ（Dashboard.tsxから移動）
const samplePrompts = [
  {
    id: "1",
    title: "商品説明文生成プロンプト",
    description: "ECサイト用の魅力的な商品説明文を生成するためのプロンプトテンプレート",
    content: "あなたは優秀なコピーライターです。以下の商品情報を基に、魅力的で購買意欲をそそる商品説明文を作成してください。\n\n商品名: {{product_name}}\n価格: {{price}}\n特徴: {{features}}\n\n以下の要素を含めてください：\n- 商品の主要な特徴とメリット\n- ターゲット顧客への訴求ポイント\n- 購入を促す魅力的な表現",
    category: "文章生成",
    tags: ["EC", "コピーライティング", "マーケティング"],
    rating: 4.8,
    ratingCount: 24,
    likeCount: 123,
    viewCount: 1200,
    usageCount: 89,
    createdAt: "2024-01-15",
    updatedAt: "3日前",
    author: {
      id: "1",
      name: "田中太郎",
      avatar: ""
    },
    isFavorite: true,
    isPublic: true,
  },
  {
    id: "2",
    title: "コードレビュー支援プロンプト",
    description: "コードの品質チェックと改善提案を行うためのプロンプト",
    content: "あなたは経験豊富なシニアエンジニアです。以下のコードをレビューし、改善点を指摘してください：\n\n```{{language}}\n{{code}}\n```\n\n以下の観点から評価してください：\n- コードの可読性\n- パフォーマンス\n- セキュリティ\n- ベストプラクティス\n- バグの可能性",
    category: "コード生成",
    tags: ["コードレビュー", "プログラミング", "エンジニア"],
    rating: 4.5,
    ratingCount: 18,
    likeCount: 87,
    viewCount: 890,
    usageCount: 45,
    createdAt: "2024-01-10",
    updatedAt: "1週間前",
    author: {
      id: "2",
      name: "佐藤花子",
      avatar: ""
    },
    isFavorite: false,
    isPublic: false,
  },
  {
    id: "3",
    title: "会議議事録要約プロンプト",
    description: "長い会議の議事録から要点を抽出し、アクションアイテムを整理するプロンプト",
    content: "以下の会議議事録を分析し、要約してください：\n\n{{meeting_transcript}}\n\n以下の形式で整理してください：\n\n## 会議概要\n- 日時：\n- 参加者：\n- 議題：\n\n## 主要な決定事項\n\n## アクションアイテム\n- [ ] 担当者：期限：内容\n\n## 次回会議予定",
    category: "分析・要約",
    tags: ["会議", "議事録", "ビジネス"],
    rating: 4.3,
    ratingCount: 31,
    likeCount: 156,
    viewCount: 1500,
    usageCount: 78,
    createdAt: "2024-01-08",
    updatedAt: "5日前",
    author: {
      id: "3",
      name: "鈴木次郎",
      avatar: ""
    },
    isFavorite: true,
    isPublic: true,
  },
  {
    id: "4",
    title: "SNS投稿文生成プロンプト",
    description: "Twitter/X用の魅力的な投稿文を生成するプロンプト",
    content: "あなたはソーシャルメディアの専門家です。以下のトピックについて、エンゲージメントの高いSNS投稿文を作成してください：\n\nトピック: {{topic}}\n対象オーディエンス: {{audience}}\n\n要件：\n- 280文字以内\n- 適切なハッシュタグを含める\n- 読者の関心を引く書き出し\n- アクションを促す結び",
    category: "文章生成",
    tags: ["SNS", "マーケティング", "Twitter"],
    rating: 4.1,
    ratingCount: 42,
    likeCount: 203,
    viewCount: 2100,
    usageCount: 134,
    createdAt: "2024-01-05",
    updatedAt: "2日前",
    author: {
      id: "4",
      name: "山田美咲",
      avatar: ""
    },
    isFavorite: false,
    isPublic: true,
  },
];

const stats = [
  {
    title: "総プロンプト数",
    value: "243",
    change: "+12",
    changeType: "positive" as const,
    icon: FileText,
  },
  {
    title: "お気に入り",
    value: "32",
    change: "+5",
    changeType: "positive" as const,
    icon: Star,
  },
  {
    title: "最近の使用",
    value: "89",
    change: "+23",
    changeType: "positive" as const,
    icon: Clock,
  },
  {
    title: "平均評価",
    value: "4.2",
    change: "+0.3",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
];

export default function PromptsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePromptEdit = (id: string) => {
    console.log("Edit prompt:", id);
  };

  const handlePromptDelete = (id: string) => {
    console.log("Delete prompt:", id);
  };

  const handlePromptRun = (id: string) => {
    console.log("Run prompt:", id);
  };

  const handlePromptShare = (id: string) => {
    console.log("Share prompt:", id);
  };

  const handlePromptView = (id: string) => {
    console.log("View prompt:", id);
  };

  const handlePromptCopy = (id: string) => {
    console.log("Copy prompt:", id);
  };

  const handlePromptLike = (id: string) => {
    console.log("Like prompt:", id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">マイプロンプト</h1>
          <p className="text-gray-600">あなたが作成・保存したプロンプトを管理できます</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>新規作成</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>{' '}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="プロンプトを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                フィルター
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                ソート
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs and Content */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="favorites">お気に入り</TabsTrigger>
              <TabsTrigger value="recent">最近使用</TabsTrigger>
              <TabsTrigger value="private">非公開</TabsTrigger>
              <TabsTrigger value="shared">共有</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {samplePrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                viewMode={viewMode}
                onView={handlePromptView}
                onLike={handlePromptLike}
                onCopy={handlePromptCopy}
                onEdit={handlePromptEdit}
                onRun={handlePromptRun}
                onShare={handlePromptShare}
                onDelete={handlePromptDelete}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
