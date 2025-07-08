"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Play,
  Copy,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { PromptTemplate, ExecutionResult } from "../PromptWizard";

interface PromptTestingProps {
  template: PromptTemplate;
  onComplete: (results: ExecutionResult[]) => void;
  onBack: () => void;
}

interface AIService {
  id: string;
  name: string;
  description: string;
  available: boolean;
  cost?: string;
}

const aiServices: AIService[] = [
  {
    id: "chatgpt",
    name: "ChatGPT (GPT-4)",
    description: "汎用的で高性能な会話AI",
    available: true,
    cost: "約$0.03/1K tokens",
  },
  {
    id: "claude",
    name: "Claude (Anthropic)",
    description: "長文処理と安全性に優れたAI",
    available: true,
    cost: "約$0.015/1K tokens",
  },
  {
    id: "gemini",
    name: "Gemini Pro",
    description: "マルチモーダル対応のGoogle AI",
    available: true,
    cost: "無料枠あり",
  },
];

// Mock AI response generation
const generateMockAIResponse = async (
  prompt: string,
  service: string
): Promise<string> => {
  await new Promise((resolve) =>
    setTimeout(resolve, 2000 + Math.random() * 2000)
  );

  const responses = {
    chatgpt: `【ChatGPT応答】

${prompt}

上記のプロンプトに対して、ChatGPTから以下のような応答が生成されます：

• 指定された構造に従った詳細な回答
• 創造性と正確性のバランスが取れた内容
• ユーザーの要求に合わせた適切なトーンとスタイル

この応答は実際のAPIを使用した場合の典型的な出力例です。実装時には実際のOpenAI APIが呼び出されます。

品質評価：★★★★☆
実用性：★★★★★
創造性：★★★★☆`,

    claude: `【Claude応答】

プロンプト: "${prompt}"

Claudeの特徴を活かした応答として：

1. 安全で倫理的な内容の確保
2. 長文に対する優れた理解と処理
3. 文脈に沿った一貫性のある回答
4. 詳細で構造化された説明

実際のClaude APIを使用した場合、より詳細で思慮深い応答が得られます。特に複雑な推論や分析タスクで優れた性能を発揮します。

信頼性：★★★★★
詳細度：★★★★★
安全性：★★★★★`,

    gemini: `【Gemini Pro応答】

入力プロンプト分析完了。

Gemini Proの強みを活かした応答：

• マルチモーダル理解（テキスト、画像、音声）
• リアルタイム情報との連携
• 効率的な処理とコスト効率
• Google検索との統合可能性

"${prompt}"

に対する応答では、最新の情報と包括的な視点を組み合わせた回答を提供します。

効率性：★★★★★
情報の新しさ：★★★★★
統合性：★★★★☆`,
  };

  return (
    responses[service as keyof typeof responses] ||
    `${service}からの模擬応答です。`
  );
};

