"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { PromptTemplate } from "@/store/api/templateApi";
import { MockTemplateService } from "@/utils/mockServices";
// import { useGetTemplatesQuery, useGetUserTemplatesQuery } from "@/store/api/templateApi";

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // テンプレートを読み込む
  useEffect(() => {
    const loadTemplates = () => {
      setIsLoading(true);
      try {
        const savedTemplates = MockTemplateService.getTemplates();
        setTemplates(savedTemplates);
      } catch (error) {
        console.error("テンプレートの読み込みエラー:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // 検索フィルタリング
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description &&
        template.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 表示するテンプレートデータの決定
  const displayTemplates = filteredTemplates;
  const error = null;

  const handleTemplateAction = (action: string, templateId: string) => {
    console.log(`${action} action for template ${templateId}`);
  };

  const TemplateCard = ({ template }: { template: PromptTemplate }) => (
    <Card className="transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Puzzle className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">{template.name}</CardTitle>
              {template.usageCount && template.usageCount > 1000 && (
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
              {template.tags &&
                template.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              {template.tags && template.tags.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{template.tags.length - 2}
                </span>
              )}
            </div>

            <div className="text-xs text-gray-500">
              変数: {template.variables.map((v) => v.name).join(", ")}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {template.usageCount?.toLocaleString() || 0}回使用
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
              {template.rating || 0}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTemplateAction("preview", template.id || "")}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTemplateAction("copy", template.id || "")}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTemplateAction("use", template.id || "")}
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
                すべて ({displayTemplates.length})
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
                {displayTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>

              {displayTemplates.length === 0 && (
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
