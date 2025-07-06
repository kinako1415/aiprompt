"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromptCard } from "@/components/PromptCard";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Heart,
  Clock
} from "lucide-react";

// お気に入りプロンプトのサンプルデータ
const favoritePrompts = [
  {
    id: "1",
    title: "商品説明文生成プロンプト",
    description: "ECサイト用の魅力的な商品説明文を生成するためのプロンプトテンプレート",
    content: "あなたは優秀なコピーライターです。以下の商品情報を基に、魅力的で購買意欲を刺激する商品説明文を作成してください。",
    category: "EC",
    tags: ["コピーライティング", "マーケティング"],
    author: {
      id: "user1",
      name: "田中太郎"
    },
    rating: 4.8,
    ratingCount: 24,
    usageCount: 1200,
    viewCount: 2500,
    likeCount: 89,
    isPublic: true,
    isFavorite: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z"
  },
  {
    id: "3",
    title: "会議議事録整理プロンプト",
    description: "長い会議の議事録から要点を抽出し、アクションアイテムを整理するプロンプト",
    content: "以下の会議議事録を分析し、重要な要点を抽出してアクションアイテムを整理してください：",
    category: "分析・要約",
    tags: ["会議", "議事録", "ビジネス"],
    author: {
      id: "user3",
      name: "鈴木次郎"
    },
    rating: 4.3,
    ratingCount: 31,
    usageCount: 1500,
    viewCount: 3000,
    likeCount: 78,
    isPublic: true,
    isFavorite: true,
    createdAt: "2023-12-20T00:00:00Z",
    updatedAt: "2023-12-28T00:00:00Z"
  }
];

export default function FavoritesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");

  const handlePromptAction = (action: string, promptId: string) => {
    console.log(`${action} action for prompt ${promptId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Heart className="h-6 w-6 mr-2 text-red-500" />
            お気に入り
          </h1>
          <p className="text-gray-600 mt-1">お気に入りに追加したプロンプトを管理できます</p>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">お気に入り数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-green-600 mt-1">+2 今週</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">平均評価</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
            <p className="text-xs text-blue-600 mt-1">高評価プロンプト</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">最近追加</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-600 mt-1">今月追加分</p>
          </CardContent>
        </Card>
      </div>

      {/* 検索・フィルター・表示設定 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="お気に入りプロンプトを検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                フィルター
              </Button>
            </div>

            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="p-1"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="p-1"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">すべて ({favoritePrompts.length})</TabsTrigger>
              <TabsTrigger value="recent">
                <Clock className="h-4 w-4 mr-1" />
                最近追加
              </TabsTrigger>
              <TabsTrigger value="category">カテゴリ別</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className={`grid gap-4 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {favoritePrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onEdit={() => handlePromptAction("edit", prompt.id)}
                    onDelete={() => handlePromptAction("delete", prompt.id)}
                    onRun={() => handlePromptAction("run", prompt.id)}
                    onLike={() => handlePromptAction("like", prompt.id)}
                    onShare={() => handlePromptAction("share", prompt.id)}
                  />
                ))}
              </div>

              {favoritePrompts.length === 0 && (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">お気に入りプロンプトがまだありません</p>
                  <p className="text-sm text-gray-400">
                    プロンプトカードのハートアイコンをクリックしてお気に入りに追加してください
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
