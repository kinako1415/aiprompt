"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  Target,
  Lightbulb,
  MessageSquare,
  Image,
  Code,
  FileText,
  Languages,
  Zap,
} from "lucide-react";
import { PromptGoal } from "../PromptWizard";

interface PromptGoalInputProps {
  onComplete: (goal: PromptGoal) => void;
  initialData?: PromptGoal | null;
}

const categories = [
  {
    id: "text_generation",
    name: "文章生成",
    icon: FileText,
    examples: ["ブログ記事", "メール", "企画書", "商品説明"],
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "image_generation",
    name: "画像生成",
    icon: Image,
    examples: ["イラスト", "ロゴ", "アイコン", "バナー"],
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    id: "code_generation",
    name: "コード生成",
    icon: Code,
    examples: ["関数", "スクリプト", "API", "テスト"],
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: "analysis",
    name: "分析・要約",
    icon: Target,
    examples: ["データ分析", "文書要約", "レポート", "比較"],
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    id: "translation",
    name: "翻訳・言語処理",
    icon: Languages,
    examples: ["翻訳", "校正", "言い換え", "多言語対応"],
    color: "bg-red-100 text-red-800 border-red-200",
  },
  {
    id: "brainstorming",
    name: "アイデア出し",
    icon: Lightbulb,
    examples: ["ブレインストーミング", "企画", "創作", "問題解決"],
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
];

const targetAIs = [
  { id: "chatgpt", name: "ChatGPT (OpenAI)", description: "汎用的な会話AI" },
  { id: "claude", name: "Claude (Anthropic)", description: "長文処理が得意" },
  { id: "gemini", name: "Gemini (Google)", description: "マルチモーダル対応" },
  { id: "dall-e", name: "DALL-E (OpenAI)", description: "画像生成専用" },
  { id: "midjourney", name: "Midjourney", description: "アート系画像生成" },
  { id: "any", name: "指定なし", description: "汎用的なプロンプト" },
];

const purposeExamples = {
  text_generation: [
    "SEO対策されたブログ記事を書いてほしい",
    "顧客向けのフォーマルなメールを作成したい",
    "新商品の魅力的な説明文を書いてほしい",
    "プレゼン用の企画書を作成したい",
  ],
  image_generation: [
    "ミニマルなロゴデザインを作ってほしい",
    "ファンタジー風景のイラストを描いてほしい",
    "プレゼン用のアイコンセットを作りたい",
    "SNS投稿用のバナーを作成したい",
  ],
  code_generation: [
    "API連携のPython関数を書いてほしい",
    "レスポンシブなCSSコードを生成したい",
    "データベース処理のSQLを作成したい",
    "ユニットテストコードを自動生成したい",
  ],
  analysis: [
    "売上データから傾向を分析してほしい",
    "長い会議録を要約してほしい",
    "競合他社と自社サービスを比較したい",
    "アンケート結果をレポートにまとめたい",
  ],
  translation: [
    "技術文書を自然な日本語に翻訳したい",
    "ビジネスメールを丁寧な英語に翻訳したい",
    "文章の表現をよりフォーマルにしたい",
    "専門用語を一般向けに言い換えたい",
  ],
  brainstorming: [
    "新規事業のアイデアを出してほしい",
    "イベント企画のコンセプトを考えたい",
    "小説のプロット案を複数提案してほしい",
    "技術的な課題の解決策を考えたい",
  ],
};

export function PromptGoalInput({
  onComplete,
  initialData,
}: PromptGoalInputProps) {
  const [purpose, setPurpose] = useState(initialData?.purpose || "");
  const [keywords, setKeywords] = useState(initialData?.keywords || "");
  const [scenario, setScenario] = useState(initialData?.scenario || "");
  const [selectedCategory, setSelectedCategory] = useState(
    initialData?.category || ""
  );
  const [targetAI, setTargetAI] = useState(initialData?.targetAI || "any");
  const [showExamples, setShowExamples] = useState(true);

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );
  const examples = selectedCategory
    ? purposeExamples[selectedCategory as keyof typeof purposeExamples]
    : [];

  const handleSubmit = () => {
    if (purpose && selectedCategory) {
      onComplete({
        purpose,
        keywords,
        scenario,
        category: selectedCategory,
        targetAI,
      });
    }
  };

  const fillExample = (example: string) => {
    setPurpose(example);
    setShowExamples(false);
  };

  const isValid = purpose.trim() && selectedCategory;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Category Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>カテゴリーを選択してください</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCategory === category.id
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <category.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {category.examples.slice(0, 3).map((example, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Purpose Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>何についてのプロンプトですか？</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="purpose">
                具体的な目的や内容を教えてください{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="purpose"
                placeholder="例：SEO対策されたブログ記事を書いてほしい"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={3}
                className="mt-1"
              />
              {purpose.length > 0 && (
                <div className="text-sm text-gray-500 mt-1">
                  {purpose.length} 文字
                </div>
              )}
            </div>

            {showExamples && selectedCategory && examples.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-sm text-gray-700 mb-2">
                  {selectedCategoryData?.name}の例文：
                </h4>
                <div className="space-y-2">
                  {examples.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-auto p-3 text-left"
                      onClick={() => fillExample(example)}
                    >
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{example}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>詳細情報（任意）</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keywords">重要なキーワードやテーマ</Label>
              <Input
                id="keywords"
                placeholder="例：AI, 機械学習, 初心者向け"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="mt-1"
              />
              <div className="text-sm text-gray-500 mt-1">
                カンマ区切りでキーワードを入力してください
              </div>
            </div>

            <div>
              <Label htmlFor="scenario">使用する場面やシナリオ</Label>
              <Textarea
                id="scenario"
                placeholder="例：会社のブログでIT初心者向けに技術解説をする"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                rows={2}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="targetAI">使用予定のAI</Label>
              <select
                id="targetAI"
                value={targetAI}
                onChange={(e) => setTargetAI(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {targetAIs.map((ai) => (
                  <option key={ai.id} value={ai.id}>
                    {ai.name} - {ai.description}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {isValid && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">入力内容の確認</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-blue-800">カテゴリー:</span>
                  <span className="ml-2">{selectedCategoryData?.name}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">目的:</span>
                  <span className="ml-2">{purpose}</span>
                </div>
                {keywords && (
                  <div>
                    <span className="font-medium text-blue-800">
                      キーワード:
                    </span>
                    <span className="ml-2">{keywords}</span>
                  </div>
                )}
                {scenario && (
                  <div>
                    <span className="font-medium text-blue-800">シナリオ:</span>
                    <span className="ml-2">{scenario}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="space-y-4 pb-6">
          {!isValid && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <p className="text-amber-800 font-medium">
                ⚠️ 次のステップに進むには以下が必要です：
              </p>
              <div className="mt-2 space-y-1 text-sm text-amber-700">
                {!selectedCategory && <p>• カテゴリーを選択してください</p>}
                {!purpose.trim() && (
                  <p>• 具体的な目的や内容を入力してください</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`px-12 py-4 text-sm font-medium transition-colors ${
                isValid
                  ? "bg-gray-900 hover:bg-gray-800 text-white"
                  : "bg-gray-400 text-gray-300 cursor-not-allowed"
              }`}
            >
              🚀 プロンプト型を提案してもらう →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
