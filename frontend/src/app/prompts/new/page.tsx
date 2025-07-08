"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { StructuredPromptEditor } from "@/components/StructuredPromptEditor";
import { AdvancedTextEditor } from "@/components/AdvancedTextEditor";
import { LivePreviewPanel } from "@/components/LivePreviewPanel";
import { VersionHistory } from "@/components/VersionHistory";
import { PromptWizard } from "@/components/PromptWizard";
import {
  Save,
  Sparkles,
  Lightbulb,
  Layers,
  X,
  Plus,
  CheckCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  FileText,
  Settings,
  Eye,
  RotateCcw,
  Wand2,
  Edit,
} from "lucide-react";

const categories = [
  "文章生成",
  "画像生成",
  "コード生成",
  "分析・要約",
  "翻訳",
  "アイデア出し",
];

// AI支援フローで作成されるプロンプトテンプレートの型
interface PromptTemplate {
  name: string;
  description?: string;
  content: string;
  metadata?: {
    category?: string;
    tags?: string[];
    [key: string]: string | string[] | number | boolean | undefined;
  };
}

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

// ガイドステップの定義
const guideSteps = [
  {
    id: 1,
    title: "基本情報",
    description: "プロンプトの基本情報を設定",
    icon: FileText,
    fields: ["title", "description", "category"],
  },
  {
    id: 2,
    title: "プロンプト作成",
    description: "プロンプトの内容を作成・編集",
    icon: Settings,
    fields: ["content"],
  },
  {
    id: 3,
    title: "確認・調整",
    description: "プレビューして最終調整",
    icon: Eye,
    fields: ["tags", "preview"],
  },
];