export function PromptTesting({
  template,
  onComplete,
  onBack,
}: PromptTestingProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "chatgpt",
  ]);
  const [executionResults, setExecutionResults] = useState<ExecutionResult[]>(
    []
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState("setup");

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleExecuteAll = async () => {
    setIsExecuting(true);
    setActiveTab("results");

    const newResults: ExecutionResult[] = [];

    for (const serviceId of selectedServices) {
      const service = aiServices.find((s) => s.id === serviceId);
      if (!service) continue;

      try {
        const startTime = Date.now();
        const response = await generateMockAIResponse(
          template.content,
          serviceId
        );
        const endTime = Date.now();

        const result: ExecutionResult = {
          id: `${serviceId}-${Date.now()}-${Math.random()}`,
          promptText: template.content,
          aiService: service.name,
          output: response,
          timestamp: new Date(),
          executionTime: endTime - startTime,
          cost: Math.random() * 0.1 + 0.01, // Mock cost
        };

        newResults.push(result);
        setExecutionResults((prev) => [...prev, result]);

        // 少し待ってから次のサービスを実行
        if (selectedServices.indexOf(serviceId) < selectedServices.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Failed to execute with ${service.name}:`, error);
      }
    }

    setIsExecuting(false);
  };

  const handleCopyResult = (result: ExecutionResult) => {
    navigator.clipboard.writeText(result.output);
  };

  const handleRetryExecution = () => {
    setExecutionResults([]);
    handleExecuteAll();
  };

  const handleComplete = () => {
    onComplete(executionResults);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <Play className="h-5 w-5" />
              <span>プロンプトテスト実行</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-700">
              <p>
                作成したプロンプトを複数のAIサービスで実行し、結果を比較検証します。
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="setup"
              className="flex items-center space-x-2 font-medium data-[state=active]:bg-gray-900 data-[state=active]:text-white transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>⚙️ 実行設定</span>
            </TabsTrigger>
            <TabsTrigger
              value="prompt"
              className="flex items-center space-x-2 font-medium data-[state=active]:bg-gray-900 data-[state=active]:text-white transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>📋 プロンプト確認</span>
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="flex items-center space-x-2 font-medium data-[state=active]:bg-gray-900 data-[state=active]:text-white transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>📊 実行結果</span>
            </TabsTrigger>
          </TabsList>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AIサービス選択</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    プロンプトを実行するAIサービスを選択してください。複数選択可能です。
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {aiServices.map((service) => (
                      <Card
                        key={service.id}
                        className={`cursor-pointer transition-all ${
                          selectedServices.includes(service.id)
                            ? "ring-2 ring-blue-500 bg-blue-50"
                            : service.available
                            ? "hover:bg-gray-50"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={() =>
                          service.available && handleServiceToggle(service.id)
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {service.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {service.description}
                              </p>
                            </div>
                            {selectedServices.includes(service.id) && (
                              <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 ml-2" />
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {service.cost}
                            </span>
                            <Badge
                              variant={
                                service.available ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {service.available ? "利用可能" : "準備中"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={handleExecuteAll}
                      disabled={selectedServices.length === 0 || isExecuting}
                      size="lg"
                      className={`flex items-center space-x-2 px-8 py-3 font-medium transition-colors ${
                        selectedServices.length === 0 || isExecuting
                          ? "bg-gray-400 text-gray-300 cursor-not-allowed"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                      }`}
                    >
                      {isExecuting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          <span>🚀 実行中...</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5" />
                          <span>
                            🎯 AIでプロンプトをテスト実行（
                            {selectedServices.length}サービス）
                          </span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prompt Tab */}
          <TabsContent value="prompt" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>実行するプロンプト</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigator.clipboard.writeText(template.content)
                    }
                    className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 font-medium"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    📋 コピー
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">
                    {template.content}
                  </pre>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">プロンプト情報</span>
                  </div>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>文字数: {template.content.length} 文字</p>
                    <p>変数数: {template.variables.length} 個</p>
                    <p>カテゴリー: {template.metadata.category}</p>
                    <p>難易度: {template.metadata.difficulty}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {isExecuting && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
                  <p className="text-blue-800 font-medium">
                    AIサービスで実行中...
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    {executionResults.length} / {selectedServices.length} 完了
                  </p>
                </CardContent>
              </Card>
            )}

            {executionResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    実行結果 ({executionResults.length}件)
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetryExecution}
                    disabled={isExecuting}
                    className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 font-medium"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>🔄 再実行</span>
                  </Button>
                </div>

                {executionResults.map((result, index) => (
                  <Card key={result.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span>{result.aiService}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {result.executionTime}ms
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyResult(result)}
                            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 font-medium"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white border border-gray-200 p-4 rounded-lg max-h-64 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800">
                          {result.output}
                        </pre>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <span>
                          実行時刻: {result.timestamp.toLocaleString()}
                        </span>
                        {result.cost && (
                          <span>コスト: ${result.cost.toFixed(4)}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isExecuting && executionResults.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">まだ実行されていません</p>
                  <p className="text-sm text-gray-500 mt-2">
                    「実行設定」タブでAIサービスを選択して実行してください
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 font-medium px-6 py-2"
          >
            ← 構築に戻る
          </Button>

          {executionResults.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-amber-800 text-sm font-medium">
                ⚠️ AIテストを実行してください
              </p>
            </div>
          )}

          <Button
            onClick={handleComplete}
            disabled={executionResults.length === 0}
            className={`flex items-center space-x-2 px-8 py-3 font-medium transition-colors ${
              executionResults.length === 0
                ? "bg-gray-400 text-gray-300 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            }`}
          >
            <span>🎯 次のステップ：結果を評価 →</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
