'use client';

import { useState } from 'react';
import { PromptGoalInput } from './wizard/PromptGoalInput';
import { PromptTypeSelection } from './wizard/PromptTypeSelection';
import { PromptTemplateBuilder } from './wizard/PromptTemplateBuilder';
import { PromptTesting } from './wizard/PromptTesting';
import { FeedbackCollection } from './wizard/FeedbackCollection';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ChevronLeft, 
  Target, 
  Sparkles, 
  Settings,
  Play,
  MessageSquare,
} from "lucide-react";

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
  type: "text" | "number" | "select" | "file" | "date";
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: RegExp;
  description?: string;
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
  {
    id: 3,
    name: "構築",
    description: "プロンプトを構築",
    icon: Settings,
    completed: false,
  },
  {
    id: 4,
    name: "実行・テスト",
    description: "AIで実行してテスト",
    icon: Play,
    completed: false,
  },
  {
    id: 5,
    name: "フィードバック",
    description: "結果を評価して改善",
    icon: MessageSquare,
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
  const [selectedType, setSelectedType] = useState<PromptType | null>(null);
  const [builtTemplate, setBuiltTemplate] = useState<PromptTemplate | null>(
    null
  );
  const [executionResults, setExecutionResults] = useState<ExecutionResult[]>(
    []
  );

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

  // ステップ2: 型選択完了
  const handleTypeSelect = (type: PromptType) => {
    setSelectedType(type);
    markStepCompleted(2);
    setCurrentStep(3);
  };

  // ステップ3: テンプレート構築完了
  const handleTemplateBuilt = (instance: PromptInstance) => {
    // PromptInstanceからPromptTemplateを作成
    const template: PromptTemplate = {
      id: instance.id,
      name: instance.type.name,
      content: instance.generatedPrompt,
      variables: [], // 実際の実装では適切に変換
      metadata: {
        category: instance.type.useCases[0] || 'general',
        difficulty: instance.type.difficulty,
        rating: instance.type.rating,
        usageCount: instance.type.usageCount
      }
    };
    setBuiltTemplate(template);
    markStepCompleted(3);
    setCurrentStep(4);
  };

  // ステップ4: 実行完了
  const handleExecutionComplete = (results: ExecutionResult[]) => {
    setExecutionResults(results);
    markStepCompleted(4);
    setCurrentStep(5);
  };  // ステップ5: フィードバック完了
  const handleFeedbackComplete = (feedback: Feedback) => {
    markStepCompleted(5);
    
    // フィードバックをテンプレートに統合する（必要に応じて）
    console.log('収集されたフィードバック:', feedback);
    
    // 最終的なテンプレートを返す
    if (builtTemplate && onComplete) {
      onComplete(builtTemplate);
    }
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
      case 3:
        return selectedType && promptGoal ? (
          <PromptTemplateBuilder
            type={selectedType}
            goal={promptGoal}
            onComplete={handleTemplateBuilt}
            onBack={handleBack}
          />
        ) : null;
      case 4:
        return builtTemplate ? (
          <PromptTesting
            template={builtTemplate}
            onComplete={handleExecutionComplete}
            onBack={handleBack}
          />
        ) : null;
      case 5:
        return executionResults.length > 0 && builtTemplate ? (
          <FeedbackCollection
            results={executionResults}
            template={builtTemplate}
            onComplete={handleFeedbackComplete}
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
