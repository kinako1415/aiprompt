"use client";

import { useState } from "react";
import { PromptGoalInput } from "./wizard/PromptGoalInput";
import { PromptTypeSelection } from "./wizard/PromptTypeSelection";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronLeft, Target, Sparkles } from "lucide-react";

// 型定義
export interface PromptGoal {
  purpose: string;
  keywords?: string;
  scenario?: string;
  category: string;
  targetAI: string;
}

export interface PromptType {
  id: string;
  name: string;
  description: string;
  structure: {
    purpose: string;
    persona: string;
    context: string;
    constraints: string;
    outputFormat: string;
    examples: string;
  };
  useCases: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  rating: number;
  usageCount: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  variables: PromptVariable[];
  metadata: {
    category: string;
    difficulty: string;
    rating: number;
    usageCount: number;
  };
}

export interface PromptVariable {
  name: string;
  type: "text" | "number" | "select" | "textarea" | "file" | "date";
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: RegExp;
  description?: string;
  defaultValue?: string;
}

export interface ExecutionResult {
  id: string;
  promptText: string;
  aiService: string;
  output: string;
  timestamp: Date;
  cost?: number;
  executionTime?: number;
  parameters?: Record<string, string | number | boolean>;
}

export interface Feedback {
  executionId: string;
  overallRating: 1 | 2 | 3 | 4 | 5;
  emotionRating: "positive" | "neutral" | "negative";
  aspectRatings: {
    accuracy: number;
    usefulness: number;
    creativity: number;
    readability: number;
  };
  textHighlights: TextHighlight[];
  comment?: string;
  suggestedImprovements?: string;
}

export interface TextHighlight {
  startIndex: number;
  endIndex: number;
  sentiment: "positive" | "negative";
  comment?: string;
}

export interface PromptInstance {
  id: string;
  type: PromptType;
  values: Record<string, string>;
  generatedPrompt: string;
  aiResponse?: string;
}

// ステップ定義
const wizardSteps = [
  {
    id: 1,
    name: "目的入力",
    description: "プロンプトの目的を設定",
    icon: Target,
    completed: false,
  },
  {
    id: 2,
    name: "型選択",
    description: "AI提案から型を選択",
    icon: Sparkles,
    completed: false,
  },
];

interface PromptWizardProps {
  onComplete?: (template: PromptTemplate) => void;
  onCancel?: () => void;
}

export function PromptWizard({ onComplete, onCancel }: PromptWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState(wizardSteps);

  // データ状態
  const [promptGoal, setPromptGoal] = useState<PromptGoal | null>(null);

  // プログレス計算
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  // ステップ完了の更新
  const markStepCompleted = (stepId: number) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  // ステップ1: 目的入力完了
  const handleGoalComplete = (goal: PromptGoal) => {
    setPromptGoal(goal);
    markStepCompleted(1);
    setCurrentStep(2);
  };

  // ステップ2: 型選択完了（最終ステップ）
  const handleTypeSelect = (type: PromptType) => {
    markStepCompleted(2);

    // プロンプトコンテンツから変数を抽出
    const content = Object.values(type.structure).join("\n\n");
    const variables = extractVariables(content);

    // 選択された型からPromptTemplateを作成
    const template: PromptTemplate = {
      id: Date.now().toString(),
      name: type.name,
      content,
      variables,
      metadata: {
        category: type.useCases[0] || "general",
        difficulty: type.difficulty,
        rating: type.rating,
        usageCount: type.usageCount,
      },
    };

    // 完了処理
    if (onComplete) {
      onComplete(template);
    }
  };

  // プロンプトコンテンツから変数を抽出する関数
  const extractVariables = (content: string): PromptVariable[] => {
    const variablePattern = /\{([^}]+)\}/g;
    const variables: PromptVariable[] = [];
    const foundVariables = new Set<string>();

    let match;
    while ((match = variablePattern.exec(content)) !== null) {
      const variableName = match[1];
      if (!foundVariables.has(variableName)) {
        foundVariables.add(variableName);
        variables.push({
          name: variableName,
          description: `${variableName}の値を入力してください`,
          type: "text",
          required: true,
        });
      }
    }

    return variables;
  };

  // 前のステップに戻る
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ステップのレンダリング
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PromptGoalInput
            onComplete={handleGoalComplete}
            initialData={promptGoal}
          />
        );
      case 2:
        return promptGoal ? (
          <PromptTypeSelection
            goal={promptGoal}
            onSelect={handleTypeSelect}
            onBack={handleBack}
          />
        ) : null;
      default:
        return null;
    }
  };

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
                onClick={onCancel}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>戻る</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h1 className="text-lg font-semibold text-gray-900">
                  AI支援プロンプト作成
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-600">
                ステップ {currentStep} / {steps.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* プログレスセクション */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="space-y-4">
            {/* プログレスバー */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">進捗</span>
                <span className="text-sm text-gray-500">
                  {Math.round(progress)}% 完了
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            {/* ステップナビゲーション */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = step.id === currentStep;
                  const isCompleted = step.completed;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : isCompleted
                          ? "bg-green-100 text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <div className="hidden sm:block">
                        <div className="text-sm font-medium">{step.name}</div>
                        <div className="text-xs opacity-75">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1">{renderStep()}</div>
    </div>
  );
}
