import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { StructuredPromptEditor } from "./StructuredPromptEditor";
import { AdvancedTextEditor } from "./AdvancedTextEditor";
import { LivePreviewPanel } from "./LivePreviewPanel";
import { VersionHistory } from "./VersionHistory";
import {
  Save,
  Play,
  Sparkles,
  Lightbulb,
  Layers,
  X,
  Plus,
  AlertCircle,
  CheckCircle,
  Zap,
  Clock,
} from "lucide-react";

interface PromptEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt?: {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
  };
  onSave: (prompt: {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
  }) => void;
}

const categories = [
  "文章生成",
  "画像生成",
  "コード生成",
  "分析・要約",
  "翻訳",
  "アイデア出し",
];

const aiSuggestions = [
  {
    type: "improvement",
    title: "より具体的な指示を追加",
    description:
      "プロンプトに具体的な出力形式を指定すると、より一貫した結果が得られます。",
    suggestion:
      "以下の形式で出力してください：\n\n## タイトル\n内容...\n\n## 要約\n- ポイント1\n- ポイント2",
    impact: "high" as const,
  },
  {
    type: "structure",
    title: "ペルソナ設定を追加",
    description:
      "AIに特定の役割を与えることで、より専門的な回答が期待できます。",
    suggestion:
      "あなたは経験豊富な{{職種}}です。{{専門知識}}を活用して回答してください。",
    impact: "medium" as const,
  },
  {
    type: "example",
    title: "例示の追加",
    description: "具体例を示すことで、期待する出力の品質が向上します。",
    suggestion:
      "例：\n入力: {{例1}}\n出力: {{例1の出力}}\n\n入力: {{例2}}\n出力: {{例2の出力}}",
    impact: "medium" as const,
  },
];

const promptElements = [
  {
    name: "目的・タスク",
    description: "何をさせたいのか",
    example: "商品説明文を作成する",
  },
  {
    name: "ペルソナ・役割",
    description: "AIに演じてもらう役割",
    example: "経験豊富なコピーライター",
  },
  {
    name: "コンテキスト",
    description: "背景情報・前提条件",
    example: "ECサイト用の商品説明文",
  },
  {
    name: "制約・条件",
    description: "守るべきルールや制限",
    example: "200文字以内で簡潔に",
  },
  {
    name: "出力形式",
    description: "結果の形式・構造",
    example: "タイトル、説明、特徴の順番で",
  },
  {
    name: "例示",
    description: "具体例やサンプル",
    example: "例：商品名「○○」→「魅力的な○○で...」",
  },
];

