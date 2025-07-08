"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Sparkles,
  Star,
  Users,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { PromptGoal, PromptType } from "../PromptWizard";

interface PromptTypeSelectionProps {
  goal: PromptGoal;
  onSelect: (type: PromptType) => void;
  onBack: () => void;
}

// モックデータ - 実際の実装では AIが動的に生成
const generatePromptTypes = (): PromptType[] => {
  const baseTypes: PromptType[] = [
    {
      id: "structured-content",
      name: "構造化コンテンツ型",
      description: "明確な構造と段階的な指示で高品質なコンテンツを生成",
      structure: {
        purpose: "あなたは経験豊富な{専門分野}の専門家です。",
        persona: "{対象読者}向けに{コンテンツタイプ}を作成してください。",
        context:
          "以下の条件を満たす必要があります：\n- {条件1}\n- {条件2}\n- {条件3}",
        constraints:
          "制約事項：\n- 文字数: {文字数}\n- トーン: {トーン}\n- 形式: {形式}",
        outputFormat:
          "以下の構成で出力してください：\n## {セクション1}\n## {セクション2}\n## {セクション3}",
        examples: "参考例：\n{例1}\n{例2}",
      },
      useCases: ["ブログ記事", "技術文書", "マーケティング資料", "レポート"],
      difficulty: "intermediate",
      rating: 4.8,
      usageCount: 1247,
    },
    {
      id: "persona-driven",
      name: "ペルソナ駆動型",
      description: "特定の役割や専門性を強調してより専門的な回答を引き出す",
      structure: {
        purpose: "{タスクの説明}",
        persona:
          "あなたは{経験年数}年の経験を持つ{職業}です。{専門知識}に精通しており、{得意分野}を専門としています。",
        context: "{背景情報}について、{対象者}のために説明してください。",
        constraints: "以下の点に注意してください：\n- {注意点1}\n- {注意点2}",
        outputFormat: "{出力形式の指定}",
        examples: "例：{具体例}",
      },
      useCases: [
        "専門的な解説",
        "コンサルティング",
        "教育コンテンツ",
        "アドバイス",
      ],
      difficulty: "beginner",
      rating: 4.6,
      usageCount: 892,
    },
    {
      id: "step-by-step",
      name: "ステップ・バイ・ステップ型",
      description: "段階的な思考プロセスを促して論理的で詳細な回答を得る",
      structure: {
        purpose: "{目標の説明}",
        persona:
          "あなたは{分野}の専門家として、論理的で段階的な分析を行ってください。",
        context: "課題: {課題の詳細}",
        constraints:
          "以下の手順で分析してください：\n1. 現状分析\n2. 問題の特定\n3. 解決策の検討\n4. 推奨案の提示",
        outputFormat:
          "各ステップごとに詳細を記載し、最後に結論をまとめてください。",
        examples: "ステップ1の例：{例1}\nステップ2の例：{例2}",
      },
      useCases: ["問題解決", "プロセス設計", "システム分析", "戦略立案"],
      difficulty: "intermediate",
      rating: 4.7,
      usageCount: 654,
    },
    {
      id: "creative-framework",
      name: "クリエイティブフレームワーク型",
      description: "創造性を最大化するための自由度の高い構造",
      structure: {
        purpose: "{創作の目的}",
        persona: "あなたは創造力豊かな{クリエイター種別}です。",
        context: "テーマ: {テーマ}\nムード: {ムード}\nスタイル: {スタイル}",
        constraints: "制約：\n- {制約1}\n- {制約2}",
        outputFormat: "自由な形式で表現してください。",
        examples: "インスピレーション：{参考例}",
      },
      useCases: ["創作活動", "アイデア発想", "ストーリーテリング", "デザイン"],
      difficulty: "beginner",
      rating: 4.5,
      usageCount: 423,
    },
  ];

  // goal に基づいて適切な型を選択・カスタマイズ
  return baseTypes.slice(0, 3).map((type) => ({
    ...type,
    rating: type.rating + (Math.random() - 0.5) * 0.4, // 若干のバリエーション
    usageCount: type.usageCount + Math.floor(Math.random() * 200),
  }));
};

export function PromptTypeSelection({
  goal,
  onSelect,
  onBack,
}: PromptTypeSelectionProps) {
  const [promptTypes] = useState<PromptType[]>(() => generatePromptTypes());
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedType = promptTypes.find((type) => type.id === selectedTypeId);

  const handleRegenerateTypes = async () => {
    setLoading(true);
    // 実際の実装では API を呼び出し
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "初級";
      case "intermediate":
        return "中級";
      case "advanced":
        return "上級";
      default:
        return "不明";
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Sparkles className="h-5 w-5" />
              <span>あなたにおすすめのプロンプト型</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-700">
              <p className="mb-2">
                <strong>目的:</strong> {goal.purpose}
              </p>
              <p>
                <strong>カテゴリー:</strong> {goal.category}
                {goal.keywords && (
                  <>
                    <span className="mx-2">•</span>
                    <strong>キーワード:</strong> {goal.keywords}
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            プロンプト型を選択してください
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerateTypes}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>別の型を提案</span>
          </Button>
        </div>

        {/* Prompt Types */}
        <div className="space-y-4">
          {promptTypes.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedTypeId === type.id
                  ? "ring-2 ring-blue-500 bg-blue-50 border-blue-300"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedTypeId(type.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-lg text-gray-900">
                        {type.name}
                      </h4>
                      <Badge className={getDifficultyColor(type.difficulty)}>
                        {getDifficultyText(type.difficulty)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{type.description}</p>
                  </div>

                  {selectedTypeId === type.id && (
                    <CheckCircle className="h-6 w-6 text-blue-500 flex-shrink-0 ml-4" />
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{type.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{type.usageCount.toLocaleString()}回使用</span>
                  </div>
                </div>

                {/* Use Cases */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    適用例：
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {type.useCases.map((useCase, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Preview Structure */}
                {selectedTypeId === type.id && (
                  <div className="border-t pt-4 mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      プロンプト構造のプレビュー：
                    </h5>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      {Object.entries(type.structure)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium text-gray-600">
                              {key}:
                            </span>
                            <div className="text-gray-700 mt-1 pl-2">
                              {typeof value === "string"
                                ? value.slice(0, 100) +
                                  (value.length > 100 ? "..." : "")
                                : ""}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selection Summary */}
        {selectedType && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>選択したプロンプト型</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-700">
                <p>
                  <strong>{selectedType.name}</strong> を選択しました。
                </p>
                <p className="mt-1">{selectedType.description}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pb-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 font-medium px-6 py-2"
          >
            ← 目的入力に戻る
          </Button>

          {!selectedType && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-amber-800 text-sm font-medium">
                ⚠️ プロンプト型を選択してください
              </p>
            </div>
          )}

          <Button
            onClick={() => selectedType && onSelect(selectedType)}
            disabled={!selectedType}
            className={`flex items-center space-x-2 px-8 py-3 font-medium transition-colors ${
              selectedType
                ? "bg-gray-900 hover:bg-gray-800 text-white"
                : "bg-gray-400 text-gray-300 cursor-not-allowed"
            }`}
          >
            <span>🔧 この型でプロンプトを構築 →</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
