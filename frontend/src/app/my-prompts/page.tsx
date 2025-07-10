"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Plus,
  Upload,
  SortAsc,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// サンプルデータ
const samplePrompts = [
  {
    id: "1",
    title: "商品説明文生成プロンプト",
    description:
      "ECサイト用の魅力的な商品説明文を生成するためのプロンプトテンプレート",
    content:
      "あなたは優秀なコピーライターです。以下の商品情報を基に、魅力的で購買意欲を刺激する商品説明文を作成してください。",
    category: "EC",
    tags: ["コピーライティング", "マーケティング"],
    author: {
      id: "user1",
      name: "田中太郎",
    },
    rating: 4.8,
    ratingCount: 24,
    usageCount: 1200,
    viewCount: 2500,
    likeCount: 89,
    isPublic: true,
    isFavorite: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
  {
    id: "2",
    title: "コードレビュー支援プロンプト",
    description: "コードの品質チェックと改善提案を行うためのプロンプト",
    content:
      "あなたは経験豊富なシニアエンジニアです。以下のコードをレビューし、改善点を指摘してください。",
    category: "コードレビュー",
    tags: ["プログラミング", "エンジニア"],
    author: {
      id: "user2",
      name: "佐藤花子",
    },
    rating: 4.5,
    ratingCount: 18,
    usageCount: 890,
    viewCount: 1800,
    likeCount: 45,
    isPublic: false,
    isFavorite: false,
    createdAt: "2023-12-25T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export default function MyPromptsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");

  const handlePromptAction = (action: string, promptId: string) => {
    console.log(`${action} action for prompt ${promptId}`);
  };

  const handleNewPrompt = () => {
    router.push("/prompts/new");
  };

  return (
    <div className="p-4 space-y-4">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            マイプロンプト
          </h1>
          <p className="text-gray-600 mt-1 font-normal">
            作成したプロンプトを管理・編集できます
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            インポート
          </Button>
          <Button size="sm" onClick={handleNewPrompt}>
            <Plus className="h-4 w-4 mr-2" />
            新規作成
          </Button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-gray-500">
              総プロンプト数
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-xl font-bold">243</div>
            <p className="text-xs text-green-600 mt-0.5 font-medium">
              +12 今月
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-gray-500">
              公開中
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-xl font-bold">156</div>
            <p className="text-xs text-blue-600 mt-0.5 font-medium">
              64% 公開率
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-gray-500">
              総いいね数
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-xl font-bold">1,847</div>
            <p className="text-xs text-green-600 mt-0.5 font-medium">
              +234 今月
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-gray-500">
              平均評価
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-xl font-bold">4.2</div>
            <p className="text-xs text-green-600 mt-0.5 font-medium">
              +0.3 前月比
            </p>
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
                  placeholder="プロンプトを検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SortAsc className="h-4 w-4 mr-2" />
                    並び順
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => console.log("latest")}>
                    最新順
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("popular")}>
                    人気順
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("rating")}>
                    評価順
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("usage")}>
                    使用回数順
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                フィルター
              </Button>
            </div>

            <div className="flex items-center border border-gray-100 rounded-lg p-1">
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
              <TabsTrigger value="all">
                すべて ({samplePrompts.length})
              </TabsTrigger>
              <TabsTrigger value="public">公開中</TabsTrigger>
              <TabsTrigger value="private">非公開</TabsTrigger>
              <TabsTrigger value="drafts">下書き</TabsTrigger>
              <TabsTrigger value="favorites">お気に入り</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div
                className={`grid gap-2 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {samplePrompts.map((prompt) => (
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

              {samplePrompts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    プロンプトがまだありません
                  </p>
                  <Button onClick={handleNewPrompt}>
                    <Plus className="h-4 w-4 mr-2" />
                    最初のプロンプトを作成
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
