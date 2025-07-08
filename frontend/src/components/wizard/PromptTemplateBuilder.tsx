"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Play,
  Eye,
  Copy,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { PromptGoal, PromptType, PromptInstance } from "../PromptWizard";

interface PromptTemplateBuilderProps {
  type: PromptType;
  goal: PromptGoal;
  onComplete: (instance: PromptInstance) => void;
  onBack: () => void;
}

interface TemplateValues {
  [key: string]: string;
}

// プロンプト構造から変数を抽出する関数
const extractVariables = (structure: Record<string, string>): string[] => {
  const variables = new Set<string>();
  const regex = /\{([^}]+)\}/g;

  Object.values(structure).forEach((text: string) => {
    if (typeof text === "string") {
      let match;
      while ((match = regex.exec(text)) !== null) {
        variables.add(match[1]);
      }
    }
  });

  return Array.from(variables);
};

// 変数をテンプレートに適用してプロンプトを生成
const generatePrompt = (
  structure: Record<string, string>,
  values: TemplateValues
): string => {
  let prompt = "";

  Object.entries(structure).forEach(([, template]: [string, string]) => {
    if (template && typeof template === "string") {
      let processedTemplate = template;
      Object.entries(values).forEach(([variable, value]) => {
        const regex = new RegExp(`\\{${variable}\\}`, "g");
        processedTemplate = processedTemplate.replace(
          regex,
          value || `{${variable}}`
        );
      });
      prompt += processedTemplate + "\n\n";
    }
  });

  return prompt.trim();
};

// Mock AI response generation
const generateMockAIResponse = async (prompt: string): Promise<string> => {
  // 実際の実装では実際のAI APIを呼び出し
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return `これはモックのAI応答です。

実際のプロンプト：
"${prompt}"

に対する応答として、以下のような内容が生成されます：

• 指定された形式に従った構造化された回答
• 具体的で実用的な内容
• 要求された品質レベルでの出力

実際の実装では、選択されたAI（ChatGPT、Claude等）からの実際の応答がここに表示されます。`;
};