export default function NewPromptPage() {
  const router = useRouter();

  // 作成方法の選択状態（追加）
  const [creationMode, setCreationMode] = useState<"select" | "manual" | "ai">(
    "select"
  );

  // フォームの状態管理
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // UI状態管理
  const [activeTab, setActiveTab] = useState("editor");
  const [showPreview, setShowPreview] = useState(false);
  const [isGuideMode, setIsGuideMode] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [focusMode, setFocusMode] = useState(false);
  const [aiHandoffSuccessful, setAiHandoffSuccessful] = useState(false);

  // 自動保存機能の状態
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // バリデーション状態
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // バリデーション
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step >= 1) {
      if (!title.trim()) newErrors.title = "タイトルは必須です";
      if (!description.trim()) newErrors.description = "説明は必須です";
      if (!category) newErrors.category = "カテゴリーは必須です";
    }

    if (step >= 2) {
      if (!content.trim()) newErrors.content = "プロンプト内容は必須です";
      if (content.length < 10)
        newErrors.content = "プロンプトは10文字以上で入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateStep(3)) return;

    setIsProcessing(true);
    try {
      const promptData = {
        id: Date.now().toString(),
        title,
        description,
        content,
        category,
        tags,
      };

      // ここで実際のAPI呼び出しを行う
      console.log("Saving prompt...", promptData);

      // 保存成功後、プロンプト一覧ページに戻る
      router.push("/prompts");
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "変更が保存されていません。ページを離れますか？"
      );
      if (!confirmed) return;
    }
    router.push("/prompts");
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

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, guideSteps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const jumpToStep = (step: number) => {
    setCurrentStep(step);
  };

  const getStepProgress = () => {
    return ((currentStep - 1) / (guideSteps.length - 1)) * 100;
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) return "current";
    return "upcoming";
  };

  // AI支援フロー完了時のハンドラー
  const handleAIWizardComplete = (template: PromptTemplate) => {
    console.log("AI支援フローで作成されたプロンプト:", template);
    // 作成されたプロンプトを手動編集モードに引き継ぎ
    setTitle(template.name || "");
    setDescription(template.description || "");
    setContent(template.content || "");
    setCategory(template.metadata?.category || "");
    // タグがある場合は設定
    if (template.metadata?.tags && Array.isArray(template.metadata.tags)) {
      setTags(template.metadata.tags);
    }
    setCreationMode("manual");
    setCurrentStep(2); // プロンプト編集ステップに移動
    setAiHandoffSuccessful(true);
    // 3秒後に成功表示を消す
    setTimeout(() => setAiHandoffSuccessful(false), 3000);
  };

  const handleAIWizardCancel = () => {
    setCreationMode("select");
  };

  // 手動モードからAI支援モードに切り替える時の確認
  const handleSwitchToAI = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "現在の入力内容が失われます。AI支援モードに切り替えますか？"
      );
      if (!confirmed) return;
    }
    setCreationMode("ai");
  };

  // 作成方法選択画面の表示判定
  if (creationMode === "select") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* ヘッダー */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>戻る</span>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h1 className="text-lg font-semibold text-gray-900">
                    新規プロンプト作成
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 作成方法選択画面 */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              プロンプトの作成方法を選択してください
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI支援で簡単に作成するか、手動で詳細に作成するかを選択できます。
              どちらを選んでも、後から編集や調整が可能です。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI支援作成 */}
            <Card
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500 hover:scale-105"
              onClick={() => setCreationMode("ai")}
            >
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <Wand2 className="h-10 w-10 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      AI支援で作成
                    </h3>
                    <Badge className="bg-blue-100 text-blue-800 mb-4">
                      推奨・初心者向け
                    </Badge>
                    <p className="text-gray-600 leading-relaxed">
                      目的や要件を対話形式で入力するだけで、AIがベストプラクティスに基づいた効果的なプロンプトを自動生成します
                    </p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>初心者でも簡単に高品質なプロンプトを作成</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>ベストプラクティスが自動で適用</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>対話形式でわかりやすく</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>後から手動編集も可能</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                    <Wand2 className="h-4 w-4 mr-2" />
                    AI支援で作成を開始
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 手動作成 */}
            <Card
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500 hover:scale-105"
              onClick={() => setCreationMode("manual")}
            >
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                    <Edit className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      手動で作成
                    </h3>
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-700 mb-4"
                    >
                      上級者向け・詳細設定
                    </Badge>
                    <p className="text-gray-600 leading-relaxed">
                      詳細な設定と高い自由度で、完全にカスタマイズしたプロンプトを一から作成できます
                    </p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>完全なカスタマイズが可能</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>高度な編集機能とプレビュー</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>ガイド機能で段階的に作成</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>構造化エディターも利用可能</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-green-500 text-green-700 hover:bg-green-50 font-semibold py-3"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    手動で作成を開始
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12 space-y-2">
            <p className="text-gray-500">
              💡 AI支援で作成した後も、手動編集で細かい調整が可能です
            </p>
            <p className="text-sm text-gray-400">
              どちらの方法でも、高品質なプロンプトを作成できます
            </p>
          </div>
        </div>
      </div>
    );
  }

  // AI支援フロー
  if (creationMode === "ai") {
    return (
      <div className="min-h-screen bg-gray-50">
        <PromptWizard
          onComplete={handleAIWizardComplete}
          onCancel={handleAIWizardCancel}
        />
      </div>
    );
  }

  // 手動作成フロー（元のコード）
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCreationMode("select")}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>戻る</span>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h1 className="text-lg font-semibold text-gray-900">
                  新規プロンプト作成 - 手動モード
                </h1>
                {isDirty && (
                  <Badge variant="outline" className="text-orange-600">
                    未保存
                  </Badge>
                )}
                {aiHandoffSuccessful && (
                  <Badge className="bg-green-100 text-green-800 animate-pulse">
                    AI支援フローから引き継ぎ完了
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {lastSaved && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>最終保存: {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSwitchToAI}
                  className="flex items-center space-x-2 text-blue-600 hover:bg-blue-50"
                >
                  <Wand2 className="h-4 w-4" />
                  <span>AI支援に切り替え</span>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsGuideMode(!isGuideMode)}
                  className={isGuideMode ? "bg-blue-50 text-blue-600" : ""}
                >
                  ガイド: {isGuideMode ? "ON" : "OFF"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFocusMode(!focusMode)}
                  className={focusMode ? "bg-purple-50 text-purple-600" : ""}
                >
                  集中モード: {focusMode ? "ON" : "OFF"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className={showPreview ? "bg-green-50 text-green-600" : ""}
                >
                  プレビュー: {showPreview ? "ON" : "OFF"}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCreationMode("select")}
                  disabled={isProcessing}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isProcessing || !title || !content}
                  className="flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>保存中...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>保存</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ガイドモード: プログレスバーとステップ */}
      {isGuideMode && !focusMode && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="space-y-4">
              {/* プログレスバー */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    ステップ {currentStep} / {guideSteps.length}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(getStepProgress())}% 完了
                  </span>
                </div>
                <Progress value={getStepProgress()} className="w-full" />
              </div>

              {/* ステップナビゲーション */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {guideSteps.map((step) => {
                    const status = getStepStatus(step.id);
                    const Icon = step.icon;

                    return (
                      <button
                        key={step.id}
                        onClick={() => jumpToStep(step.id)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          status === "current"
                            ? "bg-blue-100 text-blue-700"
                            : status === "completed"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {status === "completed" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {step.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-1"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>前へ</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={nextStep}
                    disabled={currentStep === guideSteps.length}
                    className="flex items-center space-x-1"
                  >
                    <span>次へ</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          className={`grid gap-6 ${
            showPreview ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* 左側: エディター */}
          <div className="space-y-6">
            {/* ステップ1: 基本情報 */}
            {(!isGuideMode || currentStep === 1) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>基本情報</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">
                      タイトル <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="プロンプトのタイトルを入力"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">
                      説明 <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="プロンプトの用途や特徴を説明"
                      rows={3}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">
                      カテゴリー <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.category ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">カテゴリーを選択</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.category}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ステップ2: プロンプト作成 */}
            {(!isGuideMode || currentStep === 2) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>プロンプト作成</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="editor">エディター</TabsTrigger>
                      <TabsTrigger value="structured">構造化</TabsTrigger>
                      <TabsTrigger value="advanced">高度</TabsTrigger>
                    </TabsList>

                    <TabsContent value="editor" className="mt-4">
                      <div className="space-y-4">
                        <Label htmlFor="content">
                          プロンプト内容 <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="プロンプトの内容を入力してください..."
                          rows={12}
                          className={`font-mono ${
                            errors.content ? "border-red-500" : ""
                          }`}
                        />
                        {errors.content && (
                          <p className="text-red-500 text-sm">
                            {errors.content}
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="structured" className="mt-4">
                      <StructuredPromptEditor
                        content={content}
                        onChange={setContent}
                        elements={promptElements}
                      />
                    </TabsContent>

                    <TabsContent value="advanced" className="mt-4">
                      <AdvancedTextEditor
                        content={content}
                        onChange={setContent}
                        placeholder="プロンプトの内容を入力してください..."
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* ステップ3: 確認・調整 */}
            {(!isGuideMode || currentStep === 3) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>確認・調整</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="tags">タグ（オプション）</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="tags"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="タグを入力"
                        onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                      />
                      <Button onClick={handleAddTag} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
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
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 補助機能タブ（集中モード以外） */}
            {!focusMode && (
              <Card>
                <CardHeader>
                  <CardTitle>補助機能</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="suggestions">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="suggestions">
                        <Lightbulb className="h-4 w-4 mr-1" />
                        AI提案
                      </TabsTrigger>
                      <TabsTrigger value="elements">
                        <Layers className="h-4 w-4 mr-1" />
                        要素分解
                      </TabsTrigger>
                      <TabsTrigger value="versions">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        バージョン
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="suggestions" className="mt-4">
                      <div className="space-y-3">
                        {aiSuggestions.map((suggestion, index) => (
                          <Card key={index} className="p-3">
                            <div className="flex items-start space-x-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium">
                                    {suggestion.title}
                                  </h4>
                                  <Badge
                                    variant={
                                      suggestion.impact === "high"
                                        ? "destructive"
                                        : "secondary"
                                    }
                                  >
                                    {suggestion.impact === "high"
                                      ? "高効果"
                                      : "中効果"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {suggestion.description}
                                </p>
                                <code className="text-xs bg-gray-100 p-2 rounded block">
                                  {suggestion.suggestion}
                                </code>
                              </div>
                              <Button
                                size="sm"
                                onClick={() =>
                                  applySuggestion(suggestion.suggestion)
                                }
                              >
                                適用
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="elements" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {promptElements.map((element, index) => (
                          <Card key={index} className="p-3">
                            <h4 className="font-medium">{element.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {element.description}
                            </p>
                            <p className="text-xs text-blue-600">
                              例: {element.example}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="versions" className="mt-4">
                      <VersionHistory
                        promptId="new"
                        onRestore={(version) => setContent(version.content)}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右側: プレビューパネル */}
          {showPreview && (
            <div className="space-y-6">
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
      </div>
    </div>
  );
}