export function PromptEditor({
  open,
  onOpenChange,
  prompt,
  onSave,
}: PromptEditorProps) {
  const [title, setTitle] = useState(prompt?.title || "");
  const [description, setDescription] = useState(prompt?.description || "");
  const [content, setContent] = useState(prompt?.content || "");
  const [category, setCategory] = useState(prompt?.category || "");
  const [tags, setTags] = useState<string[]>(prompt?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [showPreview, setShowPreview] = useState(false);

  // 自動保存機能の状態
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // 自動保存機能（3秒間隔でデバウンス）
  const autoSave = useCallback(
    (data: {
      title: string;
      description: string;
      content: string;
      category: string;
      tags: string[];
    }) => {
      if (autoSaveEnabled && isDirty) {
        // 実際のAPI呼び出しはここで行う
        console.log("Auto-saving draft...", data);
        setLastSaved(new Date());
        setIsDirty(false);
      }
    },
    [autoSaveEnabled, isDirty]
  );

  // デバウンスされた自動保存
  const debouncedAutoSave = useCallback(
    (data: {
      title: string;
      description: string;
      content: string;
      category: string;
      tags: string[];
    }) => {
      const timeoutId = setTimeout(() => autoSave(data), 3000);
      return () => clearTimeout(timeoutId);
    },
    [autoSave]
  );

  // フォームデータの変更を監視
  useEffect(() => {
    if (title || description || content || category || tags.length > 0) {
      setIsDirty(true);
      const cleanup = debouncedAutoSave({
        title,
        description,
        content,
        category,
        tags,
      });
      return cleanup;
    }
  }, [title, description, content, category, tags, debouncedAutoSave]);

  const handleSave = () => {
    const promptData = {
      id: prompt?.id || Date.now().toString(),
      title,
      description,
      content,
      category,
      tags,
    };
    onSave(promptData);
    onOpenChange(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const applySuggestion = (suggestion: string) => {
    setContent(content + "\n\n" + suggestion);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none max-h-none w-screen h-screen flex flex-col p-0 overflow-hidden m-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>{prompt ? "プロンプト編集" : "新規プロンプト作成"}</span>
              {isDirty && (
                <Badge variant="outline" className="text-orange-600">
                  未保存
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {lastSaved && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>最終保存: {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                プレビュー: {showPreview ? "ON" : "OFF"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              >
                自動保存: {autoSaveEnabled ? "ON" : "OFF"}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* 新しい分割レイアウト */}
        <div className="flex-1 overflow-hidden flex min-h-0">
          {/* 左パネル: エディター */}
          <div className="flex-1 flex flex-col min-w-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-5 mx-6 mt-4 flex-shrink-0">
                <TabsTrigger value="structured">構造化編集</TabsTrigger>
                <TabsTrigger value="editor">テキスト編集</TabsTrigger>
                <TabsTrigger value="suggestions">AI提案</TabsTrigger>
                <TabsTrigger value="elements">要素分解</TabsTrigger>
                <TabsTrigger value="versions">バージョン</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden px-6 pb-4">
                {/* 構造化編集タブ */}
                <TabsContent
                  value="structured"
                  className="h-full mt-0 overflow-y-auto"
                >
                  <StructuredPromptEditor
                    content={content}
                    onChange={setContent}
                    elements={promptElements}
                  />
                </TabsContent>

                {/* 従来のテキスト編集 */}
                <TabsContent
                  value="editor"
                  className="h-full mt-0 overflow-y-auto"
                >
                  <div className="flex flex-col gap-4 h-full py-4">
                    {/* 上部：基本情報（横並び、幅広） */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 pb-4 border-b border-gray-200">
                      <div className="md:col-span-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                          タイトル
                        </Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="プロンプトのタイトルを入力"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="category"
                          className="text-sm font-medium"
                        >
                          カテゴリー
                        </Label>
                        <select
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="mt-1 w-full p-2 border border-gray-200 rounded-md"
                        >
                          <option value="">カテゴリーを選択</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium"
                        >
                          説明
                        </Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="プロンプトの用途や概要を説明"
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* タグ部分（横並び、コンパクト） */}
                    <div className="pb-4 border-b border-gray-200">
                      <Label className="text-sm font-medium mb-2 block">
                        タグ
                      </Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center space-x-1"
                          >
                            <span>{tag}</span>
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2 max-w-sm">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="新しいタグを追加"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddTag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* メインエディター（全領域を使用） */}
                    <div className="flex-1 min-h-0">
                      <AdvancedTextEditor
                        content={content}
                        onChange={setContent}
                        placeholder="プロンプトの内容を入力してください..."
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="suggestions"
                  className="h-full mt-0 overflow-y-auto"
                >
                  <div className="space-y-4 p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <h3 className="text-lg font-semibold">AI改善提案</h3>
                    </div>

                    {aiSuggestions.map((suggestion, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center space-x-2">
                              <div
                                className={`p-1 rounded-full ${
                                  suggestion.impact === "high"
                                    ? "bg-red-100 text-red-600"
                                    : suggestion.impact === "medium"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {suggestion.impact === "high" ? (
                                  <AlertCircle className="h-4 w-4" />
                                ) : suggestion.impact === "medium" ? (
                                  <Zap className="h-4 w-4" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                              </div>
                              <span>{suggestion.title}</span>
                            </CardTitle>
                            <Badge
                              variant={
                                suggestion.impact === "high"
                                  ? "destructive"
                                  : suggestion.impact === "medium"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {suggestion.impact === "high"
                                ? "高"
                                : suggestion.impact === "medium"
                                ? "中"
                                : "低"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-3">
                            {suggestion.description}
                          </p>
                          <div className="bg-gray-50 p-3 rounded-md mb-3">
                            <pre className="text-sm whitespace-pre-wrap">
                              {suggestion.suggestion}
                            </pre>
                          </div>
                          <Button
                            size="sm"
                            onClick={() =>
                              applySuggestion(suggestion.suggestion)
                            }
                            className="w-full"
                          >
                            適用する
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent
                  value="elements"
                  className="h-full mt-0 overflow-y-auto"
                >
                  <div className="space-y-4 p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Layers className="h-5 w-5 text-blue-500" />
                      <h3 className="text-lg font-semibold">
                        プロンプト要素分解
                      </h3>
                    </div>

                    {promptElements.map((element, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-base">
                            {element.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-2">
                            {element.description}
                          </p>
                          <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-sm font-medium text-blue-800">
                              例:
                            </p>
                            <p className="text-sm text-blue-700">
                              {element.example}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="versions" className="h-full mt-0">
                  <div className="p-4 h-full">
                    <VersionHistory
                      promptId={prompt?.id || "new"}
                      onRestore={(version) => {
                        setContent(version.content);
                        // その他の復元処理
                      }}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* 右パネル: プレビュー（条件付き表示） */}
          {showPreview && (
            <div className="w-80 border-l border-gray-200 flex flex-col bg-white">
              <LivePreviewPanel
                title={title}
                description={description}
                content={content}
                category={category}
                tags={tags}
              />
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Play className="h-4 w-4 mr-2" />
              テスト実行
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