export function PromptTemplateBuilder({
  type,
  onComplete,
  onBack,
}: PromptTemplateBuilderProps) {
  const [values, setValues] = useState<TemplateValues>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("build");

  const variables = extractVariables(type.structure);

  // プロンプト生成
  const handleGeneratePrompt = () => {
    const prompt = generatePrompt(type.structure, values);
    setGeneratedPrompt(prompt);
    setActiveTab("preview");
  };

  // AI テスト実行
  const handleTestWithAI = async () => {
    if (!generatedPrompt) {
      handleGeneratePrompt();
      return;
    }

    setIsGenerating(true);
    setActiveTab("test");

    try {
      const response = await generateMockAIResponse(generatedPrompt);
      setAiResponse(response);
    } catch (error) {
      console.error("AI test failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // プロンプト完成
  const handleComplete = () => {
    const instance: PromptInstance = {
      id: Date.now().toString(),
      type,
      values,
      generatedPrompt,
      aiResponse: aiResponse || undefined,
    };
    onComplete(instance);
  };

  // 値の更新
  const updateValue = (variable: string, value: string) => {
    setValues((prev) => ({ ...prev, [variable]: value }));
  };

  // プロンプトをクリップボードにコピー
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
  };

  const filledVariables = variables.filter((v) => values[v]?.trim());
  const completionPercentage =
    variables.length > 0
      ? (filledVariables.length / variables.length) * 100
      : 0;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-600" />
                <span className="text-purple-800">{type.name}の構築</span>
              </div>
              <Badge variant="outline" className="text-purple-600">
                完成度: {Math.round(completionPercentage)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-purple-700">
              <p>
                各要素に具体的な値を入力して、あなた専用のプロンプトを作成しましょう。
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="build" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>構築</span>
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>プレビュー</span>
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>テスト</span>
            </TabsTrigger>
          </TabsList>

          {/* Build Tab */}
          <TabsContent value="build" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Fields */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  変数を入力してください
                </h3>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {variables.map((variable) => {
                    const isRequired =
                      variable.includes("目的") ||
                      variable.includes("タスク") ||
                      variable.includes("専門分野");
                    return (
                      <Card key={variable}>
                        <CardHeader className="pb-3">
                          <Label className="flex items-center space-x-2">
                            <span>{variable}</span>
                            {isRequired && (
                              <span className="text-red-500">*</span>
                            )}
                            {values[variable] && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </Label>
                        </CardHeader>
                        <CardContent>
                          {variable.includes("例") ||
                          variable.includes("詳細") ||
                          variable.includes("説明") ? (
                            <Textarea
                              value={values[variable] || ""}
                              onChange={(e) =>
                                updateValue(variable, e.target.value)
                              }
                              placeholder={`${variable}を入力してください...`}
                              rows={3}
                            />
                          ) : (
                            <Input
                              value={values[variable] || ""}
                              onChange={(e) =>
                                updateValue(variable, e.target.value)
                              }
                              placeholder={`${variable}を入力してください...`}
                            />
                          )}

                          {/* 入力支援 */}
                          {variable === "専門分野" && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {[
                                "マーケティング",
                                "エンジニアリング",
                                "デザイン",
                                "営業",
                                "人事",
                              ].map((suggestion) => (
                                <Button
                                  key={suggestion}
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateValue(variable, suggestion)
                                  }
                                  className="text-xs"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}

                          {variable === "トーン" && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {[
                                "フォーマル",
                                "カジュアル",
                                "親しみやすい",
                                "専門的",
                                "説明的",
                              ].map((suggestion) => (
                                <Button
                                  key={suggestion}
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateValue(variable, suggestion)
                                  }
                                  className="text-xs"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Live Preview */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  リアルタイムプレビュー
                </h3>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      生成されるプロンプト
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap text-gray-700">
                        {generatePrompt(type.structure, values) ||
                          "まだ変数が入力されていません..."}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={handleGeneratePrompt}
                    disabled={filledVariables.length === 0}
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    プレビューで確認
                  </Button>
                  <Button
                    onClick={handleTestWithAI}
                    disabled={filledVariables.length === 0}
                    variant="outline"
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    AIでテスト
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>完成したプロンプト</span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      disabled={!generatedPrompt}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      コピー
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleTestWithAI}
                      disabled={!generatedPrompt}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      AIでテスト
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">
                    {generatedPrompt ||
                      "プロンプトが生成されていません。「構築」タブで変数を入力してください。"}
                  </pre>
                </div>

                {generatedPrompt && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-800 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">プロンプト情報</span>
                    </div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>文字数: {generatedPrompt.length} 文字</p>
                      <p>変数数: {variables.length} 個</p>
                      <p>
                        入力済み: {filledVariables.length} / {variables.length}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Tab */}
          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AIテスト実行</CardTitle>
              </CardHeader>
              <CardContent>
                {!generatedPrompt ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      まずプロンプトを生成してください
                    </p>
                    <Button
                      onClick={handleGeneratePrompt}
                      className="mt-4"
                      disabled={filledVariables.length === 0}
                    >
                      プロンプトを生成
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Input Prompt */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        入力プロンプト:
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap text-gray-700">
                          {generatedPrompt}
                        </pre>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <span>AI応答:</span>
                        {isGenerating && (
                          <Clock className="h-4 w-4 animate-spin" />
                        )}
                      </h4>

                      {isGenerating ? (
                        <div className="bg-blue-50 p-6 rounded-lg text-center">
                          <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-pulse" />
                          <p className="text-blue-700">AIが応答を生成中...</p>
                          <p className="text-sm text-blue-600 mt-2">
                            しばらくお待ちください
                          </p>
                        </div>
                      ) : aiResponse ? (
                        <div className="bg-white border border-gray-200 p-4 rounded-lg max-h-64 overflow-y-auto">
                          <pre className="text-sm whitespace-pre-wrap text-gray-800">
                            {aiResponse}
                          </pre>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Button
                            onClick={handleTestWithAI}
                            className="flex items-center space-x-2"
                          >
                            <Play className="h-4 w-4" />
                            <span>AIでテスト実行</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 font-medium px-6 py-2"
          >
            ← 型選択に戻る
          </Button>

          {!generatedPrompt && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-amber-800 text-sm font-medium">
                ⚠️ プロンプトを生成してください
              </p>
            </div>
          )}

          <Button
            onClick={handleComplete}
            disabled={!generatedPrompt}
            className={`flex items-center space-x-2 px-8 py-3 font-medium transition-colors ${
              generatedPrompt
                ? "bg-gray-900 hover:bg-gray-800 text-white"
                : "bg-gray-400 text-gray-300 cursor-not-allowed"
            }`}
          >
            <span>✅ 次のステップ：AIでテスト実行 →</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
