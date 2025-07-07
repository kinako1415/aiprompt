import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Lightbulb,
  CheckCircle,
  Target,
  TrendingUp,
  Save
} from 'lucide-react';
import { ExecutionResult, PromptTemplate, Feedback } from '../PromptWizard';

interface FeedbackCollectionProps {
  results: ExecutionResult[];
  template: PromptTemplate;
  onComplete: (feedback: Feedback) => void;
  onBack: () => void;
}

interface AspectRating {
  accuracy: number;
  usefulness: number;
  creativity: number;
  readability: number;
}

interface TextHighlight {
  resultId: string;
  startIndex: number;
  endIndex: number;
  sentiment: 'positive' | 'negative';
  comment?: string;
}

export function FeedbackCollection({ results, onComplete, onBack }: FeedbackCollectionProps) {
  const [selectedResult, setSelectedResult] = useState<ExecutionResult | null>(results[0] || null);
  const [overallRating, setOverallRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [emotionRating, setEmotionRating] = useState<'positive' | 'neutral' | 'negative'>('positive');
  const [aspectRatings, setAspectRatings] = useState<AspectRating>({
    accuracy: 5,
    usefulness: 5,
    creativity: 4,
    readability: 5
  });
  const [textHighlights, setTextHighlights] = useState<TextHighlight[]>([]);
  const [comment, setComment] = useState('');
  const [suggestedImprovements, setSuggestedImprovements] = useState('');
  const [activeTab, setActiveTab] = useState('rating');

  const handleAspectRatingChange = (aspect: keyof AspectRating, rating: number) => {
    setAspectRatings(prev => ({
      ...prev,
      [aspect]: rating
    }));
  };

  const handleTextSelection = () => {
    if (!selectedResult) return;
    
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) return;
    
    const selectedText = selection.toString();
    
    // 簡単な実装 - 実際にはより精密な位置計算が必要
    const highlight: TextHighlight = {
      resultId: selectedResult.id,
      startIndex: 0, // 実際の実装では正確な位置を計算
      endIndex: selectedText.length,
      sentiment: 'positive',
      comment: ''
    };
    
    setTextHighlights(prev => [...prev, highlight]);
    selection.removeAllRanges();
  };

  const handleRemoveHighlight = (index: number) => {
    setTextHighlights(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitFeedback = () => {
    if (!selectedResult) return;
    
    const feedback: Feedback = {
      executionId: selectedResult.id,
      overallRating,
      emotionRating,
      aspectRatings,
      textHighlights: textHighlights.map(h => ({
        startIndex: h.startIndex,
        endIndex: h.endIndex,
        sentiment: h.sentiment,
        comment: h.comment
      })),
      comment: comment.trim() || undefined,
      suggestedImprovements: suggestedImprovements.trim() || undefined
    };
    
    onComplete(feedback);
  };

  const renderStarRating = (value: number, onChange: (rating: number) => void, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'h-8 w-8' : 'h-5 w-5';
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`${sizeClass} cursor-pointer transition-colors ${
              star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          >
            <Star className="w-full h-full" />
          </button>
        ))}
      </div>
    );
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const aspectLabels = {
    accuracy: '正確性',
    usefulness: '実用性',
    creativity: '創造性',
    readability: '読みやすさ'
  };

  const averageRating = Object.values(aspectRatings).reduce((sum, rating) => sum + rating, 0) / 4;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <Target className="h-5 w-5" />
              <span>実行結果の評価とフィードバック</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-orange-700">
              <p>AIの実行結果を評価し、プロンプトの改善点を特定します。</p>
            </div>
          </CardContent>
        </Card>

        {/* Result Selection */}
        <Card>
          <CardHeader>
            <CardTitle>評価する結果を選択</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.map((result, index) => (
                <Card
                  key={result.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedResult?.id === result.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedResult(result)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      {selectedResult?.id === result.id && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {result.aiService}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {result.output.slice(0, 100)}...
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      {result.executionTime}ms
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedResult && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rating" className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>評価</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>分析</span>
              </TabsTrigger>
              <TabsTrigger value="improvements" className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>改善提案</span>
              </TabsTrigger>
            </TabsList>

            {/* Rating Tab */}
            <TabsContent value="rating" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Result Display */}
                <Card>
                  <CardHeader>
                    <CardTitle>実行結果</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto cursor-text"
                      onMouseUp={handleTextSelection}
                    >
                      <pre className="whitespace-pre-wrap text-sm text-gray-800">
                        {selectedResult.output}
                      </pre>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      テキストを選択してハイライトできます
                    </p>
                  </CardContent>
                </Card>

                {/* Rating Panel */}
                <div className="space-y-6">
                  {/* Overall Rating */}
                  <Card>
                    <CardHeader>
                      <CardTitle>総合評価</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        {renderStarRating(overallRating, (rating) => setOverallRating(rating as 1 | 2 | 3 | 4 | 5), 'lg')}
                        <p className="text-sm text-gray-600 mt-2">
                          {overallRating === 5 ? '非常に満足' :
                           overallRating === 4 ? '満足' :
                           overallRating === 3 ? '普通' :
                           overallRating === 2 ? '不満' : '非常に不満'}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">感情的な印象</Label>
                        <div className="flex items-center space-x-4 mt-2">
                          {(['positive', 'neutral', 'negative'] as const).map((emotion) => (
                            <button
                              key={emotion}
                              onClick={() => setEmotionRating(emotion)}
                              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                                emotionRating === emotion
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {getEmotionIcon(emotion)}
                              <span className="text-sm">
                                {emotion === 'positive' ? 'ポジティブ' :
                                 emotion === 'neutral' ? 'ニュートラル' : 'ネガティブ'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Aspect Ratings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>詳細評価</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(aspectRatings).map(([aspect, rating]) => (
                        <div key={aspect} className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            {aspectLabels[aspect as keyof AspectRating]}
                          </Label>
                          {renderStarRating(rating, (newRating) => handleAspectRatingChange(aspect as keyof AspectRating, newRating))}
                        </div>
                      ))}
                      
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">平均評価</span>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{averageRating.toFixed(1)}/5</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Highlights */}
              {textHighlights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>ハイライト</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {textHighlights.map((highlight, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant={highlight.sentiment === 'positive' ? 'default' : 'destructive'}>
                                {highlight.sentiment === 'positive' ? 'ポジティブ' : 'ネガティブ'}
                              </Badge>
                            </div>
                            {highlight.comment && (
                              <p className="text-sm text-gray-600">{highlight.comment}</p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveHighlight(index)}
                          >
                            削除
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>詳細分析とコメント</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="comment">全体的な感想・コメント</Label>
                    <Textarea
                      id="comment"
                      placeholder="この結果についての詳細な感想や気づいた点を記入してください..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2 flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        良かった点
                      </h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• 要求した形式に正確に従っている</li>
                        <li>• 具体的で実用的な内容</li>
                        <li>• 読みやすい構造</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2 flex items-center">
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        改善が必要な点
                      </h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• より具体的な例が欲しい</li>
                        <li>• 専門用語の説明不足</li>
                        <li>• 文章が長すぎる部分がある</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Improvements Tab */}
            <TabsContent value="improvements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>改善提案</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="improvements">プロンプトの改善案</Label>
                    <Textarea
                      id="improvements"
                      placeholder="より良い結果を得るために、プロンプトをどのように改善すべきか提案してください..."
                      value={suggestedImprovements}
                      onChange={(e) => setSuggestedImprovements(e.target.value)}
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      改善のヒント
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• より具体的な指示を追加する</li>
                      <li>• 出力形式をより詳細に指定する</li>
                      <li>• 例文や参考資料を含める</li>
                      <li>• 対象読者を明確にする</li>
                      <li>• 制約条件を細かく設定する</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Summary */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">フィードバック概要</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-800">総合評価:</span>
                <div className="flex items-center space-x-1 mt-1">
                  {renderStarRating(overallRating, () => {}, 'sm')}
                  <span className="ml-2 text-green-700">{overallRating}/5</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-green-800">平均詳細評価:</span>
                <p className="text-green-700 mt-1">{averageRating.toFixed(1)}/5</p>
              </div>
              <div>
                <span className="font-medium text-green-800">評価対象:</span>
                <p className="text-green-700 mt-1">{selectedResult?.aiService}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pb-6">
          <Button variant="outline" onClick={onBack}>
            テスト実行に戻る
          </Button>
          
          <Button
            onClick={handleSubmitFeedback}
            disabled={!selectedResult}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>フィードバックを保存して完了</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
