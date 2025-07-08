"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Puzzle,
  Star,
  Copy,
  Edit,
  Eye,
} from "lucide-react";

// テンプレートのサンプルデータ
const templateData = [
  {
    id: "1",
    title: "ブログ記事作成テンプレート",
    description:
      "SEOに最適化されたブログ記事を効率的に作成するためのテンプレート",
    category: "文章生成",
    tags: ["ブログ", "SEO", "マーケティング"],
    variables: ["タイトル", "キーワード", "対象読者", "記事の長さ"],
    usageCount: 856,
    rating: 4.7,
    isPopular: true,
    author: "マーケティングチーム",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "商品レビュー分析テンプレート",
    description: "商品レビューを分析し、改善点と強みを抽出するテンプレート",
    category: "分析・要約",
    tags: ["レビュー", "分析", "商品開発"],
    variables: ["商品名", "レビューデータ", "分析項目"],
    usageCount: 432,
    rating: 4.4,
    isPopular: false,
    author: "プロダクトチーム",
    createdAt: "2023-12-15T00:00:00Z",
  },
  {
    id: "3",
    title: "メール返信テンプレート",
    description: "ビジネスメールの返信を適切なトーンで作成するテンプレート",
    category: "コミュニケーション",
    tags: ["メール", "ビジネス", "コミュニケーション"],
    variables: ["相手の名前", "件名", "返信内容", "緊急度"],
    usageCount: 1240,
    rating: 4.9,
    isPopular: true,
    author: "ビジネスチーム",
    createdAt: "2023-11-20T00:00:00Z",
  },
];

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");

  const handleTemplateAction = (action: string, templateId: string) => {
    console.log(`${action} action for template ${templateId}`);
  };

  const TemplateCard = ({
    template,
  }: {
    template: (typeof templateData)[0];
  }) => (
    <Card className="transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Puzzle className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">{template.title}</CardTitle>
              {template.isPopular && (
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-700"
                >
                  人気
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">{template.description}</p>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{template.category}</Badge>
              {template.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{template.tags.length - 2}
                </span>
              )}
            </div>

            <div className="text-xs text-gray-500">
              変数: {template.variables.join(", ")}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {template.usageCount.toLocaleString()}回使用
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
              {template.rating}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTemplateAction("preview", template.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTemplateAction("copy", template.id)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTemplateAction("use", template.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 space-y-4">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
            <Puzzle className="h-6 w-6 mr-2 text-blue-600" />
            テンプレート
          </h1>
          <p className="text-gray-600 mt-1 font-normal">
            再利用可能なプロンプトテンプレートライブラリ
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            テンプレート作成
          </Button>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-gray-500">
              総テンプレート数
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-xl font-bold">8</div>
            <p className="text-xs text-green-600 mt-0.5 font-medium">+2 今月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-gray-500">
              人気テンプレート
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-xl font-bold">3</div>
            <p className="text-xs text-blue-600 mt-0.5 font-medium">高使用率</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-gray-500">
              総使用回数
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-xl font-bold">2,528</div>
            <p className="text-xs text-green-600 mt-0.5 font-medium">
              +156 今週
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
            <div className="text-xl font-bold">4.7</div>
            <p className="text-xs text-green-600 mt-0.5 font-medium">高品質</p>
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
                  placeholder="テンプレートを検索..."
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
                すべて ({templateData.length})
              </TabsTrigger>
              <TabsTrigger value="popular">人気</TabsTrigger>
              <TabsTrigger value="recent">最新</TabsTrigger>
              <TabsTrigger value="category">カテゴリ別</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {templateData.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>

              {templateData.length === 0 && (
                <div className="text-center py-12">
                  <Puzzle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    テンプレートがまだありません
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    最初のテンプレートを作成
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
